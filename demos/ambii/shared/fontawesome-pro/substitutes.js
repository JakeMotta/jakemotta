// FontAwesome Pro stand-ins. The Ambii apps were built with FontAwesome Pro, which
// installs only with a paid npm token, so each Pro icon package is aliased to one of
// these modules (see each app's webpack config). Every free icon keeps its own name;
// the few Pro-only glyphs are drawn with the closest free icon instead, or, where the
// free set has nothing close (the tempo animals, the waveform, the station signal, the
// announcement bed instruments), with a small icon drawn here for the demo. Those are
// simple shapes made in this file, not copies of the Pro artwork.
// Plain CommonJS and ES5 on purpose, so webpack 4 and 5 both read it without Babel.
var solid = require('@fortawesome/free-solid-svg-icons');

// Path helpers, in FontAwesome's 512-high grid. Shapes are drawn clockwise, so they
// add up under SVG's default nonzero fill; the same shape drawn anticlockwise (ccw)
// cuts a hole, such as an eye.
function n(x) {
    return Math.round(x * 10) / 10;
}
function pt(x, y) {
    return n(x) + ' ' + n(y);
}
function circle(cx, cy, r, ccw) {
    var s = ccw ? 0 : 1;
    return 'M' + pt(cx - r, cy) + 'A' + r + ' ' + r + ' 0 1 ' + s + ' ' + pt(cx + r, cy) + 'A' + r + ' ' + r + ' 0 1 ' + s + ' ' + pt(cx - r, cy) + 'Z';
}
// An ellipse with radii rx and ry, turned by deg degrees (clockwise) about its centre.
function ellipse(cx, cy, rx, ry, deg, ccw) {
    var a = (deg * Math.PI) / 180, dx = rx * Math.cos(a), dy = rx * Math.sin(a), s = ccw ? 0 : 1;
    var arc = 'A' + rx + ' ' + ry + ' ' + deg + ' 1 ' + s + ' ';
    return 'M' + pt(cx - dx, cy - dy) + arc + pt(cx + dx, cy + dy) + arc + pt(cx - dx, cy - dy) + 'Z';
}
// A thick line from (x1, y1) to (x2, y2), w wide, with round ends.
function bar(x1, y1, x2, y2, w) {
    var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) || 1;
    var px = ((y2 - y1) / len) * (w / 2), py = (-(x2 - x1) / len) * (w / 2), cap = 'A' + w / 2 + ' ' + w / 2 + ' 0 0 1 ';
    return 'M' + pt(x1 + px, y1 + py) + 'L' + pt(x2 + px, y2 + py) + cap + pt(x2 - px, y2 - py) + 'L' + pt(x1 - px, y1 - py) + cap + pt(x1 + px, y1 + py) + 'Z';
}
// Several thick lines joined end to end.
function line(points, w) {
    var out = '';
    for (var i = 0; i + 1 < points.length; i++) out += bar(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], w);
    return out;
}
// A polygon through the points, in the order given (list them clockwise to fill, anticlockwise to cut).
function poly(points) {
    return 'M' + points.map(function (p) { return pt(p[0], p[1]); }).join('L') + 'Z';
}
function rect(x, y, w, h, ccw) {
    return ccw ? 'M' + pt(x, y) + 'V' + n(y + h) + 'H' + n(x + w) + 'V' + n(y) + 'Z' : 'M' + pt(x, y) + 'H' + n(x + w) + 'V' + n(y + h) + 'H' + n(x) + 'Z';
}
// A curved band around (cx, cy) at radius r, w wide, from angle a1 to a2 (degrees, 0 = right, clockwise), round ends.
function arcBand(cx, cy, r, w, a1, a2) {
    var rad = Math.PI / 180, ro = r + w / 2, ri = r - w / 2, big = a2 - a1 > 180 ? 1 : 0, cap = 'A' + w / 2 + ' ' + w / 2 + ' 0 0 1 ';
    var at = function (rr, a) { return pt(cx + rr * Math.cos(a * rad), cy + rr * Math.sin(a * rad)); };
    return 'M' + at(ro, a1) + 'A' + ro + ' ' + ro + ' 0 ' + big + ' 1 ' + at(ro, a2) + cap + at(ri, a2) + 'A' + ri + ' ' + ri + ' 0 ' + big + ' 0 ' + at(ri, a1) + cap + at(ro, a1) + 'Z';
}
function icon(name, width, path) {
    return { prefix: 'fas', iconName: name, icon: [width, 512, [], '', path] };
}

