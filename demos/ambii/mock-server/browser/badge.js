// The demo badge: a small fixed pill saying the demo runs in the browser, with a menu holding
// "All Ambii apps" and "Reset demo". Plain DOM in a shadow root, so the apps' CSS cannot reach it.
import { HUB_URL, STORAGE_PREFIX } from '../config.js';

var UI_KEY = STORAGE_PREFIX + 'ui:badge';
var CORNERS = {
  'bottom-right': 'bottom:12px;right:12px;', 'bottom-left': 'bottom:12px;left:12px;',
  'top-right': 'top:12px;right:12px;', 'top-left': 'top:12px;left:12px;',
};

var CSS = [
  ':host{all:initial}',
  '.wrap{position:relative;font:600 12px/1.25 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#f6eef8;-webkit-font-smoothing:antialiased}',
  'button,a{font:inherit;color:inherit}',
  '.pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px 0 8px;border-radius:999px;border:1px solid rgba(255,255,255,.18);',
  'background:#2C2033;box-shadow:0 2px 10px rgba(20,8,28,.35);cursor:pointer;opacity:.9;white-space:nowrap;transition:opacity .15s,transform .15s}',
  '.pill:hover,.pill:focus-visible,.pill[aria-expanded=true]{opacity:1}',
  '.pill:focus-visible,.item:focus-visible{outline:2px solid #D04283;outline-offset:2px}',
  '.dot{width:8px;height:8px;border-radius:50%;background:#D04283;box-shadow:0 0 0 3px rgba(208,66,131,.25);flex:none}',
  '.sep{opacity:.55}',
  '.compact .long{display:none}',
  '.menu{position:absolute;width:236px;padding:10px;border-radius:12px;background:#2C2033;border:1px solid rgba(255,255,255,.14);',
  'box-shadow:0 10px 30px rgba(20,8,28,.45);display:flex;flex-direction:column;gap:4px}',
  '.menu[hidden]{display:none}',
  '.note{margin:2px 4px 6px;font-weight:500;color:#e6d8ec;line-height:1.4}',
  '.item{display:block;width:100%;box-sizing:border-box;text-align:left;padding:8px 10px;border-radius:8px;border:0;background:transparent;cursor:pointer;text-decoration:none}',
  '.item:hover{background:rgba(255,255,255,.08)}',
  '.reset{color:#ff8fc0}',
  '.small{font-weight:500;color:#cdb8d6}',
].join('');

function readUi() {
  try { return localStorage.getItem(UI_KEY); } catch (e) { return null; }
}
function writeUi(v) {
  try { localStorage.setItem(UI_KEY, v); } catch (e) { /* ignore */ }
}

// What counts as a control the badge must not sit on (besides anything with a pointer cursor).
var CONTROLS = 'a[href],button,input,select,textarea,summary,label,[role=button],[role=link],[role=slider],[role=switch],[role=checkbox],[role=tab],' +
  '[tabindex]:not([tabindex="-1"]),.ant-btn,.ant-switch,.ant-slider';
var GAP = 8;

function fixedAncestor(el) {
  for (var n = el; n && n.nodeType === 1 && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    var pos = getComputedStyle(n).position;
    if (pos === 'fixed' || pos === 'sticky') return n;
  }
  return null;
}

function controlOf(el) {
  var ctl = el.closest ? el.closest(CONTROLS) : null;
  if (ctl) return ctl;
  return getComputedStyle(el).cursor === 'pointer' ? el : null;
}

// How far the badge must move (px; negative = up) so its pill, at its home position, covers nothing of
// the app that stays put:
// - a fixed or sticky bar (a player bar, a toast): the badge sits just past the bar, whatever is under
//   it, because such bars' buttons are often plain divs with click handlers (the dashboard's preview player);
// - inside a fixed layer filling most of the screen (a modal) or on a page that does not scroll: a control.
// Controls in scrolling content pass under the badge as the page scrolls, and moving the badge for each
// one would only be distracting.
export function badgeOffset(host, pill, dy, fromTop) {
  if (!document.elementsFromPoint) return 0;
  var r = pill.getBoundingClientRect();
  var top = r.top - dy, bottom = r.bottom - dy, vh = window.innerHeight;
  var scrolls = document.documentElement.scrollHeight > vh + 1;
  var need = 0;
  // Sample points every 10 px or so across the pill, so a small icon button cannot slip between them.
  var cols = Math.max(2, Math.ceil((r.width - 4) / 10) + 1);
  for (var ix = 0; ix < cols; ix++) {
    for (var iy = 0; iy < 3; iy++) {
      var x = r.left + 2 + ((r.width - 4) * ix) / (cols - 1), y = top + 2 + ((r.height - 4) * iy) / 2;
      var list = document.elementsFromPoint(x, y), under = null;
      for (var i = 0; i < list.length && !under; i++) if (list[i] !== host && !host.contains(list[i])) under = list[i];
      if (!under || under === document.body || under === document.documentElement) continue;
      var anchor = fixedAncestor(under), box = null;
      if (anchor) {
        box = anchor.getBoundingClientRect();
        if (box.height > vh * 0.4) box = null;
      }
      if (!box && (anchor || !scrolls)) {
        var ctl = controlOf(under);
        if (ctl) box = ctl.getBoundingClientRect();
      }
      if (box) need = Math.max(need, fromTop ? box.bottom - top + GAP : bottom - box.top + GAP);
    }
  }
  if (need <= 0 || need > vh * 0.45) return 0;
  return fromTop ? need : -need;
}

