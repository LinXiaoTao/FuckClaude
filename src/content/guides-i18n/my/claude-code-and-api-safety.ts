export const content = `
<p>Claude Code နှင့် custom API integration များသည် prompt ထက်ပို၍ ပို့သည်၊ environment metadata၊ routing ရွေးချယ်မှုနှင့် retry အပြုအမူများကို ထုတ်ပြီး upstream စနစ်များက အကောင့် ကျန်းမာရေးနှင့် ဆက်စပ်နိုင်သည်။ ဤလမ်းညွန်သည် <em>operational safety</em> ကို ဦးစားပေးသည်၊ ကြားခံမှတ်တမ်းတိုင်တန်သော shell configuration၊ gateway ရွေးချယ်မှုနှင့် quota တင်းကျပ်လာသောအခါ graceful failover။ ရည်မှန်းချက်မှာ ယုံကြည်စိတ်ချရသော engineering workflow ဖြစ်ပြီး Anthropic မူဝါဒကို လွဲကျော်ခြင်း မဟုတ်ပါ။</p>

<p>သန့်ရှင်းသော အခြေခံနဲ့ စပါ၊ CLI variable များ ချိန်မီမီ <a href="/guides/environment-cleanup-and-ip-setup/">environment cleanup and IP setup</a> နှင့် <a href="/guides/vpn-and-proxy-selection/">VPN and proxy selection</a> ကို ပြီးအောင်လုပ်ပါ။ relay သို့မဟုတ် multi-model router လုပ်ဆောင်ပါက degradation လမ်းကြောင်းများအတွက် <a href="/guides/domestic-and-open-source-alternatives/">domestic and open-source alternatives</a> ကို ဖတ်ပါ။</p>

<h2>1. Claude Code လုံခြုံရေး configuration များ</h2>
<p>Claude Code သည် စဖွင့်ချိန်တွင် shell environment variable များကို ဖတ်သည်။ timezone၊ proxy သို့မဟုတ် base URL မတူညီမှုသည် ရှုပ်ထွေးသော error များ ထွက်စေနိုင်သည်၊ သို့မဟုတ် client သည် browser session ထက် မတူပြားစွာ လုပ်ဆောင်နိုင်သည်။ terminal ကို နောက်မှ စဉ်းစားရမည့် အရာမဟုတ် ဦးစားပေး environment အဖြစ် သတ်မှတ်ပါ။</p>

<h3>အဓိက environment variable များ</h3>
<pre><code># ~/.zshrc or ~/.bashrc — load in every interactive shell

# 1. Declare custom Anthropic-compatible endpoints explicitly
export ANTHROPIC_BASE_URL="https://your-gateway.example.com"
export ANTHROPIC_API_KEY="sk-your-key"

# 2. When using a trusted first-party-shaped gateway, reduce client mismatch warnings
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 3. Align terminal timezone with your documented operating region
export TZ=Asia/Tokyo   # or America/Los_Angeles — match proxy geo

# 4. Route CLI HTTPS through the same clean proxy as your browser (if required)
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export NO_PROXY="localhost,127.0.0.1,.internal"</code></pre>

<h3>Configuration စစ်ဆေးစာရင်း</h3>
<ol>
  <li><strong>တစ်ခုတည်းသော အမှန်တရား အရင်းအမြစ်:</strong> env var များကို <code>~/.zshrc</code> (macOS) သို့မဟုတ် shell က source လုပ်သော <code>~/.claude/env</code> ဖိုင်တွင် သိမ်းပါ၊ terminal tab တစ်ခုတည်းတွင် ad hoc export မလုပ်ပါနှင့်။</li>
  <li><strong>စဖွင့်မီ အတည်ပြုပါ:</strong> Claude Code စတင်သည့် အတူတူညီသော window တွင်ပင် <code>env | grep -E 'ANTHROPIC|TZ|PROXY'</code> ကို run ပါ။</li>
  <li><strong>browser နှင့် CLI geography ကိုက်ညီပါစေ:</strong> browser profile သည် anti-detect tool ဖြင့် Tokyo timezone သုံးပါက CLI သည် <code>Asia/Shanghai</code> မသတင်းပို့သင့်ပါ။</li>
  <li><strong>base URL ပြောင်းလဲမှုများကို မှတ်တမ်းတင်ပါ:</strong> တိုက်ရိုက် Anthropic မှ relay သို့ပြောင်းသောအခါ <code>ANTHROPIC_BASE_URL</code> နှင့် အတွင်းပိုင်း runbook နှစ်ခုလုံး ပြင်ပြီး အဖွဲ့ဝင်များ endpoint မရောအောင် စီမံပါ။</li>
  <li><strong>လျှို့ဝှက်ချက် သန့်ရှင်းမှု:</strong> API key များကို repo သို့ commit မလုပ်ပါနှင့်၊ env ဖိုင်တွင် <code>chmod 600</code> သုံးပြီး relay key များကို သုံးလတိုင်း rotate လုပ်ပါ။</li>
</ol>

<h3><code>_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL</code> လုပ်သော အရာနှင့် မလုပ်သော အရာ</h3>
<p>ဤ flag သည် Claude Code အား မူလမဟုတ်သော <code>ANTHROPIC_BASE_URL</code> ကို client-side အချို့စစ်ဆေးမှုများတွင် စံ Anthropic endpoint ဟု မှတ်ယူရန် ပြောသည်။ အဖွဲ့အစည်းက အတည်ပြုထားသော အတွင်းပိုင်း gateway လည်ပတ်သောအခါ ပွတ်တိုက်မှု လျှော့ချပေးသည်။ ၎င်းသည် server-side policy၊ billing သို့မဟုတ် eligibility ကို <strong>မပြောင်းပါ</strong>။ client metadata ကို မည်သို့ ဆက်လက် အကဲဖြတ်နိုင်သည်ကို <a href="/guides/claude-steganography-and-risk-model/">Claude steganography and risk model</a> တွင် ကြည့်ပါ။</p>

<h3>မကြာခဏ ဖြစ်သော misconfiguration ပြဿနာများ</h3>
<ul>
  <li><strong>split-brain proxy:</strong> browser သည် VPN သုံးပြီး CLI မသုံးပါ၊ request များသည် မတူညီသော ASN များမှ ထွက်သည်။ လက္ခဏာ၊ web chat အလုပ်လုပ်ပြီး CLI သည် 403 ပြန်သည်။</li>
  <li><strong>သက်တမ်းကုန်နေသော <code>NO_PROXY</code>:</strong> <code>127.0.0.1</code> ပေါ်ရှိ local gateway သည် corporate proxy ကို bypass လုပ်ရမည်၊ မလုပ်ပါက loop များသည် connection reset ဖြင့် ကျရှုံးသည်။</li>
  <li><strong>API key scope မှား:</strong> organization key နှင့် project key များသည် rate limit အောက်တွင် မတူညီစွာ အပြုအမူ လုပ်သည်၊ Anthropic console တွင် key အမျိုးအစား အတည်ပြုပါ။</li>
  <li><strong>interactive vs non-interactive shell:</strong> Claude Code ခေါ်သော CI job များသည် env ဖိုင်တစ်ခုတည်းကို source လုပ်ရမည်၊ laptop များ၏ login shell များသည် ပျောက်နေသော export များကို မကြာခဏ ဖုံးကွယ်ထားသည်။</li>
</ul>

<h2>2. API relay gateway ရွေးချယ်ခြင်း</h2>
<p><code>api.anthropic.com</code> သို့ တိုက်ရိုက်ဝင်ရောက်မှု routing သို့မဟုတ် procurement ဖြင့် ကန့်သတ်ထားသောအခါ protocol fidelity ထိန်းသိမ်းနိုင်ပါက relay များသည် availability တိုးနိုင်သည်။ အရည်မပြည့်သော gateway သည် header များကို ငြိမ်းချင်းဖယ်ရှား၊ prompt များ ပြန်ရေးခြင်း သို့မဟုတ် latency spike ထည့်ပြီး မော်ဒယ် အရည်အသွေး ကျဆင်းသကဲ့သို့ မြင်ရစေနိုင်သည်။</p>

<h3>Gateway အကဲဖြတ်မှု ဇယား</h3>
<table>
  <thead>
    <tr>
      <th>စံနှုန်း</th>
      <th>အောင်မြင်</th>
      <th>ကျရှုံး (gateway အစားထိုး)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Prompt Cache header များ</td>
      <td><code>anthropic-beta: prompt-caching-2024-07-15</code> (သို့မဟုတ် လက်ရှိ beta) ကို မပြောင်းဘဲ ထပ်ဆင့်</td>
      <td>beta header များဖယ်၊ cache read token များ အမြဲ သုည</td>
    </tr>
    <tr>
      <td>System prompt တင်မူမှု</td>
      <td>system block များ byte-identical relay</td>
      <td>ကြော်ငြာ၊ watermark စာ သို့မဟုတ် "helpful" prefix ထည့်</td>
    </tr>
    <tr>
      <td>Streaming SSE</td>
      <td>event boundary နှင့် tool delta ထိန်းသိမ်း</td>
      <td>မီးထွက်မီ full response buffer၊ tool UI ပျက်</td>
    </tr>
    <tr>
      <td>Error transparency</td>
      <td>Anthropic status code နှင့် body များ ထပ်ဆင့်</td>
      <td>အရာရာကို generic 502 သို့ ပြောင်း</td>
    </tr>
    <tr>
      <td>Hostname neutrality</td>
      <td>သင့်တော်သော domain (ဥပမာ <code>api.yourcorp.net</code>)</td>
      <td>မသက်ဆိုင်သော AI vendor keyword ပါ public hostname သို့မဟုတ် Claude-only traffic အတွက် <code>.cn</code> TLD</td>
    </tr>
    <tr>
      <td>TLS &amp; cert pinning</td>
      <td>မှန်ကန်သော public CA၊ HSTS၊ SSL inspection MITM မရှိ</td>
      <td>client trust store မပြင်ဘဲ corporate SSL break</td>
    </tr>
  </tbody>
</table>

<h3>Prompt Cache ထိန်းသိမ်းမှု (ကုန်ကျစရိတ် သက်ရောက်မှု)</h3>
<p>Anthropic prompt caching သည် ထပ်ခါ input ကုန်ကျမှု၏ 90% အထိ လျှော့နိုင်သည်။ cache header ဖယ်သော relay များသည် လှည့်တိုင်း full-price input token တောင်းသည်၊ system prompt ရှည်သောအခါ 4×–10× အံ့သြစရာ မကြာခဏ ဖြစ်သည်။ request နှစ်ခုတန် စမ်းသပ်ပါ။</p>
<pre><code># Request 1: create cache
curl -s "$ANTHROPIC_BASE_URL/v1/messages" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: prompt-caching-2024-07-15" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":64,
       "system":[{"type":"text","text":"'$(python3 -c "print('x'*5000)")'",
         "cache_control":{"type":"ephemeral"}}],
       "messages":[{"role":"user","content":"ping"}]}'

# Request 2: expect cache_read_input_tokens &gt; 0 in usage</code></pre>
<p>အသေးစိတ် optimization စနစ်များကို <a href="/guides/api-advanced-optimization/">API advanced optimization</a> တွင် ကြည့်ပါ။</p>

<h3>production မတိုင်မီ operational due diligence</h3>
<ul>
  <li>24 နာရီ synthetic probe (15 မိနစ်တိုင်း message တစ်ခု) လုပ်ပြီး p95 latency နှင့် error rate တိုင်းပါ။</li>
  <li>request ID နမူနာ log လုပ်ပါ၊ အက်ပ်သည် incident များတွင် gateway log နှင့် upstream ID ဆက်စက်နိုင်ကြောင်း အတည်ပြုပါ။</li>
  <li>ဒေတာကိုင်တွယ်မှု သဘောတူစာချုပ် စစ်ဆေးပါ၊ relay အချို့သည် prompt log ရေး၍ abuse ရှာသည်၊ regulated workload အတွက် လက်မခံနိုင်ပါ။</li>
  <li>source code ကိုင်တွယ်သောအခါ opaque public reseller ထက် အဖွဲ့အစည်း ထိန်းချုပ်သော gateway (self-hosted LiteLLM၊ VPC ပေါ် One-API) ကို ဦးစားပေးပါ။</li>
</ul>

<p>အကောင့် အဆင့်တည်ငြိမ်မှု သည် registration သန့်ရှင်းမှုနှင့် ဆက်စပ်နေသေးသည်၊ relay သုံးစဉ် org အသစ် ဖွင့်သောအခါ <a href="/guides/account-registration-and-payment-antiban/">account registration and payment antiban</a> ကို ကြည့်ပါ။</p>

<h2>3. Rate limit (429) နှင့် smooth failover</h2>
<p>Anthropic rate limit များသည် organization နှင့် model tier အဆင့်တွင် အသုံးချသည်၊ API key တစ်ခုတည်း သီးသန့် မဟုတ်ပါ။ burst agent၊ parallel CI job နှင့် ကန့်သတ်မထားသော retry loop များသည် မျှဝေထားသော quota ကုန်စေပြီး တူညီသော org ၏ မသက်ဆိုင်သော service များကို ပိတ်ဆို့နိုင်သည်။</p>

<h3>ကန့်သတ်မှု အမျိုးအစားများ (ရိုးရှင်း)</h3>
<table>
  <thead>
    <tr>
      <th>အချက်ပြချက်</th>
      <th>HTTP Code</th>
      <th>အဓိပ္ပာယ်</th>
      <th>လုံခြုံသော တုံ့ပြန်မှု</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rate limit</td>
      <td>429</td>
      <td>တစ်မိနစ်လျှင် request/token များလွန်းသည်</td>
      <td>Exponential backoff + jitter၊ concurrency လျှော့</td>
    </tr>
    <tr>
      <td>Overloaded</td>
      <td>529</td>
      <td>Upstream စွမ်းရည်</td>
      <td>တို backoff၊ model downgrade ရွေးချယ်</td>
    </tr>
    <tr>
      <td>Auth / policy</td>
      <td>403</td>
      <td>Key မမှန် သို့မဟုတ် ဝင်ခွင့် ငြင်းပယ်</td>
      <td>မျက်စိမှုန်း retry မလုပ်၊ အကောင့်အခြေအနေ စစ်ပါ</td>
    </tr>
    <tr>
      <td>Bad request</td>
      <td>400</td>
      <td>Schema သို့မဟုတ် token limit</td>
      <td>payload ပြင်ပါ၊ context ဖြတ်တောက်ပါ</td>
    </tr>
  </tbody>
</table>

<h3>Retry နှင့် failover စနစ်</h3>
<pre><code>// TypeScript — retry 429/529, failover on sustained pressure
async function callClaudeWithFallback(prompt: string, opts: CallOpts) {
  const maxRetries = 4;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callClaudeAPI(prompt, opts);
    } catch (error: any) {
      const status = error?.status;
      if (status === 429 || status === 529) {
        const delay = Math.min(30_000, 500 * 2 ** attempt + Math.random() * 250);
        await sleep(delay);
        continue;
      }
      if (status === 403) throw error; // surface auth issues
      throw error;
    }
  }
  console.warn('Claude quota saturated; failing over to backup upstream');
  return await callFallbackAPI(prompt, opts); // DeepSeek / GLM / local — see alternatives guide
}</code></pre>

<h3>Concurrency ထိန်းချုပ်မှု</h3>
<ul>
  <li><strong>CI တွင် token bucket:</strong> organization တစ်ခုလျှင် parallel agent job (ဥပမာ အများဆုံး 3 ခု concurrent) ကန့်သတ်ပါ။</li>
  <li><strong>Request coalescing:</strong> ဖြစ်နိုင်သမျှ file အလိုက် API call တစ်ခုတည်းအစား lint fix ငယ် များကို batch လုပ်ပါ။</li>
  <li><strong>Circuit breaker:</strong> 429 ဆက်တိုက် N ခု နောက် 60 စက္ကန့် circuit ဖွင့်ပြီး အလိုအလျောက် fallback သို့ လွှဲပါ၊ retry storm ကို တားပါ။</li>
  <li><strong>Observability:</strong> မက်ထရစ် ထုတ်ပါ၊ <code>claude_requests_total{status}</code>၊ <code>fallback_invocations_total</code>၊ p95 latency။ fallback rate သည် 10 မိနစ် 15% ကျော်ပါက alert ပေးပါ။</li>
</ul>

<h3>403 နှင့် 429၊ တူညီစွာ မကိုင်တွယ်ပါနှင့်</h3>
<p>429 သည် ယာယီ ဖိအား ဖြစ်သည်၊ backoff ပြီး ဆက်လုပ်ပါ။ 403 သည် မကြာခဏ credential ပယ်ချခြင်း၊ ဒေသကန့်သတ်မှု သို့မဟုတ် အကောင့်အခြေအနေ ပြောင်းလဲမှုကို ညွှန်ပြသည်။ ရောဂါရှာခြင်းမရှိဘဲ အခြား key ဖြင့် 403 retry သည် enforcement ကို မြန်စေနိုင်သည်။ infrastructure rotate မလုပ်မီ error အမျိုးအစားခွဲရန် <a href="/guides/troubleshooting-guide/">troubleshooting guide</a> သုံးပါ။</p>

<h2>FAQ</h2>

<h3>စနစ် timezone မှန်ပြီးသားဆိုလျှင် <code>TZ</code> သတ်မှတ်ရမလား။</h3>
<p>OS timezone၊ proxy exit geo နှင့် browser profile တိမ်းညှိပြီးပါက explicit <code>TZ</code> သည် ပိုလိုအပ်ချက်မရှိနိုင်သော်လည်း CI container များသည် မကြာခဏ UTC default ဖြစ်သည်။ explicit export ဖြင့် laptop နှင့် server အလိုက် အပြုအမူ တိကျစေသည်။</p>

<h3>ကုမ္ပဏီ source code အတွက် public API reseller သည် "လုံခြုံ" ဖို့ ရပါသလား။</h3>
<p>တတိယပါတီ subprocessors အခြား တူညီစွာ သတ်မှတ်ပါ၊ log၊ retention နှင့် subprocessors စာရင်း စစ်ပါ။ proprietary code အတွက် VPC ပေါ် self-hosted relay သည် anonymous reseller ထက် သေချာ လုံခြုံသည်။</p>

<h3>gateway ပြောင်းလိုက်လျှင် cache ခြောက်သက်သောက်ချက် ဘာလို့ ပျောက်သွားသလဲ။</h3>
<p>အများဆုံး relay က <code>anthropic-beta</code> header များ ဖယ် သို့မဟုတ် system block များကို ပြန်စီပြီး cache key မမှန်စေသည်။ gateway ပြောင်းတိုင်း request နှစ်ခု cache test ပြန်လုပ်ပါ။</p>

<h3>browser နှင့် Claude Code အတွက် proxy မတူကွဲ သုံးလို့ရမလား။</h3>
<p>နည်းပညာအရ ရနိုင်သော်လည်း divergence အန္တရာယ် တိုးသည်။ သီးခြား profile တွင်စမ်းသပ် အကောင့် မခွဲသားပါက Claude traffic အားလုံး တူညီသော မှတ်တမ်းတင်ထားသော egress လမ်းကြောင်းကို ဦးစားပေးပါ။</p>

<h3>429 ဖြစ်သောအခါ Claude Code က ဘယ် fallback model သုံးသင့်သလဲ။</h3>
<p>Claude Code တွင် built-in multi-model failover မရှိ၊ gateway (One-API/LiteLLM) တွင် အကောင်အထည်ဖော် သို့မဟုတ် Claude Code ယာယီပိတ်ပြီး backup API ချိန်သော IDE plugin သုံးပါ။ routing table အတွက် <a href="/guides/domestic-and-open-source-alternatives/">domestic and open-source alternatives</a> ကြည့်ပါ။</p>

<h3>"curl တွင် အလုပ်လုပ်၊ Claude Code တွင် မအောင်မြင်" ကို ဘယ်လို debug လုပ်မလဲ။</h3>
<ol>
  <li>Header ကွာချက်၊ mitmproxy သို့မဟုတ် gateway access log ဖြင့် curl နှင့် CLI ကို မှတ်ယူပါ။</li>
  <li>စဖွင့်သော shell တွင် env အတည်ပြုပါ၊ IDE ထည့်သွင်းထားသော terminal များသည် login rc ဖိုင်ကို မကြာခဏ ကျော်သည်။</li>
  <li>Node/fetch proxy agent စစ်ပါ၊ version အချို့သည် <code>GLOBAL_AGENT_HTTP_PROXY</code> မသတ်မှတ်ပါက <code>HTTPS_PROXY</code> ကို လျစ်လျူရှုသည်။</li>
  <li>corporate network တွင် TLS interception စစ်ဆေးပါ။</li>
</ol>

<h3>first-party base URL ဟု ယူဆခြင်းသည် Anthropic billing ကို သက်ရောက်မလား။</h3>
<p>မသက်ရောက်ပါ။ billing သည် တကယ် request ဝန်ဆောင်သည့် upstream နှင့် ချိတ်ထားသော API key နှင့် organization ကို လိုက်သည်။ gateway သည် Anthropic သို့ forward လုပ်ပါက Anthropic ကို ပေးချေသည်၊ model ပြောင်းလျှင် gateway ခေါ်သည့် provider ကို ပေးချေသည်။</p>
`;
