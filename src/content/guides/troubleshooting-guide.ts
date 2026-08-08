export const troubleshooting_guide_content = {
  en: `
<h2>1. Login Failure Diagnosis (403/429/500)</h2>
<p>Login failures typically map to specific root causes based on HTTP status codes and error messages:</p>

<h3>Error Code Matrix</h3>
<table>
  <thead>
    <tr>
      <th>Status Code</th>
      <th>Error Message</th>
      <th>Root Cause</th>
      <th>Resolution</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>403 Forbidden</strong></td>
      <td>"Access denied"</td>
      <td>IP blocked or high-risk datacenter IP</td>
      <td>Switch to residential proxy, clear cookies, retry after 1 hour</td>
    </tr>
    <tr>
      <td><strong>429 Too Many Requests</strong></td>
      <td>"Rate limit exceeded"</td>
      <td>Exceeded login attempts or API rate limit</td>
      <td>Wait 15 minutes, implement exponential backoff</td>
    </tr>
    <tr>
      <td><strong>500 Internal Server Error</strong></td>
      <td>"Something went wrong"</td>
      <td>Anthropic backend issue or invalid session state</td>
      <td>Clear all claude.ai cookies, restart browser, retry</td>
    </tr>
    <tr>
      <td><strong>Account Disabled</strong></td>
      <td>"Your account has been disabled"</td>
      <td>ToS violation or payment issue</td>
      <td>Check email for ban reason, follow appeal SOP</td>
    </tr>
  </tbody>
</table>

<h3>Diagnostic Procedure</h3>
<pre><code># 1. Check current IP reputation
curl https://ipinfo.io
# Verify "org" does not show datacenter ASN (AWS, Hetzner, etc.)

# 2. Test DNS resolution
nslookup claude.ai
# Should resolve to Cloudflare IPs (104.18.x.x range)

# 3. Clear browser state completely
# Chrome: Settings → Privacy → Clear browsing data → All time → Cookies, Cache
# Firefox: Settings → Privacy → Clear Data → Everything

# 4. Test login with clean profile
google-chrome --user-data-dir="/tmp/test-profile" --proxy-server="socks5://proxy:1080"</code></pre>

<h2>2. API Call Exception Troubleshooting</h2>
<p>API failures require systematic diagnosis of network, authentication, and rate limiting issues:</p>

<h3>Common API Errors</h3>
<ul>
  <li><strong>401 Unauthorized:</strong> Invalid API key or key revoked. Verify key in Anthropic Console, regenerate if needed.</li>
  <li><strong>429 Rate Limit:</strong> Organization exceeded RPM (requests per minute) or TPM (tokens per minute) quota. Implement client-side rate limiting.</li>
  <li><strong>529 Overloaded:</strong> Anthropic backend at capacity. Retry with exponential backoff (2^n seconds with jitter).</li>
  <li><strong>Timeout:</strong> Request exceeded 60-second timeout. Split large prompts into smaller chunks or reduce max_tokens.</li>
</ul>

<h3>API Debug Script</h3>
<pre><code>#!/usr/bin/env node
const Anthropic = require('@anthropic-ai/sdk');

async function diagnoseAPI() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    console.log('Testing API connectivity...');
    const response = await client.messages.create({
      model: 'claude-sonnet-4.5-high',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('✓ API key valid, connection successful');
    console.log('Response:', response.content[0].text);
  } catch (error) {
    console.error('✗ API Error:', error.status, error.message);
    if (error.status === 401) console.log('→ Check API key validity');
    if (error.status === 429) console.log('→ Rate limit exceeded, wait 60s');
    if (error.status === 529) console.log('→ Backend overloaded, retry with backoff');
  }
}

diagnoseAPI();</code></pre>

<h2>3. Payment Binding Failure Root Cause</h2>
<p>Payment rejections occur at multiple stages. Diagnose by examining the failure point:</p>

<ul>
  <li><strong>Card Declined (Pre-Authorization):</strong> Insufficient balance (<$1), invalid CVV, or expired card. Ensure card has ≥$25 balance.</li>
  <li><strong>BIN Rejected:</strong> High-risk prepaid BIN flagged by payment processor. Switch to credit/debit BIN from established banks.</li>
  <li><strong>Address Mismatch:</strong> Billing address country/state does not align with IP geolocation. Use real US address matching proxy exit state.</li>
  <li><strong>Fraud Detection:</strong> Rapid successive binding attempts. Wait 24 hours, bind only one card per session.</li>
</ul>

<h2>4. Common Issues FAQ & Quick Fixes</h2>

<h3>Q: "Claude says my session expired, but I just logged in"</h3>
<p><strong>A:</strong> Session cookies are tied to IP and device fingerprints. Rapid IP changes invalidate sessions. Solution: Enable 2FA to reduce re-verification prompts, maintain consistent IP per session.</p>

<h3>Q: "API returns cached responses to new prompts"</h3>
<p><strong>A:</strong> Prompt Cache is matching unintended content. Solution: Add a unique identifier or timestamp to prompts to force cache miss: <code>{prompt} [request_id: {Date.now()}]</code>.</p>

<h3>Q: "WebRTC shows my real IP despite using proxy"</h3>
<p><strong>A:</strong> WebRTC bypasses proxy for peer connections. Solution: Completely disable WebRTC in browser settings or use WebRTC Control extension to block STUN requests.</p>

<h3>Q: "Account suddenly requires phone verification"</h3>
<p><strong>A:</strong> Triggered by IP change, new device login, or suspicious activity. Solution: Use real physical SIM verification service, bind 2FA immediately after verification to prevent re-prompts.</p>
`,
  zh: `
<h2>一、 登录失败问题诊断（403/429/500 错误码）</h2>
<p>登录失败通常根据 HTTP 状态码和错误消息映射到特定的根因：</p>

<h3>错误码矩阵</h3>
<table>
  <thead>
    <tr>
      <th>状态码</th>
      <th>错误消息</th>
      <th>根因</th>
      <th>解决方案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>403 Forbidden</strong></td>
      <td>"Access denied"</td>
      <td>IP 被阻止或高风险数据中心 IP</td>
      <td>切换到住宅代理，清除 Cookie，1 小时后重试</td>
    </tr>
    <tr>
      <td><strong>429 Too Many Requests</strong></td>
      <td>"Rate limit exceeded"</td>
      <td>超过登录尝试次数或 API 速率限制</td>
      <td>等待 15 分钟，实施指数退避</td>
    </tr>
    <tr>
      <td><strong>500 Internal Server Error</strong></td>
      <td>"Something went wrong"</td>
      <td>Anthropic 后端问题或无效会话状态</td>
      <td>清除所有 claude.ai Cookie，重启浏览器，重试</td>
    </tr>
    <tr>
      <td><strong>Account Disabled</strong></td>
      <td>"Your account has been disabled"</td>
      <td>违反服务条款或支付问题</td>
      <td>查看邮件了解封禁原因，遵循申诉 SOP</td>
    </tr>
  </tbody>
</table>

<h3>诊断流程</h3>
<pre><code># 1. 检查当前 IP 信誉
curl https://ipinfo.io
# 验证 "org" 不显示数据中心 ASN（AWS、Hetzner 等）

# 2. 测试 DNS 解析
nslookup claude.ai
# 应解析到 Cloudflare IP（104.18.x.x 范围）

# 3. 完全清除浏览器状态
# Chrome：设置 → 隐私 → 清除浏览数据 → 所有时间 → Cookie、缓存
# Firefox：设置 → 隐私 → 清除数据 → 全部

# 4. 使用干净配置文件测试登录
google-chrome --user-data-dir="/tmp/test-profile" --proxy-server="socks5://proxy:1080"</code></pre>

<h2>二、 API 调用异常排查（超时、限流、拒绝）</h2>
<p>API 失败需要系统化诊断网络、身份验证和速率限制问题：</p>

<h3>常见 API 错误</h3>
<ul>
  <li><strong>401 Unauthorized：</strong> API 密钥无效或已撤销。在 Anthropic 控制台验证密钥，必要时重新生成。</li>
  <li><strong>429 Rate Limit：</strong> 组织超过 RPM（每分钟请求数）或 TPM（每分钟 token 数）配额。实施客户端速率限制。</li>
  <li><strong>529 Overloaded：</strong> Anthropic 后端容量不足。使用指数退避重试（2^n 秒加抖动）。</li>
  <li><strong>Timeout：</strong> 请求超过 60 秒超时。将大型提示词拆分为小块或减少 max_tokens。</li>
</ul>

<h3>API 调试脚本</h3>
<pre><code>#!/usr/bin/env node
const Anthropic = require('@anthropic-ai/sdk');

async function diagnoseAPI() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    console.log('测试 API 连接...');
    const response = await client.messages.create({
      model: 'claude-sonnet-4.5-high',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('✓ API 密钥有效，连接成功');
    console.log('响应:', response.content[0].text);
  } catch (error) {
    console.error('✗ API 错误:', error.status, error.message);
    if (error.status === 401) console.log('→ 检查 API 密钥有效性');
    if (error.status === 429) console.log('→ 速率限制超限，等待 60 秒');
    if (error.status === 529) console.log('→ 后端过载，带退避重试');
  }
}

diagnoseAPI();</code></pre>

<h2>三、 支付绑卡失败定位（BIN 拒绝、地址不匹配）</h2>
<p>支付拒绝发生在多个阶段。通过检查失败点进行诊断：</p>

<ul>
  <li><strong>卡被拒绝（预授权）：</strong> 余额不足（<$1）、CVV 无效或卡已过期。确保卡内余额 ≥$25。</li>
  <li><strong>BIN 被拒绝：</strong> 高风险预付 BIN 被支付处理商标记。切换到知名银行的信用/借记 BIN。</li>
  <li><strong>地址不匹配：</strong> 账单地址国家/州与 IP 地理位置不一致。使用与代理出口州匹配的真实美国地址。</li>
  <li><strong>欺诈检测：</strong> 快速连续绑卡尝试。等待 24 小时，每次会话仅绑定一张卡。</li>
</ul>

<h2>四、 常见问题 FAQ 与快速解决方案</h2>

<h3>Q："Claude 说我的会话已过期，但我刚登录"</h3>
<p><strong>A：</strong> 会话 Cookie 与 IP 和设备指纹绑定。快速 IP 更改使会话失效。解决方案：启用 2FA 减少重新验证提示，每次会话保持一致的 IP。</p>

<h3>Q："API 对新提示词返回缓存的响应"</h3>
<p><strong>A：</strong> Prompt Cache 匹配了意外内容。解决方案：在提示词中添加唯一标识符或时间戳以强制缓存未命中：<code>{prompt} [request_id: {Date.now()}]</code>。</p>

<h3>Q："WebRTC 显示我的真实 IP，尽管使用了代理"</h3>
<p><strong>A：</strong> WebRTC 绕过代理进行对等连接。解决方案：在浏览器设置中完全禁用 WebRTC 或使用 WebRTC Control 扩展阻止 STUN 请求。</p>

<h3>Q："账号突然要求手机验证"</h3>
<p><strong>A：</strong> 由 IP 更改、新设备登录或可疑活动触发。解决方案：使用真实物理 SIM 验证服务，验证后立即绑定 2FA 以防止重新提示。</p>
`,
};
