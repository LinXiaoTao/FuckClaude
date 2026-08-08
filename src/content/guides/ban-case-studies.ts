export const ban_case_studies_content = {
  en: `
<h2>1. Case 1: Timezone Mismatch Mass Ban</h2>
<p><strong>Incident:</strong> A team of 15 developers registered Claude Pro accounts while traveling overseas. Within 72 hours, 12 accounts were permanently banned with "Terms of Service violation" notices.</p>

<h3>Root Cause Analysis</h3>
<ul>
  <li>System timezone remained set to <code>Asia/Shanghai</code> (UTC+8) while using US-based residential proxies.</li>
  <li>Browser <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code> returned <code>"Asia/Shanghai"</code>, which Claude Code reads and encodes into system prompts.</li>
  <li>Payment cards were bound with US billing addresses, but the timezone mismatch triggered automated risk classifiers.</li>
</ul>

<h3>Prevention Checklist</h3>
<pre><code># Before registration, verify timezone alignment:
# macOS
sudo systemsetup -gettimezone

# Linux
timedatectl

# Ensure timezone matches proxy exit region:
sudo systemsetup -settimezone "America/New_York"</code></pre>

<ul>
  <li>Set OS timezone to match the proxy IP exit region <em>before</em> opening Claude.ai.</li>
  <li>Verify timezone in browser console: <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code>.</li>
  <li>Clear all browser cookies and restart after changing timezone to flush cached fingerprints.</li>
</ul>

<h2>2. Case 2: High-Risk Virtual Card BIN Refund Ban</h2>
<p><strong>Incident:</strong> Eight Claude Pro subscriptions were charged successfully on day 1, but accounts were automatically refunded and suspended within 48 hours.</p>

<h3>Root Cause Analysis</h3>
<ul>
  <li>All accounts used virtual prepaid Visa cards with BIN <code>4571</code>, a publicly known high-risk BIN frequently used for trial abuse.</li>
  <li>Billing addresses were generic (e.g., "123 Main St"), not real residential addresses matching the card-issuing bank's region.</li>
  <li>Anthropic's payment processor flagged the transactions as high-risk, triggered automatic refunds, and marked accounts as "Refunded / Suspended".</li>
</ul>

<h3>Prevention Checklist</h3>
<ul>
  <li>Use virtual card BINs with established reputations (e.g., <code>485932</code>, <code>532959</code>, <code>428803</code>) issued by recognized US fintech banks.</li>
  <li>Fill billing address with real, verifiable US addresses (use USPS address lookup) that match the state of your proxy IP.</li>
  <li>Ensure card balance exceeds $25 USD before binding to cover the initial $1 pre-authorization hold plus the first month.</li>
  <li>Never bind the same virtual card to more than 2 Claude accounts.</li>
</ul>

<h2>3. Case 3: API Rate Abuse Detection</h2>
<p><strong>Incident:</strong> A startup's API key was rate-limited to 1 request per minute after running a batch distillation job that sent 50,000 requests in 6 hours.</p>

<h3>Root Cause Analysis</h3>
<ul>
  <li>The script sent requests at maximum throughput without rate limiting or jitter.</li>
  <li>All prompts were nearly identical with only minor parameter variations, triggering Anthropic's distillation detection classifiers.</li>
  <li>Requests originated from a single AWS EC2 datacenter IP, further elevating the abuse risk score.</li>
</ul>

<h3>Prevention Checklist</h3>
<pre><code>// Implement exponential backoff and jitter in API client
async function callClaudeWithBackoff(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropic.messages.create({
        model: "claude-sonnet-4.5-high",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error: any) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}</code></pre>

<ul>
  <li>Implement exponential backoff with random jitter (100-3000ms) between API calls.</li>
  <li>Rotate API keys across multiple organizations if scaling beyond 1000 requests/hour.</li>
  <li>Use residential proxy IPs for API traffic, never datacenter IPs.</li>
  <li>Vary prompt structures and inject natural human-like variations to avoid classifier detection.</li>
</ul>

<h2>4. Case 4: Account Association Chain Ban</h2>
<p><strong>Incident:</strong> Five Claude accounts were banned simultaneously after one account in the group violated ToS.</p>

<h3>Root Cause Analysis</h3>
<ul>
  <li>All five accounts shared the same <code>organizationUuid</code> because they were logged in via Claude Code on the same machine with different browser profiles.</li>
  <li>The same virtual credit card was bound to 4 of the 5 accounts.</li>
  <li>When one account was flagged for automated script usage, Anthropic's backend linked all associated accounts and applied a blanket ban.</li>
</ul>

<h3>Prevention Checklist</h3>
<pre><code># Check Claude Code's organizationUuid grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>Never share virtual credit cards across more than 2 Claude accounts.</li>
  <li>Use separate machines or virtual machines for high-value accounts to avoid <code>organizationUuid</code> sharing.</li>
  <li>If using browser profiles, ensure each profile has fully isolated cookies, localStorage, and fingerprints (Canvas, WebGL).</li>
  <li>Avoid batch operations across associated accounts within short time windows.</li>
</ul>

<h2>5. Lessons Learned & Prevention Checklist</h2>
<p>Every ban case shares common patterns. Follow this master checklist to minimize risk:</p>

<ul>
  <li><strong>Pre-Registration:</strong> Sync OS timezone, clear browser state, verify residential IP, prepare compliant phone number and card.</li>
  <li><strong>Payment Binding:</strong> Use high-reputation BINs, real billing addresses, sufficient balance, and never reuse cards across 3+ accounts.</li>
  <li><strong>Daily Usage:</strong> Maintain consistent timezone/IP/device fingerprints, enable 2FA, avoid rapid IP changes without 2FA re-auth.</li>
  <li><strong>API Automation:</strong> Implement rate limiting, jitter, residential proxies, and prompt variation to avoid distillation flags.</li>
  <li><strong>Multi-Account:</strong> Isolate organizationUuid, payment methods, and usage patterns to prevent association bans.</li>
</ul>
`,
  zh: `
<h2>一、 案例 1：时区不一致导致的批量封号</h2>
<p><strong>事件：</strong> 一个 15 人开发团队在海外出差期间注册 Claude Pro 账号。72 小时内，12 个账号因"违反服务条款"被永久封禁。</p>

<h3>根因分析</h3>
<ul>
  <li>系统时区仍设置为 <code>Asia/Shanghai</code>（UTC+8），但使用美国住宅代理。</li>
  <li>浏览器 <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code> 返回 <code>"Asia/Shanghai"</code>，被 Claude Code 读取并编码进系统提示词。</li>
  <li>支付卡绑定了美国账单地址，但时区不匹配触发了自动风控分类器。</li>
</ul>

<h3>规避检查清单</h3>
<pre><code># 注册前验证时区对齐：
# macOS
sudo systemsetup -gettimezone

# Linux
timedatectl

# 确保时区匹配代理出口地区：
sudo systemsetup -settimezone "America/New_York"</code></pre>

<ul>
  <li>在打开 Claude.ai <em>之前</em>将操作系统时区设置为与代理 IP 出口地区匹配。</li>
  <li>在浏览器控制台验证时区：<code>Intl.DateTimeFormat().resolvedOptions().timeZone</code>。</li>
  <li>更改时区后清除所有浏览器 Cookie 并重启，以刷新缓存的指纹。</li>
</ul>

<h2>二、 案例 2：虚拟卡 BIN 高风险触发退款封号</h2>
<p><strong>事件：</strong> 八个 Claude Pro 订阅在第 1 天成功扣款，但在 48 小时内被自动退款并暂停账号。</p>

<h3>根因分析</h3>
<ul>
  <li>所有账号使用 BIN 为 <code>4571</code> 的虚拟预付 Visa 卡，这是公认的高风险 BIN，频繁被用于试用滥用。</li>
  <li>账单地址是通用地址（如"123 Main St"），而非与发卡银行地区匹配的真实住宅地址。</li>
  <li>Anthropic 的支付处理商将交易标记为高风险，触发自动退款，账号被标记为"Refunded / Suspended"。</li>
</ul>

<h3>规避检查清单</h3>
<ul>
  <li>使用信誉良好的虚拟卡 BIN（如 <code>485932</code>、<code>532959</code>、<code>428803</code>），由知名美国金融科技银行发行。</li>
  <li>填写真实、可验证的美国地址（使用 USPS 地址查询），与代理 IP 所在州匹配。</li>
  <li>绑卡前确保卡内余额超过 25 美元，以覆盖 1 美元预授权冻结和首月费用。</li>
  <li>切勿将同一张虚拟卡绑定到超过 2 个 Claude 账号。</li>
</ul>

<h2>三、 案例 3：API 高频调用触发反滥用检测</h2>
<p><strong>事件：</strong> 一家初创公司的 API 密钥在运行批量蒸馏作业（6 小时内发送 50,000 个请求）后被限速至每分钟 1 个请求。</p>

<h3>根因分析</h3>
<ul>
  <li>脚本以最大吞吐量发送请求，没有速率限制或抖动。</li>
  <li>所有提示词几乎相同，只有微小参数变化，触发了 Anthropic 的蒸馏检测分类器。</li>
  <li>请求源自单个 AWS EC2 数据中心 IP，进一步提升了滥用风险评分。</li>
</ul>

<h3>规避检查清单</h3>
<pre><code>// 在 API 客户端实现指数退避和抖动
async function callClaudeWithBackoff(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropic.messages.create({
        model: "claude-sonnet-4.5-high",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error: any) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}</code></pre>

<ul>
  <li>在 API 调用之间实现指数退避和随机抖动（100-3000ms）。</li>
  <li>如果扩展到每小时超过 1000 个请求，跨多个组织轮换 API 密钥。</li>
  <li>为 API 流量使用住宅代理 IP，切勿使用数据中心 IP。</li>
  <li>变化提示词结构，注入自然的类人变化，以避免分类器检测。</li>
</ul>

<h2>四、 案例 4：账号关联导致的连带封号</h2>
<p><strong>事件：</strong> 五个 Claude 账号在组内一个账号违反服务条款后同时被封禁。</p>

<h3>根因分析</h3>
<ul>
  <li>所有五个账号共享相同的 <code>organizationUuid</code>，因为它们在同一台机器上通过不同浏览器配置文件登录 Claude Code。</li>
  <li>同一张虚拟信用卡绑定到 5 个账号中的 4 个。</li>
  <li>当一个账号因自动脚本使用被标记时，Anthropic 后端关联了所有相关账号并应用了全面封禁。</li>
</ul>

<h3>规避检查清单</h3>
<pre><code># 检查 Claude Code 的 organizationUuid 分组
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>切勿将虚拟信用卡共享给超过 2 个 Claude 账号。</li>
  <li>为高价值账号使用单独的机器或虚拟机，避免 <code>organizationUuid</code> 共享。</li>
  <li>如果使用浏览器配置文件，确保每个配置文件具有完全隔离的 Cookie、localStorage 和指纹（Canvas、WebGL）。</li>
  <li>避免在短时间窗口内跨关联账号进行批量操作。</li>
</ul>

<h2>五、 经验总结与避坑检查清单</h2>
<p>每个封号案例都有共同模式。遵循此主检查清单以最小化风险：</p>

<ul>
  <li><strong>注册前：</strong> 同步操作系统时区、清除浏览器状态、验证住宅 IP、准备合规手机号和卡。</li>
  <li><strong>支付绑定：</strong> 使用高信誉 BIN、真实账单地址、充足余额，切勿在 3+ 个账号间重用卡。</li>
  <li><strong>日常使用：</strong> 保持时区/IP/设备指纹一致，启用 2FA，避免在没有 2FA 重新认证的情况下快速更改 IP。</li>
  <li><strong>API 自动化：</strong> 实施速率限制、抖动、住宅代理和提示词变化，以避免蒸馏标记。</li>
  <li><strong>多账号：</strong> 隔离 organizationUuid、支付方式和使用模式，以防止关联封号。</li>
</ul>
`,
};
