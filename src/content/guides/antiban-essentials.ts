export const antiban_essentials_content = {
  en: `
<p>This is a concise, actionable anti-ban checklist for Claude users — especially those operating from regions where Anthropic does not officially sell Claude. It distills the most common failure modes from community reports and public reverse-engineering into five areas you can verify today. For deep dives, follow the linked guides in each section.</p>

<h2>1. Account & Payment Safety</h2>
<ul>
  <li><strong>One account, one identity stack:</strong> Do not reuse the same virtual-card BIN, phone number, or billing address across multiple Pro accounts within 24 hours. Since Anthropic's Feb 2026 distillation report, linked disables via payment and IP fingerprinting are more aggressively enforced.</li>
  <li><strong>Corporate ownership matters:</strong> Since Sept 2025, entities more than 50% owned by companies headquartered in unsupported regions (e.g. China) are barred — even if incorporated in Singapore or the US.</li>
  <li><strong>Align geography:</strong> Registration IP, billing country, and card BIN should tell a consistent story. A US card with a Singapore IP and a China timezone is a red flag.</li>
  <li><strong>Avoid VoIP numbers:</strong> Use physical SIM or reputable SMS services; many VoIP prefixes fail verification or trigger instant review.</li>
  <li><strong>Let subscriptions settle:</strong> Do not chargeback immediately on failed renewals — that often triggers permanent disable rather than a reversible refund.</li>
</ul>
<p>→ Full guide: <a href="/guides/account-registration-and-payment-antiban/">Safe Account Registration & Payment</a></p>

<h2>2. Environment & Browser Hygiene</h2>
<ul>
  <li><strong>Fix timezone first:</strong> System timezone is the heaviest single signal Claude Code reads. Move off Asia/Shanghai and confirm <code>getTimezoneOffset()</code> is not UTC+8.</li>
  <li><strong>Language & fonts:</strong> Remove zh-CN from the top of <code>navigator.languages</code>; isolate Chinese vendor fonts (MiSans, HarmonyOS Sans) in a clean browser profile.</li>
  <li><strong>Stop WebRTC leaks:</strong> Disable or restrict WebRTC so your real IP does not bypass the proxy.</li>
  <li><strong>Use residential IP:</strong> Datacenter IPs score poorly on IP reputation checks. Prefer clean residential or mobile IPs in a supported region.</li>
</ul>
<p>→ Full guide: <a href="/guides/environment-cleanup-and-ip-setup/">Environment Cleanup & IP Setup</a> · <a href="/guides/browser-configuration-guide/">Browser Configuration</a></p>

<h2>3. API & Claude Code Usage</h2>
<ul>
  <li><strong>Match CLI and browser:</strong> Export the same <code>TZ</code>, proxy, and <code>ANTHROPIC_BASE_URL</code> in every shell where Claude Code runs. Split-brain configs (browser on VPN, CLI direct) are a top cause of 403 errors.</li>
  <li><strong>Respect rate limits:</strong> API tiers are now Start / Build / Scale (formerly Tier 1–4). Start allows ~1,000 RPM per model — but high-repetition or coordinated traffic patterns can still trigger review regardless of quota headroom. Use exponential backoff, Batch API, or prompt caching for bulk work.</li>
  <li><strong>Choose relays carefully:</strong> Gateways that strip <code>cache_control</code> markers or <code>anthropic-beta</code> headers, or inject text, break prompt cache and can look like abuse.</li>
  <li><strong>No credential sharing:</strong> Never paste API keys into public repos, chat logs, or shared CI logs. Rotate keys if exposed.</li>
</ul>
<p>→ Full guide: <a href="/guides/claude-code-and-api-safety/">Claude Code & API Safety</a> · <a href="/guides/automation-safety-practices/">Automation Safety</a></p>

<h2>4. Usage Patterns & Frequency</h2>
<ul>
  <li><strong>Warm up new accounts:</strong> Avoid hundreds of API calls or marathon Claude Code sessions on day one. Gradual usage looks more natural than instant max-tier load.</li>
  <li><strong>Avoid distillation-like patterns:</strong> Narrow, high-volume capability targeting (e.g. thousands of near-identical coding prompts) is now actively flagged. Spread workloads across time and vary prompt structure.</li>
  <li><strong>Separate workloads:</strong> Do not run aggressive scraping, mass account creation, or policy-edge prompts on your primary paid account.</li>
  <li><strong>One device fingerprint per account:</strong> Switching between a China-locale laptop and a US VPS on the same login within hours raises association risk.</li>
  <li><strong>Log and audit:</strong> Keep request volume and error rates visible so 429 spikes are caught before they escalate to review.</li>
</ul>
<p>→ Full guide: <a href="/guides/multi-account-management/">Multi-Account Management</a> · <a href="/guides/ban-case-studies/">Ban Case Studies</a></p>

<h2>5. When Something Goes Wrong</h2>
<ul>
  <li><strong>Diagnose the ban type:</strong> 403 at login (IP/geo), forced refund email (payment mismatch), or full disable (policy) — each needs a different response.</li>
  <li><strong>Appeal in English with facts:</strong> State legitimate cross-border use (travel, remote work) without admitting ToS violations. Templates in the appeal SOP guide.</li>
  <li><strong>Fail over gracefully:</strong> Keep a domestic model or local Ollama/One-API route ready so production does not halt during recovery.</li>
</ul>
<p>→ Full guide: <a href="/guides/account-appeal-and-recovery-sop/">Account Appeal & Recovery SOP</a> · <a href="/guides/domestic-and-open-source-alternatives/">Domestic Alternatives</a></p>

<h2>Quick Self-Check</h2>
<p>Run the <a href="/">Fuck Claude detector</a> on the same browser profile you use for Claude. Score above 60? Fix timezone and language before touching payment or API settings. Score below 30 but still banned? The issue is almost certainly IP reputation, payment BIN, or usage pattern — not browser fonts alone.</p>
`,
  zh: `
<p>这是一份面向 Claude 用户的简明防封实操清单 —— 尤其适合 Anthropic 未正式销售 Claude 的地区用户。我们将社区反馈与公开逆向分析中最常见的失败模式，浓缩为五个可立即核对的方向。每个板块末尾附有深度指南链接。</p>

<h2>一、账号与支付安全</h2>
<ul>
  <li><strong>一号一栈：</strong>24 小时内不要在多个 Pro 账号间复用同一虚拟卡 BIN、手机号或账单地址。自 2026 年 2 月蒸馏攻击报告后，支付与 IP 指纹关联封号执行更严。</li>
  <li><strong>企业股权结构：</strong>自 2025 年 9 月起，由不受支持地区（如中国）总部公司直接或间接控股超 50% 的实体一律禁止 — 即使注册在新加坡或美国。</li>
  <li><strong>地理信息一致：</strong>注册 IP、账单国家与卡 BIN 应讲述同一个故事。美国卡 + 新加坡 IP + 中国时区是典型高危组合。</li>
  <li><strong>避开 VoIP 号段：</strong>优先实体 SIM 或口碑接码平台；大量 VoIP 前缀无法过验证或直接触发审核。</li>
  <li><strong>续费失败勿立刻拒付：</strong>刚扣款失败就 chargeback 往往导致永久禁用，而非可逆的退款流程。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/account-registration-and-payment-antiban/">账号注册与支付避坑</a></p>

<h2>二、环境与浏览器卫生</h2>
<ul>
  <li><strong>先改时区：</strong>系统时区是 Claude Code 读取的单项最重信号。移出 Asia/Shanghai，确认 <code>getTimezoneOffset()</code> 不再是 UTC+8。</li>
  <li><strong>语言与字体：</strong>把 zh-CN 从 <code>navigator.languages</code> 首位移除；在干净浏览器 Profile 中隔离 MiSans、鸿蒙黑体等厂商字体。</li>
  <li><strong>堵住 WebRTC 泄露：</strong>禁用或限制 WebRTC，避免真实 IP 绕过代理暴露。</li>
  <li><strong>使用住宅 IP：</strong>数据中心 IP 在 IP 信誉检测中得分差。优先使用支持地区的干净住宅或移动 IP。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/environment-cleanup-and-ip-setup/">环境纯化与 IP 配置</a> · <a href="/zh/guides/browser-configuration-guide/">浏览器防封配置</a></p>

<h2>三、API 与 Claude Code 使用规范</h2>
<ul>
  <li><strong>CLI 与浏览器对齐：</strong>在每个运行 Claude Code 的 shell 中导出相同的 <code>TZ</code>、代理与 <code>ANTHROPIC_BASE_URL</code>。浏览器走 VPN、CLI 直连是最常见的 403 原因。</li>
  <li><strong>遵守速率限制：</strong>API 层级现为 Start / Build / Scale（原 Tier 1–4）。Start 每模型约 1,000 RPM — 但高重复或协同流量模式仍可能触发审核，与配额余量无关。批量任务请用指数退避、Batch API 或 Prompt Cache。</li>
  <li><strong>谨慎选择中转：</strong>剥离 <code>cache_control</code> 标记或 <code>anthropic-beta</code> 头、或注入额外文本的中转会破坏 Prompt Cache，且可能被视为滥用。</li>
  <li><strong>不共享凭据：</strong>不要把 API Key 粘贴到公开仓库、聊天记录或共享 CI 日志。泄露后立即轮换。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/claude-code-and-api-safety/">Claude Code 与 API 规范</a> · <a href="/zh/guides/automation-safety-practices/">自动化安全规范</a></p>

<h2>四、使用模式与频率控制</h2>
<ul>
  <li><strong>新号先养：</strong>避免注册首日数百次 API 调用或超长 Claude Code 会话。渐进式使用比瞬间打满 tier 更自然。</li>
  <li><strong>避免蒸馏式流量模式：</strong>窄域高并发（如数千条高度相似的编码 prompt）现已被主动标记。分散请求时间并变化 prompt 结构。</li>
  <li><strong>工作负载分离：</strong>不要在主力付费号上跑 aggressive 爬虫、批量注册或擦边 prompt。</li>
  <li><strong>一账号一设备指纹：</strong>同一登录在几小时内从中国 locale 笔记本切到美国 VPS，关联风险陡增。</li>
  <li><strong>记录与审计：</strong>监控请求量与错误率，在 429 飙升演变为人工审核前及时降速。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/multi-account-management/">多账号管理</a> · <a href="/zh/guides/ban-case-studies/">封号案例复盘</a></p>

<h2>五、出问题之后怎么办</h2>
<ul>
  <li><strong>判定封号类型：</strong>登录 403（IP/地区）、被迫退款邮件（支付不匹配）、完全禁用（政策）—— 路径各不相同。</li>
  <li><strong>用英文申诉、陈述事实：</strong>说明合法的跨境使用场景（出差、远程办公），避免主动承认违反 ToS。申诉信模板见 SOP 指南。</li>
  <li><strong>平滑降级：</strong>提前准备国产模型或本地 Ollama/One-API 路由，恢复期间业务不中断。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/account-appeal-and-recovery-sop/">封号申诉 SOP</a> · <a href="/zh/guides/domestic-and-open-source-alternatives/">国产平替与灾备</a></p>

<h2>快速自检</h2>
<p>在与 Claude 相同的浏览器 Profile 上运行 <a href="/zh/">Fuck Claude 检测器</a>。分数高于 60？先改时区和语言，再动支付或 API 配置。分数低于 30 仍被封？问题几乎一定在 IP 信誉、支付 BIN 或使用模式 —— 而非仅浏览器字体。</p>
`,
};
