import { openSync, closeSync, readSync, fstatSync, lstatSync, realpathSync, constants } from 'node:fs';
import { join, resolve } from 'node:path';
import { check, doc, id, digest, revision, object, canonical, hash, freshness, limits } from './common.mjs';
import { observeWorkspace } from './profile.mjs';

const MAX_FILE = 2 * 1024 * 1024;
const MAX_TOTAL = 8 * 1024 * 1024;
function keys(value, required) {
  check(object(value) && Object.keys(value).length === required.length && required.every(k => Object.hasOwn(value, k)), 'invalid-checkpoint-shape');
}
function binding(value) {
  keys(value, ['taskId', 'contractSha256', 'environmentSha256']);
  check(id(value.taskId) && digest(value.contractSha256) && digest(value.environmentSha256), 'invalid-binding');
}
function pathValid(path) {
  return typeof path === 'string' && path.length > 0 && path.length <= 512 && !/[\\:\x00-\x1f\x7f]/.test(path)
    && path.split('/').every(p => p && p !== '.' && p !== '..' && p.toLowerCase() !== '.git');
}
function fileList(files, captured = false) {
  check(Array.isArray(files) && files.length > 0 && files.length <= 32, 'invalid-file-list');
  const ids = new Set(), paths = new Set();
  for (const file of files) {
    keys(file, captured ? ['id', 'path', 'sha256', 'bytes'] : ['id', 'path']);
    check(id(file.id) && pathValid(file.path) && !ids.has(file.id) && !paths.has(file.path), 'invalid-file-reference');
    ids.add(file.id); paths.add(file.path);
    if (captured) check(digest(file.sha256) && Number.isSafeInteger(file.bytes) && file.bytes >= 0 && file.bytes <= MAX_FILE, 'invalid-file-record');
  }
  if (captured) check(files.reduce((n, f) => n + f.bytes, 0) <= MAX_TOTAL, 'oversized-checkpoint');
}
function readFileIdentity(root, file) {
  let selected = root;
  for (const part of file.path.split('/')) {
    selected = join(selected, part);
    check(!lstatSync(selected).isSymbolicLink(), 'symlink-evidence');
  }
  const fd = openSync(selected, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
  try {
    const before = fstatSync(fd);
    check(before.isFile() && before.size <= MAX_FILE, 'invalid-evidence-file');
    const buffer = Buffer.alloc(MAX_FILE + 1);
    let size = 0, count;
    while (size < buffer.length && (count = readSync(fd, buffer, size, buffer.length - size, null)) > 0) size += count;
    const after = fstatSync(fd);
    check(size <= MAX_FILE && size === before.size && before.size === after.size && before.mtimeMs === after.mtimeMs && before.ctimeMs === after.ctimeMs, 'changing-evidence');
    return { id: file.id, path: file.path, sha256: hash(buffer.subarray(0, size)), bytes: size };
  } finally { closeSync(fd); }
}
function identities(root, files) {
  const result = files.map(file => readFileIdentity(root, file));
  check(result.reduce((n, f) => n + f.bytes, 0) <= MAX_TOTAL, 'oversized-evidence');
  return result;
}
const same = (a, b) => canonical(a) === canonical(b);
const sourceLimits = [...limits,
  'Only selected file bytes and Git-visible state are checked. Ignored files are covered only when explicitly selected; unsaved buffers and remote state are not observed.',
  'Two observations can detect some concurrent changes, not create an atomic snapshot. Keep the owned workspace quiescent. Hashes do not authenticate statements or prove that the selection is complete.',
  'The manifest includes repository-relative paths, not file bodies. Keep private manifests and evidence outside public version control.'];

export function createCheckpoint(request, root, now = Date.now()) {
  keys(request, ['schemaVersion', 'binding', 'maxAgeSeconds', 'files']); doc(request);
  binding(request.binding); fileList(request.files);
  freshness(new Date(now).toISOString(), now, request.maxAgeSeconds);
  const directory = realpathSync(resolve(root));
  const before = observeWorkspace(directory, now).workspace;
  const files = identities(directory, request.files);
  const after = observeWorkspace(directory, now).workspace;
  check(same(before, after) && same(files, identities(directory, request.files)), 'source-changed-during-capture');
  const checkpoint = { schemaVersion: 1, kind: 'context-checkpoint', createdAt: new Date(now).toISOString(),
    binding: request.binding, maxAgeSeconds: request.maxAgeSeconds, workspace: before, files };
  return { ...checkpoint, checkpointSha256: hash(canonical(checkpoint)) };
}

export function verifyCheckpoint(checkpoint, current, root, now = Date.now()) {
  keys(checkpoint, ['schemaVersion', 'kind', 'createdAt', 'binding', 'maxAgeSeconds', 'workspace', 'files', 'checkpointSha256']);
  doc(checkpoint); check(checkpoint.kind === 'context-checkpoint' && digest(checkpoint.checkpointSha256), 'invalid-checkpoint');
  binding(checkpoint.binding); binding(current); fileList(checkpoint.files, true);
  keys(checkpoint.workspace, ['rootSha256', 'head', 'stateSha256', 'dirty']);
  check(digest(checkpoint.workspace.rootSha256) && digest(checkpoint.workspace.stateSha256) && revision(checkpoint.workspace.head) && typeof checkpoint.workspace.dirty === 'boolean', 'invalid-workspace');
  const { checkpointSha256, ...payload } = checkpoint;
  check(hash(canonical(payload)) === checkpointSha256, 'checkpoint-integrity-mismatch');
  const directory = realpathSync(resolve(root)), before = observeWorkspace(directory, now).workspace;
  const checks = [
    { id: 'task-contract-environment', status: same(checkpoint.binding, current) ? 'matched' : 'changed' },
    { id: 'checkpoint-age', status: freshness(checkpoint.createdAt, now, checkpoint.maxAgeSeconds) ? 'matched' : 'stale' },
    { id: 'workspace', status: same(checkpoint.workspace, before) ? 'matched' : 'changed' },
  ];
  for (const file of checkpoint.files) {
    try {
      const first = readFileIdentity(directory, file), second = readFileIdentity(directory, file);
      checks.push({ id: file.id, status: same(first, second) && same(first, file) ? 'matched' : 'changed' });
    } catch { checks.push({ id: file.id, status: 'unavailable' }); }
  }
  checks.push({ id: 'capture-stability', status: same(before, observeWorkspace(directory, now).workspace) ? 'matched' : 'changed' });
  return { schemaVersion: 1, kind: 'context-revalidation', ok: checks.every(c => c.status === 'matched'),
    checkpointSha256, checks, authority: 'not-evaluated', limits: sourceLimits };
}
