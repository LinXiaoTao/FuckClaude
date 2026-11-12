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
    id: 'fable-52-overload-incident-nov-2026',
    category: 'product',
    publishedAt: '2026-11-10',
    title: {
      en: 'Claude API reports ~4 minutes of overload errors on Fable 5.2 and Mythos 5.2',
      zh: 'Claude API：Fable 5.2 与 Mythos 5.2 出现约 4 分钟过载错误',
    },
    summary: {
      en: 'On November 10, 2026, Anthropic\'s status page logged an incident of elevated errors on Claude Fable 5.2 and Claude Mythos 5.2. The update describes overloaded errors lasting about four minutes on the Claude API; Anthropic marked the incident resolved after mitigation. Separate incidents on November 8 concerned degraded performance on Claude Fable 5.1 across claude.ai, the API, Claude Code, and Cowork.',
      zh: '2026 年 11 月 10 日，Anthropic 状态页记录 Claude Fable 5.2 与 Claude Mythos 5.2 的错误率升高。官方更新称 Claude API 上出现约四分钟的过载（overloaded）错误，缓解后事件已标记为已解决。11 月 8 日另一起事件涉及 Claude Fable 5.1 在 claude.ai、API、Claude Code 与 Cowork 上的性能下降。',
    },
    takeaway: {
      en: 'Build retries and model fallbacks for Fable-tier production traffic; launch-week overloads can be brief but hit all platforms at once.',
      zh: 'Fable 级生产流量请配置重试与模型 fallback；发布周短暂过载可能同时影响各接入面。',
    },
    relatedGuideSlug: 'troubleshooting-guide',
    sourceUrl: 'https://status.claude.com/incidents/pgz8r13pk4sm',
    sourceName: 'Claude Status',
  },
  {
    id: 'claude-code-2-1-321-fable-52-default',
    category: 'product',
    publishedAt: '2026-11-09',
    title: {
      en: 'Claude Code 2.1.321 sets Claude Fable 5.2 as the default Fable model',
      zh: 'Claude Code 2.1.321 将 Claude Fable 5.2 设为默认 Fable 模型',
    },
    summary: {
      en: 'Claude Code 2.1.321 adds Claude Fable 5.2 (`claude-fable-5-2`) as the default Fable model, with 1M context and pricing at $8 / $40 per MTok plus $0.20 / MTok cache reads. The release also hardens sandbox and permission checks: deny rules and protected-file prompts apply to files written by `cp` or `mv`, some read-only Bash commands no longer skip prompts, and MCP OAuth no longer sends refresh tokens to unintended hosts after redirects. Remote-control sessions can load a settings file via `--settings`.',
      zh: 'Claude Code 2.1.321 将 Claude Fable 5.2（`claude-fable-5-2`）设为默认 Fable 模型，支持 1M 上下文，定价 $8 / $40 per MTok，缓存读取 $0.20 / MTok。该版本还加强沙箱与权限：`cp` / `mv` 写入的文件受 deny 规则与受保护文件提示约束；部分只读 Bash 不再跳过确认；MCP OAuth 重定向后不再把 refresh token 发往错误主机。`claude remote-control` 可用 `--settings` 为所启会话加载设置文件。',
    },
    takeaway: {
      en: 'After upgrading past 2.1.321, expect Fable-tier defaults and re-test auto mode and Bash allowlists around copy/move workflows.',
      zh: '升级到 2.1.321 后默认模型会切到 Fable 5.2，请重新验证 auto mode 以及涉及复制/移动的 Bash 放行规则。',
    },
    relatedGuideSlug: 'claude-code-and-api-safety',
    sourceUrl: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.321',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-fable-mythos-5-2-launch',
    category: 'product',
    publishedAt: '2026-11-09',
    title: {
      en: 'Claude Fable 5.2 and Mythos 5.2 launch at $8/$40 with optional fast mode',
      zh: 'Claude Fable 5.2 与 Mythos 5.2 发布，定价 $8/$40，可选 fast mode',
    },
    summary: {
      en: 'Anthropic released Claude Fable 5.2 (`claude-fable-5-2`) and Claude Mythos 5.2 (`claude-mythos-5-2`) on November 9, 2026. Both models share the same weights: Fable is generally available while Mythos is limited to verified Cyber and Life Sciences Verification Program members. Input and output pricing drops to $8 / $40 per MTok from $10 / $50 on Fable 5.1, with Fable 5.2 cache reads at $0.20 / MTok. Fast mode (`speed: "fast"`) offers up to 2.5× output speed at $16 / $80 per MTok. On the API, both enforce prefix checks on every account for preserved thinking, require `computer_toolset_20260801`, reject `computer_20251124` except on Amazon Bedrock, and bind thinking blocks to the producing account.',
      zh: 'Anthropic 于 2026 年 11 月 9 日发布 Claude Fable 5.2（`claude-fable-5-2`）与 Claude Mythos 5.2（`claude-mythos-5-2`），二者为同一权重：Fable 面向公众，Mythos 限已通过 Cyber 与 Life Sciences Verification Program 审核的组织。输入/输出定价由 Fable 5.1 的 $10 / $50 per MTok 降至 $8 / $40，Fable 5.2 缓存读取为 $0.20 / MTok。fast mode（`speed: "fast"`）可将输出提速最高约 2.5 倍，定价 $16 / $80 per MTok。API 上二者对所有账号强制执行前缀校验（preserved thinking），需使用 `computer_toolset_20260801`，除 Amazon Bedrock 外拒绝 `computer_20251124`，thinking block 与生成账号绑定。',
    },
    takeaway: {
      en: 'Audit prefix edits and computer-use tool IDs before pointing agent pipelines at Fable 5.2; Mythos 5.2 still needs program verification, not a model alias swap.',
      zh: 'Agent 流水线切到 Fable 5.2 前请检查前缀篡改与 computer use 工具 ID；Mythos 5.2 仍需验证计划准入，不能仅靠改 model 别名。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://www.anthropic.com/claude-fable-and-mythos-5-2',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-code-2-1-319-auto-mode-gateway',
    category: 'security',
    publishedAt: '2026-11-06',
    title: {
      en: 'Claude Code 2.1.319 tightens auto mode behind LLM gateways and adds `denyInsteadOfPrompting`',
      zh: 'Claude Code 2.1.319：网关后加强 auto mode，新增 `denyInsteadOfPrompting`',
    },
    summary: {
      en: 'Claude Code 2.1.319 changes auto mode when telemetry or feature flags are off, including behind custom LLM gateways: tool calls the server cannot evaluate are now denied or prompted manually, with no fallback to the built-in classifier unless `CLAUDE_CODE_AUTO_MODE_SERVER=0`. Behind a gateway, `CLAUDE_CODE_AUTO_MODE_SERVER=1` enables server-side checks even when `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` is set. The release adds `permissions.denyInsteadOfPrompting` to deny calls that would block on a permission prompt and continue the turn, adds background handling for MCP task tools, and warns when a session falls back to `ant auth login` billing after a claude.ai login expires.',
      zh: 'Claude Code 2.1.319 在关闭 telemetry 或 feature flags、尤其是位于自定义 LLM 网关之后时，调整 auto mode：服务端无法评估的工具调用会被拒绝或改用手动确认，不再回退到内置分类器，除非设置 `CLAUDE_CODE_AUTO_MODE_SERVER=0`。在网关后，`CLAUDE_CODE_AUTO_MODE_SERVER=1` 即使在 `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` 开启时也会启用服务端检查。该版本新增 `permissions.denyInsteadOfPrompting`（本可弹窗确认的调用直接拒绝并继续对话），支持将 MCP task 工具放入后台执行，并在 claude.ai 登录过期回退到 `ant auth login` 计费时给出警告。',
    },
    takeaway: {
      en: 'Gateway deployments must expose auto-mode checks or expect more denials after 2.1.319; document whether Console org billing replaces claude.ai login on shared runners.',
      zh: '网关部署需打通 auto mode 服务端评估，否则 2.1.319 起拒答会增多；共享 runner 上应明确 Console 组织计费是否取代 claude.ai 登录。',
    },
    relatedGuideSlug: 'claude-code-and-api-safety',
    sourceUrl: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.319',
    sourceName: 'Anthropic',
  },
  {
    id: 'console-ip-allowlist-nov-2026',
    category: 'security',
    publishedAt: '2026-11-05',
    title: {
      en: 'Claude Console beta adds organization IP allowlists for API keys',
      zh: 'Claude Console beta 支持组织级 API IP 允许列表',
    },
    summary: {
      en: 'Anthropic added an organization IP allowlist in the Claude Console, in beta. Requests to covered services from addresses outside the list are refused, limiting where a leaked API key can be used. Organizations can add IPv4 and IPv6 addresses or CIDR ranges, up to 1,000 entries per organization.',
      zh: 'Anthropic 在 Claude Console 以 beta 形式推出组织 IP 允许列表。名单外地址对受覆盖服务的请求将被拒绝，从而限制泄露 API 密钥的可滥用范围。组织可添加 IPv4、IPv6 或 CIDR，每个组织最多 1,000 条。',
    },
    takeaway: {
      en: 'Pair IP allowlists with workspace-scoped keys so a stolen laptop key cannot call the API from arbitrary egress.',
      zh: '将 IP 允许列表与工作区范围密钥配合使用，避免笔记本泄露的密钥在任意出口调用 API。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'messages-api-message-threads-beta',
    category: 'api',
    publishedAt: '2026-11-02',
    title: {
      en: 'Message threads beta stores conversation server-side for smaller follow-up requests',
      zh: 'Messages API message threads beta：服务端存会话以缩小后续请求',
    },
    summary: {
      en: 'With the `message-threads-2026-08-12` beta header, long Messages API conversations can use message threads: the API keeps the conversation on the server so each later request sends only new messages, improving time to first token. A thread expires five minutes after its last request and is deleted within about one hour of last use. Message threads are available on the Claude API, Claude Platform on AWS, Claude Models on Google Cloud (Anthropic managed), and Claude in Microsoft Foundry.',
      zh: '在 `message-threads-2026-08-12` beta 头下，长 Messages API 对话可使用 message threads：API 在服务端保留会话，后续请求仅发送新消息，缩短首 token 延迟。线程在最后一次请求后 5 分钟过期，并在末次使用后约 1 小时内删除。适用于 Claude API、Claude Platform on AWS、Claude Models on Google Cloud（Anthropic 托管）与 Claude in Microsoft Foundry。',
    },
    takeaway: {
      en: 'Prefer official threads over hand-rolled context pruning, but plan for five-minute idle expiry in long-pause agent loops.',
      zh: '长 Agent 优先用官方 thread，勿手写裁剪上下文；注意停顿超过 5 分钟会触发线程过期。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-code-2-1-314-writes-outside-wd',
    category: 'security',
    publishedAt: '2026-10-30',
    title: {
      en: 'Claude Code 2.1.314 can block writes outside working directories in every permission mode',
      zh: 'Claude Code 2.1.314：`blockWritesOutsideWorkingDirectories` 各模式均生效',
    },
    summary: {
      en: 'Claude Code 2.1.314 adds `permissions.blockWritesOutsideWorkingDirectories`: Write, Edit, and NotebookEdit refuse paths outside the session working directories in every permission mode, including auto mode and bypass. The release also warns when managed remote settings cannot refresh, fixes sandbox coverage for resumed worktrees, and improves gateway failover when Bedrock guardrails or Vertex token endpoints stall.',
      zh: 'Claude Code 2.1.314 新增 `permissions.blockWritesOutsideWorkingDirectories`：Write、Edit、NotebookEdit 在包括 auto mode 与 bypass 在内的所有权限模式下，拒绝写入工作目录之外的路径。该版本还在托管远程设置无法刷新时告警，修复 resume 后 worktree 未进沙箱的问题，并改进 Bedrock 护栏或 Vertex token 端点卡住时的网关故障转移。',
    },
    takeaway: {
      en: 'Enable `blockWritesOutsideWorkingDirectories` on shared CI runners before relying on path-based allowlists alone.',
      zh: '共享 CI runner 在仅靠路径 allowlist 之前，建议开启 `blockWritesOutsideWorkingDirectories`。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.314',
    sourceName: 'Anthropic',
  },
  {
    id: 'opus-4-8-fast-mode-deprecation-nov-2026',
    category: 'api',
    publishedAt: '2026-10-30',
    title: {
      en: 'Fast mode on Claude Opus 4.8 deprecated; removed November 30, 2026',
      zh: 'Claude Opus 4.8 fast mode 弃用，2026-11-30 移除',
    },
    summary: {
      en: 'Anthropic deprecated fast mode for Claude Opus 4.8 (`claude-opus-4-8`), with removal scheduled for November 30, 2026. After removal, requests that set `speed: "fast"` on that model ID return an error. Anthropic recommends migrating fast workloads to Claude Opus 5.5, where fast mode is generally available without the prior research-preview beta header.',
      zh: 'Anthropic 弃用 Claude Opus 4.8（`claude-opus-4-8`）的 fast mode，计划 2026 年 11 月 30 日移除。移除后对该 model ID 设置 `speed: "fast"` 的请求将报错。官方建议将 fast 工作负载迁移至 Claude Opus 5.5，其 fast mode 已普遍可用且无需原先的 research preview beta 头。',
    },
    takeaway: {
      en: 'Search configs for `claude-opus-4-8` plus `speed: "fast"` before the November 30 cutoff.',
      zh: '请在 11 月 30 日前检索配置中是否仍有 `claude-opus-4-8` 搭配 `speed: "fast"`。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'usage-cost-analytics-api-oct-2026',
    category: 'api',
    publishedAt: '2026-10-29',
    title: {
      en: 'Usage and Cost Analytics API beta replaces legacy usage report endpoints',
      zh: 'Usage and Cost Analytics API beta 上线，旧用量报表端点标记为 legacy',
    },
    summary: {
      en: 'Anthropic launched the Usage and Cost Analytics API in beta with the `analytics-usage-cost-2026-08-24` header. Its `/v1/organizations/analytics/usage` and `/v1/organizations/analytics/cost` endpoints report token usage and cost for Claude Console and Claude Enterprise organizations, with filters by model, workspace, API key, and requesting user or service account. The older Usage and Cost API and the Claude Enterprise `usage_report` / `cost_report` endpoints are now legacy but remain supported.',
      zh: 'Anthropic 以 `analytics-usage-cost-2026-08-24` beta 头发布 Usage and Cost Analytics API。`/v1/organizations/analytics/usage` 与 `/v1/organizations/analytics/cost` 可为 Claude Console 与 Claude Enterprise 组织报告 token 用量与费用，支持按模型、工作区、API 密钥及请求用户或服务账号筛选。原 Usage and Cost API 与 Claude Enterprise 的 `usage_report` / `cost_report` 端点现列为 legacy，但仍受支持。',
    },
    takeaway: {
      en: 'Migrate dashboards to the analytics endpoints before legacy paths lose future features.',
      zh: '请在旧端点停止新增能力前，将看板迁移至 analytics 端点。',
    },
    relatedGuideSlug: 'multi-account-management',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'sdk-ant-2026-10-21-breaking',
    category: 'api',
    publishedAt: '2026-10-21',
    title: {
      en: 'SDK 2.0 and `ant` CLI 2.0 default to API version `2026-10-21` with breaking changes',
      zh: 'SDK 2.0 与 ant CLI 2.0 默认 API 版本 `2026-10-21`，含破坏性变更',
    },
    summary: {
      en: 'Anthropic released API version `2026-10-21` and new major SDK and CLI releases that send it by default: Python SDK 2.0.0, TypeScript SDK 1.0.0, C# SDK 13.0.0, Go SDK 2.0.0, Java SDK 3.0.0, PHP SDK 1.0.0, Ruby SDK 2.0.0, and `ant` CLI 2.0.0. These versions also include SDK- and CLI-specific breaking changes independent of the API version, and they are licensed under Apache 2.0 instead of MIT. Migration guides are published under Switch to 2026-10-21.',
      zh: 'Anthropic 发布 API 版本 `2026-10-21`，以及默认发送该版本的新版 SDK 与 CLI：Python SDK 2.0.0、TypeScript SDK 1.0.0、C# SDK 13.0.0、Go SDK 2.0.0、Java SDK 3.0.0、PHP SDK 1.0.0、Ruby SDK 2.0.0 与 `ant` CLI 2.0.0。这些版本还包含与 API 版本无关的破坏性变更，许可证由 MIT 改为 Apache 2.0。迁移说明见 Switch to 2026-10-21。',
    },
    takeaway: {
      en: 'Pin SDK major versions in CI until you have run the 2026-10-21 migration guide against production request shapes.',
      zh: '在按 2026-10-21 迁移指南验证生产请求形态前，请在 CI 中锁定 SDK 主版本。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'api-user-profiles-enforcement-oct-2026',
    category: 'security',
    publishedAt: '2026-10-21',
    title: {
      en: 'User profiles and `enforcement_status` let platforms scope API bans to end customers',
      zh: 'User profiles 与 `enforcement_status` 可将 API 封禁限定到终端客户',
    },
    summary: {
      en: 'Anthropic launched user profiles so API platforms and resellers can tag which end customer each request serves. Profile responses now include `enforcement_status` and `enforcement_actions`, and list endpoints accept an `enforcement_status[]` filter. Beta organization webhooks (`webhooks-2026-10-07`) can notify admins when Anthropic restricts or lifts a ban on a profile. Console admins can also disable organization-wide web fetch or set domain allow/block lists on the Capabilities page.',
      zh: 'Anthropic 上线 user profiles，供 API 平台与经销商标记每条请求对应的终端客户。Profile 响应新增 `enforcement_status` 与 `enforcement_actions`，列表接口支持 `enforcement_status[]` 筛选。Beta 组织 webhook（`webhooks-2026-10-07`）可在某 profile 被限制或解封时通知管理员。Console 管理员还可在 Capabilities 页面关闭组织级 web fetch 或设置域名允许/阻止列表。',
    },
    takeaway: {
      en: 'Multi-tenant gateways should send a stable profile ID per customer before one customer\'s violation disables the whole organization.',
      zh: '多租户网关应为每位客户发送稳定的 profile ID，避免单客户违规牵连整个组织。',
    },
    relatedGuideSlug: 'multi-account-management',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'distillation-defenses-oct-2026',
    category: 'security',
    publishedAt: '2026-10-12',
    title: {
      en: 'Anthropic reports 90–99% less distillation harvesting after new classifiers',
      zh: 'Anthropic：新分类器后蒸馏抓取数据量约减少 90%–99%',
    },
    summary: {
      en: 'On October 12, 2026, Anthropic described expanded anti-distillation defenses, combining preserved thinking limits, model-to-model thinking portability rules, and a two-stage classifier trained on distiller transcripts. Anthropic says reasoning tokens extracted on its platform fell to between one-tenth and one-hundredth of prior levels and that harvested data dropped roughly 90% to 99%, with a claimed false-positive rate under 0.1%. The post also says tens of thousands of distillation-linked accounts were banned, often within about two hours of campaign start.',
      zh: '2026 年 10 月 12 日，Anthropic 介绍扩大的反蒸馏防护，结合 preserved thinking 限制、模型间 thinking 可移植性规则，以及基于蒸馏者会话训练的双阶段分类器。官方称平台上被提取的 reasoning token 降至此前的约十分之一至百分之一，被抓取的数据总量约减少 90%–99%，并声称误报率低于 0.1%。文章还表示数以万计与蒸馏相关的账号被封，许多在 campaign 开始后约两小时内处置。',
    },
    takeaway: {
      en: 'High-volume capability-probing from one org now looks like distillation, not a pricing bug; expect fast profile- or org-level enforcement.',
      zh: '单组织高频能力探测更像蒸馏而非计费异常；请预期 profile 或组织级快速处置。',
    },
    relatedGuideSlug: 'claude-steganography-and-risk-model',
    sourceUrl: 'https://www.anthropic.com/news/distillation-defenses',
    sourceName: 'Anthropic',
  },
  {
    id: 'supported-regions-policy-effective-nov-2026',
    category: 'policy',
    publishedAt: '2026-11-12',
    title: {
      en: 'Supported Regions Policy effective Nov 12; Vietnam, Nigeria, and others now listed',
      zh: '支持地区政策 11 月 12 日生效；越南、尼日利亚等已列入名单',
    },
    summary: {
      en: 'Anthropic\'s Supported Regions Policy page shows an effective date of November 12, 2026. The list now includes many countries that were not highlighted on this site before, including Vietnam, Nigeria, Ethiopia, Sudan, Libya, Iraq, Palestine, and Turkmenistan. The policy still excludes any country not named, and it forbids use while physically located in unsupported regions, use by entities incorporated or headquartered in unsupported regions, and use by majority-owned entities tied to unsupported regions. Mainland China, Hong Kong, and Macau remain absent from the list; Taiwan, Singapore, Japan, and India remain present.',
      zh: 'Anthropic「支持地区」政策页显示生效日期为 2026 年 11 月 12 日。名单现包含本站此前未单独强调的多国，例如越南、尼日利亚、埃塞俄比亚、苏丹、利比亚、伊拉克、巴勒斯坦与土库曼斯坦。未列出的国家/地区仍不支持；政策仍禁止在不受支持地区物理所在地使用、由在不受支持地区注册或总部实体及其人员使用，以及由不受支持地区多数控股实体使用。中国大陆、香港、澳门仍不在名单内；台湾、新加坡、日本、印度仍在名单内。',
    },
    takeaway: {
      en: 'Eligibility follows incorporation, residency, and ownership—not only whether a country appears on the expanded list.',
      zh: '合规取决于注册地、物理所在地与股权结构，不能仅因某国新列入名单就认定可用。',
    },
    relatedGuideSlug: 'regional-access-strategy',
    sourceUrl: 'https://www.anthropic.com/supported-countries',
    sourceName: 'Anthropic',
  },
  {
    id: 'usage-policy-2026-effective-nov-12',
    category: 'policy',
    publishedAt: '2026-10-08',
    title: {
      en: '2026 Usage Policy refresh takes effect November 12',
      zh: '2026 版使用政策将于 11 月 12 日生效',
    },
    summary: {
      en: 'Anthropic published an updated Usage Policy on October 8, 2026, effective November 12, 2026. Changes consolidate rules on deceptive campaigns and fake-account influence operations, refocus election restrictions on voter deception and turnout disruption, clarify weapons software and autonomous hardware operator requirements, tighten surveillance and law-enforcement prohibitions, restate high-risk human-in-the-loop duties, and ban sustained abusive behavior toward models. The post also clarifies how the Supported Regions Policy is enforced across physical location, incorporation, and majority ownership.',
      zh: 'Anthropic 于 2026 年 10 月 8 日发布新版使用政策，2026 年 11 月 12 日生效。变更包括：合并欺骗性宣传活动与假账号影响操作规则；选举条款聚焦欺骗选民与破坏投票；澄清武器相关软件与自主硬件操作者要求；收紧监控与执法用途禁止；重申高风险场景人工复核义务；禁止对模型持续辱骂。文章亦说明支持地区政策如何按物理位置、注册地与多数股权执行。',
    },
    takeaway: {
      en: 'Review automated publishing, civic, and hardware-control workflows before November 12; several clarified rules already matched Anthropic enforcement practice.',
      zh: '请在 11 月 12 日前审查自动发稿、公民科技与硬件控制流程；多项澄清与既有执法口径一致。',
    },
    relatedGuideSlug: 'account-appeal-and-recovery-sop',
    sourceUrl: 'https://www.anthropic.com/news/2026-usage-policy-update',
    sourceName: 'Anthropic',
  },
  {
    id: 'managed-agents-dynamic-workflows-oct-2026',
    category: 'api',
    publishedAt: '2026-10-09',
    title: {
      en: 'Claude Managed Agents beta adds dynamic multi-agent workflow runs',
      zh: 'Claude Managed Agents beta 支持动态多 Agent workflow 运行',
    },
    summary: {
      en: 'With the `managed-agents-2026-04-01` beta header, Managed Agents can run dynamic workflows: for large jobs such as reviewing hundreds of documents, an agent can author a workflow program that the server executes as a background workflow run with phased agents. Enable it with `multiagent: {"type": "multiagent_20261001", "workflows": {"type": "enabled"}}` and follow `workflow_run.*` events on the session stream.',
      zh: '在 `managed-agents-2026-04-01` beta 头下，Managed Agents 可运行动态 workflow：面对例如审阅数百份文档的大任务，Agent 可编写 workflow 程序，由服务端作为后台 workflow run 分阶段执行多 Agent。通过 `multiagent: {"type": "multiagent_20261001", "workflows": {"type": "enabled"}}` 启用，并在会话事件流中跟踪 `workflow_run.*`。',
    },
    takeaway: {
      en: 'Treat workflow runs like untrusted code paths: scope permissions and hosts before enabling `workflows.type: "enabled"`.',
      zh: '将 workflow run 视为不可信代码路径，启用 `workflows.type: "enabled"` 前先收紧权限与网络主机范围。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-code-2-1-294-permission-fixes',
    category: 'product',
    publishedAt: '2026-10-08',
    title: {
      en: 'Claude Code 2.1.292–2.1.294: permission and sandbox fixes, stdio MCP protocol negotiation, prompt-hook fix',
      zh: 'Claude Code 2.1.292–2.1.294：权限与沙箱修复、stdio MCP 协议协商、prompt hook 修复',
    },
    summary: {
      en: 'Claude Code 2.1.292 fixes several permission bypasses: PreToolUse hook approvals and auto mode skipped the permission prompt for file reads from network (UNC) paths, sandboxed commands could read the staged copies of `/ultrareview` uploads, and a tampered on-disk cache of server-managed settings could switch off the built-in policy plugin while the settings fetch failed. It also makes local (stdio) MCP servers negotiate protocol version 2026-07-28 by default on every install, including Bedrock, Vertex, and Foundry; set `MCP_PROTOCOL_NEGOTIATION=legacy` to opt out. Version 2.1.293 sets Claude Haiku 5.5 as the default Haiku model. Version 2.1.294 fixes `prompt` and `agent` hooks written as instructions (for example "Block commands that…") so they block what they should, and improves how Stop and SubagentStop prompt hooks are judged.',
      zh: 'Claude Code 2.1.292 修复多处权限绕过：PreToolUse hook 的批准与 auto mode 会跳过网络（UNC）路径文件读取的权限确认；沙箱内命令可读取 `/ultrareview` 上传的暂存副本；服务端托管设置在拉取失败时，被篡改的本地缓存可关闭内置策略插件。该版本还让本地（stdio）MCP 服务器在所有安装环境（含 Bedrock、Vertex、Foundry）默认协商 2026-07-28 协议版本，可用 `MCP_PROTOCOL_NEGOTIATION=legacy` 退回旧行为。2.1.293 将 Claude Haiku 5.5 设为默认 Haiku 模型。2.1.294 修复以指令形式书写的 `prompt` 与 `agent` hook（如「Block commands that…」）未能拦截目标命令的问题，并改进 Stop 与 SubagentStop prompt hook 的判定。',
    },
    takeaway: {
      en: 'If you rely on `prompt` or `agent` hooks to block commands, upgrade to 2.1.294 and re-test them; earlier versions could let blocked commands through when the hook was phrased as an instruction.',
      zh: '若依赖 `prompt` 或 `agent` hook 拦截命令，请升级到 2.1.294 并重新验证；旧版本在 hook 以指令形式书写时可能放行本应拦截的命令。',
    },
    relatedGuideSlug: 'claude-code-and-api-safety',
    sourceUrl: 'https://code.claude.com/docs/en/changelog',
    sourceName: 'Anthropic',
  },
  {
    id: 'claude-haiku-5-5-launch',
    category: 'product',
    publishedAt: '2026-10-07',
    title: {
      en: 'Claude Haiku 5.5 launches at $0.10/$0.50; Sonnet 5.5 cache reads cut to $0.10; Max and Team get monthly API credits',
      zh: 'Claude Haiku 5.5 发布，定价 $0.10/$0.50；Sonnet 5.5 缓存读取降至 $0.10；Max 与 Team 新增每月 API 额度',
    },
    summary: {
      en: 'Anthropic released Claude Haiku 5.5 (`claude-haiku-5-5`): 1M context, 128k max output, adaptive thinking with an `effort` parameter, and $0.10 input / $0.50 output per MTok for prompts up to 100k tokens ($0.50 / $2.50 above 100k). Anthropic says it costs about 75% less than Haiku 4.5 on average and targets subagents, summarization, compaction, and browser use; Sonnet 5.5 and Opus 5.5 remain the recommended models for complex agentic coding. Code written for Haiku 4.5 can break: manual extended thinking (`budget_tokens`) returns a 400 error, adaptive thinking is on by default, and a new tokenizer counts more tokens for the same text. The same day, Sonnet 5.5 cache reads dropped from $0.20 to $0.10 per MTok, and Claude Max (5x: $100, 20x: $200 per month) and Team (up to $500 per month, pooled) began receiving monthly Claude Platform API credits. The Python and TypeScript SDKs also add beta classes for the browser use and computer use tools.',
      zh: 'Anthropic 发布 Claude Haiku 5.5（`claude-haiku-5-5`）：1M 上下文、128k 最大输出，支持带 `effort` 参数的 adaptive thinking；100k token 以内的 prompt 定价 $0.10 输入 / $0.50 输出 per MTok，超过 100k 为 $0.50 / $2.50。官方称其平均成本比 Haiku 4.5 低约 75%，面向 subagent、摘要、compaction 与 browser use；复杂 agentic 编程仍推荐 Sonnet 5.5 与 Opus 5.5。为 Haiku 4.5 编写的代码可能失效：手动 extended thinking（`budget_tokens`）返回 400，adaptive thinking 默认开启，新 tokenizer 对相同文本计更多 token。同日，Sonnet 5.5 缓存读取由 $0.20 降至 $0.10 per MTok；Claude Max（5x 每月 $100，20x 每月 $200）与 Team（每月最高 $500，团队共享）开始发放每月 Claude Platform API 额度。Python 与 TypeScript SDK 同时新增 browser use 与 computer use 工具的 beta 类。',
    },
    takeaway: {
      en: 'Move cheap subagent and summarization calls to Haiku 5.5 only after removing `budget_tokens` and re-checking token counts under the new tokenizer. Max and Team admins can claim the API credits following the Help Center article.',
      zh: '将低成本 subagent 与摘要调用迁到 Haiku 5.5 前，先移除 `budget_tokens`，并按新 tokenizer 重新估算 token 用量。Max 与 Team 管理员可按帮助中心文章领取 API 额度。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://www.anthropic.com/claude-haiku-5-5',
    sourceName: 'Anthropic',
  },
  {
    id: 'managed-agents-web-fetch-prior-context-oct-2026',
    category: 'security',
    publishedAt: '2026-10-07',
    title: {
      en: 'Managed Agents `web_fetch` now fetches only URLs already seen in the session',
      zh: 'Managed Agents 的 `web_fetch` 现仅抓取会话中已出现过的 URL',
    },
    summary: {
      en: 'To reduce data-exfiltration risk, `web_fetch` in Claude Managed Agents fetches only URLs that already appeared in the session: in a user message, in a `web_search` result, or in a page fetched earlier. A URL that appears only in Claude\'s own output, the system prompt, an attached document, or tool output such as `bash`, `read`, or an MCP tool returns a `url_not_in_prior_context` error. Separately, in cloud environments with `limited` networking, `allowed_hosts` now also applies to `web_search` and `web_fetch`. Creating or updating a session fails with a 400 error when an enabled web tool\'s `allowed_domains` has an entry outside `allowed_hosts`. An `allowed_hosts` entry matches one exact host unless it starts with `*.`.',
      zh: '为降低数据外泄风险，Claude Managed Agents 的 `web_fetch` 只抓取会话中已出现过的 URL：来自用户消息、`web_search` 结果，或此前已抓取的页面。仅出现在 Claude 自身输出、system prompt、附件文档，或 `bash`、`read`、MCP 等工具输出中的 URL，会返回 `url_not_in_prior_context` 错误。另外，在 `limited` 网络的云环境中，`allowed_hosts` 现同时约束 `web_search` 与 `web_fetch`；若已启用的网页工具的 `allowed_domains` 含不在 `allowed_hosts` 内的条目，创建或更新会话将返回 400。`allowed_hosts` 条目只匹配一个确切主机，除非以 `*.` 开头。',
    },
    takeaway: {
      en: 'Send any URL the agent must fetch in a `user.message` event, and list each host in `allowed_hosts` — `docs.example.com` is not covered by `example.com`.',
      zh: 'Agent 需要抓取的 URL 请放进 `user.message` 事件发送，并在 `allowed_hosts` 中逐个列出主机——`example.com` 不覆盖 `docs.example.com`。',
    },
    relatedGuideSlug: 'automation-safety-practices',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'cyber-verification-program-expanded-oct-2026',
    category: 'security',
    publishedAt: '2026-10-06',
    title: {
      en: 'Cyber Verification Program expands to three access tiers covering Opus 5.5, Sonnet 5.5, and Mythos 5.1',
      zh: 'Cyber Verification Program 扩展为三档访问权限，覆盖 Opus 5.5、Sonnet 5.5 与 Mythos 5.1',
    },
    summary: {
      en: 'Anthropic merged Project Glasswing and the Cyber Verification Program (CVP) into one program with three tiers. Defense Access covers SOC and incident-response work, malware reverse engineering, and vulnerability analysis; Anthropic aims to respond within a few days. Red Team Access adds authorized penetration testing and red-teaming for organizations only, with a review of a few weeks; applicants are enrolled in Defense Access in the meantime. Specialized Access has the fewest blocks and is reserved for verified organizations authorized to test systems such as power grids and interbank transfer infrastructure, reviewed together with the US government. Enrolled organizations must allow data retention; Enterprise Frontier Safeguards, planned for later this fall, will allow storage in customer-controlled cloud. Generally available models keep conservative cyber safeguards and still handle code review, patching known issues, and alert triage. Existing CVP members keep their settings and are evaluated automatically for the new models.',
      zh: 'Anthropic 将 Project Glasswing 与 Cyber Verification Program（CVP）合并为一个三档计划。Defense Access 覆盖 SOC 与事件响应、恶意软件逆向和漏洞分析，官方目标是数日内答复。Red Team Access 在此基础上增加授权渗透测试与红队演练，仅限组织申请，审核需数周，期间先开通 Defense Access。Specialized Access 拦截最少，仅限经验证、获授权测试电网、银行间转账等关键系统的组织，并与美国政府共同审核。入组组织必须允许数据留存；计划于今秋推出的 Enterprise Frontier Safeguards 将支持存放到客户自控云环境。普通可用模型保持保守的网络安全护栏，仍可用于代码审查、修复已知问题与告警分诊。现有 CVP 成员保留当前设置，并自动评估新模型的访问资格。',
    },
    takeaway: {
      en: 'Defensive security work blocked on generally available models is an eligibility question, not a prompt-wording problem: apply for the matching tier instead of rewording requests.',
      zh: '普通模型上被拦截的防御性安全工作属于资格问题，而非措辞问题：应申请对应档位，而不是反复改写请求。',
    },
    relatedGuideSlug: 'claude-steganography-and-risk-model',
    sourceUrl: 'https://www.anthropic.com/news/cyber-verification-program',
    sourceName: 'Anthropic',
  },
  {
    id: 'hong-kong-claude-suspensions-oct-2026',
    category: 'policy',
    publishedAt: '2026-10-01',
    title: {
      en: 'Hong Kong users report Claude account suspensions from Oct 1; Anthropic has not commented',
      zh: '10 月 1 日起香港用户集中反馈 Claude 账号被停用，Anthropic 尚未回应',
    },
    summary: {
      en: 'From October 1, 2026, Hong Kong users reported "Account Suspended" or "Access Denied" screens on claude.ai, including paid Pro subscribers who had connected through VPN exits in supported regions such as Singapore. Hong Kong, mainland China, and Macau are not on Anthropic\'s Supported Regions list; Taiwan, Singapore, and Japan are. The Help Center lists "account creation from an unsupported location" as a ban reason, and a VPN exit in a supported country does not change eligibility. One posted notice cited suspicious signals and a Usage Policy violation without naming a trigger. Media and community analysis points to shared data-center VPN IPs, virtual-card or unsupported-region payments, and frequent country switching, but Anthropic has not confirmed any of this and the number of affected accounts is unknown. One user reported that a data export returned account information without conversation history; the Help Center says exportable data can be restricted depending on the violation.',
      zh: '自 2026 年 10 月 1 日起，香港用户反馈 claude.ai 出现「Account Suspended」或「Access Denied」，其中包括通过新加坡等受支持地区 VPN 出口访问的 Pro 付费用户。香港、中国内地与澳门不在 Anthropic 的支持地区名单内，台湾、新加坡、日本在名单内。帮助中心将「从不受支持的地区创建账户」列为封禁原因，VPN 出口位于受支持国家并不改变使用资格。一份公开的停用通知仅提到「可疑信号」与违反使用政策，未说明具体触发条件。媒体与社区分析指向共享机房 VPN IP、虚拟卡或非支持地区支付，以及频繁切换登录国家，但 Anthropic 未确认其中任何一项，受影响账号数量亦未知。有用户反馈数据导出只有账号信息而无对话记录；帮助中心说明，可导出的数据范围可能因违规类型而受限。',
    },
    takeaway: {
      en: 'A supported-country VPN exit does not make an unsupported-region account eligible. If suspended: export data first, appeal with factual details at claude.ai/restricted, and do not register replacement accounts while the appeal is pending.',
      zh: '受支持国家的 VPN 出口不能让不支持地区的账号变得合规。被停用后：先导出数据，再到 claude.ai/restricted 如实申诉，申诉期间不要另注册新账号。',
    },
    relatedGuideSlug: 'regional-access-strategy',
    sourceUrl: 'https://aistify.com/claude-hong-kong-vpn-account-bans/',
    sourceName: 'AIstify (citing SCMP)',
  },
  {
    id: 'sonnet-4-5-deprecation-admin-api-ga-sep-2026',
    category: 'api',
    publishedAt: '2026-09-30',
    title: {
      en: 'Claude Sonnet 4.5 deprecated with Nov 30 retirement; Admin API methods leave beta in SDKs and the `ant` CLI',
      zh: 'Claude Sonnet 4.5 进入弃用期，11 月 30 日退役；Admin API 在 SDK 与 ant CLI 中转正',
    },
    summary: {
      en: 'Anthropic announced the deprecation of Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`), with retirement on the Claude API scheduled for November 30, 2026, and recommends migrating to Claude Sonnet 5.5. In Python SDK 1.10.0, TypeScript SDK 0.130.0, C# SDK 12.52.0, Go SDK 1.77.0, Java SDK 2.67.0, PHP SDK 0.53.0, Ruby SDK 1.75.0, and `ant` CLI 1.37.0, the Admin API methods for organization info, members, invites, workspaces, API keys, rate limits, service accounts, workload identity federation, customer-managed encryption keys, and compliance settings are out of beta under `client.organization` and `ant organization`. The beta paths remain available.',
      zh: 'Anthropic 宣布弃用 Claude Sonnet 4.5（`claude-sonnet-4-5-20250929`），Claude API 上的退役日期定为 2026 年 11 月 30 日，推荐迁移至 Claude Sonnet 5.5。在 Python SDK 1.10.0、TypeScript SDK 0.130.0、C# SDK 12.52.0、Go SDK 1.77.0、Java SDK 2.67.0、PHP SDK 0.53.0、Ruby SDK 1.75.0 与 `ant` CLI 1.37.0 中，组织信息、成员、邀请、工作区、API 密钥、速率限制、服务账号、workload identity federation、客户自管加密密钥与合规设置相关的 Admin API 方法已转正，可通过 `client.organization` 与 `ant organization` 调用；beta 路径继续保留。',
    },
    takeaway: {
      en: 'Replace hard-coded `claude-sonnet-4-5-20250929` before November 30, and read the Sonnet 5.5 migration guide first: `thinking` and forced `tool_choice` behave differently from earlier models.',
      zh: '请在 11 月 30 日前替换硬编码的 `claude-sonnet-4-5-20250929`，并先阅读 Sonnet 5.5 迁移指南：`thinking` 与强制 `tool_choice` 的行为与旧模型不同。',
    },
    relatedGuideSlug: 'api-advanced-optimization',
    sourceUrl: 'https://platform.claude.com/docs/en/release-notes/overview',
    sourceName: 'Anthropic Docs',
  },
  {
    id: 'claude-sonnet-5-5-launch',
    category: 'product',
    publishedAt: '2026-09-28',
    title: {
      en: 'Claude Sonnet 5.5 launches at an unchanged $2/$10, with thinking blocks bound to the account',
      zh: 'Claude Sonnet 5.5 发布，价格仍为 $2/$10，thinking block 与账号绑定',
    },
    summary: {
      en: 'Anthropic released Claude Sonnet 5.5 (`claude-sonnet-5-5`), the second Claude 5.5 model after Opus 5.5: 1M context, 128k max output, 30%+ faster than Sonnet 5, and up to 30% cheaper on most work because it uses fewer tokens at the same $2 / $10 per MTok. Migrating from Sonnet 5 breaks in five places: up-front thinking is turned off with `thinking: {"type": "between_tools"}` instead of `"disabled"` (at `high` effort or below); `tool_choice` types `any` and `tool` return 400; thinking blocks are tied to the model and conversation; the earlier `computer_20251124` tool is rejected on the Claude API and Google Cloud; and the advisor tool rejects Opus 4.8, Opus 4.7, and Sonnet 5 as advisors. Thinking blocks that Sonnet 5.5 produces work only in the account that produced them or an account linked to it. When another account sends one, the API drops the block before the model sees it and the request still succeeds. Claude Code 2.1.284 makes `sonnet` resolve to Sonnet 5.5 on the Anthropic API.',
      zh: 'Anthropic 发布 Claude Sonnet 5.5（`claude-sonnet-5-5`），为继 Opus 5.5 之后的第二款 Claude 5.5 模型：1M 上下文、128k 最大输出，速度比 Sonnet 5 快 30% 以上；价格仍为 $2 / $10 per MTok，但同样工作消耗的 token 更少，多数场景成本最高降低约 30%。从 Sonnet 5 迁移有五处不兼容：关闭前置 thinking 需改用 `thinking: {"type": "between_tools"}`（`high` 及以下 effort），不再使用 `"disabled"`；`tool_choice` 的 `any` 与 `tool` 返回 400；thinking block 与模型和会话绑定；旧版 `computer_20251124` 工具在 Claude API 与 Google Cloud 上被拒绝；advisor 工具不再接受 Opus 4.8、Opus 4.7 与 Sonnet 5 作为 advisor。Sonnet 5.5 生成的 thinking block 仅在生成它的账号或与之关联的账号中有效；其他账号发送时，API 会在模型看到之前丢弃该 block，请求本身仍然成功。Claude Code 2.1.284 起，Anthropic API 上的 `sonnet` 别名指向 Sonnet 5.5。',
    },
    takeaway: {
      en: 'An API relay or gateway that rotates several accounts within one conversation can silently lose Sonnet 5.5 thinking blocks. Keep each conversation on a single account.',
      zh: '在同一会话中轮换多个账号的 API 中转或网关，可能会悄悄丢失 Sonnet 5.5 的 thinking block。请让每个会话固定使用同一个账号。',
    },
    relatedGuideSlug: 'multi-account-management',
    sourceUrl: 'https://www.anthropic.com/claude-sonnet-5-5',
    sourceName: 'Anthropic',
  },
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
    publishedAt: '2026-07-23',
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
    sourceUrl: 'https://www.anthropic.com/transparency/system-trust-reporting',
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

/** Most recent first, optionally restricted to the given categories. */
export function getLatestNews(limit?: number, categories?: NewsCategory[]): NewsItem[] {
  const sorted = CLAUDE_NEWS.filter((item) => !categories || categories.includes(item.category)).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}
