export const content = `
<h2>1. تحليل حادثة التخفي في Claude Code</h2>
<p>في أبريل 2026، أظهرت الهندسة العكسية لـ CLI الرسمي <code>@anthropic-ai/claude-code</code> أنه عندما وجّه المستخدمون الطلبات عبر نقطة نهاية غير رسمية بـ <code>ANTHROPIC_BASE_URL</code>، نفّذ الـ CLI منطق كشف على جانب العميل دون إفصاح للمستخدم:</p>

<ul>
  <li><strong>فحص المنطقة الزمنية:</strong> قيّم ما إذا كانت المنطقة الزمنية للنظام <code>Asia/Shanghai</code> أو <code>Asia/Urumqi</code>. عند التطابق، غُيّر فاصل التاريخ في سطر system prompt <code>Today's date is 2026-06-30</code> من شرطات إلى شرطات مائلة: <code>2026/06/30</code>.</li>
  <li><strong>قائمة سوداء للمضيف وكلمات مختبرات AI:</strong> قارن مضيف الـ proxy بقائمة base64 مكونة من 147+ نطاقاً وكلمات مختبرات AI صينية (مثل <code>deepseek</code>، <code>moonshot</code>، <code>zhipu</code>، <code>minimax</code>، <code>dashscope</code>، <code>*.cn</code>) مشفّرة XOR (المفتاح: 91).</li>
  <li><strong>استبدال الفاصلة العليا Unicode:</strong> عدّل الفاصلة العليا في «Today's date» بمتغيرات Unicode متشابهة بصرياً:
    <ul>
      <li>تطابق المضيف مع قائمة نطاقات إعادة البيع → استبدال بـ <code>U+2019</code> (’ Right Single Quotation Mark)</li>
      <li>تطابق المضيف مع كلمات مختبرات AI → استبدال بـ <code>U+02BC</code> (Modifier Letter Apostrophe)</li>
      <li>تطابق الاثنين → استبدال بـ <code>U+02B9</code> (Modifier Letter Prime)</li>
    </ul>
  </li>
</ul>

<p>هذا الحمولة التخفية نجت من تمرير الـ proxy، ما يمكّن مصنّفات Anthropic الخلفية من تتبع حملات التقطير وإعادة البيع التجاري غير المصرّح به دون إضافة رؤوس HTTP صريحة.</p>

<h3>ضمانات البيئة والتخفيف</h3>
<pre><code># 1. Tell client to treat custom endpoint as first-party
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Override system timezone for CLI executions
export TZ=Asia/Tokyo

# Launch Claude Code
claude</code></pre>

<h2>2. نموذج التحكم بالمخاطر ذو الأربع طبقات لدى Anthropic</h2>
<p>تفرض Anthropic خط أنابيب أمان شامل لمكافحة الإساءة والتقطير عبر <code>claude.ai</code> ونقاط نهاية API وClaude Code:</p>

<ol>
  <li><strong>طبقة الشبكة وIP:</strong> نطاقات IP لمراكز البيانات (AWS، Hetzner، DigitalOcean، Linode) تُمنح درجات مخاطر مرتفعة. IP سكني مزدوج ISP مخصص في مناطق مدعومة (US، UK، SG، JP، TW) يحمل أدنى مخاطر.</li>
  <li><strong>بصمة المتصفح والجهاز:</strong> يجمع المنطقة الزمنية لنظام التشغيل (<code>Intl.DateTimeFormat</code>)، قائمة لغات المتصفح (<code>navigator.languages</code>)، استكشاف عرض Canvas لخطوط صينية (Microsoft YaHei، PingFang SC، MiSans)، ورؤوس User-Agent CH.</li>
  <li><strong>طبقة الدفع والهوية:</strong> BIN بطاقات افتراضية عالية المخاطر (مثل BIN بطاقات مسبقة الدفع المفرطة الإصدار)، بلدان عناوين فوترة غير متطابقة، وأرقام هاتف VoIP افتراضية تُفعّل إلغاء اشتراك فوري أو رفض دفع.</li>
  <li><strong>مصنّفات السلوك والتقطير:</strong> سكربتات آلية ترسل ملايين الـ prompts المتكررة، تشبعات متكررة لنافذة السياق، وإساءة استخدام prompt caching تُفعّل قفل حساب آلي وحصص المنظمة.</li>
</ol>
`;
