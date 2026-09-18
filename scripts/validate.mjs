import { loadCatalog } from './catalog.mjs';
try {
  const entries = await loadCatalog();
  console.log(`Catalog valid: ${entries.length} entries; ${entries.filter(e => e.origin === 'original').length} original experimental packages.`);
  console.log('Structural validation only. This does not establish agent-host behavior.');
} catch (error) { console.error(error); process.exitCode = 1; }