export function mountBadge(options, onReset) {
  if (typeof document === 'undefined') return null;
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', function () { mountBadge(options, onReset); }, { once: true });
    return null;
  }
  if (document.getElementById('ambii-demo-badge')) return document.getElementById('ambii-demo-badge');
  var opts = options && typeof options === 'object' ? options : {};
  var corner = CORNERS[opts.position] ? opts.position : 'bottom-right';
  var top = corner.indexOf('top') === 0, left = corner.indexOf('left') > 0;

  var host = document.createElement('div');
  host.id = 'ambii-demo-badge';
  host.setAttribute('style', 'all:initial;position:fixed;z-index:2147483000;transition:transform .2s ease;' + CORNERS[corner] + (opts.style || ''));
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var stored = readUi();
  var compact = stored ? stored === 'compact' : window.innerWidth < 560 || !!opts.compact;
  var menuPos = (top ? 'top:32px;' : 'bottom:32px;') + (left ? 'left:0;' : 'right:0;');

  root.innerHTML = '<style>' + CSS + '</style>' +
    '<div class="wrap' + (compact ? ' compact' : '') + '">' +
    '<div class="menu" role="menu" hidden style="' + menuPos + '">' +
    '<p class="note">This is a demo. Everything runs in your browser, and nothing you do here is sent anywhere.</p>' +
    '<a class="item" role="menuitem" href="' + HUB_URL + '">All Ambii apps</a>' +
    '<button class="item reset" role="menuitem" type="button">Reset demo…</button>' +
    '<button class="item small size" role="menuitem" type="button"></button>' +
    '</div>' +
    '<button class="pill" type="button" aria-haspopup="true" aria-expanded="false" title="Ambii demo">' +
    '<span class="dot"></span><span>Demo</span><span class="long"><span class="sep">·</span> runs in your browser</span>' +
    '</button></div>';

  var wrap = root.querySelector('.wrap'), pill = root.querySelector('.pill'), menu = root.querySelector('.menu');
  var sizeBtn = root.querySelector('.size');
  function label() { sizeBtn.textContent = wrap.classList.contains('compact') ? 'Show the full badge' : 'Make the badge smaller'; }
  label();
  function setOpen(open) {
    menu.hidden = !open;
    pill.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  pill.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(menu.hidden);
  });
  sizeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var c = !wrap.classList.contains('compact');
    wrap.classList.toggle('compact', c);
    writeUi(c ? 'compact' : 'full');
    label();
    setOpen(false);
  });
  root.querySelector('.reset').addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(false);
    if (window.confirm('Reset the Ambii demo?\n\nThis puts the demo company back the way it started and forgets your changes, uploads and connected players in this browser.')) onReset();
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && e.target !== host) setOpen(false);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      pill.focus();
    }
  });
  document.body.appendChild(host);

  // Step aside when the app puts a control where the badge sits (e.g. the close button of the dashboard's
  // bottom preview player on a phone), and come back when it is gone. A cheap check twice a second.
  var dy = 0;
  // The shift the badge shows right now (mid-transition it is not yet dy), to find its home position.
  function shown() {
    var m = /matrix\(([^)]+)\)/.exec(getComputedStyle(host).transform || '');
    return m ? parseFloat(m[1].split(',')[5]) || 0 : 0;
  }
  function place() {
    if (!host.isConnected || document.hidden || !menu.hidden) return;
    var next = badgeOffset(host, pill, shown(), top);
    if (Math.abs(next - dy) < 1) return;
    dy = next;
    host.style.transform = dy ? 'translateY(' + dy + 'px)' : '';
  }
  host.__ambiiPlace = place;
  place();
  var timer = setInterval(function () {
    if (!host.isConnected) clearInterval(timer);
    else place();
  }, 500);
  window.addEventListener('resize', place);
  return host;
}
