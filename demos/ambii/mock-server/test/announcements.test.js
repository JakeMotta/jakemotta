import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { makeServer, connect } from './helpers.js';
import { IDS } from '../core/seed.js';
import { VOICES, normalizeLanguage } from '../core/voices.js';
import { API_BASE } from '../config.js';

var CLIP = fileURLToPath(new URL('../../../../public/projects/ambii-business/media/announcements/loyalty-card.mp3', import.meta.url));

test('seeded announcements: the four frequencies, arrays everywhere, playable URLs', async () => {
  var s = makeServer();
  var r = await s.call('GET', '/v3/api/announcement/?hash=');
  assert.equal(r.body.message, 'Announcement data found');
  var list = r.body.data.announcements;
  assert.deepEqual(list.map((a) => a.frequency).sort(), ['0', '15', '60', 'specific time', 'specific time']);
  assert.ok(list.every((a) => Array.isArray(a.specifiedTimes) && Array.isArray(a.assignedLocations) && a.url && a.duration > 3));
  assert.ok(list.every((a) => a.frequency !== '180'));
  assert.equal(r.body.data.announcementHash, r.body.data.messageHash);
  var closing = list.find((a) => a.title === 'Closing Soon');
  assert.match(closing.specifiedTimes[0].time.selectedTime.substring(0, 5), /^21:45$/);
  assert.deepEqual(closing.specifiedTimes[0].days, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  var uploaded = list.find((a) => a.uploaded);
  assert.equal(uploaded.voice, '');
  assert.equal(uploaded.fileName, 'loyalty-card-promo.mp3');
  // same answer even when the client sends the current hash (the web player reads messageHash)
  var again = await s.call('GET', '/v3/api/announcement/?hash=' + r.body.data.announcementHash);
  assert.equal(again.body.type, 'DATA_FOUND');
});

test('players see only their location\'s active announcements', async () => {
  var s = makeServer();
  var c = await connect(s, 'LBEAN7');
  var h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var r = await s.call('GET', '/v3/api/announcement/?locationId=' + IDS.downtown + '&hash=undefined', null, h);
  assert.deepEqual(r.body.data.announcements.map((a) => a.title).sort(), ['Closing Soon', 'Happy Hour', 'Welcome']);
  var dash = (await s.call('GET', '/v3/api/announcement/?hash=')).body.data.announcements;
  var happy = dash.find((a) => a.title === 'Happy Hour');
  // deactivate through a cancel (keeps only the first announcement active)
  await s.call('PATCH', '/v3/auth/subscription', { announcementId: dash.find((a) => a.title === 'Closing Soon')._id });
  r = await s.call('GET', '/v3/api/announcement/?locationId=' + IDS.downtown + '&hash=', null, h);
  assert.deepEqual(r.body.data.announcements.map((a) => a.title), ['Closing Soon']);
  assert.ok(happy);
});

test('voices: grouped by language, server table (en-US-Wavenet-A is Male A)', async () => {
  var s = makeServer();
  var r = await s.call('GET', '/v3/api/voices');
  assert.equal(r.body.message, 'Data found');
  var us = r.body.data['English (US)'];
  assert.equal(us.length, 10);
  assert.equal(us.find((v) => v.name === 'en-US-Wavenet-A').simpleName, 'Male A');
  assert.equal(us.find((v) => v.name === 'en-US-Wavenet-F').ssmlGender, 'FEMALE');
  assert.ok(us.every((v) => v.parent === 'en-US'));
  assert.deepEqual(Object.keys(VOICES).length, 10);
  assert.equal(normalizeLanguage('English (US)', 'en-US-Wavenet-A'), 'en-US');
  assert.equal(normalizeLanguage('Mandarin Chinese', 'cmn-TW-Wavenet-B'), 'cmn-TW');
  assert.equal(normalizeLanguage('fr-FR', 'en-US-Wavenet-A'), 'fr-FR');
});

test('preview returns a speakable URL and remembers the text', async () => {
  var s = makeServer();
  var r = await s.call('POST', '/v3/auth/announcement/preview', { hash: 'abc123', voice: 'en-US-Wavenet-C', language: 'en-US', message: 'Fresh croissants just came out of the oven!', speed: 1.25, backgroundMusic: 2 });
  assert.equal(r.body.message, 'Successful');
  assert.equal(r.body.data, API_BASE + '/tts/preview-abc123');
  assert.equal(s.collection('ttsPreviews')['preview-abc123'].message, 'Fresh croissants just came out of the oven!');
  var withId = await s.call('POST', '/v3/auth/announcement/preview', { announcementId: '61b050000000000000000001' });
  assert.equal(withId.body.message, 'Announcement successfully created');
  assert.match(withId.body.data, /happy-hour\.mp3$/);
  var silent = await s.call('GET', '/tts/preview-abc123');
  assert.equal(silent.status, 200);
  assert.equal(silent.contentType, 'audio/mpeg');
  assert.ok(silent.body.length > 500);
});

test('create, edit (display-name language, returns data) and delete a TTS announcement', async () => {
  var s = makeServer();
  var c = await s.call('POST', '/v3/auth/announcement', { assignedLocations: [IDS.downtown], title: 'Fresh Bake', voice: 'en-US-Wavenet-A', language: 'en-US', message: 'Fresh croissants are out of the oven.', speed: 1, frequency: '15', savedPreviews: {}, hash: false, backgroundMusic: 2, specifiedTimes: [] });
  assert.equal(c.body.message, 'Announcement successfully created');
  assert.equal(c.body.data, undefined);
  var list = (await s.call('GET', '/v3/api/announcement/?hash=')).body.data.announcements;
  var ism = list.find((a) => a.title === 'Fresh Bake');
  assert.equal(ism.url, API_BASE + '/tts/' + ism._id);
  assert.equal(ism.isActive, true);
  assert.ok(ism.duration >= 2);
  var e = await s.call('PATCH', '/v3/auth/announcement/' + ism._id, { announcementId: ism._id, assignedLocations: [IDS.downtown, IDS.market], title: 'Fresh Bake!', voice: 'en-US-Wavenet-F', language: 'English (US)', message: 'Croissants!', speed: 1, frequency: 'specific time', savedPreviews: {}, hash: false, backgroundMusic: 1, specifiedTimes: [{ days: ['Sat'], time: { selectedTime: '08:00:00 GMT-0700 (PDT)', unixTimeStamp: 1 }, hash: 'x' }] });
  assert.equal(e.body.message, 'Announcement successfully updated');
  assert.equal(e.body.data.language, 'en-US');
  assert.equal(e.body.data.title, 'Fresh Bake!');
  assert.equal(e.body.data.specifiedTimes.length, 1);
  // editing the words of a seeded (pre-rendered) announcement switches it to speech
  var seeded = list.find((a) => a.title === 'Happy Hour');
  var e2 = await s.call('PATCH', '/v3/auth/announcement/' + seeded._id, { announcementId: seeded._id, frequency: '30' });
  assert.match(e2.body.data.url, /happy-hour\.mp3$/);
  var e3 = await s.call('PATCH', '/v3/auth/announcement/' + seeded._id, { announcementId: seeded._id, message: 'New words' });
  assert.equal(e3.body.data.url, API_BASE + '/tts/' + seeded._id);
  var d = await s.call('DELETE', '/v3/auth/announcement/' + ism._id);
  assert.equal(d.body.message, 'Announcement successfully deleted');
  assert.equal((await s.call('DELETE', '/v3/auth/announcement/' + ism._id)).body.message, 'Announcement deleting not successful');
  assert.ok(!(await s.call('GET', '/v3/api/announcement/?hash=')).body.data.announcements.some((a) => a._id === ism._id));
});

test('upload: multipart sampleFile, real duration, served from media storage, then edited', async () => {
  var s = makeServer();
  var bytes = readFileSync(CLIP);
  var file = new File([bytes], 'weekend-special.mp3', { type: 'audio/mpeg' });
  var r = await s.call('POST', '/v3/auth/announcement/upload', {}, {}, { sampleFile: file });
  assert.equal(r.status, 200);
  assert.equal(r.body.message, 'Announcement upload was successful');
  var ism = r.body.data;
  assert.equal(ism.uploaded, true);
  assert.equal(ism.title, 'weekend-special.mp3');
  assert.equal(ism.frequency, '30');
  assert.deepEqual(ism.assignedLocations, []);
  assert.equal(ism.url, API_BASE + '/media/' + ism._id + '.mp3');
  assert.ok(Math.abs(ism.duration - 9.77) < 0.15, 'duration ' + ism.duration);
  var media = await s.call('GET', '/media/' + ism._id + '.mp3');
  assert.equal(media.status, 200);
  assert.equal(media.contentType, 'audio/mpeg');
  assert.equal(media.body.size, bytes.length);
  assert.equal((await s.call('GET', '/media/nope.mp3')).status, 404);
  var u = await s.call('PATCH', '/v3/auth/announcement/upload/' + ism._id, { assignedLocations: [IDS.market], companyId: IDS.company, announcementId: ism._id, title: 'Weekend Special', voice: '', language: '', message: '', speed: 1, frequency: '60', description: '', backgroundMusic: 1, specifiedTimes: [], savedPreviews: {}, editExisting: true });
  assert.equal(u.body.message, 'Announcement successfully updated');
  assert.equal(u.body.data.title, 'Weekend Special');
  assert.equal(u.body.data.companyId, undefined);
  var bad = await s.call('POST', '/v3/auth/announcement/upload', {}, {}, { sampleFile: new File(['hello'], 'notes.txt', { type: 'text/plain' }) });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.message, 'Announcement upload was unsuccessful');
  var notAudio = await s.call('POST', '/v3/auth/announcement/upload', {}, {}, { sampleFile: new File(['not really'], 'fake.mp3', { type: 'audio/mpeg' }) });
  assert.equal(notAudio.status, 400);
});
