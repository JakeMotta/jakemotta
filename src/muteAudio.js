// Silences the page it runs in without stopping anything. Media keeps playing, muted, and Web Audio
// keeps running into an output that reaches no speaker, so analysers (the vignette, the eq bars) still
// move. The muted preview server (the "dev" launch config) turns it on with REACT_APP_MUTE_AUDIO: index.tsx
// loads it into the app and setupProxy.js inlines it into every static page under public/. It never
// reaches the build. It's a plain script rather than a module, so it can be served as one.
(() => {
    const NativeContext = window.AudioContext;
    const muted = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted');
    // What the page set `muted` to, which is what it reads back, so its own mute buttons still work
    const wanted = new WeakMap();
    // Elements feeding a Web Audio graph, whose output is silent already. Chromium applies `muted`
    // before the graph, so muting one of these would flatten the visualizer too.
    const routed = new WeakSet();

    const silence = (media) => {
        if (routed.has(media) || muted.get.call(media)) return;
        if (!wanted.has(media)) wanted.set(media, false);
        muted.set.call(media, true);
    };

    Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
        configurable: true,
        enumerable: muted.enumerable,
        get() {
            return wanted.has(this) ? wanted.get(this) : muted.get.call(this);
        },
        set(value) {
            wanted.set(this, !!value);
            muted.set.call(this, routed.has(this) ? !!value : true);
        },
    });

    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
        silence(this);
        return play.apply(this, args);
    };
    // Elements that start on their own (autoplay) are caught as they begin loading. Media events
    // don't bubble, but a capturing listener on the window still sees them.
    window.addEventListener('loadstart', (event) => silence(event.target), true);
    window.addEventListener('play', (event) => silence(event.target), true);

    if (!NativeContext) return;

    const createSource = NativeContext.prototype.createMediaElementSource;
    NativeContext.prototype.createMediaElementSource = function (media) {
        routed.add(media);
        if (wanted.has(media)) muted.set.call(media, wanted.get(media));
        return createSource.call(this, media);
    };

    // Every context renders to no device at all (sinkId 'none', Chromium 110+: the preview browser
    // and the screenshot script). Ruffle's Flash sound and the games' Web Audio go through here.
    if ('setSinkId' in NativeContext.prototype) {
        window.AudioContext = class AudioContext extends NativeContext {
            constructor(options) {
                super({ ...options, sinkId: { type: 'none' } });
            }
        };
    }
})();
