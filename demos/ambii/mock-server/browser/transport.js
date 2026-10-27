// Replaces window.XMLHttpRequest and window.fetch. Requests under API_BASE are answered by the in-browser
// server; every other request goes to the real XMLHttpRequest / fetch untouched (track audio, cover
// art, the apps' own files). Written as a plain constructor (no `class extends`) so it survives being
// transpiled to ES5 by the apps' build tools.
import { API_BASE } from '../config.js';

var EVENTS = ['readystatechange', 'loadstart', 'progress', 'abort', 'error', 'load', 'timeout', 'loadend'];
var UPLOAD_EVENTS = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout', 'loadend'];
var STATUS_TEXT = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 409: 'Conflict', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error' };

export function isMockUrl(url) {
  try {
    var u = new URL(String(url), location.href);
    return u.origin === location.origin && u.pathname.indexOf(API_BASE) === 0;
  } catch (e) {
    return false;
  }
}

function absolute(url) {
  return new URL(String(url), location.href).href;
}

function makeEvent(type, target, src) {
  return {
    type: type, target: target, currentTarget: target, srcElement: target, bubbles: false, cancelable: false, defaultPrevented: false,
    lengthComputable: src ? !!src.lengthComputable : false, loaded: src && src.loaded ? src.loaded : 0, total: src && src.total ? src.total : 0,
    timeStamp: Date.now(), preventDefault: function () {}, stopPropagation: function () {}, stopImmediatePropagation: function () {},
  };
}

// Minimal EventTarget with on<type> properties (used for the request and for its .upload).
function Emitter() {
  this._listeners = {};
}
Emitter.prototype.addEventListener = function (type, fn) {
  if (typeof fn !== 'function' && !(fn && typeof fn.handleEvent === 'function')) return;
  var list = this._listeners[type] || (this._listeners[type] = []);
  if (list.indexOf(fn) < 0) list.push(fn);
};
Emitter.prototype.removeEventListener = function (type, fn) {
  var list = this._listeners[type];
  if (list) this._listeners[type] = list.filter(function (f) { return f !== fn; });
};
Emitter.prototype.dispatchEvent = function (event) {
  this._emit(event.type, event);
  return true;
};
Emitter.prototype._hasListeners = function (types) {
  var self = this;
  return types.some(function (t) { return typeof self['on' + t] === 'function' || (self._listeners[t] && self._listeners[t].length); });
};
Emitter.prototype._emit = function (type, src) {
  var ev = src && src.__ambii ? src : makeEvent(type, this, src);
  ev.__ambii = true;
  var handler = this['on' + type];
  if (typeof handler === 'function') {
    try { handler.call(this, ev); } catch (e) { setTimeout(function () { throw e; }); }
  }
  (this._listeners[type] || []).slice().forEach(function (fn) {
    try {
      if (typeof fn === 'function') fn.call(this, ev);
      else fn.handleEvent(ev);
    } catch (e) { setTimeout(function () { throw e; }); }
  }, this);
};

function headerString(res) {
  return 'content-type: ' + res.contentType + '\r\n' + (res.length !== undefined ? 'content-length: ' + res.length + '\r\n' : '');
}

function bytesOf(body) {
  if (body instanceof Uint8Array) return body;
  if (body instanceof ArrayBuffer) return new Uint8Array(body);
  return null;
}

// Turns the server's answer into what the requested responseType expects.
function shape(res, responseType) {
  var out = { status: res.status, statusText: STATUS_TEXT[res.status] || '', contentType: res.contentType, text: '', response: null };
  var body = res.body;
  var isBlob = typeof Blob !== 'undefined' && body instanceof Blob;
  var bytes = bytesOf(body);
  if (!isBlob && !bytes) {
    var text = typeof body === 'string' ? body : JSON.stringify(body);
    var encoded = new TextEncoder().encode(text);
    out.length = encoded.length;
    out.text = text;
    if (responseType === 'json') {
      try { out.response = JSON.parse(text); } catch (e) { out.response = null; }
    } else if (responseType === 'arraybuffer') out.response = encoded.buffer.slice(0);
    else if (responseType === 'blob') out.response = new Blob([encoded], { type: res.contentType });
    else if (responseType === 'document') out.response = null;
    else out.response = text;
    return Promise.resolve(out);
  }
  var blob = isBlob ? body : new Blob([bytes], { type: res.contentType });
  out.length = blob.size;
  if (responseType === 'blob') {
    out.response = blob.type ? blob : new Blob([blob], { type: res.contentType });
    return Promise.resolve(out);
  }
  return blob.arrayBuffer().then(function (buf) {
    if (responseType === 'arraybuffer') out.response = buf;
    else if (responseType === 'json') out.response = null;
    else {
      out.text = new TextDecoder('latin1').decode(buf);
      out.response = out.text;
    }
    return out;
  });
}

