// GET /v3/api/voices: the Google Wavenet voices the server whitelisted (src/utils/constants.js), grouped by
// display language. Gender comes from the "Female X" / "Male X" names. speakAnnouncement() uses this
// table to pick a browser voice of the same language and gender.

var TABLE = [
  ['Arabic', 'ar-XA', [['A', 'Female A'], ['B', 'Male B'], ['C', 'Male C']]],
  ['Mandarin Chinese', 'cmn-CN', [['A', 'Female A'], ['D', 'Female D'], ['B', 'Male B'], ['C', 'Male C']]],
  ['Mandarin Chinese', 'cmn-TW', [['A', 'Female A'], ['B', 'Male B'], ['C', 'Male C']]],
  ['English (US)', 'en-US', [['C', 'Female C'], ['E', 'Female E'], ['F', 'Female F'], ['G', 'Female G'], ['H', 'Female H'], ['A', 'Male A'], ['B', 'Male B'], ['D', 'Male D'], ['I', 'Male I'], ['J', 'Male J']]],
  ['Spanish (Spain)', 'es-ES', [['B', 'Male B']]],
  ['Filipino (Philippines)', 'fil-PH', [['A', 'Female A'], ['B', 'Female B'], ['C', 'Male C'], ['D', 'Male D']]],
  ['French (France)', 'fr-FR', [['A', 'Female A'], ['C', 'Female C'], ['E', 'Female E'], ['B', 'Male B'], ['D', 'Male D']]],
  ['Hindi (India)', 'hi-IN', [['A', 'Female A'], ['D', 'Female D'], ['B', 'Male B'], ['C', 'Male C']]],
  ['Japanese (Japan)', 'ja-JP', [['A', 'Female A'], ['B', 'Female B'], ['C', 'Male C'], ['D', 'Male D']]],
  ['Korean (South Korea)', 'ko-KR', [['A', 'Female A'], ['B', 'Female B'], ['C', 'Male C'], ['D', 'Male D']]],
  ['Vietnamese (Vietnam)', 'vi-VN', [['A', 'Female A'], ['C', 'Female C'], ['B', 'Male B'], ['D', 'Male D']]],
];

export var VOICES = {};
export var VOICE_GENDER = {};

TABLE.forEach(function (row) {
  var group = VOICES[row[0]] || (VOICES[row[0]] = []);
  row[2].forEach(function (v) {
    var name = row[1] + '-Wavenet-' + v[0];
    var gender = v[1].indexOf('Female') === 0 ? 'FEMALE' : 'MALE';
    VOICE_GENDER[name] = gender;
    group.push({ languageCodes: [row[1]], name: name, ssmlGender: gender, naturalSampleRateHertz: 24000, simpleName: v[1], parent: row[1] });
  });
});

// "en-US-Wavenet-A" -> "en-US". The dashboard sometimes sends the display name ("English (US)") as the
// language, and "Mandarin Chinese" covers two codes, so the voice name is the reliable source.
export function languageFromVoice(voice) {
  var m = /^([a-z]{2,3}-[A-Z]{2})-/.exec(voice || '');
  return m ? m[1] : '';
}

export function normalizeLanguage(language, voice) {
  if (typeof language === 'string' && /^[a-z]{2,3}-[A-Z]{2}$/.test(language)) return language;
  return languageFromVoice(voice) || (typeof language === 'string' ? language : '');
}
