export const content = `
<h2>1. منطقهٔ زمانی و تنظیمات منطقه‌ای macOS</h2>
<p>ترجیحات سیستم macOS مستقیماً روی اثر انگشت مرورگر اثر می‌گذارند. منطقهٔ زمانی، زبان و تنظیمات Region را با منطقهٔ خروج proxy هم‌راستا کنید:</p>

<h3>پیکربندی منطقهٔ زمانی</h3>
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

<h3>تنظیمات زبان و Region</h3>
<ul>
  <li>System Settings → General → Language & Region را باز کنید</li>
  <li>Preferred Language را روی «English (United States)» بگذارید</li>
  <li>Region را «United States» بگذارید (یا UK/SG اگر آن proxyها را دارید)</li>
  <li>همهٔ ورودی‌های زبان چینی را از فهرست زبان حذف کنید</li>
  <li>برای اعمال تغییرها مرورگر را ری‌استارت کنید</li>
</ul>

<h2>2. متغیرهای محیط و رجیستری Windows</h2>
<p>Windows تنظیمات منطقهٔ زمانی و زبان را در کلیدهای رجیستری نگه می‌دارد. برای یکنواختی آن‌ها را در سطح سیستم تغییر دهید:</p>

<h3>پیکربندی منطقهٔ زمانی PowerShell</h3>
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

<h3>تنظیمات زبان رجیستری</h3>
<pre><code># Set system locale to en-US
Set-WinUserLanguageList -LanguageList en-US -Force

# Remove Chinese input methods
Get-WinUserLanguageList | Where-Object { $_.LanguageTag -notlike "zh-*" } | Set-WinUserLanguageList

# Verify
Get-WinUserLanguageList</code></pre>

<h2>3. محیط ترمینال Linux و جداسازی فونت</h2>
<p>سیستم‌های Linux برای جلوگیری از نشت اثر انگشت چینی به پیکربندی دستی متغیر محیط و مدیریت فونت نیاز دارند:</p>

<h3>راه‌اندازی منطقهٔ زمانی و locale</h3>
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

<h3>جداسازی فونت (حذف فونت‌های چینی)</h3>
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

<h2>4. راه‌اندازی ضد مسدودسازی موبایل iOS/Android</h2>
<p>دستگاه‌های موبایل گزینهٔ پیکربندی محدود دارند، اما تنظیمات کلیدی همچنان ریسک اثر انگشت را کم می‌کنند:</p>

<h3>پیکربندی iOS</h3>
<ul>
  <li><strong>منطقهٔ زمانی:</strong> Settings → General → Date & Time → Set Automatically خاموش → منطقهٔ زمانی مطابق منطقهٔ خروج VPN</li>
  <li><strong>زبان:</strong> Settings → General → Language & Region → iPhone Language → English (US)</li>
  <li><strong>VPN:</strong> از اپ VPN با پشتیبانی IP مسکونی استفاده کنید (از VPN رایگان پرهیز کنید). IP را در Safari در ipinfo.io آزمایش کنید.</li>
  <li><strong>غیرفعال کردن موقعیت:</strong> Settings → Privacy & Security → Location Services → Claude.ai → Never</li>
  <li><strong>پاک کردن Cookie:</strong> Settings → Safari → Advanced → Website Data → Remove All</li>
</ul>

<h3>پیکربندی Android</h3>
<ul>
  <li><strong>منطقهٔ زمانی:</strong> Settings → System → Date & Time → Use network-provided time zone خاموش → منطقهٔ زمانی را دستی انتخاب کنید</li>
  <li><strong>زبان:</strong> Settings → System → Languages → Add a language → English (United States) → Move to top</li>
  <li><strong>VPN:</strong> اپ VPN را از Play Store نصب کنید، IP مسکونی بدهد، در ipinfo.io تأیید کنید</li>
  <li><strong>پرچم‌های Chrome:</strong> chrome://flags را باز کنید → «WebRTC» را جستجو کنید → Anonymize local IPs exposed by WebRTC → Enabled</li>
  <li><strong>پاک کردن دادهٔ سایت:</strong> Chrome → Settings → Privacy → Clear browsing data → All time → Cookies, Cached images</li>
</ul>
`;
