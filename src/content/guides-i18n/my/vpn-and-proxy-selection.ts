export const content = `
<h2>1. Residential IP နှင့် datacenter IP အန္တရာယ် အကဲဖြတ်ခြင်း</h2>
<p>IP အမျိုးအစားသည် Claude account risk score ကို တိုက်ရိုက် သက်ရောက်သည်။ Anthropic သည် proxy ဝန်ဆောင်မှုများနှင့် bot traffic နှင့် နာမည်ကြီးသော datacenter IP များကို အမြင့်သတ်မှတ်ထားသော risk weight များ ပေးသည်။</p>

<h3>IP အမျိုးအစား နှိုင်းယှဉ်ခြင်း</h3>
<table>
  <thead>
    <tr>
      <th>IP အမျိုးအစား</th>
      <th>အန္တရာယ်အဆင့်</th>
      <th>လက္ခဏာများ</th>
      <th>အသုံးပြုရမည့်အခြေအနေ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Residential IP</strong></td>
      <td>နိမ့်</td>
      <td>ISP များက အိမ်သုံး အသုံးပြုသူများထံ ချထားပေးသော IP၊ သန့်ရှင်းသော reputation၊ တည်ငြိမ် ASN</td>
      <td>အကောင့် စာရင်းသွင်းခြင်း၊ Pro subscription၊ ရေရှည်အသုံးပြုမှု</td>
    </tr>
    <tr>
      <td><strong>Mobile carrier IP</strong></td>
      <td>နိမ့်-အလယ်</td>
      <td>ဆယ်လူလာ network IP များ၊ dynamic ချထားမှု၊ တရားဝင် မိုဘိုင်း အသုံးပြုမှု</td>
      <td>မိုဘိုင်း app ဝင်ရောက်မှု၊ ယာယီ session များ</td>
    </tr>
    <tr>
      <td><strong>Datacenter IP</strong></td>
      <td>မြင့်</td>
      <td>AWS၊ Hetzner၊ DigitalOcean အနက်အပိုင်း၊ bot traffic အတွက် မကြာခဏ သတ်မှတ်ချက်တင်ခြင်း</td>
      <td>တိုစွာစမ်းသပ်မှုတိုင်၊ ban အန္တရာယ် မြင့်</td>
    </tr>
    <tr>
      <td><strong>VPN shared pool</strong></td>
      <td>မြင့်</td>
      <td>ထောင်ပေါင်းများစွာသုံးသည့် overused IP အလွှာများ၊ ဝန်ဆောင်မှုအများအပြားတွင် blacklist</td>
      <td>Claude ဝင်ရောက်မှုအတွက် ရှောင်ပါ</td>
    </tr>
  </tbody>
</table>

<h3>IP အမျိုးအစား အတည်ပြုနည်း</h3>
<pre><code># Check IP reputation and type
curl https://ipinfo.io

# Sample output shows:
# "org": "AS7922 Comcast Cable Communications" → Residential (Good)
# "org": "AS16509 Amazon.com, Inc." → Datacenter (High Risk)</code></pre>

<h2>2. Proxy protocol ရွေးချယ်ခြင်း</h2>
<p>proxy protocol မတူကွဲသည် လုံခြုံရေး၊ အမြန်နှုန်းနှင့် fingerprint ခုခံမှု အဆင့်ကွဲပြားသည်။</p>

<ul>
  <li><strong>HTTP/HTTPS proxy။</strong> ရိုးရှင်းပြီး အများသုံးသော်လည်း transparent proxy header များက မူလ IP leak ဖြစ်စေနိုင်သည်။ <code>X-Forwarded-For</code> header များ ဖယ်ရှားသည့် "elite" anonymous proxy များသာ သုံးပါ။</li>
  <li><strong>SOCKS5။</strong> HTTP proxy ထက် ပိုလုံခြုံသည်၊ DNS resolution အတွက် UDP ပံ့ပိုးသည်၊ HTTP header မပြင်သည်။ Claude web ဝင်ရောက်မှုတစ်လျှောက် အကြံပြုသည်။</li>
  <li><strong>Shadowsocks / V2Ray။</strong> deep packet inspection ကျော်ဖြတ်ရန် ဒီဇိုင်းထုတ်ထားသော ကုဒ်ဝှက် protocol များ။ fingerprint leak အနည်းဆုံး၊ သို့သော် exit node သည် residential IP ဖြစ်ကြောင်း သေချာပါစေ။</li>
  <li><strong>Wireguard / OpenVPN။</strong> စနစ်တစ်လျှောက် routing ရှိသော VPN tunnel များ။ အကောင်းဆုံး အခြားခွဲထုတ်မှု၊ သို့သော် DNS query leak ဖြစ်နိုင်သည် မပြင်ဆင်ပါက။</li>
</ul>

<h3>Protocol ပြင်ဆင်မှု ဥပမာ (macOS/Linux)</h3>
<pre><code># SOCKS5 proxy via SSH tunnel (requires a remote server)
ssh -D 1080 -N user@your-residential-server.com

# Configure system to use SOCKS5 proxy
export ALL_PROXY=socks5://127.0.0.1:1080

# Test proxy connection
curl --proxy socks5://127.0.0.1:1080 https://ipinfo.io</code></pre>

<h2>3. VPN provider အကဲဖြတ်ရန် စံချိန်စံညွှန်းများ</h2>
<p>Claude ဝင်ရောက်မှုအတွက် VPN ဝန်ဆောင်မှု ရွေးချယ်သည့်အခါ shared datacenter pool မဟုတ်ဘဲ dedicated residential IP ပေးသည့် provider များကို ဦးစားပေးပါ။</p>

<ul>
  <li><strong>IP pool အမျိုးအစား။</strong> provider သည် ISP မှ ရရှိသော စစ်မှန်သော residential IP များ ပေးသည်ကို စစ်ဆေးပါ၊ "residential" ဟု အမည်တပ်ထားသော datacenter အလွှာများ မဟုတ်ကြောင်း သေချာပါစေ။</li>
  <li><strong>Dedicated နှင့် shared။</strong> dedicated IP သည် အလွဲသုံးစားသူနှင့် share ဖြစ်နိုင်သော အန္တရာယ်ကို ကျော်လွှားသည်၊ သို့သော် ကုန်ကျစရိတ် သိသိသာသာ မြင့်သည်။ pool သန့်ရှင်းပြီး မကြာခဏ လှည့်ပတ်ပါက shared residential IP လက်ခံနိုင်သည်။</li>
  <li><strong>Exit ဒေသ ရွေးချယ်မှု။</strong> Anthropic ပံ့ပိုးသော ဒေသ (US၊ UK၊ SG၊ JP) ရှိ exit IP ရွေးပြီး billing address နှင့် IP နိုင်ငံ ကိုက်ညီစေပါ။</li>
  <li><strong>No-log မူဝါဒ။</strong> အသိအမှတ်ပြုပြီး no-log မူဝါဒ ရှိ provider များ ရွေးချယ်ပါ၊ compliance နှင့် privacy အန္တရာယ် လျော့စေရန်။</li>
  <li><strong>DNS leak ကာကွယ်ရေး။</strong> VPN client တွင် built-in DNS leak protection ပါကြောင်း နှင့် remote DNS server (1.1.1.1၊ 8.8.8.8) သုံးကြောင်း သေချာပါစေ။</li>
</ul>

<h2>4. Proxy chain ပြင်ဆင်မှုနှင့် DNS leak ကာကွယ်ရေး</h2>
<p>လုံခြုံရေး မြင့်မားသော အခြေအနေများတွင် proxy chain ဖြင့် traffic ကို hop အများအပြား ဖြတ်သန်းစေပြီး IP correlation အန္တရာယ် လျော့ပါ။</p>

<h3>Multi-hop proxy setup</h3>
<pre><code># Example: Local SOCKS5 → Residential Proxy → Claude
# Configure Clash / Sing-box with proxy chain rules

proxies:
  - name: "residential-us"
    type: socks5
    server: residential-proxy.example.com
    port: 1080
  
proxy-groups:
  - name: "claude-chain"
    type: relay
    proxies:
      - "residential-us"</code></pre>

<h3>DNS leak ကာကွယ်ရေး checklist</h3>
<ul>
  <li>စနစ် DNS ကို 1.1.1.1 သို့မဟုတ် 8.8.8.8 သတ်မှတ်ပါ၊ ISP သို့မဟုတ် တရုတ် public DNS မသုံးပါနဲ့။</li>
  <li>browser settings တွင် DNS-over-HTTPS (DoH) သို့မဟုတ် DNS-over-TLS (DoT) ဖွင့်ပါ။</li>
  <li>proxy ချိတ်ဆက်ထားစဉ် <code>https://dnsleaktest.com</code> တွင် DNS leak စမ်းသပ်ပါ။</li>
  <li>WebRTC ကို လုံးဝ ပိတ်ပါ၊ STUN server များမှတစ်ဆင့် local IP leak မဖြစ်စေရန်။</li>
</ul>
`;
