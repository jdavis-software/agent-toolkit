import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '**/site.spec.ts', fullyParallel: true,
  retries: process.env.CI ? 1 : 0, workers: process.env.CI ? 2 : undefined,
  reporter: [['list'],['html',{open:'never'}]],
  use: { baseURL:'http://127.0.0.1:4321', trace:'retain-on-failure' },
  webServer: { command:'pnpm preview --host 127.0.0.1 --port 4321', url:'http://127.0.0.1:4321/agent-toolkit/', reuseExistingServer:!process.env.CI },
  projects: [{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
});
