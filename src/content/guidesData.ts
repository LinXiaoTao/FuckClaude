/**
 * Detailed guide content for the Anti-Ban & Environment Cleanup Knowledge Base.
 */

export interface ArticleContent {
  slug: string;
  title: { en: string; zh: string };
  category: { en: string; zh: string };
  readTime: string;
  updatedAt: string;
  content: {
    en: string;
    zh: string;
  };
}

export const ARTICLES_DATA: Record<string, ArticleContent> = {
  'claude-steganography-and-risk-model': {
    slug: 'claude-steganography-and-risk-model',
    category: { en: 'Risk Model & Steganography', zh: '风控解密与隐写原理' },
    title: {
      en: 'Claude Code Steganography & Anthropic 4-Layer Risk Model',
      zh: 'Claude Code 隐写暗记原理与 Anthropic 四维风控模型解密',
    },
    readTime: '8 min',
    updatedAt: '2026-08',
    content: {
      en: `
<h2>1. Claude Code Steganography Incident Analysis</h2>
<p>In April 2026, reverse-engineering of the official <code>@anthropic-ai/claude-code</code> CLI revealed that when users routed requests through a non-official endpoint via <code>ANTHROPIC_BASE_URL</code>, the CLI executed client-side detection logic without user disclosure:</p>

<ul>
  <li><strong>Timezone Check:</strong> Evaluated whether the system timezone was <code>Asia/Shanghai</code> or <code>Asia/Urumqi</code>. If matched, the date separator in the system prompt line <code>Today's date is 2026-06-30</code> was changed from hyphens to slashes: <code>2026/06/30</code>.</li>
  <li><strong>Host & Lab Keyword Blacklist:</strong> Cross-referenced the proxy host against a XOR-encrypted (key: 91) base64 list of 147+ domains and Chinese AI lab keywords (e.g., <code>deepseek</code>, <code>moonshot</code>, <code>zhipu</code>, <code>minimax</code>, <code>dashscope</code>, <code>*.cn</code>).</li>
  <li><strong>Unicode Apostrophe Substitution:</strong> Modified the apostrophe in "Today's date" using lookalike Unicode variants:
    <ul>
      <li>Host matched reseller domain list → replaced with <code>U+2019</code> (’ Right Single Quotation Mark)</li>
      <li>Host matched AI lab keywords → replaced with <code>U+02BC</code> (Modifier Letter Apostrophe)</li>
      <li>Matched both → replaced with <code>U+02B9</code> (Modifier Letter Prime)</li>
    </ul>
  </li>
</ul>

<p>This steganographic payload survived proxy forwarding, allowing Anthropic's backend classifiers to track distillation campaigns and unauthorized commercial resale without adding explicit HTTP headers.</p>

<h3>Environment Safeguards & Mitigations</h3>
<pre><code># 1. Tell client to treat custom endpoint as first-party
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Override system timezone for CLI executions
export TZ=Asia/Tokyo

# Launch Claude Code
claude</code></pre>

<h2>2. Anthropic's 4-Layer Risk Control Model</h2>
<p>Anthropic enforces a comprehensive anti-abuse and anti-distillation security pipeline across <code>claude.ai</code>, API endpoints, and Claude Code:</p>

<ol>
  <li><strong>Network & IP Layer:</strong> Data center IP ranges (AWS, Hetzner, DigitalOcean, Linode) are assigned high risk scores. Dedicated double-ISP residential IPs in supported regions (US, UK, SG, JP, TW) carry the lowest risk.</li>
  <li><strong>Browser & Device Fingerprint:</strong> Combines OS timezone (<code>Intl.DateTimeFormat</code>), browser language list (<code>navigator.languages</code>), Canvas width-probing for Chinese fonts (Microsoft YaHei, PingFang SC, MiSans), and User-Agent CH headers.</li>
  <li><strong>Payment & Identity Layer:</strong> High-risk virtual card BINs (e.g. over-issued prepaid card bins), mismatched billing address countries, and VoIP virtual phone numbers trigger instant subscription cancellation or payment rejection.</li>
  <li><strong>Behavioral & Distillation Classifiers:</strong> Automated scripts sending millions of repetitive prompts, high-frequency context window saturations, and prompt-caching misuse trigger automated account locks and organization quotas.</li>
</ol>
`,
      zh: `
<h2>一、 Claude Code 隐写暗记事件深度复盘</h2>
<p>据公开逆向分析，官方 <code>@anthropic-ai/claude-code</code> CLI 在通过 <code>ANTHROPIC_BASE_URL</code> 指向非官方中转端点时，曾在客户端隐蔽运行了一套隐写标记检测机制：</p>

<ul>
  <li><strong>系统时区检测：</strong> 检查操作系统时区是否为 <code>Asia/Shanghai</code> 或 <code>Asia/Urumqi</code>。若命中，会将其注入 system prompt 的 <code>Today's date is 2026-06-30</code> 日期分隔符由短横线 <code>-</code> 替换为斜杠 <code>/</code>（如 <code>2026/06/30</code>）。</li>
  <li><strong>域名黑名单与实验室关键字：</strong> 读取中转主机名，匹配内嵌的 147+ 域名与国内 AI 实验室关键字（如 <code>deepseek</code>、<code>moonshot</code>、<code>zhipu</code>、<code>minimax</code>、<code>dashscope</code> 以及所有 <code>*.cn</code> 域名）。列表在二进制中经过 XOR（密钥 91）与 Base64 加密。</li>
  <li><strong>Unicode 撇号隐写替换：</strong> 将 "Today's date" 中的撇号替换为视觉几乎一致的 Unicode 变体：
    <ul>
      <li>命中中转黑名单域名 → 替换为 <code>U+2019</code> (右单引号 ’)</li>
      <li>命中 AI 实验室关键字 → 替换为 <code>U+02BC</code> (修饰符撇号)</li>
      <li>同时命中两者 → 替换为 <code>U+02B9</code> (修饰符角标)</li>
    </ul>
  </li>
</ul>

<p>这种隐写标记能在不添加任何 HTTP Header 的情况下穿透中转代理，被 Anthropic 后端模型与分类器识别，用于精准标记模型蒸馏（Distillation）与未经授权的转售行为。</p>

<h3>防护与规避命令</h3>
<pre><code># 1. 告知客户端将自定义中转视作原生端点（跳过隐写检测）
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. 运行时强制覆盖系统时区（如日本/新加坡时区）
export TZ=Asia/Tokyo

# 启动 Claude Code
claude</code></pre>

<h2>二、 Anthropic 四维复合风控体系</h2>
<p>Anthropic 在 <code>claude.ai</code> 网页端、API 接口及 Claude Code 客户端构建了全方位的风控模型：</p>

<ol>
  <li><strong>网络与 IP 属性：</strong> 绝大多数数据中心机房 IP（如 AWS、Hetzner、搬瓦工、DigitalOcean）都会被赋予高风险权重；而位于支持地区（如美国、英国、新加坡、日本、台湾）的原生双 ISP 住宅家宽 IP 风险最低。</li>
  <li><strong>环境与指纹层：</strong> 综合评估系统时区（<code>Intl.DateTimeFormat</code>）、浏览器语言列表（<code>navigator.languages</code>）、Canvas 字体探测（微软雅黑、苹方、MiSans/鸿蒙黑体等）及设备品牌。</li>
  <li><strong>支付与身份校验：</strong> 虚拟信用卡卡头（BIN）、账单地址国家与 IP 国家一致性对齐，以及接码用的手机号段（VoIP 虚拟号直接拒绝）。</li>
  <li><strong>行为与蒸馏模型：</strong> 自动化脚本高频并发请求、异常上下文饱和攻击以及破坏 Prompt Cache 的请求模式，会触发 429 Rate Limit 与账户判定。</li>
</ol>
`,
    },
  },

  'environment-cleanup-and-ip-setup': {
    slug: 'environment-cleanup-and-ip-setup',
    category: { en: 'Environment Cleanup & IP Setup', zh: '环境纯化与 IP 配置' },
    title: {
      en: 'OS & Browser Environment Cleanup & Residential IP Guide',
      zh: '操作系统/浏览器环境纯化与原生住宅 IP 配置指南',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
    content: {
      en: `
<h2>1. Operating System & Browser Locale Purification</h2>
<p>To reduce environment risk scores on tools like Fuck Claude, bring your OS timezones, Intl locales, and browser language settings into alignment with supported regions (e.g. <code>America/Los_Angeles</code>, <code>Asia/Tokyo</code>, <code>Asia/Singapore</code>):</p>

<h3>macOS / Linux Command Line Cleanup</h3>
<pre><code># macOS: Set system timezone to Tokyo or Los Angeles
sudo systemsetup -settimezone Asia/Tokyo

# Linux (Ubuntu/Debian)
sudo timedatectl set-timezone Asia/Tokyo

# Verify current timezone
date
# Output: Tue Aug  4 11:42:00 JST 2026</code></pre>

<h3>Browser Language & Font Fingerprint Setup</h3>
<ul>
  <li><strong>Language Order:</strong> Place <code>en-US</code> or <code>ja-JP</code> at the top of <code>navigator.languages</code>. Move <code>zh-CN</code> below <code>en-US</code> or remove it.</li>
  <li><strong>Intl Locale:</strong> Ensure <code>Intl.DateTimeFormat().resolvedOptions().locale</code> resolves to <code>en-US</code> or <code>ja-JP</code>.</li>
  <li><strong>Chinese Font Isolation:</strong> Chinese vendor fonts (MiSans, HarmonyOS Sans, OPPO Sans) produce strong fingerprint matches via Canvas width probing. Use isolated browser profiles or anti-detect browsers when logging into <code>claude.ai</code>.</li>
</ul>

<h2>2. Proxy Nodes, Native Residential IPs & WebRTC Protection</h2>
<p>Anthropic continuously blocks data center ASNs. Ensure your routing meets the following standards:</p>

<ul>
  <li><strong>Double ISP Residential IPs:</strong> Prefer residential proxies with residential ISP ASN tags (e.g., AT&T, Verizon, Comcast, NTT, SoftBank). Avoid cheap cloud VPS IPs.</li>
  <li><strong>WebRTC Leak Prevention:</strong> Browsers can leak local LAN/WAN IPs through WebRTC RTCPeerConnection candidates. Disable WebRTC or use extensions like <em>WebRTC Control</em> to block STUN requests.</li>
  <li><strong>DNS Leak Prevention:</strong> Do not route DNS queries through Chinese public DNS (223.5.5.5 / 119.29.29.29) for <code>claude.ai</code> domains. Use remote DNS resolution (DoH / DoT) via Cloudflare (1.1.1.1) or Google (8.8.8.8).</li>
</ul>

<h2>3. Anti-Detect Browser Isolation Checklist</h2>
<p>For batch account management or high-value Claude accounts, anti-detect browsers (e.g., Roxy Browser) isolate underlying browser fingerprints:</p>

<ol>
  <li>Create a dedicated physical profile per account.</li>
  <li>Bind each profile to a dedicated residential proxy IP.</li>
  <li>Enable Canvas noise, WebGL mask, and AudioContext masking.</li>
  <li>Sync profile timezone automatically with the proxy exit IP geo.</li>
</ol>
`,
      zh: `
<h2>一、 操作系统与浏览器环境纯化</h2>
<p>要降低环境风险评分，需将操作系统时区、Intl 区域以及浏览器语言列表同步修改至支持地区（如 <code>America/Los_Angeles</code>、<code>Asia/Tokyo</code> 或 <code>Asia/Singapore</code>）：</p>

<h3>macOS / Linux 系统级纯化命令</h3>
<pre><code># macOS: 将系统时区设置为日本东京或美国洛杉矶
sudo systemsetup -settimezone Asia/Tokyo

# Linux (Ubuntu/Debian)
sudo timedatectl set-timezone Asia/Tokyo

# 检查当前系统时区
date
# 输出示例: Tue Aug  4 11:42:00 JST 2026</code></pre>

<h3>浏览器语言与字体指纹调整</h3>
<ul>
  <li><strong>语言优先级：</strong> 将 <code>en-US</code> 或 <code>ja-JP</code> 置于 <code>navigator.languages</code> 列表首位，移除或下调 <code>zh-CN</code>。</li>
  <li><strong>Intl 区域格式：</strong> 确保 <code>Intl.DateTimeFormat().resolvedOptions().locale</code> 解析为 <code>en-US</code> 或 <code>ja-JP</code>。</li>
  <li><strong>字体指纹隔离：</strong> 国产厂商字体（如 MiSans、鸿蒙黑体、OPPO Sans）是 Canvas 宽度探测的强信号。登录 <code>claude.ai</code> 时建议使用干净独立的浏览器 Profile 或防指纹浏览器。</li>
</ul>

<h2>二、 节点选择、原生住宅 IP 与 WebRTC 防泄露</h2>
<p>Anthropic 对机房 IP 段封控极严，网络配置需满足以下要求：</p>

<ul>
  <li><strong>原生双 ISP 住宅 IP：</strong> 优先选择带住宅 ISP ASN 标识的代理节点（如 AT&T、Verizon、Comcast、NTT、SoftBank 等），避免使用常见的便宜机房 VPS IP。</li>
  <li><strong>防 WebRTC 泄露：</strong> 浏览器可能通过 WebRTC RTCPeerConnection 泄露内网 IP 或真实的公网 IP。建议在浏览器设置中禁用 WebRTC，或使用 <em>WebRTC Control</em> 插件阻断 STUN 探测。</li>
  <li><strong>防 DNS 污染与泄露：</strong> 访问 <code>claude.ai</code> 时避免使用国内公共 DNS（223.5.5.5 / 119.29.29.29），配置 Clash / Sing-box 的远程 DoH / DoT 解析（1.1.1.1 / 8.8.8.8）。</li>
</ul>

<h2>三、 防指纹浏览器多账号物理隔离</h2>
<p>对于工作室或多账号养号场景，使用防指纹浏览器（如 Roxy 浏览器）可实现底层的真实隔离：</p>

<ol>
  <li>每个账号创建独立的物理 Profile 环境。</li>
  <li>绑定专属的原生住宅代理 IP。</li>
  <li>开启 Canvas 噪声伪装、WebGL 掩码与 AudioContext 隔离。</li>
  <li>配置 Profile 时区自动跟随出口 IP 归属地。</li>
</ol>
`,
    },
  },

  'account-registration-and-payment-antiban': {
    slug: 'account-registration-and-payment-antiban',
    category: { en: 'Account & Payment Safety', zh: '账号注册与支付避坑' },
    title: {
      en: 'Safe Account Registration, Virtual Card BIN & Payment Risk Avoidance',
      zh: 'Claude 账号注册避坑、虚拟卡 BIN 选择与高胜率订阅指南',
    },
    readTime: '9 min',
    updatedAt: '2026-08',
    content: {
      en: `
<h2>1. Phone Verification & Service Provider Traps</h2>
<p>Anthropic enforces phone verification upon registration and suspicious login. Virtual VoIP numbers (Google Voice, TextNow, Skype) are strictly blocked:</p>

<ul>
  <li><strong>Use Real Physical SIM Services:</strong> Choose verification platforms that provide real physical carrier SIMs (e.g. NexSMS) from US, UK, SG, or JP.</li>
  <li><strong>Avoid Shared Public Pool Numbers:</strong> Numbers that have been used to register dozens of Claude or ChatGPT accounts are flagged; reusing them can link your new account to previously banned entities.</li>
  <li><strong>Enable 2FA Authenticator Immediately:</strong> After signing up, bind TOTP 2FA (Google Authenticator, 1Password) to prevent re-verification prompts on new IP connections.</li>
</ul>

<h2>2. Virtual Credit Card BINs & Billing Address Matching</h2>
<p>Payment rejections and "Refunded / Suspended" subscription status are frequently caused by credit card BIN risk filters:</p>

<ul>
  <li><strong>High-Pass BIN Categories:</strong> Prefer US visa/mastercard debit/credit BINs issued by established US fintech banks (e.g. 485932, 532959, 428803). Avoid prepaid cards with over-issued BINs.</li>
  <li><strong>Strict Address Alignment:</strong> Fill out the billing address using a real address matching the state and zip code of your current proxy IP exit.</li>
  <li><strong>Sufficient Card Balance:</strong> Ensure your card balance has at least $25 USD before binding to prevent initial $1 pre-authorization temporary hold failures.</li>
</ul>

<h2>3. Preventing Account Association Bans</h2>
<p>Anthropic links accounts using <code>organizationUuid</code>, shared payment cards, and machine environments:</p>

<pre><code># Check local Claude Code organization UUID grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>Never bind the same credit card to more than 2 Claude Pro / Team accounts.</li>
  <li>Never use the same phone number across multiple commercial accounts.</li>
  <li>Avoid running parallel heavy sessions under the same <code>organizationUuid</code> across different machines.</li>
</ul>
`,
      zh: `
<h2>一、 手机号接码与号段避坑</h2>
<p>Anthropic 注册和异地登录风控触发时都需要手机验证，虚拟 VoIP 号码（如 Google Voice、TextNow）已被全面封禁：</p>

<ul>
  <li><strong>选择实体卡接码服务：</strong> 优先选择使用真实本地运营商实体卡（如 NexSMS 等平台）的美国、英国、新加坡或日本卡号。</li>
  <li><strong>避开公共共享池号段：</strong> 被反复接码 ChatGPT 或 Claude 的卡号号段会被系统标记，新注册账号易被关联封锁。</li>
  <li><strong>立即绑定 2FA 身份验证器：</strong> 注册成功后第一时间绑定 TOTP 双重验证（Google Authenticator、1Password），避免更换 IP 时重新触发手机短信验证。</li>
</ul>

<h2>二、 虚拟信用卡 BIN 选择与账单地址对齐</h2>
<p>订阅 Claude Pro / Team 被拒绝或扣款后遭遇 "Refunded / Suspended" 退款封号，大多是因为卡头（BIN）风控或账单不匹配：</p>

<ul>
  <li><strong>挑选高通过率 BIN 卡头：</strong> 优先使用由美国/企业正规银行发行的 Visa/Mastercard 卡头（如 485932、532959、428803 等），避开滥用严重的大众预付卡段。</li>
  <li><strong>账单地址对齐 IP 归属地：</strong> 填写的账单地址（Billing Address）尽量使用真实美国/支持国地址，且邮编（Zip Code）与州（State）需与当前出口 IP 一致。</li>
  <li><strong>卡内预留充足余额：</strong> 绑卡前确保卡内至少有 25 美元额度，避免 1 美元预扣款验证失败或扣款扣失败触发即时风控。</li>
</ul>

<h2>三、 避免账号关联批量连带封号</h2>
<p>Anthropic 会通过 <code>organizationUuid</code>、同卡号以及同机环境进行账号关联打标：</p>

<pre><code># 查询本地 Claude Code 配置中的组织 UUID 归属
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>切勿将同一张信用卡绑定超过 2 个以上的 Claude Pro / Team 账号。</li>
  <li>切勿在多个商业账号间复用同一个接码手机号。</li>
  <li>避免在同一台机器的不同 Profile 间频繁切换同卡账号，防止组织 UUID 共享配额池与风控传染。</li>
</ul>
`,
    },
  },

  'claude-code-and-api-safety': {
    slug: 'claude-code-and-api-safety',
    category: { en: 'Claude Code & API Safety', zh: 'Claude Code 与 API 规范' },
    title: {
      en: 'Claude Code Safe Configuration & Relay API Best Practices',
      zh: 'Claude Code 安全配置与第三方 API 中转平滑降级规范',
    },
    readTime: '7 min',
    updatedAt: '2026-08',
    content: {
      en: `
<h2>1. Claude Code Security Configurations</h2>
<p>When using Claude Code with proxy gateways or custom endpoints, prevent client fingerprint leakage with proper shell environment variables:</p>

<pre><code># ~/.zshrc or ~/.bashrc configuration

# 1. Bypass client steganographic checks for custom base URL
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Force non-China timezone in terminal
export TZ=Asia/Tokyo

# 3. Route CLI outbound traffic through a clean proxy
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"</code></pre>

<h2>2. Selecting API Relay Gateways</h2>
<p>If direct access to <code>api.anthropic.com</code> is constrained, selecting reliable API gateways ensures high availability without unexpected account blocks:</p>

<ul>
  <li><strong>Prompt Cache Preservation:</strong> Ensure the gateway supports Anthropic prompt caching headers (<code>anthropic-beta: prompt-caching-2024-01-26</code>). Poorly implemented relays strip caching headers, causing input token costs to surge 4x to 10x.</li>
  <li><strong>Unmodified System Prompts:</strong> High-quality gateways relay payloads transparently without injecting custom prompt banners or altering model output streams.</li>
  <li><strong>Neutral Hostnames:</strong> Avoid proxy hostnames containing Chinese AI lab keywords (<code>deepseek</code>, <code>zhipu</code>, <code>moonshot</code>) or <code>*.cn</code> domain suffixes.</li>
</ul>

<h2>3. Rate Limits (429) & Smooth Failover</h2>
<p>Anthropic enforces Rate Limits per organization rather than per API Key. Implement smooth error handling and fallback models in your code or gateway configuration:</p>

<pre><code>// Example TypeScript retry and failover logic
async function callClaudeWithFallback(prompt: string) {
  try {
    return await callClaudeAPI(prompt);
  } catch (error: any) {
    if (error?.status === 429 || error?.status === 403) {
      console.warn('Claude API constrained, falling back to DeepSeek R1 / GLM-4...');
      return await callFallbackAPI(prompt);
    }
    throw error;
  }
}</code></pre>
`,
      zh: `
<h2>一、 Claude Code 开发者安全环境配置</h2>
<p>在使用 Claude Code 搭配自定义端点或代理转发时，可通过配置环境变量避免客户端隐写打标与环境泄露：</p>

<pre><code># 在 ~/.zshrc 或 ~/.bashrc 中添加配置

# 1. 告知客户端将自定义端点视作原生端点，跳过隐写校验
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. 终端环境变量强制覆盖系统时区为日本东京
export TZ=Asia/Tokyo

# 3. 规范配置本地代理转发
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"</code></pre>

<h2>二、 第三方 API 中转网关选型规范</h2>
<p>在直连 <code>api.anthropic.com</code> 困难的场景下，选择优质 API 中转网关需关注以下维度：</p>

<ul>
  <li><strong>完整支持 Prompt Cache：</strong> 确保中转网关完整透传 Anthropic 的 Prompt Caching 请求头（<code>anthropic-beta: prompt-caching-2024-01-26</code>）。劣质中转丢弃 Cache 请求头会导致长上下文对话 Token 消耗暴增 4 到 10 倍。</li>
  <li><strong>System Prompt 原样透传：</strong> 优质网关不会在中途改写系统 Prompt 或注入广告文本，保障输出的原汁原味与安全性。</li>
  <li><strong>中转主机名保持中性：</strong> 代理 Host 域名应避开国内 AI 实验室关键字（<code>deepseek</code>、<code>zhipu</code>、<code>moonshot</code>）以及 <code>*.cn</code> 顶级后缀。</li>
</ul>

<h2>三、 配额超限（429）与平滑降级机制</h2>
<p>Anthropic 的速率限制（Rate Limit）是按组织（Organization）而非单个 Key 进行计费与调度的。在代码或网关侧配置平滑降级可保障服务连续性：</p>

<pre><code>// TypeScript 示例：捕捉 429/403 自动平滑降级
async function callClaudeWithFallback(prompt: string) {
  try {
    return await callClaudeAPI(prompt);
  } catch (error: any) {
    if (error?.status === 429 || error?.status === 403) {
      console.warn('Claude 接口受限，自动平滑切至 DeepSeek R1 / GLM-4 灾备接口...');
      return await callFallbackAPI(prompt);
    }
    throw error;
  }
}</code></pre>
`,
    },
  },

  'account-appeal-and-recovery-sop': {
    slug: 'account-appeal-and-recovery-sop',
    category: { en: 'Account Appeal & Recovery SOP', zh: '封号诊断与申诉自救' },
    title: {
      en: 'Account Ban Diagnosis & High-Success English Appeal SOP',
      zh: 'Claude 封号类型判定与高成功率英文申诉自救 SOP',
    },
    readTime: '8 min',
    updatedAt: '2026-08',
    content: {
      en: `
<h2>1. Account Status & Ban Type Diagnosis</h2>
<p>When an account encounters access issues, first identify the exact ban type to choose the appropriate recovery action:</p>

<ul>
  <li><strong>IP Region Block (Access Denied / 403):</strong> "Claude is not available in your region". Solution: Your account is fine; update your proxy node to a residential IP in a supported country (US, UK, SG, JP).</li>
  <li><strong>Subscription Forced Refund (Refunded):</strong> Payment failed or card BIN was blacklisted. The account reverts to Free tier or Pro subscription is canceled. Solution: Update payment method with a high-pass US credit card.</li>
  <li><strong>Account Permanently Disabled (Disabled):</strong> "Your account has been disabled after review". Solution: Submit a formal English appeal via Anthropic Support.</li>
</ul>

<h2>2. High-Success English Appeal SOP</h2>
<p>When appealing a disabled account, frame your usage as an overseas business user or legitimate international traveler rather than arguing TOS technicalities:</p>

<h3>Proven English Appeal Email Template</h3>
<pre><code>Subject: Urgent: Appeal for Disabled Claude Account [Your-Email@domain.com]

Dear Anthropic Support Team,

I am writing to respectfully request a review of my account (Email: [Your-Email@domain.com]), which was recently disabled.

I use Claude Pro/Team primarily for software engineering and academic research. As an international developer who frequently travels for business, I suspect that accessing my account while travelling across different regional networks (e.g. hotel Wi-Fi and corporate roaming proxies) may have triggered an automated security flag.

I confirm that my usage strictly complies with Anthropic's Terms of Service and Usage Policies. I do not engage in any automated scraping, resale, or unauthorized proxying.

Could you please review my account activity and assist in restoring access? I am happy to provide any verification details necessary.

Thank you for your time and assistance.

Best regards,
[Your Name]
[Your Contact Phone / Business Domain]</code></pre>

<h2>3. Subscription Refund & Chargeback SOP</h2>
<p>If your account was disabled immediately after paying for Claude Pro or Team:</p>

<ol>
  <li>Submit the appeal email above first.</li>
  <li>If no response is received within 5 business days, reply to your Stripe payment receipt email to request an official refund.</li>
  <li>If necessary, contact your virtual card issuing bank to initiate an authorized service non-delivery dispute.</li>
</ol>
`,
      zh: `
<h2>一、 封号类型与异常现象判定</h2>
<p>遇到账号无法正常使用时，首先需明确具体的拦截类型，采取针对性的解决措施：</p>

<ul>
  <li><strong>IP 节点地区阻断（403 / Access Denied）：</strong> 提示 "Claude is not available in your region"。判定：账号本身安全，仅为当前代理节点被识别为受限地区。解决：切换至支持地区（美国、英国、新加坡、日本）的原生住宅代理节点。</li>
  <li><strong>订阅被迫退款（Refunded）：</strong> 扣款失败或信用卡 BIN 触发风控，Pro 订阅被强行退款取消，账号退回 Free 档。解决：更换高胜率美国虚拟卡重新绑定。</li>
  <li><strong>账号彻底禁用（Disabled / Suspended）：</strong> 提示 "Your account has been disabled after review"。判定：账号被系统判定违规或触发黑名单。解决：通过 Anthropic 客服提交英文申诉邮件。</li>
</ul>

<h2>二、 高成功率英文申诉自救 SOP</h2>
<p>申诉被禁用的账号时，切忌强行辩驳技术细节，建议将场景定位为合法合规的海外跨境业务用户或出差开发人员：</p>

<h3>高成功率英文申诉邮件模板</h3>
<pre><code>Subject: Urgent: Appeal for Disabled Claude Account [你的注册邮箱]

Dear Anthropic Support Team,

I am writing to respectfully request a review of my account (Email: [你的注册邮箱]), which was recently disabled.

I use Claude Pro/Team primarily for software engineering and academic research. As an international developer who frequently travels for business, I suspect that accessing my account while travelling across different regional networks (e.g. hotel Wi-Fi and corporate roaming proxies) may have triggered an automated security flag.

I confirm that my usage strictly complies with Anthropic's Terms of Service and Usage Policies. I do not engage in any automated scraping, resale, or unauthorized proxying.

Could you please review my account activity and assist in restoring access? I am happy to provide any verification details necessary.

Thank you for your time and assistance.

Best regards,
[你的姓名/拼音]
[联系电话/公司或项目域名]</code></pre>

<h2>三、 扣款争议与退款处理流程</h2>
<p>如果刚充值 Claude Pro / Team 即遭遇封号：</p>

<ol>
  <li>优先发送上述英文申诉邮件申请解封。</li>
  <li>若 5 个工作日内未获回复，可在 Stripe 发送的扣款收据邮件中点击 Support 申请退款。</li>
  <li>联系虚拟卡卡组织发起未提供服务（Service Non-Delivery）扣款申诉。</li>
</ol>
`,
    },
  },

  'domestic-and-open-source-alternatives': {
    slug: 'domestic-and-open-source-alternatives',
    category: { en: 'Domestic Models & Failover', zh: '平替模型与灾备方案' },
    title: {
      en: 'Seamless Failover to Domestic AI Models & Local Open-Source Setups',
      zh: '国产顶尖模型平替指引与私有化 Ollama/One-API 降级通道',
    },
    readTime: '6 min',
    updatedAt: '2026-08',
    content: {
      en: `
<h2>1. Domestic Top-Tier Model Comparisons</h2>
<p>When Claude direct access or API rates are constrained, domestic frontier models offer zero-latency, hassle-free alternatives for coding and reasoning:</p>

<ul>
  <li><strong>DeepSeek R1 / V3:</strong> Outstanding performance in complex code generation, logical reasoning, and long-context analysis at ultra-low API costs.</li>
  <li><strong>Kimi / Kimi Code:</strong> Strong long-context handling (2M+ tokens) and smooth Chinese/English developer workflows.</li>
  <li><strong>GLM-4 / Zhipu AI:</strong> Comprehensive enterprise-grade API capabilities, function calling, and structured JSON outputs.</li>
</ul>

<h2>2. Setting Up Private Ollama & One-API Claude Compatibility</h2>
<p>You can set up a local or private drop-in API replacement layer that mimics the Anthropic API format, allowing your development tools to continue functioning seamlessly during Claude outages:</p>

<h3>Ollama Local Claude Route Setup</h3>
<pre><code># 1. Install Ollama and pull DeepSeek / Qwen coding model
ollama run deepseek-r1:14b

# 2. Deploy One-API / LiteLLM proxy
# One-API converts OpenAI/Ollama endpoints into Anthropic Claude API format
docker run -d --name one-api -p 3000:3000 -v ./data:/data justsong/one-api

# 3. Configure your local CLI / tools
export ANTHROPIC_BASE_URL="http://localhost:3000"
export ANTHROPIC_API_KEY="sk-one-api-key"</code></pre>

<h2>3. Hybrid Model Routing Strategy</h2>
<p>Combine Claude for complex initial architecture drafting with DeepSeek/GLM for daily code refactoring and test generation to achieve 90% cost savings and zero risk of project blocking.</p>
`,
      zh: `
<h2>一、 国产顶尖大模型平替体验对比</h2>
<p>在 Claude 账号受限或 API 成本高昂时，国内顶尖大模型在代码能力与长上下文推理上已具备强劲替代实力：</p>

<ul>
  <li><strong>DeepSeek R1 / V3：</strong> 极其出色的代码生成、复杂逻辑推理与长上下文重构能力，API 价格极低且无需科学上网。</li>
  <li><strong>Kimi / Kimi Code：</strong> 200 万字长上下文理解能力，深度优化代码阅读与中文技术文档理解。</li>
  <li><strong>GLM-4 (智谱 AI)：</strong> 稳定健全的企业级 API 接口、Function Calling 工具调用与结构化 JSON 输出。</li>
</ul>

<h2>二、 搭建本地 Ollama + One-API 私有化 Claude 降级通道</h2>
<p>通过搭建兼容 Anthropic API 格式的本地网关，可在 Claude 发生断连或封号时，无缝切至本地或私有化灾备接口：</p>

<h3>Ollama + One-API 快速配置步骤</h3>
<pre><code># 1. 安装 Ollama 并运行 DeepSeek / Qwen 代码模型
ollama run deepseek-r1:14b

# 2. 部署 One-API 统一接口网关
# One-API 可将 Ollama/DeepSeek/GLM 转换为标准的 Anthropic Claude 格式
docker run -d --name one-api -p 3000:3000 -v ./data:/data justsong/one-api

# 3. 配置本地环境变量直连降级网关
export ANTHROPIC_BASE_URL="http://localhost:3000"
export ANTHROPIC_API_KEY="sk-one-api-key"</code></pre>

<h2>三、 混合模型调度最佳实践</h2>
<p>建议将复杂架构设计与核心算法交由 Claude 处理，而日常代码重构、单元测试编写与文档生成切至 DeepSeek / Kimi 运行，既能降低 90% 资费，又可确保开发流水线绝对稳健。回退路径简单、零封号风险。例如你可以在本站推荐的 <a href="https://www.kimi.com/code?utm_source=fuck-claude" target="_blank">Kimi Code</a>、<a href="https://www.deepseek.com/?utm_source=fuck-claude" target="_blank">DeepSeek</a> 或 <a href="https://bigmodel.cn/?utm_source=fuck-claude" target="_blank">GLM</a> 中一键体验。
`,
    },
  },
};
