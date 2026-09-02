import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const extract = spawnSync(process.execPath, ['scripts/extract-idle.mjs'], { stdio: 'inherit' });
if (extract.status !== 0) process.exit(extract.status ?? 1);

if (existsSync('dist')) await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });
await cp('public', 'dist', { recursive: true });
console.log('Built dist/');
