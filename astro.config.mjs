import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aggressorbulkit.online',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    sitemap(),
  ],
  server: {
    host: '127.0.0.1',
    port: 4323
  }
});
