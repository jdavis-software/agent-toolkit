import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({
  testDir: './tests', testMatch: ['browser.spec.ts'], fullyParallel: true, workers: 2, retries: 0,
  reporter: [['list'], ['json', { outputFile: `${here}.evidence/results.json` }]], outputDir: `${here}.evidence/browser`,
  use: { baseURL: 'http://127.0.0.1:4343', trace: 'retain-on-failure' },
  webServer: { command: 'node evals/frontend/server.mjs', cwd: fileURLToPath(new URL('../..', import.meta.url)), url: 'http://127.0.0.1:4343', reuseExistingServer: false },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } }, { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } } ],
});
