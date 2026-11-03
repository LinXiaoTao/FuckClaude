// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// `site` must match the real deployment origin so canonical URLs,
// hreflang links and the generated sitemap point to the correct domain.
//
// Output stays `static` (every page is prerendered); the Vercel adapter is
// only here so the on-demand routes `src/pages/api/check.ts` and
// `src/pages/api/ip.ts` (`export const prerender = false`) can run as Vercel
// Functions. `/api/check` reads geo headers for the China-user estimate.
// `/api/ip` scores the visitor's own egress IP. The two scores stay separate.
export default defineConfig({
  site: 'https://fuck-claude.vercel.app',
  output: 'static',
  adapter: vercel(),
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
        },
      },
    }),
  ],
});
