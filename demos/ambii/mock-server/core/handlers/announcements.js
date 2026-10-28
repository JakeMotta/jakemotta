// /v3/api/announcement, /v3/api/voices, /v3/auth/announcement*: in-store messages ("ISMs").
// Seeded ones point at pre-rendered MP3s. Ones created or previewed in the demo get a URL under
// API_BASE/tts/ and are spoken by the browser (speakAnnouncement); uploaded MP3s live in IndexedDB
// and are served at API_BASE/media/<id>.mp3.
import { send } from '../envelope.js';
import { clone, pick, stamp, newId, hash32 } from '../util.js';
import { VOICES, normalizeLanguage } from '../voices.js';
import { mp3Duration } from '../mp3.js';
import { BED_MEDIA } from '../bed-data.js';
import { API_BASE } from '../../config.js';

// The server mixed the voice over its music bed with 3 s of bed before it and 3 s after it
// (controllers/announcement.js, announcementBackgroundMusic), and stored the mixed file's length as the
// duration. browser/tts.js plays the demo's beds on the same timeline (its BED_TIMING starts from these).
export var BED_LEAD_SECONDS = 3;
export var BED_TAIL_SECONDS = 3;

export function ttsUrl(id) {
  return API_BASE + '/tts/' + id;
}

export function mediaUrl(id) {
  return API_BASE + '/media/' + id + '.mp3';
}

// Speech length estimate for browser-spoken announcements (about 2.6 words a second at speed 1).
export function estimateSpeechSeconds(message, speed) {
  var words = String(message || '').trim().split(/\s+/).filter(Boolean).length;
  var rate = Number(speed) > 0 ? Number(speed) : 1;
  return Math.max(2, Math.round((words / 2.6 / rate) * 10) / 10);
}

// True when a backgroundMusic value names one of the demo's beds (2..6; 1 is "No Music").
export function hasBed(backgroundMusic) {
  var n = Number(backgroundMusic);
  return n > 1 && !!BED_MEDIA[n];
}

// How long a browser-spoken announcement lasts, as speakAnnouncement() plays it: the words, plus the bed's
// lead and tail when it has a bed. Stored as its `duration`, which the web player's silent stand-in clip and
// progress bar follow.
export function spokenSeconds(message, speed, backgroundMusic) {
  var words = estimateSpeechSeconds(message, speed);
  return hasBed(backgroundMusic) ? Math.round((words + BED_LEAD_SECONDS + BED_TAIL_SECONDS) * 10) / 10 : words;
}

function view(ism) {
  var v = clone(ism);
  if (!Array.isArray(v.specifiedTimes)) v.specifiedTimes = [];
  return v;
}

function specifiedTimes(x) {
  return Array.isArray(x) ? x : [];
}

// What a listener hears of a text announcement: its words, voice, language, speed and bed (1 for none).
function heard(ism) {
  return [ism.message, ism.voice, ism.language, Number(ism.speed), hasBed(ism.backgroundMusic) ? Number(ism.backgroundMusic) : 1].join('|');
}

// GET /v3/api/announcement/?hash=   (dashboard: the company's list)
// GET /v3/api/announcement/?locationId=&hash=   (players: their location's; active ones only with a player token)
// Always the full list (DATA_FOUND), with the hash under both the key the server sent (announcementHash)
// and the one the web player reads (messageHash).
export function getAnnouncements(ctx) {
  var q = ctx.query;
  var list = ctx.tx.all('announcements').filter(function (a) {
    if (a.isDeleted) return false;
    if (q.locationId) {
      if ((a.assignedLocations || []).indexOf(q.locationId) < 0) return false;
    } else if (a.company !== ctx.companyId) return false;
    if (ctx.playerAuth && !a.isActive) return false;
    return true;
  }).map(view);
  var h = hash32(JSON.stringify(list));
  return send('DATA_FOUND', { announcements: list, announcementHash: h, messageHash: h }, 'Announcement');
}

// GET /v3/api/voices
export function getVoices() {
  return send('DATA_FOUND', clone(VOICES));
}

