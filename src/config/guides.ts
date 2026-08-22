/**
 * Structured guide articles for the Anti-Ban & Environment Cleanup Knowledge Base.
 */

export interface GuideArticle {
  slug: string;
  category: 'analysis' | 'environment' | 'account' | 'api' | 'appeal' | 'alternatives' | 'detection';
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
  detection: {
    en: 'AI Content Detection & Evasion',
    zh: 'AI 内容检测与规避',
  },
} as const;

export const GUIDES: GuideArticle[] = [
  {
    slug: 'antiban-essentials',
    category: 'account',
    title: {
      en: 'Claude Anti-Ban Essentials: Quick Safety Checklist',
      zh: 'Claude 防封速查手册：账号、API 与频率控制要点',
    },
    summary: {
      en: 'A concise, actionable checklist covering account & payment safety, environment hygiene, API rate limits, usage patterns, and recovery steps — with links to in-depth guides.',
      zh: '涵盖账号支付、环境/browser 卫生、API 速率限制、使用模式与封号自救的简明实操清单，附深度指南链接。',
    },
    readTime: '6 min',
    updatedAt: '2026-08',
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
    readTime: '14 min',
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
    readTime: '14 min',
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
    readTime: '10 min',
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
    readTime: '12 min',
    updatedAt: '2026-08',
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
    readTime: '10 min',
    updatedAt: '2026-08',
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
    readTime: '9 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'ban-case-studies',
    category: 'analysis',
    title: {
      en: 'Claude Ban Case Studies & Root Cause Analysis',
      zh: 'Claude 封号案例复盘与避坑经验',
    },
    summary: {
      en: 'Real-world Claude ban case studies including timezone mismatches, high-risk BINs, API abuse, and account association, with prevention checklists.',
      zh: '真实封号案例深度复盘，涵盖时区不一致、虚拟卡 BIN 风险、API 滥用检测、账号关联连带等典型场景与规避策略。',
    },
    readTime: '11 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'multi-account-management',
    category: 'account',
    title: {
      en: 'Multi-Account Management Best Practices',
      zh: '多账号管理最佳实践：环境隔离与安全切换',
    },
    summary: {
      en: 'Complete multi-account isolation strategies including physical vs software separation, browser profile setup, IP/payment distribution, and safe switching procedures.',
      zh: '多账号完全隔离方案，对比物理隔离与软件隔离优劣，涵盖浏览器 Profile 配置、IP 与支付分离策略、安全切换 SOP。',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
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
    readTime: '12 min',
    updatedAt: '2026-08',
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
    readTime: '9 min',
    updatedAt: '2026-08',
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
    readTime: '10 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'payment-methods-comparison',
    category: 'account',
    title: {
      en: 'Virtual Card Platforms & Payment Methods Comparison',
      zh: '虚拟卡平台与支付方式深度对比评测',
    },
    summary: {
      en: 'Comprehensive comparison of virtual card platforms, credit vs debit vs prepaid card risk assessment, cryptocurrency payment options, and failure prevention.',
      zh: '主流虚拟卡平台深度对比，信用卡/借记卡/预付卡风险评估，加密货币支付渠道分析，支付失败常见原因与规避方案。',
    },
    readTime: '11 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'regional-access-strategy',
    category: 'account',
    title: {
      en: 'Regional Access Strategies & Registration Guide',
      zh: 'Claude 全球地区访问策略与注册指引',
    },
    summary: {
      en: 'Region-specific Claude access guide covering supported vs restricted regions, US/UK/SG registration best practices, GDPR compliance, and cross-border travel scenarios.',
      zh: '全球地区访问策略完全指南，Anthropic 支持/限制地区清单、美英新注册最佳实践、欧盟 GDPR 合规与跨境出差场景应对。',
    },
    readTime: '9 min',
    updatedAt: '2026-08',
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
    readTime: '10 min',
    updatedAt: '2026-08',
  },
  {
    slug: 'claude-ai-content-watermarking',
    category: 'detection',
    title: {
      en: 'Claude AI Content Watermarking: Detection & Removal Guide',
      zh: 'Claude AI 内容水印：检测与去除完全指南',
    },
    summary: {
      en: 'Complete guide to Claude\'s embedded text watermarks and C2PA metadata, detection methods, removal techniques including paraphrasing, translation, and metadata stripping, plus legal considerations.',
      zh: '深度解析 Claude 嵌入式文本水印与 C2PA 元数据机制、检测方法、移除技术（改写、翻译、元数据剥离），以及法律与道德考量完全指南。',
    },
    readTime: '14 min',
    updatedAt: '2026-08',
  },
];
