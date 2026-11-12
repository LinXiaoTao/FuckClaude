export const content = `
<h2>1. اصول Prompt Cache و بیشینه‌سازی</h2>
<p>قابلیت Prompt Caching در Anthropic می‌تواند برای زمینه تکراری هزینه را تا 90٪ و تأخیر را تا 85٪ کاهش دهد. درک رفتار cache برای بهینه‌سازی API حیاتی است:</p>

<h3>قوانین رفتار cache</h3>
<ul>
  <li><strong>حداقل اندازه cache:</strong> بلوک‌های cache باید ≥ 1024 token باشند. بلوک‌های کوچک‌تر cache نمی‌شوند.</li>
  <li><strong>TTL کش:</strong> محتوای cache پس از 5 دقیقه عدم فعالیت منقضی می‌شود. استفاده مجدد از همان cache در 5 دقیقه TTL را تمدید می‌کند.</li>
  <li><strong>کلید cache:</strong> cache با تطابق دقیق محتوا کلید می‌شود. تغییر یک کاراکتر cache را باطل می‌کند.</li>
  <li><strong>جایگذاری cache:</strong> فقط پیام‌های نقش <code>system</code> و آخرین پیام <code>user</code> از cache پشتیبانی می‌کنند. پیام‌های میانی cache نمی‌شوند.</li>
</ul>

<h3>استراتژی بهینه cache</h3>
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

<h2>2. بهینه‌سازی صورتحساب token و مدیریت زمینه</h2>
<p>قیمت‌گذاری Claude API نامتقارن است؛ token ورودی ارزان‌تر از خروجی است، و tokenهای cache 90٪ کمتر از token ورودی هزینه دارند. مکالمه را طوری بچینید که cache بیشینه شود:</p>

<h3>مقایسه هزینه (Claude Sonnet 4.5 High)</h3>
<table>
  <thead>
    <tr>
      <th>نوع token</th>
      <th>هزینه به ازای 1M token</th>
      <th>هزینه نسبی</th>
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

<h3>مدیریت پنجره زمینه بلند</h3>
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

<h2>3. کنترل هم‌زمانی و مدیریت محدودیت نرخ</h2>
<p>Anthropic محدودیت نرخ در سطح سازمان اعمال می‌کند. کنترل هم‌زمانی سمت کلاینت پیاده کنید تا از خطای 429 جلوگیری شود:</p>

<h3>محدودکننده نرخ سطل توکن</h3>
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

<h2>4. خروجی stream و بهترین روش‌های تلاش مجدد</h2>
<p>پاسخ‌های stream زمان تا اولین token را کم می‌کنند و رندر تدریجی را ممکن می‌سازند. با backoff نمایی برای مدیریت خطای پایدار ترکیب کنید:</p>

<h3>Stream با منطق تلاش مجدد</h3>
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
