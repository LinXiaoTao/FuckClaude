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
  },
  {
    id: 'flashrent',
    name: 'FlashRent',
    url: {
      zh: 'https://www.energy-rent.work/',
      en: 'https://www.energy-rent.work/',
    },
    logo: '/sponsors/flashrent-wordmark.png',
    logoWidth: 340,
    logoHeight: 126,
    headline: {
      zh: 'FlashRent 波场能量租用，USDT 转账省手续费高达 80%。',
      en: 'FlashRent TRON energy rental, save up to 80% on USDT transfer gas.',
    },
    tagline: {
      zh: '一键秒级到账，无需冻结 TRX，支持单笔租用、批量派发与 Telegram Bot 集成',
      en: 'Instant delegation without freezing TRX — supports single rentals, bulk orders, and Telegram bot integration',
    },
    cta: {
      zh: '免费体验',
      en: 'Try free',
    },
  },
  {
    id: 'agentearth',
    name: 'AgentEarth',
    url: {
      zh: 'https://agentearth.ai/login?mode=register&ref_code=Ot7RhpNk',
      en: 'https://agentearth.ai/login?mode=register&ref_code=Ot7RhpNk',
    },
    logo: '/sponsors/agentearth-wordmark.png',
    logoWidth: 360,
    logoHeight: 120,
    headline: {
      zh: '新用户注册即赠 5,000 积分（价值 $5）',
      en: 'Sign up to get 5,000 credits ($5 value) free',
    },
    tagline: {
      zh: '1,400+ 专业 API 工具库，MCP & Skill 协议一键接入',
      en: '1,400+ pro APIs for AI Agents — ready via MCP & Skill',
    },
    cta: {
      zh: '立即注册',
      en: 'Sign up free',
    },
  },
];
