export const claude_code_and_api_safety_content = {
  en: `
<h2>1. Claude Code Security Configurations</h2>
<p>When using Claude Code with proxy gateways or custom endpoints, prevent client fingerprint leakage with proper shell environment variables:</p>

<pre><code># ~/.zshrc or ~/.bashrc configuration

# 1. Bypass client steganographic checks for custom base URL
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Force non-China timezone in terminal
export TZ=Asia/Tokyo

# 3. Route CLI outbound traffic through a clean proxy
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"</code></pre>

<h2>2. Selecting API Relay Gateways</h2>
<p>If direct access to <code>api.anthropic.com</code> is constrained, selecting reliable API gateways ensures high availability without unexpected account blocks:</p>

<ul>
  <li><strong>Prompt Cache Preservation:</strong> Ensure the gateway supports Anthropic prompt caching headers (<code>anthropic-beta: prompt-caching-2024-01-26</code>). Poorly implemented relays strip caching headers, causing input token costs to surge 4x to 10x.</li>
  <li><strong>Unmodified System Prompts:</strong> High-quality gateways relay payloads transparently without injecting custom prompt banners or altering model output streams.</li>
  <li><strong>Neutral Hostnames:</strong> Avoid proxy hostnames containing Chinese AI lab keywords (<code>deepseek</code>, <code>zhipu</code>, <code>moonshot</code>) or <code>*.cn</code> domain suffixes.</li>
</ul>

<h2>3. Rate Limits (429) & Smooth Failover</h2>
<p>Anthropic enforces Rate Limits per organization rather than per API Key. Implement smooth error handling and fallback models in your code or gateway configuration:</p>

<pre><code>// Example TypeScript retry and failover logic
async function callClaudeWithFallback(prompt: string) {
  try {
    return await callClaudeAPI(prompt);
  } catch (error: any) {
    if (error?.status === 429 || error?.status === 403) {
      console.warn('Claude API constrained, falling back to DeepSeek R1 / GLM-4...');
      return await callFallbackAPI(prompt);
    }
    throw error;
  }
}</code></pre>
`,
  zh: `
<h2>一、 Claude Code 开发者安全环境配置</h2>
<p>在使用 Claude Code 搭配自定义端点或代理转发时，可通过配置环境变量避免客户端隐写打标与环境泄露：</p>

<pre><code># 在 ~/.zshrc 或 ~/.bashrc 中添加配置

# 1. 告知客户端将自定义端点视作原生端点，跳过隐写校验
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. 终端环境变量强制覆盖系统时区为日本东京
export TZ=Asia/Tokyo

# 3. 规范配置本地代理转发
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"</code></pre>

<h2>二、 第三方 API 中转网关选型规范</h2>
<p>在直连 <code>api.anthropic.com</code> 困难的场景下，选择优质 API 中转网关需关注以下维度：</p>

<ul>
  <li><strong>完整支持 Prompt Cache：</strong> 确保中转网关完整透传 Anthropic 的 Prompt Caching 请求头（<code>anthropic-beta: prompt-caching-2024-01-26</code>）。劣质中转丢弃 Cache 请求头会导致长上下文对话 Token 消耗暴增 4 到 10 倍。</li>
  <li><strong>System Prompt 原样透传：</strong> 优质网关不会在中途改写系统 Prompt 或注入广告文本，保障输出的原汁原味与安全性。</li>
  <li><strong>中转主机名保持中性：</strong> 代理 Host 域名应避开国内 AI 实验室关键字（<code>deepseek</code>、<code>zhipu</code>、<code>moonshot</code>）以及 <code>*.cn</code> 顶级后缀。</li>
</ul>

<h2>三、 配额超限（429）与平滑降级机制</h2>
<p>Anthropic 的速率限制（Rate Limit）是按组织（Organization）而非单个 Key 进行计费与调度的。在代码或网关侧配置平滑降级可保障服务连续性：</p>

<pre><code>// TypeScript 示例：捕捉 429/403 自动平滑降级
async function callClaudeWithFallback(prompt: string) {
  try {
    return await callClaudeAPI(prompt);
  } catch (error: any) {
    if (error?.status === 429 || error?.status === 403) {
      console.warn('Claude 接口受限，自动平滑切至 DeepSeek R1 / GLM-4 灾备接口...');
      return await callFallbackAPI(prompt);
    }
    throw error;
  }
}</code></pre>
`,
};
