import { loadCategories } from '../../scripts/categories.mjs';
import type { APIRoute } from 'astro';
import { loadRoles } from '../../tools/lib/roles.mjs';
import { loadBundles } from '../../tools/lib/bundles.mjs';
import { loadCatalog } from '../../scripts/catalog.mjs';
import { withBase } from '../lib/paths';
export const GET: APIRoute = async ({ site }) => {
  const entries = await loadCatalog();
  const bundles = await loadBundles();
  const categoryPaths=(await loadCategories()).map(c=>`categories/${c.id}/`);
  const paths = ['roles/', ...(await loadRoles()).map(r=>`roles/${r.id}/`), 'examples/frontend-engineering/', 'examples/research-to-delivery/', 'categories/', ...categoryPaths, '', 'skills/', 'tools/', 'workflows/', 'about/', 'bundles/', ...bundles.map(b=>`bundles/${b.id}/`), ...entries.map(e=>`${e.kind === 'skill' ? 'skills' : e.kind === 'tool' ? 'tools' : 'workflows'}/${e.id}/`)];
  const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>`<url><loc>${new URL(withBase(path),site).href}</loc></url>`).join('')+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
