// In development, CRA's server passes /api/listening on to the listening Worker running locally
// (`yarn dev` in workers/listening). In production Cloudflare answers that path before the request
// reaches the host. Without the Worker running, listen-along just stays hidden.
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

module.exports = (app) => {
    // The path goes in as the filter rather than to app.use, which would strip it from the forwarded URL
    app.use(createProxyMiddleware('/api/listening', { target: 'http://127.0.0.1:8787', changeOrigin: true, logLevel: 'silent' }));

    // The muted preview server (REACT_APP_MUTE_AUDIO, from the "dev" launch config) inlines muteAudio.js at
    // the top of every static page under public/, the way index.tsx loads it into the app, so the
    // projects' music, videos and Flash play silently too. The files on disk are left alone.
    if (process.env.REACT_APP_MUTE_AUDIO) {
        app.use((req, res, next) => {
            if (req.method !== 'GET' && req.method !== 'HEAD') return next();
            let file;
            try {
                file = path.join(PUBLIC_DIR, decodeURIComponent(req.path));
            } catch {
                return next();
            }
            // public/index.html is the app's template, which the dev server builds and serves itself
            if (!/\.html?$/i.test(file) || !file.startsWith(PUBLIC_DIR + path.sep) || file === path.join(PUBLIC_DIR, 'index.html') || !fs.existsSync(file)) return next();

            const page = fs.readFileSync(file);
            // latin1 keeps one character per byte, so an offset found in it is a byte offset, whatever the page's encoding
            const text = page.toString('latin1');
            const tag = /<head\b[^>]*>/i.exec(text) || /<html\b[^>]*>/i.exec(text) || /<!doctype[^>]*>/i.exec(text);
            const at = tag ? tag.index + tag[0].length : 0;
            const script = Buffer.from(`<script>${fs.readFileSync(path.join(__dirname, 'muteAudio.js'), 'utf8')}</script>`);

            // The same type the static server would send, so the page decodes as it always has
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
            res.setHeader('Cache-Control', 'no-store');
            res.end(Buffer.concat([page.subarray(0, at), script, page.subarray(at)]));
        });
    }
};
