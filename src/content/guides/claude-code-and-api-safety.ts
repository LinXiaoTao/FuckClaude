export const claude_code_and_api_safety_content = {
  en: `
<p>Claude Code and custom API integrations send more than prompts—they emit environment metadata, routing choices, and retry behavior that upstream systems may correlate with account health. This guide focuses on <em>operational safety</em>: consistent shell configuration, gateway selection, and graceful failover when quotas tighten. The goal is reliable engineering workflows, not circumventing Anthropic policy.</p>

<p>Start with a clean baseline: <a href="/guides/environment-cleanup-and-ip-setup/">environment cleanup and IP setup</a> and <a href="/guides/vpn-and-proxy-selection/">VPN and proxy selection</a> before tuning CLI variables. If you operate relays or multi-model routers, cross-read <a href="/guides/domestic-and-open-source-alternatives/">domestic and open-source alternatives</a> for degradation paths.</p>

<h2>1. Claude Code Security Configurations</h2>
<p>Claude Code reads shell environment variables at launch. Misaligned timezone, proxy, or base URL settings can produce confusing errors—or cause the client to behave differently than your browser session. Treat the terminal as a first-class environment, not an afterthought.</p>

<h3>Core Environment Variables</h3>
<pre><code># ~/.zshrc or ~/.bashrc — load in every interactive shell

# 1. Declare custom Anthropic-compatible endpoints explicitly
export ANTHROPIC_BASE_URL="https://your-gateway.example.com"
export ANTHROPIC_API_KEY="sk-your-key"

# 2. When using a trusted first-party-shaped gateway, reduce client mismatch warnings
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 3. Align terminal timezone with your documented operating region
export TZ=Asia/Tokyo   # or America/Los_Angeles — match proxy geo

# 4. Route CLI HTTPS through the same clean proxy as your browser (if required)
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export NO_PROXY="localhost,127.0.0.1,.internal"</code></pre>

<h3>Configuration Checklist</h3>
<ol>
  <li><strong>Single source of truth:</strong> Store env vars in <code>~/.zshrc</code> (macOS) or a dedicated <code>~/.claude/env</code> file sourced by your shell—avoid exporting ad hoc in one terminal tab.</li>
  <li><strong>Verify before launch:</strong> Run <code>env | grep -E 'ANTHROPIC|TZ|PROXY'</code> in the same window where you start Claude Code.</li>
  <li><strong>Match browser and CLI geography:</strong> If your browser profile uses Tokyo timezone via anti-detect tooling, the CLI should not report <code>Asia/Shanghai</code>.</li>
  <li><strong>Document base URL changes:</strong> When switching from direct Anthropic to a relay, update both <code>ANTHROPIC_BASE_URL</code> and internal runbooks so teammates do not mix endpoints.</li>
  <li><strong>Secrets hygiene:</strong> Never commit API keys; use <code>chmod 600</code> on env files and rotate relay keys quarterly.</li>
</ol>

<h3>What <code>_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL</code> Does (and Does Not Do)</h3>
<p>This flag tells Claude Code to treat a non-default <code>ANTHROPIC_BASE_URL</code> as if it were the standard Anthropic endpoint for certain client-side checks. It reduces friction when your organization runs an approved internal gateway. It does <strong>not</strong> change server-side policy, billing, or eligibility. For how client metadata may still be evaluated, see <a href="/guides/claude-steganography-and-risk-model/">Claude steganography and risk model</a>.</p>

<h3>Common Misconfiguration Failures</h3>
<ul>
  <li><strong>Split-brain proxy:</strong> Browser uses VPN; CLI does not—requests originate from different ASNs. Symptom: web chat works, CLI returns 403.</li>
  <li><strong>Stale <code>NO_PROXY</code>:</strong> Local gateway on <code>127.0.0.1</code> must bypass corporate proxy or loops fail with connection reset.</li>
  <li><strong>Wrong API key scope:</strong> Organization keys vs. project keys behave differently under rate limits; confirm key type in Anthropic console.</li>
  <li><strong>Interactive vs. non-interactive shells:</strong> CI jobs that invoke Claude Code must source the same env file; login shells on laptops often hide missing exports.</li>
</ul>

<h2>2. Selecting API Relay Gateways</h2>
<p>When direct access to <code>api.anthropic.com</code> is constrained by routing or procurement, relays can improve availability—if they preserve protocol fidelity. A poor gateway silently strips headers, rewrites prompts, or adds latency spikes that look like model quality regression.</p>

<h3>Gateway Evaluation Matrix</h3>
<table>
  <thead>
    <tr>
      <th>Criterion</th>
      <th>Pass</th>
      <th>Fail (Replace Gateway)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Prompt Cache headers</td>
      <td>Forwards <code>anthropic-beta: prompt-caching-2024-07-15</code> (or current beta) unchanged</td>
      <td>Strips beta headers; cache read tokens always zero</td>
    </tr>
    <tr>
      <td>System prompt integrity</td>
      <td>Byte-identical relay of system blocks</td>
      <td>Injects ads, watermark text, or "helpful" prefixes</td>
    </tr>
    <tr>
      <td>Streaming SSE</td>
      <td>Preserves event boundaries and tool deltas</td>
      <td>Buffers full response before emit; breaks tool UI</td>
    </tr>
    <tr>
      <td>Error transparency</td>
      <td>Passes through Anthropic status codes and bodies</td>
      <td>Maps everything to generic 502</td>
    </tr>
    <tr>
      <td>Hostname neutrality</td>
      <td>Neutral domain (e.g., <code>api.yourcorp.net</code>)</td>
      <td>Public hostnames with unrelated AI vendor keywords or <code>.cn</code> TLD used for Claude-only traffic</td>
    </tr>
    <tr>
      <td>TLS &amp; cert pinning</td>
      <td>Valid public CA, HSTS, no SSL inspection MITM</td>
      <td>Corporate SSL break without client trust store update</td>
    </tr>
  </tbody>
</table>

<h3>Prompt Cache Preservation (Cost Impact)</h3>
<p>Anthropic prompt caching can cut repeated input costs by up to 90%. Relays that drop cache headers force full-price input tokens on every turn—often a 4×–10× surprise on long system prompts. Validate with a two-request test:</p>
<pre><code># Request 1: create cache
curl -s "$ANTHROPIC_BASE_URL/v1/messages" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: prompt-caching-2024-07-15" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":64,
       "system":[{"type":"text","text":"'$(python3 -c "print('x'*5000)")'",
         "cache_control":{"type":"ephemeral"}}],
       "messages":[{"role":"user","content":"ping"}]}'

# Request 2: expect cache_read_input_tokens &gt; 0 in usage</code></pre>
<p>Deep optimization patterns live in <a href="/guides/api-advanced-optimization/">API advanced optimization</a>.</p>

<h3>Operational Due Diligence Before Production</h3>
<ul>
  <li>Run 24-hour synthetic probes (one message every 15 minutes) measuring p95 latency and error rate.</li>
  <li>Log a sample of request IDs; confirm your app can correlate gateway logs with upstream IDs for incidents.</li>
  <li>Review data processing agreement: some relays log prompts for abuse detection— unacceptable for regulated workloads.</li>
  <li>Prefer gateways your organization controls (self-hosted LiteLLM, One-API on VPC) over opaque public resellers when handling source code.</li>
</ul>

<p>Account-level stability still depends on registration hygiene—see <a href="/guides/account-registration-and-payment-antiban/">account registration and payment antiban</a> if relay adoption coincides with new org creation.</p>

<h2>3. Rate Limits (429) &amp; Smooth Failover</h2>
<p>Anthropic rate limits apply at the organization and model tier level, not per API key in isolation. Bursting agents, parallel CI jobs, and unbounded retry loops can exhaust shared quota and block unrelated services in the same org.</p>

<h3>Limit Classes (Simplified)</h3>
<table>
  <thead>
    <tr>
      <th>Signal</th>
      <th>HTTP Code</th>
      <th>Meaning</th>
      <th>Safe Response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rate limit</td>
      <td>429</td>
      <td>Too many requests / tokens per minute</td>
      <td>Exponential backoff + jitter; reduce concurrency</td>
    </tr>
    <tr>
      <td>Overloaded</td>
      <td>529</td>
      <td>Upstream capacity</td>
      <td>Short backoff; optional model downgrade</td>
    </tr>
    <tr>
      <td>Auth / policy</td>
      <td>403</td>
      <td>Key invalid or access denied</td>
      <td>Do not retry blindly; check account status</td>
    </tr>
    <tr>
      <td>Bad request</td>
      <td>400</td>
      <td>Schema or token limit</td>
      <td>Fix payload; trim context</td>
    </tr>
  </tbody>
</table>

<h3>Retry and Failover Pattern</h3>
<pre><code>// TypeScript — retry 429/529, failover on sustained pressure
async function callClaudeWithFallback(prompt: string, opts: CallOpts) {
  const maxRetries = 4;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callClaudeAPI(prompt, opts);
    } catch (error: any) {
      const status = error?.status;
      if (status === 429 || status === 529) {
        const delay = Math.min(30_000, 500 * 2 ** attempt + Math.random() * 250);
        await sleep(delay);
        continue;
      }
      if (status === 403) throw error; // surface auth issues
      throw error;
    }
  }
  console.warn('Claude quota saturated; failing over to backup upstream');
  return await callFallbackAPI(prompt, opts); // DeepSeek / GLM / local — see alternatives guide
}</code></pre>

<h3>Concurrency Controls</h3>
<ul>
  <li><strong>Token bucket in CI:</strong> Cap parallel agent jobs (e.g., max 3 concurrent) per organization.</li>
  <li><strong>Request coalescing:</strong> Batch small lint fixes instead of one API call per file when possible.</li>
  <li><strong>Circuit breaker:</strong> After N consecutive 429s, open circuit for 60s and route to fallback automatically—prevents retry storms.</li>
  <li><strong>Observability:</strong> Export metrics: <code>claude_requests_total{status}</code>, <code>fallback_invocations_total</code>, p95 latency. Alert when fallback rate exceeds 15% for 10 minutes.</li>
</ul>

<h3>403 vs. 429: Do Not Treat Them the Same</h3>
<p>A 429 is temporal pressure—back off and resume. A 403 often indicates credential revocation, geographic restriction, or account state change. Retrying 403 with alternate keys without diagnosis can accelerate enforcement. Use the <a href="/guides/troubleshooting-guide/">troubleshooting guide</a> to classify errors before rotating infrastructure.</p>

<h2>FAQ</h2>

<h3>Should I set <code>TZ</code> if my system timezone is already correct?</h3>
<p>If OS timezone, proxy exit geo, and browser profile already align, explicit <code>TZ</code> may be redundant—but CI containers often default to UTC. Explicit export makes behavior deterministic across laptops and servers.</p>

<h3>Is a public API reseller "safe" for company source code?</h3>
<p>Treat it like any third-party subprocessors: review logging, retention, and subprocessors list. For proprietary code, self-hosted relays on your VPC are strictly safer than anonymous resellers.</p>

<h3>Why do cache savings disappear after switching gateways?</h3>
<p>Most commonly the relay strips <code>anthropic-beta</code> headers or reorders system blocks, invalidating cache keys. Re-run the two-request cache test after any gateway change.</p>

<h3>Can I use different proxies for browser and Claude Code?</h3>
<p>Technically yes, but you increase divergence risk. Prefer one documented egress path for all Claude traffic unless you isolate experimental accounts in separate profiles.</p>

<h3>What fallback model should Claude Code use on 429?</h3>
<p>Claude Code itself has no built-in multi-model failover—you implement that at the gateway (One-API/LiteLLM) or disable Claude Code temporarily and use IDE plugins pointed at backup APIs. See <a href="/guides/domestic-and-open-source-alternatives/">domestic and open-source alternatives</a> for routing tables.</p>

<h3>How do I debug "works in curl but fails in Claude Code"?</h3>
<ol>
  <li>Diff headers: capture curl vs. CLI with mitmproxy or gateway access logs.</li>
  <li>Confirm env in the launching shell: IDE-integrated terminals sometimes skip login rc files.</li>
  <li>Check Node/fetch proxy agents—some versions ignore <code>HTTPS_PROXY</code> unless <code>GLOBAL_AGENT_HTTP_PROXY</code> is set.</li>
  <li>Verify TLS interception on corporate networks.</li>
</ol>

<h3>Does assuming first-party base URL affect Anthropic billing?</h3>
<p>No. Billing follows the API key and organization tied to the upstream that actually serves the request. If your gateway forwards to Anthropic, you pay Anthropic; if it swaps models, you pay whichever provider the gateway calls.</p>
`,
  zh: `
<p>Claude Code 与自定义 API 集成上传的不只是 Prompt——还包括环境元数据、路由选择与重试行为，上游系统可能将其与账号健康度关联分析。本文聚焦<strong>运维安全</strong>：一致的 Shell 配置、网关选型，以及在配额收紧时的平滑降级。目标是可靠的工程工作流，而非规避 Anthropic 政策。</p>

<p>请先完成干净的基础环境：<a href="/zh/guides/environment-cleanup-and-ip-setup/">环境清理与 IP 配置</a> 与 <a href="/zh/guides/vpn-and-proxy-selection/">VPN 与代理选型</a>，再调整 CLI 变量。若运营中转或多模型路由，请交叉阅读 <a href="/zh/guides/domestic-and-open-source-alternatives/">国产与开源平替</a> 中的降级路径。</p>

<h2>一、Claude Code 开发者安全环境配置</h2>
<p>Claude Code 在启动时读取 Shell 环境变量。时区、代理或 Base URL 不一致会导致莫名报错，或使 CLI 行为与浏览器会话脱节。应把终端视为与浏览器同等重要的运行环境。</p>

<h3>核心环境变量</h3>
<pre><code># ~/.zshrc 或 ~/.bashrc — 每个交互式 Shell 加载

# 1. 显式声明 Anthropic 兼容端点
export ANTHROPIC_BASE_URL="https://your-gateway.example.com"
export ANTHROPIC_API_KEY="sk-your-key"

# 2. 使用可信、形态接近官方的网关时，减少客户端不匹配告警
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 3. 终端时区与文档化的运营地区一致
export TZ=Asia/Tokyo   # 或 America/Los_Angeles — 与代理出口地理匹配

# 4. CLI HTTPS 走与浏览器相同的干净代理（如需要）
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export NO_PROXY="localhost,127.0.0.1,.internal"</code></pre>

<h3>配置检查清单</h3>
<ol>
  <li><strong>单一事实来源：</strong>将变量写入 <code>~/.zshrc</code>（macOS）或专用 <code>~/.claude/env</code> 并在 Shell 中 source——避免只在某个终端 tab 临时 export。</li>
  <li><strong>启动前验证：</strong>在启动 Claude Code 的同一窗口执行 <code>env | grep -E 'ANTHROPIC|TZ|PROXY'</code>。</li>
  <li><strong>浏览器与 CLI 地理一致：</strong>若浏览器 Profile 通过防指纹工具设为东京时区，CLI 不应仍报告 <code>Asia/Shanghai</code>。</li>
  <li><strong>Document Base URL 变更：</strong>从直连 Anthropic 切到中转时，同步更新内部 Runbook，避免团队成员混用 endpoint。</li>
  <li><strong>密钥卫生：</strong>勿将 API Key 提交仓库；env 文件 <code>chmod 600</code>，中转 Key 建议季度轮换。</li>
</ol>

<h3><code>_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL</code> 做什么、不做什么</h3>
<p>该标志让 Claude Code 在某些客户端检查中，将非默认 <code>ANTHROPIC_BASE_URL</code> 视作标准 Anthropic 端点，便于企业内网已审批网关接入。它<strong>不会</strong>改变服务端政策、计费或账号资格。关于客户端元数据仍可能被如何评估，见 <a href="/zh/guides/claude-steganography-and-risk-model/">Claude 隐写与风险模型</a>。</p>

<h3>常见误配故障</h3>
<ul>
  <li><strong>代理分裂：</strong>浏览器走 VPN、CLI 不走——请求来自不同 ASN。现象：网页聊天正常，CLI 403。</li>
  <li><strong><code>NO_PROXY</code> 过期：</strong>本机网关 <code>127.0.0.1</code> 须绕过公司代理，否则连接被重置。</li>
  <li><strong>Key 类型错误：</strong>组织 Key 与项目 Key 在限流下行为不同，请在 Anthropic 控制台确认类型。</li>
  <li><strong>交互式 vs 非交互 Shell：</strong>CI 调用 Claude Code 须 source 同一 env 文件；笔记本 login shell 常掩盖缺失 export。</li>
</ul>

<h2>二、第三方 API 中转网关选型规范</h2>
<p>当直连 <code>api.anthropic.com</code> 受路由或采购限制时，优质中转可提升可用性——前提是协议保真。劣质网关会静默剥离 Header、改写 Prompt 或引入延迟尖刺，表现像「模型变笨了」。</p>

<h3>网关评估矩阵</h3>
<table>
  <thead>
    <tr>
      <th>维度</th>
      <th>合格</th>
      <th>不合格（应更换）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Prompt Cache Header</td>
      <td>原样转发 <code>anthropic-beta: prompt-caching-2024-07-15</code>（或当前 beta）</td>
      <td>剥离 beta；cache_read 恒为 0</td>
    </tr>
    <tr>
      <td>System Prompt 完整性</td>
      <td>字节级一致 relay</td>
      <td>注入广告、水印或「帮助性」前缀</td>
    </tr>
    <tr>
      <td>流式 SSE</td>
      <td>保留事件边界与 tool delta</td>
      <td>缓冲完整响应再输出；破坏 tool UI</td>
    </tr>
    <tr>
      <td>错误透明</td>
      <td>透传 Anthropic 状态码与 body</td>
      <td>一切映射为泛化 502</td>
    </tr>
    <tr>
      <td>主机名中性</td>
      <td>中性域名（如 <code>api.yourcorp.net</code>）</td>
      <td>含无关 AI 厂商关键字或纯 Claude 流量走 <code>.cn</code> 域名</td>
    </tr>
    <tr>
      <td>TLS</td>
      <td>有效公网 CA、HSTS、无 MITM 拆链</td>
      <td>企业 SSL  inspection 未更新客户端信任库</td>
    </tr>
  </tbody>
</table>

<h3>Prompt Cache 保留（成本影响）</h3>
<p>Anthropic Prompt Caching 可将重复输入成本降低约 90%。丢弃 Cache Header 的中转会在每一轮按全价 input 计费——长 system prompt 场景常见 4–10 倍账单惊喜。用两次请求验证：</p>
<pre><code># 请求 1：创建缓存
curl -s "$ANTHROPIC_BASE_URL/v1/messages" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: prompt-caching-2024-07-15" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":64,
       "system":[{"type":"text","text":"'$(python3 -c "print('x'*5000)")'",
         "cache_control":{"type":"ephemeral"}}],
       "messages":[{"role":"user","content":"ping"}]}'

# 请求 2：usage 中应出现 cache_read_input_tokens &gt; 0</code></pre>
<p>深度优化见 <a href="/zh/guides/api-advanced-optimization/">API 高级优化</a>。</p>

<h3>上线前尽职调查</h3>
<ul>
  <li>24 小时合成探针（每 15 分钟一条消息），测 p95 延迟与错误率。</li>
  <li>采样 request ID，确认应用可将网关日志与上游 ID 关联排障。</li>
  <li>审阅数据处理协议：部分中转为滥用检测记录 Prompt—— regulated  workload 不可接受。</li>
  <li>处理源码时，优先 VPC 自建 LiteLLM、One-API，而非来源不明的公开 reseller。</li>
</ul>

<p>账号级稳定性仍取决于注册卫生——若接入中转 coincides 新建组织，请读 <a href="/zh/guides/account-registration-and-payment-antiban/">账号注册与支付防封</a>。</p>

<h2>三、配额超限（429）与平滑降级机制</h2>
<p>Anthropic 速率限制在组织与模型档位层面生效，而非单个 Key 孤立计算。Agent 突发、CI 并行与无界重试会耗尽共享配额，阻塞同 org 内无关服务。</p>

<h3>限制类型（简化）</h3>
<table>
  <thead>
    <tr>
      <th>信号</th>
      <th>HTTP</th>
      <th>含义</th>
      <th>安全响应</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>速率限制</td>
      <td>429</td>
      <td>每分钟请求/Token 过多</td>
      <td>指数退避 + 抖动；降并发</td>
    </tr>
    <tr>
      <td>上游过载</td>
      <td>529</td>
      <td>容量不足</td>
      <td>短退避；可选降模型档</td>
    </tr>
    <tr>
      <td>鉴权/政策</td>
      <td>403</td>
      <td>Key 无效或拒绝访问</td>
      <td>勿盲目重试；查账号状态</td>
    </tr>
    <tr>
      <td>错误请求</td>
      <td>400</td>
      <td>Schema 或 Token 上限</td>
      <td>修 payload；裁上下文</td>
    </tr>
  </tbody>
</table>

<h3>重试与降级模式</h3>
<pre><code>// TypeScript — 429/529 重试，持续压力时 failover
async function callClaudeWithFallback(prompt: string, opts: CallOpts) {
  const maxRetries = 4;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callClaudeAPI(prompt, opts);
    } catch (error: any) {
      const status = error?.status;
      if (status === 429 || status === 529) {
        const delay = Math.min(30_000, 500 * 2 ** attempt + Math.random() * 250);
        await sleep(delay);
        continue;
      }
      if (status === 403) throw error;
      throw error;
    }
  }
  console.warn('Claude 配额饱和，切至备份上游');
  return await callFallbackAPI(prompt, opts); // DeepSeek / GLM / 本地 — 见平替指南
}</code></pre>

<h3>并发控制</h3>
<ul>
  <li><strong>CI 令牌桶：</strong>每 org 限制并行 Agent 任务（如最多 3 个）。</li>
  <li><strong>请求合并：</strong>可能时将多文件 lint 修复合并为单次调用。</li>
  <li><strong>熔断：</strong>连续 N 次 429 后开路 60 秒并自动 failover——避免重试风暴。</li>
  <li><strong>可观测性：</strong>导出 <code>claude_requests_total{status}</code>、<code>fallback_invocations_total</code>、p95 延迟；fallback 率超 15% 持续 10 分钟则告警。</li>
</ul>

<h3>403 与 429：勿混为一谈</h3>
<p>429 是时间维度的压力——退避后恢复。403 常意味凭证吊销、地理限制或账号状态变化。未诊断就轮换 Key 盲目重试可能加速 enforcement。请用 <a href="/zh/guides/troubleshooting-guide/">故障排查指南</a> 分类错误后再动基础设施。</p>

<h2>常见问题</h2>

<h3>系统时区已正确，还要设 <code>TZ</code> 吗？</h3>
<p>若 OS、代理出口与浏览器 Profile 已对齐，显式 <code>TZ</code> 可能冗余——但 CI 容器常默认 UTC。显式 export 让笔记本与服务器行为可预期。</p>

<h3>公开 API  reseller 处理公司源码「安全」吗？</h3>
<p>视同任何第三方子处理器：审日志、保留期与子处理器清单。专有代码场景下，VPC 自建中转严格优于匿名 reseller。</p>

<h3>换网关后 Cache 省钱效果为何消失？</h3>
<p>最常见是中转剥离 <code>anthropic-beta</code> 或重排 system 块，导致 cache key 失效。任何网关变更后重做两次请求的 cache 测试。</p>

<h3>浏览器与 Claude Code 能否用不同代理？</h3>
<p>技术上可以，但 divergence 风险上升。除非实验账号隔离 Profile，否则 Claude 相关流量宜走同一条已文档化 egress。</p>

<h3>429 时 Claude Code 应降级到哪个模型？</h3>
<p>Claude Code 本身无内置多模型 failover——在网关（One-API/LiteLLM）实现，或暂时停用 Claude Code、改用指向备份 API 的 IDE 插件。路由表见 <a href="/zh/guides/domestic-and-open-source-alternatives/">国产与开源平替</a>。</p>

<h3>curl 成功、Claude Code 失败如何 debug？</h3>
<ol>
  <li>对比 Header：用 mitmproxy 或网关 access log 抓 curl vs CLI。</li>
  <li>确认启动 Shell 的 env：IDE 集成终端有时不加载 login rc。</li>
  <li>检查 Node/fetch 代理：部分版本须设 <code>GLOBAL_AGENT_HTTP_PROXY</code> 才认 <code>HTTPS_PROXY</code>。</li>
  <li>排查企业网 TLS  interception。</li>
</ol>

<h3>assume first-party base URL 会影响 Anthropic 计费吗？</h3>
<p>不会。计费跟随实际服务请求的 API Key 与组织。网关转发 Anthropic 则付 Anthropic；网关换模型则付网关所调 Provider。</p>
`,
};
