export const content = `
<h2>1. مقایسهٔ ایزولاسیون فیزیکی در برابر نرم‌افزاری</h2>
<p>این راهنما برای موارد قانونی مثل حساب جداگانهٔ کار و شخصی یا صندلی فردی تیم است. راهی برای فرار از مسدودیت یا دور زدن سقف هر حساب نیست؛ شرایط Anthropic این را منع می‌کند. تمیز نگه داشتن حساب‌های جدا یعنی جدا کردن پروفایل مرورگر، نشست شبکه و صورتحساب. سطح جداسازی را متناسب با نیاز و بودجه انتخاب کنید:</p>

<table>
  <thead>
    <tr>
      <th>روش ایزولاسیون</th>
      <th>هزینه</th>
      <th>سطح امنیت</th>
      <th>بهترین برای</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>ماشین‌های فیزیکی جدا</strong></td>
      <td>بالا</td>
      <td>حداکثر</td>
      <td>حساب‌های سازمانی با ارزش بالا</td>
    </tr>
    <tr>
      <td><strong>ماشین مجازی (VMware/VirtualBox)</strong></td>
      <td>متوسط</td>
      <td>بالا</td>
      <td>تیم‌هایی با 5-20 حساب</td>
    </tr>
    <tr>
      <td><strong>مرورگرهای ضد‌شناسایی</strong></td>
      <td>متوسط</td>
      <td>متوسط-بالا</td>
      <td>آژانس‌های بازاریابی، جریان‌های کاری چندحسابی</td>
    </tr>
    <tr>
      <td><strong>پروفایل مرورگر (Chrome/Firefox)</strong></td>
      <td>پایین</td>
      <td>متوسط</td>
      <td>استفادهٔ شخصی، 2-5 حساب</td>
    </tr>
    <tr>
      <td><strong>پنجرهٔ ناشناس/خصوصی</strong></td>
      <td>رایگان</td>
      <td>پایین</td>
      <td>فقط تست موقت</td>
    </tr>
  </tbody>
</table>

<h2>2. ایزولاسیون کامل پروفایل مرورگر</h2>
<p>برای مدیریت چندحسابی در مقیاس متوسط (3-10 حساب)، پروفایل‌های مرورگر درست پیکربندی‌شده ایزولاسیون کافی بدون سربار ماشین مجازی می‌دهند:</p>

<h3>راه‌اندازی پروفایل Chrome</h3>
<pre><code># Create isolated Chrome profiles via command line
# macOS/Linux
google-chrome --user-data-dir="/path/to/profile-account1" --proxy-server="socks5://proxy1:1080"

# Windows
chrome.exe --user-data-dir="C:\ChromeProfiles\account1" --proxy-server="socks5://proxy1:1080"

# Each profile maintains separate:
# - Cookies, localStorage, IndexedDB
# - Extensions and settings
# - Autofill data and passwords</code></pre>

<h3>کانتینرهای چندحسابی Firefox</h3>
<pre><code># Firefox containers provide lighter-weight isolation within a single profile
1. Install "Firefox Multi-Account Containers" extension
2. Create a container per Claude account
3. Assign container-specific proxy settings via "FoxyProxy" or "Proxy SwitchyOmega"
4. Open Claude.ai in dedicated container tabs</code></pre>

<h2>3. جداسازی IP و پرداخت چندحسابی</h2>
<p>حتی با ایزولاسیون کامل مرورگر، IP یا روش پرداخت مشترک حساب‌ها را به‌هم وصل می‌کند و مسدودیت زنجیره‌ای را تحریک می‌کند:</p>

<h3>استراتژی ایزولاسیون IP</h3>
<ul>
  <li><strong>پروکسی مسکونی اختصاصی:</strong> به هر حساب یک IP مسکونی یکتا اختصاص دهید. هرگز IP را درون یک نشست حساب عوض نکنید.</li>
  <li><strong>نشست‌های sticky:</strong> ارائه‌دهندهٔ پروکسی را طوری تنظیم کنید حداقل 24 ساعت برای هر حساب IP یکسان بماند تا پرچم تغییر سریع IP نیفتد.</li>
  <li><strong>پراکندگی جغرافیایی:</strong> حساب‌ها را بین مناطق آمریکا، بریتانیا و SG پخش کنید تا ریسک همبستگی کم شود.</li>
</ul>

<h3>جداسازی کارت پرداخت</h3>
<ul>
  <li><strong>قانون 2:</strong> هرگز یک کارت مجازی را به بیش از 2 حساب Claude وصل نکنید.</li>
  <li><strong>قرارداد نام‌گذاری کارت:</strong> برای هر حساب نام دارندهٔ کارت متفاوت استفاده کنید تا همبستگی بیشتر بشکند.</li>
  <li><strong>تمدیدهای با فاصله:</strong> تاریخ تمدید اشتراک را 5-7 روز جابه‌جا کنید تا رویدادهای پرداخت هم‌زمان نشود.</li>
</ul>

<h2>4. SOP امن تعویض حساب</h2>
<p>جابه‌جایی بین حساب‌ها روی یک ماشین نیاز به روش دقیق دارد تا شناسه‌های مشترک نشت نکند:</p>

<h3>چک‌لیست قبل از تعویض</h3>
<pre><code># 1. Close all browser windows for Account A
# 2. Clear DNS cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns            # Windows
sudo systemd-resolve --flush-caches  # Linux

# 3. Switch proxy to Account B's dedicated IP
# 4. Verify new IP
curl https://ipinfo.io

# 5. Launch Account B's browser profile
google-chrome --user-data-dir="/path/to/profile-accountB"</code></pre>

<h3>ماتریس ریسک تعویض حساب</h3>
<table>
  <thead>
    <tr>
      <th>سناریو</th>
      <th>ریسک</th>
      <th>کاهش ریسک</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>IP یکسان، پروفایل‌های مختلف</td>
      <td>بالا</td>
      <td>همیشه IP اختصاصی به ازای هر حساب</td>
    </tr>
    <tr>
      <td>کارت یکسان، حساب‌های مختلف</td>
      <td>بحرانی</td>
      <td>هرگز بیش از 2 حساب به ازای هر کارت</td>
    </tr>
    <tr>
      <td>ورودهای پشت‌سرهم سریع</td>
      <td>متوسط</td>
      <td>بین تعویض حساب‌ها 5-10 دقیقه صبر کنید</td>
    </tr>
    <tr>
      <td>organizationUuid مشترک</td>
      <td>بحرانی</td>
      <td>برای حساب‌های با ارزش بالا ماشین یا VM جدا</td>
    </tr>
  </tbody>
</table>
`;
