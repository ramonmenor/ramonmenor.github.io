import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  site: 'https://ramonmenor.es',
  integrations: [sitemap(), tailwind(), db()],
  output: 'static',
  prefetch: false
});