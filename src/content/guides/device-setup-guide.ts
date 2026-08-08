export const device_setup_guide_content = {
  en: `
<h2>1. macOS Timezone & Regional Settings</h2>
<p>macOS system preferences directly affect browser fingerprints. Configure timezone, language, and region settings to match your proxy exit region:</p>

<h3>Timezone Configuration</h3>
<pre><code># Check current timezone
sudo systemsetup -gettimezone

# Set timezone to US Eastern
sudo systemsetup -settimezone "America/New_York"

# Alternative: US Pacific
sudo systemsetup -settimezone "America/Los_Angeles"

# UK London
sudo systemsetup -settimezone "Europe/London"

# Singapore
sudo systemsetup -settimezone "Asia/Singapore"

# Verify Intl timezone matches
node -e "console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)"</code></pre>

<h3>Language & Region Settings</h3>
<ul>
  <li>Open System Settings → General → Language & Region</li>
  <li>Set Preferred Language to "English (United States)"</li>
  <li>Set Region to "United States" (or UK/SG if using those proxies)</li>
  <li>Remove all Chinese language entries from the language list</li>
  <li>Restart browser to apply changes</li>
</ul>

<h2>2. Windows Environment Variables & Registry</h2>
<p>Windows stores timezone and language settings in registry keys. Modify them system-wide to ensure consistency:</p>

<h3>PowerShell Timezone Configuration</h3>
<pre><code># List available timezones
Get-TimeZone -ListAvailable | Where-Object { $_.Id -like "*Pacific*" }

# Set timezone
Set-TimeZone -Id "Pacific Standard Time"

# Verify
Get-TimeZone

# Alternative zones:
# "Eastern Standard Time" (US East)
# "GMT Standard Time" (UK)
# "Singapore Standard Time" (Singapore)</code></pre>

<h3>Registry Language Settings</h3>
<pre><code># Set system locale to en-US
Set-WinUserLanguageList -LanguageList en-US -Force

# Remove Chinese input methods
Get-WinUserLanguageList | Where-Object { $_.LanguageTag -notlike "zh-*" } | Set-WinUserLanguageList

# Verify
Get-WinUserLanguageList</code></pre>

<h2>3. Linux Terminal Environment & Font Isolation</h2>
<p>Linux systems require manual environment variable configuration and font management to prevent Chinese fingerprint leakage:</p>

<h3>Timezone & Locale Setup</h3>
<pre><code># Set timezone
sudo timedatectl set-timezone America/New_York

# Verify
timedatectl

# Set system locale to en_US.UTF-8
sudo localectl set-locale LANG=en_US.UTF-8

# Add to ~/.bashrc or ~/.zshrc
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export TZ=America/New_York

# Reload shell
source ~/.bashrc</code></pre>

<h3>Font Isolation (Remove Chinese Fonts)</h3>
<pre><code># List installed Chinese fonts
fc-list :lang=zh

# Option 1: Temporarily disable Chinese fonts
mkdir -p ~/.config/fontconfig
cat > ~/.config/fontconfig/fonts.conf <<'EOF'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <selectfont>
    <rejectfont>
      <pattern>
        <patelt name="family">
          <string>Noto Sans CJK</string>
          <string>WenQuanYi</string>
          <string>AR PL</string>
        </patelt>
      </pattern>
    </rejectfont>
  </selectfont>
</fontconfig>
EOF

# Rebuild font cache
fc-cache -f

# Option 2: Uninstall Chinese font packages (Debian/Ubuntu)
sudo apt remove fonts-wqy-* fonts-arphic-* fonts-noto-cjk</code></pre>

<h2>4. iOS/Android Mobile Anti-Ban Setup</h2>
<p>Mobile devices have limited configuration options, but key settings can still reduce fingerprint risk:</p>

<h3>iOS Configuration</h3>
<ul>
  <li><strong>Timezone:</strong> Settings → General → Date & Time → Set Automatically OFF → Choose timezone matching your VPN exit region</li>
  <li><strong>Language:</strong> Settings → General → Language & Region → iPhone Language → English (US)</li>
  <li><strong>VPN:</strong> Use a VPN app with residential IP support (avoid free VPNs). Test IP at ipinfo.io in Safari.</li>
  <li><strong>Disable Location:</strong> Settings → Privacy & Security → Location Services → Claude.ai → Never</li>
  <li><strong>Clear Cookies:</strong> Settings → Safari → Advanced → Website Data → Remove All</li>
</ul>

<h3>Android Configuration</h3>
<ul>
  <li><strong>Timezone:</strong> Settings → System → Date & Time → Use network-provided time zone OFF → Select timezone manually</li>
  <li><strong>Language:</strong> Settings → System → Languages → Add a language → English (United States) → Move to top</li>
  <li><strong>VPN:</strong> Install VPN app from Play Store, ensure it provides residential IPs, verify at ipinfo.io</li>
  <li><strong>Chrome Flags:</strong> Open chrome://flags → Search "WebRTC" → Anonymize local IPs exposed by WebRTC → Enabled</li>
  <li><strong>Clear Site Data:</strong> Chrome → Settings → Privacy → Clear browsing data → All time → Cookies, Cached images</li>
</ul>
`,
  zh: `
<h2>一、 macOS 系统时区与区域设置</h2>
<p>macOS 系统偏好设置直接影响浏览器指纹。配置时区、语言和地区设置以匹配代理出口地区：</p>

<h3>时区配置</h3>
<pre><code># 检查当前时区
sudo systemsetup -gettimezone

# 设置时区为美国东部
sudo systemsetup -settimezone "America/New_York"

# 替代方案：美国太平洋
sudo systemsetup -settimezone "America/Los_Angeles"

# 英国伦敦
sudo systemsetup -settimezone "Europe/London"

# 新加坡
sudo systemsetup -settimezone "Asia/Singapore"

# 验证 Intl 时区匹配
node -e "console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)"</code></pre>

<h3>语言与地区设置</h3>
<ul>
  <li>打开系统设置 → 通用 → 语言与地区</li>
  <li>将首选语言设置为"English (United States)"</li>
  <li>将地区设置为"美国"（如果使用英国/新加坡代理则相应调整）</li>
  <li>从语言列表中删除所有中文语言条目</li>
  <li>重启浏览器以应用更改</li>
</ul>

<h2>二、 Windows 环境变量与注册表配置</h2>
<p>Windows 将时区和语言设置存储在注册表键中。系统级修改以确保一致性：</p>

<h3>PowerShell 时区配置</h3>
<pre><code># 列出可用时区
Get-TimeZone -ListAvailable | Where-Object { $_.Id -like "*Pacific*" }

# 设置时区
Set-TimeZone -Id "Pacific Standard Time"

# 验证
Get-TimeZone

# 替代时区：
# "Eastern Standard Time"（美国东部）
# "GMT Standard Time"（英国）
# "Singapore Standard Time"（新加坡）</code></pre>

<h3>注册表语言设置</h3>
<pre><code># 将系统区域设置为 en-US
Set-WinUserLanguageList -LanguageList en-US -Force

# 删除中文输入法
Get-WinUserLanguageList | Where-Object { $_.LanguageTag -notlike "zh-*" } | Set-WinUserLanguageList

# 验证
Get-WinUserLanguageList</code></pre>

<h2>三、 Linux 终端环境与字体隔离</h2>
<p>Linux 系统需要手动配置环境变量和字体管理，以防止中文指纹泄漏：</p>

<h3>时区与区域设置</h3>
<pre><code># 设置时区
sudo timedatectl set-timezone America/New_York

# 验证
timedatectl

# 将系统区域设置为 en_US.UTF-8
sudo localectl set-locale LANG=en_US.UTF-8

# 添加到 ~/.bashrc 或 ~/.zshrc
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export TZ=America/New_York

# 重新加载 shell
source ~/.bashrc</code></pre>

<h3>字体隔离（删除中文字体）</h3>
<pre><code># 列出已安装的中文字体
fc-list :lang=zh

# 选项 1：临时禁用中文字体
mkdir -p ~/.config/fontconfig
cat > ~/.config/fontconfig/fonts.conf <<'EOF'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <selectfont>
    <rejectfont>
      <pattern>
        <patelt name="family">
          <string>Noto Sans CJK</string>
          <string>WenQuanYi</string>
          <string>AR PL</string>
        </patelt>
      </pattern>
    </rejectfont>
  </selectfont>
</fontconfig>
EOF

# 重建字体缓存
fc-cache -f

# 选项 2：卸载中文字体包（Debian/Ubuntu）
sudo apt remove fonts-wqy-* fonts-arphic-* fonts-noto-cjk</code></pre>

<h2>四、 iOS/Android 移动端防封配置</h2>
<p>移动设备配置选项有限，但关键设置仍可降低指纹风险：</p>

<h3>iOS 配置</h3>
<ul>
  <li><strong>时区：</strong> 设置 → 通用 → 日期与时间 → 自动设置 关闭 → 选择与 VPN 出口地区匹配的时区</li>
  <li><strong>语言：</strong> 设置 → 通用 → 语言与地区 → iPhone 语言 → English (US)</li>
  <li><strong>VPN：</strong> 使用支持住宅 IP 的 VPN 应用（避免免费 VPN）。在 Safari 中访问 ipinfo.io 测试 IP。</li>
  <li><strong>禁用定位：</strong> 设置 → 隐私与安全 → 定位服务 → Claude.ai → 永不</li>
  <li><strong>清除 Cookie：</strong> 设置 → Safari → 高级 → 网站数据 → 移除所有</li>
</ul>

<h3>Android 配置</h3>
<ul>
  <li><strong>时区：</strong> 设置 → 系统 → 日期和时间 → 使用网络提供的时区 关闭 → 手动选择时区</li>
  <li><strong>语言：</strong> 设置 → 系统 → 语言 → 添加语言 → English (United States) → 移至顶部</li>
  <li><strong>VPN：</strong> 从 Play Store 安装 VPN 应用，确保提供住宅 IP，在 ipinfo.io 验证</li>
  <li><strong>Chrome 标志：</strong> 打开 chrome://flags → 搜索"WebRTC" → 匿名化由 WebRTC 公开的本地 IP → 已启用</li>
  <li><strong>清除网站数据：</strong> Chrome → 设置 → 隐私 → 清除浏览数据 → 所有时间 → Cookie、缓存的图片</li>
</ul>
`,
};
