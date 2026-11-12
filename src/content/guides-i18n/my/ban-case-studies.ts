export const content = `
<p><strong>မှတ်ချက်:</strong> အောက်ဖော်ပြပါ အခြေအနေများ၏ အသေးစိတ်များကို ကိုယ်ပိုင် အတည်မပြုရသေးပြီး အကြောင်းရင်းများ သည် Anthropic က အတည်ပြုထားသော ကောက်ယူချက် မဟုတ်ဘဲ အဓိပ္ပာယ်ဖွင့်ဆိုချက်များဖြစ်သည်။ Anthropic ၏ တရားဝင် ပိတ်ပင်ခြင်း အကြောင်းရင်းများကို <a href="/guides/antiban-essentials/">Anti-Ban Essentials</a> တွင် အကျဉ်းချုပ်ဖော်ပြထားသည်။</p>

<h2>1. အခြေအနေ 1: Timezone မကိုက်ညီမှု အစုလိုက် ပိတ်ပင်ခြင်း</h2>
<p><strong>ဖြစ်ရပ်:</strong> ဆော့ဖ်ဝဲဖွံ့ဖြိုးရေးသမား 15 ဦးပါ အဖွဲ့သည် နိုင်ငံခြားသို့ လာသောအခါ Claude Pro အကောင့်များ မှတ်ပုံတင်ခဲ့သည်။ 72 နာရီအတွင်း အကောင့် 12 ခုကို « Terms of Service ချိုးဖောက်ခြင်း » အကြောင်းပြချက်ဖြင့် အပြီးအပိုင် ပိတ်ပင်ခဲ့သည်။</p>

<h3>အကြောင်းရင်း ခွဲခြမ်းစိတ်ဖြာမှု</h3>
<ul>
  <li>စနစ် timezone သည် US အခြေပြု residential proxy သုံးရာတွင် <code>Asia/Shanghai</code> (UTC+8) အဖြစ် ရပ်တည်နေခဲ့သည်။</li>
  <li>browser <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code> သည် <code>"Asia/Shanghai"</code> ပြန်ပေးပြီး Claude Code သည် ၎င်းကို ဖတ်ယူကာ system prompt သို့ ထည့်သွင်းသည်။</li>
  <li>ငွေပေးချေကတ်များကို US ငွေတင်ဆောင်မှု လိပ်စာများနှင့် ချိတ်ဆက်ထားသော်လည်း timezone မကိုက်ညီမှုသည် အလိုအလျောက် အန္တရာယ် classifier များ ဖွင့်ခဲ့သည်။</li>
</ul>

<h3>ကာကွယ်ရေး Checklist</h3>
<pre><code># Before registration, verify timezone alignment:
# macOS
sudo systemsetup -gettimezone

# Linux
timedatectl

# Ensure timezone matches proxy exit region:
sudo systemsetup -settimezone "America/New_York"</code></pre>

<ul>
  <li>Claude.ai မဖွင့်မီ OS timezone ကို proxy IP ထွက်ပေါက် ဒေသနှင့် <em>ကိုက်ညီအောင်</em> သတ်မှတ်ပါ။</li>
  <li>browser console တွင် timezone စစ်ပါ: <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code>။</li>
  <li>timezone ပြောင်းပြီးချင်း browser cookie အားလုံး ရှင်းပြီး ပြန်စသည်။ cache ထားသော fingerprint များ ရှင်းလင်းစေရန် ဖြစ်သည်။</li>
</ul>

<h2>2. အခြေအနေ 2: Prepaid ကတ် ပြန်အမ်းခြင်းနှင့် ဆိုင်းငံ့ခြင်း</h2>
<p><strong>ဖြစ်ရပ်:</strong> Claude Pro စာရင်းသွင်းမှု ရှစ် ခုကို ပထမနေ့တွင် အောင်မြင်စွာ ကောက်ခံခဲ့သော်လည်း 48 နာရီအတွင်း အကောင့်များကို အလိုအလျောက် ပြန်အမ်းပြီး ဆိုင်းငံ့ခဲ့သည်။</p>

<h3>အကြောင်းရင်း ခွဲခြမ်းစိတ်ဖြာမှု</h3>
<ul>
  <li>အကောင့်အားလုံးသည် တူညီ BIN အောက်မှ ထုတ်သော virtual prepaid Visa ကတ်များကို သုံးခဲ့သည်။ Anthropic သည် မည်သည့် BIN ကို ပိတ်ဆို့သည်ကို မထုတ်ပြန်ပြီး prepaid ကတ်များကို Pro သို့မဟုတ် Max အတွက် လက်ခံသည်ဟု မဖော်ပြထားပါ။</li>
  <li>ငွေတင်ဆောင်မှု လိပ်စာများသည် ဂျန်းရိုး (ဥပမာ « 123 Main St ») ဖြစ်ပြီး ကတ်ထုတ်ပေးဘဏ် ဒေသနှင့် ကိုက်ညီသော နေထိုင်လိပ်စာ အစစ်မဟုတ်ပါ။</li>
  <li>ငွေကောက်ခံမှုများ ပြန်အမ်းပြီး အကောင့်များကို « Refunded / Suspended » အဖြစ် သတ်မှတ်ခဲ့သည်။ Anthropic သည် အကြောင်းရင်း မဖော်ပြပါ။</li>
</ul>

<h3>ကာကွယ်ရေး Checklist</h3>
<ul>
  <li>prepaid virtual ကတ်အစား တည်ငြိမ်သော ဘဏ်ထုတ် credit သို့မဟုတ် debit ကတ်သုံးပါ။</li>
  <li>ငွေတင်ဆောင်မှု လိပ်စာကို US ပြည်နယ် proxy IP နှင့် ကိုက်ညီသော၊ စစ်ဆေးနိုင်သော နေထိုင်လိပ်စာ (USPS လိပ်စာရှာဖွေခြင်း သုံးပါ) ဖြည့်ပါ။</li>
  <li>ကတ်လက်ကျန်သည် ပထမဆုံး ကောက်ခံမှုနှင့် နောက်တစ်ခု သက်တမ်းတိုးကို ဖုံးလွှမ်းနိုင်ကြောင်း သေချာပါ။</li>
  <li>virtual ကတ် တစ်ခုကို Claude အကောင့် 2 ခုထက် မပိုသော မျှ ချိတ်ဆက်ပါ။</li>
</ul>

<h2>3. အခြေအနေ 3: API အသုံးပြုနှုန်း အလွဲအသုံးရှာဖွေမှု</h2>
<p><strong>ဖြစ်ရပ်:</strong> စတာ့ပ် တစ်ခု၏ API key သည် 6 နာရီအတွင်း တောင်းဆိုမှု 50,000 ခု ပို့သော batch distillation အလုပ်ပြီးနောက် တစ်မိနစ်လျှင် တောင်းဆိုမှု 1 ခုသို့ ကန့်သတ်ခြင်းခံခဲ့သည်။</p>

<h3>အကြောင်းရင်း ခွဲခြမ်းစိတ်ဖြာမှု</h3>
<ul>
  <li>script သည် rate limit သို့မဟုတ် jitter မပါဘဲ အများဆုံး throughput ဖြင့် တောင်းဆိုမှုများ ပို့ခဲ့သည်။</li>
  <li>prompt အားလုံးသည် သေးငယ်သော parameter ကွဲပြားချက်များဖြင့်သာ ကွဲပြားပြီး အများအားဖြင့် တူညီနေခဲ့ပြီး Anthropic ၏ distillation detection classifier များ ဖွင့်ခဲ့သည်။</li>
  <li>တောင်းဆိုမှုများသည် AWS EC2 datacenter IP တစ်ခုတည်းမှ ပေါ်ထွက်ပြီး အလွဲအသုံးအန္တရာယ်အမှက် ပို မြင့်ခဲ့သည်။</li>
</ul>

<h3>ကာကွယ်ရေး Checklist</h3>
<pre><code>// Implement exponential backoff and jitter in API client
async function callClaudeWithBackoff(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropic.messages.create({
        model: "claude-sonnet-4.5-high",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error: any) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}</code></pre>

<ul>
  <li>API ခေါ်ဆိုမှုများအကြား exponential backoff နှင့် ကျပန်း jitter (100-3000ms) အကောင်အထည် ဖွင့်ပါ။</li>
  <li>တစ်နာရီလျှင် တောင်းဆိုမှု 1000 ထက်ကျော်လျင် စီးပွားရေး စီမံကိန်းများပြား API key များ လှည့်ပါ။</li>
  <li>API traffic အတွက် residential proxy IP သုံးပါ၊ datacenter IP များ မသုံးပါနှင့်။</li>
  <li>prompt ဖွဲ့စည်းပုံ ကွဲပြားစေပြီး classifier ရှာဖွေမှုကို ရှောင်ရန် သဘာဝလူသဏ္ဌာန်ဖြင့် အပြောင်းအလဲများ ထည့်ပါ။</li>
</ul>

<h2>4. အခြေအနေ 4: အကောင့်ဆက်စပ်မှု လက်ဆောင် ပိတ်ပင်ခြင်း</h2>
<p><strong>ဖြစ်ရပ်:</strong> အဖွဲ့အပေါင်းတွင် အကောင့် တစ်ခုသည် ToS ချိုးဖောက်ပြီးနောက် Claude အကောင့် ငါးခုကို တပြိုင်နက် ပိတ်ပင်ခဲ့သည်။</p>

<h3>အကြောင်းရင်း ခွဲခြမ်းစိတ်ဖြာမှု</h3>
<ul>
  <li>အကောင့် ငါးခုလုံးသည် တူညီ စက်ပစ္စည်းတွင် browser ပရိုဖိုင်များ မတူဘဲ Claude Code ဖြင့် လော့ဂ်အင်ဝင်သောကြောင့် တူညီ <code>organizationUuid</code> မျှဝေခဲ့သည်။</li>
  <li>တူညီ virtual credit ကတ်ကို 5 ခုအနက် 4 ခုမှာ ချိတ်ဆက်ထားခဲ့သည်။</li>
  <li>အကောင့် တစ်ခုကို အလိုအလျောက် script အသုံးပြုမှုအတွက် သတ်မှတ်သောအခါ Anthropic နောက်ခံသည် ဆက်စပ်အကောင့်အားလုံးကို ချိတ်ဆက်ပြီး အစုလိုက် ပိတ်ပင်မှု လုပ်ဆောင်ခဲ့သည်။</li>
</ul>

<h3>ကာကွယ်ရေး Checklist</h3>
<pre><code># Check Claude Code's organizationUuid grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>virtual credit ကတ်ကို Claude အကောင့် 2 ခုထက် မပိုသော မျှ မမျှဝေပါနှင့်။</li>
  <li><code>organizationUuid</code> မျှဝေမှုကို ရှောင်ရန် တန်ဖိုးမြင့် အကောင့်များအတွက် စက်ပစ္စည်း သို့မဟုတ် virtual machine ခွဲသုံးပါ။</li>
  <li>browser ပရိုဖိုင်သုံးပါက တစ်ပရိုဖိုင်လျှင် cookie၊ localStorage နှင့် fingerprint (Canvas၊ WebGL) လုံးဝ ခွဲထုတ်ထားကြောင်း သေချာပါ။</li>
  <li>အချိန်တိုအတွင်း ဆက်စပ်အကောင့်များအားလုံး batch လုပ်ဆောင်မှုများ ရှောင်ပါ။</li>
</ul>

<h2>5. သင်ခန်းစာများနှင့် ကာကွယ်ရေး Checklist</h2>
<p>ပိတ်ပင်မှု အခြေအနေတိုင်းတွင် ပုံသေ ပုံစံများ ပါရှိသည်။ အန္တရာယ် လျော့ချရန် ဤ master checklist လိုက်နာပါ:</p>

<ul>
  <li><strong>မှတ်ပုံတင်မှု မပြုမီ:</strong> OS timezone ညှိခြင်း၊ browser အခြေအနေ ရှင်းလင်းခြင်း၊ residential IP အတည်ပြုခြင်း၊ သင့်လျော်သော ဖုန်းနံပါတ်နှင့် ကတ် ပြင်ဆင်ခြင်း။</li>
  <li><strong>ငွေပေးချေမှု ချိတ်ဆက်ခြင်း:</strong> တည်ငြိမ်သော ဘဏ်ထုတ် credit သို့မဟုတ် debit ကတ်၊ ဘဏ်မှတ်တန်းနှင့် ကိုက်ညီသော ငွေတင်ဆောင်မှု လိပ်စာ အစစ်၊ သက်တမ်းတိုးအတွက် လက်ကျန်လုံလောက်ခြင်း၊ ကတ် တစ်ခုကို အကောင့်များစွာတွင် ပြန်သုံးခြင်း ရှောင်ခြင်း။</li>
  <li><strong>နေ့စဉ်အသုံးပြုမှု:</strong> timezone/IP/စက်ပစ္စည်း fingerprint တိကျစွာ ထားခြင်း၊ 2FA ဖွင့်ခြင်း၊ 2FA ပြန်အတည်မပြုဘဲ IP အမြန် ပြောင်းခြင်း ရှောင်ခြင်း။</li>
  <li><strong>API အလိုအလျောက်လုပ်ဆောင်မှု:</strong> rate limit၊ jitter၊ residential proxy နှင့် prompt အမျိုးမျိုးထားခြင်းဖြင့် distillation သတ်မှတ်ခြင်းများ ရှောင်ခြင်း။</li>
  <li><strong>အကောင့်ပေါင်း:</strong> organizationUuid၊ ငွေပေးချေမှုနည်းလမ်းနှင့် အသုံးပြုမှုပုံစံ ခွဲထုတ်ခြင်းဖြင့် ဆက်စပ်မှု ပိတ်ပင်ခြင်းကို ကာကွယ်ပါ။</li>
</ul>
`;
