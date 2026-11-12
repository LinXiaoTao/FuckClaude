export const content = `
<p>عندما يصبح الوصول المباشر إلى Claude أو حصص API أو التوجيه الإقليمي غير موثوق، يحافظ مكدس احتياطي مصمم جيداً على استمرار خط التطوير. النماذج المحلية الرائدة والمكدسات مفتوحة المصدر المحلية ليست حيلاً لتجاوز السياسات؛ بل أدوات استمرارية مشروعة للفرق التي تحتاج زمن استجابة متوقعاً وتكلفة أقل لكل وحدة وبدائل تعمل دون اتصال. يقارن هذا الدليل بدائل عملية، ويرشد إعداد Ollama وOne-API، ويوضح كيفية توجيه الأحمال دون إعادة كتابة كل التكامل.</p>

<p>قبل نشر البدائل، اضبط بيئة الأساس. إذا بقي Claude المصدر الرئيسي، راجع أدلتنا عن <a href="/guides/environment-cleanup-and-ip-setup/">تنظيف البيئة وإعداد IP</a> و<a href="/guides/vpn-and-proxy-selection/">اختيار VPN والبروكسي</a>. للتحكم في تكلفة API على جانب Claude، اقرأ هذا الدليل مع <a href="/guides/api-advanced-optimization/">تحسين API المتقدم</a>.</p>

<h2>1. مقارنة النماذج المحلية الرائدة</h2>
<p>النماذج الصينية والإقليمية الرائدة تغطي اليوم أغلب مهام الهندسة اليومية: إكمال الكود، إعادة الهيكلة، توليد الاختبارات، تحليل السجلات، وأسئلة وأجوبة على مستندات طويلة. تختلف في طول السياق، دقة استدعاء الأدوات، عمق التفكير، والتسعير — وليس في إمكانية استبدال Claude بالكامل.</p>

<h3>مصفوفة مقارنة القدرات</h3>
<table>
  <thead>
    <tr>
      <th>النموذج</th>
      <th>الأفضل لـ</th>
      <th>نافذة السياق</th>
      <th>أدوات / JSON</th>
      <th>زمن استجابة نموذجي (CN)</th>
      <th>ملف التكلفة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>DeepSeek R1 / V3</td>
      <td>تفكير معقد، تصميم خوارزميات، إعادة هيكلة متعددة الملفات</td>
      <td>64K–128K (حسب API)</td>
      <td>استدعاء دوال قوي على V3</td>
      <td>منخفض (CDN محلي)</td>
      <td>منخفض جداً لكل رمز</td>
    </tr>
    <tr>
      <td>Kimi / Kimi Code</td>
      <td>قراءة على مستوى المستودع، مراجعة المواصفات، وثائق ثنائية اللغة</td>
      <td>حتى 2M رمز (منتج Code)</td>
      <td>جيد؛ الأفضل لابتلاع سياق طويل</td>
      <td>منخفض–متوسط</td>
      <td>مستوى متوسط؛ طبقات السياق الطويل تتفاوت</td>
    </tr>
    <tr>
      <td>GLM-4 (Zhipu AI)</td>
      <td>واجهات API مؤسسية، مخرجات منظمة، مهام دفعية</td>
      <td>128K نموذجي</td>
      <td>وضع JSON وأدوات ناضجة</td>
      <td>منخفض</td>
      <td>تسعير مؤسسي متوقع</td>
    </tr>
    <tr>
      <td>Qwen2.5-Coder محلي (Ollama)</td>
      <td>تطوير air-gapped، مقاطع حساسة للخصوصية، CI دون اتصال</td>
      <td>32K–128K (مقيد بالعتاد)</td>
      <td>عبر تعيين LiteLLM / One-API</td>
      <td>يعتمد على GPU</td>
      <td>عتاد وكهرباء فقط</td>
    </tr>
  </tbody>
</table>

<h3>اختيار النموذج حسب الحمل</h3>
<ul>
  <li><strong>DeepSeek R1 / V3:</strong> استخدم R1 عند الحاجة لتصحيح بنمط chain-of-thought أو منطق بمستوى البرمجة التنافسية. V3 أفضل افتراضياً لاستدعاءات API في الإنتاج: أسرع وأرخص وأكثر استقراراً لتوليد الكود. راقب حدود المعدل في ساعات الذروة؛ أجّل المهام الدفعية غير العاجلة خارج الذروة.</li>
  <li><strong>Kimi / Kimi Code:</strong> مثالي عندما يجب أن يبتلع مطالبة واحدة شجرة README كاملة لmonorepo ومواصفة OpenAPI وثلاث RFC. Kimi Code يضيف تدفقات موجهة للـ IDE. نمط الفشل: السياقات الطويلة جداً تُشتت التركيز — ابدأ بمخطط منظم ليرسخ النموذج على الأقسام.</li>
  <li><strong>GLM-4 / Zhipu AI:</strong> خيار قوي عندما يتطلب الامتثال فواتير وSLA ونقاط نهاية يمكن الوصول إليها من البر الرئيسي دون VPN. استدعاء الدوال وأوضاع مخطط JSON جاهزة للإنتاج. أقل ملاءمة لنقاشات معمارية مفتوحة من R1 أو Claude Opus.</li>
  <li><strong>مفتوح المصدر محلي (Qwen، DeepSeek مقطر، متغيرات Llama):</strong> الأفضل للكود المجاور للأسرار، البيئات المنظمة، أو عند حظر استدعاءات API الخارجية بالكامل. فجوة الجودة مقابل نماذج السحابة الرائدة أصغر في مهام محددة: إصلاح lint، قوالب، هياكل اختبار وحدة.</li>
</ul>

<h3>متى لا تنتقل</h3>
<p>أبقِ Claude (أو المصدر الرئيسي) للمهام عالية المخاطر التي تعتمد على ضبط أمان محدد، أو حلقات وكيل طويلة الأمد، أو تكاملات toolchain مُختبرة فقط مع نماذج Anthropic. البدائل تتفوق في <em>الاستمرارية</em>، لا في نسخ كل سلوك خاص بـ Claude. إذا كان وصول الحساب غير مستقر، اقرأ <a href="/guides/account-registration-and-payment-antiban/">تسجيل الحساب والدفع ضد الحظر</a> قبل افتراض أن نموذجاً محلياً يصلح مشكلة أهلية أساسية.</p>

<h2>2. إعداد Ollama وOne-API الخاص والتوافق مع Claude</h2>
<p>بوابة محلية أو خاصة تتحدث Messages API لـ Anthropic تبقي CLIs وإضافات IDE والسكربتات تعمل عند تغيير النموذج العلوي. طبقتان شائعتان: <strong>Ollama</strong> (وقت تشغيل النموذج) و<strong>One-API</strong> أو <strong>LiteLLM</strong> (ترجمة البروتوكول وإدارة المفاتيح).</p>

<h3>قائمة المتطلبات</h3>
<ul>
  <li>مضيف بذاكرة 16 GB+ لنماذج 7B–14B؛ 32 GB+ وGPU منفصلة لـ 32B+ بسرعة مقبولة.</li>
  <li>Docker (لـ One-API) أو Python 3.10+ (لـ LiteLLM).</li>
  <li>مفتاح API مخصص لكل بيئة (dev/staging/prod) — لا تعيد استخدام مفاتيح Claude الإنتاج على بوابة مشتركة.</li>
  <li>سياسة خروج شبكي موثّقة: محلي فقط أو داخل VPC أو VPN الفريق.</li>
</ul>

<h3>إعداد مسار Claude المحلي عبر Ollama</h3>
<pre><code># 1. Install Ollama (macOS/Linux)
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull a coding-oriented model (pick one tier)
ollama pull qwen2.5-coder:14b
ollama pull deepseek-r1:14b

# 3. Verify the OpenAI-compatible local endpoint
curl http://127.0.0.1:11434/v1/models

# 4. Deploy One-API (Anthropic/OpenAI aggregation)
docker run -d --name one-api \\
  -p 3000:3000 \\
  -v "$(pwd)/one-api-data:/data" \\
  justsong/one-api

# 5. In One-API admin UI (http://localhost:3000):
#    - Add channel: Ollama base URL http://host.docker.internal:11434
#    - Map model name to a Claude-compatible alias, e.g. claude-sonnet-fallback
#    - Create a separate API token for your team

# 6. Point tools at the gateway—not at Anthropic directly
export ANTHROPIC_BASE_URL="http://127.0.0.1:3000"
export ANTHROPIC_API_KEY="sk-one-api-token-from-admin"</code></pre>

<h3>بديل LiteLLM (نفس الهدف، مكدس مختلف)</h3>
<pre><code># pip install 'litellm[proxy]'
# config.yaml excerpt:
model_list:
  - model_name: claude-fallback
    litellm_params:
      model: ollama/qwen2.5-coder:14b
      api_base: http://127.0.0.1:11434

litellm --config config.yaml --port 4000</code></pre>

<h3>التحقق بعد النشر</h3>
<ol>
  <li>أرسل طلب Messages API بسيطاً (<code>max_tokens: 64</code>) وتأكد من HTTP 200.</li>
  <li>قارن حقول مخطط الاستجابة (<code>content</code>، <code>usage</code>) مع وثائق Anthropic — بعض البوابات تحذف <code>cache_creation_input_tokens</code>؛ ذلك متوقع على خلفيات غير Claude.</li>
  <li>نفّذ مهمة حقيقية من إضافة IDE أو Claude Code مع تعيين <code>ANTHROPIC_BASE_URL</code>؛ سجّل زمن الاستجابة وشكل الخطأ.</li>
  <li>وثّق التراجع: أزل متغيرات البيئة لاستعادة التوجيه المباشر إلى Anthropic في أقل من 30 ثانية.</li>
</ol>

<h3>أنماط فشل شائعة</h3>
<ul>
  <li><strong>Docker لا يصل إلى Ollama على المضيف:</strong> استخدم <code>host.docker.internal</code> (macOS/Windows) أو <code>--network host</code> (Linux).</li>
  <li><strong>النموذج يهلوس استدعاءات أدوات:</strong> عطّل الاستخدام الأصلي للأدوات في العميل أو وجّه إلى خلفية بدعم استدعاء دوال موثّق (قناة API لـ GLM-4 / DeepSeek V3 في One-API).</li>
  <li><strong>فيض السياق:</strong> نماذج 14B المحلية تتدهور فوق ~32K رمز فعّال؛ قصّ سياق المستودع أو وجّه المهام الطويلة إلى Kimi.</li>
  <li><strong>ذاكرة تخزين بوابة قديمة:</strong> بعد تبديل النموذج أعد تشغيل عملية الوكيل لتحديث جداول الاسم المستعار.</li>
</ul>

<p>نقاط النهاية المخصصة تتفاعل مع بصمة العميل. إذا استخدمت Claude Code مع base URL غير افتراضي، راجع <a href="/guides/claude-steganography-and-risk-model/">الإستغانوغرافيا في Claude ونموذج المخاطر</a> و<a href="/guides/claude-code-and-api-safety/">Claude Code وسلامة API</a> لنظافة البيئة — ليس تهرباً، بل إعداداً متسقاً يتجنب تسريب إشارات بالخطأ.</p>

<h2>3. استراتيجية توجيه مختلطة للنماذج</h2>
<p>التوجيه المختلط يخصص كل نوع طلب أرخص نموذج كافٍ. الهدف خفض التكلفة 90%+ على العمل الجماعي مع الإبقاء على Claude للمهام التي يتفوق فيها قياسياً على البدائل.</p>

<h3>قواعد توجيه مقترحة</h3>
<table>
  <thead>
    <tr>
      <th>نوع المهمة</th>
      <th>الأساسي</th>
      <th>الاحتياطي</th>
      <th>محفّز الاحتياطي</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>مراجعة معمارية / أمنية</td>
      <td>Claude Sonnet/Opus</td>
      <td>DeepSeek R1</td>
      <td>429 أو 403 أو SLA &gt; 30s</td>
    </tr>
    <tr>
      <td>توليد اختبارات وحدة</td>
      <td>DeepSeek V3</td>
      <td>Qwen Coder محلي</td>
      <td>انقطاع API</td>
    </tr>
    <tr>
      <td>أسئلة وأجوبة وثائق المستودع كاملاً</td>
      <td>Kimi Code</td>
      <td>GLM-4 سياق طويل</td>
      <td>أخطاء حد السياق</td>
    </tr>
    <tr>
      <td>تحرير بيانات تعريف شخصية / بجانب الأسرار</td>
      <td>Ollama محلي</td>
      <td>—</td>
      <td>محلي دائماً</td>
    </tr>
    <tr>
      <td>إصلاح تلقائي لـ lint في CI</td>
      <td>DeepSeek V3</td>
      <td>Qwen محلي</td>
      <td>بلوغ سقف التكلفة</td>
    </tr>
  </tbody>
</table>

<h3>مخطط تنفيذ</h3>
<pre><code>// Router pseudocode — keep Anthropic SDK shape
const ROUTES = [
  { match: /security|threat|architecture/i, upstream: 'claude' },
  { match: /generate tests|fix lint/i, upstream: 'deepseek-v3' },
  { match: /summarize repo|read spec/i, upstream: 'kimi' },
];

async function route(prompt: string) {
  const tier = ROUTES.find(r => r.match.test(prompt))?.upstream ?? 'deepseek-v3';
  try {
    return await callUpstream(tier, prompt);
  } catch (e) {
    if (isRetryable(e)) return await callUpstream('local-ollama', prompt);
    throw e;
  }
}</code></pre>

<h3>ممارسات تشغيلية</h3>
<ul>
  <li><strong>سقوف الميزانية:</strong> عيّن تنبيهاً للإنفاق اليومي لكل API سحابي؛ الفائض يذهب تلقائياً إلى Ollama محلي.</li>
  <li><strong>قوالب المطالبة:</strong> احتفظ بمطالبة نظام قياسية لكل نوع مهمة؛ النماذج المحلية غالباً تحتاج تعليمات صريحة لشكل المخرجات يستنتجها Claude ضمنياً.</li>
  <li><strong>حلقة تقييم:</strong> أسبوعياً، مرّر 20 مطالبة مرجعية عبر Claude والبدائل؛ تتبع معدل النجاح في الاختبارات ودرجة المراجعة البشرية. استبدل قواعد التوجيه عندما يتجاوز جودة الاحتياطي عتبتك.</li>
  <li><strong>خطط طوارئ:</strong> وثّق من يغيّر <code>ANTHROPIC_BASE_URL</code> ومن يوافق على توجيه أحمال حساسة إلى API طرف ثالث مقابل المحلي فقط.</li>
</ul>

<p>عند فشل الاحتياطي نفسه — مهلات البوابة، JSON أدوات مشوّه، أو 403 غامض — استخدم <a href="/guides/troubleshooting-guide/">دليل استكشاف الأخطاء</a> قبل تبديل النماذج عشوائياً.</p>

<h2>الأسئلة الشائعة</h2>

<h3>هل يمكن لـ One-API أن يستبدل Claude بالكامل لـ Claude Code؟</h3>
<p>يمكنه إبقاء CLI يعمل، لكن دقة الأدوات وسلوك الأمان سيختلفان. اعتبر One-API مسار تخفيض لمساعدة البرمجة، لا بديلاً بايتاً لبايت لـ Claude. تحقق من التعديلات الحرجة بالاختبارات والمراجعة.</p>

<h3>أي نموذج محلي الأقرب إلى Claude لعمل Python الخلفي؟</h3>
<p>DeepSeek V3 هو الافتراضي الشائع لتوليد كود خلفي وتصميم API. Kimi يفوز عندما يهيمن حجم المدخلات على التكلفة. GLM-4 الأقوى عند الحاجة لفوترة مؤسسية مستقرة ومخرجات مخطط JSON.</p>

<h3>هل Ollama المحلي آمن للكود المملوك؟</h3>
<p>البيانات تبقى على جهازك، لكن أوزان النموذج تعالج النص الصريح. للبيانات المنظمة استخدم مضيفات air-gapped وتشفير القرص وضوابط الوصول. الاستدلال المحلي يزيل مخاطر احتفاظ طرف ثالث؛ لا يزيل مخاطر الداخل أو البرمجيات الخبيثة.</p>

<h3>هل التوجيه عبر البدائل يقلل مخاطر حظر حساب Claude؟</h3>
<p>استخدام البدائل يقلل <em>الاعتماد</em> على توفر Claude؛ لا يمنح حساب Claude حصانة من تطبيق السياسة. أبقِ الحسابات والدفع والبيئات متوافقة — راجع <a href="/guides/account-registration-and-payment-antiban/">التسجيل والدفع ضد الحظر</a>.</p>

<h3>كيف أقدّر التوفير في التكلفة؟</h3>
<p>قِس الرموز لكل نوع مهمة لأسبوعين على Claude، ثم أعد تشغيل نفس المجموعة المرجعية على DeepSeek/Kimi. التوفير يعتمد على مزيج مهامك والنماذج التي تقارن؛ قِس على حملك الخاص بدل الاعتماد على رقم إعلاني. مراجعات المعمارية غالباً تبقى على Claude لأن وقت المراجعة البشرية هو الأغلب.</p>

<h3>ما العتاد المطلوب لسرعة محلية مقبولة؟</h3>
<p>Apple Silicon M2 Pro بذاكرة 32 GB يشغّل نماذج 14B تفاعلياً. فئة GPU مثل NVIDIA RTX 4090 أو A5000 تتعامل مع تكميم 32B لبوابات مشتركة لفِرق صغيرة. الاستدلال على CPU فقط مجدٍ لتعديل ملف واحد، لا لحلقات وكيل كبيرة.</p>
`;
