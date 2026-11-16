export const payment_methods_comparison_content = {
  en: `
<p>This guide covers what Claude billing accepts, what Anthropic's decline checklist says, and where card risk comes from. Earlier versions listed "success rates" and "high-success BINs". Those figures had no source and have been removed: Anthropic does not publish which cards or BINs it blocks.</p>

<h2>1. What Claude accepts</h2>
<ul>
  <li><strong>Pro and Max on the web:</strong> credit or debit cards only. PayPal, Venmo, and other third-party payment processors are not accepted.</li>
  <li><strong>Team plan:</strong> credit, debit, or prepaid cards. ACH bank transfers are not accepted.</li>
  <li><strong>App Store and Google Play:</strong> if you subscribe in the iOS or Android app, the store handles payment, invoices, and cancellation, and Apple or Google decides which payment methods are available.</li>
  <li><strong>Tax:</strong> calculated from the billing address, which is taken from the payment method's address.</li>
</ul>

<h2>2. Card type and risk</h2>
<p>Anthropic's decline article states that it does not receive the issuing bank's reason for a decline, and no official page lists blocked card types or BINs. Treat any BIN list or success-rate table from other sites as unverified.</p>
<ul>
  <li><strong>What the official pages support:</strong> Pro and Max list credit and debit cards. Prepaid cards are listed only for the Team plan, so a prepaid card on Pro or Max can be declined for that reason alone.</li>
  <li><strong>What field reports suggest:</strong> some reports describe a ban after paying with a virtual card, and a stable account paying with a bank-issued US credit card. These are individual cases, not a rule. See the <a href="/news/#community-posts">community field reports</a>.</li>
  <li><strong>Cards sold by third parties:</strong> you cannot know who else uses the card, whether the issuer will freeze it, or whether the balance will still cover the next renewal. There is no recourse if the card is declined or reversed.</li>
  <li><strong>Crypto-funded cards:</strong> these are usually prepaid, so the Pro and Max limitation above applies.</li>
</ul>

<h2>3. Why a payment fails</h2>
<p>Anthropic's checklist, in the order it gives it:</p>
<ol>
  <li><strong>Billing location:</strong> the billing address and the card's country of origin must be an eligible billing location, and the billing address must match the origin country.</li>
  <li><strong>Billing address:</strong> it must match the address your bank has on file. A missing accent or a misspelled street name can cause a decline.</li>
  <li><strong>3D Secure:</strong> complete the one-time password or banking-app confirmation when your bank asks for it.</li>
  <li><strong>Accepted method:</strong> use a credit or debit card, not PayPal or Venmo.</li>
  <li><strong>Funds:</strong> the balance must cover the full amount.</li>
  <li><strong>Retry:</strong> try another card, or the same card later, because temporary network problems also cause declines.</li>
  <li><strong>Ask your bank:</strong> only the issuer can say why it declined the charge.</li>
</ol>

<h2>4. Subscribing through the App Store or Google Play</h2>
<p>Store subscriptions use the store's payment methods and billing, and Anthropic does not issue the invoice. For App Store purchases Apple handles refunds; for Google Play, contact Claude Support. Some field reports recommend this route as a refund fallback. Anthropic does not document whether it changes account risk.</p>

<h2>5. Renewals, refunds, and chargebacks</h2>
<ul>
  <li><strong>Failed renewal:</strong> if the payment method fails, the account can drop to the Free plan. Check Settings &gt; Billing for the payment status and update the card there.</li>
  <li><strong>Refunds:</strong> payments are generally non-refundable unless the Consumer Terms or local law say otherwise. Outside Europe, request a refund in the app under Get help &gt; Claude Refund Request.</li>
  <li><strong>Chargebacks:</strong> Anthropic has not published how a bank dispute affects an account. Use the refund request first, and keep the receipt emails ("Your receipt from Anthropic") in case you need them later.</li>
</ul>

<h2>6. Checklist before you subscribe</h2>
<pre><code>1. A credit or debit card issued by a bank, held in your own name
2. The billing country is an eligible billing location (check the Help Center)
3. The billing address matches your bank's record character for character
4. The card supports 3D Secure and you can receive the code
5. The balance covers the first charge and the next renewal
6. The card is not shared with other Claude accounts
7. Keep the receipt emails</code></pre>
`,
  zh: `
<p>本文说明 Claude 账单接受哪些支付方式、Anthropic 官方的扣款失败排查清单，以及银行卡风险来自哪里。旧版本列出的「成功率」和「高成功率 BIN」没有来源，已经删除：Anthropic 并未公布会拦截哪些银行卡或 BIN。</p>

<h2>一、Claude 接受哪些支付方式</h2>
<ul>
  <li><strong>网页端 Pro 与 Max：</strong>只接受信用卡或借记卡。不接受 PayPal、Venmo 等第三方支付处理商。</li>
  <li><strong>Team 计划：</strong>接受信用卡、借记卡或预付卡，不接受 ACH 银行转账。</li>
  <li><strong>App Store 与 Google Play：</strong>在 iOS 或 Android 应用内订阅时，由应用商店负责扣款、发票和取消，可用的支付方式由 Apple 或 Google 决定。</li>
  <li><strong>税费：</strong>根据账单地址计算，账单地址取自支付方式上的地址。</li>
</ul>

<h2>二、卡类型与风险</h2>
<p>官方的扣款失败文章说明，Anthropic 收不到发卡行拒绝的具体原因，也没有任何官方页面列出被拦截的卡类型或 BIN。其他网站上的 BIN 列表或成功率表格都应视为未经验证。</p>
<ul>
  <li><strong>官方页面能支持的结论：</strong>Pro 与 Max 列出的是信用卡和借记卡。预付卡只在 Team 计划中列出，所以在 Pro 或 Max 上，预付卡可能仅因类型而被拒。</li>
  <li><strong>实战反馈的信号：</strong>有反馈称用虚拟卡付款后被封，也有账号用银行发行的美国信用卡长期稳定使用。这些是个案，不是规则。参见<a href="/zh/news/#community-posts">社区实战帖</a>。</li>
  <li><strong>第三方出售的卡：</strong>你无法确定还有谁在用这张卡、发卡方是否会冻结它，也无法确定余额是否足够支付下一次续费。卡被拒或被撤销后没有追索渠道。</li>
  <li><strong>加密货币充值的卡：</strong>通常是预付卡，上述 Pro 与 Max 的限制同样适用。</li>
</ul>

<h2>三、扣款失败的原因</h2>
<p>官方排查清单，按官方给出的顺序：</p>
<ol>
  <li><strong>账单地区：</strong>账单地址与银行卡发卡地区必须属于受支持的账单地区，且账单地址要与发卡地区一致。</li>
  <li><strong>账单地址：</strong>必须与银行预留的地址一致。少一个重音符号或街道名拼错，都可能导致拒付。</li>
  <li><strong>3D Secure：</strong>银行要求时，完成短信验证码或银行 App 确认。</li>
  <li><strong>支付方式：</strong>使用信用卡或借记卡，不要用 PayPal、Venmo。</li>
  <li><strong>余额：</strong>余额要覆盖全部金额。</li>
  <li><strong>重试：</strong>换一张卡，或稍后再试，因为临时的网络问题也会导致拒付。</li>
  <li><strong>询问银行：</strong>只有发卡行能说明拒绝的原因。</li>
</ol>

<h2>四、通过 App Store 或 Google Play 订阅</h2>
<p>应用商店订阅使用商店的支付方式和账单，Anthropic 不开具发票。App Store 的退款由 Apple 处理；Google Play 的订阅请联系 Claude 支持团队。有实战帖建议把这条路径当作退款退路。Anthropic 没有说明它是否会影响账号风险。</p>

<h2>五、续费、退款与拒付</h2>
<ul>
  <li><strong>续费失败：</strong>支付方式失败时，账号可能降级为 Free 计划。到 Settings &gt; Billing 查看付款状态并在那里更新银行卡。</li>
  <li><strong>退款：</strong>付款通常不可退款，除非消费者服务条款或当地法律另有规定。欧洲以外的用户可在应用内通过 Get help &gt; Claude Refund Request 申请退款。</li>
  <li><strong>拒付（chargeback）：</strong>Anthropic 没有公布银行争议对账号的影响。先走退款申请流程，并保留收据邮件（主题为「Your receipt from Anthropic」），以备后续需要。</li>
</ul>

<h2>六、订阅前检查清单</h2>
<pre><code>1. 银行发行的信用卡或借记卡，持卡人是你本人
2. 账单所在地区属于受支持的账单地区（以帮助中心为准）
3. 账单地址与银行记录逐字符一致
4. 银行卡支持 3D Secure，并且你能收到验证码
5. 余额覆盖首次扣款和下一次续费
6. 这张卡没有被其他 Claude 账号共用
7. 保留收据邮件</code></pre>
`,
};