// Request body -> {body, files} for the server: JSON strings parsed, FormData split into fields and files.
function readBody(body, contentType) {
  if (body === undefined || body === null) return { body: null, files: {} };
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    var fields = {}, files = {};
    body.forEach(function (value, key) {
      if (typeof Blob !== 'undefined' && value instanceof Blob) files[key] = value;
      else fields[key] = value;
    });
    return { body: fields, files: files };
  }
  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
    var o = {};
    body.forEach(function (v, k) { o[k] = v; });
    return { body: o, files: {} };
  }
  if (typeof body === 'string') {
    var t = body.trim();
    if (/json/i.test(contentType || '') || t.charAt(0) === '{' || t.charAt(0) === '[') {
      try { return { body: JSON.parse(t), files: {} }; } catch (e) { /* not JSON */ }
    }
    return { body: body, files: {} };
  }
  return { body: body, files: {} };
}

function bodySize(body) {
  if (body === undefined || body === null) return 0;
  if (typeof body === 'string') return new TextEncoder().encode(body).length;
  if (typeof Blob !== 'undefined' && body instanceof Blob) return body.size;
  if (body.byteLength !== undefined) return body.byteLength;
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    var n = 0;
    body.forEach(function (v) { n += typeof v === 'string' ? v.length : v.size || 0; });
    return n;
  }
  return 0;
}

