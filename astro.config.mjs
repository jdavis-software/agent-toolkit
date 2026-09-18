import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import safeMarkdown from './scripts/safe-markdown.mjs';
export default defineConfig({
  site: 'https://jdavis-software.github.io',
  base: '/agent-toolkit',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { processor: unified({ remarkPlugins: [safeMarkdown] }) },
});
