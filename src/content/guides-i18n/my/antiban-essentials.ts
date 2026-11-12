export const content = `
<p>ဤ checklist သည် Anthropic က တရားဝင် ကြေညာထားသည့်အရင်းအမြစ်ဖြင့် စတင်ပြီး community report နှင့် လူသိရှိသော reverse-engineering တွင် အများဆုံး ဖော်ပြရသည့် လုပ်ထုံးလုပ်နည်းများကို ဆက်ဖော်ပြသည်။ တရားဝင် အပိုင်းပြင်ပ အကြောင်းများသည် စောင့်ကြည့်မှုတင်ထားခြင်းများသာဖြစ်ပြီး စာရွက်စာတမ်းလက်ရှိစည်းမျဉ်းများမဟုတ်ပါ၊ ထို့ပြင် မည်သည့်အရာမျှ မီးလက်လုံသော အကောင့်ကို အရည်အချင်းပြည့်မီစေမည်မဟုတ်ပါ။ အပိုင်းတစ်ခုစီတွင် နက်ရှိုင်းသော လမ်းညွှန်သို့ လင့်ခ်ပါသည်။</p>

<h2>တရားဝင် စည်းမျဉ်း ဦးစွာ</h2>
<ul>
  <li><strong>Ban အကြောင်းရင်းများ။</strong> Anthropic <a href="https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals" target="_blank" rel="noopener noreferrer">Help Center</a> တွင် အသုံးပြုမှု မူဝါဒ ဖောက်ဖက်မှုကြိမ်များစွာ၊ မပံ့ပိုးသော တည်နေရာမှ အကောင့် ဖန်တီးမှုနှင့် ဝန်ဆောင်မှုစည်းကမ်းချက် ဖောက်ဖက်မှုကို ဖော်ပြထားသည်။</li>
  <li><strong>ပံ့ပိုးသော ဒေသများ။</strong> တရုတ်ပြည်မကြီး၊ ဟောင်ကောင်နှင့် မဟော်ကျူကို <a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">Supported Regions list</a> တွင် မပါဝင်ပါ၊ তိုင်ဝမ်၊ စင်္ကာပူ၊ ဂျပန်နှင့် အိန္ဒိယ ပါဝင်သည်။ ဟောင်ကောင်အသုံးပြုသူများက ၂၀၂၆ ခုနှစ် အောက်တိုဘာ ၁ ရက်မှ ရပ်ဆိုင်းခံရကြောင်း တင်ပြခဲ့ပြီး ပံ့ပိုးသော ဒေသရှိ VPN exit ဖြင့် ချိတ်ဆက်သူများပါ ထည့်သွင်းထားပြီး Anthropic က မှတ်ချက်မပြုသေးပါ (<a href="/news/">News</a> ကြည့်ပါ)။</li>
  <li><strong>ငွေပေးချေမှု။</strong> web ရှိ Pro နှင့် Max တွင် credit သို့မဟုတ် debit ကတ်သာ လက်ခံသည်၊ billing လိပ်စာသည် ကတ်၏ မူလနိုင်ငံနှင့် ကိုက်ညီရမည်။ <a href="/guides/payment-methods-comparison/">payment methods နှင့် decline troubleshooting</a> ကြည့်ပါ။</li>
  <li><strong>Appeal များ။</strong> ban ခံရသော အကောင့်ဖြင့် claude.ai သို့ လက်မှတ်ထိုးဝင်ပြီး appeal form သို့ ရောက်ပါ။ API သတိပေးချက်များကို usersafety@anthropic.com သို့ ပို့ပါ။</li>
  <li><strong>ကျယ်ပြန့်မှု။</strong> Anthropic <a href="https://www.anthropic.com/transparency/system-trust-reporting" target="_blank" rel="noopener noreferrer">transparency report</a> တွင် ၂၀၂၆ ခုနှစ် ပထမနှစ်ပိုင်း appeal များ၏ နှစ်လုံး ၁၀.၅% ခန့် reinstatement ဖြစ်ကြောင်း ပြသည်။</li>
</ul>

<h2>1. အကောင့်နှင့် ငွေပေးချေမှု လုံခြုံရေး</h2>
<ul>
  <li><strong>အကောင့်တစ်ခု၊ identity stack တစ်ခု။</strong> Pro အကောင့်များစွာတွင် တူညီသော ကတ်၊ ဖုန်းနံပါတ် သို့မဟုတ် billing လိပ်စာ ပြန်မသုံးပါနဲ့။ community report များသည် batch disable များကို shared payment instrument၊ ဖုန်းနံပါတ်နှင့် IP ချိတ်ဆက်မှုနှင့် ဆက်စပ်ကြသည်။</li>
  <li><strong>ကော်ပိုရိတ ပိုင်ဆိုင်မှု အရေးကြီးသည်။</strong> ၂၀၂၅ စက်တင်ဘာလမှ စပြီး မပံ့ပိုးသော ဒေသများ (ဥပမာ တရုတ်) တွင် ဌာနချုပ်ရှိ ကုမ္ပဏီ ၅၀% အထက် ပိုင်ဆိုင်သော အရပ် ပိတ်ထားသည်၊ စင်္ကာပူ သို့မဟုတ် US တွင် မှတ်ပုံတင်ထားသော်လည်း။</li>
  <li><strong>ပထဝီဝင်ညီညွတ်မှု။</strong> ကတ် နိုင်ငံနှင့် billing လိပ်စာ ကိုက်ညီရမည် (တရားဝင်လိုအပ်ချက်)။ community report များသည် US ကတ်၊ စင်္ကာပူ IP နှင့် တရုတ် timezone ပေါင်းစပ်မှု က ban ဖြစ်ရပ်များတွင် မကြာခဏ တွေ့ရကြောင်း ဖော်ပြသည်။</li>
  <li><strong>VoIP နံပါတ်များကို ရှောင်ပါ။</strong> ရုပ်ပိုင်းဆိုင်ရာ SIM သို့မဟုတ် ယုံကြည်စိတ်ချရသော SMS ဝန်ဆောင်မှု သုံးပါ၊ VoIP prefix အများ စိစစ်မှု မအောင်မြင်ခြင်း သို့မဟုတ် ချက်ချင်း review ဖြစ်စေနိုင်သည်။</li>
  <li><strong>refund request ကို ဦးစွာ သုံးပါ။</strong> Anthropic သည် ဘဏ် dispute များ အကောင့်အပေါ် သက်ရောက်မှု မထုတ်ပြန်သေးပါ။ ငွေတောင်းမရခြင်း သို့မဟုတ် မလိုလားသော charge တွေ့ပါက ဘဏ်ဆက်မသွားမီ Get help &gt; Claude Refund Request သုံးပါ။</li>
</ul>
<p>→ လမ်းညွှန်အပြည့်။ <a href="/guides/account-registration-and-payment-antiban/">Safe Account Registration & Payment</a></p>

<h2>2. ပတ်ဝန်းကျင်နှင့် browser သန့်ရှင်းမှု</h2>
<ul>
  <li><strong>timezone ကို ဦးစွာ ပြင်ပါ။</strong> လူသိရှိသော reverse-engineering report များအရ Claude Code သည် စနစ် timezone ကို ဖတ်သည်။ Asia/Shanghai မှ ထွက်ပြီး <code>getTimezoneOffset()</code> သည် UTC+8 မဟုတ်ကြောင်း အတည်ပြုပါ။</li>
  <li><strong>ဘာသာစကားနှင့် fonts။</strong> <code>navigator.languages</code> ထိပ်ဆုံး zh-CN ဖယ်ရှားပါ၊ တရုတ် vendor fonts (MiSans၊ HarmonyOS Sans) ကို သန့်ရှင်းသော browser profile တွင် ခွဲထားပါ။</li>
  <li><strong>WebRTC leak ရပ်ပါ။</strong> WebRTC ကို ပိတ် သို့မဟုတ် ကန့်သတ်ပါ၊ မူလ IP proxy မကရောက်စေရန်။</li>
  <li><strong>သန့်ရှင်းပြီး တည်ငြိမ် IP သုံးပါ။</strong> shared datacenter နှင့် စီးပွားရေး VPN အနက်များသည် residential သို့မဟုတ် မိုဘိုင်း IP ထက် ban report များတွင် မကြာခဏ တွေ့ရသည်။ ပံ့ပိုးသော ဒေသရှိ သန့်ရှင်းသော residential သို့မဟုတ် မိုဘိုင်း IP ကို ဦးစားပေးပါ။</li>
</ul>
<p>→ လမ်းညွှန်အပြည့်။ <a href="/guides/environment-cleanup-and-ip-setup/">Environment Cleanup & IP Setup</a> · <a href="/guides/browser-configuration-guide/">Browser Configuration</a></p>

<h2>3. API နှင့် Claude Code အသုံးပြုမှု</h2>
<ul>
  <li><strong>CLI နှင့် browser ကို တူညီအောင်။</strong> Claude Code လုပ်ဆောင်သည့် shell တိုင်း၌ တူညီသော <code>TZ</code>၊ proxy နှင့် <code>ANTHROPIC_BASE_URL</code> export လုပ်ပါ။ split-brain config (browser VPN၊ CLI တိုက်ရိုက်) သည် 403 အဓိကအကြောင်းရင်းဖြစ်သည်။</li>
  <li><strong>rate limit လေးစားပါ။</strong> <a href="https://platform.claude.com/docs/en/api/rate-limits" target="_blank" rel="noopener noreferrer">API docs</a> တွင် Start၊ Build နှင့် Scale tier များ ဖော်ပြထားသည်၊ Start တွင် မော်ဒယ်တစ်ခုလျှင် 1,000 RPM၊ organization အသစ်များ ပိုနိမ့်သော Evaluation tier တွင် စတင်နိုင်သည်။ quota လက်ကျန် ရှိသော်လည်း ထပ်ခါမြင့်မားသော သို့မဟုတ် ညှိနှိုင်းထားသော traffic စိစစ်ခံရနိုင်သည်။ bulk အလုပ်အတွက် exponential backoff၊ Batch API သို့မဟုတ် prompt caching သုံးပါ။</li>
  <li><strong>relay ကို ဂရုတ်စွာ ရွေးပါ။</strong> <code>cache_control</code> marker သို့မဟုတ် <code>anthropic-beta</code> header များ ဖယ်ရှားသူ သို့မဟုတ် စာသား ထည့်သွင်းသူ gateway များသည် prompt cache ဖြိုဖျက်ပြီး အလွဲသုံးစားလို့ထင်ရစေနိုင်သည်။</li>
  <li><strong>credential မမျှဝေပါ။</strong> API key များကို public repo၊ chat log သို့မဟုတ် shared CI log တွင် မထည့်ပါနဲ့။ ပြန်ပေါက်ပါက လှည့်ပြောင်းပါ။</li>
</ul>
<p>→ လမ်းညွှန်အပြည့်။ <a href="/guides/claude-code-and-api-safety/">Claude Code & API Safety</a> · <a href="/guides/automation-safety-practices/">Automation Safety</a></p>

<h2>4. အသုံးပြုမှု ပုံစံနှင့် ကြိမ်နှုန်း</h2>
<ul>
  <li><strong>အကောင့်အသစ်ကို warm up လုပ်ပါ။</strong> တစ်ရက်အတွင်း API ခေါ်ဆိုမှုရာပေါင်း သို့မဟုတ် ရှည်လျားသော Claude Code session များ ရှောင်ပါ။ တဖြည်းဖြည်းအသုံးပြုမှု သည် အသစ်ခြင်း tier အမြင့်ဆုံး load ထက် သဘာဝကျသည်ဟု ထင်ရစေသည်။</li>
  <li><strong>distillation ပုံစံကို ရှောင်ပါ။</strong> Anthropic ၏ ၂၀၂၆ ဖေဖော်ဝါလ distillation report သည် ကျဉ်းမြောင်း domain တွင် အမြင့်သတ်မှတ်ထားသော capacity targeting ကို သတ်မှတ်သည်ဟု ဖော်ပြသည်၊ ဥပမာ နီးပါးတူညီသော coding prompt ထောင်ပေါင်းချီ။ ၂၀၂၆ ဩဂုတ် ၃၁ ပြီးနောက် ဖန်တီးသော အကောင့်များတွင် thinking block replay binding ပိုမိုတင်းကျပ်သည်၊ raw thinking block cache မှ ပြန်မဖွင့်ပါနဲ့။ အလုပ်များကို အချိန်ဖြန့်ပြီး prompt ဖွဲ့စည်းပုံ ကွဲပြားစေပါ။</li>
  <li><strong>workload ခွဲထားပါ။</strong> ပင်မပေးချေထားသော အကောင့်တွင် ပြင်းထန်သော scraping၊ အကောင့်အများစွာ ဖန်တီးမှု သို့မဟုတ် policy အနားသတ် prompt များ မလုပ်ပါနဲ့။</li>
  <li><strong>အကောင့်တစ်ခုလျှင် device fingerprint တစ်ခု။</strong> တူညီ login ဖြင့် နာရီအနည်းငယ်အတွင်း တရုတ် locale laptop နှင့် US VPS အကြား အချိန်မွေမွနှစ်ပါက association အန္တရာယ် မြင့်တက်သည်။</li>
  <li><strong>မှတ်တမ်းနှင့် audit။</strong> request ပမာဏနှင့် error rate ကို မြင်နိုင်စေပါ၊ 429 တက်ပြီးနောက် review သို့ မတက်မီ စောင့်ကြည့်ပါ။</li>
</ul>
<p>→ လမ်းညွှန်အပြည့်။ <a href="/guides/multi-account-management/">Multi-Account Management</a> · <a href="/guides/ban-case-studies/">Ban Case Studies</a></p>

<h2>5. တစ်ခုခု မှားယွင်းလာသည့်အခါ</h2>
<ul>
  <li><strong>ban အမျိုးအစား ခွဲခြားပါ။</strong> login တွင် 403 (IP/geo)၊ အတင်းအကြပ် refund email (payment မကိုက်ညီ) သို့မဟုတ် အပြည့်အဝ disable (policy)။ တစ်ခုစီအတွက် တုံ့ပြန်မှု ကွဲပြားသည်။</li>
  <li><strong>တရားဝင် channel များမှ appeal။</strong> disabled အကောင့် → <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a>၊ API သတိပေးချက် → usersafety@anthropic.com။ Anthropic သည် တုံ့ပြန်အချိန် မထုတ်ပြန်ပါ၊ တရားဝင် အသုံးပြုမှုကို အင်္ဂလိပ်ဖြင့် အတည်ပြုနိုင်သော နောက်ခံနှင့်ဖော်ပြပါ။</li>
  <li><strong>အိတ်ထားပြီး အကောင့်အသစ် မဖန်တီးပါနဲ့။</strong> community report များအရ တုံ့ပြန်ချိန် ရက်အနည်းငယ်အတွင်း reinstatement မှ အပတ်များစွာ မဖြေကြားခြင်းအထိ ကွဲပြားသည်၊ Anthropic မှ တုံ့ပြန်ချိန် မထုတ်ပြန်ပါ။ appeal စောင့်နေစဉ် အစားထိုး အကောင့်ဖန်တီးခြင်းသည် community report အရ association အန္တရာယ် မြင့်စေသည်။</li>
  <li><strong>အနာဂတ်လုံအောင် fail over။</strong> ပြန်လည်ထိန်းသိမ်းရာတွင် production ရပ်စဲမသွားအောင် ပြည်တွင်းမော်ဒယ် သို့မဟုတ် local Ollama/One-API route ကြိုပြင်ထားပါ။</li>
</ul>
<p>→ လမ်းညွှန်အပြည့်။ <a href="/guides/account-appeal-and-recovery-sop/">Account Appeal & Recovery SOP</a> · <a href="/guides/domestic-and-open-source-alternatives/">Domestic Alternatives</a></p>

<h2>အမြန် မိမိကိုယ်ကို စစ်ဆေးခြင်း</h2>
<p>Claude သုံးသည့် အတူတူ browser profile တွင် <a href="/">Fuck Claude detector</a> ကို လုပ်ပါ။ အမှတ် ၆၀ ကျော်လျှင် payment သို့မဟုတ် API မပြင်မီ timezone နှင့် ဘာသာစကား ပြင်ပါ။ အမှတ် ၃၀ အောက် ဖြစ်ပြီး ban ဆက်ရှိနေလျှင် စကန်သည် အကောင့် ဒေသ၊ IP reputation၊ payment နည်းလမ်း သို့မဟုတ် အသုံးပြုမှုပုံစံ မမြင်နိုင်သေးပါ၊ ထို့နောက် စစ်ဆေးပါ။ မပံ့ပိုးသော တည်နေရာမှ ဖန်တီးသော အကောင့် browser score မည်သို့ပင်ဖြစ်စေ disable ဖြစ်နိုင်သည်။</p>
`;
