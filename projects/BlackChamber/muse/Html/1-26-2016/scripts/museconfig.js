/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function () {
  if (!window.museConfigLoadedAndExecuted) {
    window.museConfigLoadedAndExecuted = !0;
    var d = {
      waitSeconds: 0,
      paths: {
        html5shiv: 'scripts/html5shiv.js?crc=4241844378',
        jquery: 'scripts/jquery-1.8.3.min.js?crc=209076791',
        'jquery.musemenu': 'scripts/jquery.musemenu.js?crc=3988640741',
        'jquery.museoverlay': 'scripts/jquery.museoverlay.js?crc=4067622596',
        'jquery.musepolyfill.bgsize': 'scripts/jquery.musepolyfill.bgsize.js?crc=4045269973',
        'jquery.museresponsive': 'scripts/jquery.museresponsive.js?crc=501053771',
        'jquery.scrolleffects': 'scripts/jquery.scrolleffects.js?crc=3926425104',
        'jquery.watch': 'scripts/jquery.watch.js?crc=399457859',
        musedisclosure: 'scripts/musedisclosure.js?crc=472981680',
        museutils: 'scripts/museutils.js?crc=351331393',
        musewpdisclosure: 'scripts/musewpdisclosure.js?crc=504240800',
        musewpslideshow: 'scripts/musewpslideshow.js?crc=4158040266',
        pie: 'scripts/pie.js?crc=3831537696',
        taketori: 'scripts/taketori.js?crc=214255737',
        touchswipe: 'scripts/touchswipe.js?crc=4065839998',
        webpro: 'scripts/webpro.js?crc=3787685964',
        whatinput: 'scripts/whatinput.js?crc=86476730',
      },
      map: { '*': { jquery: 'jquery-private' }, 'jquery-private': { jquery: 'jquery' } },
    };
    require.undef('jquery');
    define('jquery-private', ['jquery'], function (b) {
      b = b.noConflict(!0);
      if ('undefined' === typeof $) window.$ = window.jQuery = b;
      return b;
    });
    if (true && document.location.protocol != 'https:') d.paths.jquery = ['http://musecdn.businesscatalyst.com/scripts/4.0/jquery-1.8.3.min', d.paths.jquery];
    requirejs.config(d);
    muse_init();
  }
})();
(function () {
  if (!('undefined' == typeof Muse || 'undefined' == typeof Muse.assets)) {
    var a = (function (a, b) {
      for (var c = 0, d = a.length; c < d; c++) if (a[c] == b) return c;
      return -1;
    })(Muse.assets.required, 'museconfig.js');
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName('meta'), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ('generator' == d.getAttribute('name')) {
          '2017.0.1.363' != d.getAttribute('content') && Muse.assets.outOfDate.push('museconfig.js');
          break;
        }
      }
    }
  }
})();
