export const content = `
<h2>1. مواءمة إعدادات المنطقة في نظام التشغيل والمتصفح</h2>
<p>عندما لا تتطابق منطقة زمن النظام، وإعدادات المنطقة المحلية، وقائمة لغات المتصفح، ومنطقة خروج الشبكة، قد تُعلّم أنظمة المخاطر الآلية الجلسة، حتى للمستخدمين الشرعيين الذين يصلون إلى Claude من بلدان مدعومة عبر VPN أو أثناء السفر. الهدف العملي هو <strong>مواءمة بيئتك مع منطقة الحساب</strong> بحيث تقرأ الإشارات بشكل متسق، ما يقلل الإيجابيات الكاذبة بدل محاولة إخفاء هويتك بالكامل.</p>

<p>يركز هذا الدليل على النظافة على مستوى النظام والمتصفح. لإعدادات كل متصفح في Chrome وFirefox وEdge، راجع <a href="/guides/browser-configuration-guide/">دليل إعداد المتصفح</a>. لتفاصيل macOS وWindows وLinux والجوال، راجع <a href="/guides/device-setup-guide/">دليل إعداد الأجهزة عبر المنصات</a>.</p>

<h3>لماذا تُطلق التناقضات مراجعات</h3>
<p>مورّدو مكافحة الاحتيال يربطون بين locale الخاص بـ <code>Intl</code>، و<code>navigator.languages</code>، وإزاحة المنطقة الزمنية، ومقاييس الخطوط، والموقع الجغرافي لعنوان IP. عنوان IP من طوكيو مع منطقة زمنية بكين و<code>zh-CN</code> كلغة رئيسية للمتصفح يختلف عن المستخدمين الإقليميين المعتادين؛ هذا النمط هو ما تستهدفه القواعد الآلية.</p>

<h3>أوامر المنطقة الزمنية في macOS / Linux</h3>
<pre><code># macOS: Set system timezone to match your account region
sudo systemsetup -settimezone "America/Los_Angeles"
# Or for JP/SG accounts:
sudo systemsetup -settimezone "Asia/Tokyo"

# Linux (Ubuntu/Debian)
sudo timedatectl set-timezone America/Los_Angeles

# Verify
date
# Expected: local time matching proxy exit region (PST, JST, etc.)</code></pre>

<h3>قائمة تحقق لغة المتصفح وبصمة الخطوط</h3>
<ul>
  <li><strong>ترتيب اللغات:</strong> ضع <code>en-US</code> (حسابات US) أو <code>ja-JP</code> (حسابات JP) أولاً في <code>navigator.languages</code>. انقل <code>zh-CN</code> دون الإنجليزية أو أزلها من الملف الشخصي النشط المستخدم مع Claude.</li>
  <li><strong>locale في Intl:</strong> تأكد أن <code>Intl.DateTimeFormat().resolvedOptions().locale</code> يحل إلى المنطقة المستهدفة (مثل <code>en-US</code>، وليس <code>zh-CN</code>).</li>
  <li><strong>خطوط مورّدي صين:</strong> MiSans وHarmonyOS Sans وOPPO Sans تنتج قياسات عرض مميزة على Canvas. استخدم ملفاً شخصياً مخصصاً للمتصفح دون تثبيت هذه الخطوط على مستوى النظام، أو ملفاً معزولاً anti-detect.</li>
  <li><strong>رأس Accept-Language:</strong> يجب أن يطابق أعلى إدخال في <code>navigator.languages</code>؛ التناقض بين رؤوس HTTP وواجهات JS يُعدّ متجه كشف معروفاً (موضّح في <a href="/guides/claude-steganography-and-risk-model/">دليل نموذج المخاطر</a>).</li>
</ul>

<h3>إعدادات المنطقة في نظام التشغيل مقابل منطقة الحساب</h3>
<table>
  <thead>
    <tr>
      <th>إشارة</th>
      <th>هدف حساب US</th>
      <th>هدف حساب JP/SG</th>
      <th>خطأ شائع</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>المنطقة الزمنية للنظام</td>
      <td>America/Los_Angeles أو America/New_York</td>
      <td>Asia/Tokyo أو Asia/Singapore</td>
      <td>إبقاء Asia/Shanghai مع IP من US</td>
    </tr>
    <tr>
      <td>لغة المتصفح الرئيسية</td>
      <td>en-US</td>
      <td>en-US أو ja-JP</td>
      <td>وضع zh-CN أولاً في قائمة اللغات</td>
    </tr>
    <tr>
      <td>تنسيق التاريخ/الأرقام</td>
      <td>MM/DD/YYYY، USD</td>
      <td>مناسب للـ locale</td>
      <td>رمز CNY في Intl.NumberFormat</td>
    </tr>
    <tr>
      <td>خطوط CJK مثبتة</td>
      <td>حدّ أدنى أو عزل في ملف شخصي</td>
      <td>حدّ أدنى أو عزل في ملف شخصي</td>
      <td>حزمة خطوط صينية كاملة من OEM</td>
    </tr>
  </tbody>
</table>

<h2>2. عقد البروكسي وعناوين IP السكنية ومنع التسرب</h2>
<p>تشير تقارير المجتمع إلى أن ASN لمراكز البيانات تُحجب أكثر من مزودي ISP السكنيين. مواءمة IP مع ISP سكني في بلد الحساب هي خط الأساس للوصول المستقر، وليست ضماناً ضد كل الحظر، لكنها شرط ضروري لتجنب الحظر الفوري. اقرأ <a href="/guides/vpn-and-proxy-selection/">دليل اختيار VPN والبروكسي</a> لمعايير تقييم المزود.</p>

<h3>مقارنة أنواع IP</h3>
<table>
  <thead>
    <tr>
      <th>فئة IP</th>
      <th>ملف ASN</th>
      <th>وصول Claude المعتاد</th>
      <th>ملاحظات</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ISP سكني (AT&T، Comcast، NTT)</td>
      <td>نطاق عريض للمستهلك</td>
      <td>أفضل استقرار</td>
      <td>طابق الولاية/المدينة مع الفوترة عند الإمكان</td>
    </tr>
    <tr>
      <td>IP مشغّل جوال (4G/5G)</td>
      <td>ISP خلوي</td>
      <td>جيّد لسيناريوهات السفر</td>
      <td>تتغير عناوين IP؛ تجنب التبديل أثناء الجلسة</td>
    </tr>
    <tr>
      <td>مركز بيانات / VPS</td>
      <td>ASN مزود سحابة</td>
      <td>غالباً محجوب أو CAPTCHA كثيف</td>
      <td>غير موصى به للتسجيل</td>
    </tr>
    <tr>
      <td>مجموعة بروكسي رخيصة مشتركة</td>
      <td>مختلطة، تُساء استخدامها بكثرة</td>
      <td>معدل حظر مرتفع</td>
      <td>جار سيء يؤثر على المجموعة بأكملها</td>
    </tr>
  </tbody>
</table>

<h3>منع تسرب WebRTC</h3>
<p>قد يكشف المتصفح عن IP محلي أو عام حقيقي عبر WebRTC حتى عندما يستخدم HTTP بروكسياً؛ بروكسي US في الرؤوس مع IP سكني من CN في WebRTC هو تناقض عالي الثقة.</p>
<ul>
  <li>عطّل WebRTC في إعدادات المتصفح أو عبر إضافات مثل <em>WebRTC Control</em> مع ضبط "Disable non-proxied UDP".</li>
  <li>في Firefox، اضبط <code>media.peerconnection.enabled = false</code> في <code>about:config</code>.</li>
  <li>اختبر على browserleaks.com/webrtc بعد كل تغيير للبروكسي أو الملف الشخصي.</li>
</ul>

<h3>منع تسرب DNS</h3>
<ul>
  <li>لا تحلّ <code>claude.ai</code> عبر DNS عام صيني (223.5.5.5، 119.29.29.29) أثناء عرض IP من US؛ تسرب الموقع الجغرافي لـ DNS يناقض عقدة الخروج.</li>
  <li>وجّه DNS عبر نفق البروكسي (Clash fake-ip، Sing-box remote DNS) أو استخدم DoH/DoT عبر Cloudflare (1.1.1.1) أو Google (8.8.8.8) على نفس مسار حركة HTTP.</li>
  <li>تحقق عبر dnsleaktest.com قبل تسجيل الدخول إلى Claude أو ربط الدفع (راجع <a href="/guides/account-registration-and-payment-antiban/">دليل التسجيل والدفع</a>).</li>
</ul>

<h2>3. قائمة تحقق عزل متصفح anti-detect</h2>
<p>حيث يدير فريق حسابات منفصلة بشكل شرعي (مثلاً مقاعد شركة فردية)، تحافظ متصفحات anti-detect (AdsPower، GoLogin، Multilogin، إلخ) على فصل واتساق إعدادات كل ملف شخصي. هذا نظافة للبيئة، وليس طريقة لتجاوز شروط Anthropic؛ مشاركة الحساب وتجنب الحظر والوصول من مناطق غير مدعومة تبقى مخالفة للقواعد.</p>

<ol>
  <li><strong>ملف شخصي مخصص لكل حساب:</strong> لا تشارك cookies أو localStorage بين مقاعد Pro.</li>
  <li><strong>اربط كل ملفاً شخصياً بـ IP سكني مخصص:</strong> يُفضّل الجلسات الثابتة (sticky)؛ وثّق أي IP يطابق أي حساب (<a href="/guides/multi-account-management/">إدارة حسابات متعددة</a>).</li>
  <li><strong>فعّل ضوضاء Canvas وقناع WebGL وعزل AudioContext:</strong> يمنع ارتباط البصمة بين الملفات الشخصية على الجهاز الفعلي نفسه.</li>
  <li><strong>مزامنة تلقائية لمنطقة زمن الملف مع موقع البروكسي:</strong> معظم أدوات anti-detect توفر ذلك؛ تحقق يدوياً بـ <code>Date()</code> في وحدة تحكم DevTools.</li>
  <li><strong>طابق User-Agent مع نظام التشغيل المعلَن:</strong> User-Agent لـ Windows على مضيف Mac مع سلاسل WebGL renderer غير متسقة تفشل فحوص الاتساق.</li>
</ol>

<h3>خطوات التحقق قبل الجلسة</h3>
<ol>
  <li>أكد المنطقة الزمنية: <code>new Date().getTimezoneOffset()</code> يطابق المنطقة المستهدفة.</li>
  <li>أكد اللغات: <code>navigator.languages</code> في DevTools.</li>
  <li>نفّذ اختبارات تسرب WebRTC وDNS.</li>
  <li>تحقق من ASN على ipinfo.io؛ هل هو سكني وليس سحابة؟</li>
  <li>بعد ذلك فقط افتح claude.ai أو تدفق OAuth لـ Claude Code.</li>
</ol>

<h3>ما لا تفعله</h3>
<ul>
  <li>لا تبدّل بلد البروكسي أثناء التسجيل أو الدفع؛ أكمل التدفق كله في منطقة واحدة.</li>
  <li>لا تستخدم إضافات VPN مجانية في المتصفح مع بروكسي سكني مدفوع؛ التوجيه المزدوج يسبب مخارج غير متوقعة.</li>
  <li>لا تسجّل الدخول لنفس الحساب من ملف anti-detect «نظيف» ومن Chrome يومي بإعدادات صينية؛ ستُربط البيئتان مع الوقت.</li>
  <li>لا تتجاهل تسرب IPv6؛ عطّل IPv6 على مستوى النظام أو تأكد أن بروكسيك يتعامل مع v6 إن كان مزودك يخصصه.</li>
</ul>

<h2>الأسئلة الشائعة</h2>

<h3>هل أحتاج متصفح anti-detect لحساب شخصي واحد؟</h3>
<p>ليس بالضرورة. ملف Chrome أو Firefox مخصص مع منطقة زمنية ولغات متوافقة، وWebRTC معطّل، وIP سكني مستقر يكفي لمعظم المستخدمين الأفراد. تضيف أدوات anti-detect قيمة عند إدارة حسابات متعددة أو عندما لا يمكن إعادة ضبط نظام التشغيل اليومي (مثل حاسوب شركة).</p>

<h3>هل يجب أن تطابق منطقتي الزمنية IP تماماً؟</h3>
<p>يجب أن تكون متسقة بشكل معقول. IP من الساحل الغربي لـ US مع <code>America/Los_Angeles</code> مثالي. IP من US مع منطقة زمنية <code>Asia/Shanghai</code> تناقض عالي المخاطر حتى لو كان IP صالحاً.</p>

<h3>هل يمكنني استخدام Claude على الجوال بنفس الحساب؟</h3>
<p>نعم، لكن locale نظام الجوال وIP يجب أيضاً أن يتوافقا مع منطقة حسابك عند الإمكان. التحول المفاجئ من ملف سطح مكتب US إلى شبكة CN جوال يطلق إعادة تحقق. راجع <a href="/guides/device-setup-guide/">إعداد الجهاز</a> لملاحظات iOS/Android.</p>

<h3>لماذا يعمل Claude في المتصفح بينما Claude Code يعيد 403؟</h3>
<p>Claude Code يستخدم بصمات TLS ورؤوس منفصلة عن المتصفح. تأكد أن منطقة زمن الطرفية (<code>TZ</code> env)، ومتغيرات البروكسي، وإعداد relay للـ API تطابق جلسة الويب. التفاصيل في <a href="/guides/claude-steganography-and-risk-model/">دليل نموذج المخاطر</a> ووثائق الاستراتيجية الإقليمية.</p>

<h3>كم مرة أعيد فحص بيئتي؟</h3>
<p>بعد أي تغيير لمزود البروكسي، أو تحديث للنظام، أو ترقية رئيسية للمتصفح، أو سفر. فحوص شهرية عشوائية (المنطقة الزمنية، WebRTC، DNS) تمنع الانحراف التدريجي الذي يتراكم خلال أشهر الاستخدام.</p>
`;
