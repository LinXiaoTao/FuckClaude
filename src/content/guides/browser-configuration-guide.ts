export const browser_configuration_guide_content = {
  en: `
<h2>1. Chrome Anti-Ban Configuration</h2>
<p>Chrome is the most widely used browser for Claude access. Proper configuration prevents timezone mismatches, WebRTC leaks, and Chinese font fingerprints:</p>

<h3>System Timezone Sync</h3>
<pre><code># macOS: Set timezone to match proxy exit region
sudo systemsetup -settimezone "America/Los_Angeles"

# Windows: via PowerShell (requires admin)
Set-TimeZone -Id "Pacific Standard Time"

# Linux
sudo timedatectl set-timezone America/Los_Angeles</code></pre>

<h3>Chrome Launch Flags for Enhanced Privacy</h3>
<pre><code># Launch Chrome with fingerprint-resistant flags
google-chrome \
  --disable-blink-features=AutomationControlled \
  --disable-webrtc \
  --lang=en-US \
  --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0"</code></pre>

<h3>Chrome Settings Checklist</h3>
<ul>
  <li><strong>Languages:</strong> Set <code>chrome://settings/languages</code> to English (United States) and remove all Chinese language entries.</li>
  <li><strong>WebRTC Control:</strong> Install <em>WebRTC Network Limiter</em> extension and set to "Use my proxy server (if any)".</li>
  <li><strong>Do Not Track:</strong> Enable at <code>chrome://settings/privacy</code>.</li>
  <li><strong>Clear On Exit:</strong> Configure <code>chrome://settings/cookies</code> to clear cookies and site data when you close all windows.</li>
</ul>

<h2>2. Firefox Privacy Enhancement</h2>
<p>Firefox offers granular privacy controls through <code>about:config</code>. These settings minimize browser fingerprinting and prevent timezone/WebRTC leaks:</p>

<h3>Critical about:config Settings</h3>
<pre><code># Open about:config and set:
privacy.resistFingerprinting = true
webgl.disabled = true
media.peerconnection.enabled = false
geo.enabled = false
intl.accept_languages = en-US, en
general.useragent.locale = en-US</code></pre>

<h3>Firefox Container Tabs for Multi-Account Isolation</h3>
<p>Use Firefox Multi-Account Containers to isolate Claude accounts into separate cookie/storage contexts without needing separate browser profiles:</p>
<pre><code>1. Install "Firefox Multi-Account Containers" extension
2. Create a dedicated container per Claude account
3. Right-click Claude.ai → "Open in New Container Tab"
4. Each container maintains isolated cookies, localStorage, IndexedDB</code></pre>

<h2>3. Edge Enterprise Policy Settings</h2>
<p>Microsoft Edge supports Group Policy settings for fine-grained control over WebRTC, geolocation, and hardware acceleration:</p>

<h3>Windows Group Policy Configuration</h3>
<pre><code># Open gpedit.msc (Windows Pro/Enterprise)
Computer Configuration → Administrative Templates → Microsoft Edge

WebRtcUdpPortRange: Disabled
DefaultGeolocationSetting: Block geolocation
HardwareAccelerationModeEnabled: Disabled (prevents GPU fingerprinting)</code></pre>

<h3>Edge Flags for Privacy</h3>
<pre><code>edge://flags

#edge-enable-webrtc-hide-local-ips-with-mdns → Enabled
#smooth-scrolling → Disabled
#calculate-native-win-occlusion → Disabled</code></pre>

<h2>4. Essential Browser Extensions</h2>
<p>Install privacy-focused extensions to prevent fingerprint leaks and manage cookies across sessions:</p>

<ul>
  <li><strong>User-Agent Switcher:</strong> Rotate User-Agent strings to match your target region (US/UK/SG).</li>
  <li><strong>Cookie AutoDelete:</strong> Automatically clear cookies when tabs close, except for whitelisted domains.</li>
  <li><strong>uBlock Origin:</strong> Block third-party trackers and analytics scripts that can correlate sessions.</li>
  <li><strong>Decentraleyes:</strong> Serve common JavaScript libraries locally to prevent CDN tracking.</li>
  <li><strong>Clear Browsing Data:</strong> Schedule automatic clearing of cache, cookies, and history on browser restart.</li>
</ul>

<h3>Extension Configuration Best Practices</h3>
<ul>
  <li>Whitelist only essential domains (claude.ai, anthropic.com) in Cookie AutoDelete.</li>
  <li>Set User-Agent Switcher to match OS and browser version that aligns with proxy exit region.</li>
  <li>Disable extensions that require broad permissions or inject scripts into all pages.</li>
</ul>
`,
  zh: `
<h2>一、 Chrome 防封配置</h2>
<p>Chrome 是使用 Claude 最广泛的浏览器。正确配置可有效防止时区不一致、WebRTC 泄漏与中文字体指纹暴露：</p>

<h3>系统时区同步</h3>
<pre><code># macOS：将系统时区设置为与代理出口地区一致
sudo systemsetup -settimezone "America/Los_Angeles"

# Windows：通过 PowerShell（需管理员权限）
Set-TimeZone -Id "Pacific Standard Time"

# Linux
sudo timedatectl set-timezone America/Los_Angeles</code></pre>

<h3>Chrome 启动参数配置</h3>
<pre><code># 使用抗指纹参数启动 Chrome
google-chrome \
  --disable-blink-features=AutomationControlled \
  --disable-webrtc \
  --lang=en-US \
  --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0"</code></pre>

<h3>Chrome 设置检查清单</h3>
<ul>
  <li><strong>语言设置：</strong> 在 <code>chrome://settings/languages</code> 中将语言设为 English (United States)，移除所有中文语言项。</li>
  <li><strong>WebRTC 控制：</strong> 安装 <em>WebRTC Network Limiter</em> 扩展，设置为"使用我的代理服务器（如果有）"。</li>
  <li><strong>请勿跟踪：</strong> 在 <code>chrome://settings/privacy</code> 启用。</li>
  <li><strong>退出时清除：</strong> 在 <code>chrome://settings/cookies</code> 配置关闭所有窗口时清除 Cookie 和网站数据。</li>
</ul>

<h2>二、 Firefox 隐私增强配置</h2>
<p>Firefox 通过 <code>about:config</code> 提供精细的隐私控制。这些设置可最小化浏览器指纹并防止时区/WebRTC 泄漏：</p>

<h3>关键 about:config 设置项</h3>
<pre><code># 打开 about:config 并设置：
privacy.resistFingerprinting = true
webgl.disabled = true
media.peerconnection.enabled = false
geo.enabled = false
intl.accept_languages = en-US, en
general.useragent.locale = en-US</code></pre>

<h3>Firefox 容器标签页实现多账号隔离</h3>
<p>使用 Firefox Multi-Account Containers 将 Claude 账号隔离到独立的 Cookie/存储上下文中，无需创建多个浏览器配置文件：</p>
<pre><code>1. 安装 "Firefox Multi-Account Containers" 扩展
2. 为每个 Claude 账号创建专属容器
3. 右键点击 Claude.ai → "在新容器标签页中打开"
4. 每个容器维护独立的 Cookie、localStorage、IndexedDB</code></pre>

<h2>三、 Edge 企业策略配置</h2>
<p>Microsoft Edge 支持组策略设置，可精细控制 WebRTC、地理位置与硬件加速：</p>

<h3>Windows 组策略配置</h3>
<pre><code># 打开 gpedit.msc（Windows 专业版/企业版）
计算机配置 → 管理模板 → Microsoft Edge

WebRtcUdpPortRange：已禁用
DefaultGeolocationSetting：阻止地理位置
HardwareAccelerationModeEnabled：已禁用（防止 GPU 指纹）</code></pre>

<h3>Edge 实验性功能配置</h3>
<pre><code>edge://flags

#edge-enable-webrtc-hide-local-ips-with-mdns → 已启用
#smooth-scrolling → 已禁用
#calculate-native-win-occlusion → 已禁用</code></pre>

<h2>四、 必备浏览器扩展</h2>
<p>安装隐私保护扩展以防止指纹泄漏并跨会话管理 Cookie：</p>

<ul>
  <li><strong>User-Agent Switcher：</strong> 轮换 User-Agent 字符串以匹配目标地区（美国/英国/新加坡）。</li>
  <li><strong>Cookie AutoDelete：</strong> 标签页关闭时自动清除 Cookie，白名单域名除外。</li>
  <li><strong>uBlock Origin：</strong> 阻止第三方追踪器和分析脚本，防止会话关联。</li>
  <li><strong>Decentraleyes：</strong> 本地提供常用 JavaScript 库，防止 CDN 追踪。</li>
  <li><strong>Clear Browsing Data：</strong> 浏览器重启时自动清除缓存、Cookie 和历史记录。</li>
</ul>

<h3>扩展配置最佳实践</h3>
<ul>
  <li>在 Cookie AutoDelete 中仅白名单必要域名（claude.ai、anthropic.com）。</li>
  <li>设置 User-Agent Switcher 匹配与代理出口地区一致的操作系统和浏览器版本。</li>
  <li>禁用需要广泛权限或向所有页面注入脚本的扩展。</li>
</ul>
`,
};
