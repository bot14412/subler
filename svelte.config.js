import { readFile } from 'fs/promises';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

const url = new URL('package.json', import.meta.url);
const content = await readFile(url.pathname, 'utf8');
const json = JSON.parse(content);

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),
    version: {
      name: json.version,
    },
  },
  preprocess: vitePreprocess(),
};
