export const content = `
<h2>1. کنترل فرکانس فراخوانی دسته‌ای و محدودیت نرخ</h2>
<p>Anthropic محدودیت‌های نرخ در سطح سازمان اعمال می‌کند. سیستم‌های خودکارسازی را طوری طراحی کنید که این محدودیت‌ها رعایت شود و طبقه‌بندی‌کننده‌های ضدسوءاستفاده تحریک نشوند:</p>

<h3>سطوح محدودیت نرخ (تا 2026-08)</h3>
<table>
  <thead>
    <tr>
      <th>سطح حساب</th>
      <th>RPM (درخواست/دقیقه)</th>
      <th>TPM (توکن/دقیقه)</th>
      <th>سقف توکن روزانه</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>لایهٔ رایگان</strong></td>
      <td>5</td>
      <td>40,000</td>
      <td>50,000</td>
    </tr>
    <tr>
      <td><strong>لایهٔ Pro</strong></td>
      <td>50</td>
      <td>200,000</td>
      <td>5,000,000</td>
    </tr>
    <tr>
      <td><strong>لایهٔ Team</strong></td>
      <td>100</td>
      <td>400,000</td>
      <td>10,000,000</td>
    </tr>
    <tr>
      <td><strong>Enterprise</strong></td>
      <td>سفارشی</td>
      <td>سفارشی</td>
      <td>توافقی</td>
    </tr>
  </tbody>
</table>

<h3>پیاده‌سازی محدودکنندهٔ نرخ تطبیقی</h3>
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

<h2>2. پرهیز از تشخیص ضدسوءاستفاده</h2>
<p>طبقه‌بندی‌کننده‌های پشتی Anthropic الگوهایی را که نشان‌دهندهٔ تقطیر مدل یا scraping غیرمجاز هستند تشخیص می‌دهند. رفتار شبیه انسان تقلید کنید تا پرچم‌گذاری نشود:</p>

<h3>فنون شبیه‌سازی رفتار انسانی</h3>
<ul>
  <li><strong>تنوع prompt:</strong> تنوع زبان طبیعی به promptها اضافه کنید. از ارسال 1000 درخواست تقریباً یکسان پرهیز کنید.</li>
  <li><strong>تزریق jitter:</strong> تأخیر بین درخواست‌ها را تصادفی کنید (مثلاً توزیع یکنواخت 100-3000ms).</li>
  <li><strong>مرزهای نشست:</strong> کار را در نشست‌های 20-50 درخواستی دسته‌بندی کنید و بین آن‌ها 5-10 دقیقه وقفه بگذارید.</li>
  <li><strong>تنوع طول خروجی:</strong> <code>max_tokens</code> را بین درخواست‌ها متنوع کنید تا الگوی خروجی با طول ثابت پیش نیاید.</li>
</ul>

<h3>نمونهٔ تنوع prompt</h3>
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

<h2>3. polling چندحسابی و توازن بار</h2>
<p>بارهای حجیم را بین چند حساب Claude پخش کنید تا از محدودیت نرخ هر سازمان عبور نکنید و ریسک تقطیر کم شود:</p>

<h3>توازن‌گر بار round-robin</h3>
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

<h2>4. لاگ ممیزی و چک‌لیست انطباق</h2>
<p>لاگ جامع فعالیت خودکارسازی را برای ممیزی انطباق و دیباگ نگه دارید:</p>

<h3>طرح لاگ ممیزی</h3>
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

<h3>چک‌لیست خودممیزی انطباق</h3>
<ul>
  <li>همهٔ درخواست‌های خودکار از API key استفاده می‌کنند، نه توکن نشست سرقت‌شده</li>
  <li>خودکارسازی محدودیت‌های نرخ Anthropic را رعایت می‌کند (بدون تلاش تهاجمی برای دور زدن)</li>
  <li>خروجی برای ابزار داخلی استفاده می‌شود، نه فروش مجدد یا آموزش عمومی مدل</li>
  <li>لاگ‌ها 90 روز برای مسیر ممیزی نگه داشته می‌شوند</li>
  <li>برای ترافیک API از IP مسکونی استفاده می‌شود (بدون IP دیتاسنتر برای خودکارسازی پرحجم)</li>
  <li>در جریان‌های خودکار حملهٔ prompt injection یا تلاش jailbreak نیست</li>
</ul>
`;
