export const api_advanced_optimization_content = {
  en: `
<h2>1. Prompt Cache Principles & Maximization</h2>
<p>Anthropic's Prompt Caching feature can reduce costs by 90% and latency by 85% for repeated context. Understanding cache behavior is critical for API optimization:</p>

<h3>Cache Behavior Rules</h3>
<ul>
  <li><strong>Minimum Cache Size:</strong> Cached blocks must be ≥ 1024 tokens. Smaller blocks are not cached.</li>
  <li><strong>Cache TTL:</strong> Cached content expires after 5 minutes of inactivity. Re-using the same cache within 5 minutes extends the TTL.</li>
  <li><strong>Cache Key:</strong> Cache is keyed by exact content match. Changing a single character invalidates the cache.</li>
  <li><strong>Cache Placement:</strong> Only <code>system</code> role messages and the final <code>user</code> message support caching. Intermediate messages cannot be cached.</li>
</ul>

<h3>Optimal Cache Strategy</h3>
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

<h2>2. Token Billing Optimization & Context Management</h2>
<p>Claude API pricing is asymmetric: input tokens cost less than output tokens, and cached tokens cost 90% less than input tokens. Structure conversations to maximize caching:</p>

<h3>Cost Comparison (Claude Sonnet 4.5 High)</h3>
<table>
  <thead>
    <tr>
      <th>Token Type</th>
      <th>Cost per 1M Tokens</th>
      <th>Relative Cost</th>
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

<h3>Long Context Window Management</h3>
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

<h2>3. Concurrency Control & Rate Limit Handling</h2>
<p>Anthropic enforces organization-level rate limits. Implement client-side concurrency control to avoid 429 errors:</p>

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

<h2>4. Streaming Output & Retry Best Practices</h2>
<p>Streaming responses reduce time-to-first-token and enable progressive rendering. Combine with exponential backoff for robust error handling:</p>

<h3>Streaming with Retry Logic</h3>
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
`,
  zh: `
<h2>一、 Prompt Cache 原理与最大化利用策略</h2>
<p>Anthropic 的 Prompt Caching 功能可将重复上下文的成本降低 90%，延迟降低 85%。理解缓存行为对 API 优化至关重要：</p>

<h3>缓存行为规则</h3>
<ul>
  <li><strong>最小缓存大小：</strong> 缓存块必须 ≥ 1024 tokens。更小的块不会被缓存。</li>
  <li><strong>缓存 TTL：</strong> 缓存内容在 5 分钟不活动后过期。在 5 分钟内重复使用同一缓存会延长 TTL。</li>
  <li><strong>缓存键：</strong> 缓存通过精确内容匹配作为键。更改一个字符会使缓存失效。</li>
  <li><strong>缓存位置：</strong> 仅 <code>system</code> 角色消息和最后的 <code>user</code> 消息支持缓存。中间消息无法缓存。</li>
</ul>

<h3>最优缓存策略</h3>
<pre><code>const systemPrompt = \`你是一位专家软件架构师...
[很少变化的大型 5000 token 上下文]\`;

// 标记系统提示词进行缓存
const response = await anthropic.messages.create({
  model: "claude-sonnet-4.5-high",
  max_tokens: 2048,
  system: [
    {
      type: "text",
      text: systemPrompt,
      cache_control: { type: "ephemeral" }, // 缓存此块
    },
  ],
  messages: [
    { role: "user", content: "重构这个函数..." },
  ],
});</code></pre>

<h2>二、 Token 计费优化与长上下文窗口管理</h2>
<p>Claude API 定价不对称：输入 token 成本低于输出 token，缓存 token 成本比输入 token 低 90%。构建对话以最大化缓存利用：</p>

<h3>成本对比（Claude Sonnet 4.5 High）</h3>
<table>
  <thead>
    <tr>
      <th>Token 类型</th>
      <th>每百万 Token 成本</th>
      <th>相对成本</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>输出 Tokens</td>
      <td>$15.00</td>
      <td>100x</td>
    </tr>
    <tr>
      <td>输入 Tokens</td>
      <td>$3.00</td>
      <td>20x</td>
    </tr>
    <tr>
      <td>缓存输入 Tokens</td>
      <td>$0.30</td>
      <td>2x</td>
    </tr>
    <tr>
      <td>缓存写入 Tokens</td>
      <td>$3.75</td>
      <td>25x</td>
    </tr>
  </tbody>
</table>

<h3>长上下文窗口管理</h3>
<pre><code>// 多轮对话的滑动窗口方法
function maintainContextWindow(history: Message[], maxTokens: number = 180000) {
  let totalTokens = estimateTokenCount(history);
  
  while (totalTokens > maxTokens && history.length > 2) {
    // 首先移除最旧的非系统消息
    history.splice(1, 2); // 移除一对用户-助手消息
    totalTokens = estimateTokenCount(history);
  }
  
  return history;
}</code></pre>

<h2>三、 并发请求控制与速率限制应对</h2>
<p>Anthropic 实施组织级速率限制。实现客户端并发控制以避免 429 错误：</p>

<h3>令牌桶速率限制器</h3>
<pre><code>class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private refillRate: number; // 每秒令牌数
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

const limiter = new RateLimiter(50); // 每分钟 50 个请求

async function callClaude(prompt: string) {
  await limiter.acquire();
  return await anthropic.messages.create({...});
}</code></pre>

<h2>四、 流式输出与超时重试最佳实践</h2>
<p>流式响应减少首 token 时间并支持渐进式渲染。与指数退避结合实现稳健的错误处理：</p>

<h3>带重试逻辑的流式输出</h3>
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
      
      return; // 成功，退出重试循环
      
    } catch (error: any) {
      if (error.status === 529 && attempt < maxRetries - 1) {
        // 过载错误，带退避重试
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}</code></pre>
`,
};
