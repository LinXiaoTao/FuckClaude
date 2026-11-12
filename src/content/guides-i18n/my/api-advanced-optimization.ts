export const content = `
<h2>1. Prompt Cache စည်းကမ်းများနှင့် အများဆုံး အသုံးချမှု</h2>
<p>Anthropic ၏ Prompt Caching လုပ်ဆောင်ချက်သည် ထပ်ခါတလဲလဲ အကြောင်းအရာများအတွက် ကုန်ကျစရိတ် 90% လျှော့ချနိုင်ပြီး နှောင့်နှေးမှု 85% လျော့နိုင်သည်။ cache အပြုအမူကို နားလည်ခြင်းသည် API ပိုမိုကောင်းမွန်အောင် လုပ်ရာတွင် အရေးကြီးသည်:</p>

<h3>Cache အပြုအမူ စည်းမျဉ်းများ</h3>
<ul>
  <li><strong>အနည်းဆုံး cache အရွယ်အစား:</strong> cache block များသည် ≥ 1024 tokens ဖြစ်ရမည်။ သေးငယ်သော block များကို cache မလုပ်ပါ။</li>
  <li><strong>Cache TTL:</strong> cache အကြောင်းအရာသည် မလှုပ်ရှားမှု 5 မိနစ်ကြာပြီးနောက် သက်တမ်းကုန်သည်။ 5 မိနစ်အတွင်း တူညီ cache ကို ပြန်သုံးခြင်းဖြင့် TTL ကို ဆက်တိုးသည်။</li>
  <li><strong>Cache Key:</strong> cache ကို အကြောင်းအရာ တိကျကိုက်ညီမှုဖြင့် သော့ချပ်သည်။ စာလုံး တစ်လုံးပြောင်းလျှင် cache ပျက်သည်။</li>
  <li><strong>Cache ထားရာနေရာ:</strong> <code>system</code> role မက်ဆေ့ချ်များနှင့် နောက်ဆုံး <code>user</code> မက်ဆေ့ချ်သာ cache လုပ်နိုင်သည်။ အလယ်ပိုင်း မက်ဆေ့ချ်များကို cache မလုပ်နိုင်ပါ။</li>
</ul>

<h3>အကောင်းဆုံး Cache ဗျူဟာ</h3>
<pre><code>const systemPrompt = \`You are an expert software architect...
[Large 5000-token context that rarely changes]\`;

// Mark system prompt for caching
const response = await anthropic.messages.create({
  model: "claude-sonnet-4.5-high",
  max_tokens: 2048,
  system: [
    {
      type: "text",
      text: systemPrompt,
      cache_control: { type: "ephemeral" }, // Cache this block
    },
  ],
  messages: [
    { role: "user", content: "Refactor this function..." },
  ],
});</code></pre>

<h2>2. Token ငွေတင်ဆောင်မှုနှင့် Context စီမံခန့်ခွဲမှု ပိုမိုကောင်းမွန်အောင် လုပ်ခြင်း</h2>
<p>Claude API စျေးနှုန်းသည် မညီမျှပါ: input token များသည် output token များထက် စျေးချိုပြီး cached token များသည် input token ထက် 90% စျေးချိုသည်။ cache အများဆုံး အာမခံအတွက် စကားဝိုင်း ဖွဲ့စည်းပါ:</p>

<h3>ကုန်ကျစရိတ် နှိုင်းယှဉ်ချက် (Claude Sonnet 4.5 High)</h3>
<table>
  <thead>
    <tr>
      <th>Token အမျိုးအစား</th>
      <th>တစ် သနီလီယံ Token လျှင် ကုန်ကျစရိတ်</th>
      <th>ဆက်စပ်ကုန်ကျစရိတ်</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Output Tokens</td>
      <td>$15.00</td>
      <td>100x</td>
    </tr>
    <tr>
      <td>Input Tokens</td>
      <td>$3.00</td>
      <td>20x</td>
    </tr>
    <tr>
      <td>Cached Input Tokens</td>
      <td>$0.30</td>
      <td>2x</td>
    </tr>
    <tr>
      <td>Cache Write Tokens</td>
      <td>$3.75</td>
      <td>25x</td>
    </tr>
  </tbody>
</table>

<h3>ရှည်သော Context Window စီမံခန့်ခွဲမှု</h3>
<pre><code>// Sliding window approach for multi-turn conversations
function maintainContextWindow(history: Message[], maxTokens: number = 180000) {
  let totalTokens = estimateTokenCount(history);
  
  while (totalTokens > maxTokens && history.length > 2) {
    // Remove oldest non-system messages first
    history.splice(1, 2); // Remove one user-assistant pair
    totalTokens = estimateTokenCount(history);
  }
  
  return history;
}</code></pre>

<h2>3. တပြိုင်နက် တောင်းဆိုမှု ထိန်းချုပ်မှုနှင့် Rate Limit ကိုင်တွယ်မှု</h2>
<p>Anthropic သည် စီးပွားရေး အဆင့် rate limit များ စည်းချက်ထားသည်။ 429 အမှားများ ရှောင်ရန် client-side တပြိုင်နက် ထိန်းချုပ်မှု အကောင်အထည် ဖွင့်ပါ:</p>

<h3>Token Bucket Rate Limiter</h3>
<pre><code>class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private refillRate: number; // tokens per second
  private capacity: number;

  constructor(requestsPerMinute: number) {
    this.capacity = requestsPerMinute;
    this.tokens = requestsPerMinute;
    this.lastRefill = Date.now();
    this.refillRate = requestsPerMinute / 60;
  }

  async acquire(): Promise<void> {
    this.refill();
    
    while (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.refillRate * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.refill();
    }
    
    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}

const limiter = new RateLimiter(50); // 50 requests per minute

async function callClaude(prompt: string) {
  await limiter.acquire();
  return await anthropic.messages.create({...});
}</code></pre>

<h2>4. Streaming ရလဒ်နှင့် Retry အကောင်းဆုံး လေ့ကျင့်ချက်များ</h2>
<p>Streaming တောင်းဆိုမှုများသည် ပထမတစ်ကြိမ် token ရရှိချိန်ကို လျှော့ချပြီး တဖြည်းဖြည်း ပြသခြင်းကို ဖွင့်ပေးသည်။ ခိုင်မာသော အမှားကိုင်တွယ်မှုအတွက် exponential backoff နှင့် ပေါင်းပါ:</p>

<h3>Retry Logic ပါသော Streaming</h3>
<pre><code>async function* streamWithRetry(prompt: string, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const stream = await anthropic.messages.stream({
        model: "claude-sonnet-4.5-high",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta") {
          yield chunk.delta.text;
        }
      }
      
      return; // Success, exit retry loop
      
    } catch (error: any) {
      if (error.status === 529 && attempt < maxRetries - 1) {
        // Overloaded error, retry with backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}</code></pre>
`;