export function installXhr(server) {
  var Native = window.XMLHttpRequest;
  if (!Native || Native.__ambiiDemo) return;

  function DemoXHR() {
    Emitter.call(this);
    var self = this;
    this._native = null;
    this._mock = null;
    this._responseType = '';
    this._timeout = 0;
    this._withCredentials = false;
    EVENTS.forEach(function (t) { self['on' + t] = null; });
    this.upload = new Emitter();
    UPLOAD_EVENTS.forEach(function (t) { self.upload['on' + t] = null; });
  }
  DemoXHR.prototype = Object.create(Emitter.prototype);
  DemoXHR.prototype.constructor = DemoXHR;
  ['UNSENT', 'OPENED', 'HEADERS_RECEIVED', 'LOADING', 'DONE'].forEach(function (k, i) {
    DemoXHR[k] = i;
    DemoXHR.prototype[k] = i;
  });

  function nativeOr(name, mockValue) {
    return function () {
      if (this._native) return this._native[name];
      return mockValue.call(this);
    };
  }

  Object.defineProperties(DemoXHR.prototype, {
    readyState: { get: nativeOr('readyState', function () { return this._mock ? this._mock.readyState : 0; }) },
    status: { get: nativeOr('status', function () { return this._mock && this._mock.readyState >= 2 && this._mock.res ? this._mock.res.status : 0; }) },
    statusText: { get: nativeOr('statusText', function () { return this._mock && this._mock.readyState >= 2 && this._mock.res ? this._mock.res.statusText : ''; }) },
    responseURL: { get: nativeOr('responseURL', function () { return this._mock && this._mock.readyState >= 2 ? this._mock.url : ''; }) },
    responseXML: { get: nativeOr('responseXML', function () { return null; }) },
    response: {
      get: nativeOr('response', function () {
        var m = this._mock;
        if (!m || m.readyState !== 4 || !m.res) return this._responseType === '' || this._responseType === 'text' ? '' : null;
        return m.res.response;
      }),
    },
    responseText: {
      get: nativeOr('responseText', function () {
        if (this._responseType !== '' && this._responseType !== 'text') {
          throw new DOMException("The value is only accessible if the object's 'responseType' is '' or 'text' (was '" + this._responseType + "').", 'InvalidStateError');
        }
        var m = this._mock;
        return m && m.readyState >= 3 && m.res ? m.res.text : '';
      }),
    },
    responseType: {
      get: function () { return this._native ? this._native.responseType : this._responseType; },
      set: function (v) {
        this._responseType = String(v);
        if (this._native) this._native.responseType = v;
      },
    },
    timeout: {
      get: function () { return this._native ? this._native.timeout : this._timeout; },
      set: function (v) {
        this._timeout = Number(v) || 0;
        if (this._native) this._native.timeout = v;
      },
    },
    withCredentials: {
      get: function () { return this._native ? this._native.withCredentials : this._withCredentials; },
      set: function (v) {
        this._withCredentials = !!v;
        if (this._native) this._native.withCredentials = v;
      },
    },
  });

  DemoXHR.prototype.open = function (method, url) {
    var self = this;
    if (!isMockUrl(url)) {
      var n = new Native();
      this._native = n;
      this._mock = null;
      EVENTS.forEach(function (t) { n.addEventListener(t, function (e) { self._emit(t, e); }); });
      n.open.apply(n, arguments);
      if (this._responseType) n.responseType = this._responseType;
      if (this._timeout) n.timeout = this._timeout;
      if (this._withCredentials) n.withCredentials = true;
      return;
    }
    if (arguments.length > 2 && arguments[2] === false && typeof console !== 'undefined') console.warn('[ambii-demo] synchronous XHR to the mock API runs asynchronously');
    this._native = null;
    this._mock = { method: String(method || 'GET').toUpperCase(), url: absolute(url), headers: {}, readyState: 1, sent: false, done: false, res: null };
    this._emit('readystatechange');
  };

  DemoXHR.prototype.setRequestHeader = function (name, value) {
    if (this._native) return this._native.setRequestHeader(name, value);
    if (!this._mock || this._mock.readyState !== 1 || this._mock.sent) throw new DOMException('The object\'s state must be OPENED.', 'InvalidStateError');
    var key = String(name).toLowerCase();
    this._mock.headers[key] = this._mock.headers[key] !== undefined ? this._mock.headers[key] + ', ' + value : String(value);
  };

  DemoXHR.prototype.overrideMimeType = function (mime) {
    if (this._native) return this._native.overrideMimeType(mime);
  };

  DemoXHR.prototype.getAllResponseHeaders = function () {
    if (this._native) return this._native.getAllResponseHeaders();
    var m = this._mock;
    return m && m.readyState >= 2 && m.res ? headerString(m.res) : '';
  };

  DemoXHR.prototype.getResponseHeader = function (name) {
    if (this._native) return this._native.getResponseHeader(name);
    var m = this._mock;
    if (!m || m.readyState < 2 || !m.res) return null;
    var key = String(name).toLowerCase();
    if (key === 'content-type') return m.res.contentType;
    if (key === 'content-length' && m.res.length !== undefined) return String(m.res.length);
    return null;
  };

  DemoXHR.prototype.send = function (body) {
    var self = this;
    if (this._native) {
      var n = this._native;
      if (this.upload._hasListeners(UPLOAD_EVENTS) && n.upload) {
        UPLOAD_EVENTS.forEach(function (t) { n.upload.addEventListener(t, function (e) { self.upload._emit(t, e); }); });
      }
      return n.send(body === undefined ? null : body);
    }
    var m = this._mock;
    if (!m || m.readyState !== 1 || m.sent) throw new DOMException('The object\'s state must be OPENED.', 'InvalidStateError');
    m.sent = true;
    var hasBody = body !== undefined && body !== null && m.method !== 'GET' && m.method !== 'HEAD';
    var size = hasBody ? bodySize(body) : 0;
    var parsed = readBody(hasBody ? body : null, m.headers['content-type']);
    var responseType = this._responseType;

    setTimeout(function () {
      if (m.done) return;
      self._emit('loadstart', { lengthComputable: false, loaded: 0, total: 0 });
      if (hasBody) {
        var p = { lengthComputable: true, loaded: size, total: size };
        self.upload._emit('loadstart', { lengthComputable: true, loaded: 0, total: size });
        self.upload._emit('progress', p);
        self.upload._emit('load', p);
        self.upload._emit('loadend', p);
      }
    }, 0);

    if (this._timeout > 0) {
      m.timer = setTimeout(function () {
        if (m.done) return;
        m.done = true;
        m.readyState = 4;
        self._emit('readystatechange');
        self._emit('timeout');
        self._emit('loadend');
      }, this._timeout);
    }

    server.handle({ method: m.method, url: m.url, headers: m.headers, body: parsed.body, files: parsed.files })
      .then(function (res) { return shape(res, responseType); })
      .then(function (res) {
        if (m.done) return;
        // Let the loadstart/upload events of a 0 ms response go first.
        setTimeout(function () {
          if (m.done) return;
          m.done = true;
          if (m.timer) clearTimeout(m.timer);
          m.res = res;
          m.readyState = 2;
          self._emit('readystatechange');
          m.readyState = 3;
          self._emit('readystatechange');
          var p = { lengthComputable: res.length !== undefined, loaded: res.length || 0, total: res.length || 0 };
          self._emit('progress', p);
          m.readyState = 4;
          self._emit('readystatechange');
          self._emit('load', p);
          self._emit('loadend', p);
        }, 0);
      }, function (err) {
        if (m.done) return;
        m.done = true;
        if (typeof console !== 'undefined') console.error('[ambii-demo] mock request failed', err);
        m.readyState = 4;
        self._emit('readystatechange');
        self._emit('error');
        self._emit('loadend');
      });
  };

  DemoXHR.prototype.abort = function () {
    if (this._native) return this._native.abort();
    var m = this._mock;
    if (!m) return;
    if (m.sent && !m.done) {
      m.done = true;
      if (m.timer) clearTimeout(m.timer);
      m.readyState = 4;
      this._emit('readystatechange');
      this._emit('abort');
      this._emit('loadend');
    }
    m.readyState = 0;
  };

  DemoXHR.__ambiiDemo = true;
  DemoXHR.native = Native;
  window.XMLHttpRequest = DemoXHR;
}

