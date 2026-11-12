export const content = `
<h2>1. Chrome ပိတ်ခံခြင်း မဖြစ်စေရန် ပြင်ဆင်မှု</h2>
<p>Chrome သည် Claude သုံးရာတွင် အများသုံး ဘရောက်ဆာဖြစ်ပါတယ်။ မှန်ကန်စွာ ပြင်ဆင်ခြင်းဖြင့် အချိန်ဇုန် မညီခြင်း၊ WebRTC leak နှင့် တရုတ် font fingerprint ကို ရှောင်နိုင်ပါတယ်။</p>

<h3>စနစ် အချိန်ဇုန် sync</h3>
<pre><code># macOS: Set timezone to match proxy exit region
sudo systemsetup -settimezone "America/Los_Angeles"

# Windows: via PowerShell (requires admin)
Set-TimeZone -Id "Pacific Standard Time"

# Linux
sudo timedatectl set-timezone America/Los_Angeles</code></pre>

<h3>Enhanced privacy အတွက် Chrome launch flag များ</h3>
<pre><code># Launch Chrome with fingerprint-resistant flags
google-chrome \
  --disable-blink-features=AutomationControlled \
  --disable-webrtc \
  --lang=en-US \
  --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0"</code></pre>

<h3>Chrome setting စစ်ဆေးစာရင်း</h3>
<ul>
  <li><strong>Languages:</strong> <code>chrome://settings/languages</code> တွင် English (United States) သတ်မှတ်၍ တရုတ် ဘာသာစာရင်း အားလုံး ဖယ်ရှားပါ။</li>
  <li><strong>WebRTC control:</strong> <em>WebRTC Network Limiter</em> extension တပ်ဆင်၍ "Use my proxy server (if any)" သတ်မှတ်ပါ။</li>
  <li><strong>Do Not Track:</strong> <code>chrome://settings/privacy</code> တွင် ဖွင့်ပါ။</li>
  <li><strong>Clear on exit:</strong> <code>chrome://settings/cookies</code> တွင် ဝင်းဒိုးအားလုံး ပိတ်သောအခါ cookie နှင့် site data ရှင်းပါ။</li>
</ul>

<h2>2. Firefox ကိုယ်ရေးလုံခြုံမှု မြှင့်တင်ခြင်း</h2>
<p>Firefox သည် <code>about:config</code> မှတစ်ဆင့် အသေးစိတ် privacy control ပေးပါတယ်။ ဤ setting များသည် browser fingerprinting လျော့စေပြီး အချိန်ဇုန်/WebRTC leak ကို ကာကွယ်ပါတယ်။</p>

<h3>အရေးကြီး about:config setting များ</h3>
<pre><code># Open about:config and set:
privacy.resistFingerprinting = true
webgl.disabled = true
media.peerconnection.enabled = false
geo.enabled = false
intl.accept_languages = en-US, en
general.useragent.locale = en-US</code></pre>

<h3>အကောင့် များစွာ ခွဲခြားရန် Firefox container tab များ</h3>
<p>Firefox Multi-Account Containers သုံးပြီး Claude အကောင့် များကို သီးခြား cookie/storage context တွင်ခွဲထားနိုင်ပါတယ်၊ browser profile များ လိုအပ်မှု မရှိပါ။</p>
<pre><code>1. Install "Firefox Multi-Account Containers" extension
2. Create a dedicated container per Claude account
3. Right-click Claude.ai → "Open in New Container Tab"
4. Each container maintains isolated cookies, localStorage, IndexedDB</code></pre>

<h2>3. Edge လုပ်ငန်း policy setting များ</h2>
<p>Microsoft Edge သည် WebRTC၊ geolocation နှင့် hardware acceleration ကို အသေးစိတ် ထိန်းချုပ်ရန် Group Policy ကို ပံ့ပိုးပါတယ်။</p>

<h3>Windows Group Policy ပြင်ဆင်မှု</h3>
<pre><code># Open gpedit.msc (Windows Pro/Enterprise)
Computer Configuration → Administrative Templates → Microsoft Edge

WebRtcUdpPortRange: Disabled
DefaultGeolocationSetting: Block geolocation
HardwareAccelerationModeEnabled: Disabled (prevents GPU fingerprinting)</code></pre>

<h3>Privacy အတွက် Edge flags</h3>
<pre><code>edge://flags

#edge-enable-webrtc-hide-local-ips-with-mdns → Enabled
#smooth-scrolling → Disabled
#calculate-native-win-occlusion → Disabled</code></pre>

<h2>4. မဖြစ်မနေ browser extension များ</h2>
<p>fingerprint leak ရှောင်ရန်နှင့် session များကြား cookie စီမံရန် privacy-focused extension များ တပ်ဆင်ပါ။</p>

<ul>
  <li><strong>User-Agent Switcher:</strong> သင့်ရည်မှန်းဒေသ (US/UK/SG) နှင့် ကိုက်ညီစေရန် User-Agent string ပြောင်းပါ။</li>
  <li><strong>Cookie AutoDelete:</strong> whitelist ဒိုမိန်းမှလွဲ၍ tab ပိတ်သောအခါ cookie အလိုအလျောက် ရှင်းပါ။</li>
  <li><strong>uBlock Origin:</strong> တတိယပါတီ tracker နှင့် analytics script ကို ပိတ်ပါ၊ session ဆက်စပ်မှု မဖြစ်စေရ။</li>
  <li><strong>Decentraleyes:</strong> သုံးများသော JavaScript library များကို locally ပေးပြီး CDN tracking ကို ရှောင်ပါ။</li>
  <li><strong>Clear Browsing Data:</strong> ဘရောက်ဆာ ပြန်စမှု တိုင်း cache၊ cookie နှင့် history အလိုအလျောက် ရှင်းပါ။</li>
</ul>

<h3>Extension ပြင်ဆင်မှု အကောင်းဆုံး လေ့ကျင့်မှု</h3>
<ul>
  <li>Cookie AutoDelete တွင် လိုအပ်သော ဒိုမိန်း (claude.ai၊ anthropic.com) သာလျှင် whitelist ထားပါ။</li>
  <li>User-Agent Switcher ကို proxy exit ဒေသနှင့် ကိုက်ညီသော OS နှင့် browser version သို့ ညှိပါ။</li>
  <li>ကြီးမားသော permission လိုသော သို့မဟုတ် စာမျက်နှာ အားလုံးသို့ script ထည့်သော extension များ ပိတ်ထားပါ။</li>
</ul>
`;
