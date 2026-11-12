export const content = `
<p>يرسل Claude Code وتكاملات API المخصصة أكثر من الـ prompts؛ فهي تصدر بيانات وصفية للبيئة وخيارات التوجيه وسلوك إعادة المحاولة التي قد تربطها الأنظمة upstream بصحة الحساب. تركز هذه الدليل على <em>الأمان التشغيلي</em>: تهيئة shell متسقة، واختيار البوابة، والتحويل الاحتياطي السلس عندما تشتد الحصص. الهدف سير عمل هندسي موثوق، وليس التحايل على سياسة Anthropic.</p>

<p>ابدأ بخط أساس نظيف: <a href="/guides/environment-cleanup-and-ip-setup/">تنظيف البيئة وإعداد IP</a> و<a href="/guides/vpn-and-proxy-selection/">اختيار VPN والـ proxy</a> قبل ضبط متغيرات CLI. إذا شغّلت relays أو موجهات متعددة النماذج، اقرأ أيضاً <a href="/guides/domestic-and-open-source-alternatives/">البدائل المحلية ومفتوحة المصدر</a> لمسارات التدهور.</p>

<h2>1. إعدادات أمان Claude Code</h2>
<p>يقرأ Claude Code متغيرات بيئة shell عند التشغيل. المنطقة الزمنية أو الـ proxy أو عنوان base URL غير المتسقة قد تسبب أخطاء مربكة، أو تجعل العميل يتصرف بشكل مختلف عن جلسة المتصفح. اعتبر الطرفية بيئة أساسية وليست فكرة لاحقة.</p>

<h3>متغيرات البيئة الأساسية</h3>
<pre><code># ~/.zshrc or ~/.bashrc — load in every interactive shell

# 1. Declare custom Anthropic-compatible endpoints explicitly
export ANTHROPIC_BASE_URL="https://your-gateway.example.com"
export ANTHROPIC_API_KEY="sk-your-key"

# 2. When using a trusted first-party-shaped gateway, reduce client mismatch warnings
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 3. Align terminal timezone with your documented operating region
export TZ=Asia/Tokyo   # or America/Los_Angeles — match proxy geo

# 4. Route CLI HTTPS through the same clean proxy as your browser (if required)
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export NO_PROXY="localhost,127.0.0.1,.internal"</code></pre>

<h3>قائمة تحقق التهيئة</h3>
<ol>
  <li><strong>مصدر واحد للحقيقة:</strong> خزّن المتغيرات في <code>~/.zshrc</code> (macOS) أو ملف مخصص <code>~/.claude/env</code> يُحمَّل في shell — وتجنّب التصدير المؤقت في تبويب طرفية واحد.</li>
  <li><strong>تحقق قبل التشغيل:</strong> نفّذ <code>env | grep -E 'ANTHROPIC|TZ|PROXY'</code> في نفس النافذة التي تبدأ منها Claude Code.</li>
  <li><strong>واءِم جغرافيا المتصفح وCLI:</strong> إذا كان ملف تعريف المتصفح يستخدم منطقة زمنية طوكيو عبر أدوات anti-detect، فلا ينبغي أن يبلغ CLI عن <code>Asia/Shanghai</code>.</li>
  <li><strong>وثّق تغييرات base URL:</strong> عند الانتقال من Anthropic مباشرة إلى relay، حدّث <code>ANTHROPIC_BASE_URL</code> وrunbooks الداخلية حتى لا يخلط الزملاء بين نقاط النهاية.</li>
  <li><strong>نظافة الأسرار:</strong> لا ترفع مفاتيح API إلى المستودع؛ استخدم <code>chmod 600</code> على ملفات env ودوّر مفاتيح relay كل ربع سنة.</li>
</ol>

<h3>ماذا يفعل <code>_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL</code> وماذا لا يفعل</h3>
<p>يخبر هذا العلم Claude Code بمعاملة <code>ANTHROPIC_BASE_URL</code> غير الافتراضي كما لو كان endpoint Anthropic القياسي لبعض فحوصات جانب العميل. يقلل الاحتكاك عندما تشغّل مؤسستك بوابة داخلية معتمدة. إنه <strong>لا</strong> يغيّر السياسة من جانب الخادم ولا الفوترة ولا الأهلية. لكيفية تقييم بيانات وصفية للعميل قد تبقى مُقيَّمة، راجع <a href="/guides/claude-steganography-and-risk-model/">الإخفاء في Claude ونموذج المخاطر</a>.</p>

<h3>أعطال شائعة بسبب سوء التهيئة</h3>
<ul>
  <li><strong>انقسام الـ proxy:</strong> المتصفح يستخدم VPN والـ CLI لا — الطلبات من ASN مختلفة. العرض: الدردشة على الويب تعمل والـ CLI يرجع 403.</li>
  <li><strong><code>NO_PROXY</code> قديم:</strong> البوابة المحلية على <code>127.0.0.1</code> يجب أن تتجاوز proxy الشركة وإلا فشل الحلقة مع connection reset.</li>
  <li><strong>نطاق مفتاح API خاطئ:</strong> مفاتيح المؤسسة مقابل مفاتيح المشروع تتصرف بشكل مختلف تحت حدود المعدل؛ أكد نوع المفتاح في console Anthropic.</li>
  <li><strong>shell تفاعلي مقابل غير تفاعلي:</strong> وظائف CI التي تستدعي Claude Code يجب أن تحمّل نفس ملف env؛ login shells على الحواسيب المحمولة غالباً تخفي exports ناقصة.</li>
</ul>

<h2>2. اختيار بوابات relay لـ API</h2>
<p>عندما يكون الوصول المباشر إلى <code>api.anthropic.com</code> مقيداً بالتوجيه أو المشتريات، قد يحسّن relay التوفر — إذا حافظ على دقة البروتوكول. بوابة رديئة تزيل العناوين بصمت أو تعيد كتابة الـ prompts أو تضيف قفزات زمنية تبدو كتراجع في جودة النموذج.</p>

<h3>مصفوفة تقييم البوابة</h3>
<table>
  <thead>
    <tr>
      <th>المعيار</th>
      <th>نجاح</th>
      <th>فشل (استبدل البوابة)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>عناوين Prompt Cache</td>
      <td>يمرّر <code>anthropic-beta: prompt-caching-2024-07-15</code> (أو beta الحالي) دون تغيير</td>
      <td>يزيل عناوين beta؛ cache read tokens دائماً صفر</td>
    </tr>
    <tr>
      <td>سلامة system prompt</td>
      <td>relay بايت-بايت متطابق لكتل system</td>
      <td>يحقن إعلانات أو علامة مائية أو بادئات «مساعدة»</td>
    </tr>
    <tr>
      <td>بث SSE</td>
      <td>يحافظ على حدود الأحداث وdeltas الأدوات</td>
      <td>يخزّن الاستجابة كاملة قبل الإرسال؛ يكسر واجهة الأدوات</td>
    </tr>
    <tr>
      <td>شفافية الأخطاء</td>
      <td>يمرّر رموز حالة Anthropic والأجسام</td>
      <td>يحوّل كل شيء إلى 502 عام</td>
    </tr>
    <tr>
      <td>حياد اسم المضيف</td>
      <td>نطاق محايد (مثل <code>api.yourcorp.net</code>)</td>
      <td>أسماء عامة بكلمات بائع AI غير ذات صلة أو TLD <code>.cn</code> لحركة Claude فقط</td>
    </tr>
    <tr>
      <td>TLS وتثبيت الشهادة</td>
      <td>CA عام صالح، HSTS، بلا SSL inspection MITM</td>
      <td>كسر SSL للشركة دون تحديث مخزن ثقة العميل</td>
    </tr>
  </tbody>
</table>

<h3>الحفاظ على Prompt Cache (أثر التكلفة)</h3>
<p>قد يخفّض Prompt Cache لدى Anthropic تكلفة الإدخال المتكرر حتى 90%. البوابات التي تحذف عناوين cache تفرض تسعير input كامل في كل دورة — غالباً مفاجأة 4×–10× على system prompts طويلة. تحقق باختبار طلبين:</p>
<pre><code># Request 1: create cache
curl -s "$ANTHROPIC_BASE_URL/v1/messages" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: prompt-caching-2024-07-15" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":64,
       "system":[{"type":"text","text":"'$(python3 -c "print('x'*5000)")'",
         "cache_control":{"type":"ephemeral"}}],
       "messages":[{"role":"user","content":"ping"}]}'

# Request 2: expect cache_read_input_tokens &gt; 0 in usage</code></pre>
<p>أنماط التحسين المتقدمة في <a href="/guides/api-advanced-optimization/">تحسين API المتقدم</a>.</p>

<h3>العناية الواجبة التشغيلية قبل الإنتاج</h3>
<ul>
  <li>شغّل مسبارات تركيبية 24 ساعة (رسالة كل 15 دقيقة) لقياس p95 للزمن والخطأ.</li>
  <li>سجّل عينة من request IDs؛ تأكد أن تطبيقك يربط سجلات البوابة بمعرّفات upstream للحوادث.</li>
  <li>راجع اتفاقية معالجة البيانات: بعض الـ relays يسجّل prompts لكشف إساءة الاستخدام — غير مقبول لأحمال خاضعة للتنظيم.</li>
  <li>فضّل بوابات تتحكم بها مؤسستك (LiteLLM مستضاف ذاتياً، One-API على VPC) على موزعين عامين غامضين عند التعامل مع كود المصدر.</li>
</ul>

<p>استقرار الحساب ما زال يعتمد على نظافة التسجيل — راجع <a href="/guides/account-registration-and-payment-antiban/">التسجيل والدفع ومكافحة الحظر</a> إذا صادف اعتماد relay إنشاء مؤسسة جديدة.</p>

<h2>3. حدود المعدل (429) والتحويل الاحتياطي السلس</h2>
<p>تطبّق حدود معدل Anthropic على مستوى المؤسسة ودرجة النموذج، وليس لكل مفتاح API بمعزل. وكلاء الطفرات ووظائف CI المتوازية وحلقات إعادة المحاولة غير المحدودة قد تستنفد الحصة المشتركة وتعطل خدمات أخرى في نفس المؤسسة.</p>

<h3>أصناف الحد (مبسّطة)</h3>
<table>
  <thead>
    <tr>
      <th>الإشارة</th>
      <th>رمز HTTP</th>
      <th>المعنى</th>
      <th>استجابة آمنة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>حد المعدل</td>
      <td>429</td>
      <td>طلبات أو tokens كثيرة في الدقيقة</td>
      <td>تراجع أُسّي + jitter؛ خفّض التزامن</td>
    </tr>
    <tr>
      <td>حمولة زائدة</td>
      <td>529</td>
      <td>سعة upstream</td>
      <td>تراجع قصير؛ خفض اختياري لدرجة النموذج</td>
    </tr>
    <tr>
      <td>مصادقة / سياسة</td>
      <td>403</td>
      <td>مفتاح غير صالح أو رفض وصول</td>
      <td>لا تعيد المحاولة عمياناً؛ تحقق من حالة الحساب</td>
    </tr>
    <tr>
      <td>طلب خاطئ</td>
      <td>400</td>
      <td>مخطط أو حد tokens</td>
      <td>أصلح الحمولة؛ قصّ السياق</td>
    </tr>
  </tbody>
</table>

<h3>نمط إعادة المحاولة والتحويل الاحتياطي</h3>
<pre><code>// TypeScript — retry 429/529, failover on sustained pressure
async function callClaudeWithFallback(prompt: string, opts: CallOpts) {
  const maxRetries = 4;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callClaudeAPI(prompt, opts);
    } catch (error: any) {
      const status = error?.status;
      if (status === 429 || status === 529) {
        const delay = Math.min(30_000, 500 * 2 ** attempt + Math.random() * 250);
        await sleep(delay);
        continue;
      }
      if (status === 403) throw error; // surface auth issues
      throw error;
    }
  }
  console.warn('Claude quota saturated; failing over to backup upstream');
  return await callFallbackAPI(prompt, opts); // DeepSeek / GLM / local — see alternatives guide
}</code></pre>

<h3>ضوابط التزامن</h3>
<ul>
  <li><strong>دلو tokens في CI:</strong> احدُد وظائف الوكيل المتوازية (مثل 3 كحد أقصى) لكل مؤسسة.</li>
  <li><strong>دمج الطلبات:</strong> اجمع إصلاحات lint الصغيرة في استدعاء API واحد عند الإمكان.</li>
  <li><strong>قاطع دائرة:</strong> بعد N من 429 متتالية، افتح الدائرة 60 ثانية ووجّه تلقائياً للاحتياطي — يمنع عواصف إعادة المحاولة.</li>
  <li><strong>القابلية للمراقبة:</strong> صدّر مقاييس: <code>claude_requests_total{status}</code>، <code>fallback_invocations_total</code>، p95 للزمن. نبّه عندما يتجاوز معدل الاحتياطي 15% لمدة 10 دقائق.</li>
</ul>

<h3>403 مقابل 429: لا تعاملهما بنفس الطريقة</h3>
<p>429 ضغط مؤقت — تراجع ثم استأنف. 403 غالباً يعني إبطال اعتماد أو قيد جغرافي أو تغيّر حالة حساب. إعادة محاولة 403 بمفاتيح بديلة دون تشخيص قد تسرّع الإنفاذ. استخدم <a href="/guides/troubleshooting-guide/">دليل استكشاف الأخطاء</a> لتصنيف الأخطاء قبل تدوير البنية التحتية.</p>

<h2>الأسئلة الشائعة</h2>

<h3>هل أضبط <code>TZ</code> إذا كانت منطقة النظام الزمنية صحيحة أصلاً؟</h3>
<p>إذا كانت المنطقة الزمنية للنظام وجغرافيا خروج الـ proxy وملف تعريف المتصفح متوافقة، قد يكون تصدير <code>TZ</code> صريحاً زائداً — لكن حاويات CI غالباً افتراضياً UTC. التصدير الصريح يجعل السلوك حتمياً بين الحواسيب المحمولة والخوادم.</p>

<h3>هل موزع API عام «آمن» لكود مصدر الشركة؟</h3>
<p>عامله كأي معالج فرعي ثالث: راجع التسجيل والاحتفاظ وقائمة المعالجين الفرعيين. للكود الخاص، relay مستضاف ذاتياً على VPC الخاص بك أكثر أماناً بكثير من موزعين مجهولين.</p>

<h3>لماذا تختفي وفورات cache بعد تبديل البوابات؟</h3>
<p>الأشيع أن الـ relay يزيل عناوين <code>anthropic-beta</code> أو يعيد ترتيب كتل system، فيبطل مفاتيح cache. أعد اختبار cache بطلبين بعد أي تغيير بوابة.</p>

<h3>هل يمكنني استخدام proxies مختلفة للمتصفح وClaude Code؟</h3>
<p>تقنياً نعم، لكنك تزيد مخاطر التباعد. فضّل مسار خروج موثّقاً واحداً لكل حركة Claude ما لم تعزل حسابات تجريبية في ملفات تعريف منفصلة.</p>

<h3>ما النموذج الاحتياطي الذي يجب أن يستخدمه Claude Code عند 429؟</h3>
<p>Claude Code نفسه بلا failover متعدد النماذج مدمج — نفّذه عند البوابة (One-API/LiteLLM) أو عطّل Claude Code مؤقتاً واستخدم إضافات IDE موجهة لـ APIs احتياطية. راجع <a href="/guides/domestic-and-open-source-alternatives/">البدائل المحلية ومفتوحة المصدر</a> لجداول التوجيه.</p>

<h3>كيف أستكشف «يعمل في curl ويفشل في Claude Code»؟</h3>
<ol>
  <li>قارن العناوين: التقط curl مقابل CLI بـ mitmproxy أو سجلات وصول البوابة.</li>
  <li>أكد env في shell التشغيل: طرفيات IDE المدمجة أحياناً تتخطى ملفات rc لتسجيل الدخول.</li>
  <li>تحقق من وكلاء proxy لـ Node/fetch — بعض الإصدارات تتجاهل <code>HTTPS_PROXY</code> ما لم يُضبط <code>GLOBAL_AGENT_HTTP_PROXY</code>.</li>
  <li>تحقق من اعتراض TLS على شبكات الشركة.</li>
</ol>

<h3>هل افتراض first-party base URL يؤثر على فوترة Anthropic؟</h3>
<p>لا. الفوترة تتبع مفتاح API والمؤسسة المرتبطين بـ upstream الذي يخدم الطلب فعلياً. إذا كانت بوابتك تمرّر إلى Anthropic تدفع لـ Anthropic؛ إذا بدّلت النماذج تدفع لمزود البوابة الذي تستدعيه.</p>
`;
