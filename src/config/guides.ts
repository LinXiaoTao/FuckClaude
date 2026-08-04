/**
 * Structured guide articles for the Anti-Ban & Environment Cleanup Knowledge Base.
 */

export interface GuideArticle {
  slug: string;
  category: 'analysis' | 'environment' | 'account' | 'api' | 'appeal' | 'alternatives';
  title: {
    en: string;
    zh: string;
  };
  summary: {
    en: string;
    zh: string;
  };
  readTime: string;
  updatedAt: string;
}

export const GUIDE_CATEGORIES = {
  analysis: {
    en: 'Risk Model & Steganography',
    zh: '风控解密与隐写原理',
  },
  environment: {
    en: 'Environment Cleanup & IP Setup',
    zh: '环境纯化与 IP 配置',
  },
  account: {
    en: 'Account & Payment Safety',
    zh: '账号注册与支付避坑',
  },
  api: {
    en: 'Claude Code & API Safety',
    zh: 'Claude Code 与 API 规范',
  },
  appeal: {
    en: 'Account Appeal & Recovery SOP',
    zh: '封号诊断与申诉自救',
  },
  alternatives: {
    en: 'Domestic Models & Failover',
    zh: '平替模型与灾备方案',
  },
} as const;

export const GUIDES: GuideArticle[] = [
  {
    slug: 'claude-steganography-and-risk-model',
    category: 'analysis',
    title: {
      en: 'Claude Code Steganography & Anthropic 4-Layer Risk Model',
      zh: 'Claude Code 隐写暗记原理与 Anthropic 四维风控模型解密',
    },
    summary: {
      en: 'Deep dive into how Claude Code embedded hidden Unicode markers into system prompts and how Anthropic flags accounts based on IP, timezone, BIN, and usage patterns.',
      zh: '深度拆解 Claude Code 如何利用 Unicode 撇号与日期斜杠隐写中国指纹，以及 Anthropic 从 IP、时区、支付卡头到对话频次的全维度风控逻辑。',
    },
    readTime: '8 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'environment-cleanup-and-ip-setup',
    category: 'environment',
    title: {
      en: 'OS & Browser Environment Cleanup & Residential IP Guide',
      zh: '操作系统/浏览器环境纯化与原生住宅 IP 配置指南',
    },
    summary: {
      en: 'Step-by-step guide to syncing OS timezones, isolating Chinese font fingerprints, preventing WebRTC/DNS leaks, and setting up anti-detect browsers.',
      zh: '一键同步系统与 Intl 时区、隔离中文字体指纹、禁用 WebRTC 内网泄漏，以及通过防指纹浏览器配置隔离环境实操。',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'account-registration-and-payment-antiban',
    category: 'account',
    title: {
      en: 'Safe Account Registration, Virtual Card BIN & Payment Risk Avoidance',
      zh: 'Claude 账号注册避坑、虚拟卡 BIN 选择与高胜率订阅指南',
    },
    summary: {
      en: 'How to choose physical SIM verification services, pick high-rate virtual credit card BINs, align billing addresses, and avoid chain bans.',
      zh: '避开 VoIP 虚拟号段接码坑点，挑选高通过率虚拟信用卡 BIN、对齐 IP 与账单国家地址，避免续费扣款失败导致的批量连带封号。',
    },
    readTime: '9 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'claude-code-and-api-safety',
    category: 'api',
    title: {
      en: 'Claude Code Safe Configuration & Relay API Best Practices',
      zh: 'Claude Code 安全配置与第三方 API 中转平滑降级规范',
    },
    summary: {
      en: 'How to safely set custom ANTHROPIC_BASE_URL, override TZ env variables, choose high-availability API gateways, and preserve prompt caching.',
      zh: '安全配置 ANTHROPIC_BASE_URL 与隐藏主机名，通过 TZ 与环境变量防护，以及如何选择不破坏 Prompt Cache 的优质 API 中转。',
    },
    readTime: '7 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'account-appeal-and-recovery-sop',
    category: 'appeal',
    title: {
      en: 'Account Ban Diagnosis & High-Success English Appeal SOP',
      zh: 'Claude 封号类型判定与高成功率英文申诉自救 SOP',
    },
    summary: {
      en: 'Identify 403 / Refunded / Disabled account statuses, plus proven English appeal email templates and chargeback resolution procedures.',
      zh: '快速区分 IP 拦截、被迫退款与永久禁用状态，提供针对合规跨境/出差场景的高成功率英文申诉信模板与退款申诉流程。',
    },
    readTime: '8 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'domestic-and-open-source-alternatives',
    category: 'alternatives',
    title: {
      en: 'Seamless Failover to Domestic AI Models & Local Open-Source Setups',
      zh: '国产顶尖模型平替指引与私有化 Ollama/One-API 降级通道',
    },
    summary: {
      en: 'Complete guide to DeepSeek R1/V3, GLM-4, and Kimi integrations, plus setting up Ollama and One-API as local Claude API drop-in replacements.',
      zh: '无缝对接 DeepSeek R1/V3、GLM-4 与 Kimi，使用 Ollama 和 One-API 搭建本地与私有化 Claude 兼容接口，确保生产研发中断降至零。',
    },
    readTime: '6 min',
    updatedAt: '2026-08',
  },
];
