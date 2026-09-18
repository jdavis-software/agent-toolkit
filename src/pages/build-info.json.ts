import type { APIRoute } from 'astro';
import { loadCatalog } from '../../scripts/catalog.mjs';
import { loadBundles } from '../../tools/lib/bundles.mjs';
export const GET: APIRoute = async () => {
  const entries = await loadCatalog();
  const bundles = await loadBundles();
  const candidate = process.env.GITHUB_SHA;
  const sourceRevision = candidate && /^[0-9a-f]{40}$/.test(candidate) ? candidate : null;
  return new Response(JSON.stringify({
    schemaVersion: 1,
    sourceRevision,
    counts: { entries: entries.length, skills: entries.filter(e => e.kind === 'skill').length, tools: entries.filter(e => e.kind === 'tool').length, bundles: bundles.length },
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
