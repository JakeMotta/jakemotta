/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (d) {
  'function' === typeof define && define.amd && define.amd.jQuery ? define(['jquery'], d) : d(jQuery);
})(function (d) {
  if (typeof Muse == 'undefined') window.Muse = {};
  Muse.Assert = {};
  Muse.Assert.fail = function (c) {
    alert('JavaScript exception: ' + c);
  };
  Muse.Assert.assert = function (c, a) {
    if (!c) throw Error(a);
  };
  d.extend(d.browser, { SafariMobile: navigator.userAgent.toLowerCase().match(/iP(hone|ad|od)/i) });
  if (!Array.indexOf)
    Array.prototype.indexOf = function (c) {
      for (var a = 0; a < this.length; ++a) if (this[a] == c) return a;
      return -1;
    };
  Muse.Plugins = {};
  Muse.Utils = {};
  Muse.Utils.getCssVendorPrefix = function () {
    if (!Muse.Utils.isDefined(Muse.Utils.getCssVendorPrefix.flag))
      Muse.Utils.getCssVendorPrefix.flag = /webkit/i.test(navigator.appVersion)
        ? '-webkit'
        : /firefox/i.test(navigator.userAgent)
          ? '-moz'
          : /trident/i.test(navigator.userAgent)
            ? '-ms'
            : 'opera' in window
              ? '-o'
              : '';
    return Muse.Utils.getCssVendorPrefix.flag;
  };
  Muse.Utils.wrapElement = function (c, a) {
    c.parentNode.replaceChild(a, c);
    a.appendChild(c);
  };
  Muse.Utils.firstChild = function (c, a) {
    for (var b = 0; b < c.childNodes.length; b++) {
      var d = c.childNodes[b];
      if (d.nodeType == 1 && (!a || a.matches(d))) return d;
    }
    return null;
  };
  Muse.Utils.firstDescendant = function (c, a, b) {
    for (var d = 0; d < c.childNodes.length; d++) {
      var f = c.childNodes[d];
      if (f.nodeType == 1) {
        if (!a || a.matches(f)) return f;
        if (!b || !b.matches(f)) if ((f = Muse.Utils.firstDescendant(f, a, b))) return f;
      }
    }
    return null;
  };
  Muse.Utils.descendants = function (c, a, b, d) {
    if (!d)
      (d = []),
        (d.forEach = function (a) {
          for (var c = 0; c < this.length; c++) if (a(this[c])) break;
        }),
        (d.forEachTry = function (a) {
          for (var c = 0; c < this.length; c++)
            try {
              if (a(this[c])) break;
            } catch (b) {}
        });
    for (var f = 0; f < c.childNodes.length; f++) {
      var h = c.childNodes[f];
      h.nodeType == 1 && ((!a || a.matches(h)) && d.push(h), (!b || !b.matches(h)) && Muse.Utils.descendants(h, a, b, d));
    }
    return d;
  };
  Muse.Utils.children = function (c, a) {
    return Muse.Utils.descendants(c, a, Muse.Utils.Match.always);
  };
  Muse.Utils.Match = {};
  Muse.Utils.Match.ByClass = function (c) {
    this.cl = c;
  };
  Muse.Utils.Match.ByClass.prototype.matches = function (c) {
    return d(c).hasClass(this.cl);
  };
  Muse.Utils.Match.ByNodeName = function (c) {
    this.nm = c.toLowerCase();
  };
  Muse.Utils.Match.ByNodeName.prototype.matches = function (c) {
    return this.nm == c.nodeName.toLowerCase();
  };
  Muse.Utils.Match.ByFixed = function (c) {
    this.matchResult = c;
  };
  Muse.Utils.Match.ByFixed.prototype.matches = function () {
    return this.matchResult;
  };
  Muse.Utils.Match.byClass = function (c) {
    return new Muse.Utils.Match.ByClass(c);
  };
  Muse.Utils.Match.byNodeName = function (c) {
    return new Muse.Utils.Match.ByNodeName(c);
  };
  Muse.Utils.Match.byFixed = function (c) {
    return new Muse.Utils.Match.ByFixed(c);
  };
  Muse.Utils.Match.always = Muse.Utils.Match.byFixed(!0);
  Muse.Utils.Match.never = Muse.Utils.Match.byFixed(!1);
  Muse.Utils.moveChildren = function (c, a) {
    for (; c.childNodes.length > 0; ) a.appendChild(c.childNodes[0]);
  };
  Muse.Utils.copyChildren = function (c, a) {
    for (var b = 0; b < c.childNodes.length; b++) a.appendChild(c.childNodes[b].cloneNode(!0));
  };
  Muse.Utils.copyChildrenBefore = function (c, a) {
    for (var b = 0; b < c.childNodes.length; b++) a.parentNode.insertBefore(c.childNodes[b].cloneNode(!0), a);
  };
  Muse.Utils.pixelRound = function (c) {
    return Math.floor((c * 100 + 0.5) / 100);
  };
  Muse.Utils.getCurrentHTMLFileName = function (c) {
    var a = document.location.href;
    a.charAt(a.length - 1) == '/' ? (a = 'index') : ((a = a.substring(a.lastIndexOf('/') + 1)), (a = a.indexOf('#') == 0 ? 'index' : a.substring(0, a.lastIndexOf('.'))));
    c && (a += '.html');
    return a;
  };
  Muse.Utils.getPageStyleSheets = function () {
    for (var c = [], a = 0; a < document.styleSheets.length; ++a) {
      var b = document.styleSheets[a],
        d = b.ownerNode ? b.ownerNode : b.owningElement;
      d && (d.id == 'pagesheet' || d.id == 'nomq_pagesheet') && c.push(b);
    }
    return c;
  };
  Muse.Utils.getStyleSheetRulesById = function (c, a) {
    var b = '#' + a.toLowerCase();
    return Muse.Utils.allStyleSheetRules(c, function (a) {
      return a.toLowerCase() == b;
    });
  };
  Muse.Utils.allStyleSheetRules = function (c, a) {
    for (var b = [], d = 0; d < c.length; d++) {
      var f = Muse.Utils.allStyleSheetRulesFromOneSheet(c[d], a);
      f && (b = b.concat(f));
    }
    return b.length ? b : null;
  };
  Muse.Utils.allStyleSheetRulesFromOneSheet = function (c, a) {
    var b = !1,
      j;
    try {
      j = c.cssRules;
    } catch (f) {}
    if (!j) (b = !0), (j = c.rules);
    if (!j) return null;
    for (
      var h = [],
        i = d(window),
        l = function (a) {
          if (4 != a.type) return !1;
          if (1 != a.media.length) {
            for (var c = 0, b = 0; b < a.media.length; b++) {
              var d = null,
                d = 'function' == typeof a.media.item ? a.media.item(b) : a.media[b];
              'print' != d && c++;
            }
            if (1 < c) return !1;
          }
          c = i.data('muse-mq');
          if (!c) return !1;
          for (b = 0; b < a.media.length; b++) if (a.media[b] == c) return !0;
          if (a.media.mediaText && 0 <= a.media.mediaText.indexOf(c.replace(/\s/g, ''))) return !0;
          if (
            a.media.mediaText &&
            ((a = a.media.mediaText
              .replace(/\sand\s/g, '__and__')
              .replace(/\s/g, '')
              .split('__and__')),
            (b = c
              .replace(/\sand\s/g, '__and__')
              .replace(/\s/g, '')
              .split('__and__')),
            a && a.sort && b && b.sort)
          ) {
            'all' == a[0] && a.splice(0, 1);
            a.sort();
            b.sort();
            if (a.length != b.length) return !1;
            for (c = 0; c < a.length; c++) if (a[c] != b[c]) return !1;
            return !0;
          }
          return !1;
        },
        k = 0;
      k < j.length;
      ++k
    ) {
      var m = j[k];
      if (l(m)) {
        if (((m = Muse.Utils.allStyleSheetRulesFromOneSheet(m, a)), null != m)) for (var n = 0; n < m.length; n++) h.push(m[n]);
      } else if (Muse.Utils.isDefined(m.selectorText))
        if (b) a(m.selectorText) && h.push(m);
        else for (var n = m.selectorText.split(/\s*,\s*/), p = 0; p < n.length; p++) a(n[p]) && h.push(m);
    }
    return h.length ? h : null;
  };
  Muse.Utils.getRuleProperty = function (c, a) {
    if (c && c.length) {
      for (var b = c.length - 1; b >= 0; b--) {
        var d = Muse.Utils.getRuleProperty(c[b], a);
        if (d) return d;
      }
      return '';
    }
    if (c.style.getPropertyValue) return c.style.getPropertyValue(a);
    return c.style.getAttribute(a);
  };
  Muse.Utils.toCamelCase = function (c) {
    for (var a = Muse.Utils.toCamelCase.exp; a.test(c); c = c.replace(a, RegExp.$1.toUpperCase()));
    return c;
  };
  Muse.Utils.toCamelCase.exp = /-([a-z])/;
  Muse.Utils.getStyleValue = function (c, a) {
    var b = c.style[Muse.Utils.toCamelCase(a)];
    b || (document.defaultView ? (b = document.defaultView.getComputedStyle(c, '').getPropertyValue(a)) : c.currentStyle && (b = c.currentStyle[Muse.Utils.toCamelCase(a)]));
    b && b.match(/(\d+)px/) && (b = parseInt(b.substring(0, b.length - 2)));
    return b;
  };
  Muse.Utils.getCanvasDirection = function (b, a) {
    var d = b.closest('*[data-rotate]'),
      d = d.length > 0 ? parseFloat(d.data('rotate')) % 360 : 0;
    return {
      dir: (d >= 0 && d <= 45) || (d >= 135 && d <= 225) || (d >= 315 && d < 360) ? a : a === 'horizontal' ? 'vertical' : 'horizontal',
      reverse: a === 'horizontal' ? d >= 135 && d <= 315 : d >= 45 && d <= 225,
    };
  };
  Muse.Utils.urlParam = function (b, a) {
    var d = RegExp('[\\?&]' + a + '=([^&#]*)').exec(b);
    return d ? d[1] : null;
  };
  Muse.Utils.processHyperlink = function (b) {
    var a = b.href,
      g = d(window),
      b = d(b),
      j = b.attr('target');
    if (!j || j == '_self') {
      var f = a.lastIndexOf('/'),
        j = a.lastIndexOf('#'),
        h = b.attr('class').match(/anim_(\w+)/);
      if (h && j > f) {
        var b = g.data('scrollWrapper'),
          i = a.substring(j),
          j = Muse.Utils.getAnchorWithDestination(i).offset(),
          a = h[1],
          l = b || window,
          f = document.documentElement || document.body,
          h = (b ? b.scrollHeight() : f.scrollHeight) - g.height(),
          g = (b ? b.scrollWidth() : f.scrollWidth) - g.width(),
          k = Math.min(h, j.top + (b && !b.isStandard() ? b.scrollTop() : 0)),
          m = Math.min(g, j.left + (b && !b.isStandard() ? b.scrollLeft() : 0)),
          g = function () {
            l.scrollTo(m, k);
            try {
              history.replaceState({});
            } catch (a) {
              if (!d.browser.msie || d.browser.version > 7) window.location.hash = i;
            }
          };
        try {
          history.pushState({}, null, i);
        } catch (n) {}
        if (window.scrollTo || void 0 !== b) {
          var b = b || d(document),
            p = b.scrollLeft(),
            q = b.scrollTop(),
            o = p,
            r = q;
          d({ scrollDistance: 0 }).animate(
            { scrollDistance: 1 },
            {
              duration: 1e3,
              easing: a,
              step: function (a) {
                a != 0 && ((r = a * (k - q)), (o = a * (m - p)), l.scrollTo(p + o, q + r));
              },
              complete: g,
            },
          );
        } else d('html,body').animate({ scrollTop: k, scrollLeft: m }, 1e3, a, g);
        return !1;
      }
    }
    (g = Muse.Utils.urlParam(a, 'devicelock')) && Muse.Utils.createCookie('devicelock', g, 0);
    return !0;
  };
  Muse.Utils.navigateToAnchor = function (b) {
    var a = function () {
      var a = Muse.Utils.getAnchorWithDestination(b);
      if (a.length !== 0) {
        var j = a.offset(),
          f = d(window),
          h = f.data('scrollWrapper'),
          a = h || window,
          i = document.documentElement || document.body,
          l = (h ? h.scrollHeight() : i.scrollHeight) - f.height(),
          f = (h ? h.scrollWidth() : i.scrollWidth) - f.width(),
          l = Math.min(l, j.top + (h && !h.isStandard() ? h.scrollTop() : 0)),
          j = Math.min(f, j.left + (h && !h.isStandard() ? h.scrollLeft() : 0));
        a.scrollTo(j, l);
      }
    };
    if (d('body').hasClass('awaiting_bp_activate_scroll'))
      $window.one('scroll', function () {
        a();
      });
    else a();
  };
  var b = [];
  Muse.Utils.redirectCancelled = !1;
  Muse.Utils.redirectHyperlink = function (c) {
    if (Muse.Utils.redirectCancelled)
      setTimeout(function () {
        Muse.Utils.redirectCancelled = !1;
      }, 0);
    else if (((b = []), Muse.Utils.processHyperlink(c) && !Muse.Utils.isIBE())) {
      var a = d(c).attr('target');
      a || (a = '_self');
      window.open(c.href, a);
    }
  };
  Muse.Utils.redirectHyperlinkInNewTab = function (c, a) {
    if (Muse.Utils.redirectCancelled)
      setTimeout(function () {
        Muse.Utils.redirectCancelled = !1;
      }, 0);
    else {
      b = [];
      thisWindow = window.self;
      var d = window.open(c);
      a ? d.focus() : thisWindow.focus();
    }
  };
  Muse.Utils.isMouseLeftClick = function (b) {
    return b.which == 1;
  };
  Muse.Utils.isMouseMiddleClick = function (b) {
    return b.which == 2;
  };
  Muse.Utils.isRedirectLinkKeyboardAction = function (b) {
    return b.which == 13;
  };
  Muse.Utils.addHyperlinkAnchor = function (c) {
    c = d(c);
    c.bind('mousedown', function (a) {
      (Muse.Utils.isMouseLeftClick(a) || Muse.Utils.isMouseMiddleClick(a)) && b.push(this);
    });
    c.bind('mouseup keyup', function (a) {
      if (Muse.Utils.isMouseLeftClick(a) && b.indexOf(this) != -1) a.ctrlKey || a.metaKey ? Muse.Utils.redirectHyperlinkInNewTab(this.href, a.shiftKey) : Muse.Utils.redirectHyperlink(this);
      else if (Muse.Utils.isMouseMiddleClick(a) && b.indexOf(this) != -1)
        if (d.browser.webkit || (!a.target.href && d.browser.msie)) Muse.Utils.redirectHyperlinkInNewTab(this.href, a.shiftKey);
        else return (b = []), !0;
      else Muse.Utils.isRedirectLinkKeyboardAction(a) && Muse.Utils.redirectHyperlink(this);
      return !1;
    });
    Muse.Utils.isIBE() ||
      c.bind('click', function () {
        return !1;
      });
  };
  Muse.Utils.addHyperlinkBlock = function (c) {
    var a = d(c.parentNode);
    a.bind('mousedown', function (a) {
      (Muse.Utils.isMouseLeftClick(a) || Muse.Utils.isMouseMiddleClick(a)) && b.push(this);
      return !1;
    });
    a.bind('mouseup keyup', function (a) {
      Muse.Utils.isMouseLeftClick(a) && b.indexOf(this) != -1
        ? a.ctrlKey || a.metaKey
          ? Muse.Utils.redirectHyperlinkInNewTab(c.href, a.shiftKey)
          : Muse.Utils.redirectHyperlink(c)
        : Muse.Utils.isMouseMiddleClick(a) && b.indexOf(this) != -1
          ? Muse.Utils.redirectHyperlinkInNewTab(c.href, a.shiftKey)
          : Muse.Utils.isRedirectLinkKeyboardAction(a) && Muse.Utils.redirectHyperlink(c);
      return !1;
    });
    Muse.Utils.isIBE() ||
      a.bind('click', function () {
        return !1;
      });
  };
  Muse.Utils.prepHyperlinks = function (b) {
    d('a.block').each(function () {
      var a = d(this.parentNode);
      Muse.Utils.addHyperlinkBlock(this);
      a.find('a.nonblock').each(function () {
        var a = d(this);
        if (a.data('registeredNonBlockLink') === !0) return !1;
        Muse.Utils.addHyperlinkAnchor(this);
        a.data('registeredNonBlockLink', !0);
      });
    });
    d('a.nonblock').each(function () {
      var a = d(this);
      a.data('registeredNonBlockLink') !== !0 &&
        (a.parent('[class~="sbg"]').length > 0
          ? Muse.Utils.addHyperlinkAnchor(this)
          : (a.attr('class').match(/anim_(\w+)/) || this.href.indexOf('devicelock=') != -1) &&
            d(this).bind('click', function () {
              return Muse.Utils.processHyperlink(this);
            }));
    });
    b && Muse.Utils.enableAnchorLinksActiveState();
  };
  Muse.Utils.pathOnly = function (b) {
    if (!b) return b;
    return b.replace(/#(?:[^#]+)$/, '').replace(/\?(?:[^\?]+)$/, '');
  };
  Muse.Utils.enableAnchorLinksActiveState = function () {
    var b = !1,
      a = [],
      g = d(window),
      j = Muse.Utils.getPageStyleSheets(),
      f = function (a) {
        var b = a.parent('[class~="sbg"]');
        if (a.hasClass('MenuItem') || b.hasClass('MenuItem')) return 'MuseMenuActive';
        if (a.hasClass('Button') || b.hasClass('Button')) return 'ButtonSelected';
        return 'MuseLinkActive';
      },
      h = !1,
      i = function (g) {
        a.splice(0, a.length);
        d('a.nonblock,a.block', g).each(function () {
          Muse.Utils.saveHyperlinkInfo(d(this), f(d(this)), j, b, a);
        });
        a.sort(function (a, b) {
          if (a.from < b.from) return -1;
          if (a.from > b.from) return 1;
          return 0;
        });
        h = !0;
      },
      l = !1,
      k = g.data('scrollWrapper'),
      m = k || g,
      n = null,
      p = function () {
        l = !1;
        if (!h) {
          var g = d('#page');
          b = g.outerWidth() / g.outerHeight() > 2;
          i(n);
        }
        var g = b ? m.scrollLeft() : m.scrollTop(),
          j;
        a: {
          var p = 0;
          j = a.length;
          for (var q; p < j; p++)
            if (((q = a[p]), q.from <= g && g <= q.to)) {
              j = p;
              break a;
            }
          j = -1;
        }
        var x,
          s,
          p = Math.max(0, j);
        for (j = Math.min(j + 2, a.length); p < j; p++)
          if (((x = a[p]), (q = x.$elem.offset().left + (k && !k.isStandard() ? k.scrollLeft() : 0)), (s = x.$elem.offset().top + (k && !k.isStandard() ? k.scrollTop() : 0)), x.from != (b ? q : s))) {
            i(n);
            break;
          }
        p = 0;
        for (j = a.length; p < j; p++) {
          x = a[p];
          q = x.from <= g && g <= x.to;
          x = x.hyperLinks;
          s = void 0;
          for (var w = 0; w < x.length; w++) (s = f(x[w])), q && !x[w].hasClass(s) ? x[w].addClass(s) : !q && x[w].hasClass(s) && x[w].removeClass(s);
        }
      },
      q = function () {
        l || ((l = !0), Muse.Utils.requestAnimationFrame(p));
      };
    (k = g.data('scrollWrapper')) ? k.registerUpdateCallback(q) : g.scroll(q);
    d('body').on('muse_bp_activate', function (a, b, c) {
      h = !1;
      n = c;
      q();
    });
    0 == d('.breakpoint').length && p();
  };
  Muse.Utils.getAnchorWithDestination = function (b) {
    if (!b || !b.replace) return d(b);
    if (b.match(/\//g)) return d();
    return d(b.replace(/([\.\:])/gi, '\\$1'));
  };
  Muse.Utils.saveHyperlinkInfo = function (b, a, g, j, f) {
    var h = b.attr('href'),
      i = Muse.Utils.pathOnly(h),
      l = -1,
      k = b.attr('target'),
      m = window.location.href.replace(/#.*$/i, '');
    if (h && -1 != h.indexOf('#') && !(k && k != '_self') && !(0 <= i.indexOf('/')) && (m.charAt(m.length - 1) == '/' && (m += 'index.html'), -1 != m.indexOf('/' + i, m.length - i.length - 1))) {
      var i = d(window).data('scrollWrapper'),
        n = h.substring(h.lastIndexOf('#')),
        b = b.parent('[class~="sbg"]').length > 0 || b.hasClass('block') ? b.parent() : b,
        p = '#' + b.attr('id'),
        a = '.' + a;
      if (
        null !==
        Muse.Utils.allStyleSheetRules(g, function (b) {
          return 0 <= b.indexOf(p + a) || 0 <= b.indexOf(a + p);
        })
      ) {
        k = 0;
        for (m = f.length; k < m; k++)
          if (f[k].href == h) {
            l = k;
            break;
          }
        if (-1 == l) {
          g = Muse.Utils.getAnchorWithDestination(n);
          if (g.length === 0) return;
          k = i && !i.isStandard();
          j = Math.floor(j ? g.offset().left + (k ? i.scrollLeft() : 0) : g.offset().top + (k ? i.scrollTop() : 0));
          i = Number.MAX_VALUE;
          k = 0;
          for (m = f.length; k < m; k++)
            if (f[k].href != h && f[k].from == j) {
              l = k;
              break;
            }
          if (-1 == l) {
            k = 0;
            for (m = f.length; k < m; k++) {
              l = f[k];
              if (l.from < j && j < l.to) {
                i = l.to;
                l.to = j - 1;
                break;
              }
              l.from <= i && (i = l.from - 1);
            }
            f.push({ hyperLinks: [], from: j, to: i, $elem: g, href: h });
            l = f.length - 1;
          }
        }
        f[l].hyperLinks.push(b);
      }
    }
  };
  Muse.Utils.isIBE = function () {
    return Muse.Utils.readCookie('inbrowserediting') == 'true';
  };
  Muse.Utils.includeMEditableTags = function (b) {
    if (!b || b.length == 0 || !Muse.Utils.isIBE()) return b;
    return b.map(function () {
      var a = d(this).parent('div[contenteditable][region-id][template][data-ice-editableid][data-ice-editable]');
      return a && a.length ? a.get() : this;
    });
  };
  Muse.Utils.getNaturalWidth = function (b) {
    var a = -1;
    b.naturalWidth != null
      ? (a = b.naturalWidth)
      : b.runtimeStyle
        ? ((b.runtimeStyle.width = 'auto'),
          (b.runtimeStyle.height = 'auto'),
          (b.runtimeStyle.borderWidth = '0'),
          (b.runtimeStyle.padding = '0'),
          (a = b.offsetWidth),
          (b.runtimeStyle.width = ''),
          (b.runtimeStyle.height = ''),
          (b.runtimeStyle.borderWidth = ''),
          (b.runtimeStyle.padding = ''))
        : ((b = b.cloneNode(!0)),
          (b.className = ''),
          (b.style.width = 'auto !important'),
          (b.style.height = 'auto !important'),
          (b.style.borderWidth = '0 !important'),
          (b.style.padding = '0 !important'),
          (a = b.width));
    return a;
  };
  Muse.Utils.getNaturalHeight = function (b) {
    var a = -1;
    b.naturalHeight != null
      ? (a = b.naturalHeight)
      : b.runtimeStyle
        ? ((b.runtimeStyle.width = 'auto'),
          (b.runtimeStyle.height = 'auto'),
          (b.runtimeStyle.borderWidth = '0'),
          (b.runtimeStyle.padding = '0'),
          (a = b.offsetHeight),
          (b.runtimeStyle.width = ''),
          (b.runtimeStyle.height = ''),
          (b.runtimeStyle.borderWidth = ''),
          (b.runtimeStyle.padding = ''))
        : ((b = b.cloneNode(!0)),
          (b.className = ''),
          (b.style.width = 'auto !important'),
          (b.style.height = 'auto !important'),
          (b.style.borderWidth = '0 !important'),
          (b.style.padding = '0 !important'),
          (a = b.height));
    return a;
  };
  Muse.Utils.pieLoading = !1;
  Muse.Utils.pieFunctionQueue = [];
  Muse.Utils.needPIE = function (b) {
    if (Muse.Utils.havePIE) b();
    else if ((Muse.Utils.pieFunctionQueue.push(b), !Muse.Utils.pieLoading))
      (Muse.Utils.pieLoading = !0),
        (b = 'scripts/pie.js'),
        b[0] == '/' && ((b = location.pathname.indexOf('.html') != -1 ? location.pathname.substring(0, location.pathname.lastIndexOf('/')) + b : location.pathname + b), (b = b.replace(/\/+/g, '/'))),
        d.ajax({
          url: b,
          dataType: 'script',
          complete: function () {
            if (Muse.Utils.isDefined(window.PIE)) {
              Muse.Utils.havePIE = !0;
              Muse.Utils.pieLoading = !1;
              for (var a = 0; a < Muse.Utils.pieFunctionQueue.length; ++a) Muse.Utils.pieFunctionQueue[a]();
            }
          },
        });
  };
  Muse.Utils.transformMarkupToFixBrowserProblemsPreInit = function () {
    Muse.Utils.fixSVGImages();
    Muse.Utils.maintainFluidSVGsAspectRatio();
    Muse.Utils.addProtocolToVimeoYoutubeIfNeeded();
    d.browser.msie
      ? (d('html').addClass('ie'), d.browser.version < 8 && Muse.Utils.changeLItoDIVs(), d.browser.version < 9 && (Muse.Utils.monitorCheckboxes(), Muse.Utils.addRoundedCorners()))
      : d.browser.SafariMobile && d('body').css('-webkit-text-size-adjust', 'none');
  };
  Muse.Utils.monitorCheckboxes = function () {
    var b = function (a) {
      'checked' == a.attr('checked') ? a.removeClass('not_checked').addClass('checked') : a.removeClass('checked').addClass('not_checked');
    };
    d('.fld-checkbox input[type=checkbox]')
      .each(function () {
        b(d(this));
      })
      .click(function () {
        b(d(this));
      });
    d('.fld-radiobutton input[type=radio]')
      .each(function () {
        b(d(this));
      })
      .click(function () {
        d('.fld-radiobutton input[type=radio]', d(this).closest('form')).each(function () {
          b(d(this));
        });
      });
  };
  Muse.Utils.transformMarkupToFixBrowserProblems = function () {
    Muse.Utils.havePIE = !1;
    d.browser.msie &&
      d.browser.version <= 9 &&
      (d.browser.version <= 9 && (Muse.Utils.addGradientFill(), Muse.Utils.addShadows()),
      d.browser.version < 9 && (Muse.Utils.applyIEFilterToPNGImages(), Muse.Utils.addRGBA(), Muse.Utils.removeEdgeAnimationBorderForIE78()));
    ((d.browser.msie && d.browser.version < 9) || d.browser.webkit) && Muse.Utils.insertEmptyDivAfterPinnedColumnElements();
    Muse.Utils.fixTransformRotations();
    Muse.Utils.fixImageFramesWithRoundedCorners();
    typeof window.matchMedia === 'undefined' && typeof window.msMatchMedia === 'undefined' && d('html').addClass('nomediaqueries');
    var b = d(window).data('musePolyfill.bgSize');
    null != b && b.initialize(d('.museBGSize'));
    window.location.hash && Muse.Utils.navigateToAnchor(window.location.hash);
  };
  Muse.Utils.fixSVGImages = function () {
    var b = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'),
      a = d('html');
    b ||
      (a.addClass('nosvg'),
      d('body img').each(function () {
        var a = d(this),
          b = a.data('mu-svgfallback');
        b && (a.data('src', b), a.attr('src', b));
      }));
  };
  Muse.Utils.maintainFluidSVGsAspectRatio = function () {
    var b = d('.svg_mar');
    if (0 != b.length) {
      var a = function () {
          b.each(function () {
            var a = d(this),
              b = a.data('image-width'),
              c = a.data('image-height');
            0 < b && 0 < c && a.css('height', (a.width() * c) / b);
          });
        },
        g = function (a) {
          b = d('.svg_mar', a.length ? a : null);
        };
      d(window).resize(a);
      d('body').on('muse_bp_activate', function (b, c, d) {
        g(d);
        a();
      });
      g(d('.breakpoint.active'));
      a();
    }
  };
  Muse.Utils.addProtocolToVimeoYoutubeIfNeeded = function () {
    var b = /^\/\/(?:player\.vimeo\.com|www\.youtube\.com)/gi;
    window &&
      window.location &&
      window.location.protocol &&
      window.location.protocol.indexOf &&
      0 <= window.location.protocol.indexOf('file') &&
      d('iframe').each(function () {
        var a = d(this),
          g = a.attr('src'),
          j = a.attr('data-src');
        g && j && 'about:blank' == g && j.match && j.match(b) && a.attr('data-src', 'https:' + j);
        !j && g && 'about:blank' != g && g.match && g.match(b) && a.attr('src', 'https:' + g);
      });
  };
  Muse.Utils.applyIEFilterToPNGImages = function () {
    d.browser.msie &&
      d.browser.version < 9 &&
      d('body *')
        .not('.museBgSizePolyfill img,.f3s_top,.f3s_mid,.f3s_bot')
        .each(function () {
          var b = d(this);
          if (!b.data('mu-ie-matrix') && (b.css('background-image').match(/\b.png/i) || (this.nodeName && this.nodeName.toLowerCase() == 'img' && b.attr('src').match(/\b.png/i)))) {
            var a = b.css('filter');
            b.css(
              'filter',
              a
                ? a + ' progid:DXImageTransform.Microsoft.gradient(startColorstr=#00FFFFFF,endColorstr=#00FFFFFF)'
                : 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00FFFFFF,endColorstr=#00FFFFFF)',
            );
          }
        });
  };
  Muse.Utils.insertEmptyDivAfterPinnedColumnElements = function () {
    d('.pinned-colelem').each(function () {
      d("<div class='colelem'/>").insertAfter(d(this));
    });
  };
  Muse.Utils.addGradientFill = function () {
    d('.gradient').each(function () {
      var b = this;
      Muse.Utils.needPIE(function () {
        PIE.attach(b);
      });
    });
  };
  Muse.Utils.addShadows = function () {
    d('.shadow').each(function () {
      var b = this,
        a = d(b);
      Muse.Utils.needPIE(function () {
        a.data('mu-ie-matrix') || PIE.attach(b);
      });
    });
  };
  Muse.Utils.fixImageFramesWithRoundedCorners = function () {
    Muse.Browser.Features.checkCSSFeature('border-radius') &&
      Muse.Browser.Features.checkCSSFeature('-webkit-border-radius') &&
      d('.rounded-corners').each(function () {
        if (d(this).hasClass('clip_frame')) {
          var b = Muse.Utils.firstDescendant(this, Muse.Utils.Match.byNodeName('img'));
          b && d(b).wrap('<div class="clip_frame"></div>');
        }
      });
  };
  Muse.Utils.addRoundedCorners = function () {
    d('.rounded-corners').each(function () {
      var b = this;
      Muse.Utils.needPIE(function () {
        var a = d(b);
        if (!a.data('mu-ie-matrix')) {
          var g = a.css('filter');
          if (!g || !(g.toLowerCase().indexOf('opacity') > 0 && g.indexOf('=100') < 0)) {
            if (
              b.childNodes.length &&
              !Muse.Browser.Features.checkCSSFeature('border-radius') &&
              (g = Muse.Utils.firstChild(b, Muse.Utils.Match.byNodeName('img'))) &&
              g.nodeName.toLowerCase() == 'img'
            ) {
              var g = d(g),
                j = g.attr('src'),
                f = a.css('background-color') + ' ',
                h = g.css('margin-left');
              if (h == '0px' || h == 'auto') h = g.css('padding-left');
              var i = g.css('margin-top');
              if (i == '0px' || i == 'auto') i = g.css('padding-top');
              if ((h == '0px' || h == 'auto') && (i == '0px' || i == 'auto')) a.addClass('museBGSize'), a.css('background-size', 'cover');
              g.css('visibility', 'hidden');
              a.css('background', f + 'url(' + j + ') no-repeat ' + h + ' ' + i);
            }
            PIE.attach(b);
          }
        }
      });
    });
  };
  Muse.Utils.addRGBA = function () {
    d('.rgba-background').each(function () {
      var b = this;
      Muse.Utils.needPIE(function () {
        PIE.attach(b);
      });
    });
  };
  Muse.Utils.resizeHeight = function (b) {
    var a = {},
      g = function (g) {
        var f = g.parent().hasClass('sbg') ? g.parent() : g,
          g = d(g.children()[0]);
        'fixed' != g.css('position') && f.height(g.outerHeight());
        f = g.attr('id') || 'always_watch';
        a[f] ||
          ((a[f] = !0),
          g.watch('height', function () {
            var a = d(this);
            'fixed' != a.css('position') && a.closest(b).height(a.outerHeight());
          }));
      };
    if (0 < d('.breakpoint').length)
      d('body').on('muse_bp_activate', function (a, f, h) {
        d(b, h).each(function () {
          d(this).css('height', 'auto');
          g(d(this));
        });
      });
    else
      d(b).each(function () {
        g(d(this));
      });
  };
  Muse.Utils.removeEdgeAnimationBorderForIE78 = function () {
    d('.animationContainer').each(function () {
      d(this)
        .parent()
        .html(function (b, a) {
          return a.replace(/><\/iframe>$/gi, ' frameBorder="0"></iframe>');
        });
    });
  };
  Muse.Utils.initializeAnimations = function (b) {
    var a = function (a) {
      if (!Muse.Utils.isIBE() && !0 === b) {
        var j = a.contents();
        d('#report-abuse', j).remove();
        d('#report-abuse-spacer', j).remove();
      }
      a.removeClass('an_invi');
    };
    d('.animationContainer').each(function () {
      var b = d(this);
      Muse.Utils.isIBE() || (this.contentDocument && 'complete' == this.contentDocument.readyState)
        ? a(b)
        : b.load(function () {
            a(b);
          });
    });
  };
  Muse.Utils.fixTransformRotations = function () {
    Muse.Browser.Features.checkCSSFeature('transform') ||
      d('*[data-mu-ie-matrix]').each(function () {
        var b = d(this),
          a = b.parent(),
          g = Math.round(b.data('mu-ie-matrix-dx')),
          j = Math.round(b.data('mu-ie-matrix-dy')),
          f = a.innerHeight(),
          h = a.innerWidth();
        b.css({
          filter: function (a, d) {
            if (d) return d + ' ' + b.data('mu-ie-matrix');
            return b.data('mu-ie-matrix');
          },
          'margin-bottom': '-=' + j,
        }).removeClass('shadow');
        a.css({ 'margin-bottom': '-=' + (a.innerHeight() - f), 'margin-right': '-=' + (a.innerWidth() - h) });
        b.hasClass('actAsDiv')
          ? (b.wrap('<span class="actAsDiv rotateWrapper"></span>'), b.parent().css('float', b.css('float')))
          : b.hasClass('actAsInlineDiv')
            ? b.wrap('<span class="actAsInlineDiv rotateWrapper"></span>')
            : b.wrap('<div class="rotateWrapper"></div>');
        b.parent().css({ top: j, left: g, position: 'relative', 'margin-bottom': j });
      });
  };
  Muse.Utils.fullPage = function (b) {
    var a = d(window).data('stickyFooter');
    if (0 == d(b).closest('.breakpoint').length) Muse.Assert.assert(0 == d('.breakpoint').length, 'Page is outside a breakpoint node.'), a.init(d(b));
    else {
      var g = function (g) {
        Muse.Assert.assert(1 == g.length, 'Cannot initialize sticky footer - invalid breakpoint node.');
        a.init(d(b, g));
      };
      g(d('.breakpoint.active'));
      d('body').on('muse_bp_activate', function (a, b, c) {
        Muse.Utils.requestAnimationFrame(function () {
          g(c);
        });
      });
    }
  };
  Muse.Utils.endsWith = function (b, a) {
    if (!b || !a) return !1;
    Muse.Assert.assert('string' == typeof b, 'Invalid type for "str" argument - expected string.');
    Muse.Assert.assert('string' == typeof a, 'Invalid type for "ending" argument - expected string.');
    return b.substring(b.length - a.length) == a;
  };
  Muse.Utils.firstDefined = function () {
    for (var b = 0; b < arguments.length; b++) if (Muse.Utils.isDefined(arguments[b])) return arguments[b];
  };
  Muse.Utils.isDefined = function (b) {
    return 'undefined' != typeof b;
  };
  Muse.Utils.getCSSIntValue = function (b, a) {
    return Muse.Utils.tryParse(b.css(a), parseInt, 0);
  };
  Muse.Utils.tryParse = function (b, a, d) {
    if (!Muse.Utils.isDefined(b)) return d;
    b = a(b);
    return !isNaN(b) ? b : d;
  };
  Muse.Utils.changeLItoDIVs = function () {
    var b = function () {
      var a = d(this),
        b = d('<div/>');
      b.addClass(a.attr('class'));
      b.attr('id', a.attr('id'));
      b.append(a.contents());
      a.replaceWith(b);
    };
    d('ul').each(function () {
      d(this).find('li').each(b);
    });
    d('ul').each(b);
  };
  Muse.Utils._initWidgetQueue = null;
  Muse.Utils._hasBPListener = !1;
  Muse.Utils.initWidget = function (b, a, g) {
    if (0 == d('.breakpoint').length)
      d(b).each(function () {
        g(d(this));
      });
    else {
      for (var j = 0; j < a.length; j++) {
        var f = a[j];
        if (!Muse.Utils._initWidgetQueue) Muse.Utils._initWidgetQueue = {};
        Muse.Utils._initWidgetQueue[f] || (Muse.Utils._initWidgetQueue[f] = []);
        Muse.Utils._initWidgetQueue[f].push({ id: b, fn: g });
      }
      if (Muse.Utils._initWidgetQueue && !Muse.Utils._hasBPListener) {
        var h = function (a, b, c, g) {
          a = c.attr('id');
          Muse.Assert.assert(a, 'Invalid breakpoint node - missing the ID attribute');
          a = '#' + a;
          if (Muse.Utils._initWidgetQueue[a]) {
            for (; Muse.Utils._initWidgetQueue[a].length; ) if (((b = Muse.Utils._initWidgetQueue[a].shift()), (b = b.fn(d(b.id, c))))) (b.$bp = c), (b.breakpoint = g);
            Muse.Utils.showWidgetsWhenReady(c);
            delete Muse.Utils._initWidgetQueue[a];
            var c = !0,
              f;
            for (f in Muse.Utils._initWidgetQueue) {
              c = !1;
              break;
            }
            if (c) d('body').off('muse_bp_activate', h), (Muse.Utils._hasBPListener = !1);
          }
        };
        d('body').on('muse_bp_activate', h);
        Muse.Utils._hasBPListener = !0;
      }
    }
  };
  Muse.Utils.showWidgetsWhenReady = function (b) {
    d('.disn', b).removeClass('disn');
    d('.invi', b).removeClass('invi');
    d('.widget_invisible', b).removeClass('widget_invisible');
  };
  Muse.Utils.detachIframesAndObjectsToPauseMedia = function (b) {
    var a = [],
      g = [];
    d('iframe, object', b).each(function () {
      var b = d(this);
      if (!b.is('object') || !(d.browser.msie && d.browser.version < 9)) {
        if (b.is('iframe')) {
          var c = b.prop('src');
          if ('' == c || !c || !c.indexOf) return;
          if (0 <= c.indexOf('vimeo.com')) {
            Muse.Utils.VimeoVideoHelper.pause(b);
            g.push({
              $node: b,
              playFn: function (a) {
                Muse.Utils.VimeoVideoHelper.seekTo(a, 0);
                Muse.Utils.VimeoVideoHelper.isAutoPlay(a) && Muse.Utils.VimeoVideoHelper.play(a);
              },
            });
            return;
          }
        }
        c = {};
        c.$next = b.next();
        c.$parent = b.parent();
        d.browser.msie ? ((c.html = b.wrap('<div id="deleteMeWrapper"/>').parent().html()), b.remove(), c.$parent.children('div #deleteMeWrapper').remove()) : ((c.$node = b.clone()), b.remove());
        a.push(c);
      }
    });
    a.length && b.data('detached', a);
    g.length && b.data('paused', g);
    d('video', b).each(function () {
      if (d.browser.msie && d.browser.version == 9 && this.pause && this.getAttribute('autoplay') && this.readyState != 4)
        d(this).one('play', function () {
          this.pause();
        });
      else this.pause && !this.paused && this.pause();
    });
  };
  Muse.Utils.attachIframesAndObjectsToResumeMedia = function (b) {
    var a = b.data('detached');
    if (a) {
      for (var g = a.length - 1; g >= 0; g--) {
        var j = a[g];
        !j.$next || j.$next.length == 0 ? j.$parent.append(j.$node ? j.$node : j.html) : j.$next.before(j.$node ? j.$node : j.html);
        j.$next = j.$parent = j.$node = j.html = void 0;
      }
      b.data('detached', null);
    }
    if ((a = b.data('paused'))) for (g = 0; g < a.length; g++) (j = a[g]), j.playFn(j.$node);
    d('iframe', b).each(function () {
      var a = d(this),
        b = a.attr('src'),
        c = a.data('src');
      'about:blank' == b && c && a.attr('src', c);
    });
    d('video', b).each(function () {
      if (this.play && this.getAttribute('autoplay') && this.paused) (this.currentTime = 0), this.play();
    });
  };
  Muse.Utils.VimeoVideoHelper = (function (b) {
    var a = [],
      d = function (a, b) {
        if (!0 == a.data('isReady')) b();
        else {
          var c = a.data('readyQueue');
          c || (c = []);
          c.push(b);
          a.data('readyQueue', c);
        }
      },
      j = function (b, c, d, g) {
        var f = b[0].contentWindow;
        g && a.push({ source: f, method: c, callbackFn: g });
        c = '"method": "' + c + '"';
        'undefined' != typeof d && null !== d && (c += '"value":"' + d + '"');
        f.postMessage('{' + c + '}', b.data('origin'));
      },
      f = function (a) {
        data = null;
        try {
          JSON && JSON.parse && (data = JSON.parse(a.data));
        } catch (d) {}
        var g = null;
        data && data.player_id && (g = b('#' + data.player_id));
        (!g || !g.length) &&
          b('iframe').each(function () {
            if (this.contentWindow == a.source) return (g = b(this)), !1;
          });
        return g;
      },
      h = function (b) {
        var c = null;
        try {
          JSON && JSON.parse && (c = JSON.parse(b.data));
        } catch (d) {}
        if (c) {
          if ('ready' == c.event) {
            var g = f(b);
            g.data('isReady', !0);
            g.data('origin', b.origin);
            var n = g.data('readyQueue');
            if (n && n.length) for (var h = 0; h < n.length; h++) n[h]();
            g.data('readyQueue', null);
          }
          for (h = 0; h < a.length; ) (g = a[h]), g.source == b.source && g.method == c.method ? (g.callbackFn(c.value), a.splice(h, 1)) : h++;
        }
      };
    window.addEventListener ? window.addEventListener('message', h, !1) : window.attachEvent('onmessage', h, !1);
    h = function () {};
    h.prototype.play = function (a) {
      d(a, function () {
        j(a, 'play');
      });
    };
    h.prototype.pause = function (a) {
      d(a, function () {
        j(a, 'pause');
      });
    };
    h.prototype.isPaused = function (a, b) {
      d(a, function () {
        j(a, 'paused', null, b);
      });
    };
    h.prototype.seekTo = function (a, b) {
      d(a, function () {
        j(a, 'seekTo', b);
      });
    };
    h.prototype.isAutoPlay = function (a) {
      a = a.attr('src').split('?');
      a.shift();
      for (var a = a.join('?').split('&'), b = 0; b < a.length; b++) if (a[b].match(/autoplay\s*=\s*1/gi)) return !0;
      return !1;
    };
    return new h();
  })(d);
  (function (b) {
    b(window);
    var a = b('html'),
      d = ['src'],
      j = ['hidpi-src', 'src'],
      f = b('.hidpi_button'),
      h = function () {
        this._mode = 'standard';
      };
    h.swapSources = function (a, b, c) {
      var d = a.attr('data-' + b);
      d &&
        !('src' == b && a.hasClass('ImageInclude') && a.attr('src').indexOf('images/blank.gif') == a.attr('src').length - 16 && a.parents('.SlideShowWidget').length) &&
        ('src' == c && !a.attr('data-' + c) && a.attr('data-' + c, a.attr('src')), a.attr('src', d));
    };
    h.isRetina = (function () {
      if (1.5 <= window.devicePixelRatio) return !0;
      if (window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)').matches)
        return !0;
      return !1;
    })();
    h.shouldUseCookie = 0 < f.length;
    h.getResolutionPreference = function () {
      return Muse.Utils.readCookie('museresolution');
    };
    h.saveResolutionPreference = function (a) {
      Muse.Utils.createCookie('museresolution', a);
    };
    h.prototype.initializeHiDPIButton = function (a) {
      if (h.isRetina) {
        var d = this;
        f.filter(function () {
          return !b(this).data('initialized');
        })
          .each(function () {
            b(this).data('initialized', !0);
          })
          .removeClass('unavailable')
          .click(function () {
            switch (d._mode) {
              case 'standard':
                d.hidpiMode(a);
                break;
              case 'hidpi':
                d.standardMode(a);
                break;
              default:
                Muse.Assert.assert(!1, 'Unknown mode: ' + d._mode);
            }
          });
      }
    };
    h.prototype.activate = function (a) {
      this.initializeHiDPIButton(a);
      h.isRetina && (!h.shouldUseCookie || 'hidpi' == h.getResolutionPreference()) ? this.hidpiMode(a) : this.standardMode(a);
    };
    h.prototype.getCurrentMode = function () {
      return this._mode;
    };
    h.prototype.setCurrentMode = function (a) {
      this._mode = a;
      if (h.isRetina) {
        switch (a) {
          case 'standard':
            f.removeClass('on').addClass('off');
            break;
          case 'hidpi':
            f.removeClass('off').addClass('on');
            break;
          default:
            Muse.Assert.assert(!1, 'Unknown mode: ' + a);
        }
        h.shouldUseCookie && h.saveResolutionPreference(a);
      }
    };
    h.prototype.standardMode = function (d) {
      this.setCurrentMode('standard');
      a.removeClass('hidpi');
      b('img', d).each(function () {
        h.swapSources(b(this), 'src', 'hidpi-src');
      });
    };
    h.prototype.hidpiMode = function (d) {
      this.setCurrentMode('hidpi');
      a.addClass('hidpi');
      b('img', d).each(function () {
        h.swapSources(b(this), 'hidpi-src', 'src');
      });
    };
    h.prototype.getDataSrcAttrName = function () {
      return 'standard' == this._mode ? d : j;
    };
    b(window).data('ResolutionManager', new h());
  })(d);
  Muse.Utils.detectScreenResolution = function () {
    var b = d(window).data('ResolutionManager');
    if (0 < d('.breakpoint').length) {
      var a = {};
      d('body').on('muse_bp_activate', function (d, j, f) {
        d = f.attr('id');
        a[d] || (b.activate(f), (a[d] = !0));
      });
    } else b.activate();
  };
  Muse.Utils.createCookie = function (b, a, d) {
    if (d) {
      var j = new Date();
      j.setTime(j.getTime() + d * 864e5);
      d = '; expires=' + j.toGMTString();
    } else d = '';
    document.cookie = b + '=' + a + d + '; path=/';
  };
  Muse.Utils.readCookie = function (b) {
    b += '=';
    for (var a = document.cookie.split(';'), d = 0; d < a.length; d++) {
      for (var j = a[d]; j.charAt(0) == ' '; ) j = j.substring(1, j.length);
      if (j.indexOf(b) == 0) return j.substring(b.length, j.length);
    }
    return null;
  };
  Muse.Utils.eraseCookie = function (b) {
    createCookie(b, '', -1);
  };
  Muse.Browser = {};
  Muse.Browser.domPrefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'];
  Muse.Browser.Features = {};
  Muse.Browser.Features.Touch = (function () {
    if (navigator.maxTouchPoints > 0 || (window.matchMedia && window.matchMedia('(-moz-touch-enabled)').matches))
      return {
        Start: 'pointerDown',
        End: 'pointerUp',
        Move: 'pointerMove',
        Listener: function (a) {
          return function (b) {
            var c = b.originalEvent || b;
            if (c.pointerType != c.POINTER_TYPE_MOUSE) return a.apply(this, arguments);
          };
        },
      };
    else
      for (var b = 0, a = Muse.Browser.domPrefixes.length; b < a; b++) {
        var d = Muse.Browser.domPrefixes[b];
        if (d + 'MaxTouchPoints' in navigator && navigator[d + 'MaxTouchPoints'])
          return (
            (d = d.toUpperCase()),
            {
              Start: d + 'PointerDown',
              End: d + 'PointerUp',
              Move: d + 'PointerMove',
              Listener: function (a) {
                return function (b) {
                  var c = b.originalEvent || b;
                  if (c.pointerType != c[d + 'POINTER_TYPE_MOUSE']) return a.apply(this, arguments);
                };
              },
            }
          );
      }
    try {
      return (
        document.createEvent('TouchEvent'),
        {
          Start: 'touchstart',
          End: 'touchend',
          Move: 'touchmove',
          Listener: function (a) {
            return a;
          },
        }
      );
    } catch (j) {}
    return !1;
  })();
  Muse.Browser.Features.checkCSSFeature = function (b, a) {
    var d = Muse.Utils.toCamelCase(b),
      a = a || document.createElement('div');
    if (d in a.style) return !0;
    for (var d = d.charAt(0).toUpperCase() + d.substr(1), j = 0, f = Muse.Browser.domPrefixes.length; j < f; j++) if (Muse.Browser.domPrefixes[j] + d in a.style) return Muse.Browser.domPrefixes[j];
    return !1;
  };
  Muse.Browser.Features.checkCSSValueCompatibility = function (b, a) {
    var d = document.createElement('div'),
      b = Muse.Utils.toCamelCase(b),
      j = Muse.Browser.Features.checkCSSFeature(b, d);
    if (j) j !== !0 && (b = j + b.charAt(0).toUpperCase() + b.substr(1));
    else return !1;
    j = d.style[b];
    d.style[b] = a;
    if (d.style[b] !== j || a === j) return !0;
    for (var f = 0; f < Muse.Browser.domPrefixes.length; f++) {
      var h = '-' + Muse.Browser.domPrefixes[f].toLowerCase() + '-' + a;
      d.style[b] = h;
      if (d.style[b] !== j) return Muse.Browser.domPrefixes[f];
    }
    return !1;
  };
  Muse.Browser.Bugs = {};
  Muse.Browser.Bugs.ClearNeedsOuterWidth = (function () {
    var b = document.createElement('div');
    b.id = 'mbbcnow00';
    b.innerHTML =
      '<div>a</div><style type="text/css">#mbbcnow00{position:absolute;top:-9999px;left:-9999px;visibility:hidden;} #mbbcnow01{width:1px;margin-right:-9999px;float:left} #mbbcnow02{clear:left;}</style>';
    var a = document.createElement('div'),
      d = document.createElement('div');
    document.body.appendChild(b);
    b.appendChild(a);
    b.appendChild(d);
    a.innerHTML = 'a';
    a.id = 'mbbcnow01';
    d.innerHTML = 'b';
    d.id = 'mbbcnow02';
    a = d.getBoundingClientRect().top - a.getBoundingClientRect().top;
    document.body.removeChild(b);
    return a < 1;
  })();
  Muse.Browser.Bugs.CannotHandleClearBoth = d.browser.msie && 7 == d.browser.version;
  Muse.Browser.Bugs.ScrollWidthHeightIncludesBorder = (function () {
    var b = !1,
      a = d('<div>')
        .css({ border: '1px solid #000000;', width: 100, height: 100, position: 'absolute', top: -99999, left: -99999, padding: 0, margin: 0, overflow: 'auto' })
        .appendTo(document.body)[0];
    a.scrollHeight !== a.clientHeight && (b = !0);
    d(a).remove();
    return b;
  })();
  (function (b) {
    var a = b(window),
      d = b('body'),
      j = function () {
        this.$verticalSpacer = null;
        this.enabled = !1;
        this.contentBelowSpacer = this.contentAboveSpacer = this.minHeight = 0;
      };
    j.prototype.init = function (f) {
      this.$verticalSpacer = b('.verticalspacer', f);
      if (0 != this.$verticalSpacer.length) {
        this.enabled = !0;
        var h = Muse.Utils.getCSSIntValue(this.$verticalSpacer, 'min-height');
        this.$verticalSpacer.css('min-height', '');
        this.minHeight = Muse.Utils.getCSSIntValue(this.$verticalSpacer, 'min-height');
        this.$verticalSpacer.css('min-height', h);
        this.pageMinHeight = Muse.Utils.getCSSIntValue(f, 'padding-top') + Muse.Utils.getCSSIntValue(f, 'min-height') + Muse.Utils.getCSSIntValue(f, 'padding-bottom');
        this.contentAboveSpacer = parseInt(this.$verticalSpacer.data('content-above-spacer'));
        this.contentBelowSpacer = parseInt(this.$verticalSpacer.data('content-below-spacer'));
        var n = this,
          i = !0,
          j = [],
          l = !0;
        a.resize(function () {
          if (i) {
            var b = a.width();
            l
              ? (j.splice(0, j.length),
                j.push(b),
                (l = !1),
                setTimeout(function () {
                  l = !0;
                }, 200))
              : j[j.length - 1] != b && (j.push(b), 3 < j.length && j[j.length - 3] == j[j.length - 1] && (d.addClass('always_vert_scroll'), (i = !1)));
          }
          n.doUpdate();
        });
        this.doUpdate();
      }
    };
    j.prototype.doUpdate = function () {
      if (this.enabled && 0 != this.$verticalSpacer.length) {
        var f = Math.round(this.contentAboveSpacer - this.$verticalSpacer.offset().top),
          h = this.$verticalSpacer.offset().top + this.contentBelowSpacer < this.pageMinHeight;
        this.$verticalSpacer.css({
          height:
            'calc(' + (b.browser.SafariMobile ? a.height() + 'px' : '100vh') + ' - ' + (this.contentAboveSpacer + this.contentBelowSpacer) + 'px ' + (0 < f ? ' + ' : ' - ') + Math.abs(f) + 'px)',
          'min-height': h ? f + this.minHeight + 'px' : '',
        });
        f = (h ? f + this.minHeight : Muse.Utils.getCSSIntValue(this.$verticalSpacer, 'min-height')) < this.$verticalSpacer.height();
        h = !1;
        f && !d.hasClass('no_vert_scroll') ? (d.addClass('no_vert_scroll'), (h = !0)) : !f && d.hasClass('no_vert_scroll') && (d.removeClass('no_vert_scroll'), (h = !0));
        h && this.$verticalSpacer.css('height');
      }
    };
    var f = function () {
      this.pendingRequest = void 0;
      this.enabled = !0;
    };
    f.prototype.init = function (f) {
      this.$spacer = b('.verticalspacer', f);
      this.$page = f;
      this.spacerMinHeight = Muse.Utils.getCSSIntValue(this.$spacer, 'min-height');
      this.originalOffsetTop = Muse.Utils.tryParse(this.$spacer.attr('data-offset-top'), parseInt, 0);
      d.removeClass('no_vert_scroll');
      this.$spacer.removeAttr('style');
      this.$spacer.height() < this.spacerMinHeight && this.$spacer.height(Math.floor(this.spacerMinHeight + 1));
      this.spacerHeight = this.$spacer.height();
      this.pageMarginTop = Muse.Utils.getCSSIntValue(d, 'padding-top') + Muse.Utils.getCSSIntValue(d, 'margin-top');
      this.pageMarginBottom = Muse.Utils.getCSSIntValue(d, 'padding-bottom') + Muse.Utils.getCSSIntValue(d, 'margin-bottom');
      this.pageResizeWatchEnabled = !0;
      this.alwaysVertScroll = d.hasClass('always_vert_scroll');
      var h = this;
      this.calculateInitialSpacerHeight();
      this.$page.watch('height', function () {
        h.onPageHeightChanged();
      });
      a.resize(function () {
        h.doUpdate();
      });
      this.initialized = !0;
      this.doUpdate(this.pendingRequest);
    };
    f.prototype.updateScrollClass = function (a) {
      if (!this.alwaysVertScroll) {
        var a = this.spacerMinHeight < Math.floor(a * 100) / 100,
          b = !1;
        a && !d.hasClass('no_vert_scroll') ? (d.addClass('no_vert_scroll'), (b = !0)) : !a && d.hasClass('no_vert_scroll') && (d.removeClass('no_vert_scroll'), (b = !0));
        b && this.$spacer.css('height');
      }
    };
    f.prototype.doUpdate = function (b) {
      if (this.enabled)
        if (this.initialized) {
          parseInt(b) || (b = 0);
          var c = this.$page.outerHeight(!0),
            d = c - this.spacerHeight,
            b = Math.max(0, a.height() - this.pageMarginTop - this.pageMarginBottom - d - b);
          b < this.spacerMinHeight && (b = this.spacerMinHeight + this.originalOffsetTop - this.$spacer.offset().top);
          if (b != this.spacerHeight) {
            this.pageResizeWatchEnabled = !1;
            this.updateScrollClass(b);
            this.$spacer.css('height', b);
            if (b < this.spacerHeight && c == this.$page.outerHeight(!0)) (b = this.spacerHeight), this.updateScrollClass(b), this.$spacer.css('height', b);
            this.pageResizeWatchEnabled = !0;
          }
          return (this.spacerHeight = b);
        } else this.pendingRequest = b;
    };
    f.prototype.calculateInitialSpacerHeight = function () {
      for (var a = 0, b = 0; b++ < 20; ) {
        var c = this.doUpdate();
        if (c <= a) break;
        a = c;
      }
    };
    f.prototype.onPageHeightChanged = function (a) {
      this.pageResizeWatchEnabled && this.doUpdate(a);
    };
    f.prototype.enable = function () {
      this.enabled = !0;
    };
    f.prototype.disable = function () {
      this.enabled = !1;
    };
    b('body').append('<div class="muse_check_css"></div>');
    var h = null,
      h = b('.muse_check_css'),
      i = h.css('height', '100vh').height(),
      l = h.css('height', 'calc(100vh + 300px)').height();
    0 < i && 0 < l && 300 == l - i ? (h.remove(), (h = new j())) : (b('html').removeClass('css_verticalspacer'), (h = new f()));
    a.data('stickyFooter', h);
  })(d);
  Muse.Utils.requestAnimationFrame = (function () {
    return (
      (window.mozRequestAnimationFrame && window.mozRequestAnimationFrame.bind(window)) ||
      (window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) ||
      (window.webkitRequestAnimationFrame && window.webkitRequestAnimationFrame.bind(window)) ||
      function (b) {
        window.setTimeout(b, 20);
      }
    );
  })();
  Muse.Utils.animationFrameFx = (function (b) {
    var a = b.fx;
    b.extend(a, b.fx);
    var d,
      j = b(window).data('stickyFooter'),
      f = function () {
        d && (Muse.Utils.requestAnimationFrame(f), a.tick(), j.doUpdate());
      };
    a.timer = function (a) {
      a() && b.timers.push(a) && !d && ((d = !0), f());
    };
    a.stop = function () {
      d = !1;
    };
    b.fn.animationFrameFx = a;
  })(d);
});
(function () {
  if (!('undefined' == typeof Muse || 'undefined' == typeof Muse.assets)) {
    var a = (function (a, b) {
      for (var c = 0, d = a.length; c < d; c++) if (a[c] == b) return c;
      return -1;
    })(Muse.assets.required, 'museutils.js');
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName('meta'), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ('generator' == d.getAttribute('name')) {
          '2017.0.1.363' != d.getAttribute('content') && Muse.assets.outOfDate.push('museutils.js');
          break;
        }
      }
    }
  }
})();
