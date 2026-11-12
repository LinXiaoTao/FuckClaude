export const content = `
<h2>1. مبادئ Prompt Cache وتعظيم الاستفادة</h2>
<p>ميزة Prompt Caching من Anthropic يمكن أن تخفض التكلفة 90% وزمن الاستجابة 85% للسياق المتكرر. فهم سلوك التخزين المؤقت أمر حاسم لتحسين API:</p>

<h3>قواعد سلوك التخزين المؤقت</h3>
<ul>
  <li><strong>الحد الأدنى لحجم التخزين المؤقت:</strong> يجب أن تكون الكتل المخزنة ≥ 1024 tokens. الكتل الأصغر لا تُخزَّن.</li>
  <li><strong>TTL للتخزين المؤقت:</strong> ينتهي المحتوى المخزن بعد 5 دقائق من عدم النشاط. إعادة استخدام نفس التخزين خلال 5 دقائق يمدد TTL.</li>
  <li><strong>مفتاح التخزين المؤقت:</strong> يُفهرس التخزين بتطابق المحتوى حرفاً بحرف. تغيير حرف واحد يبطل التخزين.</li>
  <li><strong>موضع التخزين:</strong> فقط رسائل دور <code>system</code> وآخر رسالة <code>user</code> تدعم التخزين المؤقت. الرسائل الوسطى لا يمكن تخزينها.</li>
</ul>

<h3>استراتيجية التخزين المؤقت المثلى</h3>
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

<h2>2. تحسين فوترة الـ tokens وإدارة السياق</h2>
<p>تسعير Claude API غير متماثل: tokens الإدخال أرخص من الإخراج، وtokens المخزنة أرخص بنسبة 90% من tokens الإدخال. صمّم المحادثات لتعظيم التخزين المؤقت:</p>

<h3>مقارنة التكلفة (Claude Sonnet 4.5 High)</h3>
<table>
  <thead>
    <tr>
      <th>نوع الـ token</th>
      <th>التكلفة لكل مليون token</th>
      <th>التكلفة النسبية</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Tokens الإخراج</td>
      <td>$15.00</td>
      <td>100x</td>
    </tr>
    <tr>
      <td>Tokens الإدخال</td>
      <td>$3.00</td>
      <td>20x</td>
    </tr>
    <tr>
      <td>Tokens إدخال مخزنة</td>
      <td>$0.30</td>
      <td>2x</td>
    </tr>
    <tr>
      <td>Tokens كتابة للتخزين</td>
      <td>$3.75</td>
      <td>25x</td>
    </tr>
  </tbody>
</table>

<h3>إدارة نافذة السياق الطويلة</h3>
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

<h2>3. التحكم في التزامن والتعامل مع حدود المعدل</h2>
<p>تفرض Anthropic حدود معدل على مستوى المنظمة. نفّذ تحكماً في التزامن على جانب العميل لتجنب أخطاء 429:</p>

<h3>محدّد معدل دلو الرموز (token bucket)</h3>
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

<h2>4. الإخراج المتدفق وأفضل ممارسات إعادة المحاولة</h2>
<p>تقلل الاستجابات المتدفقة زمن الوصول إلى أول token وتتيح العرض التدريجي. اجمعها مع التراجع الأسي لمعالجة أخطاء قوية:</p>

<h3>التدفق مع منطق إعادة المحاولة</h3>
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
