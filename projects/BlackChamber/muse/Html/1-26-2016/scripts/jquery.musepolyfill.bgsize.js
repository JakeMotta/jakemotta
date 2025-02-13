/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (d) {
  'function' === typeof define && define.amd && define.amd.jQuery ? define(['jquery', 'museutils'], d) : d(jQuery);
})(function (d) {
  function b(a) {
    var b = a.css('background-image');
    a.css('background-image', '');
    var c = a.css('background-image');
    b != c && a.css('background-image', b);
    return c.replace(/^\s*url\(\"?/, '').replace(/['"]?\)$/, '');
  }
  if (!Muse.Browser.Features.checkCSSFeature('background-size')) {
    var c = function (a) {
        var c = d(a),
          g = b(c),
          h = document.createElement('img'),
          i = document.createElement('div'),
          l = this,
          k = !1,
          m = !1,
          n = !0,
          o = {};
        d(i)
          .css({
            overflow: 'hidden',
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: a.clientWidth + 'px',
            height: a.clientHeight + 'px',
            marginBottom: '-' + a.clientHeight + 'px',
            marginRight: '-' + a.clientWidth + 'px',
            zIndex: '-1',
          })
          .addClass('museBgSizePolyfill');
        h.src = g;
        h.alt = '';
        h.style.position = 'absolute';
        i.appendChild(h);
        a.children.length > 0 ? a.insertBefore(i, a.children[0]) : a.appendChild(i);
        if (a === document.body)
          (c = d('html')), (a = c.get(0)), (g = b(c)), (h.src = g), c.css('background-attachment') == 'fixed' ? ((i.style.position = 'fixed'), (n = !1)) : (i.style.position = 'absolute');
        else if (c.is('#page'))
          c.css('marginLeft').toLowerCase() == 'auto' && (m = !0),
            (i.style.top = c.offset().top + parseInt(c.css('borderTopWidth')) + 'px'),
            (i.style.bottom = parseInt(c.parent().css('paddingBottom')) + parseInt(c.css('borderBottomWidth')) + 'px'),
            (i.style.left = c.offset().left + parseInt(c.css('borderLeftWidth')) + 'px'),
            (i.style.right = c.offset().left + parseInt(c.css('borderRightWidth')) + 'px'),
            (i.style.zIndex = 0);
        else if (c.css('position') == 'static') a.style.position = 'relative';
        this.reloadImage = function () {
          var d = b(c),
            g = c.css('background-color');
          if (d != h.src) h.src = d;
          a.style.backgroundImage = 'none';
          a.style.backgroundColor = 'transparent';
          i.style.backgroundColor = g;
          d = (c.css('background-position-x') + ' ' + c.css('background-position-y')).replace(/^\s+/, '').replace(/\s+$/, '');
          '0px 0px' == d && (d = 'left top');
          d = d.split(/\s+/);
          d.length == 1 && d[0].indexOf('center') >= 0 && d.push('center');
          if (c.data('hasBackgroundPositionScrollEffect') != !0)
            for (var g = 0, k = d.length; g < k; g++)
              switch (d[g]) {
                case 'center':
                case '50%':
                  g == 0
                    ? ((h.style.right = ''), (h.style.left = '50%'), (h.style.marginLeft = '-' + Math.ceil(h.offsetWidth / 2) + 'px'))
                    : ((h.style.bottom = ''), (h.style.top = '50%'), (h.style.marginTop = '-' + Math.ceil(h.offsetHeight / 2) + 'px'));
                  break;
                case 'left':
                  h.style.right = '';
                  h.style.left = '0px';
                  h.style.marginLeft = '0px';
                  break;
                case 'right':
                  h.style.left = '';
                  h.style.right = '0px';
                  h.style.marginLeft = '0px';
                  break;
                case 'top':
                  h.style.bottom = '';
                  h.style.top = '0px';
                  h.style.marginTop = '0px';
                  break;
                case 'bottom':
                  h.style.top = '';
                  h.style.bottom = '0px';
                  h.style.marginTop = '0px';
                  break;
                default:
                  g == 0
                    ? ((h.style.left = d[g]), (h.style.marginLeft = '-' + Math.ceil(h.offsetWidth / 2) + 'px'))
                    : ((h.style.top = d[g]), (h.style.marginTop = '-' + Math.ceil(h.offsetHeight / 2) + 'px'));
              }
        };
        this.resizeImage = function (b) {
          var d = a.getBoundingClientRect(),
            g = a.scrollWidth - (Muse.Browser.Bugs.ScrollWidthHeightIncludesBorder ? d.right - d.left - c.innerWidth() : 0),
            d = a.scrollHeight - (Muse.Browser.Bugs.ScrollWidthHeightIncludesBorder ? d.bottom - d.top - c.innerHeight() : 0),
            g = !n ? a.clientWidth : Math.max(g, a.clientWidth),
            d = !n ? a.clientHeight : Math.max(d, a.clientHeight);
          !o[h.src] && h.clientWidth && (o[h.src] = { width: h.clientWidth, height: h.clientHeight });
          var k = g / (o[h.src] ? o[h.src].width : 1),
            l = d / (o[h.src] ? o[h.src].height : 1);
          i.style.height = d + 'px';
          i.style.marginBottom = '-' + d + 'px';
          i.style.width = g + 'px';
          i.style.marginRight = '-' + g + 'px';
          k < l == b ? ((h.style.height = d + 1 + 'px'), (h.style.width = 'auto')) : ((h.style.width = g + 1 + 'px'), (h.style.height = 'auto'));
        };
        this.update = function () {
          if (k) {
            a.style.backgroundImage = '';
            c.css('background-color', '');
            var b = c.css('background-image').toLowerCase(),
              d = (a.currentStyle || window.getComputedStyle(a, null))['background-size'];
            d && d.toLowerCase();
            if (b != 'none' && (d == 'cover' || d == 'contain')) {
              if ((l.reloadImage(), (i.style.display = 'block'), (i.style.width = '0px'), (i.style.height = '0px'), l.resizeImage(d == 'cover'), m))
                (i.style.left = c.offset().left + parseInt(c.css('borderLeftWidth')) + 'px'), (i.style.right = c.offset().left + parseInt(c.css('borderRightWidth')) + 'px');
            } else i.style.display = 'none';
          }
        };
        if (h.complete || g == 'none') k = !0;
        else
          d(h).one('load', function () {
            k = !0;
            l.update();
          });
        this.update();
      },
      a = function () {
        this.updateList = [];
      };
    a.prototype.initialize = function (a) {
      var b = this;
      a.each(function () {
        var a = new c(this);
        this !== document.body
          ? b.updateList.push(a)
          : (d(window).resize(function () {
              setTimeout(function () {
                a.update();
              }, 10);
            }),
            d(window).load(function () {
              setTimeout(function () {
                a.update();
              }, 10);
            }));
      });
      var g = b.updateList.length;
      g > 0 &&
        setInterval(
          function () {
            for (var a = 0; a < g; a++) b.updateList[a].update();
          },
          Math.max(120, 16 * g),
        );
    };
    d(window).data('musePolyfill.bgSize', new a());
  }
});
(function () {
  if (!('undefined' == typeof Muse || 'undefined' == typeof Muse.assets)) {
    var a = (function (a, b) {
      for (var c = 0, d = a.length; c < d; c++) if (a[c] == b) return c;
      return -1;
    })(Muse.assets.required, 'jquery.musepolyfill.bgsize.js');
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName('meta'), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ('generator' == d.getAttribute('name')) {
          '2017.0.1.363' != d.getAttribute('content') && Muse.assets.outOfDate.push('jquery.musepolyfill.bgsize.js');
          break;
        }
      }
    }
  }
})();
