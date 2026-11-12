// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://fuck-claude.vercel.app',
  output: 'static',
  adapter: vercel(),
  i18n: {
    locales: ['en', 'zh', 'ru', 'fa', 'es', 'ar', 'my'],
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
          ru: 'ru',
          fa: 'fa',
          es: 'es',
          ar: 'ar',
          my: 'my',
        },
      },
    }),
  ],
});
