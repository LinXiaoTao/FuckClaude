export const environment_cleanup_and_ip_setup_content = {
  en: `
<h2>1. Operating System & Browser Locale Alignment</h2>
<p>When your OS timezone, system locale, browser language list, and network exit region disagree, automated risk systems may flag the session—even for legitimate users accessing Claude from supported countries via VPN or while traveling. The practical goal is to <strong>align your environment with your account region</strong> so signals read consistently, reducing false positives rather than attempting to hide your identity entirely.</p>

<p>This guide focuses on system-level and browser-level hygiene. For per-browser settings in Chrome, Firefox, and Edge, see the <a href="/guides/browser-configuration-guide/">Browser Configuration Guide</a>. For macOS, Windows, Linux, and mobile specifics, see the <a href="/guides/device-setup-guide/">Cross-Platform Device Setup guide</a>.</p>

<h3>Why Mismatches Trigger Reviews</h3>
<p>Fraud vendors correlate <code>Intl</code> locale, <code>navigator.languages</code>, timezone offset, font metrics, and IP geolocation. A Tokyo IP with a Beijing timezone and <code>zh-CN</code> as the primary browser language differs from typical regional users—the pattern automated rules target.</p>

<h3>macOS / Linux Timezone Commands</h3>
<pre><code># macOS: Set system timezone to match your account region
sudo systemsetup -settimezone "America/Los_Angeles"
# Or for JP/SG accounts:
sudo systemsetup -settimezone "Asia/Tokyo"

# Linux (Ubuntu/Debian)
sudo timedatectl set-timezone America/Los_Angeles

# Verify
date
# Expected: local time matching proxy exit region (PST, JST, etc.)</code></pre>

<h3>Browser Language & Font Fingerprint Checklist</h3>
<ul>
  <li><strong>Language order:</strong> Place <code>en-US</code> (US accounts) or <code>ja-JP</code> (JP accounts) first in <code>navigator.languages</code>. Move <code>zh-CN</code> below English or remove it from the active profile used for Claude.</li>
  <li><strong>Intl locale:</strong> Confirm <code>Intl.DateTimeFormat().resolvedOptions().locale</code> resolves to your target region (e.g. <code>en-US</code>, not <code>zh-CN</code>).</li>
  <li><strong>Chinese vendor fonts:</strong> MiSans, HarmonyOS Sans, and OPPO Sans produce distinctive Canvas width measurements. Use a dedicated browser profile without these fonts installed system-wide, or use an isolated anti-detect profile.</li>
  <li><strong>Accept-Language header:</strong> Should match your top <code>navigator.languages</code> entry; mismatches between HTTP headers and JS APIs are a known detection vector (explained in our <a href="/guides/claude-steganography-and-risk-model/">Risk Model guide</a>).</li>
</ul>

<h3>OS Locale vs Account Region</h3>
<table>
  <thead>
    <tr>
      <th>Signal</th>
      <th>US Account Target</th>
      <th>JP/SG Account Target</th>
      <th>Common Mistake</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>System timezone</td>
      <td>America/Los_Angeles or America/New_York</td>
      <td>Asia/Tokyo or Asia/Singapore</td>
      <td>Leaving Asia/Shanghai while on US IP</td>
    </tr>
    <tr>
      <td>Primary browser language</td>
      <td>en-US</td>
      <td>en-US or ja-JP</td>
      <td>zh-CN first in language list</td>
    </tr>
    <tr>
      <td>Date/number format</td>
      <td>MM/DD/YYYY, USD</td>
      <td>Locale-appropriate</td>
      <td>CNY symbol in Intl.NumberFormat</td>
    </tr>
    <tr>
      <td>Installed CJK fonts</td>
      <td>Minimal or profile-isolated</td>
      <td>Minimal or profile-isolated</td>
      <td>Full OEM Chinese font stack</td>
    </tr>
  </tbody>
</table>

<h2>2. Proxy Nodes, Residential IPs & Leak Prevention</h2>
<p>Anthropic aggressively filters datacenter ASNs. Aligning your IP with a residential ISP in your account's country is the baseline for stable access—not a guarantee against all bans, but a necessary condition to avoid instant blocks. Read the full <a href="/guides/vpn-and-proxy-selection/">VPN & Proxy Selection guide</a> for provider evaluation criteria.</p>

<h3>IP Type Comparison</h3>
<table>
  <thead>
    <tr>
      <th>IP Category</th>
      <th>ASN Profile</th>
      <th>Typical Claude Access</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Residential ISP (AT&T, Comcast, NTT)</td>
      <td>Consumer broadband</td>
      <td>Best stability</td>
      <td>Match state/city to billing when possible</td>
    </tr>
    <tr>
      <td>Mobile carrier IP (4G/5G)</td>
      <td>Cellular ISP</td>
      <td>Good for travel scenarios</td>
      <td>IPs rotate; avoid mid-session switches</td>
    </tr>
    <tr>
      <td>Datacenter / VPS</td>
      <td>Cloud provider ASN</td>
      <td>Often blocked or CAPTCHA-heavy</td>
      <td>Not recommended for registration</td>
    </tr>
    <tr>
      <td>Shared cheap proxy pool</td>
      <td>Mixed, frequently abused</td>
      <td>High ban rate</td>
      <td>One bad neighbor affects entire pool</td>
    </tr>
  </tbody>
</table>

<h3>WebRTC Leak Prevention</h3>
<p>Browsers can expose local or true public IPs through WebRTC even when HTTP traffic uses a proxy—a US proxy in headers plus a CN residential IP in WebRTC is a high-confidence mismatch.</p>
<ul>
  <li>Disable WebRTC in browser settings or via extensions like <em>WebRTC Control</em> set to "Disable non-proxied UDP".</li>
  <li>In Firefox, set <code>media.peerconnection.enabled = false</code> in <code>about:config</code>.</li>
  <li>Test at browserleaks.com/webrtc after every proxy or profile change.</li>
</ul>

<h3>DNS Leak Prevention</h3>
<ul>
  <li>Do not resolve <code>claude.ai</code> through Chinese public DNS (223.5.5.5, 119.29.29.29) while presenting a US IP—DNS geolocation leaks contradict your exit node.</li>
  <li>Route DNS through your proxy tunnel (Clash fake-ip, Sing-box remote DNS) or use DoH/DoT via Cloudflare (1.1.1.1) or Google (8.8.8.8) on the same path as HTTP traffic.</li>
  <li>Verify with dnsleaktest.com before logging into Claude or binding payment (see <a href="/guides/account-registration-and-payment-antiban/">Account Registration & Payment guide</a>).</li>
</ul>

<h2>3. Anti-Detect Browser Isolation Checklist</h2>
<p>For teams managing multiple Claude accounts, anti-detect browsers (AdsPower, GoLogin, Multilogin, etc.) provide hardware-level fingerprint separation so each account presents a coherent regional identity. This is environment hygiene at scale—not an invitation to violate Anthropic's terms.</p>

<ol>
  <li><strong>One dedicated profile per account:</strong> Never share cookies or localStorage between Pro seats.</li>
  <li><strong>Bind each profile to a dedicated residential IP:</strong> Sticky sessions preferred; document which IP maps to which account (<a href="/guides/multi-account-management/">Multi-Account Management</a>).</li>
  <li><strong>Enable Canvas noise, WebGL mask, and AudioContext isolation:</strong> Prevents cross-profile fingerprint correlation on the same physical machine.</li>
  <li><strong>Auto-sync profile timezone with proxy geo:</strong> Most anti-detect tools offer this; verify manually with <code>Date()</code> in DevTools console.</li>
  <li><strong>Match User-Agent to OS claim:</strong> A Windows UA on a Mac host with inconsistent WebGL renderer strings fails consistency checks.</li>
</ol>

<h3>Pre-Session Verification Steps</h3>
<ol>
  <li>Confirm timezone: <code>new Date().getTimezoneOffset()</code> matches target region.</li>
  <li>Confirm languages: <code>navigator.languages</code> in DevTools.</li>
  <li>Run WebRTC and DNS leak tests.</li>
  <li>Check IP ASN at ipinfo.io—is it residential, not cloud?</li>
  <li>Only then open claude.ai or Claude Code OAuth flow.</li>
</ol>

<h3>What NOT to Do</h3>
<ul>
  <li>Do not switch proxy countries mid-registration or mid-payment—complete the entire flow in one region.</li>
  <li>Do not use "free" VPN browser extensions alongside a paid residential proxy; double routing causes unpredictable exits.</li>
  <li>Do not log into the same account from both a "clean" anti-detect profile and your daily Chinese-locale Chrome—the environments will link over time.</li>
  <li>Do not ignore IPv6 leaks; disable IPv6 system-wide or ensure your proxy handles v6 if your ISP assigns it.</li>
</ul>

<h2>FAQ</h2>

<h3>Do I need an anti-detect browser for a single personal account?</h3>
<p>Not necessarily. A dedicated Chrome or Firefox profile with aligned timezone, languages, WebRTC disabled, and a stable residential IP is sufficient for most individual users. Anti-detect tools add value when managing multiple accounts or when your daily OS cannot be reconfigured (e.g. corporate laptop).</p>

<h3>Should my timezone match my IP exactly?</h3>
<p>It should be plausibly consistent. A US West Coast IP with <code>America/Los_Angeles</code> is ideal. A US IP with <code>Asia/Shanghai</code> timezone is a high-risk mismatch even if the IP itself is valid.</p>

<h3>Can I use Claude on mobile with the same account?</h3>
<p>Yes, but mobile OS locale and IP should also align with your account region when possible. Sudden switches from desktop US profile to mobile CN network trigger re-verification. See <a href="/guides/device-setup-guide/">device setup</a> for iOS/Android notes.</p>

<h3>Why does Claude work in the browser but Claude Code returns 403?</h3>
<p>Claude Code uses separate TLS and header fingerprints from the browser. Ensure terminal timezone (<code>TZ</code> env), proxy variables, and API relay configuration match your web session. Details in <a href="/guides/claude-steganography-and-risk-model/">Risk Model guide</a> and regional strategy docs.</p>

<h3>How often should I re-check my environment?</h3>
<p>After any proxy provider change, OS update, browser major version upgrade, or travel. Monthly spot-checks (timezone, WebRTC, DNS) prevent slow drift that accumulates over months of use.</p>
`,
  zh: `
<h2>一、操作系统与浏览器区域设置对齐</h2>
<p>当系统时区、区域格式、浏览器语言列表与网络出口 IP 不一致时，自动化风控可能对正常用户也产生误报——尤其是通过 VPN 访问支持地区、或跨境出差的合法场景。本指南的目标是<strong>让环境与账号归属地区保持一致</strong>，降低信号矛盾带来的 false positive，而非追求完全隐匿身份。</p>

<p>浏览器逐项配置见 <a href="/zh/guides/browser-configuration-guide/">Chrome/Firefox/Edge 配置手册</a>；macOS、Windows、Linux 与移动端差异见 <a href="/zh/guides/device-setup-guide/">跨平台设备配置指南</a>。</p>

<h3>信号不一致为何触发审查</h3>
<p>风控系统会关联 <code>Intl</code> 区域、<code>navigator.languages</code>、时区、字体与 IP。东京 IP 配北京时区、首选 <code>zh-CN</code>，会形成规则引擎重点扫描的复合指纹。</p>

<h3>macOS / Linux 时区命令</h3>
<pre><code># macOS：将系统时区设为与账号地区一致
sudo systemsetup -settimezone "America/Los_Angeles"
# 日本/新加坡账号可用：
sudo systemsetup -settimezone "Asia/Tokyo"

# Linux (Ubuntu/Debian)
sudo timedatectl set-timezone America/Los_Angeles

# 验证
date
# 期望：本地时间与代理出口地区一致（PST、JST 等）</code></pre>

<h3>浏览器语言与字体指纹清单</h3>
<ul>
  <li><strong>语言顺序：</strong> 美国账号将 <code>en-US</code> 置于 <code>navigator.languages</code> 首位；日本账号可用 <code>ja-JP</code>。用于 Claude 的 Profile 中把 <code>zh-CN</code> 下调或移除。</li>
  <li><strong>Intl 区域：</strong> 确认 <code>Intl.DateTimeFormat().resolvedOptions().locale</code> 为目标地区（如 <code>en-US</code>，而非 <code>zh-CN</code>）。</li>
  <li><strong>国产厂商字体：</strong> MiSans、鸿蒙黑体、OPPO Sans 等在 Canvas 宽度探测中特征明显。建议使用无此类字体的独立 Profile，或防指纹浏览器隔离环境。</li>
  <li><strong>Accept-Language 头：</strong> 须与 JS 侧语言列表一致；HTTP 与 JS 不一致是已知检测向量（详见 <a href="/zh/guides/claude-steganography-and-risk-model/">四维风控模型</a>）。</li>
</ul>

<h3>系统区域与账号地区对照</h3>
<table>
  <thead>
    <tr>
      <th>信号</th>
      <th>美国账号目标</th>
      <th>日/新账号目标</th>
      <th>常见错误</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>系统时区</td>
      <td>America/Los_Angeles 或 America/New_York</td>
      <td>Asia/Tokyo 或 Asia/Singapore</td>
      <td>美国 IP 仍用 Asia/Shanghai</td>
    </tr>
    <tr>
      <td>浏览器主语言</td>
      <td>en-US</td>
      <td>en-US 或 ja-JP</td>
      <td>zh-CN 排在首位</td>
    </tr>
    <tr>
      <td>日期/数字格式</td>
      <td>MM/DD/YYYY、USD</td>
      <td>符合当地习惯</td>
      <td>Intl 仍显示 CNY</td>
    </tr>
    <tr>
      <td>已装 CJK 字体</td>
      <td>尽量少或 Profile 隔离</td>
      <td>尽量少或 Profile 隔离</td>
      <td>整机 OEM 中文字体栈</td>
    </tr>
  </tbody>
</table>

<h2>二、代理节点、住宅 IP 与泄露防护</h2>
<p>Anthropic 对机房 ASN 过滤极严。使用与账号国家一致的住宅 ISP IP 是稳定访问的基础条件——不能保证永不封号，但可避免因 IP 类型本身导致的即时拦截。服务商评估标准见 <a href="/zh/guides/vpn-and-proxy-selection/">VPN 与代理选择指南</a>。</p>

<h3>IP 类型对比</h3>
<table>
  <thead>
    <tr>
      <th>IP 类别</th>
      <th>ASN 特征</th>
      <th>Claude 访问表现</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>住宅 ISP（AT&T、Comcast、NTT 等）</td>
      <td>家庭宽带</td>
      <td>稳定性最佳</td>
      <td>尽量与账单州/城市一致</td>
    </tr>
    <tr>
      <td>移动运营商 IP（4G/5G）</td>
      <td>蜂窝网络</td>
      <td>适合出差场景</td>
      <td>IP 会轮换，勿会话中途切换</td>
    </tr>
    <tr>
      <td>机房 / VPS</td>
      <td>云厂商 ASN</td>
      <td>常被封或频繁 CAPTCHA</td>
      <td>不建议用于注册</td>
    </tr>
    <tr>
      <td>廉价共享代理池</td>
      <td>混杂、滥用严重</td>
      <td>封号率高</td>
      <td>邻居账号劣迹会连坐</td>
    </tr>
  </tbody>
</table>

<h3>WebRTC 泄露防护</h3>
<p>即使 HTTP 流量走代理，浏览器仍可能通过 WebRTC ICE 候选暴露内网或真实公网 IP。结果是：HTTP 显示美国代理 IP，WebRTC 却暴露国内家庭宽带——高置信度矛盾信号。</p>
<ul>
  <li>在浏览器设置或 <em>WebRTC Control</em> 等扩展中禁用非代理 UDP。</li>
  <li>Firefox 可在 <code>about:config</code> 设 <code>media.peerconnection.enabled = false</code>。</li>
  <li>每次更换代理或 Profile 后，用 browserleaks.com/webrtc 自测。</li>
</ul>

<h3>DNS 泄露防护</h3>
<ul>
  <li>在美国 IP 下勿用国内公共 DNS（223.5.5.5、119.29.29.29）解析 <code>claude.ai</code>，DNS 地理信息与出口 IP 矛盾。</li>
  <li>通过 Clash fake-ip、Sing-box 远程 DNS 或 DoH/DoT（1.1.1.1、8.8.8.8）与 HTTP 同路径解析。</li>
  <li>登录 Claude 或绑卡前用 dnsleaktest.com 验证（绑卡流程见 <a href="/zh/guides/account-registration-and-payment-antiban/">账号注册与支付避坑</a>）。</li>
</ul>

<h2>三、防指纹浏览器隔离清单</h2>
<p>团队或多账号场景下，AdsPower、GoLogin 等防指纹浏览器可在同机为每账号维持连贯地区身份，属于规模化环境隔离，仍须遵守服务条款。</p>

<ol>
  <li><strong>每账号独立 Profile：</strong> 禁止 Pro 席位间共享 Cookie 或 localStorage。</li>
  <li><strong>每 Profile 绑定独占住宅 IP：</strong> 优先 sticky 会话；记录 IP 与账号映射（见 <a href="/zh/guides/multi-account-management/">多账号管理</a>）。</li>
  <li><strong>开启 Canvas 噪声、WebGL 掩码、AudioContext 隔离：</strong> 防止同机多 Profile 指纹关联。</li>
  <li><strong>Profile 时区自动跟随代理：</strong> 多数工具支持，仍建议在 DevTools 用 <code>Date()</code> 人工复核。</li>
  <li><strong>User-Agent 与声称 OS 一致：</strong> Mac 主机配 Windows UA 且 WebGL renderer 不符会通过一致性检查。</li>
</ol>

<h3>会话前验证步骤</h3>
<ol>
  <li>时区：<code>new Date().getTimezoneOffset()</code> 符合目标地区。</li>
  <li>语言：DevTools 查看 <code>navigator.languages</code>。</li>
  <li>WebRTC、DNS 泄露测试。</li>
  <li>ipinfo.io 查看 ASN 是否为住宅非云厂商。</li>
  <li>以上通过后再打开 claude.ai 或 Claude Code OAuth。</li>
</ol>

<h3>切勿操作</h3>
<ul>
  <li>注册或支付流程中途切换代理国家——须在同一地区内完成全流程。</li>
  <li>付费住宅代理与免费 VPN 扩展同时使用，双重路由导致出口不可预测。</li>
  <li>同一账号既用「干净」防指纹 Profile 又用日常中文 Chrome 登录——环境会随时间关联。</li>
  <li>忽视 IPv6 泄露；应在系统层禁用 IPv6 或确保代理正确处理 v6。</li>
</ul>

<h2>常见问题</h2>

<h3>个人单账号是否必须用防指纹浏览器？</h3>
<p>不一定。独立 Chrome/Firefox Profile，配合对齐的时区、语言、禁用 WebRTC 与稳定住宅 IP，对多数个人用户足够。防指纹工具更适合多账号或无法改系统区域的公司笔记本场景。</p>

<h3>时区是否必须与 IP 完全一致？</h3>
<p>应合理一致。美国西海岸 IP 配 <code>America/Los_Angeles</code> 最理想。美国 IP 配 <code>Asia/Shanghai</code> 时区即使 IP 本身可用，也属于高风险不匹配。</p>

<h3>浏览器正常但 Claude Code 403 为何？</h3>
<p>Claude Code 的 TLS 与请求头指纹与浏览器分离。须保证终端 <code>TZ</code> 环境变量、代理与 API 中转与 Web 会话一致。详见 <a href="/zh/guides/claude-steganography-and-risk-model/">风控模型</a> 与 <a href="/zh/guides/regional-access-strategy/">地区访问策略</a>。</p>

<h3>环境应多久复查一次？</h3>
<p>更换代理、系统大版本更新、浏览器 major 升级或出差后应立即检查。日常每月抽查时区、WebRTC、DNS，可避免数月使用中信号缓慢漂移。</p>
`,
};
