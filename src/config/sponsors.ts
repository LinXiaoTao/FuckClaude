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
  url: string;
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
    id: 'ergou',
    name: '二狗 API',
    url: 'https://ergouapi.com/r/gh-fuckclaude',
    logo: '/sponsors/ergou-wordmark-340x112.png',
    logoWidth: 340,
    logoHeight: 112,
    headline: {
      zh: '接入二狗，稳如老狗。',
      en: 'The rock-solid AI API gateway.',
    },
    tagline: {
      zh: '全站 0.1x~0.2x 超低倍率，Claude/GPT/Gemini 等 100% 纯血大模型接口，顶级 IPLC 线路稳定低延迟',
      en: 'Ultra-low 0.1x–0.2x rates for 100% genuine Claude / GPT / Gemini endpoints over premium IPLC routes',
    },
    cta: {
      zh: '快来试试',
      en: 'Try it now',
    },
  },
  {
    id: 'roxy',
    name: 'Roxy浏览器',
    url: 'https://roxybrowser.com/invite/0326196A',
    logo: '/sponsors/roxy-wordmark.jpg',
    logoWidth: 500,
    logoHeight: 200,
    headline: {
      zh: '指纹暴露你是中国用户？',
      en: 'Fingerprints flagging you as a China user?',
    },
    tagline: {
      zh: 'Roxy浏览器，一键伪装干净的海外环境，绕过 Claude 风控',
      en: 'RoxyBrowser fakes a clean overseas environment in one click and slips past Claude risk control',
    },
    cta: {
      zh: '免费使用',
      en: 'Use for free',
    },
  }
];
