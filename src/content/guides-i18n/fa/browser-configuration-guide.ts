export const content = `
<h2>1. پیکربندی ضدمسدودیت Chrome</h2>
<p>Chrome پرکاربردترین مرورگر برای دسترسی به Claude است. پیکربندی درست از ناهماهنگی منطقهٔ زمانی، نشت WebRTC و اثر انگشت فونت چینی جلوگیری می‌کند:</p>

<h3>همگام‌سازی منطقهٔ زمانی سیستم</h3>
<pre><code># macOS: Set timezone to match proxy exit region
sudo systemsetup -settimezone "America/Los_Angeles"

# Windows: via PowerShell (requires admin)
Set-TimeZone -Id "Pacific Standard Time"

# Linux
sudo timedatectl set-timezone America/Los_Angeles</code></pre>

<h3>پرچم‌های راه‌اندازی Chrome برای حریم خصوصی بهتر</h3>
<pre><code># Launch Chrome with fingerprint-resistant flags
google-chrome \
  --disable-blink-features=AutomationControlled \
  --disable-webrtc \
  --lang=en-US \
  --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0"</code></pre>

<h3>چک‌لیست تنظیمات Chrome</h3>
<ul>
  <li><strong>زبان‌ها:</strong> در <code>chrome://settings/languages</code> English (United States) تنظیم کنید و همهٔ ورودی‌های زبان چینی را حذف کنید.</li>
  <li><strong>کنترل WebRTC:</strong> افزونهٔ <em>WebRTC Network Limiter</em> را نصب کنید و روی «Use my proxy server (if any)» بگذارید.</li>
  <li><strong>Do Not Track:</strong> در <code>chrome://settings/privacy</code> فعال کنید.</li>
  <li><strong>پاک‌سازی هنگام خروج:</strong> در <code>chrome://settings/cookies</code> طوری تنظیم کنید که با بستن همهٔ پنجره‌ها کوکی و دادهٔ سایت پاک شود.</li>
</ul>

<h2>2. تقویت حریم خصوصی Firefox</h2>
<p>Firefox از طریق <code>about:config</code> کنترل دقیق حریم خصوصی می‌دهد. این تنظیمات اثر انگشت مرورگر را کم می‌کند و از نشت منطقهٔ زمانی/WebRTC جلوگیری می‌کند:</p>

<h3>تنظیمات حیاتی about:config</h3>
<pre><code># Open about:config and set:
privacy.resistFingerprinting = true
webgl.disabled = true
media.peerconnection.enabled = false
geo.enabled = false
intl.accept_languages = en-US, en
general.useragent.locale = en-US</code></pre>

<h3>تب‌های کانتینر Firefox برای ایزولاسیون چندحسابی</h3>
<p>از Firefox Multi-Account Containers استفاده کنید تا حساب‌های Claude در زمینه‌های جداگانهٔ کوکی/ذخیره‌سازی ایزوله شوند بدون نیاز به پروفایل مرورگر جدا:</p>
<pre><code>1. Install "Firefox Multi-Account Containers" extension
2. Create a dedicated container per Claude account
3. Right-click Claude.ai → "Open in New Container Tab"
4. Each container maintains isolated cookies, localStorage, IndexedDB</code></pre>

<h2>3. تنظیمات سیاست سازمانی Edge</h2>
<p>Microsoft Edge از Group Policy برای کنترل دقیق WebRTC، موقعیت مکانی و شتاب سخت‌افزاری پشتیبانی می‌کند:</p>

<h3>پیکربندی Group Policy ویندوز</h3>
<pre><code># Open gpedit.msc (Windows Pro/Enterprise)
Computer Configuration → Administrative Templates → Microsoft Edge

WebRtcUdpPortRange: Disabled
DefaultGeolocationSetting: Block geolocation
HardwareAccelerationModeEnabled: Disabled (prevents GPU fingerprinting)</code></pre>

<h3>پرچم‌های Edge برای حریم خصوصی</h3>
<pre><code>edge://flags

#edge-enable-webrtc-hide-local-ips-with-mdns → Enabled
#smooth-scrolling → Disabled
#calculate-native-win-occlusion → Disabled</code></pre>

<h2>4. افزونه‌های ضروری مرورگر</h2>
<p>افزونه‌های متمرکز بر حریم خصوصی نصب کنید تا نشت اثر انگشت کم شود و کوکی‌ها بین نشست‌ها مدیریت شوند:</p>

<ul>
  <li><strong>User-Agent Switcher:</strong> رشته‌های User-Agent را با منطقهٔ هدف (US/UK/SG) هم‌راستا کنید.</li>
  <li><strong>Cookie AutoDelete:</strong> با بستن تب‌ها خودکار کوکی پاک کند، به‌جز دامنه‌های whitelist.</li>
  <li><strong>uBlock Origin:</strong> ردیاب‌های شخص ثالث و اسکریپت‌های analytics را که نشست‌ها را به‌هم وصل می‌کنند مسدود کنید.</li>
  <li><strong>Decentraleyes:</strong> کتابخانه‌های رایج JavaScript را محلی سرو کند تا ردیابی CDN نشود.</li>
  <li><strong>Clear Browsing Data:</strong> پاک‌سازی خودکار cache، کوکی و تاریخ هنگام راه‌اندازی مجدد مرورگر.</li>
</ul>

<h3>بهترین روش‌های پیکربندی افزونه</h3>
<ul>
  <li>فقط دامنه‌های ضروری (claude.ai، anthropic.com) را در Cookie AutoDelete whitelist کنید.</li>
  <li>User-Agent Switcher را طوری تنظیم کنید که با نسخهٔ سیستم‌عامل و مرورگر همخوان با منطقهٔ خروج پروکسی یکی باشد.</li>
  <li>افزونه‌هایی که مجوز گسترده می‌خواهند یا به همهٔ صفحات اسکریپت تزریق می‌کنند غیرفعال کنید.</li>
</ul>
`;