// POST /v3/auth/announcement/preview: the dashboard's Preview button. Returns a URL to play.
export function preview(ctx) {
  var b = ctx.body || {};
  if (b.announcementId) {
    var ism = ctx.tx.get('announcements', b.announcementId);
    return send('SUCCESSFUL_CREATE', ism ? ism.url : ttsUrl(b.announcementId), 'Announcement');
  }
  var id = 'preview-' + (typeof b.hash === 'string' && /^[\w-]{1,64}$/.test(b.hash) ? b.hash : newId(ctx));
  var rec = {
    _id: id, message: String(b.message || ''), voice: b.voice || '', language: normalizeLanguage(b.language, b.voice), speed: Number(b.speed) || 1, backgroundMusic: b.backgroundMusic,
    duration: spokenSeconds(b.message, b.speed, b.backgroundMusic),
  };
  ctx.tx.put('ttsPreviews', stamp(rec, ctx.now(), true));
  // Keep the previews table small.
  var all = ctx.tx.all('ttsPreviews');
  if (all.length > 40) all.slice(0, all.length - 40).forEach(function (p) { ctx.tx.remove('ttsPreviews', p._id); });
  return send('SUCCESSFUL', ttsUrl(id));
}

function activeAllowed(ctx) {
  if (ctx.company.subscribed) return true;
  return ctx.tx.all('announcements').filter(function (a) { return !a.isDeleted && a.company === ctx.company._id; }).length < 1;
}

// POST /v3/auth/announcement: a text-to-speech announcement. (No data in the answer; the dashboard refetches.)
export function createAnnouncement(ctx) {
  var b = ctx.body || {};
  var id = newId(ctx);
  var backgroundMusic = b.backgroundMusic !== undefined ? b.backgroundMusic : 2;
  var doc = {
    _id: id, company: ctx.company._id, title: b.title || '', message: String(b.message || ''), description: '', voice: b.voice || '',
    language: normalizeLanguage(b.language, b.voice), speed: Number(b.speed) || 1, frequency: b.frequency !== undefined ? String(b.frequency) : '30',
    backgroundMusic: backgroundMusic, specifiedTimes: specifiedTimes(b.specifiedTimes), uploaded: false,
    duration: spokenSeconds(b.message, b.speed, backgroundMusic), url: ttsUrl(id), isActive: activeAllowed(ctx), isDeleted: false,
    assignedLocations: Array.isArray(b.assignedLocations) ? b.assignedLocations.slice() : [],
  };
  ctx.tx.put('announcements', stamp(doc, ctx.now(), true));
  return send('SUCCESSFUL_CREATE', null, 'Announcement');
}

// PATCH /v3/auth/announcement/:id (the server reads body.announcementId). Returns the updated
// announcement as data: the dashboard treats a falsy `data` as a failure.
export function editAnnouncement(ctx) {
  var b = ctx.body || {};
  var ism = ctx.tx.get('announcements', b.announcementId || ctx.params.id);
  if (!ism || ism.isDeleted) return send('REQUIRED_DATA_NOT_FOUND');
  var before = heard(ism);
  if (Array.isArray(b.assignedLocations)) ism.assignedLocations = b.assignedLocations.slice();
  ['title', 'message', 'voice'].forEach(function (k) { if (b[k] !== undefined) ism[k] = b[k]; });
  if (b.speed !== undefined) ism.speed = Number(b.speed) || 1;
  if (b.frequency !== undefined) ism.frequency = String(b.frequency);
  if (b.backgroundMusic !== undefined) ism.backgroundMusic = b.backgroundMusic;
  if (b.specifiedTimes !== undefined) ism.specifiedTimes = specifiedTimes(b.specifiedTimes);
  if (b.language !== undefined || b.voice !== undefined) ism.language = normalizeLanguage(b.language !== undefined ? b.language : ism.language, ism.voice);
  // New words, a new voice or a new bed: the pre-rendered audio (its bed mixed in) no longer matches, so the
  // browser speaks it, and a spoken one's duration follows its words and bed.
  if (!ism.uploaded && before !== heard(ism)) {
    ism.url = ttsUrl(ism._id);
    ism.duration = spokenSeconds(ism.message, ism.speed, ism.backgroundMusic);
  }
  stamp(ism, ctx.now());
  ctx.tx.put('announcements', ism);
  return send('SUCCESSFUL_UPDATE', view(ism), 'Announcement');
}

