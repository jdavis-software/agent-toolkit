#!/usr/bin/env node
/** Optional Python standard-library companion; no shell, installer, or model call. */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const script = fileURLToPath(new URL('./sourcekit.py', import.meta.url));
const result = spawnSync('python3', [script, ...process.argv.slice(2)], {
  shell: false, stdio: 'inherit', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
if (result.error) {
  console.error('Sourcekit requires an available Python 3.10+ interpreter named python3. No installation was attempted.');
  process.exit(2);
}
process.exit(result.status ?? 2);
