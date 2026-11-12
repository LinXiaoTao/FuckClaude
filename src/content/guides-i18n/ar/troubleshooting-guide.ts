export const content = `
<h2>1. تشخيص فشل تسجيل الدخول (403/429/500)</h2>
<p>فشل تسجيل الدخول يُربط عادة بأسباب جذرية محددة وفق رموز حالة HTTP ورسائل الخطأ:</p>

<h3>مصفوفة رموز الخطأ</h3>
<table>
  <thead>
    <tr>
      <th>رمز الحالة</th>
      <th>رسالة الخطأ</th>
      <th>السبب الجذري</th>
      <th>الحل</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>403 Forbidden</strong></td>
      <td>"Access denied"</td>
      <td>حظر IP أو IP مركز بيانات عالي المخاطر</td>
      <td>انتقل إلى بروكسي سكني، امسح ملفات تعريف الارتباط، أعد المحاولة بعد ساعة</td>
    </tr>
    <tr>
      <td><strong>429 Too Many Requests</strong></td>
      <td>"Rate limit exceeded"</td>
      <td>تجاوز محاولات الدخول أو حد معدل API</td>
      <td>انتظر 15 دقيقة، طبّق تراجعاً أسياً</td>
    </tr>
    <tr>
      <td><strong>500 Internal Server Error</strong></td>
      <td>"Something went wrong"</td>
      <td>خلل في خلفية Anthropic أو حالة جلسة غير صالحة</td>
      <td>امسح كل cookies لـ claude.ai، أعد تشغيل المتصفح، أعد المحاولة</td>
    </tr>
    <tr>
      <td><strong>Account Disabled</strong></td>
      <td>"Your account has been disabled"</td>
      <td>مخالفة شروط الخدمة أو مشكلة دفع</td>
      <td>راجع البريد لسبب الحظر، اتبع إجراء الاستئناف</td>
    </tr>
  </tbody>
</table>

<h3>إجراء التشخيص</h3>
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

<h2>2. استكشاف أخطاء استدعاء API</h2>
<p>فشل API يتطلب تشخيصاً منهجياً للشبكة والمصادقة وتحديد المعدل:</p>

<h3>أخطاء API الشائعة</h3>
<ul>
  <li><strong>401 Unauthorized:</strong> مفتاح API غير صالح أو ملغى. تحقق من المفتاح في Anthropic Console وأعد توليده عند الحاجة.</li>
  <li><strong>429 Rate Limit:</strong> تجاوزت المنظمة حصة RPM (طلبات في الدقيقة) أو TPM (رموز في الدقيقة). طبّق تحديد معدل من جهة العميل.</li>
  <li><strong>529 Overloaded:</strong> خلفية Anthropic بكامل طاقتها. أعد المحاولة بتراجع أسي (2^n ثانية مع jitter).</li>
  <li><strong>Timeout:</strong> الطلب تجاوز مهلة 60 ثانية. قسّم المطالبات الكبيرة أو قلّل max_tokens.</li>
</ul>

<h3>سكربت تصحيح API</h3>
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

<h2>3. السبب الجذري لفشل ربط الدفع</h2>
<p>Anthropic لا تتلقى سبب الرفض من البنك، لذا راجع الأسباب المحتملة بالترتيب. <a href="/guides/payment-methods-comparison/">دليل طرق الدفع</a> يتضمن القائمة الرسمية الكاملة:</p>

<ul>
  <li><strong>رفض البطاقة:</strong> رصيد غير كافٍ، CVV غير صالح، أو بطاقة منتهية. تأكد أن الرصيد يغطي المبلغ كاملاً.</li>
  <li><strong>نوع بطاقة غير مقبول:</strong> Pro وMax يذكران بطاقات ائتمان وخصم فقط، فقد تُرفض البطاقة مسبقة الدفع لذلك وحده. Anthropic لا تنشر BIN المحظورة.</li>
  <li><strong>عدم تطابق العنوان:</strong> عنوان الفوترة يجب أن يطابق سجل البنك وبلد إصدار البطاقة، وأن يكون موقع فوترة مؤهل.</li>
  <li><strong>3D Secure غير مكتمل:</strong> أكّد رمز SMS أو مطالبة تطبيق البنك عند طلب البنك ذلك.</li>
  <li><strong>محاولات متكررة:</strong> أعد المحاولة مرة واحدة ثم اسأل البنك. فقط جهة الإصدار تشرح سبب الرفض.</li>
</ul>

<h2>4. أسئلة شائعة وإصلاحات سريعة</h2>

<h3>س: «Claude يقول إن جلستي انتهت لكنني سجّلت الدخول للتو»</h3>
<p><strong>ج:</strong> cookies الجلسة مرتبطة بـ IP وبصمة الجهاز. تغيّر IP السريع يبطل الجلسة. الحل: فعّل 2FA لتقليل مطالبات إعادة التحقق، وحافظ على IP ثابت لكل جلسة.</p>

<h3>س: «API يعيد استجابات مخزّنة لمطالبات جديدة»</h3>
<p><strong>ج:</strong> Prompt Cache يطابق محتوى غير مقصود. الحل: أضف معرّفاً فريداً أو طابع زمني لإجبار miss للتخزين المؤقت: <code>{prompt} [request_id: {Date.now()}]</code>.</p>

<h3>س: «WebRTC يعرض IP الحقيقي رغم استخدام البروكسي»</h3>
<p><strong>ج:</strong> WebRTC يتجاوز البروكسي لاتصالات النظير. الحل: عطّل WebRTC بالكامل في إعدادات المتصفح أو استخدم إضافة WebRTC Control لحجب طلبات STUN.</p>

<h3>س: «الحساب فجأة يطلب التحقق بالهاتف»</h3>
<p><strong>ج:</strong> يُفعَّل بتغيير IP أو دخول من جهاز جديد أو نشاط مشبوه. الحل: استخدم خدمة تحقق SIM فعلية، واربط 2FA فور التحقق لتقليل إعادة المطالبة.</p>
`;
