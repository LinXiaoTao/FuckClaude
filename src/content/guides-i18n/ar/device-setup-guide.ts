export const content = `
<h2>1. المنطقة الزمنية وإعدادات المنطقة في macOS</h2>
<p>تؤثر تفضيلات نظام macOS مباشرة على بصمة المتصفح. اضبط المنطقة الزمنية واللغة والمنطقة لتتوافق مع منطقة خروج الـ proxy:</p>

<h3>إعداد المنطقة الزمنية</h3>
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

<h3>إعدادات اللغة والمنطقة</h3>
<ul>
  <li>افتح System Settings → General → Language &amp; Region</li>
  <li>عيّن Preferred Language إلى «English (United States)»</li>
  <li>عيّن Region إلى «United States» (أو المملكة المتحدة/سنغافورة إذا كنت تستخدم تلك الـ proxies)</li>
  <li>أزل كل إدخالات اللغة الصينية من قائمة اللغات</li>
  <li>أعد تشغيل المتصفح لتطبيق التغييرات</li>
</ul>

<h2>2. متغيرات البيئة وسجل Windows</h2>
<p>يخزّن Windows إعدادات المنطقة الزمنية واللغة في مفاتيح السجل. عدّلها على مستوى النظام لضمان الاتساق:</p>

<h3>إعداد المنطقة الزمنية عبر PowerShell</h3>
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

<h3>إعدادات لغة السجل</h3>
<pre><code># Set system locale to en-US
Set-WinUserLanguageList -LanguageList en-US -Force

# Remove Chinese input methods
Get-WinUserLanguageList | Where-Object { $_.LanguageTag -notlike "zh-*" } | Set-WinUserLanguageList

# Verify
Get-WinUserLanguageList</code></pre>

<h2>3. بيئة الطرفية وعزل الخطوط في Linux</h2>
<p>تتطلب أنظمة Linux ضبط متغيرات البيئة يدوياً وإدارة الخطوط لمنع تسريب بصمة صينية:</p>

<h3>المنطقة الزمنية والـ locale</h3>
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

<h3>عزل الخطوط (إزالة الخطوط الصينية)</h3>
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

<h2>4. إعداد الجوال iOS/Android لتقليل المخاطر</h2>
<p>خيارات ضبط الأجهزة المحمولة محدودة، لكن الإعدادات الأساسية ما زالت تخفض مخاطر البصمة:</p>

<h3>إعداد iOS</h3>
<ul>
  <li><strong>المنطقة الزمنية:</strong> Settings → General → Date &amp; Time → Set Automatically OFF → اختر منطقة زمنية تطابق منطقة خروج الـ VPN</li>
  <li><strong>اللغة:</strong> Settings → General → Language &amp; Region → iPhone Language → English (US)</li>
  <li><strong>VPN:</strong> استخدم تطبيق VPN يدعم IP سكني (تجنّب VPN المجانية). اختبر الـ IP على ipinfo.io في Safari.</li>
  <li><strong>تعطيل الموقع:</strong> Settings → Privacy &amp; Security → Location Services → Claude.ai → Never</li>
  <li><strong>مسح ملفات تعريف الارتباط:</strong> Settings → Safari → Advanced → Website Data → Remove All</li>
</ul>

<h3>إعداد Android</h3>
<ul>
  <li><strong>المنطقة الزمنية:</strong> Settings → System → Date &amp; Time → Use network-provided time zone OFF → اختر المنطقة الزمنية يدوياً</li>
  <li><strong>اللغة:</strong> Settings → System → Languages → Add a language → English (United States) → انقلها إلى الأعلى</li>
  <li><strong>VPN:</strong> ثبّت تطبيق VPN من Play Store، وتأكد أنه يوفّر IP سكني، وتحقق على ipinfo.io</li>
  <li><strong>Chrome Flags:</strong> افتح chrome://flags → ابحث عن «WebRTC» → Anonymize local IPs exposed by WebRTC → Enabled</li>
  <li><strong>مسح بيانات المواقع:</strong> Chrome → Settings → Privacy → Clear browsing data → All time → Cookies, Cached images</li>
</ul>
`;
