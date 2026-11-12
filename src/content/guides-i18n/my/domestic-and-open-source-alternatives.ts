export const content = `
<p>Claude တိုက်ရိုက် ဝင်ရောက်မှု၊ API quota သို့မဟုတ် ဒေသအလိုက် routing မတည်ငြိမ်လျှင် failover stack ကောင်းစွာ ဒီဇိုင်းထားပါက development pipeline ဆက်လက်လည်ပတ်နိုင်သည်။ ဒေသတွင်း frontier မော်ဒယ်များနှင့် local open-source stack များသည် မူဝါဒ ချိုးဖောက်မှုအတွက် လည်ပတ်နည်းမဟုတ်ပါ၊ တိကျသော latency၊ ယူနစ် ကုန်ကျစရိတ် လျော့နည်းမှု၊ offline fallback လိုအပ်သော အဖွဲ့များအတွက် တရားဝင် continuity ကိရိယာများ ဖြစ်သည်။ ဤလမ်းညွှန်သည် လက်တွေ့ရှိ အရာများကို နှိုင်းယှဉ်ပေး၊ Ollama နှင့် One-API တပ်ဆင်နည်းကို လုပ်ဆောင်ပြီး workload များကို တစ်ခါလုံးပြန်မရေးဘဲ route လုပ်ပုံကို ပြပါသည်။</p>

<p>အရန် မော်ဒယ် မတည်မီ အခြေခံ ပတ်ဝန်းကျင်ကို ညှိပါ။ Claude က သင်၏ အဓိက upstream ဖြစ်နေပါက <a href="/guides/environment-cleanup-and-ip-setup/">environment cleanup နှင့် IP setup</a> နှင့် <a href="/guides/vpn-and-proxy-selection/">VPN နှင့် proxy ရွေးချယ်မှု</a> လမ်းညွှန်များကို ကြည့်ပါ။ Claude ကုန်ကျစရိတ်ထိန်းချုပ်မှုအတွက် <a href="/guides/api-advanced-optimization/">API advanced optimization</a> ကို ဤလမ်းညွှန်နှင့် တွဲဖက်ပါ။</p>

<h2>1. ဒေသတွင်း ထိပ်တန်း မော်ဒယ် နှိုင်းယှဉ်ချက်</h2>
<p>တရုတ်နှင့် ဒေသတွင်း frontier မော်ဒယ်များသည် နေ့စဉ် engineering လုပ်ငန်းများ အများစုကို ဖုံးလွှမ်းပြီးဖြစ်သည်၊ code completion၊ refactor၊ test ထုတ်ခြင်း၊ log စိစစ်ခြင်း၊ စာတမ်းရှည် Q&amp;A စသည်။ ကွာခြားချက်များမှာ context length၊ tool-calling တိကျမှု၊ reasoning အနက်၊ ဈေးနှုန်းတို့တွင် ဖြစ်ပြီး Claude ကို လုံးဝ အစားထိုးနိုင်မှု မဟုတ်ပါ။</p>

<h3>စွမ်းရည် နှိုင်းယှဉ်မက်ထရစ်</h3>
<table>
  <thead>
    <tr>
      <th>မော်ဒယ်</th>
      <th>အကောင်းဆုံး သုံးစွဲမှု</th>
      <th>Context Window</th>
      <th>Tool / JSON</th>
      <th>ပုံမှန် Latency (CN)</th>
      <th>ကုန်ကျစရိတ် ပရိုဖိုင်</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>DeepSeek R1 / V3</td>
      <td>ရှုပ်ထွေးသော reasoning၊ algorithm ဒီဇိုင်း၊ ဖိုင် အများအပြား refactor များ</td>
      <td>64K–128K (API ပေါ်မူတည်)</td>
      <td>V3 တွင် function calling အားကောင်း</td>
      <td>နိမ့် (ဒေသတွင်း CDN)</td>
      <td>token တစ်ခုလျှင် အလွန် နိမ့်</td>
    </tr>
    <tr>
      <td>Kimi / Kimi Code</td>
      <td>repo အရွယ်အစား ဖတ်ခြင်း၊ spec review၊ နှစ်ဘာသာ စာရွက်များ</td>
      <td>2M token ထိ (Code ထုတ်ကုန်)</td>
      <td>ကောင်း၊ long-context ingest အတွက် အကောင်းဆုံး</td>
      <td>နိမ့်–အလယ်အလတ်</td>
      <td>အလယ်အပတ် tier၊ long-context tier ကွဲပြား</td>
    </tr>
    <tr>
      <td>GLM-4 (Zhipu AI)</td>
      <td>Enterprise API၊ structured output၊ batch လုပ်ငန်း</td>
      <td>ပုံမှန် 128K</td>
      <td>JSON mode &amp; tools ကြီးထွားပြီး</td>
      <td>နိမ့်</td>
      <td>Enterprise ဈေးနှုန်း တိကျ</td>
    </tr>
    <tr>
      <td>Local Qwen2.5-Coder (Ollama)</td>
      <td>Air-gapped dev၊ privacy လိုအပ်သော snippet၊ offline CI</td>
      <td>32K–128K (hardware အတိုင်း)</td>
      <td>LiteLLM / One-API mapping ဖြင့်</td>
      <td>GPU ပေါ်မူတည်</td>
      <td>hardware နှင့် လျှပ်စစ် သက်သက်သာ</td>
    </tr>
  </tbody>
</table>

<h3>Workload အလိုက် မော်ဒယ် ရွေးချယ်မှု</h3>
<ul>
  <li><strong>DeepSeek R1 / V3၊</strong> chain-of-thought စတိုင်ဖြင့် debug လိုသည့်အခါ သို့မဟုတ် competitive-programming အဆင့်ရယ logic လိုပါက R1 သုံးပါ။ production API ခေါ်ဆိုမှုအတွက် V3 သည် ပုံမှန်ရွေးချယ်မှု၊ မြန်ပြီး ပိုသန်း၊ codegen အတွက် တည်ငြိမ်။ peak အချိန်တွင် rate limit သတိထားပါ၊ အရေးမကြီး batch ကို peak မဟုတ်သော အချိန်တွင် ရေတွင်းပါ။</li>
  <li><strong>Kimi / Kimi Code၊</strong> prompt တစ်ခုတွင် monorepo README tree၊ OpenAPI spec၊ RFC သုံးဖိုင် တစ်ပြိုင်တည်း ထည့်သွင်းရမည့်အခါ အသင့်တော်ဆုံး။ Kimi Code သည် IDE လုပ်ငန်းစဉ်အတွက် ပြုပြင်ထားသည်။ ပျက်ကွက်မှု နမူနာ၊ context အလွန်ရှည်ပါက အာရုံကြွ scatter ဖြစ်နိုင်၊ စဉ်း section များကို စာရင်းပြသပြီး မော်ဒယ်အား ဘက်လိုက်စေပါ။</li>
  <li><strong>GLM-4 / Zhipu AI၊</strong> လိုက်နာမှု အတွက် invoice၊ SLA၊ VPN မလိုဘဲ mainland မှ ဆက်သွယ်နိုင်သော endpoint လိုပါက အကြံပြုသည်။ function calling နှင့် JSON schema mode များကို production သုံးနိုင်သည်။ R1 သို့မဟုတ် Claude Opus ထက် ပွင့်လန်းသော architecture ဆွေးနွေးမှုများအတွက် နည်းပါး သင့်တော်။</li>
  <li><strong>Local open-source (Qwen၊ DeepSeek distilled၊ Llama variants)၊</strong> လျှို့ဝှက်ချက်နှင့် ဆက်စပ် code၊ စည်းမျဉ်း ပြင်းထန်သည့် ပတ်ဝန်းကျင်၊ သို့မဟုတ် outbound API ခေါ်ဆိုမှု လုံးဝ ပိတ်ထားသည့်အခါ အကောင်းဆုံး။ cloud frontier မော်ဒယ်နှင့် အရည်အသွေး ကွာဟချက် ပါးသောအခါမှာ အကျယ်အဝန်း ကန့်သတ်ထားသော လုပ်ငန်းများ၊ lint ပြင်ဆင်မှု၊ boilerplate၊ unit test stub စသည်။</li>
</ul>

<h3>မပြောင်းသင့်သော အခြေအနေများ</h3>
<p>Claude (သို့မဟုတ် အဓိက upstream) ကို ထိန်းသိမ်းပါ၊ အထူး safety tuning၊ ရှည်လျားသော agent loop၊ Anthropic မော်ဒယ်များနှင့်သာ စမ်းသပ်ထားသော toolchain စီမံချက်များအပေါ် မူတည်သော အရေးကြီးသော လုပ်ငန်းများအတွက်။ အရန်များ <em>continuity</em> တွင် ထူးချွန်ပြီး Claude အထူးပြုမူကို အထက်မှ အပြည့်အဝ မကူးယူနိုင်ပါ။ အကောင့် ဝင်ရောက်မှု မတည်ငြိမ်ပါက ဒေသတွင်း မော်ဒယ်ဖြင့် အခြေခံ အရည်အချင်း ပြဿနာ ပြေမည့်ဟု မသတ်မှတ်မီ <a href="/guides/account-registration-and-payment-antiban/">account registration နှင့် payment antiban</a> ကို ဖတ်ပါ။</p>

<h2>2. Private Ollama နှင့် One-API Claude ကိုက်ညီမှု တပ်ဆင်ခြင်း</h2>
<p>Anthropic Messages API ပြောဆိုနိုင်သော local သို့မဟုတ် private gateway သည် upstream ပြောင်းလဲလျှင်လည်း CLI၊ IDE plugin၊ script များအနေဖြင့် လက်ရှိပုံစံ ထိန်းချက်နိုင်စေသည်။ အသုံးများသော အလွှာများ၊ <strong>Ollama</strong> (မော်ဒယ် runtime) နှင့် <strong>One-API</strong> သို့မဟုတ် <strong>LiteLLM</strong> (protocol ဘာသာပြန်နှင့် key စီမံခန့်ခွဲမှု)။</p>

<h3>လိုအပ်ချက် စစ်ဆေးစာရင်း</h3>
<ul>
  <li>7B–14B မော်ဒယ်များအတွက် RAM 16 GB+၊ 32B+ ကို အသုံးပြုနိုင်သော အမြန်နှုန်းအတွက် RAM 32 GB+ နှင့် discrete GPU။</li>
  <li>Docker (One-API အတွက်) သို့မဟုတ် Python 3.10+ (LiteLLM အတွက်)။</li>
  <li>ပတ်ဝန်းကျင် တစ်ခုလျှင် API key သီးသန့် (dev/staging/prod)၊ production Claude key များကို shared gateway တွင် ပြန်မသုံးပါနှင့်။</li>
  <li>Network egress မူဝါဒ မှတ်တမ်းတင်၊ local-only နှင့် VPC-internal နှင့် team VPN။</li>
</ul>

<h3>Ollama Local Claude Route တပ်ဆင်ခြင်း</h3>
<pre><code># 1. Install Ollama (macOS/Linux)
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull a coding-oriented model (pick one tier)
ollama pull qwen2.5-coder:14b
ollama pull deepseek-r1:14b

# 3. Verify the OpenAI-compatible local endpoint
curl http://127.0.0.1:11434/v1/models

# 4. Deploy One-API (Anthropic/OpenAI aggregation)
docker run -d --name one-api \\
  -p 3000:3000 \\
  -v "$(pwd)/one-api-data:/data" \\
  justsong/one-api

# 5. In One-API admin UI (http://localhost:3000):
#    - Add channel: Ollama base URL http://host.docker.internal:11434
#    - Map model name to a Claude-compatible alias, e.g. claude-sonnet-fallback
#    - Create a separate API token for your team

# 6. Point tools at the gateway—not at Anthropic directly
export ANTHROPIC_BASE_URL="http://127.0.0.1:3000"
export ANTHROPIC_API_KEY="sk-one-api-token-from-admin"</code></pre>

<h3>LiteLLM အရန် (ရည်မှန်းချက် တူညီသော stack ကွဲပြား)</h3>
<pre><code># pip install 'litellm[proxy]'
# config.yaml excerpt:
model_list:
  - model_name: claude-fallback
    litellm_params:
      model: ollama/qwen2.5-coder:14b
      api_base: http://127.0.0.1:11434

litellm --config config.yaml --port 4000</code></pre>

<h3>တပ်ဆင်ပြီး စစ်ဆေးမှု</h3>
<ol>
  <li>အနည်းဆုံး Messages API တောင်းဆိုမှု (<code>max_tokens: 64</code>) ပို့ပြီး HTTP 200 ဖြစ်ကြောင်း အတည်ပြုပါ။</li>
  <li>response schema အကွက် (<code>content</code>၊ <code>usage</code>) ကို Anthropic docs နှင့် နှိုင်းယှဉ်ပါ၊ gateway အချို့မှ <code>cache_creation_input_tokens</code> မပါဝင်နိုင်သည်၊ non-Claude backend များတွင် မျှော်မှန်းပါ။</li>
  <li><code>ANTHROPIC_BASE_URL</code> သတ်မှတ်ထားစဉ် IDE plugin သို့မဟုတ် Claude Code မှ တကယ့် လုပ်ငန်းတစ်ခု လုပ်ပြီး latency နှင့် error ပုံစံ log ရယူပါ။</li>
  <li>Rollback မှတ်တမ်းထားပါ၊ env var များ ဖြုတ်ပါက ၃၀ စက္ကန့်အောက်တွင် တိုက်ရိုက် Anthropic routing ပြန်ရမည်။</li>
</ol>

<h3>အဖြစ်များသော ပျက်ကွက်မှု ပုံစံများ</h3>
<ul>
  <li><strong>Docker မှ host ပေါ် Ollama မရောက်မြောက်နိုင်၊</strong> <code>host.docker.internal</code> (macOS/Windows) သို့မဟုတ် <code>--network host</code> (Linux) သုံးပါ။</li>
  <li><strong>မော်ဒယ် tool call ကို တွန်းကြပ်ဟု ထုတ်သည်၊</strong> client တွင် native tool use ပိတ်ပါ သို့မဟုတ် function-calling စိစစ်ထားသော backend (One-API တွင် GLM-4 / DeepSeek V3 API channel) သို့ map လုပ်ပါ။</li>
  <li><strong>Context overflow၊</strong> local 14B မော်ဒယ်များသည် effective token ~32K ကျော်မှု ကျဆင်းမည်၊ repo context ဖြတ်ပါ သို့မဟုတ် Kimi သို့ လည်ပတ်စေပါ။</li>
  <li><strong>Gateway cache ရှေး၍ကျန်၊</strong> မော်ဒယ် ပြောင်းပြီးအခါ proxy process ပြန်လည်စတင်ပြီး alias table ပြန်လည်သက်ဝင်စေပါ။</li>
</ul>

<p>Custom endpoint များသည် client fingerprinting နှင့် ဆက်သွယ်ပါသည်။ Claude Code ကို default မဟုတ်သော base URL တွင် သုံးပါက <a href="/guides/claude-steganography-and-risk-model/">Claude steganography and risk model</a> နှင့် <a href="/guides/claude-code-and-api-safety/">Claude Code and API safety</a> ကို ပတ်ဝန်းကျင် သန့်ရှင်းမှုအတွက် ပြန်လည်ကြည့်ပါ၊ ရှောင်ရှားမှု မဟုတ်၊ သတိမသိသော signal leak မဖြစ်စေရန် configuration တူညီမှု။</p>

<h2>3. Hybrid မော်ဒယ် routing ဗျူဟာ</h2>
<p>Hybrid routing သည် တောင်းဆိုမှု အမျိုးအစားတိုင်း အသင့်တော်ဆုံး အမြန်နှုန်းနှင့် သင့်တော်သော မော်ဒယ်သို့ ခွဲဝေသည်။ ရည်မှန်းချက်မှာ bulk လုပ်ငန်းများတွင် ကုန်ကျစရိတ် ၉၀%+ လျော့ချပြီး Claude ကို သတ်မှတ်နိုင်စွမ်းဖြင့် ထွန်းကြားသော လုပ်ငန်းများတွင် သီးသန့်ထားခြင်း။</p>

<h3>အကြံပြု routing စည်းမျဉ်းများ</h3>
<table>
  <thead>
    <tr>
      <th>လုပ်ငန်း အမျိုးအစား</th>
      <th>အဓိက</th>
      <th>Fallback</th>
      <th>Fallback သို့ ကူးပြောင်းရသည့် အချက်</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Architecture / security review</td>
      <td>Claude Sonnet/Opus</td>
      <td>DeepSeek R1</td>
      <td>429၊ 403 သို့မဟုတ် SLA &gt; 30s</td>
    </tr>
    <tr>
      <td>Unit test ထုတ်ခြင်း</td>
      <td>DeepSeek V3</td>
      <td>Local Qwen Coder</td>
      <td>API outage</td>
    </tr>
    <tr>
      <td>repo တစ်ခုလုံး စာတမ်း Q&amp;A</td>
      <td>Kimi Code</td>
      <td>GLM-4 long context</td>
      <td>Context limit error</td>
    </tr>
    <tr>
      <td>PII / လျှို့ဝှက်ချက်နှင့် ဆက်စပ် တည်းဖြတ်မှု</td>
      <td>Local Ollama</td>
      <td>—</td>
      <td>အမြဲ local</td>
    </tr>
    <tr>
      <td>CI lint ပျက်မှု autofix</td>
      <td>DeepSeek V3</td>
      <td>Local Qwen</td>
      <td>ကုန်ကျစရိက် cap ရောက်မှု</td>
    </tr>
  </tbody>
</table>

<h3>အကောင်အထည် ဖော်ပြချက် sketch</h3>
<pre><code>// Router pseudocode — keep Anthropic SDK shape
const ROUTES = [
  { match: /security|threat|architecture/i, upstream: 'claude' },
  { match: /generate tests|fix lint/i, upstream: 'deepseek-v3' },
  { match: /summarize repo|read spec/i, upstream: 'kimi' },
];

async function route(prompt: string) {
  const tier = ROUTES.find(r => r.match.test(prompt))?.upstream ?? 'deepseek-v3';
  try {
    return await callUpstream(tier, prompt);
  } catch (e) {
    if (isRetryable(e)) return await callUpstream('local-ollama', prompt);
    throw e;
  }
}</code></pre>

<h3>လုပ်ငန်းဆောင်ရွက် လုပ်ထုံးများ</h3>
<ul>
  <li><strong>Budget cap၊</strong> cloud API တိုင်းတွင် နေ့စဉ် ကုန်ကျစရိက် သတိပေးချက် သတ်မှတ်ပြီး overflow သည် local Ollama သို့ အလိုအလျောက် သွားစေပါ။</li>
  <li><strong>Prompt template၊</strong> လုပ်ငန်းအမျိုးအစားတိုင်း canonical system prompt တစ်ခု ထိန်းသိမ်းပါ၊ ဒေသတွင်း မော်ဒယ်များသည် output format ကို Claude ထက် ထင်ရှားစွာ ညွှန်ကြားချက် လိုအပ်တက်သည်။</li>
  <li><strong>Evaluation loop၊</strong> အပတ်စဉ် golden prompt ၂၀ ကို Claude နှင့် fallback များဖြင့် လိုက်ပါ၊ test အောင်မြင်နှုန်း နှင့် လူသား review အမှတ် ကြည့်ပါ၊ fallback အရည်အသွေး သတ်မှတ်ထားသော အဆင့်ကျော်လျှင် routing စည်းမျဉ်းများ အစားထိုးပါ။</li>
  <li><strong>Incident playbook၊</strong> <code>ANTHROPIC_BASE_URL</code> ပြောင်းခွင့် ရှိသူနှင့် sensitive workload ကို third-party API သို့ လမ်းကြောင်း ခွင့်ပြုမည့် သူ သို့မဟုတ် local သာ ခွဲခြားထားမှု မှတ်တမ်းထားပါ။</li>
</ul>

<p>failover ကိုယ်တိုင် ပျက်ကွက်ပါက gateway timeout၊ tool JSON မရှင်းလင်း၊ 403 ရှင်းလင်းမှုမရှိသော တုံ့ပြန်မှု စသည်၊ မော်ဒယ် မဆိုင့်မယိမ်းပြောင်းမီ <a href="/guides/troubleshooting-guide/">troubleshooting guide</a> ဆုံးဖြတ်ပင် အသုံးပြုပါ။</p>

<h2>FAQ</h2>

<h3>One-API က Claude Code အတွက် Claude ကို လုံးဝ အစားထိုးနိုင်မလား။</h3>
<p>CLI ဆက်လက်လည်ပတ်စေနိုင်သော်လည်း tool fidelity နှင့် safety နောက်ခံကွဲပြားမည်။ One-API ကို coding အကူအညီအတွက် degradation လမ်းကြောင်းအဖြစ် ကြည့်ပါ၊ Claude byte-for-byte အစားထိုး မဟုတ်ပါ။ အရေးကြီး edit များကို test နှင့် review ဖြင့် စစ်ဆေးပါ။</p>

<h3>Python backend လုပ်ငန်းအတွက် Claude နီးစပ်ဆုံး ဒေသတွင်း မော်ဒယ်ဘယ်။</h3>
<p>DeepSeek V3 သည် backend codegen နှင့် API ဒီဇိုင်း၏ ပုံမှန်ရွေးချယ်မှု။ input အရွယ်ကုန်ကျစရိက် ထိန်းချုပ်ပါက Kimi အနိုင်ရသည်။ enterprise billing တည်ငြိမ်မှုနှင့် JSON schema output လိုပါက GLM-4 အသင့်တော်သည်။</p>

<h3>Local Ollama သည် proprietary code အတွက် လုံလုံခြုံခြုံ လား။</h3>
<p>ဒေတာသည် သင့်စက်တွင် ရှိသော်လည်း မော်ဒယ် weight များက plaintext ကို လုပ်ဆောင်သည်။ စည်းမျဉ်း ပြင်းထန်သော ဒေတာအတွက် air-gapped host၊ disk encryption၊ access control သုံးပါ။ local inference သည် third-party ထိန်းသိမ်းမှု အန္တရာယ် ဖယ်ရှားပြီး insider သို့မဟုတ် malware အန္တရာယ် မဖယ်ရှားပါ။</p>

<h3>အရန် မော်ဒယ် routing ဖြင့် Claude အကောင့် ban အန္တရာယ် လျော့နိုင်မလား။</h3>
<p>အရန်များသည် Claude uptime ပေါ် <em>မှီခိုမှု</em> လျော့စေသည်၊ Claude အကောင့် မူဝါဒ အကောင်အထည်ဖော်မှု မှ ကာကွယ်မပေးပါ။ အကောင့်၊ ငွေပေးချေမှု၊ ပတ်ဝန်းကျင် လိုက်နာမှုကို ထိန်းသိမ်းပါ၊ <a href="/guides/account-registration-and-payment-antiban/">registration and payment antiban</a> ကို ကြည့်ပါ။</p>

<h3>ကုန်ကျစရိက် လျော့ချမှု ခန့်မှန်းနည်း။</h3>
<p>Claude တွင် လုပ်ငန်းအမျိုးအစားတိုင်း နေ့စဉ် token နှစ်ပတ်တိုင်း တိုင်းတဲ့ပြီး တူညီသော golden set ကို DeepSeek/Kimi တွင် ပြန်လည် run ပါ။ ချွေတာမှုသည် လုပ်ငန်းစုံနှင့် နှိုင်းယှဉ်သည့် မော်ဒယ်ပေါ် မူတည်သည်၊ headline ကိန်း မမှီဘဲ မိမိ workload တွင် တိုင်းပါ။ architecture review များသည် လူသား review အချိန် အဓိကဖြစ်သောကြောင့် Claude တွင်ထားလေ့ရှိသည်။</p>

<h3>လက်ခံမျှော် local မြန်နှုန်းအတွက် hardware ဘယ်လို လိုမလဲ။</h3>
<p>Apple Silicon M2 Pro RAM 32 GB သည် 14B မော်ဒယ်များကို အပြန်အကြား run လုပ်နိုင်သည်။ NVIDIA RTX 4090 သို့မဟုတ် A5000 အဆင့် GPU များသည် small-team shared gateway အတွက် 32B quantization ကိုင်တွယ်နိုင်သည်။ CPU-only inference သည် တစ်ဖိုင် တည်းသာ edit အတွက် သင့်တော်၊ ကြီးမားသော agent loop အတွက် မသင့်တော်။</p>
`;
