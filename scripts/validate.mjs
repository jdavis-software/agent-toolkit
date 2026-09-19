import { loadCategories } from './categories.mjs';
import { syncReadme } from './readme.mjs';
import { loadCatalog } from './catalog.mjs';
import { validateRolePackages } from '../tools/lib/roles.mjs';
import { validateExpansion } from '../tools/lib/bundles.mjs';
try {
  const entries = await loadCatalog();
  const expansion = await validateExpansion();
  const categories=await loadCategories();
  console.log(`Role registry valid: ${await validateRolePackages()} presets; no worker execution.`);
  await syncReadme();
  console.log(`Category registry valid: ${categories.length} primary categories.`);
  console.log(`Catalog valid: ${entries.length} entries; ${entries.filter(e => e.kind === 'skill').length} original skills; ${expansion.bundles} bundles; ${expansion.scenarioInputs} new scenario inputs.`);
  console.log('Package, bundle, and source validation only. Agent-host behavior remains unevaluated.');
} catch (error) { console.error(error); process.exitCode = 1; }
