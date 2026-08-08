export const automation_safety_practices_content = {
  en: `
<h2>1. Batch Call Frequency Control & Rate Limiting</h2>
<p>Anthropic enforces organization-level rate limits. Design automation systems to respect these limits and avoid triggering anti-abuse classifiers:</p>

<h3>Rate Limit Tiers (As of 2026-08)</h3>
<table>
  <thead>
    <tr>
      <th>Account Tier</th>
      <th>RPM (Requests/Min)</th>
      <th>TPM (Tokens/Min)</th>
      <th>Daily Token Limit</th>
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

<h3>Adaptive Rate Limiter Implementation</h3>
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

<h2>2. Anti-Abuse Detection Avoidance</h2>
<p>Anthropic's backend classifiers detect patterns indicative of model distillation or unauthorized scraping. Mimic human-like behavior to avoid flags:</p>

<h3>Human Behavior Simulation Techniques</h3>
<ul>
  <li><strong>Prompt Variation:</strong> Add natural language variability to prompts. Avoid sending 1000 near-identical requests.</li>
  <li><strong>Jitter Injection:</strong> Randomize delays between requests (e.g., 100-3000ms uniform distribution).</li>
  <li><strong>Session Boundaries:</strong> Batch work into sessions of 20-50 requests, separated by 5-10 minute breaks.</li>
  <li><strong>Output Length Variation:</strong> Vary <code>max_tokens</code> across requests to avoid fixed-length output patterns.</li>
</ul>

<h3>Prompt Variation Example</h3>
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

<h2>3. Multi-Account Polling & Load Balancing</h2>
<p>Distribute high-volume workloads across multiple Claude accounts to avoid per-organization rate limits and reduce distillation risk:</p>

<h3>Round-Robin Load Balancer</h3>
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

<h2>4. Audit Logging & Compliance Checklist</h2>
<p>Maintain comprehensive logs of automation activity for compliance audits and debugging:</p>

<h3>Audit Log Schema</h3>
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

<h3>Compliance Self-Audit Checklist</h3>
<ul>
  <li>All automated requests use API keys, not stolen session tokens</li>
  <li>Automation respects Anthropic's rate limits (no aggressive bypass attempts)</li>
  <li>Output is used for internal tooling, not resale or public model training</li>
  <li>Logs retained for 90 days for audit trail</li>
  <li>Residential IPs used for API traffic (no datacenter IPs for high-volume automation)</li>
  <li>No prompt injection attacks or jailbreak attempts in automated workflows</li>
</ul>
`,
  zh: `
<h2>一、 批量调用频率控制与速率限制策略</h2>
<p>Anthropic 实施组织级速率限制。设计自动化系统以遵守这些限制并避免触发反滥用分类器：</p>

<h3>速率限制层级（截至 2026-08）</h3>
<table>
  <thead>
    <tr>
      <th>账号层级</th>
      <th>RPM（请求/分钟）</th>
      <th>TPM（Token/分钟）</th>
      <th>每日 Token 限制</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>免费层</strong></td>
      <td>5</td>
      <td>40,000</td>
      <td>50,000</td>
    </tr>
    <tr>
      <td><strong>Pro 层</strong></td>
      <td>50</td>
      <td>200,000</td>
      <td>5,000,000</td>
    </tr>
    <tr>
      <td><strong>Team 层</strong></td>
      <td>100</td>
      <td>400,000</td>
      <td>10,000,000</td>
    </tr>
    <tr>
      <td><strong>企业层</strong></td>
      <td>定制</td>
      <td>定制</td>
      <td>协商</td>
    </tr>
  </tbody>
</table>

<h3>自适应速率限制器实现</h3>
<pre><code>class AdaptiveRateLimiter {
  private requestQueue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private maxConcurrency: number;
  private minDelay: number; // 请求间最小延迟（毫秒）
  
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
        // 命中速率限制，指数退避
        const retryAfter = error.headers?.['retry-after'] || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return this.execute(fn); // 重试
      }
      throw error;
    } finally {
      this.activeRequests--;
    }
  }
}

// 使用示例
const limiter = new AdaptiveRateLimiter(50); // Pro 层 50 RPM
const results = await Promise.all(
  prompts.map(prompt => limiter.execute(() => callClaude(prompt)))
);</code></pre>

<h2>二、 反滥用检测规避：随机化与人类行为模拟</h2>
<p>Anthropic 后端分类器检测模型蒸馏或未授权爬取的模式。模拟类人行为以避免标记：</p>

<h3>人类行为模拟技术</h3>
<ul>
  <li><strong>提示词变化：</strong> 为提示词添加自然语言变异。避免发送 1000 个几乎相同的请求。</li>
  <li><strong>抖动注入：</strong> 随机化请求间延迟（如 100-3000ms 均匀分布）。</li>
  <li><strong>会话边界：</strong> 将工作分批为 20-50 个请求的会话，中间间隔 5-10 分钟。</li>
  <li><strong>输出长度变化：</strong> 跨请求变化 <code>max_tokens</code>，避免固定长度输出模式。</li>
</ul>

<h3>提示词变化示例</h3>
<pre><code>const templates = [
  "重构这段代码：\n{code}",
  "你能改进这个函数吗？\n{code}",
  "请优化：\n{code}",
  "你会如何重写这个？\n{code}",
];

function varyPrompt(code: string): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const prefix = Math.random() > 0.5 ? "这是我的代码：" : "";
  return prefix + template.replace("{code}", code);
}</code></pre>

<h2>三、 多账号轮询与负载均衡架构</h2>
<p>在多个 Claude 账号间分配高容量工作负载，以避免每个组织的速率限制并降低蒸馏风险：</p>

<h3>轮询负载均衡器</h3>
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
    // 加权轮询选择
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

// 使用示例
const balancer = new MultiAccountBalancer([
  { apiKey: "sk-ant-api03-...", weight: 2 }, // Pro 账号，更高权重
  { apiKey: "sk-ant-api04-...", weight: 1 }, // 免费账号，更低权重
]);

async function callWithBalancing(prompt: string) {
  const apiKey = balancer.getNextAccount();
  return await anthropic.messages.create({
    apiKey,
    model: "claude-sonnet-4.5-high",
    messages: [{ role: "user", content: prompt }],
  });
}</code></pre>

<h2>四、 审计日志与合规性自查清单</h2>
<p>维护自动化活动的综合日志，用于合规审计和调试：</p>

<h3>审计日志架构</h3>
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

// 记录每次 API 调用
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

<h3>合规性自查清单</h3>
<ul>
  <li>所有自动化请求使用 API 密钥，而非窃取的会话令牌</li>
  <li>自动化遵守 Anthropic 速率限制（无激进绕过尝试）</li>
  <li>输出用于内部工具，而非转售或公共模型训练</li>
  <li>日志保留 90 天用于审计追踪</li>
  <li>API 流量使用住宅 IP（大容量自动化禁用数据中心 IP）</li>
  <li>自动化工作流中无提示词注入攻击或越狱尝试</li>
</ul>
`,
};
