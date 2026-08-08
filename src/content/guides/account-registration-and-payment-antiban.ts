export const account_registration_and_payment_antiban_content = {
  en: `
<h2>1. Phone Verification & Service Provider Traps</h2>
<p>Anthropic enforces phone verification upon registration and suspicious login. Virtual VoIP numbers (Google Voice, TextNow, Skype) are strictly blocked:</p>

<ul>
  <li><strong>Use Real Physical SIM Services:</strong> Choose verification platforms that provide real physical carrier SIMs from US, UK, SG, or JP.</li>
  <li><strong>Avoid Shared Public Pool Numbers:</strong> Numbers that have been used to register dozens of Claude or ChatGPT accounts are flagged; reusing them can link your new account to previously banned entities.</li>
  <li><strong>Enable 2FA Authenticator Immediately:</strong> After signing up, bind TOTP 2FA (Google Authenticator, 1Password) to prevent re-verification prompts on new IP connections.</li>
</ul>

<h2>2. Virtual Credit Card BINs & Billing Address Matching</h2>
<p>Payment rejections and "Refunded / Suspended" subscription status are frequently caused by credit card BIN risk filters:</p>

<ul>
  <li><strong>High-Pass BIN Categories:</strong> Prefer US visa/mastercard debit/credit BINs issued by established US fintech banks (e.g. 485932, 532959, 428803). Avoid prepaid cards with over-issued BINs.</li>
  <li><strong>Strict Address Alignment:</strong> Fill out the billing address using a real address matching the state and zip code of your current proxy IP exit.</li>
  <li><strong>Sufficient Card Balance:</strong> Ensure your card balance has at least $25 USD before binding to prevent initial $1 pre-authorization temporary hold failures.</li>
</ul>

<h2>3. Preventing Account Association Bans</h2>
<p>Anthropic links accounts using <code>organizationUuid</code>, shared payment cards, and machine environments:</p>

<pre><code># Check local Claude Code organization UUID grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>Never bind the same credit card to more than 2 Claude Pro / Team accounts.</li>
  <li>Never use the same phone number across multiple commercial accounts.</li>
  <li>Avoid running parallel heavy sessions under the same <code>organizationUuid</code> across different machines.</li>
</ul>
`,
  zh: `
<h2>一、 手机号接码与号段避坑</h2>
<p>Anthropic 注册和异地登录风控触发时都需要手机验证，虚拟 VoIP 号码（如 Google Voice、TextNow）已被全面封禁：</p>

<ul>
  <li><strong>选择实体卡接码服务：</strong> 优先选择使用真实本地运营商实体卡的美国、英国、新加坡或日本卡号。</li>
  <li><strong>避开公共共享池号段：</strong> 被反复接码 ChatGPT 或 Claude 的卡号号段会被系统标记，新注册账号易被关联封锁。</li>
  <li><strong>立即绑定 2FA 身份验证器：</strong> 注册成功后第一时间绑定 TOTP 双重验证（Google Authenticator、1Password），避免更换 IP 时重新触发手机短信验证。</li>
</ul>

<h2>二、 虚拟信用卡 BIN 选择与账单地址对齐</h2>
<p>订阅 Claude Pro / Team 被拒绝或扣款后遭遇 "Refunded / Suspended" 退款封号，大多是因为卡头（BIN）风控或账单不匹配：</p>

<ul>
  <li><strong>挑选高通过率 BIN 卡头：</strong> 优先使用由美国/企业正规银行发行的 Visa/Mastercard 卡头（如 485932、532959、428803 等），避开滥用严重的大众预付卡段。</li>
  <li><strong>账单地址对齐 IP 归属地：</strong> 填写的账单地址（Billing Address）尽量使用真实美国/支持国地址，且邮编（Zip Code）与州（State）需与当前出口 IP 一致。</li>
  <li><strong>卡内预留充足余额：</strong> 绑卡前确保卡内至少有 25 美元额度，避免 1 美元预扣款验证失败或扣款扣失败触发即时风控。</li>
</ul>

<h2>三、 避免账号关联批量连带封号</h2>
<p>Anthropic 会通过 <code>organizationUuid</code>、同卡号以及同机环境进行账号关联打标：</p>

<pre><code># 查询本地 Claude Code 配置中的组织 UUID 归属
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>切勿将同一张信用卡绑定超过 2 个以上的 Claude Pro / Team 账号。</li>
  <li>切勿在多个商业账号间复用同一个接码手机号。</li>
  <li>避免在同一台机器的不同 Profile 间频繁切换同卡账号，防止组织 UUID 共享配额池与风控传染。</li>
</ul>
`,
};
