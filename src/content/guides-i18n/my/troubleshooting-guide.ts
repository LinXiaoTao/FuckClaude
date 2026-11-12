export const content = `
<h2>1. လော့ဂ်အင် မအောင်မြင်မှု ခွဲခြားစစ်ဆေးခြင်း (403/429/500)</h2>
<p>လော့ဂ်အင် မအောင်မြင်မှုများကို HTTP status code နှင့် error message အလိုက် root cause သတ်မှတ်နိုင်ပါသည်။</p>

<h3>Error Code မက်ထ্রစ်</h3>
<table>
  <thead>
    <tr>
      <th>Status Code</th>
      <th>Error Message</th>
      <th>Root Cause</th>
      <th>ဖြေရှင်းနည်း</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>403 Forbidden</strong></td>
      <td>"Access denied"</td>
      <td>IP ပိတ်ပင်မှု သို့မဟုတ် အန္တရာယ်မြင့် datacenter IP</td>
      <td>resident proxy သို့ ပြောင်း၍ cookies ရှင်း၊ ၁ နာရီကြာပြီး ပြန်လည် စမ်းပါ</td>
    </tr>
    <tr>
      <td><strong>429 Too Many Requests</strong></td>
      <td>"Rate limit exceeded"</td>
      <td>လော့ဂ်အင် ကြိုးပမ်းမှု သို့မဟုတ် API rate limit ကျော်လွန်မှု</td>
      <td>၁၅ မိနစ် စောင့်ပါ၊ exponential backoff အကောင်အထည် ဖော်ပါ</td>
    </tr>
    <tr>
      <td><strong>500 Internal Server Error</strong></td>
      <td>"Something went wrong"</td>
      <td>Anthropic backend ပြဿနာ သို့မဟုတ် မမှန်သော session အခြေအနေ</td>
      <td>claude.ai cookies အားလုံး ရှင်း၊ browser ပြန်လည်စတင်၍ ပြန်စမ်းပါ</td>
    </tr>
    <tr>
      <td><strong>Account Disabled</strong></td>
      <td>"Your account has been disabled"</td>
      <td>ToS ချိုးဖောက်မှု သို့မဟုတ် ငွေပေးချေမှု ပြဿနာ</td>
      <td>ပိတ်ပင်ရခြင်း အကြောင်းရင်းအတွက် အီးမေးလ် စစ်ပြီး တိုင်ကြားမှု SOP လိုက်နာပါ</td>
    </tr>
  </tbody>
</table>

<h3>ခွဲခြားစစ်ဆေးမှု လုပ်ထုံးလုပ်နည်း</h3>
<pre><code># 1. Check current IP reputation
curl https://ipinfo.io
# Verify "org" does not show datacenter ASN (AWS, Hetzner, etc.)

# 2. Test DNS resolution
nslookup claude.ai
# Should resolve to Cloudflare IPs (104.18.x.x range)

# 3. Clear browser state completely
# Chrome: Settings → Privacy → Clear browsing data → All time → Cookies, Cache
# Firefox: Settings → Privacy → Clear Data → Everything

# 4. Test login with clean profile
google-chrome --user-data-dir="/tmp/test-profile" --proxy-server="socks5://proxy:1080"</code></pre>

<h2>2. API ခေါ်ဆိုမှု ခြွင်းချက် စစ်ဆေးခြင်း</h2>
<p>API မအောင်မြင်မှုတွင် ကွန်ယက်၊ အထောက်အထားစိစစ်ခြင်းနှင့် rate limiting ကို စနစ်တကျ စစ်ဆေးရန် လိုအပ်ပါသည်။</p>

<h3>အဖြစ်များသော API error များ</h3>
<ul>
  <li><strong>401 Unauthorized၊</strong> API key မမှန်သော သို့မဟုတ် ပယ်ဖျက်ထားခြင်း။ Anthropic Console တွင် key စစ်ဆေးပြီး လိုအပ်ပါက ပြန်ထုတ်ပါ။</li>
  <li><strong>429 Rate Limit၊</strong> organization သည် RPM (requests per minute) သို့မဟုတ် TPM (tokens per minute) quota ကျော်လွန်ခြင်း။ client-side rate limiting အကောင်အထည် ဖော်ပါ။</li>
  <li><strong>529 Overloaded၊</strong> Anthropic backend အားလပ်မှု ကုန်ကျသွားခြင်း။ exponential backoff (2^n စက္ကန့် jitter နှင့်) ဖြင့် ပြန်လည် စမ်းပါ။</li>
  <li><strong>Timeout၊</strong> တောင်းဆိုမှု ၆၀ စက္ကန့် ကျော်လွန်ခြင်း။ prompt ကြီးမားပါက အပိုင်းလိုက် ခွဲပါ သို့မဟုတ် max_tokens လျှော့ပါ။</li>
</ul>

<h3>API သတ်မှတ်ချက် script</h3>
<pre><code>#!/usr/bin/env node
const Anthropic = require('@anthropic-ai/sdk');

async function diagnoseAPI() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    console.log('Testing API connectivity...');
    const response = await client.messages.create({
      model: 'claude-sonnet-4.5-high',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('✓ API key valid, connection successful');
    console.log('Response:', response.content[0].text);
  } catch (error) {
    console.error('✗ API Error:', error.status, error.message);
    if (error.status === 401) console.log('→ Check API key validity');
    if (error.status === 429) console.log('→ Rate limit exceeded, wait 60s');
    if (error.status === 529) console.log('→ Backend overloaded, retry with backoff');
  }
}

diagnoseAPI();</code></pre>

<h2>3. ငွေပေးချေမှု ချိတ်ဆက်မှု မအောင်မြင်ခြင်း အကြောင်းရင်း</h2>
<p>Anthropic သည် ဘဏ် ငြင်းပယ်ရသည့် အကြောင်းရင်းကို မရရှိသောကြောင့် ဖြစ်နိုင်ခြေရှိ အစဉ်လိုက် စစ်ဆေးပါ။ <a href="/guides/payment-methods-comparison/">ငွေပေးချေမှု လမ်းညွှန်</a> တွင် တရားဝင် စစ်ဆေးစာရင်း အပြည့်အစုံ ရှိသည်။</p>

<ul>
  <li><strong>ကတ် ငြင်းပယ်ခံရမှု၊</strong> လက်ကျန်ငွေ မလုံလောက်၊ CVV မမှန် သို့မဟုတ် ကတ် သက်တမ်းကုန်ခြင်း။ စုစုပြီး ပမာဏကို ဖုံးလွှမ်းနိုင်ကြောင်း သေချာပါစေ။</li>
  <li><strong>ကတ် အမျိုးအစား လက်မခံခြင်း၊</strong> Pro နှင့် Max တွင် ခရက်ဒစ်၊ ဒက်ဘစ် ကတ်များသာ ဖော်ပြထားသောကြောင့် prepaid ကတ်ကို ထိုအကြောင်းကြောင့်သာ ငြင်းပယ်နိုင်သည်။ Anthropic သည် ပိတ်ထားသော BIN များကို မထုတ်ဖော်ပါ။</li>
  <li><strong>လိပ်စာ မကိုက်ညီမှု၊</strong> ဘီလ်လိပ်စာသည် ဘဏ် မှတ်တန်းနှင့် ကိုက်ညီရမည်၊ ကတ် ထုတ်ပေးသည့် နိုင်ငံနှင့်လည်း ကိုက်ညီရမည်နှင့် အရင်းအမြစ် billing နေရာ ဖြစ်ရမည်။</li>
  <li><strong>3D Secure မပြီးမြောက်မှု၊</strong> ဘဏ်တောင်းဆိုပါက SMS ကုဒ် သို့မဟုတ် ဘဏ် app အတည်ပြုချက်ကို ပြီးမြောက်စေပါ။</li>
  <li><strong>ထပ်ခါထပ်ခါ ကြိုးစားမှု၊</strong> တစ်ကြိမ် ပြန်စမ်းပြီး ဘဏ်ကို မေးပါ။ ငြင်းပယ်ရသည့် အကြောင်းရင်းကို ကတ် ထုတ်ပေးသူသာ ရှင်းပြနိုင်သည်။</li>
</ul>

<h2>4. မေးလေ့ရှိသော ပြဿနာများ နှင့် အမြန် ဖြေရှင်းနည်းများ</h2>

<h3>Q၊ "Claude မှ session သက်တမ်းကုန်သည်ဟု ပြောသော်လည်း ယခုလေးတင် လော့ဂ်အင် ဝင်ခဲ့သည်"</h3>
<p><strong>A၊</strong> session cookies သည် IP နှင့် device fingerprint နှင့် ချိတ်ဆက်ထားသည်။ IP လျင်မြန်စွာ ပြောင်းလဲခြင်းက session ကို ပယ်ဖျက်စေသည်။ ဖြေရှင်းနည်း၊ ပြန်လည်အတည်ပြုမှု လျော့ချရန် 2FA ဖွင့်ပါ၊ session တစ်ခုလျှင် IP တည်ငြိမ်စွာ ထားပါ။</p>

<h3>Q၊ "API သည် prompt အသစ်များအတွက် cache ပြီး ပြန်လည်ရရှိသော အဖြေများ ပေးသည်"</h3>
<p><strong>A၊</strong> Prompt Cache သည် မရည်ရွယ်သော အကြောင်းအရာနှင့် ကိုက်ညီနေခြင်း ဖြစ်နိုင်သည်။ ဖြေရှင်းနည်း၊ cache miss ဖြစ်စေရန် prompt သို့ ထူးခြားသော identifier သို့မဟုတ် timestamp ထည့်ပါ၊ <code>{prompt} [request_id: {Date.now()}]</code>။</p>

<h3>Q၊ "proxy သုံးနေသော်လည်း WebRTC က ပြားမှုစစ်မအမှန်တကယ် IP ပြသည်"</h3>
<p><strong>A၊</strong> WebRTC သည် peer connection အတွက် proxy ကို ကျော်ဖြတ်နိုင်သည်။ ဖြေရှင်းနည်း၊ browser ဆက်တင်တွင် WebRTC ကို လုံးဝ ပိတ်ပါ သို့မဟုတ် WebRTC Control extension ဖြင့် STUN တောင်းဆိုမှုများကို ပိတ်ပါ။</p>

<h3>Q၊ "အကောင့် ရုတ်တရက် ဖုန်းအတည်ပြုမှု တောင်းဆိုလာသည်"</h3>
<p><strong>A၊</strong> IP ပြောင်းလဲမှု၊ device အသစ် လော့ဂ်အင် သို့မဟုတ် သံသယဖြစ်ဖွယ် လှုပ်ရှားမှု ကြောင့် ဖြစ်နိုင်သည်။ ဖြေရှင်းနည်း၊ အမှန်တကယ် physical SIM အတည်ပြုဝန်ဆောင်မှု အသုံးပြုပါ၊ အတည်ပြုပြီးချင်း 2FA ချိတ်ဆက်၍ ပြန် တောင်းဆိုမှု မဖြစ်စေရန် ကြိုးစားပါ။</p>
`;
