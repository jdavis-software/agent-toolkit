import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, '.build');
await mkdir(out, { recursive: true });
const result = await build({ absWorkingDir: root, entryPoints: ['app/main.tsx'], outfile: '.build/app.js', bundle: true, minify: true, metafile: true, format: 'esm', platform: 'browser', target: ['es2022'], define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'linked' });
await build({ absWorkingDir: root, entryPoints: ['app/domain.ts'], outfile: '.build/domain.mjs', bundle: true, format: 'esm', platform: 'node', target: ['node22'] });
execFileSync(process.execPath, [join(root, 'node_modules/@tailwindcss/cli/dist/index.mjs'), '-i', 'style.css', '-o', '.build/app.css', '--minify'], { cwd: root, stdio: 'inherit', timeout: 30_000 });
const files = {};
for (const name of ['app.js', 'app.css']) {
  const bytes = await readFile(join(out, name));
  files[name] = { bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
}
const limits = { javascriptGzipBytes: 150_000, cssGzipBytes: 12_000 };
if (files['app.js'].gzipBytes > limits.javascriptGzipBytes || files['app.css'].gzipBytes > limits.cssGzipBytes) throw new Error('Predeclared fixture bundle budget exceeded');
const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
await writeFile(join(out, 'measurements.json'), JSON.stringify({ schemaVersion: 1, scope: 'Isolated synthetic CSR fixture; not field Web Vitals', files, limits, dependencies: packageJson.dependencies, inputs: Object.keys(result.metafile.inputs).sort() }, null, 2));
await writeFile(join(out, 'metafile.json'), JSON.stringify(result.metafile, null, 2));
let notices = 'THIRD-PARTY NOTICES — optional frontend fixture only\n\n';
for (const name of ['react','react-dom','scheduler','@tanstack/react-query','@tanstack/query-core','react-hook-form','react-icons','tailwindcss']) {
  let license;
  for (const candidate of ['LICENSE','LICENSE.md','LICENSE.txt']) {
    try { license = await readFile(join(root, 'node_modules', name, candidate), 'utf8'); break; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!license) throw new Error(`Missing dependency notice: ${name}`);
  notices += `\n=== ${name} ===\n${license}\n`;
}
notices += '\n=== Bootstrap Icons via react-icons/bs ===\n' + await readFile(join(root, 'notices/BOOTSTRAP_ICONS_LICENSE.txt'), 'utf8');
await writeFile(join(out, 'THIRD_PARTY_NOTICES.txt'), notices);
await writeFile(join(out, 'index.html'), '<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Frontend Foundations · Synthetic Lab</title><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><noscript>This isolated React fixture requires JavaScript. The public toolkit guide remains readable without it.</noscript><script type="module" src="/app.js"></script></body></html>');
console.log(JSON.stringify({ build: 'passed', files, limits }));
