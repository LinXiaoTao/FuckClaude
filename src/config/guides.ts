/**
 * Single source of truth for guide metadata. Article bodies live in
 * `src/content/guides/` and are registered in `src/content/guidesData.ts`.
 *
 * Reading time is computed from the article body at build time, so there is no
 * `readTime` field to keep in sync.
 */

export type GuideCategory =
  | 'analysis'
  | 'environment'
  | 'account'
  | 'api'
  | 'appeal'
  | 'alternatives'
  | 'detection';

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface GuideSource {
  name: LocalizedText;
  url: string;
}

export interface GuideArticle {
  slug: string;
  category: GuideCategory;
  title: LocalizedText;
  summary: LocalizedText;
  /** First publication date, `YYYY-MM-DD`. */
  publishedAt: string;
  /** Last content change: `YYYY-MM-DD`, or `YYYY-MM` when only the month is known. */
  updatedAt: string;
  /**
   * Date (`YYYY-MM-DD`) on which the official facts in the article were last
   * checked against `sources`. Leave unset for community-experience articles.
   */
  verifiedAt?: string;
  /** Curated "read next" slugs, in reading order. */
  related: string[];
  /** Official or primary sources the article relies on. */
  sources?: GuideSource[];
  /** `false` keeps the page reachable but hides it from the hub, home, and related lists. */
  listed?: boolean;
}

export const GUIDE_CATEGORIES: Record<GuideCategory, LocalizedText> = {
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
  detection: {
    en: 'AI Content Detection & Evasion',
    zh: 'AI 内容检测与规避',
  },
};

/** Display order of category groups on the guides hub. */
export const GUIDE_CATEGORY_ORDER: GuideCategory[] = [
  'account',
  'analysis',
  'environment',
  'api',
  'appeal',
  'alternatives',
  'detection',
];

/** Official pages cited by the guides. Keep these URLs in one place. */
export const OFFICIAL_SOURCES = {
  supportedRegions: {
    name: { en: 'Anthropic: Supported Regions Policy', zh: 'Anthropic：支持地区政策' },
    url: 'https://www.anthropic.com/supported-countries',
  },
  safeguards: {
    name: {
      en: 'Claude Help Center: Safeguards warnings and appeals',
      zh: 'Claude 帮助中心：Safeguards 警告与申诉',
    },
    url: 'https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals',
  },
  usagePolicy: {
    name: { en: 'Anthropic: Usage Policy', zh: 'Anthropic：使用政策' },
    url: 'https://www.anthropic.com/legal/aup',
  },
  transparency: {
    name: { en: 'Anthropic: Transparency Hub', zh: 'Anthropic：透明度中心' },
    url: 'https://www.anthropic.com/transparency/system-trust-reporting',
  },
  billingFaq: {
    name: {
      en: 'Claude Help Center: Paid plan billing FAQs',
      zh: 'Claude 帮助中心：付费计划账单常见问题',
    },
    url: 'https://support.claude.com/en/articles/8325618-paid-plan-billing-faqs',
  },
  cardDeclined: {
    name: {
      en: 'Claude Help Center: Why was my card declined?',
      zh: 'Claude 帮助中心：为什么我的银行卡被拒绝？',
    },
    url: 'https://support.claude.com/en/articles/9402418-why-was-my-card-declined',
  },
  rateLimits: {
    name: { en: 'Claude API docs: Rate limits', zh: 'Claude API 文档：速率限制' },
    url: 'https://platform.claude.com/docs/en/api/rate-limits',
  },
  teamBilling: {
    name: {
      en: 'Claude Help Center: Team plan billing FAQs',
      zh: 'Claude 帮助中心：Team 计划账单常见问题',
    },
    url: 'https://support.claude.com/en/articles/12997503-team-plan-billing-faqs',
  },
  pricing: {
    name: { en: 'Claude: Plans & Pricing (FAQ)', zh: 'Claude：套餐与定价（常见问题）' },
    url: 'https://claude.com/pricing',
  },
  invoices: {
    name: {
      en: 'Claude Help Center: Understanding your Pro or Max plan invoices',
      zh: 'Claude 帮助中心：了解 Pro 或 Max 计划的账单',
    },
    url: 'https://support.claude.com/en/articles/16607638-understanding-your-pro-or-max-plan-invoices',
  },
} satisfies Record<string, GuideSource>;

const PUBLISHED = '2026-08-01';
const VERIFIED = '2026-10-08';

