import { defineConfig } from 'astro/config';
import safeMarkdown from './scripts/safe-markdown.mjs';
export default defineConfig({
  site: 'https://jdavis-software.github.io',
  base: '/agent-toolkit',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { remarkPlugins: [safeMarkdown] },
});
