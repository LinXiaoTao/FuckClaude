export const antiban_essentials_content = {
  en: `
<p>This checklist starts with what Anthropic states officially, then lists the practices most often cited in community reports and public reverse-engineering. Items outside the official section are observations, not documented rules, and none of them make an ineligible account eligible. Each section links to a deeper guide.</p>

<h2>Official Rules First</h2>
<ul>
  <li><strong>Ban reasons:</strong> Anthropic's <a href="https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals" target="_blank" rel="noopener noreferrer">Help Center</a> lists repeated Usage Policy violations, account creation from an unsupported location, and Terms of Service violations.</li>
  <li><strong>Supported regions:</strong> Mainland China, Hong Kong, and Macau are not on the <a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">Supported Regions list</a>; Taiwan, Singapore, Japan, and India are. Hong Kong users reported suspensions from Oct 1, 2026, including users who connected through VPN exits in supported regions, and Anthropic has not commented (see <a href="/news/">News</a>).</li>
  <li><strong>Payment:</strong> Pro and Max on the web accept credit or debit cards only, and the billing address must match the card's country of origin. See <a href="/guides/payment-methods-comparison/">payment methods and decline troubleshooting</a>.</li>
  <li><strong>Appeals:</strong> Sign in to claude.ai with the banned account to reach the appeal form. API warnings go to usersafety@anthropic.com.</li>
  <li><strong>Scale:</strong> Anthropic's <a href="https://www.anthropic.com/transparency/system-trust-reporting" target="_blank" rel="noopener noreferrer">transparency report</a> shows about 10.5% of appeals in the first half of 2026 ended in reinstatement.</li>
</ul>

<h2>1. Account & Payment Safety</h2>
<ul>
  <li><strong>One account, one identity stack:</strong> Do not reuse the same card, phone number, or billing address across multiple Pro accounts. Community reports link batch disables to shared payment instruments, phone numbers, and IP addresses.</li>
  <li><strong>Corporate ownership matters:</strong> Since Sept 2025, entities more than 50% owned by companies headquartered in unsupported regions (e.g. China) are barred — even if incorporated in Singapore or the US.</li>
  <li><strong>Align geography:</strong> The card country and billing address must match (an official requirement). Community reports also name a US card combined with a Singapore IP and a China timezone as a common mismatch in ban cases.</li>
  <li><strong>Avoid VoIP numbers:</strong> Use physical SIM or reputable SMS services; many VoIP prefixes fail verification or trigger instant review.</li>
  <li><strong>Use the refund request first:</strong> Anthropic has not published how bank disputes affect an account. For a failed or unwanted charge, use Get help &gt; Claude Refund Request before contacting your bank.</li>
</ul>
<p>→ Full guide: <a href="/guides/account-registration-and-payment-antiban/">Safe Account Registration & Payment</a></p>

<h2>2. Environment & Browser Hygiene</h2>
<ul>
  <li><strong>Fix timezone first:</strong> Public reverse-engineering reports say Claude Code reads the system timezone. Move off Asia/Shanghai and confirm <code>getTimezoneOffset()</code> is not UTC+8.</li>
  <li><strong>Language & fonts:</strong> Remove zh-CN from the top of <code>navigator.languages</code>; isolate Chinese vendor fonts (MiSans, HarmonyOS Sans) in a clean browser profile.</li>
  <li><strong>Stop WebRTC leaks:</strong> Disable or restrict WebRTC so your real IP does not bypass the proxy.</li>
  <li><strong>Use a clean, stable IP:</strong> Shared datacenter and commercial VPN ranges appear more often in ban reports than residential or mobile IPs. Prefer a clean residential or mobile IP in a supported region.</li>
</ul>
<p>→ Full guide: <a href="/guides/environment-cleanup-and-ip-setup/">Environment Cleanup & IP Setup</a> · <a href="/guides/browser-configuration-guide/">Browser Configuration</a></p>

<h2>3. API & Claude Code Usage</h2>
<ul>
  <li><strong>Match CLI and browser:</strong> Export the same <code>TZ</code>, proxy, and <code>ANTHROPIC_BASE_URL</code> in every shell where Claude Code runs. Split-brain configs (browser on VPN, CLI direct) are a top cause of 403 errors.</li>
  <li><strong>Respect rate limits:</strong> The <a href="https://platform.claude.com/docs/en/api/rate-limits" target="_blank" rel="noopener noreferrer">API docs</a> list Start, Build, and Scale tiers; Start allows 1,000 RPM per model, and new organizations may begin on a lower Evaluation tier. Quota headroom does not rule out review of high-repetition or coordinated traffic. Use exponential backoff, the Batch API, or prompt caching for bulk work.</li>
  <li><strong>Choose relays carefully:</strong> Gateways that strip <code>cache_control</code> markers or <code>anthropic-beta</code> headers, or inject text, break prompt cache and can look like abuse.</li>
  <li><strong>No credential sharing:</strong> Never paste API keys into public repos, chat logs, or shared CI logs. Rotate keys if exposed.</li>
</ul>
<p>→ Full guide: <a href="/guides/claude-code-and-api-safety/">Claude Code & API Safety</a> · <a href="/guides/automation-safety-practices/">Automation Safety</a></p>

<h2>4. Usage Patterns & Frequency</h2>
<ul>
  <li><strong>Warm up new accounts:</strong> Avoid hundreds of API calls or marathon Claude Code sessions on day one. Gradual usage looks more natural than instant max-tier load.</li>
  <li><strong>Avoid distillation-like patterns:</strong> Anthropic's Feb 2026 distillation report describes flagging narrow, high-volume capability targeting, such as thousands of near-identical coding prompts. Accounts created after Aug 31, 2026 face stricter thinking-block replay binding, so never cache and replay raw thinking blocks. Spread workloads across time and vary prompt structure.</li>
  <li><strong>Separate workloads:</strong> Do not run aggressive scraping, mass account creation, or policy-edge prompts on your primary paid account.</li>
  <li><strong>One device fingerprint per account:</strong> Switching between a China-locale laptop and a US VPS on the same login within hours raises association risk.</li>
  <li><strong>Log and audit:</strong> Keep request volume and error rates visible so 429 spikes are caught before they escalate to review.</li>
</ul>
<p>→ Full guide: <a href="/guides/multi-account-management/">Multi-Account Management</a> · <a href="/guides/ban-case-studies/">Ban Case Studies</a></p>

<h2>5. When Something Goes Wrong</h2>
<ul>
  <li><strong>Diagnose the ban type:</strong> 403 at login (IP/geo), forced refund email (payment mismatch), or full disable (policy) — each needs a different response.</li>
  <li><strong>Appeal via official channels:</strong> Disabled accounts → <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a>; API warnings → usersafety@anthropic.com. Anthropic publishes no response time, so describe the legitimate use case in English with verifiable context.</li>
  <li><strong>Do not panic-create accounts:</strong> Community reports range from reinstatement within days to no reply for weeks, and Anthropic publishes no response time. Replacement accounts created while an appeal is pending raise association risk, according to community reports.</li>
  <li><strong>Fail over gracefully:</strong> Keep a domestic model or local Ollama/One-API route ready so production does not halt during recovery.</li>
</ul>
<p>→ Full guide: <a href="/guides/account-appeal-and-recovery-sop/">Account Appeal & Recovery SOP</a> · <a href="/guides/domestic-and-open-source-alternatives/">Domestic Alternatives</a></p>

<h2>Quick Self-Check</h2>
<p>Run the <a href="/">Fuck Claude detector</a> on the same browser profile you use for Claude. Score above 60? Fix timezone and language before touching payment or API settings. Score below 30 but still banned? The scan cannot see your account region, IP reputation, payment method, or usage pattern, so check those next. An account created from an unsupported location can be disabled regardless of the browser score.</p>
`,
  zh: `
<p>这份清单先列出 Anthropic 官方公布的规则，再列出社区反馈和公开逆向分析中最常被提到的做法。官方规则之外的内容是观察，不是文档化的规则，也不能让不符合资格的账号变得符合资格。每个板块都链接到更详细的指南。</p>

<h2>官方规则先看</h2>
<ul>
  <li><strong>封禁原因：</strong>Anthropic <a href="https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals" target="_blank" rel="noopener noreferrer">帮助中心</a>列出三类：反复违反使用政策、从不受支持的地区创建账户、违反服务条款。</li>
  <li><strong>支持地区：</strong>中国大陆、香港、澳门不在<a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">支持地区名单</a>内，台湾、新加坡、日本、印度在名单内。2026 年 10 月 1 日起，香港用户反馈账号被停用，其中包括通过受支持地区 VPN 出口访问的用户，Anthropic 尚未回应（见<a href="/zh/news/">资讯</a>）。</li>
  <li><strong>支付：</strong>网页端 Pro 与 Max 只接受信用卡或借记卡，账单地址必须与发卡地区一致。详见<a href="/zh/guides/payment-methods-comparison/">支付方式与扣款失败排查</a>。</li>
  <li><strong>申诉：</strong>用被封账号登录 claude.ai 即可进入申诉表单。API 警告发邮件到 usersafety@anthropic.com。</li>
  <li><strong>规模：</strong>Anthropic <a href="https://www.anthropic.com/transparency/system-trust-reporting" target="_blank" rel="noopener noreferrer">透明度报告</a>显示，2026 年上半年约 10.5% 的申诉最终恢复了账号。</li>
</ul>

<h2>一、账号与支付安全</h2>
<ul>
  <li><strong>一号一栈：</strong>不要在多个 Pro 账号间复用同一张卡、手机号或账单地址。社区反馈把批量封号与共用支付方式、手机号和 IP 联系在一起。</li>
  <li><strong>企业股权结构：</strong>自 2025 年 9 月起，由不受支持地区（如中国）总部公司直接或间接控股超 50% 的实体一律禁止 — 即使注册在新加坡或美国。</li>
  <li><strong>地理信息一致：</strong>发卡地区与账单地址必须一致（官方要求）。社区反馈还提到，美国卡加新加坡 IP 加中国时区，是封号案例中常见的不一致组合。</li>
  <li><strong>避开 VoIP 号段：</strong>优先实体 SIM 或口碑接码平台；大量 VoIP 前缀无法过验证或直接触发审核。</li>
  <li><strong>先走退款申请：</strong>Anthropic 没有公布银行争议对账号的影响。遇到扣款失败或不想要的扣款，先用 Get help &gt; Claude Refund Request，再考虑联系银行。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/account-registration-and-payment-antiban/">账号注册与支付避坑</a></p>

<h2>二、环境与浏览器卫生</h2>
<ul>
  <li><strong>先改时区：</strong>公开的逆向分析指出 Claude Code 会读取系统时区。移出 Asia/Shanghai，确认 <code>getTimezoneOffset()</code> 不再是 UTC+8。</li>
  <li><strong>语言与字体：</strong>把 zh-CN 从 <code>navigator.languages</code> 首位移除；在干净浏览器 Profile 中隔离 MiSans、鸿蒙黑体等厂商字体。</li>
  <li><strong>堵住 WebRTC 泄露：</strong>禁用或限制 WebRTC，避免真实 IP 绕过代理暴露。</li>
  <li><strong>使用干净稳定的 IP：</strong>共享机房和商业 VPN 网段在封号反馈中出现的频率高于住宅或移动 IP。优先使用支持地区的干净住宅或移动 IP。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/environment-cleanup-and-ip-setup/">环境纯化与 IP 配置</a> · <a href="/zh/guides/browser-configuration-guide/">浏览器防封配置</a></p>

<h2>三、API 与 Claude Code 使用规范</h2>
<ul>
  <li><strong>CLI 与浏览器对齐：</strong>在每个运行 Claude Code 的 shell 中导出相同的 <code>TZ</code>、代理与 <code>ANTHROPIC_BASE_URL</code>。浏览器走 VPN、CLI 直连是最常见的 403 原因。</li>
  <li><strong>遵守速率限制：</strong><a href="https://platform.claude.com/docs/en/api/rate-limits" target="_blank" rel="noopener noreferrer">API 文档</a>列出 Start、Build、Scale 三个层级，Start 每个模型 1,000 RPM，新组织可能从更低的 Evaluation 层级开始。配额有余量不代表高重复或协同流量不会被审核。批量任务请用指数退避、Batch API 或 Prompt Cache。</li>
  <li><strong>谨慎选择中转：</strong>剥离 <code>cache_control</code> 标记或 <code>anthropic-beta</code> 头、或注入额外文本的中转会破坏 Prompt Cache，且可能被视为滥用。</li>
  <li><strong>不共享凭据：</strong>不要把 API Key 粘贴到公开仓库、聊天记录或共享 CI 日志。泄露后立即轮换。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/claude-code-and-api-safety/">Claude Code 与 API 规范</a> · <a href="/zh/guides/automation-safety-practices/">自动化安全规范</a></p>

<h2>四、使用模式与频率控制</h2>
<ul>
  <li><strong>新号先养：</strong>避免注册首日数百次 API 调用或超长 Claude Code 会话。渐进式使用比瞬间打满 tier 更自然。</li>
  <li><strong>避免蒸馏式流量模式：</strong>Anthropic 2026 年 2 月的蒸馏报告描述了对窄域高并发请求（如数千条高度相似的编码 prompt）的标记。2026 年 8 月 31 日之后新建的账号，对 thinking block 重放的绑定更严，切勿缓存并重放原始 thinking block。分散请求时间并变化 prompt 结构。</li>
  <li><strong>工作负载分离：</strong>不要在主力付费号上跑 aggressive 爬虫、批量注册或擦边 prompt。</li>
  <li><strong>一账号一设备指纹：</strong>同一登录在几小时内从中国 locale 笔记本切到美国 VPS，关联风险陡增。</li>
  <li><strong>记录与审计：</strong>监控请求量与错误率，在 429 飙升演变为人工审核前及时降速。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/multi-account-management/">多账号管理</a> · <a href="/zh/guides/ban-case-studies/">封号案例复盘</a></p>

<h2>五、出问题之后怎么办</h2>
<ul>
  <li><strong>判定封号类型：</strong>登录 403（IP/地区）、被迫退款邮件（支付不匹配）、完全禁用（政策）—— 路径各不相同。</li>
  <li><strong>走官方申诉通道：</strong>Disabled 账号 → <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a>；API 警示 → usersafety@anthropic.com。Anthropic 没有公布处理时间，请用英文说明正当用途并附上可验证的背景信息。</li>
  <li><strong>勿慌乱重复建号：</strong>社区反馈的处理时间从几天到数周无回复不等，Anthropic 没有公布处理时间。根据社区反馈，申诉期间新建替代账号会提高关联风险。</li>
  <li><strong>平滑降级：</strong>提前准备国产模型或本地 Ollama/One-API 路由，恢复期间业务不中断。</li>
</ul>
<p>→ 完整指南：<a href="/zh/guides/account-appeal-and-recovery-sop/">封号申诉 SOP</a> · <a href="/zh/guides/domestic-and-open-source-alternatives/">国产平替与灾备</a></p>

<h2>快速自检</h2>
<p>在与 Claude 相同的浏览器 Profile 上运行 <a href="/zh/">Fuck Claude 检测器</a>。分数高于 60？先改时区和语言，再动支付或 API 配置。分数低于 30 仍被封？扫描看不到账号注册地区、IP 信誉、支付方式和使用模式，下一步检查这些。从不受支持的地区创建的账号，无论浏览器得分多少都可能被停用。</p>
`,
};
