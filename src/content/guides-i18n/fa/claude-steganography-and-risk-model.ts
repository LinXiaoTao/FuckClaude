export const content = `
<h2>۱. تحلیل رویداد استگانوگرافی Claude Code</h2>
<p>در آوریل ۲۰۲۶، مهندسی معکوس CLI رسمی <code>@anthropic-ai/claude-code</code> نشان داد وقتی کاربران درخواست‌ها را از طریق <code>ANTHROPIC_BASE_URL</code> به یک endpoint غیررسمی هدایت می‌کردند، CLI بدون افشا برای کاربر، منطق تشخیص سمت کلاینت را اجرا می‌کرد:</p>

<ul>
  <li><strong>بررسی منطقه زمانی:</strong> ارزیابی می‌کرد آیا منطقه زمانی سیستم <code>Asia/Shanghai</code> یا <code>Asia/Urumqi</code> است. در صورت تطابق، جداکننده تاریخ در خط system prompt مربوط به <code>Today's date is 2026-06-30</code> از خط تیره به اسلش تغییر می‌کرد: <code>2026/06/30</code>.</li>
  <li><strong>لیست سیاه میزبان و کلیدواژه آزمایشگاه:</strong> میزبان پروکسی را با فهرست base64 شامل بیش از ۱۴۷ دامنه رمزگذاری‌شده با XOR (کلید: ۹۱) و کلیدواژه‌های آزمایشگاه‌های هوش مصنوعی چینی (مثلاً <code>deepseek</code>، <code>moonshot</code>، <code>zhipu</code>، <code>minimax</code>، <code>dashscope</code>، <code>*.cn</code>) تطبیق می‌داد.</li>
  <li><strong>جایگزینی آپاستروف Unicode:</strong> آپاستروف در «Today's date» با واریانت‌های مشابه Unicode تغییر می‌کرد:
    <ul>
      <li>میزبان با فهرست دامنه فروشنده مجدد تطابق داشت → جایگزین با <code>U+2019</code> (’ Right Single Quotation Mark)</li>
      <li>میزبان با کلیدواژه آزمایشگاه هوش مصنوعی تطابق داشت → جایگزین با <code>U+02BC</code> (Modifier Letter Apostrophe)</li>
      <li>هر دو تطابق داشتند → جایگزین با <code>U+02B9</code> (Modifier Letter Prime)</li>
    </ul>
  </li>
</ul>

<p>این بار استگانوگرافیک از فوروارد پروکسی عبور می‌کرد و به طبقه‌بندهای بک‌اند Anthropic اجازه می‌داد کمپین‌های distillation و فروش مجدد تجاری غیرمجاز را بدون افزودن هدر HTTP صریح ردیابی کنند.</p>

<h3>محافظت محیط و رفع اثر</h3>
<pre><code># 1. Tell client to treat custom endpoint as first-party
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Override system timezone for CLI executions
export TZ=Asia/Tokyo

# Launch Claude Code
claude</code></pre>

<h2>۲. مدل چهارلایه کنترل ریسک Anthropic</h2>
<p>Anthropic یک خط لوله امنیتی جامع ضد سوءاستفاده و ضد distillation را در <code>claude.ai</code>، endpointهای API و Claude Code اجرا می‌کند:</p>

<ol>
  <li><strong>لایه شبکه و IP:</strong> بازه‌های IP دیتاسنتر (AWS، Hetzner، DigitalOcean، Linode) امتیاز ریسک بالا می‌گیرند. IP مسکونی دو ISP اختصاصی در مناطق پشتیبانی‌شده (US، UK، SG، JP، TW) کم‌ریسک‌ترین‌اند.</li>
  <li><strong>اثر انگشت مرورگر و دستگاه:</strong> ترکیب منطقه زمانی سیستم (<code>Intl.DateTimeFormat</code>)، فهرست زبان مرورگر (<code>navigator.languages</code>)، پروب عرض Canvas برای فونت‌های چینی (Microsoft YaHei، PingFang SC، MiSans) و هدرهای User-Agent CH.</li>
  <li><strong>لایه پرداخت و هویت:</strong> BINهای کارت مجازی پرریسک (مثلاً BIN کارت‌های پیش‌پرداخت با صدور زیاد)، ناهماهنگی کشور آدرس صورتحساب و شماره تلفن مجازی VoIP باعث لغو فوری اشتراک یا رد پرداخت می‌شود.</li>
  <li><strong>طبقه‌بندهای رفتاری و distillation:</strong> اسکریپت‌های خودکار با میلیون‌ها prompt تکراری، اشباع پرتکرار پنجره context و سوءاستفاده از prompt caching باعث قفل خودکار حساب و سهمیه سازمان می‌شود.</li>
</ol>
`;