export const GUIDES: GuideArticle[] = [
  {
    slug: 'antiban-essentials',
    category: 'account',
    title: {
      en: 'Claude Anti-Ban Essentials: Quick Safety Checklist',
      zh: 'Claude 防封速查手册：账号、API 与频率控制要点',
    },
    summary: {
      en: 'Official ban reasons and appeal routes first, then a short checklist for staying within Anthropic’s policies: consistent account and payment details, environment hygiene, API rate limits, and usage patterns, with links to the in-depth guides.',
      zh: '先列出官方封禁原因与申诉渠道，再给出在 Anthropic 政策范围内使用的简明清单：账号与支付信息一致、环境卫生、API 速率限制与使用模式，附深度指南链接。',
    },
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    verifiedAt: VERIFIED,
    related: [
      'account-registration-and-payment-antiban',
      'environment-cleanup-and-ip-setup',
      'account-appeal-and-recovery-sop',
    ],
    sources: [
      OFFICIAL_SOURCES.supportedRegions,
      OFFICIAL_SOURCES.safeguards,
      OFFICIAL_SOURCES.usagePolicy,
      OFFICIAL_SOURCES.transparency,
      OFFICIAL_SOURCES.rateLimits,
    ],
  },
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
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['ban-case-studies', 'environment-cleanup-and-ip-setup', 'regional-access-strategy'],
  },
  {
    slug: 'environment-cleanup-and-ip-setup',
    category: 'environment',
    title: {
      en: 'OS & Browser Environment Cleanup & Residential IP Guide',
      zh: '操作系统/浏览器环境纯化与原生住宅 IP 配置指南',
    },
    summary: {
      en: 'How to check and align OS and browser timezone, language and font settings, prevent WebRTC/DNS leaks, and keep a consistent browser profile, so you can diagnose why an environment gets flagged.',
      zh: '检查并对齐系统与浏览器的时区、语言和字体设置，防止 WebRTC/DNS 泄漏，保持浏览器 Profile 一致，帮助排查环境为何被标记。',
    },
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    related: ['vpn-and-proxy-selection', 'browser-configuration-guide', 'device-setup-guide'],
  },
  {
    slug: 'account-registration-and-payment-antiban',
    category: 'account',
    title: {
      en: 'Safe Account Registration, Virtual Card BIN & Payment Risk Avoidance',
      zh: 'Claude 账号注册避坑、虚拟卡 BIN 风险与订阅支付指南',
    },
    summary: {
      en: 'How phone verification works, why some virtual-card BIN types get declined, why the billing address should match the card, and how a failed renewal can affect an account.',
      zh: '了解手机验证机制与 VoIP 号段的问题、部分虚拟卡 BIN 为何容易被拒、账单地址为何应与银行卡一致，以及续费失败对账号的影响。',
    },
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    verifiedAt: VERIFIED,
    related: [
      'payment-methods-comparison',
      'regional-access-strategy',
      'multi-account-management',
    ],
    sources: [
      OFFICIAL_SOURCES.supportedRegions,
      OFFICIAL_SOURCES.billingFaq,
      OFFICIAL_SOURCES.cardDeclined,
    ],
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
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['api-advanced-optimization', 'automation-safety-practices', 'environment-cleanup-and-ip-setup'],
  },
  {
    slug: 'account-appeal-and-recovery-sop',
    category: 'appeal',
    title: {
      en: 'Account Ban Diagnosis & English Appeal SOP',
      zh: 'Claude 封号类型判定与英文申诉自救 SOP',
    },
    summary: {
      en: 'Identify 403 / Refunded / Disabled / organization-hold account statuses, plus a fact-based English appeal email template, data export notes, and refund steps after a ban.',
      zh: '快速区分 IP 拦截、被迫退款、永久禁用与组织被暂停状态，提供基于事实的英文申诉信模板、数据导出说明与封号后的退款流程。',
    },
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    verifiedAt: VERIFIED,
    related: ['troubleshooting-guide', 'ban-case-studies', 'domestic-and-open-source-alternatives'],
    sources: [OFFICIAL_SOURCES.safeguards, OFFICIAL_SOURCES.transparency],
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
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    related: ['claude-code-and-api-safety', 'api-advanced-optimization', 'account-appeal-and-recovery-sop'],
  },
  {
    slug: 'browser-configuration-guide',
    category: 'environment',
    title: {
      en: 'Browser Configuration Guide for Claude Anti-Ban',
      zh: 'Chrome/Firefox/Edge 防封配置实操手册',
    },
    summary: {
      en: 'Practical configuration guide for Chrome, Firefox, and Edge browsers including timezone sync, language settings, WebRTC controls, and essential privacy extensions.',
      zh: '详解 Chrome、Firefox、Edge 三大浏览器的防封配置，包含时区同步、语言设置、WebRTC 禁用、隐私增强扩展等实操步骤。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['environment-cleanup-and-ip-setup', 'device-setup-guide', 'vpn-and-proxy-selection'],
  },
  {
    slug: 'vpn-and-proxy-selection',
    category: 'environment',
    title: {
      en: 'VPN & Proxy Selection: Residential IP vs Datacenter IP',
      zh: 'VPN 与代理服务选择指南：住宅 IP vs 数据中心 IP',
    },
    summary: {
      en: 'In-depth comparison of residential IPs vs datacenter IPs for Claude access, proxy protocol selection, VPN provider evaluation criteria, and DNS leak prevention.',
      zh: '深度对比住宅 IP 与数据中心 IP 的风险差异，解析代理协议选择标准、VPN 服务商评估维度与 DNS 泄漏防护实操。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['environment-cleanup-and-ip-setup', 'browser-configuration-guide', 'regional-access-strategy'],
  },
  {
    slug: 'ban-case-studies',
    category: 'analysis',
    title: {
      en: 'Claude Ban Case Studies & Root Cause Analysis',
      zh: 'Claude 封号案例复盘与避坑经验',
    },
    summary: {
      en: 'Unverified ban case write-ups covering timezone mismatches, prepaid-card refunds, API abuse, and account association, with prevention checklists. Root causes are interpretations, not Anthropic findings.',
      zh: '未经独立核实的封号案例复盘，涵盖时区不一致、预付卡退款、API 滥用检测、账号关联连带等场景与规避清单。根因是解读，不是 Anthropic 的结论。',
    },
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    related: ['claude-steganography-and-risk-model', 'account-appeal-and-recovery-sop', 'troubleshooting-guide'],
  },
  {
    slug: 'multi-account-management',
    category: 'account',
    title: {
      en: 'Multi-Account Management Best Practices',
      zh: '多账号管理最佳实践：环境隔离与安全切换',
    },
    summary: {
      en: 'For people who legitimately use more than one account, such as work and personal or team seats: how to keep browser profiles, billing and sign-ins separate, and how to switch between them safely.',
      zh: '面向合规使用多个账号的场景（如工作与个人账号、团队席位）：如何分开浏览器 Profile、账单与登录，以及如何安全切换。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['account-registration-and-payment-antiban', 'environment-cleanup-and-ip-setup', 'ban-case-studies'],
  },
  {
    slug: 'api-advanced-optimization',
    category: 'api',
    title: {
      en: 'Advanced Claude API Optimization & Token Management',
      zh: 'Claude API 进阶优化：Token 控制与 Prompt Cache 实战',
    },
    summary: {
      en: 'Advanced techniques for maximizing Prompt Cache efficiency, optimizing token billing, managing long context windows, and implementing robust retry logic.',
      zh: '深度解析 Prompt Cache 最大化利用策略、Token 计费优化技巧、长上下文窗口管理、并发控制与流式输出最佳实践。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['claude-code-and-api-safety', 'automation-safety-practices', 'domestic-and-open-source-alternatives'],
  },
  {
    slug: 'troubleshooting-guide',
    category: 'appeal',
    title: {
      en: 'Claude Troubleshooting & Diagnostic Guide',
      zh: 'Claude 使用故障排查与问题定位手册',
    },
    summary: {
      en: 'Systematic troubleshooting guide for Claude login failures, API call exceptions, payment binding issues, with diagnostic flowcharts and quick fixes.',
      zh: '系统化故障排查手册，涵盖登录失败（403/429/500）、API 调用异常、支付绑卡失败的定位流程与快速解决方案。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['account-appeal-and-recovery-sop', 'ban-case-studies', 'payment-methods-comparison'],
  },
  {
    slug: 'device-setup-guide',
    category: 'environment',
    title: {
      en: 'Cross-Platform Device Setup for Claude Anti-Ban',
      zh: '跨平台设备防封配置：Mac/Windows/Linux/移动端',
    },
    summary: {
      en: 'Platform-specific anti-ban configuration guides for macOS, Windows, Linux, iOS, and Android including timezone settings, environment variables, and font isolation.',
      zh: '跨平台防封配置实操，覆盖 macOS 时区设置、Windows 注册表配置、Linux 终端环境、iOS/Android 移动端的系统级防护。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['environment-cleanup-and-ip-setup', 'browser-configuration-guide', 'claude-code-and-api-safety'],
  },
  {
    slug: 'payment-methods-comparison',
    category: 'account',
    title: {
      en: 'Claude Payment Methods, Card Risk & Decline Troubleshooting',
      zh: 'Claude 支付方式、银行卡风险与扣款失败排查',
    },
    summary: {
      en: 'Which payment methods Claude accepts, how card type and billing address affect approval, what the official decline checklist says, and how to avoid unreliable card sellers.',
      zh: 'Claude 接受哪些支付方式，卡类型与账单地址如何影响扣款，官方的扣款失败排查清单，以及如何避开不可靠的卡商。',
    },
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    verifiedAt: VERIFIED,
    related: ['account-registration-and-payment-antiban', 'regional-access-strategy', 'troubleshooting-guide'],
    sources: [
      OFFICIAL_SOURCES.billingFaq,
      OFFICIAL_SOURCES.cardDeclined,
      OFFICIAL_SOURCES.teamBilling,
      OFFICIAL_SOURCES.pricing,
      OFFICIAL_SOURCES.invoices,
    ],
  },
  {
    slug: 'regional-access-strategy',
    category: 'account',
    title: {
      en: 'Regional Access Strategies & Registration Guide',
      zh: 'Claude 全球地区访问策略与注册指引',
    },
    summary: {
      en: 'Region-by-region guide to Claude availability: supported and unsupported regions, registration requirements in supported countries such as the US, UK and Singapore, GDPR considerations, and what to expect when traveling.',
      zh: 'Claude 各地区可用性指南：Anthropic 支持与不支持的地区、在美英新等支持地区注册的要求、欧盟 GDPR 注意事项，以及出差旅行时会遇到的情况。',
    },
    publishedAt: PUBLISHED,
    updatedAt: VERIFIED,
    verifiedAt: VERIFIED,
    related: ['account-registration-and-payment-antiban', 'vpn-and-proxy-selection', 'antiban-essentials'],
    sources: [OFFICIAL_SOURCES.supportedRegions, OFFICIAL_SOURCES.safeguards],
  },
  {
    slug: 'automation-safety-practices',
    category: 'api',
    title: {
      en: 'Safe Automation & Batch API Usage Guidelines',
      zh: 'Claude 自动化与批量调用安全规范',
    },
    summary: {
      en: 'Enterprise-grade automation safety practices including rate limiting, anti-abuse detection avoidance, multi-account load balancing, and compliance audit logging.',
      zh: '企业级自动化安全规范，涵盖批量调用频率控制、反滥用检测规避、多账号轮询负载均衡架构、审计日志与合规性自查。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    related: ['claude-code-and-api-safety', 'api-advanced-optimization', 'ban-case-studies'],
  },
  {
    slug: 'claude-ai-content-watermarking',
    category: 'detection',
    title: {
      en: 'Claude AI Content Watermarking: Detection & Removal Guide',
      zh: 'Claude AI 内容水印：检测与去除完全指南',
    },
    summary: {
      en: "Complete guide to Claude's embedded text watermarks and C2PA metadata, detection methods, removal techniques including paraphrasing, translation, and metadata stripping, plus legal considerations.",
      zh: '深度解析 Claude 嵌入式文本水印与 C2PA 元数据机制、检测方法、移除技术（改写、翻译、元数据剥离），以及法律与道德考量完全指南。',
    },
    publishedAt: PUBLISHED,
    updatedAt: '2026-08',
    listed: false,
    related: ['claude-steganography-and-risk-model', 'antiban-essentials'],
  },
];

export const LISTED_GUIDES: GuideArticle[] = GUIDES.filter((guide) => guide.listed !== false);

export function getGuide(slug: string): GuideArticle | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** Curated related guides; unlisted guides are never recommended. */
export function getRelatedGuides(guide: GuideArticle): GuideArticle[] {
  return guide.related
    .map((slug) => LISTED_GUIDES.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is GuideArticle => candidate !== undefined);
}

/** `YYYY-MM` becomes the first day of that month so structured data stays a valid date. */
export function toIsoDate(value: string): string {
  return /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
}
