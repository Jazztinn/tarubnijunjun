import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const extract = spawnSync(process.execPath, ['scripts/extract-idle.mjs'], { stdio: 'inherit' });
if (extract.status !== 0) process.exit(extract.status ?? 1);

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.gif': 'image/gif', '.png': 'image/png', '.tiff': 'image/tiff' };
const port = Number(process.env.PORT || 4173);
const server = createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const relativePath = requestPath === '/' ? '/index.html' : requestPath;
  const sourcePath = relativePath.startsWith('/assets/') ? `/public${relativePath}` : relativePath;
  const file = normalize(join(root, sourcePath));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) { response.writeHead(404); response.end('404'); return; }
  response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  createReadStream(file).pipe(response);
});

server.listen(port, '0.0.0.0', () => console.log(`Tarubnijunjun running at http://localhost:${port}`));
