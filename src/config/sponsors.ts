/**
 * Sponsor list rendered by `src/components/Sponsors.astro` in the strip right
 * below the site nav. To add a sponsor, drop its logo into `public/sponsors/`
 * and append an entry here.
 */

import type { Lang } from '../i18n/ui';

export interface Sponsor {
  id: string;
  name: string;
  /** Outbound (referral) link; the whole banner row links here. */
  url: Record<Lang, string>;
  /** Path under `public/`, e.g. `/sponsors/foo.png`. */
  logo: string;
  /** Intrinsic logo size, used to reserve space and avoid layout shift. */
  logoWidth: number;
  logoHeight: number;
  /** Bold lead-in shown before the tagline. */
  headline: Record<Lang, string>;
  /** One-line pitch per language. */
  tagline: Record<Lang, string>;
  /** Per-sponsor CTA button label. */
  cta: Record<Lang, string>;
}

export const SPONSORS: Sponsor[] = [
  {
    id: 'apimart',
    name: 'APIMart.AI',
    url: {
      zh: 'https://go.apimart.ai/s-fuck-claude',
      en: 'https://go.apimart.ai/s-fuck-claude',
    },
    logo: '/sponsors/apimart-wordmark.jpg',
    logoWidth: 360,
    logoHeight: 120,
    headline: {
      zh: 'GPT-Image-2 低至 $0.006/张，1 美元可出图 160+ 张。',
      en: 'GPT-Image-2 from $0.006 per image — 160+ images per $1.',
    },
    tagline: {
      zh: 'APIMart 专注 AI 图片/视频生成的低价 API 平台，长期稳定、响应快',
      en: 'APIMart is a low-cost API platform for AI image and video generation — stable and fast',
    },
    cta: {
      zh: '立即体验',
      en: 'Try now',
    },
  },
  {
    id: 'roxy',
    name: 'Roxy浏览器',
    url: {
      zh: 'https://roxybrowser.cn/invite/A4YZ2O',
      en: 'https://roxybrowser.cn/invite/A4YZ2O',
    },
    logo: '/sponsors/roxy-wordmark.jpg',
    logoWidth: 500,
    logoHeight: 200,
    headline: {
      zh: '多个账号共用一个浏览器？',
      en: 'Several accounts in one browser?',
    },
    tagline: {
      zh: 'Roxy浏览器为每个账号提供独立的浏览器配置文件，Cookie 与本地数据互相隔离',
      en: 'RoxyBrowser gives each account its own browser profile, with cookies and local data kept separate',
    },
    cta: {
      zh: '免费使用',
      en: 'Use for free',
    },
  },
];
