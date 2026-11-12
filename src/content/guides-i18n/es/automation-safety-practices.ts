export const content = `
<h2>1. Control de frecuencia de llamadas por lotes y limitación de velocidad</h2>
<p>Anthropic aplica límites de velocidad a nivel de organización. Diseñe los sistemas de automatización para respetar estos límites y evitar activar clasificadores antabuso:</p>

<h3>Niveles de límite de velocidad (a agosto de 2026)</h3>
<table>
  <thead>
    <tr>
      <th>Nivel de cuenta</th>
      <th>RPM (solicitudes/min)</th>
      <th>TPM (tokens/min)</th>
      <th>Límite diario de tokens</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Plan gratuito</strong></td>
      <td>5</td>
      <td>40,000</td>
      <td>50,000</td>
    </tr>
    <tr>
      <td><strong>Plan Pro</strong></td>
      <td>50</td>
      <td>200,000</td>
      <td>5,000,000</td>
    </tr>
    <tr>
      <td><strong>Plan Team</strong></td>
      <td>100</td>
      <td>400,000</td>
      <td>10,000,000</td>
    </tr>
    <tr>
      <td><strong>Enterprise</strong></td>
      <td>Personalizado</td>
      <td>Personalizado</td>
      <td>Negociado</td>
    </tr>
  </tbody>
</table>

<h3>Implementación de limitador de velocidad adaptativo</h3>
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

<h2>2. Evitar la detección antabuso</h2>
<p>Los clasificadores del backend de Anthropic detectan patrones indicativos de destilación de modelos o scraping no autorizado. Imitar un comportamiento similar al humano ayuda a evitar marcas:</p>

<h3>Técnicas de simulación de comportamiento humano</h3>
<ul>
  <li><strong>Variación de prompts:</strong> Añada variabilidad en lenguaje natural a los prompts. Evite enviar 1000 solicitudes casi idénticas.</li>
  <li><strong>Inyección de jitter:</strong> Aleatorice los retrasos entre solicitudes (por ejemplo, distribución uniforme de 100-3000 ms).</li>
  <li><strong>Límites de sesión:</strong> Agrupe el trabajo en sesiones de 20-50 solicitudes, separadas por pausas de 5-10 minutos.</li>
  <li><strong>Variación de longitud de salida:</strong> Varíe <code>max_tokens</code> entre solicitudes para evitar patrones de salida de longitud fija.</li>
</ul>

<h3>Ejemplo de variación de prompts</h3>
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

<h2>3. Sondeo multi-cuenta y balanceo de carga</h2>
<p>Distribuya cargas de trabajo de alto volumen entre varias cuentas de Claude para evitar los límites de velocidad por organización y reducir el riesgo de destilación:</p>

<h3>Balanceador de carga round-robin</h3>
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

<h2>4. Registro de auditoría y lista de verificación de cumplimiento</h2>
<p>Mantenga registros completos de la actividad de automatización para auditorías de cumplimiento y depuración:</p>

<h3>Esquema de registro de auditoría</h3>
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

<h3>Lista de autocomprobación de cumplimiento</h3>
<ul>
  <li>Todas las solicitudes automatizadas usan claves API, no tokens de sesión obtenidos de forma indebida</li>
  <li>La automatización respeta los límites de velocidad de Anthropic (sin intentos agresivos de eludirlos)</li>
  <li>La salida se usa para herramientas internas, no para reventa ni entrenamiento público de modelos</li>
  <li>Los registros se conservan 90 días como pista de auditoría</li>
  <li>Se usan IP residenciales para el tráfico API (sin IP de centros de datos en automatización de alto volumen)</li>
  <li>No hay ataques de inyección de prompts ni intentos de jailbreak en flujos automatizados</li>
</ul>
`;
