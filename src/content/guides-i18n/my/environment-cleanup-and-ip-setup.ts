export const content = `
<h2>1. OS နှင့် ဘရောက်ဆာ locale ညီအောင် ပြင်ဆင်ခြင်း</h2>
<p>OS အချိန်ဇုန်၊ စနစ် locale၊ ဘရောက်ဆာ ဘာသာစာရင်း၊ နယ်မြေနှင့် သင့် network ထွက်ပေါက် မကိုက်ညီလျှင် အလိုအလျောက် risk စနစ်တွေက session ကို ပြဿနာအဖြစ် မှတ်သားနိုင်သည်၊ VPN နဲ့ supported နိုင်ငံများကနေ Claude သုံးတဲ့ ဥပဒေအရ သုံးစွဲသူတွေပင် တခါတရံ ပါဝင်တတ်ပါတယ်။ လက်တွေ့ ရည်ရွယ်ချက်မှာ <strong>သင့်ပတ်ဝန်းကျင်ကို အကောင့် ဒေသနဲ့ ညှိပေးခြင်း</strong> ဖြစ်ပြီး အချက်အလက်များကို တစ်သွီးတည်းဖြစ်အောင် လုပ်ခြင်းဖြင့် false positive လျော့စေမည်ဖြစ်ပါတယ်၊ လုံးလုံး ဖုံးကွယ်ရန် ကြိုးပမ်းခြင်းမဟုတ်ပါ။</p>

<p>ဤလမ်းညွန်သည် စနစ်အဆင့် နှင့် ဘရောက်ဆာ အဆင့် သန့်ရှင်းရေးကို ရည်ရွင့်ပါသည်။ Chrome၊ Firefox၊ Edge အတွက် အသေးစိတ်ကို <a href="/guides/browser-configuration-guide/">Browser Configuration Guide</a> တွင် ကြည့်ပါ။ macOS၊ Windows၊ Linux နှင့် မိုဘိုင်းအတွက် <a href="/guides/device-setup-guide/">Cross-Platform Device Setup guide</a> ကို ကိုးကားပါ။</p>

<h3>မကိုက်ညီမှုကြောင့် စစ်ဆေးခံရသည့် အကြောင်းရင်း</h3>
<p>Fraud vendor များက <code>Intl</code> locale၊ <code>navigator.languages</code>၊ အချိန်ဇုန်ကြား၊ font metrics နှင့် IP geolocation ကို ဆက်စပ်စဉ်းစားပါတယ်။ Tokyo IP နဲ့ Beijing အချိန်ဇုန်၊ ဘရောက်ဆာ ဘာသာအဓိက <code>zh-CN</code> ဆိုရင် ဒေသတွင်း သုံးစွဲသူတွေနှင့် မတူသဖြင့် အလိုအလျောက် rule များ ပစ်မှတ်ထားနိုင်ပါတယ်။</p>

<h3>macOS / Linux အချိန်ဇုန် command များ</h3>
<pre><code># macOS: Set system timezone to match your account region
sudo systemsetup -settimezone "America/Los_Angeles"
# Or for JP/SG accounts:
sudo systemsetup -settimezone "Asia/Tokyo"

# Linux (Ubuntu/Debian)
sudo timedatectl set-timezone America/Los_Angeles

# Verify
date
# Expected: local time matching proxy exit region (PST, JST, etc.)</code></pre>

<h3>ဘရောက်ဆာ ဘာသာ နှင့် font fingerprint စစ်ဆေးစာရင်း</h3>
<ul>
  <li><strong>ဘာသာ အစဉ်:</strong> US အကောင့်အတွက် <code>en-US</code>၊ JP အကောင့်အတွက် <code>ja-JP</code> ကို <code>navigator.languages</code> ထဲ ပထမဆုံး ထားပါ။ Claude သုံးတဲ့ active profile မှာ <code>zh-CN</code> ကို အင်္ဂလိပ်အောက် ရွှေ့ပါ သို့မဟုတ် ဖယ်ပါ။</li>
  <li><strong>Intl locale:</strong> <code>Intl.DateTimeFormat().resolvedOptions().locale</code> သည် သင့်ရည်မှန်းဒေသ (ဥပမာ <code>en-US</code>၊ <code>zh-CN</code> မဟုတ်) ဖြစ်ကြောင်း စစ်ပါ။</li>
  <li><strong>တရုတ် OEM font များ:</strong> MiSans၊ HarmonyOS Sans၊ OPPO Sans တို့က Canvas width တွင်ထင်ရှားသော ပုံစံ ပေးနိုင်ပါတယ်။ စနစ်တစ်ခုလုံး မတပ်ထားသော dedicated browser profile သို့မဟုတ် isolated anti-detect profile သုံးပါ။</li>
  <li><strong>Accept-Language header:</strong> <code>navigator.languages</code> ထိပ်မှန်နှင့် ကိုက်ညီရပါမည်၊ HTTP header နှင့် JS API မညီရင် ပုံသိ detection ချက်လာပါတယ် (<a href="/guides/claude-steganography-and-risk-model/">Risk Model guide</a> တွင် ရှင်းပြထားသည်)။</li>
</ul>

<h3>OS locale နှင့် အကောင့် ဒေသ</h3>
<table>
  <thead>
    <tr>
      <th>အချက်ပြမှု</th>
      <th>US အကောင့် ရည်မှန်း</th>
      <th>JP/SG အကောင့် ရည်မှန်း</th>
      <th>အမှားများ မကြာခဏ တွေ့ရသည့် အရာ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>စနစ် အချိန်ဇုန်</td>
      <td>America/Los_Angeles or America/New_York</td>
      <td>Asia/Tokyo or Asia/Singapore</td>
      <td>US IP ပေါ်နေစဉ် Asia/Shanghai ထားခြင်း</td>
    </tr>
    <tr>
      <td>ဘရောက်ဆာ ဘာသာ အဓိက</td>
      <td>en-US</td>
      <td>en-US or ja-JP</td>
      <td>ဘာသာစာရင်းတွင် zh-CN ပထမဆုံး</td>
    </tr>
    <tr>
      <td>ရက်စွဲ/ဂဏန်း ပုံစံ</td>
      <td>MM/DD/YYYY, USD</td>
      <td>ဒေသနှင့် ကိုက်ညီသော ပုံစံ</td>
      <td>Intl.NumberFormat တွင် CNY သင်္ကေတ</td>
    </tr>
    <tr>
      <td>တပ်ဆင်ထား CJK font များ</td>
      <td>နည်းပါး သို့မဟုတ် profile ခွဲထား</td>
      <td>နည်းပါး သို့မဟုတ် profile ခွဲထား</td>
      <td>OEM တရုတ် font stack ပြည့်စုံ</td>
    </tr>
  </tbody>
</table>

<h2>2. Proxy node၊ residential IP နှင့် leak ကာကွယ်ခြင်း</h2>
<p>Community က datacenter ASN များကို residential ISP ထက် ပိုပိတ်ခံရကြောင်း ဆိုကြပါတယ်။ အကောင့် နိုင်ငံနှင့် ကိုက်ညီတဲ့ residential ISP IP သည် တည်ငြိမ် ဝင်ရောက်နိုင်ရန် အခြေခံပစ္စည်းဖြစ်ပါတယ်၊ ban အားလုံးကို အာမခံမရပါ၊ သို့သော် ချက်ချင်း ပိတ်ခံခြင်းမှ ရှောင်ရန် လိုအပ်ပါတယ်။ <a href="/guides/vpn-and-proxy-selection/">VPN &amp; Proxy Selection guide</a> တွင် provider အကဲဖြတ်မှု စံပြများကို ဖတ်ပါ။</p>

<h3>IP အမျိုးအစား ယှဉ်ကြည့်ခြင်း</h3>
<table>
  <thead>
    <tr>
      <th>IP အမျိုးအစား</th>
      <th>ASN ပရိုဖိုင်</th>
      <th>Claude ဝင်ရောက်မှု ပုံမှန်</th>
      <th>မှတ်ချက်</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Residential ISP (AT&amp;T, Comcast, NTT)</td>
      <td>အိမ်သုံး broadband</td>
      <td>တည်ငြိမ်မှု အကောင်းဆုံး</td>
      <td>မဖြစ်မနေ billing နဲ့ state/city ကိုက်ညီစေပါ</td>
    </tr>
    <tr>
      <td>Mobile carrier IP (4G/5G)</td>
      <td>မိုဘိုင်း ISP</td>
      <td>ခရီးသွားရာတွင် သင့်တော်</td>
      <td>IP လည်ပတ်သည်၊ session အလယ် မပြောင်းပါနှင့်</td>
    </tr>
    <tr>
      <td>Datacenter / VPS</td>
      <td>Cloud provider ASN</td>
      <td>မကြာခဏ ပိတ်ခံ သို့မဟုတ် CAPTCHA များ</td>
      <td>Registration အတွက် အကြံပြုမထား</td>
    </tr>
    <tr>
      <td>ဈေးသက်သာ မျှဝေ proxy pool</td>
      <td>ရောနှော၊ မကြာခဏ အလွဲသုံးစားလုပ်</td>
      <td>ban နှုန်းမြင့်</td>
      <td>မကောင်းသော မျှဝေသူ တစ်ယောက်က pool တစ်ခုလုံးကို ထိခိုက်</td>
    </tr>
  </tbody>
</table>

<h3>WebRTC leak ကာကွယ်ခြင်း</h3>
<p>HTTP traffic က proxy သုံးနေသော်လည်း WebRTC မှတစ်ဆင့် local သို့မဟုတ် အမှန် public IP ထုတ်ဖော်နိုင်ပါတယ်၊ header တွင် US proxy ပါ WebRTC တွင် CN residential IP ဆိုရင် မကိုက်ညီကြောင်း ယုံကြည်စိတ်ချ နိုင်ပါတယ်။</p>
<ul>
  <li>ဘရောက်ဆာ setting သို့မဟုတ် <em>WebRTC Control</em> စာမျက်နှာ extension ဖြင့် "Disable non-proxied UDP" သတ်မှတ်ပါ။</li>
  <li>Firefox တွင် <code>about:config</code> ထဲတွင် <code>media.peerconnection.enabled = false</code> သတ်မှတ်ပါ။</li>
  <li>Proxy သို့မဟုတ် profile ပြောင်းတိုင်း browserleaks.com/webrtc တွင် စမ်းပါ။</li>
</ul>

<h3>DNS leak ကာကွယ်ခြင်း</h3>
<ul>
  <li>US IP ပြသည့်အချိန် တရုတ် public DNS (223.5.5.5၊ 119.29.29.29) ဖြင့် <code>claude.ai</code> မဖြေပါနှင့်၊ DNS geolocation သည် သင့် exit node နှင့် ဆန့်ကျင်ဘက်ဖြစ်နိုင်ပါတယ်။</li>
  <li>DNS ကို proxy tunnel မှတစ်ဆင့် (Clash fake-ip၊ Sing-box remote DNS) သို့မဟုတ် Cloudflare (1.1.1.1)၊ Google (8.8.8.8) DoH/DoT ကို HTTP နှင့် လမ်းကြောင်း တူအောင် သုံးပါ။</li>
  <li>Claude ဝင်မီ သို့မဟုတ် payment ချိတ်မီ dnsleaktest.com ဖြင့် စစ်ပါ (<a href="/guides/account-registration-and-payment-antiban/">Account Registration &amp; Payment guide</a> ကြည့်ပါ)။</li>
</ul>

<h2>3. Anti-detect ဘရောက်ဆာ ခွဲခြားထားခြင်း စစ်ဆေးစာရင်း</h2>
<p>အသင်းအဖွဲ့က တရားဝင် ခွဲထားသော အကောင့်များစွာ (ဥပမာ လုပ်ငန်းတွင် တစ်ဦးချင်း seat) ကြိုးစားသုံးသလျှင် anti-detect browser (AdsPower၊ GoLogin၊ Multilogin စသည်) က profile တစ်ခုချင်းစီ setting ကို သီးခြား ထိန်းသိမ်းနိုင်ပါတယ်။ ဤသည် ပတ်ဝန်းကျင် သန့်ရှင်းရေး ဖြစ်ပြီး Anthropic စည်းမျဉ်း ကျော်ရန် နည်းလမ်းမဟုတ်ပါ၊ account sharing၊ ban ရှောင်ခြင်း၊ unsupported ဒေသမှ ဝင်ရောက်ခြင်းတို့သည် စည်းမျဉ်းနှင့် ညီညွတ်မှု မရှိပါ။</p>

<ol>
  <li><strong>အကောင့် တစ်ခုလျှင် dedicated profile တစ်ခု:</strong> Pro seat များကြား cookie သို့မဟုတ် localStorage မျှဝေခြင်း မပြုလုပ်ပါ။</li>
  <li><strong>Profile တစ်ခုလျှင် dedicated residential IP တစ်ခု:</strong> Sticky session ကို ဦးစားပေးပါ၊ မည့် IP က မည့် အကောင့်နဲ့ ဆိုသည်ကို မှတ်တမ်းတင်ပါ (<a href="/guides/multi-account-management/">Multi-Account Management</a>)။</li>
  <li><strong>Canvas noise၊ WebGL mask၊ AudioContext ခွဲခြားမှု ဖွင့်ပါ:</strong> တူတဲ့ စက်ပေါ်တွင် profile များအကြား fingerprint ဆက်စပ်မှု ရှောင်နိုင်ပါတယ်။</li>
  <li><strong>Profile အချိန်ဇုန်ကို proxy geo နဲ့ auto-sync:</strong> anti-detect tool အများစုတွင် ရှိပါတယ်၊ DevTools console တွင် <code>Date()</code> ဖြင့် လက်ဖြင့် စစ်ပါ။</li>
  <li><strong>User-Agent ကို OS အချက်အလက်နှင့် ကိုက်ညီစေရန်:</strong> Mac host ပေါ်တွင် Windows UA နှင့် WebGL renderer မညီရင် consistency check မအောင်မြင်ပါ။</li>
</ol>

<h3>Session မစတင်မီ စစ်ဆေးရန် အဆင့်များ</h3>
<ol>
  <li>အချိန်ဇုန် စစ်ပါ၊ <code>new Date().getTimezoneOffset()</code> သည် သင့်ရည်မှန်းဒေသနှင့် ကိုက်ညီရမည်။</li>
  <li>ဘာသာများ စစ်ပါ၊ DevTools တွင် <code>navigator.languages</code>။</li>
  <li>WebRTC နှင့် DNS leak စမ်းသပ်မှု လုပ်ပါ။</li>
  <li>ipinfo.io တွင် ASN က residential ဖြစ်၊ cloud မဟုတ်ကြောင်း စစ်ပါ။</li>
  <li>ထို့နောမှသာ claude.ai သို့မဟုတ် Claude Code OAuth flow ဖွင့်ပါ။</li>
</ol>

<h3>မလုပ်ရ</h3>
<ul>
  <li>Registration သို့မဟုတ် payment အလယ်တွင် proxy နိုင်ငံ မပြောင်းပါနှင့်၊ တစ်နယ်မြေတွင် အဆုံးအဖြတ် ပြီးမြောက်အောင် လုပ်ပါ။</li>
  <li>အခမဲ့ VPN browser extension နှင့် ငွေပေး residential proxy ကို တစ်ပြိုင်တည်း မသုံးပါနှင့်၊ double routing က exit မသေချာဖြစ်စေပါတယ်။</li>
  <li>တူညီ အကောင့်ကို "သန့်ရှင်း" anti-detect profile နှင့် နေ့စဉ် တရုတ်-locale Chrome နှစ်ခုလုံး မဝင်ပါနှင့်၊ ပတ်ဝန်းကျင်များ အချိန်ကြာလျှင် ဆက်စပ်သွားမည်။</li>
  <li>IPv6 leak ကို လျစ်လျူမရှုပါနှင့်၊ စနစ်တစ်ခုလုံး IPv6 ပိတ်ပါ သို့မဟုတ် ISP က v6 ပေးလျှင် proxy က ကိုင်တွယ်ရမည်။</li>
</ul>

<h2>FAQ</h2>

<h3>ကိုယ်ပိုင် အကောင့် တစ်ခုတည်းအတွက် anti-detect browser လိုအပ်သလား။</h3>
<p>မဖြစ်မနေ မဟုတ်ပါ။ အချိန်ဇုန်၊ ဘာသာများ၊ WebRTC ပိတ်ထားသော dedicated Chrome သို့မဟုတ် Firefox profile နှင့် တည်ငြိမ်သော residential IP ဖြင့် သုံးစွဲသူ အများစုအတွက် လုံလောက်ပါတယ်။ anti-detect tool များ သည် အကောင့် များစီခန့်မှုပြီး သို့မဟုတ် နေ့စဉ် OS ပြင်ဆင်၍ မရသော (ဥပမာ လုပ်ငန်း laptop) အခြေအနေတွင် ပိုတန်ဖိုးရှိပါတယ်။</p>

<h3>အချိန်ဇုန်သည် IP နှင့် တိတိကျကျ ကိုက်ညီရမလား။</h3>
<p>ယုံကြည် စိတ်ချနိုင်သော ကိုက်ညီမှု လိုအပ်ပါတယ်။ US West Coast IP နှင့် <code>America/Los_Angeles</code> သည် အကောင်းဆုံး။ US IP နှင့် <code>Asia/Shanghai</code> အချိန်ဇုန် သည် IP မှန်သော်လည်း အန္တရာယ်မြင့် မကိုက်ညီမှု ဖြစ်ပါတယ်။</p>

<h3>တူညီ အကောင့်ဖြင့် မိုဘိုင်းမှ Claude သုံးနိုင်မလား။</h3>
<p>သုံးနိုင်ပါတယ်၊ သို့သော် မိုဘိုင်း OS locale နှင့် IP ကိုလည်း မဖြစ်မနေ အကောင့် ဒေသနှင့် ညီအောင် ထားသင့်ပါတယ်။ desktop US profile မှ mobile CN network သို့ ရုတ်တရက် ပြောင်းလျှင် re-verification ဖြစ်နိုင်ပါတယ်။ iOS/Android မှတ်စုအတွက် <a href="/guides/device-setup-guide/">device setup</a> ကြည့်ပါ။</p>

<h3>ဘရောက်ဆာတွင် Claude ရပြီး Claude Code 403 ဖြစ်ရသည် ဘာကြောင့်လဲ။</h3>
<p>Claude Code သည် ဘရောက်ဆာနှင့် သီးခြား TLS နှင့် header fingerprint သုံးပါတယ်။ terminal အချိန်ဇုန် (<code>TZ</code> env)၊ proxy variable များနှင့် API relay configuration က web session နှင့် ကိုက်ညီစေပါ။ အသေးစိတ် <a href="/guides/claude-steganography-and-risk-model/">Risk Model guide</a> နှင့် regional strategy များတွင် ရှိပါတယ်။</p>

<h3>ပတ်ဝန်းကျင်ကို မည်မျှကြာမီ ပြန် စစ်ဆေးသင့်သလဲ။</h3>
<p>proxy provider ပြောင်းလဲမှု၊ OS update၊ ဘရောက်ဆာ major version upgrade သို့မဟုတ် ခရီးသွားပြီးနောက် စစ်ပါ။ လစဉ် အမြန်စစ် (အချိန်ဇုန်၊ WebRTC၊ DNS) သည် လများကြာ သုံးစွဲမှုတွင် ဖြည်းဖြည်း drift မဖြစ်အောင် ကူညီပါတယ်။</p>
`;
