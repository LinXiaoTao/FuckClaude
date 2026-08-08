export const environment_cleanup_and_ip_setup_content = {
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
<p>For batch account management or high-value Claude accounts, anti-detect browsers isolate underlying browser fingerprints:</p>

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
<p>对于工作室或多账号养号场景，使用防指纹浏览器可实现底层的真实隔离：</p>

<ol>
  <li>每个账号创建独立的物理 Profile 环境。</li>
  <li>绑定专属的原生住宅代理 IP。</li>
  <li>开启 Canvas 噪声伪装、WebGL 掩码与 AudioContext 隔离。</li>
  <li>配置 Profile 时区自动跟随出口 IP 归属地。</li>
</ol>
`,
};
