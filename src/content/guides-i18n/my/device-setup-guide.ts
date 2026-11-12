export const content = `
<h2>1. macOS timezone နှင့် ဒေသဆိုင်ရာ ဆက်တင်များ</h2>
<p>macOS စနစ် ရွေးချယ်မှုများသည် browser fingerprint ကို တိုက်ရိုက်သက်ရောက်သည်။ proxy exit ဒေသနှင့် ကိုက်ညီအောင် timezone၊ ဘာသာစကားနှင့် ဒေသဆက်တင်များကို ပြင်ဆင်ပါ။</p>

<h3>Timezone ပြင်ဆင်ခြင်း</h3>
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

<h3>ဘာသာစကားနှင့် ဒေသဆိုင်ရာ ဆက်တင်များ</h3>
<ul>
  <li>System Settings → General → Language &amp; Region ကို ဖွင့်ပါ</li>
  <li>Preferred Language ကို "English (United States)" အဖြစ် သတ်မှတ်ပါ</li>
  <li>Region ကို "United States" (UK/SG proxy သုံးပါက ထိုဒေသများအလိုက်) သတ်မှတ်ပါ</li>
  <li>ဘာသာစကား စာရင်းမှ တရုတ်ဘာသာစကား ဝင်ရိုးအားလုံးကို ဖယ်ရှားပါ</li>
  <li>ပြောင်းလဲမှုများ အသုံးချရန် browser ကို ပြန်စပါ</li>
</ul>

<h2>2. Windows environment variable နှင့် registry</h2>
<p>Windows သည် timezone နှင့် ဘာသာစကား ဆက်တင်များကို registry key များတွင် သိမ်းသည်။ တည်ငြိမ်မှုရှိစေရန် စနစ်တစ်လုံးလုံးတွင် ပြင်ပါ။</p>

<h3>PowerShell timezone ပြင်ဆင်ခြင်း</h3>
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

<h3>Registry ဘာသာစကား ဆက်တင်များ</h3>
<pre><code># Set system locale to en-US
Set-WinUserLanguageList -LanguageList en-US -Force

# Remove Chinese input methods
Get-WinUserLanguageList | Where-Object { $_.LanguageTag -notlike "zh-*" } | Set-WinUserLanguageList

# Verify
Get-WinUserLanguageList</code></pre>

<h2>3. Linux terminal environment နှင့် font ခွဲခြားမှု</h2>
<p>Linux စနစ်များတွင် တရုတ် fingerprint ထွန်းပေါ်မှုကို တားဆီးရန် environment variable နှင့် font စီမံခန့်ခွဲမှုကို လက်ဖြင့်လုပ်ရသည်။</p>

<h3>Timezone နှင့် locale setup</h3>
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

<h3>Font ခွဲခြားမှု (တရုတ် font များ ဖယ်ရှားခြင်း)</h3>
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

<h2>4. iOS/Android မိုဘိုင်း anti-ban setup</h2>
<p>မိုဘိုင်း စက်များတွင် ပြင်ဆင်ရန် ရွေးစရာများ ကန့်သတ်ထားသော်လည်း အဓိက ဆက်တင်များသည် fingerprint အန္တရာယ်ကို လျှော့ချနိုင်သေး၍သည်။</p>

<h3>iOS ပြင်ဆင်ခြင်း</h3>
<ul>
  <li><strong>Timezone:</strong> Settings → General → Date &amp; Time → Set Automatically OFF → VPN exit ဒေသနှင့် ကိုက်ညီသော timezone ရွေးပါ</li>
  <li><strong>ဘာသာစကား:</strong> Settings → General → Language &amp; Region → iPhone Language → English (US)</li>
  <li><strong>VPN:</strong> residential IP ပံ့ပိုးသော VPN app သုံးပါ (အခမဲ့ VPN များ ရှောင်ပါ)။ Safari တွင် ipinfo.io မှာ IP စမ်းပါ။</li>
  <li><strong>တည်နေရာ ပိတ်ခြင်း:</strong> Settings → Privacy &amp; Security → Location Services → Claude.ai → Never</li>
  <li><strong>Cookie ရှင်းလင်းခြင်း:</strong> Settings → Safari → Advanced → Website Data → Remove All</li>
</ul>

<h3>Android ပြင်ဆင်ခြင်း</h3>
<ul>
  <li><strong>Timezone:</strong> Settings → System → Date &amp; Time → Use network-provided time zone OFF → timezone ကို လက်ဖြင့် ရွေးပါ</li>
  <li><strong>ဘာသာစကား:</strong> Settings → System → Languages → Add a language → English (United States) → ထိပ်သို့ ရွှေ့ပါ</li>
  <li><strong>VPN:</strong> Play Store မှ VPN app တပ်ဆင်ပြီး residential IP ပေးကြောင်း သေချာပါစေ၊ ipinfo.io တွင် အတည်ပြုပါ</li>
  <li><strong>Chrome Flags:</strong> chrome://flags ဖွင့်ပါ → "WebRTC" ရှာပါ → Anonymize local IPs exposed by WebRTC → Enabled</li>
  <li><strong>Site data ရှင်းခြင်း:</strong> Chrome → Settings → Privacy → Clear browsing data → All time → Cookies, Cached images</li>
</ul>
`;
