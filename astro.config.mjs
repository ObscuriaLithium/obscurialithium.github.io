import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  site: 'https://obscurialithium.github.io',
  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: false
    }
  }
});
