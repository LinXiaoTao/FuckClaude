export const content = `
<h2>1. Принципы Prompt Cache и максимизация выгоды</h2>
<p>Функция Prompt Caching Anthropic может снизить стоимость на 90% и задержку на 85% для повторяющегося контекста. Понимание поведения кэша критично для оптимизации API:</p>

<h3>Правила работы кэша</h3>
<ul>
  <li><strong>Минимальный размер кэша:</strong> кэшируемые блоки должны быть ≥ 1024 tokens. Меньшие блоки не кэшируются.</li>
  <li><strong>TTL кэша:</strong> кэшированный контент истекает после 5 минут без активности. Повторное использование того же кэша в течение 5 минут продлевает TTL.</li>
  <li><strong>Ключ кэша:</strong> кэш ключуется точным совпадением содержимого. Изменение одного символа инвалидирует кэш.</li>
  <li><strong>Размещение кэша:</strong> только сообщения роли <code>system</code> и финальное сообщение <code>user</code> поддерживают кэширование. Промежуточные сообщения кэшировать нельзя.</li>
</ul>

<h3>Оптимальная стратегия кэша</h3>
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

<h2>2. Оптимизация биллинга по tokens и управление контекстом</h2>
<p>Цены Claude API асимметричны: input tokens дешевле output tokens, а cached tokens на 90% дешевле input tokens. Стройте диалоги так, чтобы максимизировать кэширование:</p>

<h3>Сравнение стоимости (Claude Sonnet 4.5 High)</h3>
<table>
  <thead>
    <tr>
      <th>Тип token</th>
      <th>Стоимость за 1M tokens</th>
      <th>Относительная стоимость</th>
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

<h3>Управление длинным контекстным окном</h3>
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

<h2>3. Контроль параллелизма и обработка rate limit</h2>
<p>Anthropic применяет rate limits на уровне организации. Реализуйте клиентский контроль параллелизма, чтобы избежать ошибок 429:</p>

<h3>Rate limiter на основе token bucket</h3>
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

<h2>4. Streaming и лучшие практики повторов</h2>
<p>Потоковые ответы сокращают time-to-first-token и позволяют постепенный рендеринг. В сочетании с экспоненциальным backoff это даёт устойчивую обработку ошибок:</p>

<h3>Streaming с логикой повторов</h3>
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
