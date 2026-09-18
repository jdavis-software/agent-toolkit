import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
// Source files remain unchanged. These transformations affect only website
// rendering: no raw HTML, remote images, or executable link schemes.
export function transformMarkdown(tree, filePath, sources) {
  const path = String(filePath).replaceAll('\\','/');
  const vendor = path.match(/(?:^|\/)vendor\/([^/]+)\/([^/]+)\/SKILL\.md$/);
  const original = path.match(/(?:^|\/)skills\/([^/]+)\/SKILL\.md$/);
  const source = vendor && sources[vendor[1]];
  const prefix = source ? `https://github.com/${source.repo}/blob/${source.revision}/` : original ? 'https://github.com/jdavis-software/agent-toolkit/blob/main/' : undefined;
  const base = prefix ? `${prefix}skills/${vendor ? vendor[2] : original[1]}/` : undefined;
  function walk(node) {
    if (node.type === 'heading' && node.depth === 1) node.depth = 2;
    if (node.type === 'html') node.type='text';
    if (node.type === 'image' || node.type === 'imageReference') {
      node.type='text'; node.value=node.alt ? `[Image: ${node.alt}]` : '[Image omitted]';
      delete node.url; delete node.identifier;
    }
    if (['link','definition'].includes(node.type) && typeof node.url === 'string') {
      const url=node.url.trim();
      if (url.startsWith('#')) { /* in-document heading */ }
      else if (/^https?:\/\//i.test(url) || /^mailto:/i.test(url)) { /* explicit safe scheme */ }
      else if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || /[\u0000-\u001f]/.test(url)) node.url='#';
      else if (base && prefix) {
        const resolved=new URL(url,base);
        node.url=resolved.href.startsWith(prefix) ? resolved.href : '#';
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  }
  walk(tree);
  return tree;
}
export default function safeMarkdown() {
  const sources=JSON.parse(readFileSync(resolve('catalog/upstreams.json'),'utf8'));
  return (tree,file)=>transformMarkdown(tree,file.path,sources);
}
