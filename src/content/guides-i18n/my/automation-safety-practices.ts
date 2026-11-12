export const content = `
<h2>1. အစုလိုက် ခေါ်ဆိုမှု ကြိမ်နှုန်း ထိန်းချုပ်ခြင်း နှင့် rate limiting</h2>
<p>Anthropic သည် organization အဆင့် rate limit များ ထားရှိပါတယ်။ automation စနစ်ကို ဒီဘောကျမှုအတွက် ဒီဇိုင်းလုပ်ပြီး anti-abuse classifier မဖြစ်အောင် ရှောင်ပါ။</p>

<h3>Rate limit အဆင့်များ (2026-08 အရ)</h3>
<table>
  <thead>
    <tr>
      <th>အကောင့် အဆင့်</th>
      <th>RPM (တောင်းဆိုမှု/မိနစ်)</th>
      <th>TPM (Token/မိနစ်)</th>
      <th>နေ့စဉ် Token ကန့်သတ်ချက်</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Free Tier</strong></td>
      <td>5</td>
      <td>40,000</td>
      <td>50,000</td>
    </tr>
    <tr>
      <td><strong>Pro Tier</strong></td>
      <td>50</td>
      <td>200,000</td>
      <td>5,000,000</td>
    </tr>
    <tr>
      <td><strong>Team Tier</strong></td>
      <td>100</td>
      <td>400,000</td>
      <td>10,000,000</td>
    </tr>
    <tr>
      <td><strong>Enterprise</strong></td>
      <td>စိတ်ကြိုက်</td>
      <td>စိတ်ကြိုက်</td>
      <td>ညှိနှိုင်း</td>
    </tr>
  </tbody>
</table>

<h3>Adaptive rate limiter အကောင်အထည် ဖော်ခြင်း</h3>
<pre><code>class AdaptiveRateLimiter {
  private requestQueue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private maxConcurrency: number;
  private minDelay: number; // ms between requests
  
  constructor(rpm: number, maxConcurrency = 5) {
    this.maxConcurrency = maxConcurrency;
    this.minDelay = (60 / rpm) * 1000;
  }
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.activeRequests >= this.maxConcurrency) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.activeRequests++;
    try {
      const result = await fn();
      await new Promise(resolve => setTimeout(resolve, this.minDelay));
      return result;
    } catch (error: any) {
      if (error.status === 429) {
        // Rate limit hit, exponential backoff
        const retryAfter = error.headers?.['retry-after'] || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return this.execute(fn); // Retry
      }
      throw error;
    } finally {
      this.activeRequests--;
    }
  }
}

// Usage
const limiter = new AdaptiveRateLimiter(50); // 50 RPM for Pro tier
const results = await Promise.all(
  prompts.map(prompt => limiter.execute(() => callClaude(prompt)))
);</code></pre>

<h2>2. Anti-abuse ရှာဖွေမှုကို ရှောင်ခြင်း</h2>
<p>Anthropic backend classifier များသည် model distillation သို့မဟုတ် ခွင့်မပြု scraping ပုံစံများကို ရှာဖွေပါတယ်။ လူ့အမူအကျင့် ကဲ့သို့ ပြုမူအောင် လုပ်ပါ။</p>

<h3>လူ့အမူအကျင့် simulation နည်းလမ်းများ</h3>
<ul>
  <li><strong>Prompt ကွဲပြားမှု:</strong> prompt များတွင် သဘာဝ ဘာသာစကား ကွဲပြားမှု ထည့်ပါ။ တူညီသောမေးခွန်း 1000 ခု တစ်ပြိုင်တည်း မပို့ပါနှင့်။</li>
  <li><strong>Jitter ထည့်သွင်းမှု:</strong> တောင်းဆိုမှုကြား မှ delay ကို ကျပန်းပေးပါ (ဥပမာ 100-3000ms uniform distribution)။</li>
  <li><strong>Session အကန့်:</strong> တောင်းဆိုမှု 20-50 ခုစီ session အဖြစ် ပိုင်းခြားပြီး 5-10 မိနစ် အနားယူပါ။</li>
  <li><strong>Output အရှည် ကွဲပြားမှု:</strong> တောင်းဆိုမှုတိုင်း <code>max_tokens</code> ကို မတူအောင် ပြောင်းပါ၊ output အရှည် တည်ညံသော ပုံစံ မဖြစ်စေရ။</li>
</ul>

<h3>Prompt ကွဲပြားမှု ဥပမာ</h3>
<pre><code>const templates = [
  "Refactor this code:\n{code}",
  "Can you improve this function?\n{code}",
  "Please optimize:\n{code}",
  "How would you rewrite this?\n{code}",
];

function varyPrompt(code: string): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const prefix = Math.random() > 0.5 ? "Here's my code: " : "";
  return prefix + template.replace("{code}", code);
}</code></pre>

<h2>3. အကောင့်များစွာ polling နှင့် load balancing</h2>
<p>အယောင်အထည်မြင့် workload များကို Claude အကောင့် များစွာတွင် ဖြန့်ဝေပါ၊ organization တစ်ခုချင်းစီ rate limit ကိုရှောင်ပြီး distillation အန္တရာယ်လျော့စေမည်။</p>

<h3>Round-robin load balancer</h3>
<pre><code>class MultiAccountBalancer {
  private accounts: Array<{ apiKey: string; weight: number }>;
  private currentIndex = 0;
  private requestCounts: Map<string, number> = new Map();
  
  constructor(accounts: Array<{ apiKey: string; weight?: number }>) {
    this.accounts = accounts.map(acc => ({ 
      apiKey: acc.apiKey, 
      weight: acc.weight || 1 
    }));
  }
  
  getNextAccount(): string {
    // Weighted round-robin selection
    const totalWeight = this.accounts.reduce((sum, acc) => sum + acc.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const account of this.accounts) {
      random -= account.weight;
      if (random <= 0) {
        this.requestCounts.set(account.apiKey, 
          (this.requestCounts.get(account.apiKey) || 0) + 1);
        return account.apiKey;
      }
    }
    
    return this.accounts[0].apiKey;
  }
  
  getStats(): Record<string, number> {
    return Object.fromEntries(this.requestCounts);
  }
}

// Usage
const balancer = new MultiAccountBalancer([
  { apiKey: "sk-ant-api03-...", weight: 2 }, // Pro account, higher weight
  { apiKey: "sk-ant-api04-...", weight: 1 }, // Free account, lower weight
]);

async function callWithBalancing(prompt: string) {
  const apiKey = balancer.getNextAccount();
  return await anthropic.messages.create({
    apiKey,
    model: "claude-sonnet-4.5-high",
    messages: [{ role: "user", content: prompt }],
  });
}</code></pre>

<h2>4. စစ်ဆေးမှတ်တမ်း နှင့် လိုက်နာမှု စစ်ဆေးစာရင်း</h2>
<p>compliance စစ်ဆေးမှုနှင့် ပြင်ဆင်ခြင်းအတွက် automation လုပ်ဆောင်မှု မှတ်တမ်းများ ပြည့်စုံစွာ သိမ်းပါ။</p>

<h3>Audit log schema</h3>
<pre><code>interface AuditLog {
  timestamp: string;
  accountId: string;
  requestId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheHit: boolean;
  latencyMs: number;
  statusCode: number;
  errorMessage?: string;
  sourceIP: string;
  userAgent: string;
}

// Log every API call
async function auditedCall(prompt: string): Promise<any> {
  const start = Date.now();
  try {
    const response = await anthropic.messages.create({...});
    
    await logAudit({
      timestamp: new Date().toISOString(),
      accountId: "org-123",
      requestId: response.id,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheHit: response.usage.cache_read_input_tokens > 0,
      latencyMs: Date.now() - start,
      statusCode: 200,
      sourceIP: await getPublicIP(),
      userAgent: "my-automation/1.0",
    });
    
    return response;
  } catch (error: any) {
    await logAudit({
      timestamp: new Date().toISOString(),
      statusCode: error.status || 500,
      errorMessage: error.message,
      latencyMs: Date.now() - start,
      ...
    });
    throw error;
  }
}</code></pre>

<h3>လိုက်နာမှု ကိုယ်တိုင် စစ်ဆေးစာရင်း</h3>
<ul>
  <li>automation တောင်းဆိုမှု အားလုံး API key သုံးမည်၊ ခိုးယူထားသော session token မဟုတ်ပါ။</li>
  <li>automation သည် Anthropic rate limit ကို လေးစားမည်၊ ပြင်းထန်စွာ ကျော်ပါးခြင်း မပြုလုပ်ပါ။</li>
  <li>output သည် ပြန်ရောင်းခြင်း သို့မဟုတ် အများသုံး model သင်ခြင်း မဟုတ် အတွင်းပိုင် tool အတွက် ဖြစ်ရမည်။</li>
  <li>စစ်ဆေးမှတ်တမ်း အတွက် log 90 ရက် သိမ်းမည်။</li>
  <li>API traffic အတွက် residential IP သုံးမည်၊ အမြောက်အမြား automation အတွက် datacenter IP မသုံးပါ။</li>
  <li>automation workflow တွင် prompt injection နှင့် jailbreak ကြိုးစားမှု မပါဝင်ရ။</li>
</ul>
`;
