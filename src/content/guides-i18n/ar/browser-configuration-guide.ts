export const content = `
<h2>1. إعداد Chrome لمكافحة الحظر</h2>
<p>Chrome هو المتصفح الأكثر استخداماً للوصول إلى Claude. الإعداد الصحيح يمنع تناقضات المنطقة الزمنية وتسرب WebRTC وبصمات الخطوط الصينية:</p>

<h3>مزامنة المنطقة الزمنية للنظام</h3>
<pre><code># macOS: Set timezone to match proxy exit region
sudo systemsetup -settimezone "America/Los_Angeles"

# Windows: via PowerShell (requires admin)
Set-TimeZone -Id "Pacific Standard Time"

# Linux
sudo timedatectl set-timezone America/Los_Angeles</code></pre>

<h3>علامات تشغيل Chrome لتعزيز الخصوصية</h3>
<pre><code># Launch Chrome with fingerprint-resistant flags
google-chrome \
  --disable-blink-features=AutomationControlled \
  --disable-webrtc \
  --lang=en-US \
  --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0"</code></pre>

<h3>قائمة تحقق إعدادات Chrome</h3>
<ul>
  <li><strong>اللغات:</strong> اضبط <code>chrome://settings/languages</code> على English (United States) وأزل كل إدخالات اللغة الصينية.</li>
  <li><strong>التحكم في WebRTC:</strong> ثبّت إضافة <em>WebRTC Network Limiter</em> واضبطها على "Use my proxy server (if any)".</li>
  <li><strong>Do Not Track:</strong> فعّلها في <code>chrome://settings/privacy</code>.</li>
  <li><strong>مسح عند الخروج:</strong> اضبط <code>chrome://settings/cookies</code> لمسح cookies وبيانات المواقع عند إغلاق كل النوافذ.</li>
</ul>

<h2>2. تعزيز خصوصية Firefox</h2>
<p>يوفر Firefox تحكماً دقيقاً في الخصوصية عبر <code>about:config</code>. هذه الإعدادات تقلّل بصمة المتصفح وتمنع تسرب المنطقة الزمنية/WebRTC:</p>

<h3>إعدادات about:config الحرجة</h3>
<pre><code># Open about:config and set:
privacy.resistFingerprinting = true
webgl.disabled = true
media.peerconnection.enabled = false
geo.enabled = false
intl.accept_languages = en-US, en
general.useragent.locale = en-US</code></pre>

<h3>علامات تبويب الحاويات في Firefox لعزل حسابات متعددة</h3>
<p>استخدم Firefox Multi-Account Containers لعزل حسابات Claude في سياقات cookies/تخزين منفصلة دون الحاجة إلى ملفات متصفح منفصلة:</p>
<pre><code>1. Install "Firefox Multi-Account Containers" extension
2. Create a dedicated container per Claude account
3. Right-click Claude.ai → "Open in New Container Tab"
4. Each container maintains isolated cookies, localStorage, IndexedDB</code></pre>

<h2>3. إعدادات سياسة المؤسسة في Edge</h2>
<p>يدعم Microsoft Edge إعدادات Group Policy للتحكم الدقيق في WebRTC والموقع الجغرافي وتسريع الأجهزة:</p>

<h3>إعداد Group Policy في Windows</h3>
<pre><code># Open gpedit.msc (Windows Pro/Enterprise)
Computer Configuration → Administrative Templates → Microsoft Edge

WebRtcUdpPortRange: Disabled
DefaultGeolocationSetting: Block geolocation
HardwareAccelerationModeEnabled: Disabled (prevents GPU fingerprinting)</code></pre>

<h3>علامات Edge للخصوصية</h3>
<pre><code>edge://flags

#edge-enable-webrtc-hide-local-ips-with-mdns → Enabled
#smooth-scrolling → Disabled
#calculate-native-win-occlusion → Disabled</code></pre>

<h2>4. إضافات المتصفح الأساسية</h2>
<p>ثبّت إضافات تركّز على الخصوصية لمنع تسرب البصمة وإدارة cookies بين الجلسات:</p>

<ul>
  <li><strong>User-Agent Switcher:</strong> دوّر سلاسل User-Agent لتطابق منطقتك المستهدفة (US/UK/SG).</li>
  <li><strong>Cookie AutoDelete:</strong> امسح cookies تلقائياً عند إغلاق علامات التبويب، باستثناء النطاقات في القائمة البيضاء.</li>
  <li><strong>uBlock Origin:</strong> احجب متتبعات الطرف الثالث ونصوص التحليلات التي قد تربط الجلسات.</li>
  <li><strong>Decentraleyes:</strong> قدّم مكتبات JavaScript الشائعة محلياً لمنع تتبع CDN.</li>
  <li><strong>Clear Browsing Data:</strong> جدول مسحاً تلقائياً للذاكرة المؤقتة وcookies والسجل عند إعادة تشغيل المتصفح.</li>
</ul>

<h3>أفضل ممارسات إعداد الإضافات</h3>
<ul>
  <li>ضع في القائمة البيضاء لـ Cookie AutoDelete النطاقات الضرورية فقط (claude.ai، anthropic.com).</li>
  <li>اضبط User-Agent Switcher ليطابق نظام التشغيل وإصدار المتصفح المتوافق مع منطقة خروج البروكسي.</li>
  <li>عطّل الإضافات التي تتطلب صلاحيات واسعة أو تحقن نصوصاً في كل الصفحات.</li>
</ul>
`;
