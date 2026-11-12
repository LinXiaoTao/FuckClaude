export const content = `
<h2>1. Контроль частоты пакетных вызовов и rate limiting</h2>
<p>Anthropic применяет лимиты на уровне организации. Проектируйте автоматизацию так, чтобы уважать эти лимиты и не запускать классификаторы злоупотреблений:</p>

<h3>Уровни лимитов (на 2026-08)</h3>
<table>
  <thead>
    <tr>
      <th>Тариф</th>
      <th>RPM (запросов/мин)</th>
      <th>TPM (токенов/мин)</th>
      <th>Суточный лимит токенов</th>
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
      <td>Custom</td>
      <td>Custom</td>
      <td>Negotiated</td>
    </tr>
  </tbody>
</table>

<h3>Реализация адаптивного rate limiter</h3>
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

<h2>2. Снижение срабатывания антиабьюз-детекции</h2>
<p>Бэкенд-классификаторы Anthropic ищут признаки дистилляции модели или несанкционированного скрейпинга. Имитируйте поведение, близкое к человеческому, чтобы реже получать флаги:</p>

<h3>Техники имитации человеческого поведения</h3>
<ul>
  <li><strong>Вариативность промптов:</strong> добавляйте естественные формулировки. Не отправляйте 1000 почти одинаковых запросов.</li>
  <li><strong>Jitter:</strong> рандомизируйте паузы между запросами (например, равномерное распределение 100–3000 ms).</li>
  <li><strong>Границы сессий:</strong> разбивайте работу на сессии по 20–50 запросов с перерывами 5–10 минут.</li>
  <li><strong>Разная длина ответа:</strong> меняйте <code>max_tokens</code> между запросами, чтобы не зафиксировать паттерн фиксированной длины.</li>
</ul>

<h3>Пример вариативности промптов</h3>
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

<h2>3. Опрос нескольких аккаунтов и балансировка нагрузки</h2>
<p>Распределяйте большие объёмы между несколькими аккаунтами Claude, чтобы не упираться в лимиты одной организации и снизить риск дистилляции:</p>

<h3>Балансировщик round-robin</h3>
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

<h2>4. Аудит-логи и чеклист соответствия</h2>
<p>Ведите полные логи автоматизации для аудита соответствия и отладки:</p>

<h3>Схема аудит-лога</h3>
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

<h3>Чеклист самопроверки соответствия</h3>
<ul>
  <li>Все автоматизированные запросы используют API keys, а не украденные session tokens</li>
  <li>Автоматизация соблюдает лимиты Anthropic (без агрессивных попыток обхода)</li>
  <li>Вывод используется во внутренних инструментах, а не для перепродажи или публичного обучения моделей</li>
  <li>Логи хранятся 90 дней для аудиторского следа</li>
  <li>Для API-трафика — резидентные IP (без датацентровых IP при высоком объёме автоматизации)</li>
  <li>В автоматизированных workflow нет prompt injection или jailbreak-попыток</li>
</ul>
`;
