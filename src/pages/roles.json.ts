import type { APIRoute } from 'astro';
import { loadRoles } from '../../tools/lib/roles.mjs';
export const GET: APIRoute = async () => new Response(JSON.stringify({schemaVersion:1,roles:await loadRoles(),execution:'none',authority:'host-enforced-not-granted-by-role'}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
