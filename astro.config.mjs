import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://jdavis-software.github.io',
  base: '/agent-toolkit',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
