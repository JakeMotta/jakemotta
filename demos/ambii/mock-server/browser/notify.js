// jakemotta.com plays its own background music. When a demo starts making sound, tell the top window
// so the site can pause its track: {type: "jakemotta:media-playing"}, same origin only.

export function notifyMediaPlaying() {
  try {
    if (typeof window !== 'undefined' && window.top && window.top !== window) {
      window.top.postMessage({ type: 'jakemotta:media-playing' }, location.origin);
    }
  } catch (e) { /* cross-origin or detached: nothing to tell */ }
}

function isMedia(el) {
  return !!el && (el.tagName === 'AUDIO' || el.tagName === 'VIDEO');
}

// <audio>/<video> in the document: a capture-phase "play" listener (play does not bubble).
// Media elements that are not in the document (new Audio()): HTMLMediaElement.prototype.play is
// wrapped, so they count too. Muted elements are ignored.
export function installPlayNotifier() {
  if (typeof document === 'undefined' || document.__ambiiDemoPlay) return;
  document.__ambiiDemoPlay = true;
  document.addEventListener('play', function (e) {
    if (isMedia(e.target) && !e.target.muted) notifyMediaPlaying();
  }, true);
  if (typeof HTMLMediaElement !== 'undefined' && HTMLMediaElement.prototype.play && !HTMLMediaElement.prototype.play.__ambiiDemo) {
    var play = HTMLMediaElement.prototype.play;
    var wrapped = function () {
      var el = this;
      var result = play.apply(el, arguments);
      if (!el.isConnected && !el.muted) {
        if (result && typeof result.then === 'function') result.then(notifyMediaPlaying, function () {});
        else notifyMediaPlaying();
      }
      return result;
    };
    wrapped.__ambiiDemo = true;
    HTMLMediaElement.prototype.play = wrapped;
  }
}
