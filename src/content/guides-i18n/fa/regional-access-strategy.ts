export const content = `
<h2>1. مناطق پشتیبانی‌شده در برابر محدود Anthropic</h2>
<p>Anthropic صریحاً دسترسی Claude از برخی مناطق را محدود می‌کند. برای انتخاب استراتژی ثبت‌نام و استفادهٔ منطبق با قوانین، طبقه‌بندی را درک کنید:</p>

<h3>طبقه‌بندی منطقه</h3>
<table>
  <thead>
    <tr>
      <th>دسته</th>
      <th>مناطق</th>
      <th>وضعیت دسترسی</th>
      <th>استراتژی</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>کاملاً پشتیبانی‌شده</strong></td>
      <td>مثلاً US، UK، کانادا، استرالیا، نیوزیلند، سنگاپور، ژاپن، تایوان، هند، برزیل. <a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">فهرست کامل مناطق پشتیبانی‌شده</a> را ببینید</td>
      <td>در فهرست Supported Regions (API و Claude.ai)</td>
      <td>ثبت‌نام مستقیم با IP محلی</td>
    </tr>
    <tr>
      <td><strong>EU/EEA</strong></td>
      <td>آلمان، فرانسه، هلند و غیره</td>
      <td>پشتیبانی با انطباق GDPR</td>
      <td>IP اتحادیه اروپا، رضایت به پردازش داده</td>
    </tr>
    <tr>
      <td><strong>محدود</strong></td>
      <td>چین (سرزمین اصلی)، هنگ‌کنگ، ماکائو، روسیه، ایران، کرهٔ شمالی، کوبا</td>
      <td>در فهرست Supported Regions نیست؛ ایجاد حساب از موقعیت پشتیبانی‌نشده یکی از دلایل رسمی مسدودسازی است</td>
      <td>IP مسکونی منطقهٔ پشتیبانی‌شده، هم‌راستاسازی صورتحساب/تلفن. IP خروج منطقهٔ پشتیبانی‌شده حساب را واجد شرایط نمی‌کند، و کاربران هنگ‌کنگ از ۱ اکتبر ۲۰۲۶ تعلیق را گزارش کرده‌اند</td>
    </tr>
  </tbody>
</table>

<h3>روش‌های تشخیص منطقه</h3>
<p>Anthropic مستند نکرده چگونه منطقهٔ شما را تعیین می‌کند. این‌ها سیگنال‌هایی‌اند که در گزارش‌های جامعه اغلب مطرح می‌شوند، نه قوانین تأییدشده:</p>
<ul>
  <li><strong>ژئولوکیشن IP:</strong> به‌طور گسترده فرض می‌شود سیگنال اصلی باشد</li>
  <li><strong>کشور کارت پرداخت:</strong> آدرس صورتحساب باید با کشور مبدأ کارت یکی باشد (الزام رسمی)</li>
  <li><strong>پیش‌شمارهٔ تلفن:</strong> شمارهٔ تأیید SMS موقعیت محتمل را نشان می‌دهد</li>
  <li><strong>آدرس صورتحساب:</strong> باید مکان صورتحساب واجد شرایط باشد (الزام رسمی)</li>
</ul>

<h2>2. بهترین‌عمل‌های ثبت‌نام US/UK/SG</h2>
<p>سه منطقهٔ پشتیبانی‌شدهٔ پرکاربرد. IP، منطقهٔ زمانی، تلفن و جزئیات صورتحساب را با منطقه‌ای که انتخاب می‌کنید یکسان نگه دارید:</p>

<h3>ثبت‌نام ایالات متحده</h3>
<pre><code># Optimal Configuration for US Registration
Proxy IP: US residential (Comcast, AT&T, Verizon ASNs)
Timezone: America/New_York or America/Los_Angeles
Phone: Real US carrier SIM (+1 area codes: 212, 310, 415, etc.)
Card: US-issued credit or debit card with US billing address
Billing Address: Real US residential address matching IP state

# Verification Script
curl https://ipinfo.io | jq '{ip, city, region, country, org}'
# Ensure country="US", org shows ISP not datacenter</code></pre>

<h3>ثبت‌نام بریتانیا</h3>
<pre><code># UK-Specific Configuration
Proxy IP: UK residential (BT, Virgin Media, Sky ASNs)
Timezone: Europe/London
Phone: Real UK carrier SIM (+44)
Card: UK or EU-issued credit or debit card
Billing Address: Real UK address with valid postcode

# UK Address Validation
# Use Royal Mail Postcode Finder to verify address legitimacy</code></pre>

<h3>ثبت‌نام سنگاپور</h3>
<pre><code># Singapore Configuration
Proxy IP: Singapore residential (Singtel, StarHub, M1 ASNs)
Timezone: Asia/Singapore
Phone: Singapore carrier SIM (+65)
Card: Singapore or international card accepted in SG
Billing Address: Real Singapore address with postal code

# Note: Singapore is on the Supported Regions list</code></pre>

<h2>3. انطباق GDPR اتحادیه اروپا و حاکمیت داده</h2>
<p>کاربران اتحادیه اروپا با الزامات رضایت اضافی GDPR روبروند. Anthropic باید مقررات پردازش داده را رعایت کند:</p>

<h3>چک‌لیست رضایت GDPR</h3>
<ul>
  <li>هنگام ثبت‌نام سیاست حریم خصوصی منطبق با GDPR Anthropic را بپذیرید</li>
  <li>محل پردازش داده را تأیید کنید (Anthropic از AWS مستقر در US با تضمین‌های انتقال دادهٔ EU استفاده می‌کند)</li>
  <li>در صورت نیاز از کنسول Anthropic درخواست export داده دهید (مادهٔ ۲۰ GDPR)</li>
  <li>با تماس با پشتیبانی حق حذف را اعمال کنید (مادهٔ ۱۷ GDPR)</li>
</ul>

<h3>عوامل ریسک مخصوص EU</h3>
<ul>
  <li>برخی بانک‌های EU اشتراک مبتنی بر US را رد می‌کنند، از کارت مجازی ارائه‌دهندگان بین‌المللی استفاده کنید</li>
  <li>Strong Customer Authentication (SCA) ممکن است 3D Secure بخواهد، مطمئن شوید کارت پشتیبانی می‌کند</li>
  <li>VAT بر اساس کشور آدرس صورتحساب خودکار اعمال می‌شود</li>
</ul>

<h2>4. راهنمای انطباق سفر کاری فرامرزی</h2>
<p>موارد استفادهٔ مشروع برای دسترسی به Claude در سفر وجود دارد. پیکربندی را طوری بچینید که تحت بررسی دوام بیاورد:</p>

<h3>راه‌اندازی سناریوی سفر منطبق</h3>
<pre><code># Before international travel:
1. Enable 2FA on Claude account (Google Authenticator)
2. Notify payment card issuer of travel dates
3. Bring documentation proving business travel (conference tickets, etc.)
4. Use hotel/office WiFi rather than public hotspots
5. If using VPN, choose exit IP in your account's home region

# During travel access:
# Document business purpose in case of appeal:
# - Conference attendance
# - Client meetings
# - Remote work for US/UK employer</code></pre>

<h3>الگوی درخواست تجدیدنظر برای مسدودسازی مرتبط با سفر</h3>
<pre><code>Subject: Account Access Issue During Business Travel

Dear Anthropic Support,

I am a Claude Pro subscriber (email: your@email.com) and my account 
was restricted while I was traveling for business to [Country].

I am a [Your Country] resident and citizen, and registered my account 
while physically located in [Home Country]. I am currently traveling 
for work and need continued access to Claude for my professional duties.

Attached is documentation of my business travel: [conference ticket, 
work visa, employer letter, etc.]

I maintain 2FA on my account and am accessing from secure networks. 
Please restore access to my account.

Thank you,
[Your Name]</code></pre>
`;
