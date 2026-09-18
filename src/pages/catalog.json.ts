import type { APIRoute } from 'astro';
import { loadCatalog } from '../../scripts/catalog.mjs';
export const GET: APIRoute = async () => new Response(JSON.stringify({ schemaVersion: 1, entries: await loadCatalog() }), { headers: { 'Content-Type':'application/json; charset=utf-8' } });
