import type { APIRoute } from 'astro';
import { loadBundles } from '../../tools/lib/bundles.mjs';
export const GET: APIRoute = async () => new Response(JSON.stringify({schemaVersion:1,stage:'experimental',bundles:await loadBundles()}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
