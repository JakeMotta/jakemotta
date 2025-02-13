/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (d) {
  'function' === typeof define && define.amd && define.amd.jQuery ? define(['jquery', 'webpro', 'museutils'], d) : d(jQuery);
})(function (d) {
  Muse.Plugins.SlideShowCaptions = {
    defaultOptions: { captionClassName: 'SSSlideCaption' },
    initialize: function (b, c) {
      var a = this;
      d.extend(c, d.extend({}, a.defaultOptions, c));
      b.bind('attach-behavior', function () {
        a._attachBehavior(b);
      });
    },
    _attachBehavior: function (b) {
      var c = b._sscpCaptions ? b._sscpCaptions : b._findWidgetElements('.' + b.options.captionClassName);
      if (c.length)
        (b._sscpCaptions = c),
          c.css('display', 'none'),
          b.slides.bind('wp-panel-show', function (a, b) {
            c.eq(b.panelIndex).css('display', 'block');
          }),
          b.slides.bind('wp-panel-hide', function (a, b) {
            c.eq(b.panelIndex).css('display', 'none');
          }),
          b.bind('ready', function () {
            -1 != b.slides.activeIndex && c.eq(b.slides.activeIndex).css('display', 'block');
          });
    },
  };
  Muse.Plugins.SlideShowLabel = {
    defaultOptions: { labelClassName: 'SlideShowLabel' },
    initialize: function (b, c) {
      var a = this;
      d.extend(c, d.extend({}, a.defaultOptions, c));
      b.bind('attach-behavior', function () {
        a._attachBehavior(b);
      });
    },
    _attachBehavior: function (b) {
      var c = this,
        a = b._$sslpLabels ? b._$sslpLabels : b._findWidgetElements('.' + b.options.labelClassName);
      if (a.length)
        (b._$sslpLabels = a),
          b.slides.bind('wp-panel-show', function () {
            c._updateLabels(b);
          }),
          b.bind('ready', function () {
            c._updateLabels(b);
          });
    },
    _findAllTextNodes: function (b, c) {
      c = c || [];
      switch (b.nodeType) {
        case 3:
          c.push(b);
          break;
        case 1:
          if (b.nodeName.toLowerCase() !== 'script') for (var a = b.firstChild; a; ) this._findAllTextNodes(a, c), (a = a.nextSibling);
      }
      b.nextSibling && this._findAllTextNodes(b.nextSibling, c);
      return c;
    },
    _updateLabels: function (b) {
      var c = this,
        a = b.slides,
        d = a.activeIndex + 1,
        j = a.$element.length;
      b._$sslpLabels.each(function () {
        for (
          var a = c._findAllTextNodes(this),
            b = a.length,
            i = 0,
            l = function (a) {
              return ++i === 1 ? d : i === 2 ? j : a;
            },
            k = 0;
          k < b;
          k++
        ) {
          var m = a[k],
            n = m.nodeValue,
            p = n.replace(/\d+/g, l);
          if (p !== n) m.nodeValue = p;
        }
      });
    },
  };
  Muse.Plugins.Lightbox = {
    defaultOptions: { lightboxPartsSelector: '.PamphletLightboxPart', closeBtnClassName: 'PamphletCloseButton' },
    initialize: function (b, c) {
      var a = this;
      d.extend(c, d.extend({}, a.defaultOptions, c));
      b._sslbpAutoPlay = c.autoPlay;
      c.autoPlay = !1;
      b.bind('before-transform-markup', function () {
        a._beforeTransformMarkup(b);
      });
      b.bind('attach-behavior', function () {
        a._attachBehavior(b);
      });
      c.autoActivate_runtime &&
        b.bind('ready', function () {
          a._openLightbox(b);
        });
    },
    _beforeTransformMarkup: function (b) {
      b._sslbpShownInitially = !0;
      var c = b._findWidgetElements('.' + b.options.slideClassName);
      if (c.filter(':hidden').length == 0) b._sslbpSlideOffset = c.offset();
      else {
        b._sslbpShownInitially = !1;
        var a = b._findWidgetElements('.' + b.options.viewClassName);
        b._sslbpSlideOffset = { top: Muse.Utils.getCSSIntValue(a, 'top') + Muse.Utils.getCSSIntValue(c, 'top'), left: Muse.Utils.getCSSIntValue(a, 'left') + Muse.Utils.getCSSIntValue(c, 'left') };
      }
    },
    _attachBehavior: function (b) {
      var c = this,
        a = b.options;
      b.tabs.$element.unbind(a.event).bind(a.event, function () {
        c._openLightbox(b);
      });
      b.slides.unbind('wp-panel-before-show').bind('wp-panel-before-show', function () {
        c._openLightbox(b);
      });
      if (Muse.Browser.Features.Touch && a.elastic === 'fullScreen')
        b.slides.$element
          .not('a[href]')
          .off('click')
          .on('click', function () {
            c._closeLightbox(b);
          });
      b._$sslbpCloseBtn = b
        ._findWidgetElements('.' + a.closeBtnClassName)
        .unbind('click')
        .bind('click', function () {
          c._closeLightbox(b);
        });
      c._initializeMarkup(b);
    },
    _initializeMarkup: function (b) {
      var c = b.options,
        a = c.elastic !== 'off',
        g = b._findWidgetElements('.' + c.viewClassName),
        j = b.slides.$element,
        f = g,
        h = b._sslbpSlideOffset,
        i = j.outerWidth(),
        l = j.parent().outerWidth(),
        k = j.outerHeight(),
        m = b._findWidgetElements(c.lightboxPartsSelector);
      c.isResponsive &&
        (m = m.map(function () {
          var a = d(this).parent();
          return a.hasClass('popup_anchor') ? a[0] : this;
        }));
      if (0 == g.length) {
        if (!b._$sslbpOverlay) (b._$sslbpOverlay = d('.LightboxContent')), b._$sslbpOverlay.museOverlay('reuseAcrossBPs');
      } else {
        f = d(g[0].parentNode).filter('.' + c.clipClassName);
        f.length === 0 && (f = g);
        m.each(function (f, i) {
          var j = d(i);
          if (j.css('position') !== 'fixed')
            if (c.isResponsive) j.css({ top: 0 });
            else {
              var k = b._sslbpShownInitially ? j.offset() : { top: Muse.Utils.getCSSIntValue(j, 'top'), left: Muse.Utils.getCSSIntValue(j, 'left') },
                l = { top: k.top - h.top };
              a ? (l.top += Muse.Utils.getCSSIntValue(g, 'padding-top')) : (l.left = k.left - h.left);
              j.css(l);
            }
        }).addClass('popup_element');
        var n = d('<div/>')
            .attr('id', g.attr('id') || '')
            .css({ left: 0, top: 0, width: 'auto', height: 'auto', padding: 0, margin: 0, zIndex: 'auto' }),
          p;
        a &&
          ((p = d('<div/>')),
          c.elastic === 'fullScreen' ? p.addClass('fullscreen') : c.elastic === 'fullWidth' && p.addClass('fullwidth'),
          p.css({
            borderColor: g.css('border-left-color'),
            borderStyle: g.css('border-left-style'),
            borderLeftWidth: g.css('border-left-width'),
            borderRightWidth: g.css('border-right-width'),
            borderTopWidth: g.css('border-top-width'),
            borderBottomWidth: g.css('border-bottom-width'),
          }),
          c.elastic !== 'fullScreen' && p.css({ paddingLeft: g.css('padding-left'), paddingRight: g.css('padding-right'), paddingTop: g.css('padding-top'), paddingBottom: g.css('padding-bottom') }),
          p.append(Muse.Utils.includeMEditableTags(f)),
          p.append(Muse.Utils.includeMEditableTags(m)),
          n.css({ border: 'none' }));
        g.removeAttr('id');
        var o = d('<div/>').addClass('overlayWedge').insertBefore(Muse.Utils.includeMEditableTags(j)[0]);
        n.append(Muse.Utils.includeMEditableTags(g.children().not('.' + c.slideClassName)));
        g.append(Muse.Utils.includeMEditableTags(j));
        n.css({ visibility: 'hidden' }).appendTo(document.body);
        n.detach().css({ visibility: '' });
        f.css({ position: c.elastic === 'fullScreen' ? 'relative' : 'absolute', padding: 0, left: c.elastic === 'fullWidth' ? '' : 0, top: 0, borderWidth: 0, background: 'none' });
        c.elastic !== 'fullScreen' && f.css({ width: c.isResponsive ? (l / b.$element.width()) * 100 + '%' : i + 'px', height: k });
        c.transitionStyle === 'fading' && j.css({ position: 'absolute', left: 0, top: 0 });
        var q;
        if (b._fstpPositionSlides || b._csspResizeFullScreenImages)
          q = function (a, d) {
            b._fstpPositionSlides && b._fstpPositionSlides(a, d);
            b._csspResizeFullScreenImages && b._csspResizeFullScreenImages(b, b.slides.$element, c.heroFitting);
          };
        f = d('<div/>')
          .addClass('LightboxContent')
          .css({ position: 'absolute' })
          .append(a ? p : f);
        a || f.append(Muse.Utils.includeMEditableTags(m));
        f.museOverlay({
          autoOpen: !1,
          $slides: j,
          $overlaySlice: n,
          $overlayWedge: o,
          slideshow: b,
          onNext: function () {
            b.next();
          },
          onPrevious: function () {
            b.previous();
          },
          onClose: function () {
            b.stop();
            b.slides.hidePanel(b.slides.activeElement);
            b.tabs.activeElement.focus();
          },
          $elasticContent: p,
          resizeSlidesFn: q,
        });
        if (d.browser.msie && d.browser.version < 9) {
          Muse.Assert.assert(!Muse.Utils.isIBE(), "IBE doesn't support <IE10, so how did we get here?");
          var r = n[0];
          Muse.Utils.needPIE(function () {
            PIE.detach(r);
            PIE.attach(r);
          });
        }
        b._$sslbpOverlay = f;
      }
    },
    _openLightbox: function (b) {
      var c = b._$sslbpOverlay;
      c.data('museOverlay').isOpen || (c.museOverlay('open'), b._sslbpAutoPlay && b.play());
    },
    _closeLightbox: function (b) {
      b = b._$sslbpOverlay;
      b.data('museOverlay').isOpen && b.museOverlay('close');
    },
  };
  Muse.Plugins.ContentSlideShow = {
    defaultOptions: {
      displayInterval: 3e3,
      transitionDuration: 500,
      transitionStyle: 'fading',
      contentLayout_runtime: 'stack',
      event: 'click',
      deactivationEvent: 'none',
      hideAllContentsFirst: !1,
      shuffle: !1,
      resumeAutoplay: !1,
      resumeAutoplayInterval: 3e3,
      elastic: 'off',
      autoActivate_runtime: !1,
    },
    slideShowOverrides: {
      slideshowClassName: 'SlideShowWidget',
      viewClassName: 'SlideShowContentPanel',
      slideClassName: 'SSSlide',
      slideLinksClassName: 'SSSlideLinks',
      slideLinkClassName: 'SSSlideLink',
      slideLinkActiveClassName: 'SSSlideLinkSelected',
      slideCountClassName: 'SSSlideCount',
      firstBtnClassName: 'SSFirstButton',
      lastBtnClassName: 'SSLastButton',
      prevBtnClassName: 'SSPreviousButton',
      nextBtnClassName: 'SSNextButton',
      playBtnClassName: 'SSPlayButton',
      stopBtnClassName: 'SSStopButton',
      closeBtnClassName: 'SSCloseButton',
      heroFitting: 'fitContentProportionally',
      thumbFitting: 'fillFrameProportionally',
      lightboxPartsSelector: '.SlideShowCaptionPanel, .SSFirstButton, .SSPreviousButton, .SSNextButton, .SSLastButton, .SlideShowLabel, .SSCloseButton',
      lightboxEnabled_runtime: !1,
    },
    compositionOverrides: {
      slideshowClassName: 'PamphletWidget',
      viewClassName: 'ContainerGroup',
      slideClassName: 'Container',
      slideLinkClassName: 'Thumb',
      slideLinkActiveClassName: 'PamphletThumbSelected',
      prevBtnClassName: 'PamphletPrevButton',
      nextBtnClassName: 'PamphletNextButton',
      closeBtnClassName: 'PamphletCloseButton',
      lightboxPartsSelector: '.PamphletLightboxPart',
    },
    initialize: function (b, c) {
      var a = this,
        g = b.$element.hasClass('SlideShowWidget'),
        j = g ? a.slideShowOverrides : a.compositionOverrides;
      b._csspIsImageSlideShow = g;
      this._restartTimer = 0;
      d.extend(c, d.extend({}, a.defaultOptions, j, c));
      if (b.$element.hasClass('HeroFillFrame')) c.heroFitting = 'fillFrameProportionally';
      if (c.lightboxEnabled_runtime) c.contentLayout_runtime = 'lightbox';
      if (c.contentLayout_runtime == 'lightbox' && !c.autoActivate_runtime) c.hideAllContentsFirst = !0;
      if (c.hideAllContentsFirst) c.defaultIndex = -1;
      if (c.elastic !== 'off') b._csspPositionImage = a._positionImage;
      g && (WebPro.Widget.ContentSlideShow.slideImageIncludePlugin.initialize(b, c), Muse.Plugins.SlideShowLabel.initialize(b, c), Muse.Plugins.SlideShowCaptions.initialize(b, c));
      c.transitionStyle == 'fading' ? WebPro.Widget.ContentSlideShow.fadingTransitionPlugin.initialize(b, c) : WebPro.Widget.ContentSlideShow.filmstripTransitionPlugin.initialize(b, c);
      WebPro.Widget.ContentSlideShow.alignPartsToPagePlugin.initialize(b, c);
      if (c.contentLayout_runtime === 'lightbox') {
        if (c.elastic !== 'off') b._csspResizeFullScreenImages = a._resizeFullScreenImages;
        if (0 < d('.LightboxContent').length) c.autoActivate_runtime = !1;
        Muse.Plugins.Lightbox.initialize(b, c);
      }
      c.shuffle === !0 && WebPro.Widget.ContentSlideShow.shufflePlayPlugin.initialize(b, c);
      b.bind('transform-markup', function () {
        a._transformMarkup(b);
      });
      d('body')
        .on('muse_bp_activate', function (d, g, i) {
          i.is(b.$bp) && a._onBPActivate(a, b, c);
        })
        .on('muse_bp_deactivate', function (d, g, i) {
          i.is(b.$bp) && a._onBPDeactivate(a, b, c);
        });
      b.bind('attach-behavior', function () {
        a._attachBehavior(b);
      });
    },
    _onBPActivate: function (b, c, a) {
      a.transitionStyle !== 'fading' && this._updateClipElement(c);
      c._attachBehavior();
      c.trigger('attach-behavior');
      'lightbox' !== a.contentLayout_runtime &&
        ((a = c.slides.$element.eq(c.slides.activeIndex)[0]),
        (a = { panel: a, panelIndex: c.slides._getElementIndex(a) }),
        c.options.hideAllContentsFirst || c.slides.trigger('wp-panel-show', a),
        (c.options.autoPlay || c._sslbpAutoPlay) && c.options.resumeAutoplay && 0 < c.options.resumeAutoplayInterval ? b._startRestartTimer(c) : c._wasPlaying && c.play(!0));
    },
    _onBPDeactivate: function (b, c) {
      d(window).off('orientationchange resize', b._onResize);
      c._wasPlaying = c.isPlaying();
      c._wasPlaying && c.stop();
      b._stopRestartTimer();
    },
    _updateClipElement: function (b) {
      var c = b.options,
        a = b._findWidgetElements('.' + c.viewClassName),
        g = b.$clipElement ? b.$clipElement : d('<div/>').addClass(c.clipClassName),
        j = b._findWidgetElements('.' + c.slideClassName),
        b = j.outerWidth(),
        j = j.outerHeight();
      if (c.elastic === 'fullScreen') g.addClass('fullscreen');
      else {
        var f = { position: 'relative', width: c.isResponsive ? '100%' : b + 'px', height: j + 'px', overflow: 'hidden' },
          h = a.css('position');
        if (h === 'absolute') (f.position = h), (f.left = a.css('left')), (f.top = a.css('top'));
        else if (h === 'fixed') {
          var i = Muse.Utils.getStyleSheetRulesById(Muse.Utils.getPageStyleSheets(), a.get(0).id);
          f.position = h;
          f.left = Muse.Utils.getRuleProperty(i, 'left');
          f.top = Muse.Utils.getRuleProperty(i, 'top');
          f.bottom = Muse.Utils.getRuleProperty(i, 'bottom');
          f.right = Muse.Utils.getRuleProperty(i, 'right');
        }
        g.css(f);
        !c.isResponsive && c.transitionStyle === 'fading' && h !== 'fixed' && (j = b = 0);
        a.css({ width: c.isResponsive ? '100%' : b + 'px', height: j + 'px' });
      }
      return g;
    },
    _syncTargetHeights: function (b) {
      var c = 0;
      b._findWidgetElements('.' + b.options.viewClassName)
        .children()
        .css('height', '')
        .each(function () {
          c = Math.max(c, d(this).outerHeight());
        })
        .css('height', c + 'px');
    },
    _transformMarkup: function (b) {
      var c = b.options,
        a = b._findWidgetElements('.' + c.viewClassName);
      c.transitionStyle !== 'fading'
        ? ((c = this._updateClipElement(b)), (b.$clipElement = a.css({ position: 'relative', top: '0', left: '0', margin: '0', overflow: 'hidden' }).wrap(c).parent()))
        : c.isResponsive || ((b = a.css('position')), c.elastic !== 'fullScreen' && b !== 'fixed' && a.css({ width: '0', height: '0' }));
    },
    _onResize: function (b) {
      var c = b.data.plugin,
        a = b.data.slideshow,
        b = b.data.isLightbox,
        d = a.options;
      d.isResponsive && c._syncTargetHeights(a);
      d.transitionStyle !== 'fading' && c._updateClipElement(a);
      !b && d.elastic !== 'off' && c._resizeFullScreenImages(a, a.slides.$element, d.heroFitting);
    },
    _attachBehavior: function (b) {
      var c = this,
        a = b.options,
        g = b.tabs,
        j = b.slides.$element,
        f = a.slideLinkActiveClassName,
        h = a.contentLayout_runtime === 'lightbox';
      a.elastic !== 'off' && c._resizeFullScreenImages(b, b.slides.$element, a.heroFitting);
      var i = { plugin: c, slideshow: b, isLightbox: h };
      d(window).on('orientationchange resize', i, c._onResize);
      c._onResize({ data: i });
      if (h && !a.autoActivate_runtime) a.hideAllContentsFirst = !0;
      if (g) {
        var l = g.$element;
        a.event === 'mouseover' &&
          l.bind('mouseenter', function () {
            var a = d(this);
            a.data('enter', !0);
            g.selectTab(l.index(a));
          });
        a.deactivationEvent === 'mouseout_trigger'
          ? l.bind('mouseleave', function () {
              var a = d(this);
              a.data('enter', !1);
              b.slides.hidePanel(l.index(a));
            })
          : a.deactivationEvent === 'mouseout_both' &&
            (l.bind('mouseleave', function () {
              var a = d(this),
                c = l.index(a),
                f = j.eq(c);
              a.data('enter', !1);
              a.data('setTimeout') ||
                (a.data('setTimeout', !0),
                setTimeout(function () {
                  !f.data('enter') && !a.data('enter') && b.slides.hidePanel(c);
                  a.data('setTimeout', !1);
                }, 300));
            }),
            j.bind('mouseenter', function () {
              d(this).data('enter', !0);
            }),
            j.bind('mouseleave', function () {
              var a = d(this),
                c = j.index(a),
                f = l.eq(c);
              a.data('enter', !1);
              f.data('setTimeout') ||
                (f.data('setTimeout', !0),
                setTimeout(function () {
                  !a.data('enter') && !f.data('enter') && b.slides.hidePanel(c);
                  f.data('setTimeout', !1);
                }, 300));
            }));
      }
      g &&
        f &&
        (a.hideAllContentsFirst ||
          g.$element.each(function (a) {
            a == b.slides.activeIndex ? d(this).addClass(f) : d(this).removeClass(f);
          }),
        b._findWidgetElements('a.' + f).each(function () {
          d(this).data('default-active', !0);
        }),
        b.slides
          .bind('wp-panel-show', function (a, b) {
            g.$element.eq(b.panelIndex).addClass(f);
          })
          .bind('wp-panel-hide', function (a, b) {
            var c = g.$element.eq(b.panelIndex);
            c.data('default-active') || c.removeClass(f);
          }));
      c._attachStopOnClickHandler(b, b.$firstBtn);
      c._attachStopOnClickHandler(b, b.$lastBtn);
      c._attachStopOnClickHandler(b, b.$previousBtn);
      c._attachStopOnClickHandler(b, b.$nextBtn);
      c._attachStopOnClickHandler(b, b.$playBtn);
      c._attachStopOnClickHandler(b, b.$stopBtn);
      c._attachStopOnClickHandler(b, b.$closeBtn);
      g && !h && c._attachStopOnClickHandler(b, g.$element);
      b._csspIsImageSlideShow ||
        (b.slides
          .bind('wp-panel-hide', function (a, b) {
            Muse.Utils.detachIframesAndObjectsToPauseMedia(d(b.panel));
          })
          .bind('wp-panel-show', function (a, c) {
            setTimeout(function () {
              Muse.Utils.attachIframesAndObjectsToResumeMedia(d(c.panel));
            }, b.options.transitionDuration);
          }),
        j.each(function () {
          this != b.slides.activeElement || a.hideAllContentsFirst ? Muse.Utils.detachIframesAndObjectsToPauseMedia(d(this)) : Muse.Utils.attachIframesAndObjectsToResumeMedia(d(this));
        }));
      b.bind('wp-swiped', function () {
        (b.options.autoPlay || b._sslbpAutoPlay) && b.options.resumeAutoplay && 0 < b.options.resumeAutoplayInterval && c._startRestartTimer(b);
      });
    },
    _startRestartTimer: function (b) {
      this._stopRestartTimer();
      this._restartTimer = setTimeout(function () {
        b.play(!0);
      }, b.options.resumeAutoplayInterval + b.options.transitionDuration);
    },
    _stopRestartTimer: function () {
      this._restartTimer && clearTimeout(this._restartTimer);
      this._restartTimer = 0;
    },
    _attachStopOnClickHandler: function (b, c) {
      var a = this;
      c.bind(b.options.event === 'click' ? 'click' : 'mouseover', function () {
        b.stop();
        (b.options.autoPlay || b._sslbpAutoPlay) && b.options.resumeAutoplay && 0 < b.options.resumeAutoplayInterval && a._startRestartTimer(b);
      });
    },
    _hitTest: function (b, c) {
      c.outerWidth() === 0 && (c = c.children('.popup_anchor').children('.popup_element').eq(0));
      var a = c.offset(),
        a = { x: a.left, y: a.top, width: c.outerWidth(), height: c.outerHeight() };
      return b.pageX >= a.x && b.pageX <= a.x + a.width && b.pageY >= a.y && b.pageY <= a.y + a.height;
    },
    _layoutThumbs: function (b) {
      var c = b.options,
        a = Muse.Utils.getStyleValue;
      b._findWidgetElements('.' + c.slideLinksClassName).each(function () {
        var b = d(this).find('.' + c.slideLinkClassName);
        firstThumb = b[0];
        tWidth = a(firstThumb, 'width');
        tHeight = a(firstThumb, 'height');
        gapH = a(firstThumb, 'margin-right');
        gapV = a(firstThumb, 'margin-bottom');
        borderL = a(firstThumb, 'border-left-width');
        borderR = a(firstThumb, 'border-right-width');
        borderT = a(firstThumb, 'border-top-width');
        borderB = a(firstThumb, 'border-bottom-width');
        gWidth = a(this, 'width');
        paddingL = a(this, 'padding-left');
        paddingT = a(this, 'padding-top');
        maxNumThumb = Math.floor((gWidth + gapH) / (tWidth + borderL + borderR + gapH));
        gStyle = this.runtimeStyle ? this.runtimeStyle : this.style;
        numRow = Math.ceil(b.length / maxNumThumb);
        firstRowNum = b.length < maxNumThumb ? b.length : maxNumThumb;
        leftPos = leftMostPos = Muse.Utils.pixelRound((gWidth - (tWidth + borderL + borderR) * firstRowNum - gapH * (firstRowNum - 1)) / 2) + paddingL;
        topPos = paddingT;
        numInRow = 1;
        gStyle.height = (tHeight + borderT + borderB) * numRow + gapV * (numRow - 1) + 'px';
        b.each(function () {
          numInRow > firstRowNum && ((numInRow = 1), (leftPos = leftMostPos), (topPos += tHeight + borderT + borderB + gapV));
          numInRow++ > 1 && (leftPos += tWidth + borderL + borderR + gapH);
          var a = this.runtimeStyle ? this.runtimeStyle : this.style;
          a.marginRight = '0px';
          a.marginBottom = '0px';
          a.left = leftPos + 'px';
          a.top = topPos + 'px';
        });
      });
    },
    _resizeFullScreenImages: function (b, c, a) {
      c.each(function () {
        d(this)
          .find('img')
          .each(function () {
            this.complete && !d(this).hasClass(b.options.imageIncludeClassName) && b._csspPositionImage(this, a, b.options.elastic);
          });
      });
    },
    _setupImagePositioning: function (b, c, a, g) {
      var j = this;
      c.each(function () {
        d(this)
          .find('img')
          .each(function () {
            var b = this;
            b.complete
              ? j._positionImage(b, a, g)
              : d(b).load(function () {
                  j._positionImage(b, a, g);
                });
          });
      });
    },
    _positionImage: function (b, c, a, g, j) {
      var f = d(window),
        h = b.runtimeStyle ? b.runtimeStyle : b.style,
        i = a === 'fullWidth' || a === 'fullScreen',
        l = a === 'fullHeight' || a === 'fullScreen',
        k = c == 'fitContentProportionally';
      $img = d(b);
      i = i ? (window.innerWidth ? window.innerWidth : f.width()) : k ? $img.data('width') : $img.parent().closest(':not(.bc_ch_wrapper)').width();
      f = l ? (window.innerHeight ? window.innerHeight : f.height()) : k ? $img.data('height') : $img.parent().closest(':not(.bc_ch_wrapper)').height();
      g = g !== void 0 ? g : Muse.Utils.getNaturalWidth(b);
      b = j !== void 0 ? j : Muse.Utils.getNaturalHeight(b);
      a !== 'off' && (g === 0 && (g = $img.data('imageWidth')), b === 0 && (b = $img.data('imageHeight')));
      if (i == g && f == b) (h.marginTop = '0px'), (h.marginLeft = '0px');
      else {
        l = g;
        j = b;
        if (c == 'fillFrameProportionally') {
          if (a !== 'off' || (g > i && b > f)) (c = g / i), (a = b / f), c < a ? ((j = b / c), (l = i)) : ((j = f), (l = g / a));
        } else if (c == 'fitContentProportionally' && (a !== 'off' || g > i || b > f)) (c = g / i), (a = b / f), c > a ? ((j = b / c), (l = g / c)) : ((j = b / a), (l = g / a));
        h.width = Muse.Utils.pixelRound(l) + 'px';
        h.height = Muse.Utils.pixelRound(j) + 'px';
        h.marginTop = Muse.Utils.pixelRound((f - j) / 2) + 'px';
        h.marginLeft = Muse.Utils.pixelRound((i - l) / 2) + 'px';
      }
    },
  };
  d.extend(WebPro.Widget.ContentSlideShow.slideImageIncludePlugin.defaultOptions, { imageIncludeClassName: 'ImageInclude', slideLoadingClassName: 'SSSlideLoading' });
  WebPro.Widget.ContentSlideShow.prototype.defaultPlugins = [Muse.Plugins.ContentSlideShow];
  WebPro.Widget.ContentSlideShow.prototype._getAjaxSrcForImage = function (b) {
    for (var c = d(window).data('ResolutionManager').getDataSrcAttrName(), a = c.length, g, j = 0; j < a; j++) if ((g = b.data(c[j])) && g.length) return g;
    return b.data('src');
  };
});
(function () {
  if (!('undefined' == typeof Muse || 'undefined' == typeof Muse.assets)) {
    var a = (function (a, b) {
      for (var c = 0, d = a.length; c < d; c++) if (a[c] == b) return c;
      return -1;
    })(Muse.assets.required, 'musewpslideshow.js');
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName('meta'), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ('generator' == d.getAttribute('name')) {
          '2017.0.1.363' != d.getAttribute('content') && Muse.assets.outOfDate.push('musewpslideshow.js');
          break;
        }
      }
    }
  }
})();
