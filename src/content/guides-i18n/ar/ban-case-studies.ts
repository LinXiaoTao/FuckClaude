export const content = `
<p><strong>ملاحظة:</strong> تفاصيل الحالات أدناه لم تُتحقق بشكل مستقل، والأسباب الجذرية تفسيرات وليست نتائج أكدتها Anthropic. أسباب الحظر الرسمية من Anthropic مُلخصة في <a href="/guides/antiban-essentials/">Anti-Ban Essentials</a>.</p>

<h2>1. الحالة 1: حظر جماعي بسبب تعارض المنطقة الزمنية</h2>
<p><strong>الحادث:</strong> فريق من 15 مطوراً سجّل حسابات Claude Pro أثناء السفر خارج البلاد. خلال 72 ساعة، حُظرت 12 حساباً بشكل دائم بإشعارات «انتهاك شروط الخدمة».</p>

<h3>تحليل السبب الجذري</h3>
<ul>
  <li>بقيت المنطقة الزمنية للنظام <code>Asia/Shanghai</code> (UTC+8) مع استخدام بروكسيات سكنية أمريكية.</li>
  <li>أعاد المتصفح <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code> القيمة <code>"Asia/Shanghai"</code>، ويقرأ Claude Code ذلك ويُرمزه في مطالبات النظام.</li>
  <li>رُبطت بطاقات الدفع بعناوين فوترة أمريكية، لكن تعارض المنطقة الزمنية أطلق مصنفات المخاطر الآلي.</li>
</ul>

<h3>قائمة الوقاية</h3>
<pre><code># Before registration, verify timezone alignment:
# macOS
sudo systemsetup -gettimezone

# Linux
timedatectl

# Ensure timezone matches proxy exit region:
sudo systemsetup -settimezone "America/New_York"</code></pre>

<ul>
  <li>اضبط منطقة وقت نظام التشغيل لتطابق منطقة خروج بروكسي IP <em>قبل</em> فتح Claude.ai.</li>
  <li>تحقق من المنطقة الزمنية في وحدة تحكم المتصفح: <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code>.</li>
  <li>امسح جميع cookies المتصفح وأعد التشغيل بعد تغيير المنطقة الزمنية لتفريغ البصمات المخزنة.</li>
</ul>

<h2>2. الحالة 2: استرداد بطاقة مسبقة الدفع وتعليق الحساب</h2>
<p><strong>الحادث:</strong> نُفذت رسوم ثمانية اشتراكات Claude Pro بنجاح في اليوم 1، لكن الحسابات أُستردت تلقائياً وعُلّقت خلال 48 ساعة.</p>

<h3>تحليل السبب الجذري</h3>
<ul>
  <li>استخدمت كل الحسابات بطاقات Visa افتراضية مسبقة الدفع صادرة تحت نفس BIN. لم تنشر Anthropic أي BIN تحظره، وبطاقات مسبقة الدفع غير مدرجة كمقبولة لـ Pro أو Max.</li>
  <li>كانت عناوين الفوترة عامة (مثل «123 Main St»)، وليست عناوين سكنية حقيقية تطابق منطقة بنك إصدار البطاقة.</li>
  <li>أُعيدت الرسوم ووُسمت الحسابات «Refunded / Suspended». لم توضح Anthropic السبب.</li>
</ul>

<h3>قائمة الوقاية</h3>
<ul>
  <li>استخدم بطاقة ائتمان أو خصم من بنك راسخ بدلاً من بطاقة افتراضية مسبقة الدفع.</li>
  <li>املأ عنوان الفوترة بعناوين أمريكية حقيقية قابلة للتحقق (استخدم بحث عناوين USPS) تطابق ولاية بروكسي IP.</li>
  <li>تأكد أن رصيد البطاقة يغطي الرسوم الأولى والتجديد التالي.</li>
  <li>لا تربط نفس البطاقة الافتراضية بأكثر من حسابي Claude.</li>
</ul>

<h2>3. الحالة 3: اكتشاف إساءة استخدام معدل API</h2>
<p><strong>الحادث:</strong> قُيّد مفتاح API لشركة ناشئة إلى طلب واحد في الدقيقة بعد تشغيل مهمة تقطير دفعية أرسلت 50,000 طلباً خلال 6 ساعات.</p>

<h3>تحليل السبب الجذري</h3>
<ul>
  <li>أرسل السكربت الطلبات بأقصى إنتاجية دون تحديد معدل أو jitter.</li>
  <li>كانت كل المطالبات متشابهة تقريباً مع اختلافات طفيفة في المعاملات، ما أطلق مصنفات اكتشاف التقطير من Anthropic.</li>
  <li>انطلقت الطلبات من IP واحد لمركز بيانات AWS EC2، ما رفع درجة مخاطر الإساءة أكثر.</li>
</ul>

<h3>قائمة الوقاية</h3>
<pre><code>// Implement exponential backoff and jitter in API client
async function callClaudeWithBackoff(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropic.messages.create({
        model: "claude-sonnet-4.5-high",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error: any) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}</code></pre>

<ul>
  <li>نفّذ تراجعاً أسياً مع jitter عشوائي (100-3000ms) بين استدعاءات API.</li>
  <li>دوّر مفاتيح API عبر منظمات متعددة إذا تخطيت 1000 طلب/ساعة.</li>
  <li>استخدم بروكسيات IP سكنية لحركة API، وليس أبداً IP مراكز بيانات.</li>
  <li>نوّع هيكل المطالبات وأدخل تباينات طبيعية شبيهة بالبشر لتجنب اكتشاف المصنف.</li>
</ul>

<h2>4. الحالة 4: حظر متسلسل بسبب ربط الحسابات</h2>
<p><strong>الحادث:</strong> حُظرت خمسة حسابات Claude في الوقت نفسه بعد أن خالف حساب واحد في المجموعة شروط الخدمة.</p>

<h3>تحليل السبب الجذري</h3>
<ul>
  <li>شاركت الحسابات الخمسة نفس <code>organizationUuid</code> لأنها سجّلت الدخول عبر Claude Code على نفس الجهاز بملفات متصفح مختلفة.</li>
  <li>رُبطت نفس بطاقة الائتمان الافتراضية بأربعة من الحسابات الخمسة.</li>
  <li>عندما وُسم حساب لاستخدام سكربت آلي، ربطت خوادم Anthropic كل الحسابات المرتبطة وطبقت حظراً شاملاً.</li>
</ul>

<h3>قائمة الوقاية</h3>
<pre><code># Check Claude Code's organizationUuid grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>لا تشارك بطاقات ائتمان افتراضية بين أكثر من حسابي Claude.</li>
  <li>استخدم أجهزة أو آلات افتراضية منفصلة للحسابات عالية القيمة لتجنب مشاركة <code>organizationUuid</code>.</li>
  <li>إذا استخدمت ملفات متصفح، تأكد أن كل ملف له cookies وlocalStorage وبصمات (Canvas، WebGL) معزولة بالكامل.</li>
  <li>تجنب العمليات الدفعية عبر حسابات مرتبطة خلال نوافذ زمنية قصيرة.</li>
</ul>

<h2>5. الدروس المستفادة وقائمة الوقاية الرئيسية</h2>
<p>كل حالة حظر تشترك في أنماط مشتركة. اتبع قائمة الفحص الرئيسية هذه لتقليل المخاطر:</p>

<ul>
  <li><strong>قبل التسجيل:</strong> زامن منطقة وقت نظام التشغيل، امسح حالة المتصفح، تحقق من IP سكني، جهّز رقماً وبطاقة متوافقين.</li>
  <li><strong>ربط الدفع:</strong> استخدم بطاقة ائتمان أو خصم من بنك راسخ، عنوان فوترة حقيقياً يطابق سجل البنك، رصيداً كافياً للتجديد، وتجنب إعادة استخدام بطاقة واحدة عبر عدة حسابات.</li>
  <li><strong>الاستخدام اليومي:</strong> حافظ على اتساق المنطقة الزمنية/IP/بصمة الجهاز، فعّل 2FA، وتجنب تغيير IP السريع دون إعادة مصادقة 2FA.</li>
  <li><strong>أتمتة API:</strong> نفّذ تحديد معدل، jitter، بروكسيات سكنية، وتنويع المطالبات لتجنب علامات التقطير.</li>
  <li><strong>حسابات متعددة:</strong> اعزل organizationUuid وطرق الدفع وأنماط الاستخدام لمنع حظر الارتباط.</li>
</ul>
`;
