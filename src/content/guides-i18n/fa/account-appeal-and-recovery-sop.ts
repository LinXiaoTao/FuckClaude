export const content = `
<h2>1. تشخیص وضعیت حساب و نوع مسدودسازی</h2>
<p>وقتی دسترسی به حساب دچار مشکل می‌شود، ابتدا نوع دقیق محدودیت را مشخص کنید تا اقدام بازیابی مناسب را انتخاب کنید:</p>

<ul>
  <li><strong>مسدودسازی منطقه IP (Access Denied / 403):</strong> «Claude is not available in your region». راه‌حل: حساب شما سالم است؛ نود پروکسی را به IP مسکونی در کشور پشتیبانی‌شده (US, UK, SG, JP) به‌روز کنید.</li>
  <li><strong>بازپرداخت اشتراک یا رد پرداخت:</strong> پرداخت ناموفق دسترسی Pro را پایان می‌دهد و حساب را به طرح Free برمی‌گرداند. Anthropic دلیل رد بانک را دریافت نمی‌کند و فهرست کارت‌های مسدودشده را منتشر نمی‌کند. راه‌حل: طبق <a href="/guides/payment-methods-comparison/">چک‌لیست رسمی رد پرداخت</a> پیش بروید، سپس کارت اعتباری یا نقدی با آدرس صورتحساب منطبق با سوابق بانک وصل کنید.</li>
  <li><strong>غیرفعال‌سازی دائمی حساب (Disabled):</strong> «Your account has been disabled after review». راه‌حل: از طریق درگاه اختصاصی <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a> درخواست تجدیدنظر رسمی به انگلیسی ارسال کنید. فرم فقط وقتی باز می‌شود که وارد همان حساب غیرفعال شده باشید. مرکز راهنمای Anthropic سه دلیل مسدودسازی را فهرست می‌کند: نقض مکرر Usage Policy، ایجاد حساب از مکان پشتیبانی‌نشده، و نقض Terms of Service. از همان صفحه می‌توانید داده را صادر یا حساب را حذف کنید؛ دامنه داده قابل صدور بسته به نوع تخلف ممکن است محدود باشد، پس قبل از حذف صادر کنید. Anthropic یادآوری می‌کند زمان پاسخ‌دهی اکنون از حالت عادی طولانی‌تر است.</li>
  <li><strong>تعلیق سازمان (Organization On Hold):</strong> حساب شخصی شما سالم است، اما سازمانی که عضو آن هستید به‌دلیل فعالیت غیرعادی متوقف شده است. صفحه حساب محدودشده هر سازمان متوقف‌شده را فهرست می‌کند. راه‌حل: روی «Request a review» برای سازمان مربوط کلیک کنید.</li>
  <li><strong>هشدار نقض API / مثبت کاذب:</strong> هشدارهای API در سطح سازمان یا مشکوک به طبقه‌بندی اشتباه. راه‌حل: به <a href="mailto:usersafety@anthropic.com">usersafety@anthropic.com</a> با request ID و زمینه استفاده ایمیل بزنید.</li>
</ul>

<h2>2. داده‌های شفافیت نیمه اول 2026 و انتظارات واقع‌بینانه</h2>
<p>Transparency Hub Anthropic (آخرین به‌روزرسانی 23 ژوئیه 2026) گزارش می‌دهد تنها در نیمه اول 2026، <strong>11.4 million</strong> حساب متخلف از سیاست غیرفعال شد، <strong>398,000</strong> درخواست تجدیدنظر دریافت شد و <strong>42,000</strong> مورد با موفقیت بازگردانده شد — نرخ موفقیت تجدیدنظر حدود <strong>10.5%</strong>. این ارقام همه حساب‌ها را پوشش می‌دهد و نتیجه مورد شما را پیش‌بینی نمی‌کند. Anthropic معیار موفقیت تجدیدنظر را منتشر نمی‌کند. آنچه در کنترل شماست، درخواست مبتنی بر واقعیت با زمینه قابل تأیید است؛ گزارش‌های community می‌گویند ایجاد حساب جایگزین در مدت بررسی، ریسک ارتباط را افزایش می‌دهد.</p>

<h2>3. SOP تجدیدنظر انگلیسی مبتنی بر واقعیت</h2>
<p>هنگام تجدیدنظر برای حساب غیرفعال، فقط واقعیت‌هایی را بنویسید که می‌توانید تأیید کنید. توضیحی ساختگی با تاریخچه حساب قابل تطبیق نیست و درخواست را ضعیف می‌کند. هر placeholder را با وضعیت واقعی پر کنید و خطی که اعمال نمی‌شود حذف کنید:</p>

<h3>قالب تجدیدنظر انگلیسی (جزئیات واقعی وارد کنید)</h3>
<pre><code>Subject: Appeal for Disabled Claude Account [Your-Email@domain.com]

Dear Anthropic Safeguards Team,

I am writing to request a review of my account (Email: [Your-Email@domain.com]), which was disabled on [date and time zone].

Notice received: "[exact text of the notice]"
Where I used Claude: [claude.ai / Claude Code / API]
How I use it: [your actual use, e.g. software development for project X, academic research at institution Y]
Network and location: [where you were located and how you connected, including any VPN or proxy, stated accurately]
Payment: [plan, type of payment method, and purchase date]

I have not shared my login, resold access, or used automation to bypass limits. [Delete this sentence if it is not accurate.]

Please review my account and let me know what additional information you need.

Thank you for your time.

Best regards,
[Your Name]</code></pre>
<p>از طریق فرم تجدیدنظر در حالت ورود به سیستم ارسال کنید، اعلان و نسخه ارسال را نگه دارید؛ در مدت بررسی درخواست تکراری ندهید و حساب جایگزین باز نکنید.</p>

<h2>4. بازپرداخت پس از مسدودسازی</h2>
<p>اگر حساب بلافاصله پس از پرداخت Claude Pro یا Team غیرفعال شد:</p>

<ol>
  <li>ابتدا ایمیل تجدیدنظر بالا را ارسال کنید.</li>
  <li>در محصول از مسیر Get help &gt; Claude Refund Request بازپرداخت بخواهید. برای اشتراک از App Store یا Google Play، از جریان بازپرداخت همان فروشگاه استفاده کنید. ایمیل‌های «Your receipt from Anthropic» را نگه دارید.</li>
  <li>اختلاف بانکی را پس از درخواست بازپرداخت و به‌عنوان آخرین راه‌حل در نظر بگیرید. Anthropic اثر اختلاف بانکی بر حساب را منتشر نکرده است.</li>
</ol>
`;
