// Static server for the browser harness: the repository's public/ at "/" (like the live site) and
// demos/ at "/demos/". Range requests and folder index.html, no SPA fallback. No dependencies.
//
//   node demos/ambii/mock-server/test/browser/serve.mjs [port]      (default 4111)
//   then open http://localhost:4111/demos/ambii/mock-server/test/browser/harness.html?run=1
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, normalize, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const MOUNTS = [['/demos/', join(REPO, 'demos')], ['/', join(REPO, 'public')]];
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ico': 'image/x-icon',
};
const port = Number(process.argv[2] || 4111);

createServer((req, res) => {
  let path;
  try { path = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400).end(); return; }
  const [prefix, dir] = MOUNTS.find(([p]) => path.startsWith(p));
  let file = normalize(join(dir, path.slice(prefix.length)));
  if (!file.startsWith(normalize(dir))) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404 ' + path); return; }
  const size = statSync(file).size;
  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
  if (req.method === 'HEAD') res.end();
  else createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Ambii mock harness: http://localhost:${port}/demos/ambii/mock-server/test/browser/harness.html?run=1`));