// The tempo icons on every station tile, the tempo filter and the schedule Energy picker.
var drawn = {
    // Slower: a sleepy "Zzz".
    faSnooze: icon('snooze', 512,
        line([[52, 268], [212, 268], [52, 452], [212, 452]], 56) +
        line([[286, 150], [394, 150], [286, 274], [394, 274]], 44) +
        line([[426, 52], [484, 52], [426, 120], [484, 120]], 32)),

    // Slow: a turtle, shell up, head out.
    faTurtle: icon('turtle', 640,
        'M96 312A192 176 0 0 1 480 312Z' + // shell
        poly([[214, 216], [262, 180], [314, 180], [362, 216], [344, 272], [232, 272]].reverse()) + // its middle plate, cut out
        rect(72, 328, 432, 40) + // the rim under the shell
        bar(150, 360, 150, 432, 64) + bar(416, 360, 416, 432, 64) + // legs
        bar(470, 324, 528, 286, 60) + circle(556, 268, 60) + circle(574, 252, 12, true) + // neck, head and eye
        bar(80, 344, 30, 378, 30)), // tail

    // Moderate: a squirrel sitting up, its big tail curled over its back.
    faSquirrel: icon('squirrel', 576,
        'M214 470C102 470 44 380 64 284C82 196 160 160 154 92C150 52 196 26 236 46C304 82 268 176 222 232C186 276 182 348 232 400Z' + // tail
        ellipse(338, 372, 100, 112, 0) + // body
        circle(390, 218, 82) + poly([[352, 152], [366, 82], [412, 142]]) + circle(420, 204, 13, true) + // head, ear, eye
        bar(410, 316, 470, 288, 40) + // front paws
        bar(270, 474, 420, 474, 48)), // feet

    // Fast: a rabbit at full stretch, ears back, with speed lines.
    faRabbitFast: icon('rabbit-fast', 640,
        ellipse(330, 300, 150, 92, -8) + // body
        circle(492, 234, 72) + circle(512, 222, 12, true) + // head and eye
        ellipse(424, 136, 92, 26, 28) + ellipse(392, 156, 80, 24, 18) + // ears, swept back
        bar(456, 340, 588, 384, 44) + // front legs, reaching forward
        bar(236, 352, 116, 420, 52) + // hind leg, pushing back
        circle(172, 254, 32) + // tail
        bar(30, 228, 120, 228, 28) + bar(16, 300, 96, 300, 28) + bar(40, 372, 104, 372, 28)), // speed lines

    // The default image of an announcement tile, and the "Smooth" announcement bed.
    faWaveform: icon('waveform', 640, (function () {
        var heights = [96, 208, 144, 320, 448, 272, 384, 176, 240, 112], out = '';
        heights.forEach(function (h, i) { out += bar(56 + i * 59, 256 - h / 2 + 20, 56 + i * 59, 256 + h / 2 - 20, 40); });
        return out;
    })()),

    // Stations, everywhere: a dot sending out signal on both sides.
    faSignalStream: icon('signal-stream', 576,
        circle(288, 256, 64) +
        arcBand(288, 256, 144, 48, -42, 42) + arcBand(288, 256, 144, 48, 138, 222) +
        arcBand(288, 256, 240, 48, -40, 40) + arcBand(288, 256, 240, 48, 140, 220)),

    // The "Bright" announcement bed: a piano keyboard.
    faPianoKeyboard: icon('piano-keyboard', 576, (function () {
        var out = 'M64 96H512A32 32 0 0 1 544 128V384A32 32 0 0 1 512 416H64A32 32 0 0 1 32 384V128A32 32 0 0 1 64 96Z' + rect(72, 136, 432, 240, true);
        for (var k = 1; k < 7; k++) out += rect(72 + k * (432 / 7) - 5, 136, 10, 240);
        [1, 2, 4, 5, 6].forEach(function (k) { out += rect(72 + k * (432 / 7) - 18, 136, 36, 140); });
        return out;
    })()),

    // The "Light" announcement bed: a triangle (the instrument) on its loop, and its beater.
    faTriangleMusic: icon('triangle-music', 512,
        poly([[232, 104], [440, 464], [24, 464]]) + poly([[232, 200], [107, 416], [357, 416]]) + // the triangle, open in the middle
        circle(232, 60, 36) + circle(232, 60, 16, true) + // its loop
        bar(392, 72, 488, 280, 32)), // the beater
};

var proOnly = {
    faAcorn: solid.faSeedling,
    faBadgeDollar: solid.faDollarSign,
    faExternalLink: solid.faExternalLinkAlt,
    faPianoKeyboard: drawn.faPianoKeyboard,
    faRabbitFast: drawn.faRabbitFast,
    faSignOut: solid.faSignOutAlt,
    faSignalStream: drawn.faSignalStream,
    faSnooze: drawn.faSnooze,
    faSquirrel: drawn.faSquirrel,
    faTriangleMusic: drawn.faTriangleMusic,
    faTurtle: drawn.faTurtle,
    faVolume: solid.faVolumeUp,
    faWaveform: drawn.faWaveform,
};

// Pro icons are drawn from free-solid, or from free-regular where the app asked for the
// lighter weight and the free set has that glyph.
exports.build = function (lighter) {
    var icons = Object.assign({}, solid);
    if (lighter) Object.assign(icons, require('@fortawesome/free-regular-svg-icons'));
    return Object.assign(icons, proOnly);
};
