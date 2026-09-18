import type { APIRoute } from 'astro';
import { loadCatalog, loadSources } from '../../scripts/catalog.mjs';
export const GET: APIRoute = async () => new Response(JSON.stringify({ schemaVersion: 2, title: 'Jordan’s Agent Toolkit Collection', sources: await loadSources(), entries: (await loadCatalog()).filter(e=>e.listed!==false) }), { headers: { 'Content-Type':'application/json; charset=utf-8' } });
