export const account_registration_and_payment_antiban_content = {
  en: `
<h2>1. Phone Verification & Service Provider Selection</h2>
<p>Anthropic requires phone verification during initial registration and again when login patterns look unusual—new IP ranges, unfamiliar devices, or rapid geographic shifts. The goal is not to "trick" the system but to present a consistent, verifiable identity that matches your declared account region. Virtual VoIP numbers (Google Voice, TextNow, Skype, most SMS-receiving websites) are widely blocked because they are cheap, reusable, and heavily abused.</p>

<p>Decide your account region (US, UK, SG, JP) before registering. Your phone number should plausibly belong to that region for the life of the account.</p>

<h3>Physical SIM vs Shared Pool Numbers</h3>
<table>
  <thead>
    <tr>
      <th>Verification Method</th>
      <th>Typical Pass Rate</th>
      <th>Association Risk</th>
      <th>Best For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Personal physical SIM (US/UK/SG/JP)</td>
      <td>Highest</td>
      <td>Low if used for one account</td>
      <td>Long-term Pro / Team subscriptions</td>
    </tr>
    <tr>
      <td>Paid one-time SMS rental (dedicated number)</td>
      <td>Medium–High</td>
      <td>Medium if number was recycled</td>
      <td>Single account, immediate registration</td>
    </tr>
    <tr>
      <td>Shared public SMS pool</td>
      <td>Low</td>
      <td>Very high</td>
      <td>Avoid for Claude</td>
    </tr>
    <tr>
      <td>VoIP / Google Voice</td>
      <td>Near zero</td>
      <td>High</td>
      <td>Do not use</td>
    </tr>
  </tbody>
</table>

<ul>
  <li><strong>Use real carrier SIMs when possible:</strong> A number issued by AT&T, T-Mobile, EE, Singtel, or NTT SoftBank reads as a legitimate regional identity. Temporary rental services can work if the number is fresh and not listed on public "free SMS" sites.</li>
  <li><strong>Avoid shared public pool numbers:</strong> Numbers that have registered dozens of Claude or ChatGPT accounts are often flagged. Reusing them can link your new account to previously banned entities.</li>
  <li><strong>Enable TOTP 2FA immediately after signup:</strong> Bind Google Authenticator, 1Password, or Authy before your first IP or device change. This reduces repeated SMS prompts and lowers the chance of losing access during travel or proxy rotation.</li>
  <li><strong>Keep the number active:</strong> If your SIM expires or the rental ends, recovery flows may fail. Store backup codes in a password manager.</li>
</ul>

<h2>2. Virtual Credit Card BINs & Billing Address Alignment</h2>
<p>Payment rejections, instant refunds, and "Refunded / Suspended" subscription status are frequently caused by card BIN risk filters and billing mismatches—not because Anthropic "hates" international users, but because fraud models score mismatched signals heavily. Align your payment profile with your account region and current network exit to reduce false positives.</p>

<p>For a deeper platform-by-platform breakdown, see our <a href="/guides/payment-methods-comparison/">Virtual Card Platforms & Payment Methods Comparison</a>. For region-specific registration context, read the <a href="/guides/regional-access-strategy/">Regional Access Strategies guide</a>.</p>

<h3>Card Type & BIN Risk Overview</h3>
<table>
  <thead>
    <tr>
      <th>Card Category</th>
      <th>Typical Risk Score</th>
      <th>Claude Binding Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>US bank-issued credit (Visa/MC)</td>
      <td>Low</td>
      <td>Best for first Pro subscription; stable renewals</td>
    </tr>
    <tr>
      <td>US fintech debit (Chime-class issuers)</td>
      <td>Low–Medium</td>
      <td>Verify BIN is not over-issued; keep $25+ balance</td>
    </tr>
    <tr>
      <td>International debit from supported country</td>
      <td>Medium</td>
      <td>Billing country must match account region</td>
    </tr>
    <tr>
      <td>Mass-market prepaid / crypto-funded prepaid</td>
      <td>High</td>
      <td>Frequent instant refund; avoid for primary billing</td>
    </tr>
  </tbody>
</table>

<ul>
  <li><strong>Prefer established US Visa/Mastercard BINs:</strong> Examples often cited in community reports include 485932, 532959, and 428803—always verify current status before binding, as issuers change risk tiers over time.</li>
  <li><strong>Strict address alignment:</strong> Use a real billing address whose state and ZIP code match your proxy or VPN exit region. A California IP with a Texas billing address triggers mismatches even when the card itself is valid.</li>
  <li><strong>Sufficient balance before binding:</strong> Anthropic may run a small pre-authorization (often around $1). Ensure at least $25 USD available so the hold and first monthly charge both succeed.</li>
  <li><strong>One card, one primary identity:</strong> Do not rotate cards weekly on the same account. Stable payment instruments build trust; chaotic changes look like account takeover.</li>
</ul>

<h3>Registration Day Checklist</h3>
<ol>
  <li>Clean browser profile aligned with target region (see <a href="/guides/environment-cleanup-and-ip-setup/">Environment Cleanup guide</a>).</li>
  <li>Residential IP from the same country as billing address (see <a href="/guides/vpn-and-proxy-selection/">VPN & Proxy Selection</a>).</li>
  <li>Fresh or dedicated phone number—not from a public SMS pool.</li>
  <li>Virtual or physical card with low-risk BIN and matching billing ZIP.</li>
  <li>Enable 2FA and download backup codes before closing the session.</li>
</ol>

<h2>3. Preventing Account Association & Chain Bans</h2>
<p>Anthropic links accounts through shared payment instruments, phone numbers, device fingerprints, and organizational identifiers used by Claude Code. Understanding these link vectors helps you avoid accidental batch suspensions when managing multiple seats for a team or studio.</p>

<p>The <a href="/guides/claude-steganography-and-risk-model/">Claude Steganography & Risk Model guide</a> explains how IP, timezone, BIN, and usage patterns combine into risk scores. For operational separation, follow <a href="/guides/multi-account-management/">Multi-Account Management Best Practices</a>.</p>

<pre><code># Check local Claude Code organization UUID grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li><strong>Limit card reuse:</strong> Never bind the same credit card to more than two Claude Pro or Team accounts unless Anthropic explicitly allows it under your contract. Shared cards are the fastest path to chain bans.</li>
  <li><strong>One phone per commercial account:</strong> Reusing verification numbers across accounts creates a hard link even if payment and IP differ.</li>
  <li><strong>Isolate machine environments:</strong> Avoid running parallel heavy sessions under the same <code>organizationUuid</code> across different machines without understanding quota pooling. Separate browser profiles and IPs per account (see <a href="/guides/browser-configuration-guide/">Browser Configuration Guide</a>).</li>
  <li><strong>Do not "warm up" banned identities:</strong> Registering a new account immediately after a suspension on the same card, phone, and device often fails within hours.</li>
</ul>

<h3>What NOT to Do</h3>
<ul>
  <li>Do not use chargebacks to dispute legitimate Pro charges—you will lose both payment access and the account.</li>
  <li>Do not buy "pre-made" Claude accounts from marketplaces; they carry inherited bans and stolen payment links.</li>
  <li>Do not register from a datacenter IP and bind a US card with a mismatched billing country on the same session.</li>
  <li>Do not disable 2FA to "simplify" logins; it increases SMS re-verification triggers on new IPs.</li>
</ul>

<h2>FAQ</h2>

<h3>Why did my subscription show "Refunded" immediately after payment?</h3>
<p>Usually the payment processor reversed the charge due to BIN risk, AVS (address verification) failure, or velocity limits on the card. Fix billing address alignment, try a different low-risk BIN, and ensure your IP region matches before retrying. Wait 24–48 hours between attempts on the same account.</p>

<h3>Can I use the same Google Voice number I use for other services?</h3>
<p>No. VoIP numbers are blocked at verification time in most cases. Use a carrier-issued mobile number or a dedicated rental that is not publicly indexed.</p>

<h3>How many Claude accounts can share one office IP?</h3>
<p>There is no published limit, but many simultaneous logins from one residential IP with different cards can still trigger reviews. Prefer one account per isolated browser profile and stagger heavy usage. See <a href="/guides/multi-account-management/">multi-account management</a> for studio setups.</p>

<h3>Should I register before or after setting up my proxy?</h3>
<p>After. Complete environment and IP alignment first (<a href="/guides/device-setup-guide/">Device Setup Guide</a>), then register, verify phone, bind payment, and enable 2FA in a single consistent session without switching regions mid-flow.</p>

<h3>My card works on other SaaS sites but fails on Claude—why?</h3>
<p>Anthropic uses stricter fraud rules than many merchants. Prepaid BINs, billing country mismatches, and cards previously associated with refunded Claude charges are common causes. Consult the <a href="/guides/payment-methods-comparison/">payment methods comparison</a> for issuer-specific notes.</p>
`,
  zh: `
<h2>一、手机号验证与接码服务商选择</h2>
<p>Anthropic 在首次注册、异地登录或设备/IP 变动时都会触发手机验证。验证的目的不是「绕过系统」，而是让账号呈现与所选地区一致、可核查的身份信息。Google Voice、TextNow、Skype 以及多数免费接码平台的 VoIP 号段已被大规模拦截——这类号码成本低、可重复使用、滥用率高，风控模型会直接拒绝。</p>

<p>注册前先确定账号归属地区（美、英、新、日等）。手机号应在整个订阅周期内都能合理解释为该地区的长期号码。</p>

<h3>实体 SIM 与公共号池对比</h3>
<table>
  <thead>
    <tr>
      <th>验证方式</th>
      <th>通过率</th>
      <th>关联封号风险</th>
      <th>适用场景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>个人实体 SIM（美/英/新/日）</td>
      <td>最高</td>
      <td>单账号使用时低</td>
      <td>长期 Pro / Team 订阅</td>
    </tr>
    <tr>
      <td>付费一次性接码（独占号码）</td>
      <td>中高</td>
      <td>号码被回收时中等</td>
      <td>单账号即时注册</td>
    </tr>
    <tr>
      <td>公共共享接码池</td>
      <td>低</td>
      <td>极高</td>
      <td>不建议用于 Claude</td>
    </tr>
    <tr>
      <td>VoIP / Google Voice</td>
      <td>接近零</td>
      <td>高</td>
      <td>请勿使用</td>
    </tr>
  </tbody>
</table>

<ul>
  <li><strong>优先使用运营商实体卡：</strong> AT&T、T-Mobile、EE、Singtel、SoftBank 等正规运营商号码更容易通过验证。若使用临时接码，需确认号码未被公开列在免费接码网站。</li>
  <li><strong>避开公共共享池：</strong> 已被大量用于 ChatGPT 或 Claude 注册的号段会被标记，新账号可能立刻与历史封禁账号产生关联。</li>
  <li><strong>注册后立即绑定 TOTP 2FA：</strong> 使用 Google Authenticator、1Password 或 Authy，在首次更换 IP 或设备前完成绑定，可显著减少反复短信验证。</li>
  <li><strong>保持号码有效：</strong> SIM 停机或接码租约到期会导致找回流程失败，务必将备份恢复码存入密码管理器。</li>
</ul>

<h2>二、虚拟信用卡 BIN 与账单地址对齐</h2>
<p>订阅被拒、扣款后立即 Refunded / Suspended，多数源于卡头（BIN）风控或账单信息不一致——并非平台针对国际用户，而是欺诈模型对「信号不匹配」打分极高。将支付资料与账号地区、当前网络出口对齐，可有效降低误杀概率。</p>

<p>各虚拟卡平台差异详见 <a href="/zh/guides/payment-methods-comparison/">虚拟卡平台与支付方式对比</a>；地区注册策略见 <a href="/zh/guides/regional-access-strategy/">全球地区访问与注册指引</a>。</p>

<h3>卡种与 BIN 风险概览</h3>
<table>
  <thead>
    <tr>
      <th>卡种</th>
      <th>典型风险等级</th>
      <th>Claude 绑卡建议</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>美国银行发行信用卡（Visa/MC）</td>
      <td>低</td>
      <td>首次 Pro 订阅首选，续费稳定</td>
    </tr>
    <tr>
      <td>美国金融科技借记卡</td>
      <td>低–中</td>
      <td>确认 BIN 未被过度发放；余额预留 25 美元以上</td>
    </tr>
    <tr>
      <td>支持国家的国际借记卡</td>
      <td>中</td>
      <td>账单国家须与账号地区一致</td>
    </tr>
    <tr>
      <td>大众预付卡 / 加密货币充值预付卡</td>
      <td>高</td>
      <td>易 instant refund，勿作主卡</td>
    </tr>
  </tbody>
</table>

<ul>
  <li><strong>优先选用成熟美国 Visa/Mastercard BIN：</strong> 社区常提及 485932、532959、428803 等，绑卡前请自行核实当前通过率，issuer 风险等级会随时间调整。</li>
  <li><strong>账单地址严格对齐：</strong> 州（State）与邮编（ZIP）须与代理出口 IP 归属地一致。加州 IP 配德州账单即使卡有效也会触发 AVS 不匹配。</li>
  <li><strong>绑卡前预留充足余额：</strong> 平台可能预授权约 1 美元，建议卡内至少 25 美元，避免预扣与首月扣款任一失败。</li>
  <li><strong>支付工具保持稳定：</strong> 同一账号勿每周换卡，频繁变更类似账号被盗，反而提高审查概率。</li>
</ul>

<h3>注册当日检查清单</h3>
<ol>
  <li>浏览器 Profile 已与目标地区对齐（见 <a href="/zh/guides/environment-cleanup-and-ip-setup/">环境纯化与 IP 配置</a>）。</li>
  <li>住宅 IP 与账单国家一致（见 <a href="/zh/guides/vpn-and-proxy-selection/">VPN 与代理选择</a>）。</li>
  <li>使用全新或独占手机号，非公共接码池。</li>
  <li>低风控 BIN 虚拟卡或实体卡，账单 ZIP 匹配。</li>
  <li>启用 2FA 并下载备份码后再结束会话。</li>
</ol>

<h2>三、避免账号关联与批量连带封号</h2>
<p>Anthropic 通过共享支付卡、手机号、设备指纹及 Claude Code 的 <code>organizationUuid</code> 等维度关联账号。理解这些链路可避免团队多席位或工作室场景下的误关联批量封禁。</p>

<p>四维风控逻辑详见 <a href="/zh/guides/claude-steganography-and-risk-model/">Claude Code 隐写与风控模型</a>；多账号运维见 <a href="/zh/guides/multi-account-management/">多账号管理最佳实践</a>。</p>

<pre><code># 查询本地 Claude Code 配置中的组织 UUID 归属
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li><strong>限制同卡绑定数量：</strong> 除非合同另有约定，同一张信用卡不宜绑定超过两个 Claude Pro / Team 账号，同卡是最快的连带封号路径。</li>
  <li><strong>商业账号勿共用手机号：</strong> 即便 IP 与支付不同，重复验证号码仍构成硬关联。</li>
  <li><strong>隔离机器环境：</strong> 勿在同一 <code>organizationUuid</code> 下于多台机器并行重度会话而不了解配额池规则。每账号独立 Profile 与 IP（见 <a href="/zh/guides/browser-configuration-guide/">浏览器配置手册</a>）。</li>
  <li><strong>勿在封禁后立即「换新皮」：</strong> 同卡、同号、同设备刚被封又注册，多数在数小时内再次失效。</li>
</ul>

<h3>切勿操作</h3>
<ul>
  <li>勿对正常 Pro 扣款发起 chargeback，将同时失去支付通道与账号。</li>
  <li>勿购买二手 Claude 账号，常携带历史封禁与盗绑支付信息。</li>
  <li>勿在机房 IP 下注册并绑定账单国家不一致的美国卡。</li>
  <li>为图省事关闭 2FA 会增加新 IP 登录时的短信重验证。</li>
</ul>

<h2>常见问题</h2>

<h3>扣款成功后为何立刻显示 Refunded？</h3>
<p>多为 BIN 风险、AVS 地址验证失败或同卡短时多次尝试导致自动退款。修正账单对齐、更换低风险 BIN，确保 IP 地区匹配；同一账号建议间隔 24–48 小时再试。</p>

<h3>应先注册还是先配代理？</h3>
<p>先配环境。完成 IP 与系统对齐（<a href="/zh/guides/device-setup-guide/">跨平台设备配置</a>）后，在同一会话、同一地区内完成注册、验证、绑卡与 2FA，中途勿切换地区。</p>

<h3>其他 SaaS 能扣款为何 Claude 失败？</h3>
<p>Claude 风控更严。预付 BIN、账单国别不符、曾与退款记录关联的卡是常见原因，详见 <a href="/zh/guides/payment-methods-comparison/">支付方式对比</a>。</p>
`,
};
