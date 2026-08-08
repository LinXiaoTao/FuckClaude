export const domestic_and_open_source_alternatives_content = {
  en: `
<h2>1. Domestic Top-Tier Model Comparisons</h2>
<p>When Claude direct access or API rates are constrained, domestic frontier models offer zero-latency, hassle-free alternatives for coding and reasoning:</p>

<ul>
  <li><strong>DeepSeek R1 / V3:</strong> Outstanding performance in complex code generation, logical reasoning, and long-context analysis at ultra-low API costs.</li>
  <li><strong>Kimi / Kimi Code:</strong> Strong long-context handling (2M+ tokens) and smooth Chinese/English developer workflows.</li>
  <li><strong>GLM-4 / Zhipu AI:</strong> Comprehensive enterprise-grade API capabilities, function calling, and structured JSON outputs.</li>
</ul>

<h2>2. Setting Up Private Ollama & One-API Claude Compatibility</h2>
<p>You can set up a local or private drop-in API replacement layer that mimics the Anthropic API format, allowing your development tools to continue functioning seamlessly during Claude outages:</p>

<h3>Ollama Local Claude Route Setup</h3>
<pre><code># 1. Install Ollama and pull DeepSeek / Qwen coding model
ollama run deepseek-r1:14b

# 2. Deploy One-API / LiteLLM proxy
# One-API converts OpenAI/Ollama endpoints into Anthropic Claude API format
docker run -d --name one-api -p 3000:3000 -v ./data:/data justsong/one-api

# 3. Configure your local CLI / tools
export ANTHROPIC_BASE_URL="http://localhost:3000"
export ANTHROPIC_API_KEY="sk-one-api-key"</code></pre>

<h2>3. Hybrid Model Routing Strategy</h2>
<p>Combine Claude for complex initial architecture drafting with DeepSeek/GLM for daily code refactoring and test generation to achieve 90% cost savings and zero risk of project blocking.</p>
`,
  zh: `
<h2>一、 国产顶尖大模型平替体验对比</h2>
<p>在 Claude 账号受限或 API 成本高昂时，国内顶尖大模型在代码能力与长上下文推理上已具备强劲替代实力：</p>

<ul>
  <li><strong>DeepSeek R1 / V3：</strong> 极其出色的代码生成、复杂逻辑推理与长上下文重构能力，API 价格极低且无需科学上网。</li>
  <li><strong>Kimi / Kimi Code：</strong> 200 万字长上下文理解能力，深度优化代码阅读与中文技术文档理解。</li>
  <li><strong>GLM-4 (智谱 AI)：</strong> 稳定健全的企业级 API 接口、Function Calling 工具调用与结构化 JSON 输出。</li>
</ul>

<h2>二、 搭建本地 Ollama + One-API 私有化 Claude 降级通道</h2>
<p>通过搭建兼容 Anthropic API 格式的本地网关，可在 Claude 发生断连或封号时，无缝切至本地或私有化灾备接口：</p>

<h3>Ollama + One-API 快速配置步骤</h3>
<pre><code># 1. 安装 Ollama 并运行 DeepSeek / Qwen 代码模型
ollama run deepseek-r1:14b

# 2. 部署 One-API 统一接口网关
# One-API 可将 Ollama/DeepSeek/GLM 转换为标准的 Anthropic Claude 格式
docker run -d --name one-api -p 3000:3000 -v ./data:/data justsong/one-api

# 3. 配置本地环境变量直连降级网关
export ANTHROPIC_BASE_URL="http://localhost:3000"
export ANTHROPIC_API_KEY="sk-one-api-key"</code></pre>

<h2>三、 混合模型调度最佳实践</h2>
<p>建议将复杂架构设计与核心算法交由 Claude 处理，而日常代码重构、单元测试编写与文档生成切至 DeepSeek / Kimi 运行，既能降低 90% 资费，又可确保开发流水线绝对稳健。回退路径简单、零封号风险。例如你可以在本站推荐的 <a href="https://www.kimi.com/code?utm_source=fuck-claude" target="_blank">Kimi Code</a>、<a href="https://www.deepseek.com/?utm_source=fuck-claude" target="_blank">DeepSeek</a> 或 <a href="https://bigmodel.cn/?utm_source=fuck-claude" target="_blank">GLM</a> 中一键体验。
`,
};
