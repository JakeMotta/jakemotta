/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (d) {
  'function' === typeof define && define.amd && define.amd.jQuery ? define(['jquery', 'museutils'], d) : d(jQuery);
})(function (d) {
  (function (b, c) {
    function a() {}
    var g = {
      version: 0.1,
      inherit: function (a, b) {
        var c = function () {};
        c.prototype = b.prototype;
        a.prototype = new c();
        a.prototype.constructor = a;
        a.prototype._super = b;
      },
      ensureArray: function () {
        var a = [],
          c = arguments.length;
        c > 0 && (a = c > 1 || !b.isArray(arguments[0]) ? b.makeArray(arguments) : arguments[0]);
        return a;
      },
      hasPointerCapture: function () {
        return !!c.hasPointerCapture;
      },
      setPointerCapture: function (a, b) {
        if (b.pointerId && !c.hasPointerCapture)
          if (a.setPointerCapture) a.setPointerCapture(b.pointerId), (c.hasPointerCapture = !0);
          else if (a.msSetPointerCapture) a.msSetPointerCapture(b.pointerId), (c.hasPointerCapture = !0);
      },
      releasePointerCapture: function (a, b) {
        b.pointerId &&
          c.hasPointerCapture &&
          (a.releasePointerCapture ? a.releasePointerCapture(b.pointerId) : a.msReleasePointerCapture && a.msReleasePointerCapture(b.pointerId), delete c.hasPointerCapture);
      },
      scopedFind: function (a, c, g, d) {
        for (var g = ' ' + g + ' ', l = [], a = b(a).find(c), c = a.length, d = b(d)[0], k = 0; k < c; k++)
          for (var m = a[k], n = m; n; ) {
            if (n.className && (' ' + n.className + ' ').indexOf(g) !== -1) {
              n === d && l.push(m);
              break;
            }
            n = n.parentNode;
          }
        return b(l);
      },
    };
    b.extend(a.prototype, {
      bind: function (a, c, g) {
        return b(this).bind(a, c, g);
      },
      unbind: function (a, c) {
        return b(this).unbind(a, c);
      },
      trigger: function (a, c) {
        var g = b.Event(a);
        b(this).trigger(g, c);
        return g;
      },
    });
    g.EventDispatcher = a;
    c.WebPro = g;
  })(d, window, document);
  (function (b, c) {
    var a = 1;
    c.ImageLoader = function (a) {
      c.EventDispatcher.call();
      var d = this;
      this.options = b.extend({}, this.defaultOptions, a);
      this._currentEntry = null;
      this._queue = [];
      this._isRunning = this._needsSort = !1;
      this._loader = new Image();
      this._loadFunc = function () {
        d._handleLoad();
      };
      this._loadErrorFunc = function () {
        d._handleError();
      };
      this._timeoutFunc = function () {
        d.trigger('wp-image-loader-timeout', this._currentEntry);
        d._loadNext();
      };
    };
    c.inherit(c.ImageLoader, c.EventDispatcher);
    b.extend(c.ImageLoader.prototype, {
      defaultOptions: { timeoutInterval: 1e3 },
      add: function (g, d) {
        if (g) {
          urls = c.ensureArray(g);
          for (var f = 0; f < urls.length; f++) {
            var h = b.extend({ reqId: a++, src: urls[f], width: 0, height: 0, priority: 50, callback: null, data: null }, d);
            this._queue.push(h);
            this._needsSort = !0;
            this.trigger('wp-image-loader-add', h);
          }
          this._isRunning && !this._currentEntry && this._loadNext();
        }
      },
      reprioritize: function (a, b) {
        if (!(this._currentEntry && this._currentEntry.src == a)) {
          var c;
          for (c = 0; c < this._queue.length; ++c) if (this._queue[c].src == a) break;
          if (c != 0 && c < this._queue.length) this._queue = this._queue.splice(c, b ? this._queue.length - c : 1).concat(this._queue);
        }
      },
      start: function () {
        if (!this._isRunning) (this._isRunning = !0), this._loadNext(), this.trigger('wp-image-loader-start');
      },
      stop: function () {
        if (this._isRunning) this._currentEntry && this._queue.unshift(this._currentEntry), this._resetLoader(), (this._isRunning = !1), this.trigger('wp-image-loader-stop');
      },
      clearQueue: function () {
        var a = this._isRunning;
        this.stop();
        this._queue.length = 0;
        a && this.start();
      },
      isQueueEmpty: function () {
        return this._queue.length == 0;
      },
      _loadNext: function () {
        var f;
        this._resetLoader();
        var a = this._queue;
        if (a.length) {
          if (this._needsSort)
            (f = this._queue =
              a.sort(function (a, b) {
                var c = a.priority - b.priority;
                return c ? c : a.reqId - b.reqId;
              })),
              (a = f),
              (this._needsSort = !1);
          this._currentEntry = a = a.shift();
          var b = this._loader;
          b.onload = this._loadFunc;
          b.onerror = this._loadErrorFunc;
          b.src = a.src;
        }
      },
      _resetLoader: function () {
        var a = this._loader;
        a.onload = null;
        a.onerror = null;
        this._currentEntry = a.src = null;
        if (this._timeoutTimerId) clearTimeout(this._timeoutTimerId), (this._timeoutTimerId = 0);
      },
      _handleLoad: function () {
        var a = this._loader,
          b = this._currentEntry;
        b.width = a.width;
        b.height = a.height;
        b.callback && b.callback(b.src, b.width, b.height, b.data);
        this.trigger('wp-image-loader-load-success', b);
        this._loadNext();
      },
      _handleError: function () {
        this.trigger('wp-image-loader-load-error', this._currentEntry);
        this._loadNext();
      },
    });
  })(d, WebPro, window, document);
  (function (b, c) {
    function a() {
      c.EventDispatcher.call(this);
      this._initialize.apply(this, arguments);
    }
    c.inherit(a, c.EventDispatcher);
    b.extend(a.prototype, {
      defaultOptions: {},
      _widgetName: 'Widget',
      _initialize: function () {
        var a;
        this.plugins = [];
        var c = this.trigger('before-setup');
        c.isDefaultPrevented() || ((a = this._setUp.apply(this, arguments)), this.trigger('setup'));
        c = this.trigger('before-init-plugins');
        c.isDefaultPrevented() || (this._initializePlugins(a), this.trigger('init-plugins'));
        this.options = b.extend({}, this.defaultOptions, a);
        c = this.trigger('before-extract-data');
        c.isDefaultPrevented() || (this._extractData(), this.trigger('extract-data'));
        c = this.trigger('before-transform-markup');
        c.isDefaultPrevented() || (this._transformMarkup(), this.trigger('transform-markup'));
        c = this.trigger('before-attach-behavior');
        c.isDefaultPrevented() || (this._attachBehavior(), this.trigger('attach-behavior'));
        c = this.trigger('before-ready');
        c.isDefaultPrevented() || (this._ready(), this.trigger('ready'));
        var d = this;
        b('body')
          .on('muse_bp_activate', function (a, b, c) {
            c.is(d.$bp) && (d._bpActivate(), d.trigger('bp-activate'));
          })
          .on('muse_bp_deactivate', function (a, b, c) {
            c.is(d.$bp) && (d._bpDeactivate(), d.trigger('bp-deactivate'));
          });
      },
      _setUp: function (a, c) {
        this.$element = b(a);
        var d = this.$element.closest('.breakpoint');
        if (1 == d.length) (this.$bp = d), (this.breakpoint = this.$bp.data('bpObj'));
        return c;
      },
      _initializePlugins: function (a) {
        for (
          var a = a || {},
            b = ((typeof a.useDefaultPlugins === 'undefined' || a.useDefaultPlugins) && this.defaultPlugins ? this.defaultPlugins : []).concat(a.plugins || []),
            b = b.sort(function (a, b) {
              a = typeof a.priority === 'number' ? a.priority : 50;
              b = typeof b.priority === 'number' ? b.priority : 50;
              return a - b;
            }),
            c = 0;
          c < b.length;
          c++
        ) {
          var d = b[c];
          d && d.initialize && d.initialize(this, a);
        }
        this.plugins = b;
      },
      _extractData: function () {},
      _transformMarkup: function () {},
      _attachBehavior: function () {},
      _ready: function () {},
      _bpActivate: function () {},
      _bpDeactivate: function () {},
    });
    c.Widget = a;
    c.widget = function (a, d, f) {
      var h = (f && d) || c.Widget,
        f = f || d || {},
        d = function () {
          h.apply(this, arguments);
          this._widgetName = a;
        };
      c.inherit(d, h);
      b.extend(d.prototype, f);
      d.prototype.defaultOptions = b.extend({}, h.prototype.defaultOptions, f.defaultOptions);
      var f = a.split('.'),
        i = f.length;
      namespace = (i > 1 && f[0]) || 'Widget';
      a = f[i - 1];
      c[namespace][a] = d;
    };
  })(d, WebPro, window, document);
  (function (b, c) {
    c.widget('Widget.Button', c.Widget, {
      defaultOptions: { hoverClass: 'wp-button-hover', activeClass: 'wp-button-down', disabledClass: 'wp-button-disabled', disabled: !1, clickCallback: null, prevCallback: null, nextCallback: null },
      _attachBehavior: function () {
        var a = this,
          c = function (d) {
            a.$element.removeClass(a.options.activeClass);
            !a.options.disabled && a.options.clickCallback && a.mouseDown && a.options.clickCallback.call(this, d);
            b(a.$element).off('mouseup pointerup', c);
            a.mouseDown = !1;
          };
        this.mouseDown = !1;
        this.$element
          .on('keydown', function (b) {
            if (!a.options.disabled) {
              var c = b.which || b.keyCode;
              switch (c) {
                case 37:
                case 38:
                  b.preventDefault();
                  a.options.prevCallback && a.options.prevCallback.call(this, b);
                  break;
                case 39:
                case 40:
                  b.preventDefault();
                  a.options.nextCallback && a.options.nextCallback.call(this, b);
                  break;
                case 32:
                case 13:
                  c === 32 && b.preventDefault(), a.options.clickCallback && a.options.clickCallback.call(this, b);
              }
            }
          })
          .on('mouseover', function () {
            a.options.disabled || a.$element.addClass(a.options.hoverClass + (a.mouseDown ? ' ' + a.options.activeClass : ''));
          })
          .on('mouseleave', function () {
            a.$element.removeClass(a.options.hoverClass + ' ' + a.options.activeClass);
            b(a.$element).off('mouseup', c);
          })
          .on('mousedown pointerdown', function () {
            if (!a.options.disabled) (a.mouseDown = !0), a.$element.addClass(a.options.activeClass), b(a.$element).on('mouseup pointerup', c);
          });
        this.disabled(this.options.disabled);
      },
      disabled: function (a) {
        if (typeof a === 'boolean') (this.options.disabled = a), this.$element[a ? 'addClass' : 'removeClass'](this.options.disabledClass);
        return this.options.disabled;
      },
    });
    b.fn.wpButton = function (a) {
      this.each(function () {
        new c.Widget.Button(this, a);
      });
      return this;
    };
  })(d, WebPro, window, document);
  (function (b, c) {
    c.widget('Widget.RadioGroup', c.Widget, {
      _widgetName: 'radio-group',
      defaultOptions: {
        defaultIndex: 0,
        hoverClass: 'wp-radio-hover',
        downClass: 'wp-radio-down',
        disabledClass: 'wp-radio-disabled',
        checkedClass: 'wp-radio-checked',
        disabled: !1,
        toggleStateEnabled: !1,
      },
      _attachBehavior: function () {
        var a = this;
        this.buttons = [];
        this.activeElement = null;
        this.activeIndex = -1;
        this.$element.each(function () {
          a.buttons.push(a._addButtonBehavior(this));
        });
        this.disabled(this.options.disabled);
      },
      _bpActivate: function () {
        if (-1 != this.activeIndex) {
          var a = this._getElement(this.activeIndex);
          a && b(a).addClass(this.options.checkedClass);
        }
      },
      _bpDeactivate: function () {
        if (-1 != this.activeIndex) {
          var a = this._getElement(this.activeIndex);
          a && b(a).removeClass(this.options.checkedClass);
        }
      },
      _addButtonBehavior: function (a) {
        var b = this,
          d = new c.Widget.Button(a, {
            hoverClass: this.options.hoverClass,
            downClass: this.options.downClass,
            disabledClass: this.options.disabledClass,
            clickCallback: function (c) {
              return b._handleClick(c, d, a);
            },
            prevCallback: function (c) {
              return b._handlePrev(c, d, a);
            },
            nextCallback: function (c) {
              return b._handleNext(c, d, a);
            },
          });
        return d;
      },
      _handlePrev: function () {
        if (!this.options.disabled) {
          if (this.activeIndex > this._getElementIndex(this.firstButton.$element[0])) this.activeIndex--;
          else if (this.activeIndex === this._getElementIndex(this.firstButton.$element[0]) || this.activeIndex === -1) this.activeIndex = this._getElementIndex(this.lastButton.$element[0]);
          this._getElementByIndex(this.activeIndex).focus();
          this.checkButton(this.activeIndex);
        }
      },
      _handleNext: function () {
        if (!this.options.disabled) {
          if (this.activeIndex < this.numButtons - 1) this.activeIndex++;
          else if (this.activeIndex === this.numButtons - 1) this.activeIndex = this._getElementIndex(this.firstButton.$element[0]);
          this._getElementByIndex(this.activeIndex).focus();
          this.checkButton(this.activeIndex);
        }
      },
      _handleClick: function (a, b, c) {
        this.options.disabled || this.checkButton(c);
      },
      _getElementIndex: function (a) {
        return a ? b.inArray(a, this.$element.get()) : -1;
      },
      _getElementByIndex: function (a) {
        return a >= 0 ? this.$element.eq(a)[0] : null;
      },
      _getElement: function (a) {
        return typeof a === 'number' ? this._getElementByIndex(a) : a;
      },
      checkButton: function (a) {
        var a = this._getElement(a),
          c = this.activeElement,
          d = this.options.checkedClass;
        a !== c ? (c && this.uncheckButton(c), a && b(a).addClass(d)) : this.options.toggleStateEnabled && a && (this.uncheckButton(a, d), (a = null));
        this.activeElement = a;
        this.activeIndex = this._getElementIndex(a);
      },
      uncheckButton: function (a) {
        b(a).removeClass(this.options.checkedClass);
      },
      disabled: function (a) {
        if (typeof a === 'boolean')
          (this.disabled = a),
            b.each(this.buttons, function () {
              this.disabled(a);
            });
        return this.options.disabled;
      },
    });
    b.fn.wpRadioGroup = function (a) {
      new c.Widget.RadioGroup(this, a);
      return this;
    };
  })(d, WebPro, window, document);
  (function (b, c) {
    c.widget('Widget.TabGroup', c.Widget.RadioGroup, {
      defaultOptions: {
        defaultIndex: 0,
        hoverClass: 'wp-tab-hover',
        downClass: 'wp-tab-down',
        disabledClass: 'wp-tab-disabled',
        checkedClass: 'wp-tab-active',
        disabled: !1,
        toggleStateEnabled: !1,
        isPopupButtonWidget: !1,
        parentSelectors: ['.ThumbGroup', '.AccordionWidget', '.TabbedPanelsWidget'],
      },
      _attachBehavior: function () {
        this._super.prototype._attachBehavior.apply(this, arguments);
        this.isPopupButtonWidget = this.options.isPopupButtonWidget;
        this.numButtons = this.buttons.length;
        this.firstButton = this.buttons[0];
        this.lastButton = this.buttons[this.numButtons - 1];
        this.configureAria();
      },
      selectTab: function (a) {
        this.checkButton(a);
      },
      configureAria: function () {
        var a = this;
        if (this.options.isPopupButtonWidget === !0 || this.numButtons === 1)
          b.each(this.buttons, function () {
            this.$element.attr({ role: 'button', tabindex: '0', 'aria-haspopup': 'true' });
          }),
            (this.isPopupButtonWidget = !0);
        else if (this.numButtons > 1)
          (this.parentElement = this.buttons[0].$element.parents(this.options.parentSelectors.join())),
            this.parentElement.attr('role', 'tablist'),
            b.each(this.buttons, function (b) {
              this.$element.attr({ role: 'tab', tabindex: '0' });
              b > 0 && a.uncheckButton(this.$element);
            });
      },
      checkButton: function (a) {
        var c = this._getElement(a),
          d = this._getElementIndex(c),
          d = { tab: c, tabIndex: d };
        this.trigger('wp-tab-before-select', d);
        this._super.prototype.checkButton.apply(this, arguments);
        b(c).attr({ tabindex: '0' });
        this.options.contentLayout_runtime !== 'lightbox' && b(c).attr({ 'aria-selected': 'true' });
        this.trigger('wp-tab-select', d);
      },
      uncheckButton: function (a) {
        this._super.prototype.uncheckButton.apply(this, arguments);
        this.isPopupButtonWidget || (b(a).attr({ tabindex: '-1' }), this.options.contentLayout_runtime !== 'lightbox' && b(a).attr({ 'aria-selected': 'false' }));
      },
    });
    b.fn.wpTabGroup = function (a) {
      new c.Widget.TabGroup(this, a);
      return this;
    };
  })(d, WebPro, window, document);
  (function (b, c) {
    c.widget('Widget.PanelGroup', c.Widget, {
      _widgetName: 'panel-group',
      defaultOptions: { defaultIndex: 0, panelClass: 'wp-panel', activeClass: 'wp-panel-active', toggleStateEnabled: !1, tabGroups: null },
      _setUp: function () {
        var a = this;
        this.tabGroups = [];
        this._tabCallback = function (b, c) {
          a._handleTabSelect(b, c);
        };
        this.showLock = 0;
        this.tabDriver = null;
        return this._super.prototype._setUp.apply(this, arguments);
      },
      _bpActivate: function () {
        if (-1 != this.activeIndex) {
          var a = this._getElement(this.activeIndex);
          a && b(a).addClass(this.options.activeClass);
        }
      },
      _bpDeactivate: function () {
        if (-1 != this.activeIndex) {
          var a = this._getElement(this.activeIndex);
          a && b(a).removeClass(this.options.activeClass);
        }
      },
      _attachBehavior: function () {
        this.activeElement = null;
        this.activeIndex = -1;
        this.$element.addClass(this.options.panelClass);
        var a = this.options.defaultIndex;
        typeof a === 'number' && a >= 0 && this.showPanel(a);
        this.addTabGroup(this.options.tabGroups);
      },
      _getElementIndex: function (a) {
        return a ? b.inArray(a, this.$element.get()) : -1;
      },
      _getElementByIndex: function (a) {
        return this.$element.eq(a)[0];
      },
      _getElement: function (a) {
        return typeof a === 'number' ? this._getElementByIndex(a) : a;
      },
      configureAria: function (a) {
        b.each(this.$element, function (c, d) {
          b(d).attr({ role: 'tabpanel', 'aria-labelledby': a.buttons[c].$element.attr('id') });
          a.buttons[c].$element.attr({ 'aria-controls': b(d).attr('id') });
        });
      },
      showPanel: function (a) {
        if (!this.showLock) {
          ++this.showLock;
          var c = this._getElement(a),
            d = this.activeElement,
            f = this.options.activeClass;
          if (c)
            if (c !== d) {
              a = { panel: c, panelIndex: this._getElementIndex(c) };
              this.trigger('wp-panel-before-show', a);
              d && this.hidePanel(d);
              b(c).addClass(f);
              this.activeElement = c;
              this.activeIndex = this._getElementIndex(c);
              c = this.tabGroups;
              for (d = 0; d < c.length; d++) (f = c[d]), f !== this.tabDriver && f.selectTab(this.activeIndex);
              this.trigger('wp-panel-show', a);
            } else this.options.toggleStateEnabled && this.hidePanel(c);
          --this.showLock;
        }
      },
      hidePanel: function (a) {
        if ((a = typeof a === 'number' ? this.$element.eq(a)[0] : a)) {
          var c = { panel: a, panelIndex: this._getElementIndex(a) };
          this.trigger('wp-panel-before-hide', c);
          b(a).removeClass(this.options.activeClass);
          if (a === this.activeElement) (this.activeElement = null), (this.activeIndex = -1);
          this.trigger('wp-panel-hide', c);
        }
      },
      _handleTabSelect: function (a, b) {
        if (!this.showLock) (this.tabDriver = a.target), this.showPanel(b.tabIndex), (this.tabDriver = null);
      },
      addTabGroup: function (a) {
        if (a)
          for (var a = c.ensureArray(a), d = a.length, j = 0; j < d; j++) {
            var f = a[j];
            b.inArray(this.tabGroups, f) === -1 && (this.tabGroups.push(f), f.selectTab(this.activeIndex), f.unbind('wp-tab-select').bind('wp-tab-select', this._tabCallback), this.configureAria(f));
          }
      },
      removeTabGroup: function (a) {
        for (var a = c.ensureArray(a), d = a.length, j = 0; j < d; j++) {
          var f = a[j];
          sets = this.tabGroups;
          loc = b.inArray(sets, f);
          loc !== -1 && sets.splice(loc, 1);
        }
      },
    });
    b.fn.wpPanelGroup = function (a) {
      new c.Widget.PanelGroup(this, a);
      return this;
    };
  })(d, WebPro, window, document);
  (function (b, c) {
    c.widget('Widget.Disclosure', c.Widget, {
      defaultOptions: {
        widgetClassName: 'wp-disclosure-panels',
        tabClassName: 'wp-disclosure-panels-tab',
        tabHoverClassName: 'wp-disclosure-panels-tab-hover',
        tabDownClassName: 'wp-disclosure-panels-tab-down',
        panelClassName: 'wp-disclosure-panels-panel',
        tabActiveClassName: 'wp-disclosure-panels-tab-active',
        panelActiveClassName: 'wp-disclosure-panels-panel-active',
        defaultIndex: 0,
        toggleStateEnabled: !1,
      },
      _attachBehavior: function () {
        var a = this.$element[0],
          b = this.options.widgetClassName,
          d = c.scopedFind(a, '.' + this.options.tabClassName, b, a),
          a = c.scopedFind(a, '.' + this.options.panelClassName, b, a);
        this.tabs = new c.Widget.TabGroup(d, {
          hoverClass: this.options.tabHoverClassName,
          downClass: this.options.tabDownClassName,
          checkedClass: this.options.tabActiveClassName,
          toggleStateEnabled: this.options.toggleStateEnabled,
        });
        this.panels = new c.Widget.PanelGroup(a, {
          panelClass: this.options.panelClassName,
          activeClass: this.options.panelActiveClassName,
          defaultIndex: this.options.defaultIndex,
          toggleStateEnabled: this.options.toggleStateEnabled,
        });
        this.panels.addTabGroup(this.tabs);
      },
    });
    c.widget('Widget.TabbedPanels', c.Widget.Disclosure, {
      defaultOptions: {
        widgetClassName: 'wp-tabbed-panels-panels',
        tabClassName: 'wp-tabbed-panels-panels-tab',
        tabHoverClassName: 'wp-tabbed-panels-panels-tab-hover',
        tabDownClassName: 'wp-tabbed-panels-panels-tab-down',
        tabActiveClassName: 'wp-tabbed-panels-panels-tab-active',
        panelClassName: 'wp-tabbed-panels-panels-panel',
        panelActiveClassName: 'wp-tabbed-panels-panels-panel-active',
        toggleStateEnabled: !1,
      },
    });
    c.widget('Widget.Accordion', c.Widget.Disclosure, {
      defaultOptions: {
        widgetClassName: 'wp-accordion',
        tabClassName: 'wp-accordion-tab',
        tabHoverClassName: 'wp-accordion-tab-hover',
        tabDownClassName: 'wp-accordion-tab-down',
        tabActiveClassName: 'wp-accordion-tab-active',
        panelClassName: 'wp-accordion-panel',
        panelActiveClassName: 'wp-accordion-panel-active',
        toggleStateEnabled: !1,
      },
    });
  })(d, WebPro, window, document);
  (function (b, c) {
    c.Widget.Disclosure.DisplayPropertyTransitionPlugin = {
      defaultOptions: {},
      initialize: function (a, c) {
        var d = this;
        b.extend(c, b.extend({}, d.defaultOptions, c));
        a.bind('attach-behavior', function () {
          d._attachBehavior(a);
        });
      },
      _attachBehavior: function (a) {
        var a = a.panels,
          b = a.$element,
          c = a.activeIndex;
        a.bind('wp-panel-show', function (a, b) {
          b.panel.style.display = 'block';
        });
        a.bind('wp-panel-hide', function (a, b) {
          b.panel.style.display = 'none';
        });
        b.each(function (a) {
          this.style.display = a !== c ? 'none' : 'block';
        });
      },
    };
    c.Widget.Disclosure.AccordionTransitionPlugin = {
      defaultOptions: { transitionDirection: 'vertical', transitionDuration: 500, dispatchTransitionEvents: !0 },
      initialize: function (a, c) {
        var d = this;
        b.extend(c, b.extend({}, d.defaultOptions, c));
        a.bind('attach-behavior', function () {
          d._attachBehavior(a);
        })
          .bind('bp-activate', function () {
            d._bpActivate(a);
          })
          .bind('bp-deactivate', function () {
            d._bpDeactivate(a);
          });
      },
      _bpActivate: function (a) {
        if (-1 != a.panels.activeIndex) {
          var b = a.options,
            c = b.tabActiveClassName,
            b = b.transitionDirection,
            d = a.panels.activeIndex,
            a = a.panels.$element,
            h = { overflow: 'hidden' };
          if (b === 'vertical' || b === 'both') h.height = 'auto';
          if (b === 'horizontal' || b === 'both') h.width = 'auto';
          a.eq(d).addClass(c).css(h);
        }
      },
      _bpDeactivate: function (a) {
        var c = a.options,
          d = c.tabActiveClassName,
          f = c.transitionDirection;
        a.panels.$element.each(function () {
          var a = { overflow: 'hidden' };
          if (f === 'vertical' || f === 'both') a.height = '0';
          if (f === 'horizontal' || f === 'both') a.width = '0';
          b(this).css(a).removeClass(d);
        });
      },
      _attachBehavior: function (a) {
        var c = this,
          d = a.panels,
          f = d.$element,
          h = d.activeIndex,
          i = a.options.transitionDirection,
          l = a.options.widgetClassName === 'AccordionWidget' ? b(f[0]).closest('*[data-rotate]') : null;
        if (l && l.length > 0) (a.options.marginBottom = Muse.Utils.getCSSIntValue(l, 'margin-bottom')), (a.options.originalHeight = l[0].scrollHeight);
        a.options.rotatedAccordion = l;
        d.bind('wp-panel-show', function (b, d) {
          c._showPanel(a, d);
        });
        d.bind('wp-panel-hide', function (b, d) {
          c._hidePanel(a, d);
        });
        f.each(function (a) {
          var a = a === h,
            c = {};
          c.overflow = a ? '' : 'hidden';
          if (i === 'vertical' || i === 'both') c.height = a ? 'auto' : '0';
          if (i === 'horizontal' || i === 'both') c.width = a ? 'auto' : '0';
          b(this).css(c);
        });
      },
      _updateMarginBottomForRotatedAccordion: function (a) {
        a.options.rotatedAccordion.css('margin-bottom', Math.round(a.options.marginBottom - (a.options.rotatedAccordion[0].scrollHeight - a.options.originalHeight)) + 'px');
      },
      _transitionPanel: function (a, c, d) {
        b('body').trigger('wp-page-height-change', c - a);
        if ((a = d.options.rotatedAccordion) && a.length > 0) {
          if (d.options.originalHeight == 0 && 'undefined' !== typeof c) (d.options.marginBottom = Muse.Utils.getCSSIntValue(a, 'margin-bottom')), (d.options.originalHeight = a[0].scrollHeight);
          this._updateMarginBottomForRotatedAccordion(d);
        }
      },
      _showPanel: function (a, c) {
        if (!a.$bp || a.$bp.hasClass('active')) {
          var d = a.options,
            f = d.transitionDirection,
            h = b(c.panel),
            i = {},
            l = d.dispatchTransitionEvents,
            k = this,
            m = h.height(),
            n = function (b) {
              b = parseInt(b.elem.style.height);
              k._transitionPanel(m, b, a);
              m = b;
            };
          if (f === 'vertical' || f === 'both') i.height = h[0].scrollHeight + 'px';
          if (f === 'horizontal' || f === 'both') i.width = h[0].scrollWidth + 'px';
          h.stop(!0, !0)
            .queue('animationFrameFx', b.animationFrameFx)
            .animate(i, {
              duration: d.transitionDuration,
              progress: l ? n : null,
              queue: 'animationFrameFx',
              complete: function () {
                var b = { overflow: '' };
                if (f === 'vertical' || f === 'both') b.height = 'auto';
                if (f === 'horizontal' || f === 'both') b.width = 'auto';
                h.css(b);
                (b = a.options.rotatedAccordion) && b.length > 0 && k._updateMarginBottomForRotatedAccordion(a);
              },
            })
            .dequeue('animationFrameFx');
        }
      },
      _hidePanel: function (a, c) {
        if (!a.$bp || a.$bp.hasClass('active')) {
          var d = a.options,
            f = d.transitionDirection,
            h = b(c.panel),
            i = {},
            l = d.dispatchTransitionEvents,
            k = this,
            m = h.height(),
            n = function (b) {
              b = parseInt(b.elem.style.height);
              k._transitionPanel(m, b, a);
              m = b;
            };
          if (f === 'vertical' || f === 'both') i.height = '0';
          if (f === 'horizontal' || f === 'both') i.width = '0';
          h.stop(!0, !0)
            .queue('animationFrameFx', b.animationFrameFx)
            .animate(i, {
              duration: d.transitionDuration,
              queue: 'animationFrameFx',
              progress: l ? n : null,
              complete: function () {
                h.css('overflow', 'hidden');
                var b = a.options.rotatedAccordion;
                b && b.length > 0 && k._updateMarginBottomForRotatedAccordion(a);
              },
            })
            .dequeue('animationFrameFx');
        }
      },
    };
  })(d, WebPro, window, document);
  (function (b, c) {
    c.widget('Widget.SlideShowBase', c.Widget, {
      _widgetName: 'slideshow-base',
      defaultOptions: { displayInterval: 6e3, autoPlay: !1, loop: !0, playOnce: !1 },
      _setUp: function () {
        var a = this;
        this._ssTimer = 0;
        this._ssTimerTriggered = !1;
        this._ssTimerCallback = function () {
          a._ssTimerTriggered = !0;
          a.next();
          a._ssTimerTriggered = !1;
        };
        return c.Widget.prototype._setUp.apply(this, arguments);
      },
      _ready: function () {
        this.options.autoPlay && this.play();
      },
      play: function (a) {
        e = this.trigger('wp-slideshow-before-play');
        e.isDefaultPrevented() || (this._startTimer(!1, a), this.trigger('wp-slideshow-play'));
      },
      stop: function () {
        e = this.trigger('wp-slideshow-before-stop');
        e.isDefaultPrevented() || (this._stopTimer(), this.trigger('wp-slideshow-stop'));
      },
      isPlaying: function () {
        return this._ssTimer !== 0;
      },
      _startTimer: function (a, b) {
        this._stopTimer();
        var c = b ? 0 : this.options.displayInterval;
        a && (c += this.options.transitionDuration);
        this._ssTimer = setTimeout(this._ssTimerCallback, c);
      },
      _stopTimer: function () {
        this._ssTimer && clearTimeout(this._ssTimer);
        this._ssTimer = 0;
      },
      _executeCall: function (a, b) {
        e = this.trigger('wp-slideshow-before-' + a);
        e.isDefaultPrevented() || (this['_' + a].apply(this, b) && this.stop(), this.isPlaying() && this._startTimer(!0), this.trigger('wp-slideshow-' + a));
      },
      first: function () {
        return this._executeCall('first', arguments);
      },
      last: function () {
        return this._executeCall('last', arguments);
      },
      previous: function () {
        return this._executeCall('previous', arguments);
      },
      next: function () {
        return this._executeCall('next', arguments);
      },
      goTo: function () {
        return this._executeCall('goTo', arguments);
      },
      close: function () {
        return this._executeCall('close', arguments);
      },
      _first: function () {},
      _last: function () {},
      _previous: function () {},
      _next: function () {},
      _goTo: function () {},
      _close: function () {},
    });
  })(d, WebPro, window, document);
  (function (b, c) {
    c.widget('Widget.ContentSlideShow', c.Widget.SlideShowBase, {
      _widgetName: 'content-slideshow',
      defaultOptions: {
        slideshowClassName: 'wp-slideshow',
        clipClassName: 'wp-slideshow-clip',
        viewClassName: 'wp-slideshow-view',
        slideClassName: 'wp-slideshow-slide',
        slideLinkClassName: 'wp-slideshow-slide-link',
        firstBtnClassName: 'wp-slideshow-first-btn',
        lastBtnClassName: 'wp-slideshow-last-btn',
        prevBtnClassName: 'wp-slideshow-prev-btn',
        nextBtnClassName: 'wp-slideshow-next-btn',
        playBtnClassName: 'wp-slideshow-play-btn',
        stopBtnClassName: 'wp-slideshow-stop-btn',
        closeBtnClassName: 'wp-slideshow-close-btn',
        playingClassName: 'wp-slideshow-playing',
      },
      _findWidgetElements: function (a) {
        for (var d = this.$element[0], a = c.scopedFind(d, a, this.options.slideshowClassName, d), d = !0, j = 0; j < a.length; j++)
          if (parseInt(b(a[j]).attr('data-col-pos') || -100) === -100) {
            d = !1;
            break;
          }
        d &&
          a.sort(function (a, c) {
            var d = parseInt(b(a).attr('data-col-pos') || -1),
              g = parseInt(b(c).attr('data-col-pos') || -1);
            if (d < g) return -1;
            if (d > g) return 1;
            return 0;
          });
        return a;
      },
      _attachBtnHandler: function (a, b) {
        var c = this;
        this['$' + b + 'Btn'] = this._findWidgetElements('.' + a)
          .attr({ tabindex: '0', role: 'button', 'aria-label': b })
          .unbind('keydown')
          .bind('keydown', function (a) {
            var d = a.keyCode || a.which;
            if (d === 32 || d === 13) c[b](), a.preventDefault();
          })
          .unbind('click')
          .bind('click', function (a) {
            c[b]();
            a.preventDefault();
          });
      },
      _getAjaxSrcForImage: function (a) {
        return a.data('src');
      },
      _reprioritizeImageLoadingIfRequired: function (a) {
        !this._isLoaded(a) &&
          this._cssilLoader &&
          !this._cssilLoader.isQueueEmpty() &&
          ((a = b(this.slides.$element[a])), this._cssilLoader.reprioritize(this._getAjaxSrcForImage(a.is('img') ? a : a.find('img')), this.isPlaying()));
      },
      _bpActivate: function () {
        this.slides.bind('wp-panel-show', this._panelShowCallback);
      },
      _bpDeactivate: function () {
        this.slides.unbind('wp-panel-show').unbind('wp-panel-before-show').unbind('wp-panel-hide').unbind('wp-panel-before-hide');
        this.unbind('wp-slideshow-play').unbind('wp-slideshow-stop');
        this.tabs && this.tabs.trigger('wp-panel-hide', { panelIndex: this.slides.activeIndex });
      },
      _attachBehavior: function () {
        var a = this,
          b = this.options;
        this._super.prototype._attachBehavior.call(this);
        this._panelShowCallback = function () {
          a._ssTimerTriggered || (a.isPlaying() && a._startTimer(!1));
        };
        this.$element.addClass(b.slideshowClassName);
        var d = this.slides ? this.slides.$element : this._findWidgetElements('.' + b.slideClassName),
          f = this.tabs ? this.tabs.$element : this._findWidgetElements('.' + b.slideLinkClassName),
          h = b.event === 'click' && b.deactivationEvent === 'mouseout_click';
        if (
          !this.slides &&
          ((this.slides = new c.Widget.PanelGroup(d, { defaultIndex: (this.slides && this.slides.activeIndex) || b.defaultIndex || 0, toggleStateEnabled: h })),
          this.slides.bind('wp-panel-show', this._panelShowCallback),
          (this.tabs = null),
          f.length)
        )
          (this.tabs = new c.Widget.TabGroup(f, { defaultIndex: (this.tabs && this.tabs.activeIndex) || b.defaultIndex || 0, toggleStateEnabled: h, contentLayout_runtime: b.contentLayout_runtime })),
            this.slides.addTabGroup(this.tabs);
        this.slides.bind('wp-panel-before-show', function (b, c) {
          a._reprioritizeImageLoadingIfRequired(c.panelIndex);
        });
        this._attachBtnHandler(b.firstBtnClassName, 'first');
        this._attachBtnHandler(b.lastBtnClassName, 'last');
        this._attachBtnHandler(b.prevBtnClassName, 'previous');
        this._attachBtnHandler(b.nextBtnClassName, 'next');
        this._attachBtnHandler(b.playBtnClassName, 'play');
        this._attachBtnHandler(b.stopBtnClassName, 'stop');
        this._attachBtnHandler(b.closeBtnClassName, 'close');
        this.bind('wp-slideshow-play', function () {
          this.$element.addClass(b.playingClassName);
        });
        this.bind('wp-slideshow-stop', function () {
          this.$element.removeClass(b.playingClassName);
        });
      },
      _first: function () {
        this.slides.showPanel(0);
      },
      _last: function () {
        var a = this.slides;
        a.showPanel(a.$element.length - 1);
      },
      _previous: function () {
        var a = this.slides,
          b = a.$element.length,
          c = a.activeIndex,
          b = (c < 1 ? b : c) - 1;
        !this.options.loop && 0 == c ? this.isPlaying() && this.stop() : a.showPanel(b);
      },
      _next: function () {
        var a = this.slides,
          b = a.activeIndex,
          c = (b + 1) % a.$element.length;
        !this.options.loop && 0 == c
          ? this.isPlaying() && this.stop()
          : this.options.playOnce && 0 == c && this.isPlaying()
          ? this.stop()
          : (!this.isPlaying() || (this._isLoaded(b) && this._isLoaded(c))) && a.showPanel(c);
      },
      _goTo: function () {
        var a = this.slides;
        a.showPanel.apply(a, arguments);
      },
      _close: function () {
        var a = this.slides;
        a.hidePanel(a.activeElement);
      },
      _isLoaded: function (a) {
        if (this._csspIsImageSlideShow && ((a = b(this.slides.$element[a])), (a = a.is('img') ? a : a.find('img')), a.length > 0 && (a.hasClass(this.options.imageIncludeClassName) || !a[0].complete)))
          return !1;
        return !0;
      },
    });
  })(d, WebPro, window, document);
  (function (b, c, a, d, j) {
    c.Widget.ContentSlideShow.fadingTransitionPlugin = {
      defaultOptions: { transitionDuration: 500 },
      initialize: function (a, c) {
        var d = this;
        b.extend(c, b.extend({}, d.defaultOptions, c));
        a.bind('attach-behavior', function () {
          d.attachBehavior(a);
        });
      },
      attachBehavior: function (f) {
        var h = this,
          i = f.slides,
          l = i.$element,
          k = i.activeIndex,
          m = f._findWidgetElements('.' + f.options.viewClassName);
        0 == m.length && f._$sslbpOverlay && (m = b('.' + f.options.viewClassName, f._$sslbpOverlay));
        i.bind('wp-panel-show', function (a, c) {
          h._showElement(f, b(c.panel));
          f.options.contentLayout_runtime === 'stack' && h._showElement(f, f.$closeBtn);
        }).bind('wp-panel-hide', function (a, c) {
          h._hideElement(f, b(c.panel));
        });
        f.options.contentLayout_runtime === 'stack' &&
          f.bind('wp-slideshow-close', function () {
            h._hideElement(f, f.$closeBtn);
          });
        for (var n = 0; n < l.length; n++) if (n !== k) l[n].style.display = 'none';
        if (f.options.elastic === 'fullWidth') {
          var p = b(a),
            q = b(d.body),
            o = function (a) {
              a === j && (a = Math.max(p.width(), parseInt(q.css('min-width'))));
              f.options.contentLayout_runtime !== 'lightbox' && m.css('left', m.position().left - m.offset().left);
              m.width(a);
              h._showElement(f, b(i.activeElement));
            };
          o();
          for (n = 0; n < l.length; n++) {
            var r = b(l[n]);
            r.width('100%');
            r.addClass('borderbox');
          }
          if (f.options.contentLayout_runtime === 'lightbox') f._fstpPositionSlides = o;
          else
            p.on('orientationchange resize', function () {
              o();
            });
        }
        k === -1 && f.options.contentLayout_runtime === 'stack' && f.$closeBtn.hide();
        if (Muse.Browser.Features.Touch && f.options.enableSwipe === !0) {
          m.addClass('horizontalSlideShow');
          var t = f.options.transitionDuration;
          f._ftpSwipeNoInterrupt = !1;
          l.each(function () {
            var a = b(this);
            a.data('opacity', a.css('opacity'));
            var d = Muse.Utils.getCanvasDirection(a, 'horizontal'),
              g = d.dir === 'horizontal',
              k = d.reverse;
            if ((d = a.swipe.defaults.excludedElements)) {
              var d = d.split(/\s*,\s*/),
                i = d.indexOf('a');
              if (0 <= i) d.splice(i, 1), (a.swipe.defaults.excludedElements = d.join(', '));
            }
            a.swipe({
              triggerOnTouchEnd: !0,
              allowPageScroll: g ? 'vertical' : 'horizontal',
              threshold: 75,
              swipeStatus: function (b, d, i, j) {
                if (d == 'start') f.stop();
                else if (d == 'move' && ((g && (i == 'left' || i == 'right')) || (!g && (i == 'up' || i == 'down'))))
                  !c.hasPointerCapture() && Math.abs(j) > 1 && c.setPointerCapture(a[0], b),
                    h._scrollTo(f, -1, j * ((!k && (i == 'left' || i == 'up')) || (k && (i == 'right' || i == 'down')) ? 1 : -1), 0);
                else if (d == 'cancel') h._scrollTo(f, f.slides.activeIndex, 0, t), c.releasePointerCapture(a[0], b), f.trigger('wp-swiped');
                else if (d == 'end') {
                  d = f.slides.activeIndex;
                  j = -1;
                  if ((g && ((i == 'right' && !k) || (i == 'left' && k))) || (!g && ((i == 'down' && !k) || (i == 'up' && k)))) j = d - 1 < 0 ? l.length - 1 : d - 1;
                  else if ((g && ((i == 'left' && !k) || (i == 'right' && k))) || (!g && ((i == 'up' && !k) || (i == 'down' && k)))) j = d + 1 > l.length - 1 ? 0 : d + 1;
                  j != -1 && h._scrollTo(f, j, 0, t);
                  c.releasePointerCapture(a[0], b);
                  f.trigger('wp-swiped');
                }
              },
            });
          });
        }
      },
      _showElement: function (a, b) {
        var c = !1,
          d = function () {
            c || ((c = !0), b.show().css('opacity', ''));
          },
          g = setTimeout(d, a.options.transitionDuration + 10);
        b.stop(!1, !0).fadeIn(a.options.transitionDuration, function () {
          clearTimeout(g);
          d();
        });
      },
      _hideElement: function (a, b) {
        var c = !1,
          d = function () {
            c || ((c = !0), b.hide().css('opacity', ''));
          },
          g = setTimeout(d, a.options.transitionDuration + 10);
        b.stop(!1, !0).fadeOut(a.options.transitionDuration, function () {
          clearTimeout(g);
          d();
        });
      },
      _scrollTo: function (a, c, d, g) {
        if (!a._ftpSwipeNoInterrupt) {
          var k = a.slides.$element,
            j = a.slides.activeIndex,
            n = c == -1;
          c == -1 && (c = d < 0 ? (j - 1 < 0 ? k.length - 1 : j - 1) : j + 1 > k.length - 1 ? 0 : j + 1);
          var p = b(k[j]),
            q = b(k[c]);
          if ((!n && d == 0) || j == c) {
            a._ftpSwipeNoInterrupt = !0;
            var o = 0,
              r = !1,
              t = function () {
                if (!r && ((r = !0), q.show().css('opacity', ''), c != j && a.slides.showPanel(c), ++o == k.length)) a._ftpSwipeNoInterrupt = !1;
              };
            if (q.css('opacity') != q.data('opacity')) {
              var v = setTimeout(t, g + 10);
              q.stop(!1, !0).animate({ opacity: q.data('opacity') }, g, function () {
                clearTimeout(v);
                t();
              });
            } else t();
            k.each(function (d) {
              var i = b(this),
                j = !1,
                n = function () {
                  if (!j && ((j = !0), i.hide().css('opacity', ''), ++o == k.length)) a._ftpSwipeNoInterrupt = !1;
                },
                m;
              d != c &&
                (i.css('display') != 'none' && i.css('opacity') != 0
                  ? ((m = setTimeout(n, g + 10)),
                    i.stop(!1, !0).animate({ opacity: 0 }, g, function () {
                      clearTimeout(m);
                      n();
                    }))
                  : n());
            });
          } else
            (d = Math.abs(d)),
              (n = p.width()),
              d > n && (d = n),
              (d = q.data('opacity') * (d / n)),
              (n = p.data('opacity') * (1 - d)),
              p.stop(!1, !0).animate({ opacity: n }, g),
              q.stop(!1, !0).show().animate({ opacity: d }, g);
        }
      },
    };
    c.Widget.ContentSlideShow.filmstripTransitionPlugin = {
      defaultOptions: { transitionDuration: 500, transitionStyle: 'horizontal' },
      initialize: function (a, c) {
        var d = this;
        b.extend(c, b.extend({}, d.defaultOptions, c));
        a.bind('attach-behavior', function () {
          d.attachBehavior(a);
        })
          .bind('bp_activate', function () {
            d.bpActivate(a);
          })
          .bind('bp-deactivate', function () {
            d.bpDeactivate(a);
          });
      },
      bpActivate: function (a) {
        plugin._goToSlide(a, a.slides.activeElement, a.options.transitionDuration);
      },
      bpDeactivate: function (a) {
        a.slides.unbind('wp-panel-show').unbind('wp-panel-hide');
        a.unbind('wp-slideshow-before-previous').unbind('wp-slideshow-before-next').unbind('wp-slideshow-previous').unbind('wp-slideshow-next');
      },
      attachBehavior: function (f) {
        var h = this,
          i = b(a),
          l = b(d.body),
          k = f.options,
          m = function () {
            return k.elastic === 'fullWidth' ? Math.max(i.width(), parseInt(l.css('min-width'))) : o.width();
          },
          n = k.transitionStyle === 'horizontal',
          p = f.slides,
          q = p.$element,
          o = f.$clip ? f.$clip : f._findWidgetElements('.' + k.clipClassName),
          r = f.$view ? f.$view : f._findWidgetElements('.' + k.viewClassName),
          t = m(),
          v = o.height(),
          x = { left: 1, right: 1 },
          s = { up: 1, down: 1 },
          w = { top: '0', left: '0' };
        f.$clip = o;
        f.$view = r;
        var y = o.css('position');
        y !== 'absolute' && y !== 'fixed' && k.elastic !== 'fullScreen' && o.css('position', 'relative');
        r.css('position') !== 'absolute' && (w.position = 'relative');
        f._fstpOffsetSize = n ? m() : o.height();
        f._fstp$Clip = o;
        f._fstp$View = r;
        f._fstpStyleProp = n ? 'left' : 'top';
        f._fstpStylePropZero = n ? 'top' : 'left';
        p.bind('wp-panel-show', function (a, b) {
          h._goToSlide(f, b.panel, k.transitionDuration);
          f.options.contentLayout_runtime === 'stack' && f.$closeBtn.stop(!0).fadeIn(k.transitionDuration);
        });
        f.options.contentLayout_runtime === 'stack' &&
          f.bind('wp-slideshow-close', function () {
            o.css({ opacity: 0.99 })
              .stop(!0)
              .animate(
                { opacity: 0 },
                {
                  queue: !1,
                  duration: k.transitionDuration,
                  complete: function () {
                    w[f._fstpStyleProp] = (n ? o.width() : o.height()) + 'px';
                    w[f._fstpStylePropZero] = '0';
                    r.css(w);
                    o.css({ opacity: '' });
                  },
                },
              );
            f.$closeBtn.stop(!0).fadeOut(k.transitionDuration);
          });
        f._fstpRequestType = null;
        f.bind('wp-slideshow-before-previous wp-slideshow-before-next', function (a) {
          f._fstpRequestType = a.type.replace(/.*-/, '');
          f._fstpOldActiveIndex = f.slides.activeIndex;
        }).bind('wp-slideshow-previous wp-slideshow-next', function () {
          f._fstpRequestType = null;
          f._fstpOldActiveIndex = -1;
        });
        var z = function (a, b) {
          if (a === j || b === j) (a = m()), (b = o.height());
          k.elastic === 'fullWidth' && ((b = o.height()), o.width(a), k.contentLayout_runtime !== 'lightbox' && o.css('left', o.position().left - o.offset().left), r.width(a));
          for (var c = 0, d = n ? a : b, g = f._fstpStyleProp, i = f._fstpStylePropZero, l = 0; l < q.length; l++) {
            var s = q[l].style;
            s[i] = '0';
            s[g] = c + 'px';
            s.margin = '0';
            s.position = 'absolute';
            c += d;
          }
          h._goToSlide(f, p.activeElement, 0);
          k.elastic === 'off' && ((w[n ? 'width' : 'height'] = n && k.isResponsive ? '100%' : c + 'px'), (w[n ? 'height' : 'width'] = n ? v + 'px' : k.isResponsive ? '100%' : t + 'px'));
          return c;
        };
        z();
        if (k.elastic === 'fullWidth')
          for (y = 0; y < q.length; y++) {
            var u = b(q[y]);
            u.width('100%');
            u.addClass('borderbox');
          }
        y = k.isResponsive;
        if (k.elastic !== 'off') k.contentLayout_runtime === 'lightbox' ? (f._fstpPositionSlides = z) : (y = !0);
        if (y)
          i.on('orientationchange resize', function () {
            z();
          });
        p.activeElement || ((w[f._fstpStyleProp] = (n ? t : v) + 'px'), (w[f._fstpStylePropZero] = '0'), f.options.contentLayout_runtime === 'stack' && f.$closeBtn.hide());
        w.overflow = 'visible';
        r.css(w);
        h._goToSlide(f, p.activeElement, k.transitionDuration);
        Muse.Browser.Features.Touch &&
          f.options.enableSwipe === !0 &&
          (b(this),
          n ? r.addClass('horizontalSlideShow') : r.addClass('verticalSlideShow'),
          r.swipe({
            triggerOnTouchEnd: !0,
            allowPageScroll: n ? 'vertical' : 'horizontal',
            threshold: 75,
            swipeStatus: function (a, b, d, g) {
              var i = Muse.Utils.getCanvasDirection(r, k.transitionStyle).reverse,
                i = (!i && (d == 'left' || d == 'up')) || (i && (d == 'right' || d == 'down')) ? 1 : -1;
              switch (b) {
                case 'start':
                  f.stop();
                  break;
                case 'move':
                  if ((n && d in x) || (!n && d in s)) !c.hasPointerCapture() && Math.abs(g) > 1 && c.setPointerCapture(r[0], a), h._scrollBy(f, g * i);
                  break;
                case 'cancel':
                  h._goToSlide(f, p.activeElement, 0);
                  c.releasePointerCapture(r[0], a);
                  f.trigger('wp-swiped');
                  break;
                case 'end':
                  h._finalizeSwipe(f, f._fstpOffsetSize * f.slides.activeIndex + g * i, i, d), c.releasePointerCapture(r[0], a);
              }
            },
          }));
      },
      _scrollBy: function (a, b) {
        var c = a._fstp$View,
          d = a.slides.activeIndex * -a._fstpOffsetSize,
          g = a._fstpStyleProp,
          j = {};
        c.stop(!1, !0);
        j[g] = d - b + 'px';
        c.css(j);
      },
      _finalizeSwipe: function (a, b, c) {
        var d = a.slides,
          g = a._fstp$View,
          j = b / a._fstpOffsetSize,
          b = a._fstpStyleProp,
          n = {},
          j = c === 1 ? Math.ceil(j) : Math.floor(j),
          j = Math.max(0, Math.min(j, d.$element.length - 1));
        n[b] = -(j * a._fstpOffsetSize) + 'px';
        g.animate(n, a.options.transitionDuration, function () {
          d.showPanel(j);
          a.trigger('wp-swiped');
        });
      },
      _goToSlide: function (a, c, d) {
        if (a) {
          var g = b(c),
            k = a._fstp$View,
            j = a._fstpStyleProp,
            n = j === 'left' ? 'offsetLeft' : 'offsetTop',
            p = j === 'left' ? 'offsetWidth' : 'offsetHeight',
            q = c ? -c[n] : a._fstp$Clip[0][p],
            o = {};
          o[j] = q + 'px';
          var r = a._fstpRequestType,
            t = a._fstpOldActiveIndex;
          if (r && t !== -1) {
            var v = a.slides.activeIndex,
              x = a.slides.$element.length - 1;
            if (v !== t) {
              var s = 0;
              r === 'previous' && t === 0 && v === x ? (s = -c[p]) : r === 'next' && t === x && v === 0 && ((a = a.slides.$element[t]), (s = a[n] + a[p]));
              s && ((o[j] = -s + 'px'), g.css(j, s + 'px'));
            }
          }
          k.stop(!1, !0).animate(o, d, function () {
            s && (g.css(j, -q + 'px'), k.css(j, q + 'px'));
          });
        }
      },
    };
    c.Widget.ContentSlideShow.alignPartsToPagePlugin = {
      defaultOptions: { alignPartToPageClassName: 'wp-slideshow-align-part-to-page' },
      initialize: function (a, c) {
        var d = this;
        b.extend(c, b.extend({}, d.defaultOptions, c));
        a.bind('attach-behavior', function () {
          d.attachBehavior(a);
        });
      },
      attachBehavior: function (c) {
        if (!('fullWidth' !== c.options.elastic || !c.$element.hasClass('align_parts_to_page') || 'fixed' !== c.$element.css('position') || c.options.contentLayout_runtime === 'lightbox')) {
          var d = b(a),
            g = b('#page'),
            j = c.options,
            k = function () {
              var a = g.offset().left + 'px';
              b('.' + j.alignPartToPageClassName, c.$element).each(function () {
                b(this).css('margin-left', a);
              });
            };
          c.$element.children().each(function () {
            var a = b(this);
            0 < b('.' + j.viewClassName, a).length || a.addClass(j.alignPartToPageClassName);
          });
          k();
          d.on('orientationchange resize', function () {
            k();
          });
        }
      },
    };
    c.Widget.ContentSlideShow.slideImageIncludePlugin = {
      defaultOptions: { imageIncludeClassName: 'wp-slideshow-slide-image-include', slideLoadingClassName: 'wp-slideshow-slide-loading' },
      initialize: function (a, d) {
        var g = this;
        b.extend(d, b.extend({}, g.defaultOptions, d));
        a._cssilLoader = new c.ImageLoader();
        a.bind('attach-behavior', function () {
          g._attachBehavior(a);
        });
      },
      _attachBehavior: function (a) {
        for (
          var b = this,
            c = a._cssilLoader,
            d = a._findWidgetElements('.' + a.options.slideClassName),
            g = d.length,
            j = '.' + a.options.imageIncludeClassName,
            n = a.options.slideLoadingClassName,
            p = function (c, d, g, k) {
              b._handleImageLoad(a, c, d, g, k);
            },
            q = 0;
          q < g;
          q++
        ) {
          var o = d.eq(a._shuffleArray ? a._shuffleArray[q] : q),
            r = o.is('img') ? o : o.find(j),
            t = r[0];
          if (t) {
            var v = a._getAjaxSrcForImage(r) || t.href;
            if (v) (r = { width: r.data('width'), height: r.data('height'), $ele: r, $slide: o }), (t.style.visibility = 'hidden'), c.add(v, { callback: p, data: r }), o.addClass(n);
          }
        }
        a._cssilLoader.start();
      },
      _handleImageLoad: function (a, b, c, d, g) {
        var j = g.$ele,
          n = j[0];
        n.src = b;
        a.options.elastic !== 'off'
          ? (j.data('imageWidth', c), j.data('imageHeight', d), a._csspPositionImage(n, a.options.heroFitting, a.options.elastic, c, d))
          : ((n.width = g.width || c), (n.height = g.height || d));
        n.style.visibility = '';
        j.removeClass(a.options.imageIncludeClassName);
        g.$slide.removeClass(a.options.slideLoadingClassName);
        a.isPlaying() && a.slides.$element[a.slides.activeIndex] == g.$slide[0] && a._startTimer(!1);
      },
    };
    c.Widget.ContentSlideShow.shufflePlayPlugin = {
      defaultOptions: { randomDefaultIndex: !0 },
      initialize: function (a, c) {
        var d = this;
        b.extend(c, b.extend({}, d.defaultOptions, c));
        a._shuffleArray = [];
        a._shuffleNextDict = {};
        a._realNext = a._next;
        a._next = function () {
          d._handleNext(a);
        };
        a._shufflePlayCount = 1;
        a.bind('before-attach-behavior', function () {
          d._reshuffle(a);
          if (c.randomDefaultIndex && typeof c.defaultIndex === 'undefined') a.options.defaultIndex = a._shuffleArray[0];
        });
      },
      _fisherYatesArrayShuffle: function (a) {
        if (a && a.length)
          for (var b = a.length; --b; ) {
            var c = Math.floor(Math.random() * (b + 1)),
              d = a[c];
            a[c] = a[b];
            a[b] = d;
          }
      },
      _reshuffle: function (a) {
        var b = a._shuffleArray,
          c = {},
          d = a.slides ? a.slides.$element.length : a._findWidgetElements('.' + a.options.slideClassName).length;
        if (b.length !== d) for (var g = (b.length = 0); g < d; g++) b[g] = g;
        this._fisherYatesArrayShuffle(b);
        for (g = 0; g < d; g++) c[b[g]] = b[(g + 1) % d];
        a._shuffleNextDict = c;
        a._shufflePlayCount = 1;
      },
      _handleNext: function (a) {
        if (a.isPlaying()) {
          var b = a.slides.activeIndex,
            c = a._shuffleNextDict[b] || 0;
          a._isLoaded(b) && a._isLoaded(c) && (a._goTo(c), ++a._shufflePlayCount >= a.slides.$element.length && (this._reshuffle(a), (!a.options.loop || a.options.playOnce) && a.stop()));
        } else a._realNext();
      },
    };
  })(d, WebPro, window, document);
  (function (b, c, a) {
    c.widget('Widget.Form', c.Widget, {
      _widgetName: 'form',
      defaultOptions: {
        validationEvent: 'blur',
        errorStateSensitivity: 'low',
        ajaxSubmit: !0,
        fieldWrapperClass: 'field',
        formErrorClass: 'form-error',
        formSubmittedClass: 'form-submitted',
        formDeliveredClass: 'form-delivered',
        focusClass: 'focus',
        notEmptyClass: 'not-empty',
        emptyClass: 'empty',
        validClass: 'valid',
        invalidClass: 'invalid',
        requiredClass: 'required',
      },
      validationTypes: {
        'always-valid': /.*/,
        email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        alpha: /^[A-z\s]+$/,
        numeric: /^[0-9]+$/,
        phone: /^([0-9])?(\s)?(\([0-9]{3}\)|[0-9]{3}(\-)?)(\s)?[0-9]{3}(\s|\-)?[0-9]{4}(\s|\sext|\sx)?(\s)?[0-9]*$/,
        captcha: function (a) {
          return a.data('captchaValid');
        },
        recaptcha: function () {
          if ('undefined' == typeof Recaptcha) return !1;
          var a = Recaptcha.get_response();
          return a && 0 < a.length;
        },
        recaptcha2: function (a) {
          if ('undefined' != typeof reCaptchaV2Manager) {
            a = b('input[type=hidden]', a);
            if (1 != a.length) return !1;
            a = a.attr('data-recaptcha-id');
            return reCaptchaV2Manager.isInstanceVerified(a);
          } else if ('undefined' != typeof grecaptcha && 'undefined' != typeof muReCAPTCHA2Instances) return (a = muReCAPTCHA2Instances[a.attr('id')]), (a = grecaptcha.getResponse(a)) && 0 < a.length;
          return !1;
        },
        checkbox: function () {
          return !0;
        },
        checkboxgroup: function () {
          return !0;
        },
        radio: function () {
          return !0;
        },
        radiogroup: function () {
          return !0;
        },
        time: function (a) {
          var a = a.find('input, textarea'),
            b = a.val().replace(/[^0-9:APM]/g, '');
          if (b.indexOf(':') != -1 && b.match(/:/).length == 1) {
            var c = b.split(':'),
              d = parseInt(c[0]),
              c = parseInt(c[1]);
            if (d < 0 || d > 24) return !0;
            if (c < 0 || c > 59) return !0;
          } else return !1;
          a.val(b);
          return !0;
        },
      },
      _transformMarkup: function () {
        var a = this;
        a.hasCAPTCHA = !1;
        a.hasReCAPTCHA = !1;
        a.hasReCAPTCHA2 = !1;
        this.$element.find('.' + this.options.fieldWrapperClass).each(function () {
          var c = b(this);
          switch (c.attr('data-type')) {
            case 'captcha':
              a.hasCAPTCHA = !0;
              c.find('input[name="CaptchaV2"]').remove();
              c.find('input[name="muse_CaptchaV2"]').attr('name', 'CaptchaV2');
              break;
            case 'recaptcha':
              a.hasReCAPTCHA = !0;
              break;
            case 'recaptcha2':
              a.hasReCAPTCHA2 = !0;
          }
        });
      },
      _extractData: function () {
        this.event = this.options.validationEvent;
        this.errorSensitivity = this.options.errorStateSensitivity;
        this.classNames = { focus: this.options.focusClass, blur: this.options.emptyClass, keydown: this.options.notEmptyClass };
      },
      _isEmpty: function (a) {
        var c = a.find('input[type!="hidden"], textarea');
        switch (a.data('type')) {
          case 'checkboxgroup':
          case 'radiogroup':
            return (a = c.attr('name')), b('input[name="' + a + '"]:checked').length == 0;
          case 'checkbox':
          case 'radio':
            return typeof c.attr('checked') === 'undefined';
          default:
            return c.val() == '';
        }
      },
      _getGroupField: function (a) {
        switch (a.data('type')) {
          case 'radio':
            return a
              .parent()
              .closest('.' + this.options.fieldWrapperClass)
              .filter(function () {
                return 'radiogroup' == b(this).data('type');
              });
          case 'checkbox':
            return a
              .parent()
              .closest('.' + this.options.fieldWrapperClass)
              .filter(function () {
                return 'checkboxgroup' == b(this).data('type');
              });
        }
        return null;
      },
      _updateReCaptchaChallenge: function () {
        var a = b('#recaptcha_response_field', this.$element);
        if (0 != a.length) {
          if (0 == b('#recaptcha_challenge_field_holder', a.parent()).length) {
            var c = b('#recaptcha_challenge_field_holder');
            a.before(c);
          }
          for (var a = b('#recaptcha_image', this.$element), c = ['#ReCaptchaV2', '#ReCaptchaAnswer', '#ReCaptchaChallenge'], d = 0; d < c.length; d++)
            if (0 == b(c[d], a).length) {
              var h = b(c[d]);
              a.after(h);
            }
        }
      },
      _attachBehavior: function () {
        var a = this;
        if ((this._bpID = this.$element.closest('.breakpoint').attr('id')))
          b('body').on('muse_bp_activate', function (b, c, d) {
            a._bpID == d.attr('id') && a._updateReCaptchaChallenge();
          }),
            this._updateReCaptchaChallenge();
        this.$element.find('.' + this.options.fieldWrapperClass).each(function () {
          var c = b(this);
          a._isEmpty(c) ||
            c.find('input, textarea').each(function () {
              b(this).removeClass(a.options.emptyClass);
            });
          c.attr('data-type') == 'captcha' &&
            (c.data('captchaValid', !1),
            c.find('input[name="CaptchaV2"]').keyup(function () {
              var d = b(this).val(),
                h = c.find('input[name="CaptchaHV2"]').val();
              a._validateCaptcha(h, d, function (b) {
                c.data('captchaValid', b);
                c.data('error-state') && a.errorSensitivity == 'high' && a._validate(c);
              });
            }));
          a._isEmpty(c) || c.addClass(a.classNames.keydown);
        });
        this.$element.find('input, textarea').bind('focus blur keydown change propertychange', function (c) {
          var d = a.classNames[c.type],
            h = a.classNames.focus,
            i = a.classNames.keydown,
            l = a.classNames.blur,
            k = b(this).closest('.' + a.options.fieldWrapperClass),
            m = a._getGroupField(k);
          switch (c.type) {
            case 'focus':
              k.addClass(d).removeClass(l);
              break;
            case 'keydown':
              'checkbox' != k.data('type') && 'radio' != k.data('type') && k.addClass(d).removeClass(l);
              break;
            case 'blur':
              k.removeClass(h);
              a._isEmpty(k) && k.addClass(d).removeClass(i);
              m && a._isEmpty(m) && m.addClass(d).removeClass(i);
              break;
            case 'change':
            case 'propertychange':
              'radio' == k.data('type') && m.find('.' + a.options.fieldWrapperClass).removeClass(i),
                a._isEmpty(k) ? k.addClass(l).removeClass(i) : k.addClass(i).removeClass(l),
                m && (a._isEmpty(m) ? m.addClass(l).removeClass(i) : m.addClass(i).removeClass(l));
          }
        });
        switch (this.event) {
          case 'blur':
          case 'keyup':
            this.$element.find('.' + this.options.fieldWrapperClass + ' input, .' + this.options.fieldWrapperClass + ' textarea').bind(this.event, function () {
              a._validate(b(this).closest('.' + a.options.fieldWrapperClass));
            });
          case 'submit':
            this.$element.submit(function (c) {
              var d = !0,
                h = a.$element.find('.' + a.options.fieldWrapperClass).length - 1;
              a.$element.find('.' + a.options.fieldWrapperClass).each(function (i) {
                if ((d = a._validate(b(this)) ? d : !1) && i == h)
                  if (a.options.ajaxSubmit) c.preventDefault(), a._submitForm();
                  else {
                    var i = b('#ReCaptchaAnswer', a.$element),
                      l = b('#ReCaptchaChallenge', a.$element);
                    a.hasReCAPTCHA && 1 == i.length && 1 == l.length && (i.val(Recaptcha.get_response()), l.val(Recaptcha.get_challenge()));
                  }
                d || c.preventDefault();
              });
              b('.' + a.options.fieldWrapperClass, a.$element).each(function () {
                var a = b(this);
                a.attr('data-type') == 'email' && ((a = a.find('input, textarea')), a.val() == 'no.reply@example.com' && a.val(''));
              });
            });
        }
      },
      _validateCaptcha: function (a, c, d) {
        c.length != 6
          ? d(!1)
          : b.get('/ValidateCaptcha.ashx', { key: a, answer: c }, function (a) {
              d(a == 'true');
            });
      },
      _validateReCaptcha: function (a, c) {
        b.get('/ValidateCaptcha.ashx', { key: Recaptcha.get_challenge(), answer: Recaptcha.get_response(), imageVerificationType: 'recaptcha' }, function (b) {
          b == 'true' ? a() : c();
        });
      },
      _submitForm: function () {
        var a = this,
          c = b('#ReCaptchaAnswer', a.$element),
          d = b('#ReCaptchaChallenge', a.$element);
        a.hasReCAPTCHA && 1 == c.length && 1 == d.length
          ? (c.val(Recaptcha.get_response()),
            d.val(Recaptcha.get_challenge()),
            a._validateReCaptcha(
              function () {
                a._submitFormInternal();
              },
              function () {
                b('.' + a.options.fieldWrapperClass, a.$element).each(function () {
                  var c = b(this);
                  c.attr('data-type') == 'recaptcha' && a._switchState('invalid', c);
                });
                Recaptcha.reload();
              },
            ))
          : a._submitFormInternal();
      },
      _submitFormInternal: function () {
        var c = this,
          j = this.options.formSubmittedClass,
          f = this.options.formDeliveredClass,
          h = this.options.formErrorClass,
          i = j + ' ' + f + ' ' + h,
          l = this.$element.find('input[type=submit], button');
        b.ajax({
          url: this.$element.attr('action'),
          type: 'post',
          data: this.$element.serialize(),
          beforeSend: function () {
            c.$element.removeClass(i);
            c.$element.addClass(j);
            c.$element.find('.' + c.options.fieldWrapperClass).removeClass(c.options.focusClass);
            l.attr('disabled', 'disabled');
          },
          complete: function (k) {
            k &&
              (k.status >= 400 || (k.responseText && k.responseText.indexOf('<?php') >= 0)) &&
              alert(
                'Form PHP script is missing from web server, or PHP is not configured correctly on your web hosting provider. Check if the form PHP script has been uploaded correctly, then contact your hosting provider about PHP configuration.',
              );
            c.$element.removeClass(j);
            var i = null;
            if (k && k.responseText)
              try {
                (i = d.parseJSON(k.responseText)), (i = i.FormProcessV2Response || i.FormResponse || i.MusePHPFormResponse || i);
              } catch (n) {}
            if (i && i.success) {
              c.$element.addClass(f);
              if (i.redirect) {
                a.location.href = i.redirect;
                return;
              }
              c.$element[0].reset();
              c.hasCAPTCHA &&
                c.$element.find('input:not([type=submit]), textarea').each(function () {
                  b(this).attr('disabled', 'disabled');
                });
              c.$element.find('.' + c.options.notEmptyClass).each(function () {
                b(this).removeClass(c.options.notEmptyClass);
              });
            } else if ((k = c._getFieldsWithError(i))) for (i = 0; i < k.length; i++) c._switchState('invalid', k[i]);
            else c.$element.addClass(h);
            c.hasCAPTCHA || l.removeAttr('disabled');
            c.hasReCAPTCHA && Recaptcha.reload();
            c.hasReCAPTCHA2 &&
              ('undefined' != typeof reCaptchaV2Manager
                ? reCaptchaV2Manager.reloadControls()
                : 'undefined' != typeof grecaptcha &&
                  'undefined' != typeof muReCAPTCHA2Instances &&
                  b('[data-type=recaptcha2]', c.$element).each(function () {
                    var a = muReCAPTCHA2Instances[b(this).attr('id')];
                    grecaptcha.reset(a);
                  }));
          },
        });
      },
      _getFieldsWithError: function (a) {
        if (!a || !a.error || !a.error.fields || !a.error.fields.length) return null;
        for (var c = [], d = 0; d < a.error.fields.length; d++) {
          var h = b('[name="' + a.error.fields[d].field + '"]', this.$element).parents('.' + this.options.fieldWrapperClass);
          1 == h.length && c.push(h);
        }
        return c;
      },
      _validate: function (a) {
        var c = a.attr('data-type') || 'always-valid',
          b = a.find('input, textarea'),
          d = this.validationTypes[c],
          i = a.attr('data-required') === 'true',
          l = this._isEmpty(a),
          d = d instanceof RegExp ? Boolean(b.val().match(d)) : d(a);
        if (i && l) return this._switchState('required', a);
        c == 'email' && l && b.val('no.reply@example.com');
        if (!d && (i || !l)) return this._switchState('invalid', a);
        return this._switchState('valid', a);
      },
      _switchState: function (a, c) {
        var b = c.attr('data-type'),
          d = this.options.validClass,
          i = this.options.invalidClass,
          l = this.options.requiredClass,
          k = this,
          m = function () {
            k._validate(c);
          };
        c.removeClass(d + ' ' + i + ' ' + l);
        if (a == 'required' || a == 'invalid')
          return (
            a == 'invalid' ? c.addClass(i) : c.addClass(l),
            'recaptcha' != b &&
              this.errorSensitivity != 'low' &&
              ((d = this.errorSensitivity == 'high' ? 'keyup' : 'blur'), c.data('error-state') || (c.data('error-state', !0), c.find('input, textarea').bind(d, m))),
            !1
          );
        c.data('error-state') &&
          (this.errorSensitivity == 'high'
            ? this.event != 'keyup' && c.data('error-state', !1).find('input, textarea').unbind('keyup', m)
            : this.errorSensitivity == 'medium' && this.event != 'blur' && c.data('error-state', !1).find('input, textarea').unbind('blur', m));
        if ('checkbox' == b || 'radio' == b)
          if ((m = this._getGroupField(c)) && m.hasClass(l)) {
            c.addClass(l);
            return;
          }
        c.addClass(d);
        return !0;
      },
    });
    b.fn.wpForm = function (a) {
      new c.Widget.Form(this, a);
      return this;
    };
  })(d, WebPro, window, document);
});
(function () {
  if (!('undefined' == typeof Muse || 'undefined' == typeof Muse.assets)) {
    var a = (function (a, b) {
      for (var c = 0, d = a.length; c < d; c++) if (a[c] == b) return c;
      return -1;
    })(Muse.assets.required, 'webpro.js');
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName('meta'), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ('generator' == d.getAttribute('name')) {
          '2017.0.1.363' != d.getAttribute('content') && Muse.assets.outOfDate.push('webpro.js');
          break;
        }
      }
    }
  }
})();
