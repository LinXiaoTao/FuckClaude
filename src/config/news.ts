/**
 * Curated Claude / Anthropic news items.
 * Update manually — structured for easy future RSS or API integration.
 */

export type NewsCategory = 'product' | 'policy' | 'api' | 'security';

export interface NewsItem {
  id: string;
  category: NewsCategory;
  publishedAt: string;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  sourceUrl: string;
  sourceName: string;
}

export const NEWS_CATEGORIES: Record<NewsCategory, { en: string; zh: string }> = {
  product: { en: 'Product', zh: '产品动态' },
  policy: { en: 'Policy', zh: '政策与地区' },
  api: { en: 'API', zh: 'API 变更' },
  security: { en: 'Security', zh: '安全与风控' },
};

export const CLAUDE_NEWS: NewsItem[] = [
  {
    id: 'python-sdk-v1-0',
    category: 'api',
    publishedAt: '2026-08-20',
    title: {
      en: 'Python SDK v1.0 ships with httpx2 migration and legacy API removal',
      zh: 'Python SDK v1.0 发布（迁移 httpx2，移除旧 API）',
    },
    summary: {
      en: 'Anthropic released Python SDK v1.0: the HTTP layer moves from httpx to the maintained httpx2 fork (requires Python 3.10+). Long-deprecated surface is removed, including the legacy Text Completions API, `temperature`/`top_p`/`top_k` on Messages, and the tool runner\'s client-side `compaction_control`. Async `.with_raw_response` now needs `await response.parse()`. See the v1 migration guide for full breaking changes.',
      zh: 'Anthropic 发布 Python SDK v1.0：HTTP 层从 httpx 迁至维护中的 httpx2 分支（需 Python 3.10+）。移除长期弃用接口，含旧 Text Completions API、Messages 上的 `temperature`/`top_p`/`top_k`，以及 tool runner 客户端 `compaction_control`。异步 `.with_raw_response` 现需 `await response.parse()`。完整破坏性变更见 v1 迁移指南。',
    },
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'platform-api-ga-aug-2026',
    category: 'api',
    publishedAt: '2026-08-19',
    title: {
      en: 'Computer use, browser use, Files API, and Agent Skills exit beta',
      zh: 'Computer use、browser use、Files API 与 Agent Skills 正式 GA',
    },
    summary: {
      en: 'Anthropic graduated four major platform features: computer use (`computer_toolset_20260801`) and a new browser use toolset no longer need beta headers; Files API and Agent Skills (/v1/skills) are GA too. All four work on Fable 5, Mythos 5, Opus 5, and Sonnet 5.',
      zh: 'Anthropic 将四项平台能力正式 GA：computer use（`computer_toolset_20260801`）与全新 browser use 工具集不再需要 beta header；Files API 与 Agent Skills（/v1/skills）亦同步转正。四项能力均支持 Fable 5、Mythos 5、Opus 5 与 Sonnet 5。',
    },
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-text-watermark',
    category: 'policy',
    publishedAt: '2026-08-14',
    title: {
      en: 'Claude text watermarking rolls out globally for EU AI Act compliance',
      zh: 'Claude 文本水印全球上线，配合 EU AI Act 透明度要求',
    },
    summary: {
      en: 'New Claude models embed an invisible SynthID-Text watermark in generated text, applied globally (not EU-only). The mark carries no user or org identifiers and adds no extra tokens; older models will receive watermarking over the coming months.',
      zh: '新 Claude 模型在生成文本中嵌入不可见的 SynthID-Text 水印，全球生效（非仅限欧盟）。水印不含用户或组织标识、不增加 token 消耗；旧模型将在未来数月内逐步补齐。',
    },
    sourceUrl: 'https://www.anthropic.com/news/claude-text-watermark',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-code-auto-mode-default',
    category: 'product',
    publishedAt: '2026-08-14',
    title: {
      en: 'Claude Code auto mode becomes default on Pro, Max, and Team plans',
      zh: 'Claude Code auto mode 成为 Pro / Max / Team 默认权限模式',
    },
    summary: {
      en: 'Since Aug 14, new Claude Code sessions on Pro, Max, and Team run in auto mode — a classifier approves routine tool calls instead of prompting. Classifier token overhead is no longer charged on these plans; Enterprise and API access remain opt-in for now.',
      zh: '自 8 月 14 日起，Pro / Max / Team 的新 Claude Code 会话默认进入 auto mode，由分类器自动放行常规工具调用而非逐条弹窗确认。上述套餐不再收取分类器 token 开销；Enterprise 与 API 接入仍为 opt-in。',
    },
    sourceUrl: 'https://claude.com/blog/auto-mode-default-in-claude-code',
    sourceName: 'Anthropic',
  },
  {
    id: 'fable-5-biology-safeguards',
    category: 'security',
    publishedAt: '2026-08-07',
    title: {
      en: 'Fable 5 biology safeguards tuned; fallback false positives down ~85%',
      zh: 'Fable 5 生物安全护栏优化，误报 fallback 减少约 85%',
    },
    summary: {
      en: 'Anthropic retuned Fable 5\'s biology safety classifiers so benign health and education queries trigger fewer fallbacks to Opus 5 — about 85% fewer biology-related fallbacks in testing. Dual-use requests (virology, toxicology, molecular design) still route to the less capable model; trusted-access pathways for frontier biology remain in development.',
      zh: 'Anthropic 重调 Fable 5 生物安全分类器，日常健康与教育类问题更少误触发 fallback 至 Opus 5——测试中生物相关 fallback 减少约 85%。双重用途请求（病毒学、毒理学、分子设计等）仍会路由至能力较低的模型；面向前沿生物能力的可信访问通道仍在建设中。',
    },
    sourceUrl: 'https://www.anthropic.com/news/improving-fable-5-s-biology-safeguards',
    sourceName: 'Anthropic',
  },
  {
    id: 'sonnet-5-permanent-pricing',
    category: 'api',
    publishedAt: '2026-08-10',
    title: {
      en: 'Claude Sonnet 5 introductory pricing ($2/$10) made permanent',
      zh: 'Claude Sonnet 5 优惠价 $2/$10 定为永久定价',
    },
    summary: {
      en: 'Anthropic cancelled the planned Sep 1 increase to $3/$15 per million tokens. Sonnet 5 stays at $2 input / $10 output per MTok as the standard API price.',
      zh: 'Anthropic 取消原定于 9 月 1 日执行的 $3/$15 涨价。Sonnet 5 API 永久维持 $2 input / $10 output per MTok 的标准价。',
    },
    sourceUrl: 'https://www.anthropic.com/news/claude-sonnet-5',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-opus-4-1-retired',
    category: 'api',
    publishedAt: '2026-08-05',
    title: {
      en: 'Claude Opus 4.1 retired; migrate to Opus 4.8 or Opus 5',
      zh: 'Claude Opus 4.1 已退役，需迁移至 Opus 4.8 或 Opus 5',
    },
    summary: {
      en: 'Anthropic ended support for claude-opus-4-1-20250805 after a 60-day deprecation window. API calls to the old model ID now return errors; Opus 4.8 and Opus 5 are the recommended replacements.',
      zh: 'Anthropic 在 60 天弃用期后停止支持 claude-opus-4-1-20250805。旧 model ID 的 API 调用现已报错；推荐迁移至 Opus 4.8 或 Opus 5。',
    },
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/model-deprecations',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-opus-5',
    category: 'product',
    publishedAt: '2026-07-24',
    title: {
      en: 'Anthropic releases Claude Opus 5 as new default on Pro and Max',
      zh: 'Anthropic 发布 Claude Opus 5，成为 Pro 与 Max 默认模型',
    },
    summary: {
      en: 'Opus 5 targets coding and knowledge work with thinking enabled by default. Available on Claude.ai, Claude Code, and the API at $5/$25 per million tokens — same pricing as Opus 4.8.',
      zh: 'Opus 5 默认开启 thinking，面向编码与知识工作。已在 Claude.ai、Claude Code 与 API 上线，定价 $5/$25 per million tokens，与 Opus 4.8 相同。',
    },
    sourceUrl: 'https://www.anthropic.com/news/claude-opus-5',
    sourceName: 'Anthropic',
  },
];

/** Most recent first. */
export function getLatestNews(limit?: number): NewsItem[] {
  const sorted = [...CLAUDE_NEWS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}
