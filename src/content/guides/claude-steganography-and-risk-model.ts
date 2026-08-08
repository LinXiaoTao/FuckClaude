export const claude_steganography_and_risk_model_content = {
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
};
