import type { APIRoute } from 'astro';
import { loadCategories } from '../../scripts/categories.mjs';
export const GET:APIRoute=async()=>new Response(JSON.stringify({schemaVersion:1,categories:await loadCategories()}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
