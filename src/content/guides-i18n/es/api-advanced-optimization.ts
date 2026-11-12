export const content = `
<h2>1. Principios de Prompt Cache y maximización</h2>
<p>La función Prompt Caching de Anthropic puede reducir costos un 90% y la latencia un 85% para contexto repetido. Entender el comportamiento de la caché es crítico para optimizar la API:</p>

<h3>Reglas de comportamiento de la caché</h3>
<ul>
  <li><strong>Tamaño mínimo de caché:</strong> Los bloques en caché deben ser ≥ 1024 tokens. Bloques más pequeños no se almacenan en caché.</li>
  <li><strong>TTL de caché:</strong> El contenido en caché expira tras 5 minutos de inactividad. Reutilizar la misma caché dentro de 5 minutos extiende el TTL.</li>
  <li><strong>Clave de caché:</strong> La caché se indexa por coincidencia exacta de contenido. Cambiar un solo carácter invalida la caché.</li>
  <li><strong>Ubicación de caché:</strong> Solo los mensajes con rol <code>system</code> y el último mensaje <code>user</code> admiten caché. Los mensajes intermedios no se pueden cachear.</li>
</ul>

<h3>Estrategia óptima de caché</h3>
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

<h2>2. Optimización de facturación por tokens y gestión de contexto</h2>
<p>El precio de la API de Claude es asimétrico: los tokens de entrada cuestan menos que los de salida, y los tokens en caché cuestan un 90% menos que los de entrada. Estructure las conversaciones para maximizar la caché:</p>

<h3>Comparación de costos (Claude Sonnet 4.5 High)</h3>
<table>
  <thead>
    <tr>
      <th>Tipo de token</th>
      <th>Costo por 1M tokens</th>
      <th>Costo relativo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Tokens de salida</td>
      <td>$15.00</td>
      <td>100x</td>
    </tr>
    <tr>
      <td>Tokens de entrada</td>
      <td>$3.00</td>
      <td>20x</td>
    </tr>
    <tr>
      <td>Tokens de entrada en caché</td>
      <td>$0.30</td>
      <td>2x</td>
    </tr>
    <tr>
      <td>Tokens de escritura en caché</td>
      <td>$3.75</td>
      <td>25x</td>
    </tr>
  </tbody>
</table>

<h3>Gestión de ventana de contexto largo</h3>
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

<h2>3. Control de concurrencia y manejo de límites de tasa</h2>
<p>Anthropic aplica límites de tasa a nivel de organización. Implemente control de concurrencia en el cliente para evitar errores 429:</p>

<h3>Limitador de tasa tipo token bucket</h3>
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

<h2>4. Salida en streaming y mejores prácticas de reintento</h2>
<p>Las respuestas en streaming reducen el tiempo hasta el primer token y permiten renderizado progresivo. Combínelas con retroceso exponencial para un manejo de errores robusto:</p>

<h3>Streaming con lógica de reintento</h3>
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
