import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname } from 'node:path';

const files = [
  'dist/reveal.js', 'dist/reveal.css', 'dist/reset.css', 'dist/theme/moon.css',
  'dist/plugin/markdown.js', 'dist/plugin/highlight.js',
  'dist/plugin/highlight/monokai.css', 'dist/plugin/notes.js',
  'LICENSE',
];
await rm('assets/reveal', { recursive: true, force: true });
for (const file of files) {
  const destination = `assets/reveal/${file}`;
  await mkdir(dirname(destination), { recursive: true });
  await cp(`node_modules/reveal.js/${file}`, destination, { recursive: true });
}
