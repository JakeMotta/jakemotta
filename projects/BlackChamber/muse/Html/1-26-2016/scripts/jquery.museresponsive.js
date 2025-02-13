/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (d) {
  'function' === typeof define && define.amd && define.amd.jQuery ? define(['jquery', 'museutils'], d) : d(jQuery);
})(function (d) {
  var b = 'undefined' !== typeof console && console.log && console.log.bind ? console.log.bind(console, '[MR]') : function () {},
    c = !0,
    a = d(window),
    f = function (a) {
      var c = null,
        d = null,
        f = null,
        g = a.parent().children().length,
        h = a.index();
      1 == g ? (c = a.parent()) : 0 == h ? (f = a.next()) : (d = a.prev());
      this.getNode = function () {
        return a;
      };
      this.swapWith = function (a) {
        c ? c.append(a.getNode()) : d ? d.after(a.getNode()) : f ? f.before(a.getNode()) : b('WARNING: Invalid state - either parent, prev, next should have a valid value');
      };
    },
    j = function (a, b) {
      var c = new f(a),
        g = new f(b);
      d('script', b).remove();
      c.swapWith(g);
      g.swapWith(c);
      c = a.attr('class');
      a.attr('class', b.attr('class'));
      b.attr('class', c);
      c = ['temp_no_id', 'temp_no_img_src'];
      for (g = 0; g < c.length; g++) a.hasClass(c[g]) && (a.removeClass(c[g]), b.addClass(c[g]));
      b.removeClass('placeholder').addClass('shared_content');
      a.addClass('placeholder').removeClass('shared_content');
    },
    g = function (f) {
      f.data('bpObj', this);
      var g = this,
        h = f.hasClass('active'),
        n = function (a) {
          a == h
            ? b('WARNING: Setting the same "active" state twice', this.toString())
            : (h = a)
              ? (f.addClass('active'), p.trigger('muse_bp_activate', [i, f, g]), f.trigger('muse_this_bp_activate'))
              : (f.removeClass('active'), p.trigger('muse_bp_deactivate', [i, f, g]), f.trigger('muse_this_bp_deactivate'));
        },
        i = (function () {
          var a = f.attr('data-min-width') || void 0,
            b = f.attr('data-max-width') || void 0,
            c = '';
          void 0 !== a && (c += (c ? ' and ' : '') + '(min-width: ' + a + 'px)');
          void 0 !== b && (c += (c ? ' and ' : '') + '(max-width: ' + b + 'px)');
          return c;
        })(),
        p = d('body');
      this.getCondition = function () {
        return i;
      };
      this.isActive = function () {
        return h;
      };
      this.isMatched = function () {
        var g;
        g = d('#muse_css_mq').css('background-color');
        g.match(/^rgb/)
          ? ((g = g
              .replace(/\s+/g, '')
              .match(/([\d\,]+)/gi)[0]
              .split(',')),
            (g = (parseInt(g[0]) << 16) + (parseInt(g[1]) << 8) + parseInt(g[2])))
          : (g = g.match(/^\#/) ? parseInt(g.substr(1), 16) : 0);
        var k = f.attr('data-max-width') || 16777215;
        16777214 == g && b('WARNING: No media query was matched by the CSS.');
        c && g < a.width() && ((c = !1), d('html').addClass('always_vert_scroll'));
        return k == g;
      };
      this.activateImages = function () {
        var a = 0;
        d('.temp_no_img_src', f).each(function () {
          var b = d(this);
          a++;
          b.removeClass('temp_no_img_src').attr('src', b.attr('data-orig-src')).removeAttr('data-orig-src');
        });
      };
      this.swapPlaceholderNodesRecursively = function (a) {
        var c = this;
        d('.placeholder', a).each(function () {
          var a = d(this),
            f = a.attr('data-placeholder-for');
          if (f) {
            var g = d('.shared_content').filter(function (a, b) {
              return f == d(b).attr('data-content-guid');
            });
            0 == g.length
              ? b('WARNING: Could not find content node with GUID', f)
              : 1 < g.length
                ? b('WARNING: Found', g.length, 'content nodes with GUID', f, ', expected only 1')
                : (j(a, g), c.swapPlaceholderNodesRecursively(g));
          } else b('WARNING: Invalid placeholder-for data property for placeholder node', a);
        });
      };
      this.activateIDs = function (a) {
        d('.temp_no_id', a).each(function () {
          var a = d(this),
            c = a.attr('data-orig-id'),
            f = d('#' + c);
          1 == f.length ? f.removeAttr('id').attr('data-orig-id', c).addClass('temp_no_id') : b('WARNING: Expected to find 1 node with id', c, 'but found', f.length);
          a.removeAttr('data-orig-id').attr('id', c).removeClass('temp_no_id');
        });
      };
      this.activate = function () {
        h ? b('WARNING: Trying to activate same breakpoint twice', this.toString()) : (this.swapPlaceholderNodesRecursively(f), this.activateIDs(f), this.activateImages(), n(!0));
      };
      this.deactivate = function () {
        h ? n(!1) : b('WARNING: Trying to deactivate same breakpoint twice', this.toString());
      };
      this.onRegisterAlreadyActiveBP = function () {
        this.activateImages();
        p.trigger('muse_bp_activate', [i, f, g]);
        f.trigger('muse_this_bp_activate');
      };
      this.toString = function () {
        return '[Breakpoint ' + i + ', ' + (h ? 'active' : 'not active') + ', ' + (this.isMatched() ? 'matched' : 'not matched') + ']';
      };
    },
    h = new (function () {
      var c = function (c) {
          if (c)
            if (c == h) b('WARNING: breakpoint is already active.');
            else {
              h && h.deactivate();
              h = c;
              a.data('muse-mq', c.getCondition());
              n.attr('data-content', h.toString());
              if (!c.isActive()) return h.activate(), !0;
              return !1;
            }
          else b('WARNING: Cannot update active breakpoint NULL.');
        },
        f = function () {
          for (var a = 0; a < r.length; a++) if (r[a].isMatched()) return r[a];
          b('WARNING: Could not find any active breakpoint');
          return null;
        },
        g = function () {
          if (!h || !h.isMatched()) {
            var b = f();
            b && !b.isActive() && (d('body').addClass('awaiting_bp_activate_scroll'), c(b));
            var g = j;
            setTimeout(function () {
              a.scrollTop(g);
              a.trigger('scroll');
              d('body').removeClass('awaiting_bp_activate_scroll');
            }, 16);
          } else j = a.scrollTop();
        },
        n = d('.css-section-debug .js'),
        h = null,
        i = !1,
        j = 0,
        r = [];
      this.registerBreakpoint = function (a) {
        r.push(a);
        if (a.isMatched()) {
          if (!c(a)) a.onRegisterAlreadyActiveBP();
        } else a.isActive() && a.deactivate();
      };
      this.watchBreakpointChanges = function () {
        i ||
          (a.on('resize', function () {
            Muse.Utils.requestAnimationFrame(function () {
              g();
            });
          }),
          g(),
          (i = !0));
      };
    })(),
    i = null;
  d.fn.registerBreakpoint = function () {
    if (!window.matchMedia && 'undefined' == typeof window.CSSMediaRule)
      b('WARNING: Browser does not support media queries.'),
        this.each(function () {
          var a = d(this);
          if (void 0 === (a.attr('data-max-width') || void 0)) {
            var b = new g(a);
            b.activateImages();
            d('body').trigger('muse_bp_activate', [b.getCondition(), a, b]);
            a.trigger('muse_this_bp_activate');
          }
        });
    else
      return (
        null == i && (i = d('body').append('<div id="muse_css_mq"></div>')),
        this.each(function () {
          h.registerBreakpoint(new g(d(this)));
        }),
        h.watchBreakpointChanges(),
        a.trigger('scroll'),
        this
      );
  };
});
(function () {
  if (!('undefined' == typeof Muse || 'undefined' == typeof Muse.assets)) {
    var a = (function (a, b) {
      for (var c = 0, d = a.length; c < d; c++) if (a[c] == b) return c;
      return -1;
    })(Muse.assets.required, 'jquery.museresponsive.js');
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName('meta'), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ('generator' == d.getAttribute('name')) {
          '2017.0.1.363' != d.getAttribute('content') && Muse.assets.outOfDate.push('jquery.museresponsive.js');
          break;
        }
      }
    }
  }
})();