function headersToObject(h) {
  var out = {};
  if (!h) return out;
  if (typeof Headers !== 'undefined' && h instanceof Headers) {
    h.forEach(function (v, k) { out[k.toLowerCase()] = v; });
  } else if (Array.isArray(h)) {
    h.forEach(function (pair) { out[String(pair[0]).toLowerCase()] = String(pair[1]); });
  } else {
    Object.keys(h).forEach(function (k) { out[k.toLowerCase()] = String(h[k]); });
  }
  return out;
}

export function installFetch(server) {
  var nativeFetch = window.fetch;
  if (!nativeFetch || nativeFetch.__ambiiDemo) return;
  var demoFetch = function (input, init) {
    var isRequest = typeof Request !== 'undefined' && input instanceof Request;
    var url = isRequest ? input.url : String(input);
    if (!isMockUrl(url)) return nativeFetch.apply(window, arguments);
    var opts = init || {};
    var method = String(opts.method || (isRequest ? input.method : 'GET')).toUpperCase();
    var headers = Object.assign(headersToObject(isRequest ? input.headers : null), headersToObject(opts.headers));
    var signal = opts.signal || (isRequest ? input.signal : null);
    if (signal && signal.aborted) return Promise.reject(new DOMException('The user aborted a request.', 'AbortError'));
    var bodyPromise = opts.body !== undefined ? Promise.resolve(opts.body)
      : isRequest && method !== 'GET' && method !== 'HEAD' ? input.clone().text() : Promise.resolve(null);
    var work = bodyPromise.then(function (raw) {
      var parsed = readBody(raw, headers['content-type']);
      return server.handle({ method: method, url: absolute(url), headers: headers, body: parsed.body, files: parsed.files });
    }).then(function (res) {
      var body = res.body;
      var payload = (typeof Blob !== 'undefined' && body instanceof Blob) || body instanceof Uint8Array ? body : JSON.stringify(body);
      return new Response(payload, { status: res.status, statusText: STATUS_TEXT[res.status] || '', headers: { 'content-type': res.contentType } });
    });
    if (!signal) return work;
    return new Promise(function (resolve, reject) {
      signal.addEventListener('abort', function () { reject(new DOMException('The user aborted a request.', 'AbortError')); });
      work.then(resolve, reject);
    });
  };
  demoFetch.__ambiiDemo = true;
  window.fetch = demoFetch;
}
