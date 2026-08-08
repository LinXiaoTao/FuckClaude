export const account_appeal_and_recovery_sop_content = {
  en: `
<h2>1. Account Status & Ban Type Diagnosis</h2>
<p>When an account encounters access issues, first identify the exact ban type to choose the appropriate recovery action:</p>

<ul>
  <li><strong>IP Region Block (Access Denied / 403):</strong> "Claude is not available in your region". Solution: Your account is fine; update your proxy node to a residential IP in a supported country (US, UK, SG, JP).</li>
  <li><strong>Subscription Forced Refund (Refunded):</strong> Payment failed or card BIN was blacklisted. The account reverts to Free tier or Pro subscription is canceled. Solution: Update payment method with a high-pass US credit card.</li>
  <li><strong>Account Permanently Disabled (Disabled):</strong> "Your account has been disabled after review". Solution: Submit a formal English appeal via Anthropic Support.</li>
</ul>

<h2>2. High-Success English Appeal SOP</h2>
<p>When appealing a disabled account, frame your usage as an overseas business user or legitimate international traveler rather than arguing TOS technicalities:</p>

<h3>Proven English Appeal Email Template</h3>
<pre><code>Subject: Urgent: Appeal for Disabled Claude Account [Your-Email@domain.com]

Dear Anthropic Support Team,

I am writing to respectfully request a review of my account (Email: [Your-Email@domain.com]), which was recently disabled.

I use Claude Pro/Team primarily for software engineering and academic research. As an international developer who frequently travels for business, I suspect that accessing my account while travelling across different regional networks (e.g. hotel Wi-Fi and corporate roaming proxies) may have triggered an automated security flag.

I confirm that my usage strictly complies with Anthropic's Terms of Service and Usage Policies. I do not engage in any automated scraping, resale, or unauthorized proxying.

Could you please review my account activity and assist in restoring access? I am happy to provide any verification details necessary.

Thank you for your time and assistance.

Best regards,
[Your Name]
[Your Contact Phone / Business Domain]</code></pre>

<h2>3. Subscription Refund & Chargeback SOP</h2>
<p>If your account was disabled immediately after paying for Claude Pro or Team:</p>

<ol>
  <li>Submit the appeal email above first.</li>
  <li>If no response is received within 5 business days, reply to your Stripe payment receipt email to request an official refund.</li>
  <li>If necessary, contact your virtual card issuing bank to initiate an authorized service non-delivery dispute.</li>
</ol>
`,
  zh: `
<h2>一、 封号类型与异常现象判定</h2>
<p>遇到账号无法正常使用时，首先需明确具体的拦截类型，采取针对性的解决措施：</p>

<ul>
  <li><strong>IP 节点地区阻断（403 / Access Denied）：</strong> 提示 "Claude is not available in your region"。判定：账号本身安全，仅为当前代理节点被识别为受限地区。解决：切换至支持地区（美国、英国、新加坡、日本）的原生住宅代理节点。</li>
  <li><strong>订阅被迫退款（Refunded）：</strong> 扣款失败或信用卡 BIN 触发风控，Pro 订阅被强行退款取消，账号退回 Free 档。解决：更换高胜率美国虚拟卡重新绑定。</li>
  <li><strong>账号彻底禁用（Disabled / Suspended）：</strong> 提示 "Your account has been disabled after review"。判定：账号被系统判定违规或触发黑名单。解决：通过 Anthropic 客服提交英文申诉邮件。</li>
</ul>

<h2>二、 高成功率英文申诉自救 SOP</h2>
<p>申诉被禁用的账号时，切忌强行辩驳技术细节，建议将场景定位为合法合规的海外跨境业务用户或出差开发人员：</p>

<h3>高成功率英文申诉邮件模板</h3>
<pre><code>Subject: Urgent: Appeal for Disabled Claude Account [你的注册邮箱]

Dear Anthropic Support Team,

I am writing to respectfully request a review of my account (Email: [你的注册邮箱]), which was recently disabled.

I use Claude Pro/Team primarily for software engineering and academic research. As an international developer who frequently travels for business, I suspect that accessing my account while travelling across different regional networks (e.g. hotel Wi-Fi and corporate roaming proxies) may have triggered an automated security flag.

I confirm that my usage strictly complies with Anthropic's Terms of Service and Usage Policies. I do not engage in any automated scraping, resale, or unauthorized proxying.

Could you please review my account activity and assist in restoring access? I am happy to provide any verification details necessary.

Thank you for your time and assistance.

Best regards,
[你的姓名/拼音]
[联系电话/公司或项目域名]</code></pre>

<h2>三、 扣款争议与退款处理流程</h2>
<p>如果刚充值 Claude Pro / Team 即遭遇封号：</p>

<ol>
  <li>优先发送上述英文申诉邮件申请解封。</li>
  <li>若 5 个工作日内未获回复，可在 Stripe 发送的扣款收据邮件中点击 Support 申请退款。</li>
  <li>联系虚拟卡卡组织发起未提供服务（Service Non-Delivery）扣款申诉。</li>
</ol>
`,
};
