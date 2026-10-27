// FontAwesome Pro stand-ins. The Ambii apps were built with FontAwesome Pro, which
// installs only with a paid npm token, so each Pro icon package is aliased to one of
// these modules (see each app's webpack config). Every free icon keeps its own name;
// the few Pro-only glyphs are drawn with the closest free icon instead.
// Plain CommonJS on purpose, so webpack 4 and 5 both read it without Babel.
var solid = require('@fortawesome/free-solid-svg-icons');

var proOnly = {
    faAcorn: solid.faSeedling,
    faBadgeDollar: solid.faDollarSign,
    faExternalLink: solid.faExternalLinkAlt,
    faPianoKeyboard: solid.faKeyboard,
    faRabbitFast: solid.faHorse,
    faSignOut: solid.faSignOutAlt,
    faSignalStream: solid.faBroadcastTower,
    faSnooze: solid.faBed,
    faSquirrel: solid.faRunning,
    faTriangleMusic: solid.faBell,
    faTurtle: solid.faWalking,
    faVolume: solid.faVolumeUp,
    faWaveform: solid.faWaveSquare || solid.faMicrophoneAlt,
};

// Pro icons are drawn from free-solid, or from free-regular where the app asked for the
// lighter weight and the free set has that glyph.
exports.build = function (lighter) {
    var icons = Object.assign({}, solid);
    if (lighter) Object.assign(icons, require('@fortawesome/free-regular-svg-icons'));
    return Object.assign(icons, proOnly);
};
