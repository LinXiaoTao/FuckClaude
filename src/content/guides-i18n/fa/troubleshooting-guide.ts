export const content = `
<h2>1. تشخیص خطای ورود (403/429/500)</h2>
<p>شکست ورود معمولاً بر اساس کد وضعیت HTTP و پیام خطا به علت ریشه‌ای مشخصی نگاشت می‌شود:</p>

<h3>ماتریس کد خطا</h3>
<table>
  <thead>
    <tr>
      <th>کد وضعیت</th>
      <th>پیام خطا</th>
      <th>علت ریشه‌ای</th>
      <th>راه‌حل</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>403 Forbidden</strong></td>
      <td>"Access denied"</td>
      <td>IP مسدود یا IP دیتاسنتر پرریسک</td>
      <td>به پروکسی مسکونی بروید، کوکی‌ها را پاک کنید، پس از 1 ساعت دوباره تلاش کنید</td>
    </tr>
    <tr>
      <td><strong>429 Too Many Requests</strong></td>
      <td>"Rate limit exceeded"</td>
      <td>تعداد تلاش ورود یا سقف نرخ API بیش از حد</td>
      <td>15 دقیقه صبر کنید، backoff نمایی اعمال کنید</td>
    </tr>
    <tr>
      <td><strong>500 Internal Server Error</strong></td>
      <td>"Something went wrong"</td>
      <td>مشکل بک‌اند Anthropic یا وضعیت نشست نامعتبر</td>
      <td>همه کوکی‌های claude.ai را پاک کنید، مرورگر را ری‌استارت کنید، دوباره تلاش کنید</td>
    </tr>
    <tr>
      <td><strong>Account Disabled</strong></td>
      <td>"Your account has been disabled"</td>
      <td>نقض ToS یا مشکل پرداخت</td>
      <td>ایمیل را برای دلیل مسدودسازی ببینید، SOP تجدیدنظر را دنبال کنید</td>
    </tr>
  </tbody>
</table>

<h3>رویه تشخیص</h3>
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

<h2>2. عیب‌یابی استثنای فراخوانی API</h2>
<p>شکست API نیاز به تشخیص سیستماتیک شبکه، احراز هویت و محدودیت نرخ دارد:</p>

<h3>خطاهای رایج API</h3>
<ul>
  <li><strong>401 Unauthorized:</strong> کلید API نامعتبر یا لغو شده. کلید را در Anthropic Console بررسی کنید، در صورت نیاز دوباره بسازید.</li>
  <li><strong>429 Rate Limit:</strong> سازمان از سهمیه RPM (درخواست در دقیقه) یا TPM (توکن در دقیقه) عبور کرده است. محدودیت نرخ سمت کلاینت پیاده کنید.</li>
  <li><strong>529 Overloaded:</strong> بک‌اند Anthropic در ظرفیت کامل است. با backoff نمایی (2^n ثانیه با jitter) دوباره تلاش کنید.</li>
  <li><strong>Timeout:</strong> درخواست از timeout 60 ثانیه‌ای گذشت. promptهای بزرگ را تکه کنید یا max_tokens را کم کنید.</li>
</ul>

<h3>اسکریپت دیباگ API</h3>
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

<h2>3. علت ریشه‌ای شکست اتصال پرداخت</h2>
<p>Anthropic دلیل رد بانک را دریافت نمی‌کند، پس علل محتمل را به‌ترتیب بررسی کنید. <a href="/guides/payment-methods-comparison/">راهنمای روش‌های پرداخت</a> چک‌لیست رسمی کامل را دارد:</p>

<ul>
  <li><strong>رد کارت:</strong> موجودی ناکافی، CVV نامعتبر، یا کارت منقضی. مطمئن شوید موجودی کل مبلغ را پوشش می‌دهد.</li>
  <li><strong>نوع کارت پذیرفته نشده:</strong> Pro و Max فقط کارت اعتباری و نقدی را فهرست می‌کنند، بنابراین کارت پیش‌پرداخته می‌تواند تنها به‌خاطر نوع رد شود. Anthropic BINهای مسدود را منتشر نمی‌کند.</li>
  <li><strong>عدم تطابق آدرس:</strong> آدرس صورتحساب باید با سوابق بانک و کشور صادرکننده کارت هم‌خوان باشد و در منطقه صورتحساب مجاز باشد.</li>
  <li><strong>تکمیل نشدن 3D Secure:</strong> وقتی بانک می‌خواهد، کد پیامک یا تأیید اپ بانک را انجام دهید.</li>
  <li><strong>تلاش‌های مکرر:</strong> یک‌بار دیگر تلاش کنید، سپس از بانک بپرسید. فقط صادرکننده کارت می‌تواند دلیل رد را توضیح دهد.</li>
</ul>

<h2>4. پرسش‌های متداول و اصلاحات سریع</h2>

<h3>پ: «Claude می‌گوید نشست من منقضی شده، اما همین الان وارد شدم»</h3>
<p><strong>ج:</strong> کوکی نشست به IP و اثر انگشت دستگاه وابسته است. تغییر سریع IP نشست را باطل می‌کند. راه‌حل: 2FA را فعال کنید تا درخواست‌های تأیید مجدد کمتر شود، در هر نشست IP ثابت نگه دارید.</p>

<h3>پ: «API برای promptهای جدید پاسخ کش‌شده برمی‌گرداند»</h3>
<p><strong>ج:</strong> Prompt Cache با محتوای ناخواسته تطبیق داده است. راه‌حل: شناسه یکتا یا timestamp به prompt اضافه کنید تا cache miss اجبار شود: <code>{prompt} [request_id: {Date.now()}]</code>.</p>

<h3>پ: «WebRTC با وجود پروکسی IP واقعی من را نشان می‌دهد»</h3>
<p><strong>ج:</strong> WebRTC برای اتصال peer از پروکسی عبور می‌کند. راه‌حل: WebRTC را در تنظیمات مرورگر کاملاً غیرفعال کنید یا از افزونه WebRTC Control برای مسدود کردن درخواست‌های STUN استفاده کنید.</p>

<h3>پ: «حساب ناگهان تأیید تلفن می‌خواهد»</h3>
<p><strong>ج:</strong> به‌دلیل تغییر IP، ورود از دستگاه جدید، یا فعالیت مشکوک فعال می‌شود. راه‌حل: از سرویس تأیید SIM فیزیکی واقعی استفاده کنید، بلافاصله پس از تأیید 2FA را وصل کنید تا دوباره درخواست نشود.</p>
`;
