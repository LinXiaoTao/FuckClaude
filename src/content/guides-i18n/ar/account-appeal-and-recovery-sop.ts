export const content = `
<h2>1. تشخيص حالة الحساب ونوع الحظر</h2>
<p>عند مواجهة مشاكل في الوصول إلى الحساب، حدّد أولاً نوع الحظر بدقة لاختيار إجراء الاستعادة المناسب:</p>

<ul>
  <li><strong>حظر منطقة IP (Access Denied / 403):</strong> رسالة «Claude is not available in your region». الحل: حسابك سليم؛ حدّث عقدة البروكسي إلى IP سكني في بلد مدعوم (US أو UK أو SG أو JP).</li>
  <li><strong>استرداد الاشتراك أو رفض الدفع:</strong> فشل الدفع ينهي وصول Pro ويعيد الحساب إلى الخطة المجانية. Anthropic لا تتلقى سبب الرفض من البنك ولا تنشر البطاقات التي تحظرها. الحل: اتبع <a href="/guides/payment-methods-comparison/">قائمة التحقق الرسمية لرفض الدفع</a>، ثم أعد ربط بطاقة ائتمان أو خصم يطابق عنوان الفوترة سجل البنك.</li>
  <li><strong>تعطيل الحساب نهائياً (Disabled):</strong> «Your account has been disabled after review». الحل: قدّم استئنافاً رسمياً بالإنجليزية عبر البوابة المخصصة على <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a>. يفتح النموذج فقط وأنت مسجّل الدخول إلى الحساب المعطّل. مركز المساعدة يذكر ثلاثة أسباب للحظر: تكرار مخالفات سياسة الاستخدام، إنشاء الحساب من موقع غير مدعوم، ومخالفات شروط الخدمة. من نفس الشاشة يمكنك تصدير بياناتك أو حذف الحساب؛ قد تكون البيانات القابلة للتصدير مقيدة حسب نوع المخالفة، لذا صدّر قبل الحذف. Anthropic تذكر أن أوقات الرد حالياً أطول من المعتاد.</li>
  <li><strong>تعليق المنظمة (Organization On Hold):</strong> حسابك الشخصي بحالة جيدة، لكن منظمة تنتمي إليها أوقفت بسبب نشاط غير اعتيادي. شاشة الحساب المقيد تعرض كل منظمة معلّقة. الحل: انقر «Request a review» على المنظمة المتأثرة.</li>
  <li><strong>تحذير مخالفة API / إيجابية خاطئة:</strong> تنبيهات API على مستوى المنظمة أو اشتباه في تصنيف خاطئ. الحل: أرسل بريداً إلى <a href="mailto:usersafety@anthropic.com">usersafety@anthropic.com</a> مع معرّفات الطلب وسياق الاستخدام.</li>
</ul>

<h2>2. بيانات الشفافية لنصف 2026 وتوقعات واقعية</h2>
<p>مركز الشفافية لدى Anthropic (آخر تحديث 23 يوليو 2026) يفيد أنه في النصف الأول من 2026 وحده تم تعطيل <strong>11.4 مليون</strong> حساب مخالف للسياسة، واستُلمت <strong>398,000</strong> استئنافاً، وأُعيد تفعيل <strong>42,000</strong> — أي معدل نجاح تقريبي <strong>10.5%</strong> للاستئنافات. هذه الأرقام تشمل كل الحسابات ولا تتنبأ بنتيجة حسابك. Anthropic لا تنشر ما يجعل الاستئناف ناجحاً. ما يمكنك التحكم به هو استئناف واقعي بسياق قابل للتحقق؛ وتقارير المجتمع تقول إن إنشاء حسابات بديلة أثناء المراجعة يزيد مخاطر الربط.</p>

<h2>3. إجراء استئناف بالإنجليزية قائم على الحقائق</h2>
<p>عند استئناف حساب معطّل، صِف فقط حقائق يمكنك التحقق منها. تفسير مخترع لا يُقارن بسجل الحساب ويضعف الاستئناف. املأ كل عنصر نائب بوضعك الحقيقي واحذف أي سطر لا ينطبق:</p>

<h3>قالب استئناف بالإنجليزية (املأ التفاصيل الحقيقية)</h3>
<pre><code>Subject: Appeal for Disabled Claude Account [Your-Email@domain.com]

Dear Anthropic Safeguards Team,

I am writing to request a review of my account (Email: [Your-Email@domain.com]), which was disabled on [date and time zone].

Notice received: "[exact text of the notice]"
Where I used Claude: [claude.ai / Claude Code / API]
How I use it: [your actual use, e.g. software development for project X, academic research at institution Y]
Network and location: [where you were located and how you connected, including any VPN or proxy, stated accurately]
Payment: [plan, type of payment method, and purchase date]

I have not shared my login, resold access, or used automation to bypass limits. [Delete this sentence if it is not accurate.]

Please review my account and let me know what additional information you need.

Thank you for your time.

Best regards,
[Your Name]</code></pre>
<p>قدّمه عبر نموذج الاستئناف وأنت مسجّل الدخول، واحتفظ بالإشعار ونسخة من طلبك، ولا تقدّم استئنافات مكررة ولا تفتح حسابات بديلة أثناء انتظار المراجعة.</p>

<h2>4. المبالغ المستردة بعد الحظر</h2>
<p>إذا عُطّل حسابك مباشرة بعد الدفع لـ Claude Pro أو Team:</p>

<ol>
  <li>قدّم بريد الاستئناف أعلاه أولاً.</li>
  <li>اطلب استرداداً داخل المنتج عبر Get help &gt; Claude Refund Request. للاشتراكات عبر App Store أو Google Play استخدم مسار الاسترداد لذلك المتجر. احتفظ برسائل «Your receipt from Anthropic».</li>
  <li>اعتبر نزاع البنك آخر حل بعد طلب الاسترداد. Anthropic لم تنشر أثر النزاعات المصرفية على الحساب.</li>
</ol>
`;
