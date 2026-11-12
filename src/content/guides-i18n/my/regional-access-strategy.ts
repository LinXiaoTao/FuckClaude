export const content = `
<h2>1. Anthropic ထောက်ပံ့သော နယ်မြေများနှင့် ကန့်သတ်ထားသော နယ်မြေများ</h2>
<p>Anthropic သည် အချို့သော ဒေသများမှ Claude သုံးခွင့်ကို တားမြစ်ထားသည်ကို ထုတ်ပြန်ထားသည်။ လိုက်နာနိုင်သော စာရင်းသွင်းမှုနှင့် အသုံးပြုမှု မဟာဗျူဟာကို ရွေးချယ်ရန် အမျိုးအစားခွဲခြားမှုကို နားလည်ပါ။</p>

<h3>ဒေသအမျိုးအစားခွဲခြားမှု</h3>
<table>
  <thead>
    <tr>
      <th>အမျိုးအစား</th>
      <th>ဒေသများ</th>
      <th>သုံးခွင့်အခြေအနေ</th>
      <th>မဟာဗျူဟာ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>အပြည့်အဝ ထောက်ပံ့</strong></td>
      <td>ဥပမာ US၊ UK၊ Canada၊ Australia၊ New Zealand၊ Singapore၊ Japan၊ Taiwan၊ India၊ Brazil။ <a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">ထောက်ပံ့သော ဒေသများ စာရင်း အပြည့်အစုံ</a> ကို ကြည့်ပါ</td>
      <td>Supported Regions စာရင်းတွင် ရှိသည် (API နှင့် Claude.ai)</td>
      <td>ဒေသတွင်း IP ဖြင့် တိုက်ရိုက် စာရင်းသွင်းပါ</td>
    </tr>
    <tr>
      <td><strong>EU/EEA</strong></td>
      <td>Germany၊ France၊ Netherlands စသည်တို့</td>
      <td>GDPR လိုက်နာမှုဖြင့် ထောက်ပံ့သည်</td>
      <td>EU IP သုံးပါ၊ ဒေတာကိုင်တွယ်မှုကို သဘောတူပါ</td>
    </tr>
    <tr>
      <td><strong>ကန့်သတ်</strong></td>
      <td>China (mainland)၊ Hong Kong၊ Macau၊ Russia၊ Iran၊ North Korea၊ Cuba</td>
      <td>Supported Regions စာရင်းတွင် မပါဝင်။ ထောက်ပံ့မထားသော တည်နေရာမှ အကောင့် ဖန်တီးခြင်းသည် ဖောက်ဖျက်ခံရသော အကြောင်းပြချက်တစ်ခု အဖြစ် ဖော်ပြထားသည်</td>
      <td>ထောက်ပံ့သော ဒေသမှ residential IP သုံးပါ၊ ငွေတောင်းခံခြင်း/ဖုန်းကို တူညီအောင် ထားပါ။ ထောက်ပံ့သော ဒေသ exit IP သည် အကောင့်ကို အရည်အချင်းပြည့်မီစေခြင်း မရှိပါ၊ Hong Kong အသုံးပြုသူတို့သည် 2026 ခုနှစ် အောက်တိုဘာ 1 ရက်မှစ၍ ရပ်ဆိုင်းခံထရကြောင်း community reports မှာ ပြောကြသည်</td>
    </tr>
  </tbody>
</table>

<h3>ဒေသရှာဖွေမှု နည်းလမ်းများ</h3>
<p>Anthropic သည် သင့်ဒေသကို မည်သို့ ဆုံးဖြတ်သည်ကို စာရွက်မထုတ်ပြန်။ အောက်ပါသည် community reports တွင် မကြာခဏ ဆွေးနွေးကြသော အချက်ပြများ ဖြစ်ပြီး အတည်ပြုထားသော စည်းမျဉ်းများ မဟုတ်ပါ။</p>
<ul>
  <li><strong>IP Geolocation:</strong> အဓိက အချက်ပြတစ်ခု ဟု ယခုချဲ့ ယူဆကြသည်</li>
  <li><strong>Payment Card Country:</strong> ငွေတောင်းခံလိပ်စာသည် ကဒ်ထုတ်ပေးသည့် နိုင်ငံနှင့် ကိုက်ညီရမည် (တရားဝင် လိုအပ်ချက်)</li>
  <li><strong>Phone Number Country Code:</strong> SMS အတည်ပြုနံပါတ်သည် ဖြစ်နိုင်သော တည်နေရာကို ညွှန်ပြနိုင်သည်</li>
  <li><strong>Billing Address:</strong> အရည်အချင်းပြည့်သော ငွေတောင်းခံလိပ်စာ ဖြစ်ရမည် (တရားဝင် လိုအပ်ချက်)</li>
</ul>

<h2>2. US/UK/SG စာရင်းသွင်းရန် အကောင်းဆုံး လေ့ကျင့်ခန်းများ</h2>
<p>သုံးသုံးလ အသုံးများသော ထောက်ပံ့ ဒေသများ။ ရွေးချယ်သည့် ဒေသနှင့် IP၊ timezone၊ ဖုန်း၊ ငွေတောင်းခံအချက်အလက်များ တူညီအောင် ထားပါ။</p>

<h3>United States စာရင်းသွင်းခြင်း</h3>
<pre><code># Optimal Configuration for US Registration
Proxy IP: US residential (Comcast, AT&T, Verizon ASNs)
Timezone: America/New_York or America/Los_Angeles
Phone: Real US carrier SIM (+1 area codes: 212, 310, 415, etc.)
Card: US-issued credit or debit card with US billing address
Billing Address: Real US residential address matching IP state

# Verification Script
curl https://ipinfo.io | jq '{ip, city, region, country, org}'
# Ensure country="US", org shows ISP not datacenter</code></pre>

<h3>United Kingdom စာရင်းသွင်းခြင်း</h3>
<pre><code># UK-Specific Configuration
Proxy IP: UK residential (BT, Virgin Media, Sky ASNs)
Timezone: Europe/London
Phone: Real UK carrier SIM (+44)
Card: UK or EU-issued credit or debit card
Billing Address: Real UK address with valid postcode

# UK Address Validation
# Use Royal Mail Postcode Finder to verify address legitimacy</code></pre>

<h3>Singapore စာရင်းသွင်းခြင်း</h3>
<pre><code># Singapore Configuration
Proxy IP: Singapore residential (Singtel, StarHub, M1 ASNs)
Timezone: Asia/Singapore
Phone: Singapore carrier SIM (+65)
Card: Singapore or international card accepted in SG
Billing Address: Real Singapore address with postal code

# Note: Singapore is on the Supported Regions list</code></pre>

<h2>3. EU GDPR လိုက်နာမှုနှင့် ဒေတာအာဏာပိုင်မှု</h2>
<p>EU အသုံးပြုသူများသည် GDPR သဘောတူချက် အပို လိုအပ်ချက်များ ရှိသည်။ Anthropic သည် ဒေတာကိုင်တွယ်မှု စည်းမျဉ်းများကို လိုက်နာရမည်။</p>

<h3>GDPR သဘောတူချက် စစ်ဆေးဇယား</h3>
<ul>
  <li>စာရင်းသွင်းစဉ် Anthropic ၏ GDPR လိုက်နာသော privacy policy ကို လက်ခံပါ</li>
  <li>ဒေတာကိုင်တွယ်မှု တည်နေရာကို အတည်ပြုပါ (Anthropic သည် US-အခြေစိုက် AWS သုံးပြီး EU ဒေတာလွှဲပို့မှု ကာကွယ်မှုများ ရှိသည်)</li>
  <li>လိုအပ်ပါက Anthropic Console မှ ဒေတာ တင်ပို့ခြင်းတောင်းဆိုပါ (GDPR Article 20)</li>
  <li>support သို့ ဆက်သွယ်ပြီး ဖျက်ပိုင်ခွင့် သုံးပါ (GDPR Article 17)</li>
</ul>

<h3>EU-သီးသန့် အန္တရာယ်အချက်များ</h3>
<ul>
  <li>EU ဘဏ်အချို့သည် US-အခြေစိုက် စာရင်းသွင်းမှုကို ငြင်းဆန်နိုင်သည်၊ နိုင်ငံတကာ provider များထံမှ virtual card သုံးပါ</li>
  <li>Strong Customer Authentication (SCA) က 3D Secure လိုအပ်နိုင်သည်၊ ကဒ်တွင် ပံ့ပိုးမှု ရှိကြောင်း သေချာပါစေ</li>
  <li>VAT သည် ငွေတောင်းခံလိပ်စာ နိုင်ငံ အလိုက် အလိုအလျောက် အသုံးချသည်</li>
</ul>

<h2>4. နယ်စပ်ကျော် ခရီးသွားမှု လိုက်နာမှု လမ်းညွန်</h2>
<p>ခရီးသွားနေစဉ် Claude သုံးခြင်း၏ တရားဝင် အသုံးအတွက်များ ရှိသည်။ စစ်ဆေးမှုရှုထောင့်မှ ခံနိုင်ရည်ရှိအောင် setup ကို တည်ဆောက်ပါ။</p>

<h3>လိုက်နာသော ခရီးသွားမှု အခြေအနေ setup</h3>
<pre><code># Before international travel:
1. Enable 2FA on Claude account (Google Authenticator)
2. Notify payment card issuer of travel dates
3. Bring documentation proving business travel (conference tickets, etc.)
4. Use hotel/office WiFi rather than public hotspots
5. If using VPN, choose exit IP in your account's home region

# During travel access:
# Document business purpose in case of appeal:
# - Conference attendance
# - Client meetings
# - Remote work for US/UK employer</code></pre>

<h3>ခရီးသွားမှုနှင့် ဆက်စပ်သော ပိတ်ဆို့မှုအတွက် appeal နမူနာ</h3>
<pre><code>Subject: Account Access Issue During Business Travel

Dear Anthropic Support,

I am a Claude Pro subscriber (email: your@email.com) and my account 
was restricted while I was traveling for business to [Country].

I am a [Your Country] resident and citizen, and registered my account 
while physically located in [Home Country]. I am currently traveling 
for work and need continued access to Claude for my professional duties.

Attached is documentation of my business travel: [conference ticket, 
work visa, employer letter, etc.]

I maintain 2FA on my account and am accessing from secure networks. 
Please restore access to my account.

Thank you,
[Your Name]</code></pre>
`;
