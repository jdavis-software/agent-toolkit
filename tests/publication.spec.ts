import { test, expect } from '@playwright/test';
const base = '/agent-toolkit/';
test('publication metadata exposes only the revision and matching catalog counts', async ({ request }) => {
  const response = await request.get(base + 'build-info.json');
  expect(response.status()).toBe(200);
  const info = await response.json();
  const entries = (await (await request.get(base + 'catalog.json')).json()).entries;
  const bundles = (await (await request.get(base + 'bundles.json')).json()).bundles;
  expect(Object.keys(info).sort()).toEqual(['counts', 'schemaVersion', 'sourceRevision']);
  expect(info.schemaVersion).toBe(1);
  expect(info.sourceRevision === null || /^[0-9a-f]{40}$/.test(info.sourceRevision)).toBeTruthy();
  expect(info.counts).toEqual({
    roles: (await (await request.get(base+'roles.json')).json()).roles.length,
    entries: entries.length,
    skills: entries.filter((e: { kind: string }) => e.kind === 'skill').length,
    tools: entries.filter((e: { kind: string }) => e.kind === 'tool').length,
    bundles: bundles.length,
    categories: (await (await request.get(base+'categories.json')).json()).categories.length,
  });
});
