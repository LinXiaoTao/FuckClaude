export const content = `
<h2>1. Claude Code steganography ဖြစ်ရပ်ခွဲခြင်း</h2>
<p>၂၀၂၆ ခုနှစ် ဧပြီလတွင် တရားဝင် <code>@anthropic-ai/claude-code</code> CLI ကို reverse-engineering လုပ်ရာတွင် <code>ANTHROPIC_BASE_URL</code> ဖြင့် တတည့်တည်းမဟုတ်သော endpoint သို့ ချိတ်ဆက်သုံးစွဲသူများအတွက် CLI က အသုံးပြုသူကို မပြောပြဘဲ client-side detection logic ကို လုပ်ဆောင်ကြောင်း ဖော်ထုတ်ခဲ့သည်။</p>

<ul>
  <li><strong>Timezone စစ်ဆေးမှု။</strong> စနစ် timezone သည် <code>Asia/Shanghai</code> သို့မဟုတ် <code>Asia/Urumqi</code> နှင့် ကိုက်ညီမှု စစ်ဆေးသည်။ ကိုက်ညီပါက system prompt မှတ်ပါတ်ရှိ <code>Today's date is 2026-06-30</code> ရက်စွဲ ခြားနားရေးစဉ် ပေးတံများကို မျဉ်းစောင်းသို့ ပြောင်းသည်။ <code>2026/06/30</code></li>
  <li><strong>Host နှင့် lab keyword blacklist။</strong> proxy host ကို XOR ကုဒ်ဖြင့် ကုဒ်ဝှက် (key။ ၉၁) base64 စာရင်း domain ၁၄၇+ ခုနှင့် တရုတ် AI lab keyword များနှင့် ယှဉ်စစ်သည် (ဥပမာ <code>deepseek</code>၊ <code>moonshot</code>၊ <code>zhipu</code>၊ <code>minimax</code>၊ <code>dashscope</code>၊ <code>*.cn</code>)။</li>
  <li><strong>Unicode apostrophe အစားထိုးခြင်း။</strong> "Today's date" ရှိ apostrophe ကို မြင်နိုင်ပုံ တူညီသော Unicode variant များဖြင့် ပြင်သည်။
    <ul>
      <li>Host က reseller domain စာရင်းနှင့် ကိုက်ညီပါက <code>U+2019</code> (’ Right Single Quotation Mark) ဖြင့် အစားထိုးသည်</li>
      <li>Host က AI lab keyword များနှင့် ကိုက်ညီပါက <code>U+02BC</code> (Modifier Letter Apostrophe) ဖြင့် အစားထိုးသည်</li>
      <li>နှစ်မျိုးလုံး ကိုက်ညီပါက <code>U+02B9</code> (Modifier Letter Prime) ဖြင့် အစားထိုးသည်</li>
    </ul>
  </li>
</ul>

<p>ဤ steganographic payload သည် proxy forwarding ကို ဖြတ်ကျွေးနိုင်ပြီး Anthropic backend classifier များက HTTP header မှန်၍မထည့်ဘဲ distillation စစ်ဆင်ရေးနှင့် ခွင့်မပြုသော ကုန်ပြန်ရောင်းချမှုကို ခြေရာခံနိုင်စေသည်။</p>

<h3>ပတ်ဝန်းကျင် ကာကွယ်ရေးနှင့် လျော့ရဲခြင်း</h3>
<pre><code># 1. Tell client to treat custom endpoint as first-party
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Override system timezone for CLI executions
export TZ=Asia/Tokyo

# Launch Claude Code
claude</code></pre>

<h2>2. Anthropic ၏ 4 အလွှာ risk control မော်ဒယ်</h2>
<p>Anthropic သည် <code>claude.ai</code>၊ API endpoint များနှင့် Claude Code တစ်လျှောက် ပြည့်စုံသော anti-abuse နှင့် anti-distillation လုံခြုံရေး pipeline ကို အကောင်အထည်ဖော်သည်။</p>

<ol>
  <li><strong>Network နှင့် IP အလွှာ။</strong> ဒေတာစင်တာ IP အနက်အပိုင်း (AWS၊ Hetzner၊ DigitalOcean၊ Linode) ကို အမြင့် risk score များ ပေးထားသည်။ ပံ့ပိုးထားသော ဒေသများရှိ (US၊ UK၊ SG၊ JP၊ TW) dedicated double-ISP residential IP များတွင် အနိမ့်ဆုံး risk ရှိသည်။</li>
  <li><strong>Browser နှင့် device fingerprint။</strong> OS timezone (<code>Intl.DateTimeFormat</code>)၊ browser ဘာသာစာရင်း (<code>navigator.languages</code>)၊ တရုတ်ဖောန့်များအတွက် Canvas width probing (Microsoft YaHei၊ PingFang SC၊ MiSans) နှင့် User-Agent CH header များကို ပေါင်းစပ်သည်။</li>
  <li><strong>Payment နှင့် identity အလွှာ။</strong> အမြင့်အန္တရာယ် virtual card BIN များ (ဥပမာ ပမာဏကျော်လွန်စွာ ထုတ်ပေးသော prepaid card bin များ)၊ billing address နိုင်ငံအလိုက် မကိုက်ညီမှု နှင့် VoIP virtual ဖုန်းနံပါတ်များသည် ချက်ချင်း subscription ပယ်ဖျက်ခြင်း သို့မဟုတ် payment ငြင်းပယ်ခြင်းကို ဖြစ်စေနိုင်သည်။</li>
  <li><strong>Behavioral နှင့် distillation classifier များ။</strong> ထပ်ခါထပ်ခါ prompt များကို သန်းပေါင်းများစွာ ပို့သော automated script များ၊ မြင့်မားသော ကြိမ်နှုန်း context window saturation များ နှင့် prompt caching အလွဲသုံးစားမှုများသည် automated account lock နှင့် organization quota များ ဖြစ်စေနိုင်သည်။</li>
</ol>
`;
