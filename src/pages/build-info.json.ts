import { loadCategories } from '../../scripts/categories.mjs';
import type { APIRoute } from 'astro';
import { loadCatalog } from '../../scripts/catalog.mjs';
import { loadBundles } from '../../tools/lib/bundles.mjs';
import { buildRevision } from '../../scripts/build-revision.mjs';
export const GET: APIRoute = async () => {
  const entries = await loadCatalog();
  const bundles = await loadBundles();
  return new Response(JSON.stringify({
    schemaVersion: 1,
    sourceRevision: buildRevision(),
    counts: { entries: entries.length, skills: entries.filter(e => e.kind === 'skill').length, tools: entries.filter(e => e.kind === 'tool').length, bundles: bundles.length, categories: (await loadCategories()).length },
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
