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
  takeaway?: { en: string; zh: string };
  relatedGuideSlug?: string;
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
    id: 'claude-code-2-1-283-managed-models',
    category: 'product',
    publishedAt: '2026-09-25',
    title: {
      en: 'Claude Code 2.1.283 adds enterprise model allow/deny lists and third-party auto mode default',
      zh: 'Claude Code 2.1.283：Enterprise 模型白/黑名单与第三方默认 auto mode',
    },
    summary: {
      en: 'Claude Code 2.1.283 introduces managed `availableModelsMatch` (`exact` pins a listed model version until admins update the list) and `deniedModels` (blocks specific models even when otherwise allowed). Third-party API, Vertex, Bedrock, or Foundry sessions with telemetry off now start in auto mode when no `permissions.defaultMode` is set. Other highlights: `/doctor prompt-audit` scans CLAUDE.md and skills for stale patterns, MCP tool images are saved to disk for follow-up tools, and `claude plugin validate` rejects install-unsafe marketplace names.',
      zh: 'Claude Code 2.1.283 新增托管设置 `availableModelsMatch`（`exact` 仅允许列表中的具体模型版本，直至管理员更新）与 `deniedModels`（可单独封禁某模型）。在第三方 API、Vertex、Bedrock 或 Foundry 且关闭 telemetry 时，若未配置 `permissions.defaultMode`，新会话默认进入 auto mode。其他要点：`/doctor prompt-audit` 审计 CLAUDE.md 与 skill 是否沿用旧模型写法；MCP 返回的图片会落盘供后续工具读取；`claude plugin validate` 会拒绝无法安装的 marketplace 命名。',
    },
    takeaway: {
      en: 'Enterprise admins should pair `deniedModels` with explicit `permissions.defaultMode` on sensitive repos — auto mode now applies outside claude.ai subscriptions too.',
      zh: 'Enterprise 建议在敏感仓库同时配置 `deniedModels` 与明确的 `permissions.defaultMode`——auto mode 已不仅限于 claude.ai 订阅环境。',
    },
    relatedGuideSlug: 'claude-code-and-api-safety',
    sourceUrl: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.283',
    sourceName: 'Anthropic',
  },
  {
    id: 'api-refusal-billing-resume-sep-2026',
    category: 'api',
    publishedAt: '2026-09-24',
    title: {
      en: 'Anthropic resumes billing for pre-output refusals in bio, frontier LLM, and reasoning-extraction categories',
      zh: 'Anthropic 恢复对生物、前沿 LLM 与推理提取类「零输出拒答」的 API 计费',
    },
    summary: {
      en: 'From September 24, 2026, Messages API requests that refuse before any output are billed again when `stop_details.category` is `bio`, `frontier_llm`, or `reasoning_extraction` — the categories Anthropic says have the lowest false-positive rates. Mid-stream refusals were already charged. Other pre-output refusal categories stay free; fallback credits are unchanged. Charges use the executing model’s normal rates on all platforms.',
      zh: '自 2026 年 9 月 24 日起，当 `stop_details.category` 为 `bio`、`frontier_llm` 或 `reasoning_extraction` 时，Messages API 在尚未输出任何内容即拒答的请求将重新计入账单——Anthropic 称这三类误报率最低。中途拒答此前已计费；其余类别的「零输出拒答」仍免费，fallback 额度规则不变。费用按实际执行模型的常规定价，全平台生效。',
    },
    takeaway: {
      en: 'Budget for classifier-triggered hard stops on biology- or capability-probing prompts — they can cost full input tokens even with empty assistant output.',
      zh: '涉及生物或能力探测的 prompt 若触发分类器硬拒，即使 assistant 为空也可能按完整输入计费，请在成本模型里预留这部分。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'compliance-activity-feed-redaction-sep-2026',
    category: 'api',
    publishedAt: '2026-09-24',
    title: {
      en: 'Compliance API Activity Feed strips filenames and artifact titles from events',
      zh: 'Compliance API Activity Feed 不再返回文件名与 artifact 标题',
    },
    summary: {
      en: 'The Compliance API Activity Feed no longer exposes file names, project document names, or artifact titles. The `filename` and `title` fields on file, project-document, and artifact activities are always empty or omitted, including for historical records. Enterprise teams that need human-readable names must resolve IDs with a Compliance Access Key scoped to `read:compliance_user_data`.',
      zh: 'Compliance API Activity Feed 已停止在事件中暴露文件名、项目文档名与 artifact 标题。文件、项目文档与 artifact 类活动的 `filename`、`title` 字段现恒为空或省略，历史记录亦同。Enterprise 若需可读名称，须用带 `read:compliance_user_data` 范围的 Compliance Access Key 按 ID 另行查询。',
    },
    takeaway: {
      en: 'Update SIEM parsers and audit dashboards that relied on inline titles — store only activity IDs unless you call the compliance user-data endpoints.',
      zh: '若 SIEM 或审计面板曾依赖 Activity Feed 内嵌标题，请改为只存 activity ID，或额外调用 compliance 用户数据端点解析。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'cache-diagnostics-ga-sep-2026',
    category: 'api',
    publishedAt: '2026-09-23',
    title: {
      en: 'Prompt cache diagnostics exit beta on the Messages API',
      zh: 'Messages API 缓存诊断（cache diagnostics）转正 GA',
    },
    summary: {
      en: 'Cache diagnostics is GA on the Claude API and no longer needs the `cache-diagnosis-2026-04-07` beta header. Opt in by sending a `diagnostics` object on Messages requests; every `POST /v1/messages` response now includes a `diagnostics` field (`null` when you did not opt in). Requests that still send the old beta header behave as before.',
      zh: 'Claude API 上的缓存诊断已 GA，不再需要 `cache-diagnosis-2026-04-07` beta 头。在 Messages 请求中加入 `diagnostics` 对象即可启用；所有 `POST /v1/messages` 响应现均含 `diagnostics` 字段（未启用时为 `null`）。仍发送旧 beta 头的请求保持原有行为。',
    },
    takeaway: {
      en: 'Send `diagnostics` on every turn in multi-step agents — header-only requests no longer store fingerprints for later `previous_message_id` checks.',
      zh: '多轮 Agent 请在每一轮都带上 `diagnostics`；仅发 beta 头不再写入 fingerprint，后续 `previous_message_id` 诊断会失效。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-opus-5-5-launch',
    category: 'product',
    publishedAt: '2026-09-22',
    title: {
      en: 'Claude Opus 5.5 launches at $4/$20 with ~40% lower typical cost than Opus 5',
      zh: 'Claude Opus 5.5 发布：$4/$20 定价，典型 workload 较 Opus 5 约省 40%',
    },
    summary: {
      en: 'Anthropic released Claude Opus 5.5 (`claude-opus-5-5`) as the first Claude 5.5-family model: 1M context, 128k max output, always-on adaptive thinking, priced at $4 / $20 per MTok with cache reads at $0.20 / MTok (vs $5 / $25 and $0.50 on Opus 5). Anthropic positions it near Claude Fable 5.1 on most agentic coding and knowledge work while using fewer tokens per task. API constraints mirror Fable 5.1: `thinking` cannot be disabled, and `tool_choice` types `any`/`tool` return 400. Fast mode is available in research preview. Pro, Max, Team, and seat-based Enterprise plans get higher five-hour limits plus a user-chosen rate-limit reset.',
      zh: 'Anthropic 发布 Claude Opus 5.5（`claude-opus-5-5`），为 Claude 5.5 系列首款：1M 上下文、128k 最大输出、始终开启 adaptive thinking，定价 $4 / $20 per MTok，缓存读取 $0.20 / MTok（Opus 5 为 $5 / $25 与 $0.50）。官方称其多数 agentic 编程与知识工作接近 Fable 5.1，且单任务 token 更少。API 限制与 Fable 5.1 类似：不可关闭 `thinking`，`tool_choice` 的 `any`/`tool` 返回 400。Fast mode 为 research preview。Pro / Max / Team 与按席位 Enterprise 提升五小时额度，并提供可自选时机的 rate limit 重置。',
    },
    takeaway: {
      en: 'Migrate long-horizon coding agents from Opus 5 for cost; drop disabled-thinking and forced-tool `tool_choice` patterns before switching model IDs.',
      zh: '长周期编程 Agent 可从 Opus 5 迁来降本；切换 model ID 前请移除关闭 thinking 与强制 `tool_choice` 的写法。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://www.anthropic.com/news/claude-opus-5-5',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-code-2-1-277-agents-md',
    category: 'product',
    publishedAt: '2026-09-18',
    title: {
      en: 'Claude Code 2.1.277 reads AGENTS.md, removes TaskOutput, and hardens headless sessions',
      zh: 'Claude Code 2.1.277 支持 AGENTS.md、移除 TaskOutput，并修复无头会话',
    },
    summary: {
      en: 'Claude Code 2.1.277 uses `AGENTS.md` as project instructions when no `CLAUDE.md` exists (configurable under “Project instructions”; not yet on Bedrock, Vertex, or Foundry). The deprecated TaskOutput tool is removed — use Read on background task output files instead. Gateway egress can set `CLAUDE_GATEWAY_PROXY_IS_EGRESS_BOUNDARY=1` so proxies receive hostnames instead of local DNS resolution. Dozens of fixes cover `claude -p` hangs, empty text-block resume failures, plugin reinstall races, and headless cost totals resetting to zero on resume.',
      zh: 'Claude Code 2.1.277 在无 `CLAUDE.md` 的项目中改读 `AGENTS.md`（可在「Project instructions」配置；Bedrock / Vertex / Foundry 尚未支持）。已弃用的 TaskOutput 工具被移除，请用 Read 读取后台任务输出文件。网关 egress 可设 `CLAUDE_GATEWAY_PROXY_IS_EGRESS_BOUNDARY=1`，让代理收到主机名而非本地解析结果。另含大量修复：`claude -p` 挂起、空 text block 导致 resume 失败、插件重装竞态，以及无头 resume 后费用统计归零等。',
    },
    takeaway: {
      en: 'Standardize on either CLAUDE.md or AGENTS.md per repo — mixed or empty instruction files now change which rules Claude loads at session start.',
      zh: '每个仓库固定选用 CLAUDE.md 或 AGENTS.md 之一；混用或留空会改变会话启动时加载的项目指令。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.277',
    sourceName: 'Anthropic',
  },
  {
    id: 'life-sciences-verification-program',
    category: 'security',
    publishedAt: '2026-09-17',
    title: {
      en: 'Life Sciences Verification Program opens for vetted biology workloads on Mythos, Opus, and Sonnet',
      zh: 'Life Sciences Verification Program 开放，向合规生命科学团队放宽生物类护栏',
    },
    summary: {
      en: 'Anthropic opened the Life Sciences Verification Program (LSVP) for teams vetted on credentials, security posture, and research oversight. Standard Use grants cover most R&D workflows on Mythos 5.1, Opus 5, Sonnet 5, and future models via API, Claude Science, claude.ai, and Claude Code, with classifiers tuned for legitimate biology. High-risk Use add-ons remove life-science blocks for single projects on six-month renewal. Enforcement shifts toward offline monitoring with mandatory 30-day retention on LSVP traffic; cyber classifiers stay active.',
      zh: 'Anthropic 正式开放 Life Sciences Verification Program（LSVP），面向通过资质、安全与科研监督审查的团队。Standard Use 授权覆盖 API、Claude Science、claude.ai 与 Claude Code 上多数研发流程，可在 Mythos 5.1、Opus 5、Sonnet 5 及后续模型上使用针对合规生物任务调优的分类器。High-risk Use 附加授权针对单个项目移除生命科学拦截，每半年续期。执法更多转向离线行为监测，LSVP 流量强制 30 天留存；网络安全类分类器仍生效。',
    },
    takeaway: {
      en: 'Routine biology Q&A blocked on consumer Fable is not a bypass bug — legitimate labs need LSVP verification instead of prompt jailbreaks.',
      zh: '消费级 Fable 上被拦的常规生物问答并非 bypass 漏洞；合规实验室应走 LSVP 审核，而非 prompt 越狱。',
    },
    sourceUrl: 'https://www.anthropic.com/news/life-sciences-verification-program',
    sourceName: 'Anthropic',
  },
  {
    id: 'messages-api-on-demand-compaction-beta',
    category: 'api',
    publishedAt: '2026-09-14',
    title: {
      en: 'On-demand conversation compaction enters beta on the Messages API',
      zh: 'Messages API 按需会话压缩（compaction）进入 beta',
    },
    summary: {
      en: 'With the `compact-2026-09-04` beta header, Messages API callers can compact a thread on demand via the top-level `compaction` parameter. The API returns a signed `compaction` block summarizing the messages you sent; later turns send that block instead of the full history. You choose when to compact, can run compaction in the background, and may keep recent turns verbatim after the summary — preserved thinking in those turns can remain valid on supported models.',
      zh: '在 `compact-2026-09-04` beta 头下，Messages API 可通过顶层 `compaction` 参数按需压缩会话。API 返回带签名的 `compaction` 块以概括已发送消息；后续轮次用该块替代完整历史。调用方自行决定压缩时机，可后台执行，并可在摘要之后保留最近若干轮原文——在支持的模型上，这些轮次中的 preserved thinking 仍可保持有效。',
    },
    takeaway: {
      en: 'Use compaction for long agent loops instead of hand-rolling summaries — unsigned DIY summaries still break thinking-block binding on post–Aug 31 accounts.',
      zh: '长 Agent 循环优先用官方 compaction，勿手写未签名摘要——在 8 月 31 日后新建账号上，自制摘要仍会破坏 thinking block 绑定。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'anthropic-threat-intelligence-sep-2026',
    category: 'security',
    publishedAt: '2026-09-10',
    title: {
      en: 'September 2026 threat report: agentic cyber ops, distillation, and Claude Code in state campaigns',
      zh: '2026 年 9 月威胁情报：Agent 化网络行动、蒸馏滥用与 Claude Code 参与国家级行动',
    },
    summary: {
      en: 'Anthropic’s September 2026 Threat Intelligence report covers misuse disrupted from December 2025 through August 2026 across cyber operations, influence ops, scams, surveillance, biology, weapons, and distillation. Haiku, Sonnet, and Opus were abused; Fable and Mythos-class models were not, except one illicit distillation case. Case studies describe multi-agent kill chains — including operators refining Claude Code skills to rebuild malware when detections fire — and reinforce that high-volume automated extraction remains an enforcement priority.',
      zh: 'Anthropic 2026 年 9 月威胁情报报告汇总 2025 年 12 月至 2026 年 8 月间被处置的滥用，涵盖网络行动、影响操作、诈骗、监控、生物、武器与蒸馏等七类。Haiku、Sonnet、Opus 曾被滥用；Fable 与 Mythos 级模型未卷入（仅一起非法蒸馏例外）。案例包括多 Agent 网络杀伤链——有行动者通过调整 Claude Code skill 在检测触发后自动重构恶意软件——并再次表明高并发自动化能力提取仍是执法重点。',
    },
    takeaway: {
      en: 'Treat Claude Code auto mode and stolen API keys as high-risk surfaces — Anthropic explicitly links skill-driven workflows to espionage-scale operations.',
      zh: 'Claude Code 的 auto mode 与泄露 API Key 均属高风险面——官方已将 skill 驱动工作流与国家级间谍行动关联披露。',
    },
    relatedGuideSlug: 'claude-code-and-api-safety',
    sourceUrl: 'https://www.anthropic.com/threat-intelligence-report-september-2026',
    sourceName: 'Anthropic Threat Intelligence',
  },
  {
    id: 'managed-agents-auto-permission-sep-2026',
    category: 'product',
    publishedAt: '2026-09-10',
    title: {
      en: 'Claude Managed Agents gain server-side `auto` permission evaluation; `ant beta:sessions connect` ships',
      zh: 'Claude Managed Agents 支持服务端 `auto` 权限评估；`ant beta:sessions connect` 上线',
    },
    summary: {
      en: 'Managed Agents permission policies now accept `auto`: the server evaluates each agent or MCP tool call and runs, denies, or pauses for approval. `agent.tool_use` and `agent.mcp_tool_use` events include an `evaluation` field beside `evaluated_permission`. Anthropic CLI 1.32.0 adds `ant beta:sessions connect` to attach a terminal to a Managed Agents session, send messages, and approve pending tool calls; pass `--web` to open the Console session viewer locally.',
      zh: 'Managed Agents 权限策略新增 `auto`：服务端逐条评估 agent 或 MCP 工具调用并执行、拒绝或暂停待审批。`agent.tool_use` 与 `agent.mcp_tool_use` 事件在 `evaluated_permission` 旁新增 `evaluation` 字段。Anthropic CLI 1.32.0 提供 `ant beta:sessions connect`，可在终端接入 Managed Agents 会话、发送消息并审批挂起工具调用；加 `--web` 可在本地打开 Console 会话查看器。',
    },
    takeaway: {
      en: 'Prefer server-side `auto` over client-only allowlists when running untrusted MCP tools in managed sandboxes.',
      zh: '在托管沙箱中运行不可信 MCP 时，优先用服务端 `auto` 评估，而非仅依赖客户端 allowlist。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'anthropic-transparency-report-h1-2026',
    category: 'security',
    publishedAt: '2026-09-04',
    title: {
      en: 'Anthropic H1 2026 Transparency Report: 11.4M accounts banned; ~10.5% appeal success rate',
      zh: 'Anthropic 2026 上半年透明度报告：封禁 1140 万账号，申诉解封率约 10.5%',
    },
    summary: {
      en: 'Anthropic\'s Transparency Hub H1 2026 report shows 11.4 million policy-violating accounts disabled in six months, 398,000 appeals received, and 42,000 successful reinstatements (~10.5% success rate). Primary enforcement targets: unsupported-region access, abuse detection, multi-account bulk registration, and model distillation attacks. Disabled accounts should use the dedicated appeal form at claude.ai/restricted; API false-positive or violation warnings go to usersafety@anthropic.com.',
      zh: 'Anthropic Transparency Hub 2026 上半年报告显示：半年内封禁 1140 万违规账号，收到 39.8 万起申诉，成功解封 4.2 万起（解封率约 10.5%）。主要风控针对：未支持地区访问、滥用检测、多账号批量注册与模型蒸馏攻击。被封账号（组织被禁用 / Disabled）需访问 claude.ai/restricted 填写官方申诉表单；API 违规警示与误判请联系 usersafety@anthropic.com。',
    },
    takeaway: {
      en: 'Appeals with clear legitimate-use proof have a real chance of reinstatement — do not panic-create replacement accounts while an appeal is pending.',
      zh: '提供合规学术/开发用途证明的申诉有明确解封概率 — 申诉期间勿慌乱重复建号。',
    },
    relatedGuideSlug: 'account-appeal-and-recovery-sop',
    sourceUrl: 'https://www.anthropic.com/transparency',
    sourceName: 'Anthropic Transparency Hub',
  },
  {
    id: 'thinking-block-replay-aug-2026',
    category: 'security',
    publishedAt: '2026-09-01',
    title: {
      en: 'Accounts created after Aug 31, 2026 face stricter thinking-block replay binding',
      zh: '2026-08-31 后新建账号限制 Thinking block 重放与上下文篡改',
    },
    summary: {
      en: 'Since August 31, 2026, accounts created on or after that date are subject to tighter binding on adaptive thinking blocks across multi-turn API sessions. Replaying, reordering, or tampering with thinking blocks in stored context is treated as a distillation signal and can trigger organization-level disable. This aligns with Anthropic\'s ongoing crackdown on model distillation and automated capability extraction.',
      zh: '自 2026 年 8 月 31 日起，该日期及之后创建的账号在多轮 API 会话中对 adaptive thinking block 执行更严格的绑定校验。重放、重排或篡改已存储上下文中的 thinking block 会被视为蒸馏信号，可能触发组织级禁用。这与 Anthropic 持续打击模型蒸馏与自动化能力提取的风控方向一致。',
    },
    takeaway: {
      en: 'Never cache and replay raw thinking blocks in agent pipelines; store only final assistant text and re-derive reasoning on each turn.',
      zh: 'Agent 流水线切勿缓存并重放原始 thinking block；仅保存最终 assistant 文本，每轮重新推理。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-restricted-appeal-portal',
    category: 'policy',
    publishedAt: '2026-09-03',
    title: {
      en: 'Official disabled-account appeal portal live at claude.ai/restricted',
      zh: '官方封号申诉专用入口 claude.ai/restricted 已启用',
    },
    summary: {
      en: 'Anthropic now routes disabled-account and organization-ban appeals through a dedicated form at https://claude.ai/restricted instead of generic support tickets. The form collects account email, ban context, and usage justification. Community reports in September 2026 show successful reinstatements within 1–3 business days when appeals cite legitimate software engineering or academic use with verifiable details.',
      zh: 'Anthropic 现已将通过 claude.ai/restricted 专用表单处理被封账号与组织禁用申诉，不再依赖通用 support ticket。表单收集账号邮箱、封禁背景与用途说明。2026 年 9 月社区反馈显示：申诉中明确陈述合法软件开发或学术用途并提供可验证细节时，1–3 个工作日内有成功解封案例。',
    },
    takeaway: {
      en: 'Use claude.ai/restricted for Disabled status; reserve usersafety@anthropic.com for API-tier warnings and false positives.',
      zh: 'Disabled 状态走 claude.ai/restricted；API 层级警示与误判走 usersafety@anthropic.com。',
    },
    relatedGuideSlug: 'account-appeal-and-recovery-sop',
    sourceUrl: 'https://claude.ai/restricted',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-code-managed-mcp-headless',
    category: 'product',
    publishedAt: '2026-09-02',
    title: {
      en: 'Claude Code 2.1.259 adds org-managed MCP servers and headless permission controls',
      zh: 'Claude Code 2.1.259 上线组织托管 MCP 与无头权限控制',
    },
    summary: {
      en: 'Claude Code 2.1.259 introduces `managedMcpServers`: organizations can provision HTTP/SSE MCP servers to every user (same shape as `.mcp.json`; command-based entries are skipped). `allowedMcpServers` now governs only user-added servers. For CI and unattended hosts, `--permission-prompts none` auto-denies anything that would prompt while the active permission mode (including auto mode) still applies. GitLab merge-request commands (`glab mr create/merge/close/reopen/note/update`) are recognized in tool summaries.',
      zh: 'Claude Code 2.1.259 新增 `managedMcpServers`：组织可向所有用户下发 HTTP/SSE MCP 服务器（格式同 `.mcp.json`，需执行命令的条目会被跳过）。`allowedMcpServers` 现仅约束用户自行添加的服务器。CI 与无头环境可用 `--permission-prompts none` 自动拒绝一切需弹窗确认的操作，当前权限模式（含 auto mode）仍生效。工具摘要亦识别 GitLab MR 命令（`glab mr create/merge/close/reopen/note/update`）。',
    },
    takeaway: {
      en: 'Enterprise admins should centralize approved MCP endpoints via managed settings instead of relying on per-user `.mcp.json` copies.',
      zh: 'Enterprise 管理员应通过托管设置集中下发受信 MCP 端点，避免依赖用户各自维护 `.mcp.json`。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.259',
    sourceName: 'Anthropic',
  },
  {
    id: 'fable-5-1-mythos-5-1-launch',
    category: 'product',
    publishedAt: '2026-09-01',
    title: {
      en: 'Claude Fable 5.1 and Mythos 5.1 launch with lower cache-read pricing',
      zh: 'Claude Fable 5.1 与 Mythos 5.1 发布，缓存读取降价',
    },
    summary: {
      en: 'Anthropic released Claude Fable 5.1 (`claude-fable-5-1`) and Claude Mythos 5.1 (`claude-mythos-5-1`): 1M context, 128k max output, always-on adaptive thinking, at $10/$50 per MTok with cache reads cut to $0.25/MTok (0.025× input vs 0.1× on other models). Fable 5.1 is GA on the API and cloud partners; Mythos 5.1 stays on trusted-access programs. API changes include no `tool_choice` types `any`/`tool`, stricter thinking-block replay binding for accounts created on or after Aug 31, 2026, and beta per-message effort and turn-scoped system messages. Claude Code 2.1.257 sets Fable 5.1 as the default Fable model.',
      zh: 'Anthropic 发布 Claude Fable 5.1（`claude-fable-5-1`）与 Claude Mythos 5.1（`claude-mythos-5-1`）：1M 上下文、128k 最大输出、始终开启 adaptive thinking，定价 $10/$50 per MTok，缓存读取降至 $0.25/MTok（为输入价的 0.025×，其他模型为 0.1×）。Fable 5.1 在 API 与云伙伴平台 GA；Mythos 5.1 仍限可信访问计划。API 变更包括不支持 `tool_choice` 的 `any`/`tool`、2026-08-31 后新建账号的更严格 thinking block 重放绑定，以及 beta 的逐消息 effort 与 turn-scoped system message。Claude Code 2.1.257 将 Fable 5.1 设为默认 Fable 模型。',
    },
    takeaway: {
      en: 'Agent workloads with heavy cache hits benefit most from Fable 5.1; audit `tool_choice` and multi-turn thinking replay before migrating production pipelines.',
      zh: '缓存命中率高的 Agent 工作负载从 Fable 5.1 获益最大；生产迁移前请检查 `tool_choice` 与多轮 thinking block 重放逻辑。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'model-hardware-standard-preview',
    category: 'product',
    publishedAt: '2026-08-27',
    title: {
      en: 'Model Hardware Standard research preview opens for labs and manufacturers',
      zh: 'Model Hardware Standard 研究预览向实验室与制造商开放',
    },
    summary: {
      en: 'Anthropic opened a research preview of the Model Hardware Standard (MHS), a shared specification for AI agents to operate physical devices such as microscopes, liquid handlers, and robotic arms. MHS is model-agnostic and reachable via MCP, CLI, or code APIs; access is invite-only for scientific research labs and advanced manufacturers ahead of an open-source release. Early partners report faster device integration, quicker experiment iteration, and live fault detection.',
      zh: 'Anthropic 开放 Model Hardware Standard（MHS）研究预览——一套供 AI Agent 操作显微镜、移液工作站、机械臂等物理设备的共享规范。MHS 与模型无关，可通过 MCP、CLI 或代码 API 接入；在开源发布前，仅向科研实验室与先进制造商邀请开放。早期伙伴反馈设备集成更快、实验迭代更敏捷，并支持在线故障检测。',
    },
    takeaway: {
      en: 'MHS is not yet open source; lab and manufacturing teams should apply at modelhardwarestandard.com rather than building ad hoc device drivers.',
      zh: 'MHS 尚未开源；实验室与制造团队应通过 modelhardwarestandard.com 申请接入，而非各自编写临时设备驱动。',
    },
    sourceUrl: 'https://www.anthropic.com/news/model-hardware-standard-research-preview',
    sourceName: 'Anthropic',
  },
  {
    id: 'cowork-built-in-browser-chrome-ga',
    category: 'product',
    publishedAt: '2026-08-26',
    title: {
      en: 'Cowork built-in browser ships; Claude in Chrome reaches GA with autonomous actions',
      zh: 'Cowork 内置浏览器上线；Claude in Chrome GA 并支持自主操作',
    },
    summary: {
      en: 'Claude Cowork on desktop now opens a dedicated side-panel browser for web tasks—no extension required; it rolls out to Pro, Max, and Team on macOS, Windows, and Linux (beta), with Enterprise admins controlling access in Organization settings. Separately, Claude in Chrome is GA on all paid plans: Claude can read pages, navigate, and act autonomously in the user\'s Chrome session, with a safety classifier validating each action. Enterprise Chrome extension defaults flip to enabled on Sep 10, 2026 unless already disabled.',
      zh: 'Claude Cowork 桌面版现可在侧栏打开独立浏览器处理网页任务，无需扩展；向 Pro / Max / Team 逐步推送（macOS / Windows / Linux beta），Enterprise 管理员可在组织设置中管控。同期 Claude in Chrome 向全部付费套餐 GA：Claude 可在用户 Chrome 会话中读取页面、导航并自主操作，安全分类器逐条校验动作。Enterprise 扩展默认将于 2026-09-10 改为开启（若此前未手动关闭）。',
    },
    takeaway: {
      en: 'Pick built-in browser for isolated web handoffs and Claude in Chrome when you need existing logged-in sessions; review org browser policies before Sep 10.',
      zh: '隔离式网页任务用内置浏览器，需复用已登录会话时用 Claude in Chrome；请在 9 月 10 日前确认组织的浏览器策略。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://claude.com/blog/cowork-built-in-browser',
    sourceName: 'Anthropic',
  },
  {
    id: 'sdk-files-skills-ga-and-api-keys',
    category: 'api',
    publishedAt: '2026-08-27',
    title: {
      en: 'Files & Skills SDK paths go GA; personal and service account API keys launch',
      zh: 'Files / Skills SDK 路径转正 GA，个人密钥与服务账号密钥上线',
    },
    summary: {
      en: 'In Python SDK 1.2.0, TypeScript SDK 0.122.0, and matching Go/Java/Ruby/C# releases, `client.beta.files` and `client.beta.skills` no longer send beta headers and mirror `client.files` and `client.skills`. Beta `BetaSkill` is renamed `BetaContainerSkill`, and `client.beta.skills.delete()` now removes a Skill and all its versions. The Claude Console also supports personal keys and service account keys scoped to workspaces or admin endpoints.',
      zh: 'Python SDK 1.2.0、TypeScript SDK 0.122.0 及对应 Go/Java/Ruby/C# 版本中，`client.beta.files` 与 `client.beta.skills` 不再发送 beta 请求头，行为与 `client.files`、`client.skills` 一致。Beta 类型 `BetaSkill` 重命名为 `BetaContainerSkill`，`client.beta.skills.delete()` 会删除 Skill 及其全部版本。Claude Console 同时支持个人密钥与服务账号密钥，可按工作区或管理员端点授权。',
    },
    takeaway: {
      en: 'Remove `files-api-2025-04-14` and `skills-2025-10-02` beta headers from production SDK calls and migrate to the stable client paths.',
      zh: '从生产 SDK 调用中移除 `files-api-2025-04-14` 与 `skills-2025-10-02` beta 头，并迁移至稳定 client 路径。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'compliance-api-ga-admin-api-sdks',
    category: 'api',
    publishedAt: '2026-08-26',
    title: {
      en: 'Compliance API session endpoints exit beta; Admin API arrives in SDKs and ant CLI',
      zh: 'Compliance API 会话端点转正；Admin API 登陆 SDK 与 ant CLI',
    },
    summary: {
      en: 'Cowork and Claude Code Compliance API session endpoints are now GA. Local session endpoints also return Claude Science and Claude for Microsoft 365 transcripts (beta, Enterprise). The Admin API is available in the `ant` CLI and Python, TypeScript, C#, Go, Java, PHP, and Ruby SDKs under `client.beta.organization`, covering members, workspaces, API keys, rate limits, and service accounts.',
      zh: 'Cowork 与 Claude Code 的 Compliance API 会话端点已 GA。本地会话端点亦返回 Claude Science 与 Claude for Microsoft 365 会话记录（beta，Enterprise）。Admin API 已在 `ant` CLI 及 Python、TypeScript、C#、Go、Java、PHP、Ruby SDK 的 `client.beta.organization` 下提供，涵盖成员、工作区、API 密钥、速率限制与服务账号管理。',
    },
    takeaway: {
      en: 'Enterprise admins can automate org governance via SDK Admin API calls instead of curl-only workflows.',
      zh: 'Enterprise 管理员可通过 SDK Admin API 自动化组织治理，无需再依赖纯 curl 流程。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'cowork-memory-editable-topics',
    category: 'product',
    publishedAt: '2026-08-25',
    title: {
      en: 'Claude Cowork memory syncs across chat; topics editable with sensitive-topic controls',
      zh: 'Claude Cowork 记忆跨 Chat 同步，Topics 可编辑并支持敏感主题控制',
    },
    summary: {
      en: 'Memory now works across chat and Cowork in the cloud. All remembered items appear under Topics in Settings > Memory, where users can edit or delete entries. Health- or belief-related topics stay out of memory unless "Include sensitive topics" is enabled. Memory is on by default for Free, Pro, and Max; off by default for Team and Enterprise.',
      zh: '记忆功能现已在 Chat 与云端 Cowork 间同步。所有记忆条目可在 Settings > Memory 的 Topics 中查看、编辑或删除。健康、信仰等敏感主题默认不写入记忆，需开启「Include sensitive topics」才会收录。Free / Pro / Max 默认开启记忆；Team / Enterprise 默认关闭。',
    },
    takeaway: {
      en: 'Review your organization memory defaults before rolling Cowork to Team or Enterprise users.',
      zh: '向 Team / Enterprise 用户推广 Cowork 前，请先确认组织的记忆功能默认策略。',
    },
    sourceUrl: 'https://docs.anthropic.com/en/release-notes/claude-apps',
    sourceName: 'Anthropic Help Center',
  },
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
    takeaway: {
      en: 'Upgrade older pipelines from /v1/complete to /v1/messages before updating the SDK dependency in production.',
      zh: '在生产环境升级 SDK 前，请确保所有旧调用已彻底从 /v1/complete 迁移至 /v1/messages。',
    },
    relatedGuideSlug: 'claude-code-and-api-safety',
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
      en: 'Anthropic graduated four major platform features: computer use (`computer_toolset_20260801`) and browser use (`browser_toolset_20260801`) no longer need beta headers; Files API and Agent Skills (`/v1/skills`) are GA too. All four are available on Fable 5, Mythos 5, Opus 5, Sonnet 5, and Opus 4.8.',
      zh: 'Anthropic 将四项平台能力正式 GA：computer use（`computer_toolset_20260801`）与 browser use（`browser_toolset_20260801`）不再需要 beta header；Files API 与 Agent Skills（`/v1/skills`）亦同步转正。四项能力均已在 Fable 5、Mythos 5、Opus 5、Sonnet 5 与 Opus 4.8 上提供。',
    },
    takeaway: {
      en: 'Beta request headers can now be removed from production workloads invoking computer use and tool capabilities.',
      zh: '在调用 Computer Use 与工具集时，可以从生产代码中安全移除相关的 anthropic-beta 请求头。',
    },
    relatedGuideSlug: 'automation-safety-practices',
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
      en: 'New Claude models embed an invisible SynthID-Text statistical watermark in generated text, applied globally (not EU-only) to meet AI transparency regulations. The mark carries no user or org identifiers and adds no extra tokens; detection and verification tools are now standardized.',
      zh: '新 Claude 模型在生成文本中嵌入不可见的 SynthID-Text 统计水印，全球生效（非仅限欧盟），以符合欧盟 AI 法案第 50 条透明度规范。水印不含用户或组织标识、不增加 token 消耗，常规同义词替换难以破坏其统计特征。',
    },
    takeaway: {
      en: 'Review our watermarking detection guide for techniques on identifying and safely handling generated content.',
      zh: '如需识别和合规处理生成的文本水印，可查阅本站的 AI 内容水印深度指南。',
    },
    relatedGuideSlug: 'claude-ai-content-watermarking',
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
      en: 'Since Aug 14, new Claude Code sessions on Pro, Max, and Team run in auto mode — a background classifier approves routine tool calls instead of prompting every command. Classifier token overhead is no longer charged on these plans; Enterprise and API access remain opt-in.',
      zh: '自 8 月 14 日起，Pro / Max / Team 的新 Claude Code 会话默认进入 auto mode，由后台分类器自动放行常规工具调用而非逐条弹窗确认。上述套餐不再收取分类器 token 开销；Enterprise 与 API 接入仍为 opt-in。',
    },
    takeaway: {
      en: 'Pin `permissions.defaultMode` in `~/.claude/settings.json` if you need manual approval on sensitive repositories.',
      zh: '若在敏感仓库需要人工审批，请在 `~/.claude/settings.json` 中固定 `permissions.defaultMode`。',
    },
    relatedGuideSlug: 'claude-code-and-api-safety',
    sourceUrl: 'https://claude.com/blog/auto-mode-default-in-claude-code',
    sourceName: 'Anthropic',
  },
  {
    id: 'sonnet-5-permanent-pricing',
    category: 'api',
    publishedAt: '2026-08-10',
    title: {
      en: 'Claude Sonnet standard pricing ($2/$10) made permanent',
      zh: 'Claude Sonnet 优惠价 $2/$10 定为永久标准定价',
    },
    summary: {
      en: 'Anthropic cancelled the planned price increase to $3/$15 per million tokens. Sonnet stays at $2 input / $10 output per MTok as the permanent standard API price, offering unbeatable cost-performance for developer workflows.',
      zh: 'Anthropic 取消原定涨价计划。Sonnet API 永久维持 $2 input / $10 output per MTok 的标准价，为高频自动化开发提供极具性价比的基础模型选择。',
    },
    takeaway: {
      en: 'Combine Sonnet with prompt caching to reduce effective input costs down to $0.20 per million tokens on cache hits.',
      zh: '搭配 Prompt Caching，Sonnet 命中缓存时的实际输入成本可低至 $0.20 / MTok。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/pricing',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'skill-plugin-security-scanning',
    category: 'security',
    publishedAt: '2026-08-06',
    title: {
      en: 'Enterprise skill and plugin security scanning enters beta',
      zh: 'Enterprise 技能与插件安全扫描（beta）上线',
    },
    summary: {
      en: 'Enterprise plans can enable skill and plugin security scanning to automatically check third-party skills and plugins for malicious content when someone uploads or edits them.',
      zh: 'Enterprise 套餐可开启技能与插件安全扫描，在用户上传或编辑第三方 Skill / Plugin 时自动检测恶意内容。',
    },
    takeaway: {
      en: 'Enable scanning in org settings before allowing members to install community skills in production workspaces.',
      zh: '在允许成员安装社区 Skill 前，先在组织设置中启用扫描策略。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://docs.anthropic.com/en/release-notes/claude-apps',
    sourceName: 'Anthropic Help Center',
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
    takeaway: {
      en: 'Educational biology questions no longer suffer artificial performance throttling or unexpected model switching.',
      zh: '常规生物医学学习与问答不再容易触发异常降级，保障了学术研究的连贯性。',
    },
    relatedGuideSlug: 'claude-steganography-and-risk-model',
    sourceUrl: 'https://www.anthropic.com/news/improving-fable-5-s-biology-safeguards',
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
    takeaway: {
      en: 'Check your API configuration files and update hardcoded model strings to prevent runtime 400 errors.',
      zh: '请检查工程配置文件，及时替换硬编码的旧模型名称，避免运行时 400 报错。',
    },
    relatedGuideSlug: 'troubleshooting-guide',
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/model-deprecations',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-opus-5-launch',
    category: 'product',
    publishedAt: '2026-07-24',
    title: {
      en: 'Anthropic releases Claude Opus 5 as default on Pro and Max',
      zh: 'Anthropic 发布 Claude Opus 5，成为 Pro 与 Max 默认模型',
    },
    summary: {
      en: 'Claude Opus 5 (`claude-opus-5`) delivers near-Fable 5 intelligence at half the price, with 1M context, 128k max output, and adaptive thinking on by default. It is the default on Claude Max and the strongest model on Pro, priced at $5/$25 per MTok. Beta features include mid-conversation tool changes and automatic API fallbacks for safety-classifier refusals.',
      zh: 'Claude Opus 5（`claude-opus-5`）以约为 Fable 5 一半的价格提供接近前沿的智能，具备 1M 上下文、128k 最大输出，并默认开启 adaptive thinking。其为 Claude Max 默认模型、Pro 最强模型，定价 $5/$25 per MTok。Beta 功能包括对话中途切换工具集，以及安全分类器拒答时的 API 自动 fallback。',
    },
    takeaway: {
      en: 'Enable `fallbacks` with `"default"` mode (beta) so flagged Opus 5 requests route to another model instead of hard-blocking.',
      zh: '可启用 `fallbacks` 的 `"default"` 模式（beta），使被标记的 Opus 5 请求自动路由至备用模型而非硬阻断。',
    },
    relatedGuideSlug: 'domestic-and-open-source-alternatives',
    sourceUrl: 'https://www.anthropic.com/news/claude-opus-5',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-sonnet-5-launch',
    category: 'product',
    publishedAt: '2026-06-30',
    title: {
      en: 'Anthropic launches Claude Sonnet 5 with adaptive thinking and 1M context',
      zh: 'Anthropic 发布 Claude Sonnet 5（默认自适应思考，1M 上下文）',
    },
    summary: {
      en: 'Claude Sonnet 5 (`claude-sonnet-5`) is a drop-in upgrade over Sonnet 4.6 with 1M-token context, 128k max output, and adaptive thinking on by default. Manual extended thinking and non-default `temperature`/`top_p`/`top_k` now return 400 errors. A new tokenizer produces ~30% more tokens for the same text. Launch pricing was $2/$10 per MTok, later made permanent on Aug 10.',
      zh: 'Claude Sonnet 5（`claude-sonnet-5`）是 Sonnet 4.6 的直接升级，支持 1M 上下文、128k 最大输出，并默认开启 adaptive thinking。手动 extended thinking 与非默认 `temperature`/`top_p`/`top_k` 现返回 400 错误。新 tokenizer 对相同文本约多计 30% token。首发定价 $2/$10 per MTok，8 月 10 日定为永久标准价。',
    },
    takeaway: {
      en: 'Remove `thinking: {type: "enabled"}` and sampling params when migrating from Sonnet 4.6; use the `effort` parameter instead.',
      zh: '从 Sonnet 4.6 迁移时移除 `thinking: {type: "enabled"}` 与采样参数，改用 `effort` 控制推理深度。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://www.anthropic.com/news/claude-sonnet-5',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-fable-5-mythos-5-launch',
    category: 'product',
    publishedAt: '2026-06-09',
    title: {
      en: 'Anthropic launches Claude Fable 5 and restricted Claude Mythos 5',
      zh: 'Anthropic 发布 Claude Fable 5 与受限版 Claude Mythos 5',
    },
    summary: {
      en: 'Claude Fable 5 (`claude-fable-5`) is Anthropic\'s most capable widely released model with 1M context, always-on adaptive thinking, and safety classifiers that can return `stop_reason: "refusal"`. Claude Mythos 5 shares the same base model with lifted safeguards for Project Glasswing partners. Access was briefly suspended June 12–July 1 due to export controls before global redeployment.',
      zh: 'Claude Fable 5（`claude-fable-5`）是 Anthropic 目前面向公众的最强模型，具备 1M 上下文、始终开启的 adaptive thinking，以及可能返回 `stop_reason: "refusal"` 的安全分类器。Claude Mythos 5 为同一基座、面向 Project Glasswing 伙伴放宽部分护栏的版本。6 月 12 日至 7 月 1 日曾因出口管制短暂停服，随后全球恢复。',
    },
    takeaway: {
      en: 'Use the opt-in `fallbacks` parameter (beta) to route refused Fable 5 requests to another model instead of hard-blocking.',
      zh: '可通过 opt-in 的 `fallbacks` 参数（beta）将被拒 Fable 5 请求路由至备用模型，避免硬阻断。',
    },
    relatedGuideSlug: 'claude-steganography-and-risk-model',
    sourceUrl: 'https://www.anthropic.com/news/claude-fable-5-mythos-5',
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
