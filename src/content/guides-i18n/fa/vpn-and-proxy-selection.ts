export const content = `
<h2>۱. ارزیابی ریسک IP مسکونی در برابر IP دیتاسنتر</h2>
<p>نوع آدرس IP مستقیماً بر امتیاز ریسک حساب Claude اثر می‌گذارد. Anthropic به IPهای دیتاسنتر که معمولاً با سرویس پروکسی و ترافیک bot مرتبط‌اند، وزن ریسک بالاتری می‌دهد:</p>

<h3>مقایسه نوع IP</h3>
<table>
  <thead>
    <tr>
      <th>نوع IP</th>
      <th>سطح ریسک</th>
      <th>ویژگی‌ها</th>
      <th>مورد استفاده</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>IP مسکونی</strong></td>
      <td>پایین</td>
      <td>اختصاص‌یافته توسط ISP به کاربران خانگی، شهرت تمیز، ASN پایدار</td>
      <td>ثبت حساب، اشتراک Pro، استفاده بلندمدت</td>
    </tr>
    <tr>
      <td><strong>IP اپراتور موبایل</strong></td>
      <td>پایین تا متوسط</td>
      <td>IP شبکه سلولی با تخصیص پویا، استفاده موبایل مشروع</td>
      <td>دسترسی اپ موبایل، نشست‌های موقت</td>
    </tr>
    <tr>
      <td><strong>IP دیتاسنتر</strong></td>
      <td>بالا</td>
      <td>بازه‌های AWS، Hetzner، DigitalOcean، اغلب برای ترافیک bot علامت‌گذاری می‌شوند</td>
      <td>فقط آزمایش کوتاه‌مدت، ریسک بن بالا</td>
    </tr>
    <tr>
      <td><strong>استخر مشترک VPN</strong></td>
      <td>بالا</td>
      <td>بازه‌های IP بیش‌ازحد استفاده‌شده بین هزاران کاربر، در بسیاری سرویس‌ها لیست سیاه</td>
      <td>برای دسترسی Claude اجتناب کنید</td>
    </tr>
  </tbody>
</table>

<h3>چگونه نوع IP خود را تأیید کنید</h3>
<pre><code># Check IP reputation and type
curl https://ipinfo.io

# Sample output shows:
# "org": "AS7922 Comcast Cable Communications" → Residential (Good)
# "org": "AS16509 Amazon.com, Inc." → Datacenter (High Risk)</code></pre>

<h2>۲. انتخاب پروتکل پروکسی</h2>
<p>پروتکل‌های پروکسی مختلف سطح متفاوتی از امنیت، سرعت و مقاومت در برابر اثرانگشت ارائه می‌دهند:</p>

<ul>
  <li><strong>پروکسی HTTP/HTTPS:</strong> ساده و پشتیبانی گسترده، اما هدرهای پروکسی شفاف می‌توانند IP اصلی را فاش کنند. فقط از پروکسی‌های ناشناس «elite» استفاده کنید که هدر <code>X-Forwarded-For</code> را حذف می‌کنند.</li>
  <li><strong>SOCKS5:</strong> امن‌تر از پروکسی HTTP، UDP برای resolve کردن DNS پشتیبانی می‌کند و هدر HTTP را تغییر نمی‌دهد. برای دسترسی وب عمومی به Claude ترجیح داده می‌شود.</li>
  <li><strong>Shadowsocks / V2Ray:</strong> پروتکل‌های رمزگذاری‌شده برای عبور از بازرسی عمیق بسته. نشت اثرانگشت کمینه، اما مطمئن شوید گره خروجی IP مسکونی است.</li>
  <li><strong>Wireguard / OpenVPN:</strong> تونل VPN کامل با مسیریابی سراسری سیستم. بهترین ایزولاسیون، اما در پیکربندی نادرست می‌تواند کوئری DNS را نشت دهد.</li>
</ul>

<h3>نمونه پیکربندی پروتکل (macOS/Linux)</h3>
<pre><code># SOCKS5 proxy via SSH tunnel (requires a remote server)
ssh -D 1080 -N user@your-residential-server.com

# Configure system to use SOCKS5 proxy
export ALL_PROXY=socks5://127.0.0.1:1080

# Test proxy connection
curl --proxy socks5://127.0.0.1:1080 https://ipinfo.io</code></pre>

<h2>۳. معیارهای ارزیابی ارائه‌دهنده VPN</h2>
<p>هنگام انتخاب سرویس VPN برای دسترسی به Claude، ارائه‌دهندگانی را اولویت دهید که IP مسکونی اختصاصی ارائه می‌دهند، نه استخر مشترک دیتاسنتر:</p>

<ul>
  <li><strong>نوع استخر IP:</strong> تأیید کنید ارائه‌دهنده IP مسکونی واقعی از ISP ارائه می‌دهد، نه بازه دیتاسنتر با برچسب «مسکونی».</li>
  <li><strong>اختصاصی در برابر مشترک:</strong> IP اختصاصی ریسک اشتراک با کاربران سوءاستفاده‌گر را حذف می‌کند، اما هزینه به‌مراتب بیشتر است. IP مسکونی مشترک قابل قبول است اگر استخر تمیز باشد و مرتب rotate شود.</li>
  <li><strong>انتخاب منطقه خروجی:</strong> IP خروجی را در مناطق پشتیبانی‌شده Anthropic (US، UK، SG، JP) انتخاب کنید و آدرس صورتحساب با کشور IP هم‌راستا باشد.</li>
  <li><strong>سیاست بدون لاگ:</strong> ارائه‌دهندگانی با سیاست بدون لاگ حسابرسی‌شده انتخاب کنید تا ریسک انطباق و حریم خصوصی کمینه شود.</li>
  <li><strong>محافظت در برابر نشت DNS:</strong> مطمئن شوید کلاینت VPN محافظت داخلی نشت DNS دارد و از سرور DNS راه‌دور (۱.۱.۱.۱، ۸.۸.۸.۸) استفاده می‌کند.</li>
</ul>

<h2>۴. پیکربندی زنجیره پروکسی و جلوگیری از نشت DNS</h2>
<p>در سناریوهای امنیت بالا، زنجیره پروکسی را طوری پیکربندی کنید که ترافیک از چند hop عبور کند و ریسک همبستگی IP کاهش یابد:</p>

<h3>راه‌اندازی پروکسی چند hop</h3>
<pre><code># Example: Local SOCKS5 → Residential Proxy → Claude
# Configure Clash / Sing-box with proxy chain rules

proxies:
  - name: "residential-us"
    type: socks5
    server: residential-proxy.example.com
    port: 1080
  
proxy-groups:
  - name: "claude-chain"
    type: relay
    proxies:
      - "residential-us"</code></pre>

<h3>چک‌لیست جلوگیری از نشت DNS</h3>
<ul>
  <li>DNS سیستم را روی ۱.۱.۱.۱ یا ۸.۸.۸.۸ تنظیم کنید؛ هرگز از DNS عمومی ISP یا چین استفاده نکنید.</li>
  <li>DNS-over-HTTPS (DoH) یا DNS-over-TLS (DoT) را در تنظیمات مرورگر فعال کنید.</li>
  <li>هنگام اتصال به پروکسی در <code>https://dnsleaktest.com</code> نشت DNS را آزمایش کنید.</li>
  <li>WebRTC را کاملاً غیرفعال کنید تا از طریق سرورهای STUN IP محلی نشت نشود.</li>
</ul>
`;
