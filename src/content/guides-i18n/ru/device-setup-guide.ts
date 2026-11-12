export const content = `
<h2>1. Часовой пояс и региональные настройки macOS</h2>
<p>Системные настройки macOS напрямую влияют на отпечаток браузера. Настройте часовой пояс, язык и регион под geo выхода прокси:</p>

<h3>Настройка часового пояса</h3>
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

<h3>Язык и регион</h3>
<ul>
  <li>Откройте System Settings → General → Language & Region</li>
  <li>Preferred Language: «English (United States)»</li>
  <li>Region: «United States» (или UK/SG при соответствующих прокси)</li>
  <li>Удалите все китайские языки из списка</li>
  <li>Перезапустите браузер</li>
</ul>

<h2>2. Переменные окружения и реестр Windows</h2>
<p>Windows хранит часовой пояс и язык в ключах реестра. Меняйте их на уровне системы для согласованности:</p>

<h3>Часовой пояс в PowerShell</h3>
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

<h3>Языковые настройки в реестре</h3>
<pre><code># Set system locale to en-US
Set-WinUserLanguageList -LanguageList en-US -Force

# Remove Chinese input methods
Get-WinUserLanguageList | Where-Object { $_.LanguageTag -notlike "zh-*" } | Set-WinUserLanguageList

# Verify
Get-WinUserLanguageList</code></pre>

<h2>3. Окружение терминала Linux и изоляция шрифтов</h2>
<p>В Linux нужна ручная настройка переменных окружения и управление шрифтами, чтобы снизить утечку китайского fingerprint:</p>

<h3>Часовой пояс и locale</h3>
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

<h3>Изоляция шрифтов (удаление китайских)</h3>
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

<h2>4. Антибан-настройка iOS/Android</h2>
<p>На мобильных опций меньше, но ключевые настройки всё равно снижают риск fingerprint:</p>

<h3>Настройка iOS</h3>
<ul>
  <li><strong>Часовой пояс:</strong> Settings → General → Date & Time → Set Automatically OFF → выберите пояс, совпадающий с geo выхода VPN</li>
  <li><strong>Язык:</strong> Settings → General → Language & Region → iPhone Language → English (US)</li>
  <li><strong>VPN:</strong> приложение VPN с residential IP (избегайте бесплатных VPN). Проверьте IP на ipinfo.io в Safari.</li>
  <li><strong>Геолокация:</strong> Settings → Privacy & Security → Location Services → Claude.ai → Never</li>
  <li><strong>Cookie:</strong> Settings → Safari → Advanced → Website Data → Remove All</li>
</ul>

<h3>Настройка Android</h3>
<ul>
  <li><strong>Часовой пояс:</strong> Settings → System → Date & Time → Use network-provided time zone OFF → выберите вручную</li>
  <li><strong>Язык:</strong> Settings → System → Languages → Add a language → English (United States) → Move to top</li>
  <li><strong>VPN:</strong> установите VPN из Play Store с residential IP, проверьте на ipinfo.io</li>
  <li><strong>Chrome Flags:</strong> chrome://flags → поиск «WebRTC» → Anonymize local IPs exposed by WebRTC → Enabled</li>
  <li><strong>Данные сайтов:</strong> Chrome → Settings → Privacy → Clear browsing data → All time → Cookies, Cached images</li>
</ul>
`;
