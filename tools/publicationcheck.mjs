#!/usr/bin/env node
// Convenience wrapper; no package installation and no shell interpretation.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const result = spawnSync('python3', [fileURLToPath(new URL('./publicationcheck.py', import.meta.url)), ...process.argv.slice(2)], { stdio: 'inherit', shell: false, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
if (result.error) { console.error('Python 3.10+ is required; no interpreter was installed.'); process.exitCode = 2; }
else process.exitCode = result.status ?? 2;
