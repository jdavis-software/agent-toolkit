import { loadCatalog } from './catalog.mjs';
import { syncReadme } from './readme.mjs';
const entries=await loadCatalog();
await syncReadme();
console.log(`Catalog valid: ${entries.filter(e=>e.listed!==false).length} listed entries; ${entries.filter(e=>e.vendorPath).length} source packages verified.`);
console.log('Checks validate source integrity and site structure, not agent-host behavior.');