// DELETE /v3/auth/announcement/:id
export function deleteAnnouncement(ctx) {
  var ism = ctx.tx.get('announcements', ctx.params.id);
  if (!ism || ism.isDeleted) return send('UNSUCCESSFUL_DELETE', null, 'Announcement');
  ism.isDeleted = true;
  stamp(ism, ctx.now());
  ctx.tx.put('announcements', ism);
  return send('SUCCESSFUL_DELETE', null, 'Announcement');
}

function isMp3(file) {
  var type = String(file.type || '').toLowerCase();
  return type === 'audio/mpeg' || type === 'audio/mp3' || type === 'audio/mpeg3' || /\.mp3$/i.test(file.name || '');
}

// POST /v3/auth/announcement/upload (multipart, field "sampleFile", from antd's Upload). The duration is
// read from the MP3 frames (decoded by the browser as a fallback); 0 means "not audio" (400), as on the server.
// (Promise chains rather than async/await, so the apps' Babel needs no regenerator runtime.)
export function uploadAnnouncement(ctx) {
  var file = ctx.files && ctx.files.sampleFile;
  if (!file || typeof file.arrayBuffer !== 'function' || !isMp3(file)) return send('UNSUCCESSFUL_UPLOAD', null, 'Announcement');
  var id = newId(ctx);
  var duration = 0;
  return file.arrayBuffer().then(function (buffer) {
    duration = mp3Duration(new Uint8Array(buffer));
    if (!duration && ctx.decodeDuration) return ctx.decodeDuration(buffer.slice(0));
    return duration;
  }).then(function (seconds) {
    duration = Math.round((seconds || 0) * 1000) / 1000;
    if (!duration) return send('UNSUCCESSFUL_UPLOAD', null, 'Announcement');
    return Promise.resolve(ctx.media.put(id, { blob: file, type: 'audio/mpeg', name: file.name || 'announcement.mp3', duration: duration })).then(function () {
      var doc = {
        _id: id, company: ctx.company._id, title: file.name || 'Announcement', fileName: file.name || 'announcement.mp3', message: '', description: '',
        voice: '', language: '', speed: 1, frequency: '30', backgroundMusic: 1, specifiedTimes: [], uploaded: true, duration: duration, url: mediaUrl(id),
        isActive: activeAllowed(ctx), isDeleted: false, assignedLocations: [],
      };
      ctx.tx.put('announcements', stamp(doc, ctx.now(), true));
      return send('SUCCESSFUL_UPLOAD', view(doc), 'Announcement');
    }, function () {
      return send('UPLOAD_FAILURE', null, 'Announcement');
    });
  });
}

var UPLOADED_FIELDS = ['assignedLocations', 'title', 'voice', 'language', 'message', 'speed', 'frequency', 'description', 'backgroundMusic', 'specifiedTimes'];

// PATCH /v3/auth/announcement/upload/:id: the second step of an upload, and "Save Changes" on uploaded ones.
export function updateUploaded(ctx) {
  var b = ctx.body || {};
  var ism = ctx.tx.get('announcements', b.announcementId || ctx.params.id);
  if (!ism || ism.isDeleted) return send('UNSUCCESSFUL_UPDATE', null, 'Announcement');
  Object.assign(ism, pick(b, UPLOADED_FIELDS));
  if (ism.frequency !== undefined) ism.frequency = String(ism.frequency);
  ism.specifiedTimes = specifiedTimes(ism.specifiedTimes);
  stamp(ism, ctx.now());
  ctx.tx.put('announcements', ism);
  return send('SUCCESSFUL_UPDATE', view(ism), 'Announcement');
}
