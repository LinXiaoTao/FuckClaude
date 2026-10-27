// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// `site` must match the real deployment origin so canonical URLs,
// hreflang links and the generated sitemap point to the correct domain.
//
// Output stays `static` (every page is prerendered); the Vercel adapter is
// only here so the single on-demand route `src/pages/api/check.ts`
// (`export const prerender = false`) can run as a Vercel Function and read the
// request's geo headers for the curl/API endpoint.
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
