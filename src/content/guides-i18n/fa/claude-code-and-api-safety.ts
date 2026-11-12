export const content = `
<p>Claude Code و یکپارچه‌سازی‌های سفارشی API بیش از prompt ارسال می‌کنند؛ متادیتای محیط، انتخاب مسیر و رفتار تلاش مجدد را منتشر می‌کنند که سامانه‌های upstream ممکن است با سلامت حساب همبسته کنند. این راهنما روی <em>ایمنی عملیاتی</em> تمرکز دارد؛ پیکربندی یکنواخت shell، انتخاب gateway و failover نرم وقتی سهمیه‌ها سخت‌گیرانه‌تر می‌شوند. هدف گردش‌کار مهندسی قابل‌اعتماد است، نه دور زدن سیاست Anthropic.</p>

<p>ابتدا خط پایهٔ تمیز داشته باشید؛ قبل از تنظیم متغیرهای CLI، <a href="/guides/environment-cleanup-and-ip-setup/">پاک‌سازی محیط و راه‌اندازی IP</a> و <a href="/guides/vpn-and-proxy-selection/">انتخاب VPN و proxy</a> را انجام دهید. اگر relay یا روتر چندمدلی اداره می‌کنید، برای مسیرهای تخریب‌پذیری <a href="/guides/domestic-and-open-source-alternatives/">جایگزین‌های بومی و متن‌باز</a> را هم بخوانید.</p>

<h2>1. پیکربندی‌های امنیتی Claude Code</h2>
<p>Claude Code هنگام راه‌اندازی متغیرهای محیط shell را می‌خواند. تنظیم ناهم‌تراز منطقهٔ زمانی، proxy یا base URL می‌تواند خطاهای گیج‌کننده بدهد، یا باعث شود رفتار کلاینت با نشست مرورگر شما فرق کند. ترمینال را محیطی درجهٔ یک بدانید، نه فکر آخر.</p>

<h3>متغیرهای محیط اصلی</h3>
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

<h3>چک‌لیست پیکربندی</h3>
<ol>
  <li><strong>منبع واحد حقیقت:</strong> متغیرهای محیط را در <code>~/.zshrc</code> (macOS) یا فایل اختصاصی <code>~/.claude/env</code> که shell آن را source می‌کند نگه دارید؛ از export موردی در یک تب ترمینال پرهیز کنید.</li>
  <li><strong>قبل از راه‌اندازی بررسی کنید:</strong> در همان پنجره‌ای که Claude Code را شروع می‌کنید، <code>env | grep -E 'ANTHROPIC|TZ|PROXY'</code> را اجرا کنید.</li>
  <li><strong>هم‌راستایی جغرافیای مرورگر و CLI:</strong> اگر پروفایل مرورگر با ابزار ضدشناسایی منطقهٔ زمانی توکیو دارد، CLI نباید <code>Asia/Shanghai</code> گزارش کند.</li>
  <li><strong>تغییرهای base URL را مستند کنید:</strong> هنگام جابه‌جایی از Anthropic مستقیم به relay، هر دو <code>ANTHROPIC_BASE_URL</code> و runbook داخلی را به‌روز کنید تا هم‌تیمی‌ها endpoint را قاطی نکنند.</li>
  <li><strong>بهداشت اسرار:</strong> هرگز کلید API را commit نکنید؛ روی فایل‌های env <code>chmod 600</code> بگذارید و کلیدهای relay را فصلی rotate کنید.</li>
</ol>

<h3><code>_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL</code> چه می‌کند و چه نمی‌کند</h3>
<p>این پرچم به Claude Code می‌گوید برای برخی بررسی‌های سمت کلاینت، <code>ANTHROPIC_BASE_URL</code> غیرپیش‌فرض را مانند endpoint استاندارد Anthropic بپذیرد. اصطکاک را کم می‌کند وقتی سازمان gateway داخلی تأییدشده اجرا می‌کند. این پرچم سیاست سمت سرور، صورتحساب یا واجد شرایط بودن را <strong>تغییر نمی‌دهد</strong>. برای اینکه ممکن است متادیتای کلاینت چگونه ارزیابی شود، <a href="/guides/claude-steganography-and-risk-model/">مدل ریسک و استگانوگرافی Claude</a> را ببینید.</p>

<h3>خرابی‌های رایج پیکربندی اشتباه</h3>
<ul>
  <li><strong>proxy دوپاره:</strong> مرورگر VPN می‌گیرد؛ CLI نه؛ درخواست‌ها از ASNهای مختلف می‌آیند. علامت؛ چت وب کار می‌کند، CLI برمی‌گرداند 403.</li>
  <li><strong><code>NO_PROXY</code> کهنه:</strong> gateway محلی روی <code>127.0.0.1</code> باید proxy شرکتی را دور بزند وگرنه حلقه با connection reset شکست می‌خورد.</li>
  <li><strong>دامنهٔ اشتباه کلید API:</strong> کلید سازمان در برابر کلید پروژه تحت محدودیت نرخ رفتار متفاوت دارند؛ نوع کلید را در کنسول Anthropic تأیید کنید.</li>
  <li><strong>shell تعاملی در برابر غیرتعاملی:</strong> jobهای CI که Claude Code را صدا می‌زنند باید همان فایل env را source کنند؛ shellهای login روی لپ‌تاپ اغلب exportهای گم‌شده را پنهان می‌کنند.</li>
</ul>

<h2>2. انتخاب gatewayهای relay API</h2>
<p>وقتی دسترسی مستقیم به <code>api.anthropic.com</code> به‌خاطر مسیریابی یا تدارکات محدود است، relayها می‌توانند دسترس‌پذیری را بالا ببرند، اگر وفاداری پروتکل حفظ شود. gateway ضعیف بی‌صدا header می‌زداید، prompt بازنویسی می‌کند یا جهش تأخیر اضافه می‌کند که شبیه افت کیفیت مدل به نظر می‌رسد.</p>

<h3>ماتریس ارزیابی gateway</h3>
<table>
  <thead>
    <tr>
      <th>معیار</th>
      <th>قبول</th>
      <th>رد (gateway را عوض کنید)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>headerهای Prompt Cache</td>
      <td><code>anthropic-beta: prompt-caching-2024-07-15</code> (یا beta جاری) را بدون تغییر عبور می‌دهد</td>
      <td>headerهای beta را می‌زداید؛ توکن‌های cache read همیشه صفر</td>
    </tr>
    <tr>
      <td>یکپارچگی system prompt</td>
      <td>relay بایت‌به‌بایت یکسان بلوک‌های system</td>
      <td>تبلیغ، متن watermark یا پیشوندهای «مفید» تزریق می‌کند</td>
    </tr>
    <tr>
      <td>Streaming SSE</td>
      <td>مرز رویداد و delta ابزار را حفظ می‌کند</td>
      <td>کل پاسخ را بافر می‌کند بعد emit؛ UI ابزار می‌شکند</td>
    </tr>
    <tr>
      <td>شفافیت خطا</td>
      <td>کدهای وضعیت و بدنهٔ Anthropic را عبور می‌دهد</td>
      <td>همه را به 502 عمومی نگاشت می‌کند</td>
    </tr>
    <tr>
      <td>خنثی بودن hostname</td>
      <td>دامنهٔ خنثی (مثلاً <code>api.yourcorp.net</code>)</td>
      <td>hostname عمومی با کلیدواژهٔ غیرمرتبط فروشندهٔ AI یا TLD <code>.cn</code> فقط برای ترافیک Claude</td>
    </tr>
    <tr>
      <td>TLS &amp; cert pinning</td>
      <td>CA عمومی معتبر، HSTS، بدون MITM بازرسی SSL</td>
      <td>شکستن SSL شرکتی بدون به‌روزرسانی trust store کلاینت</td>
    </tr>
  </tbody>
</table>

<h3>حفظ Prompt Cache (اثر هزینه)</h3>
<p>کش prompt Anthropic می‌تواند هزینهٔ ورودی تکراری را تا ۹۰٪ کم کند. relayهایی که headerهای cache را حذف می‌کنند هر نوبت توکن ورودی با قیمت کامل می‌گیرند، اغلب شوک ۴× تا ۱۰× روی system promptهای بلند. با آزمایش دو درخواست تأیید کنید:</p>
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
<p>الگوهای بهینه‌سازی عمیق در <a href="/guides/api-advanced-optimization/">بهینه‌سازی پیشرفتهٔ API</a> است.</p>

<h3>بررسی عملیاتی قبل از production</h3>
<ul>
  <li>۲۴ ساعت probe مصنوعی (هر ۱۵ دقیقه یک پیام) با اندازه‌گیری p95 تأخیر و نرخ خطا.</li>
  <li>نمونه‌ای از request ID را لاگ کنید؛ تأیید کنید اپ می‌تواند لاگ gateway را با IDهای upstream برای incident همبسته کند.</li>
  <li>توافق‌نامهٔ پردازش داده را مرور کنید؛ برخی relayها برای تشخیص سوءاستفاده prompt لاگ می‌کنند، برای workloadهای تحت مقررات غیرقابل‌قبول است.</li>
  <li>ترجیح gatewayهایی که سازمان شما کنترل می‌کند (LiteLLM self-hosted، One-API روی VPC) بر resellerهای عمومی مبهم هنگام کار با کد منبع.</li>
</ul>

<p>پایداری سطح حساب همچنان به بهداشت ثبت‌نام وابسته است؛ اگر پذیرش relay با ایجاد سازمان جدید هم‌زمان است <a href="/guides/account-registration-and-payment-antiban/">ثبت‌نام حساب و پرداخت ضد مسدودسازی</a> را ببینید.</p>

<h2>3. محدودیت نرخ (429) و failover نرم</h2>
<p>محدودیت‌های نرخ Anthropic در سطح سازمان و لایهٔ مدل اعمال می‌شوند، نه به‌تنهایی per API key. agentهای پرشتاب، jobهای CI موازی و حلقهٔ retry بی‌مرز می‌توانند سهمیهٔ مشترک را تمام کنند و سرویس‌های نامرتبط همان org را مسدود کنند.</p>

<h3>رده‌های محدودیت (ساده‌شده)</h3>
<table>
  <thead>
    <tr>
      <th>سیگنال</th>
      <th>کد HTTP</th>
      <th>معنی</th>
      <th>پاسخ ایمن</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>محدودیت نرخ</td>
      <td>429</td>
      <td>درخواست یا توکن در دقیقه بیش از حد</td>
      <td>Exponential backoff + jitter؛ کم‌کردن هم‌زمانی</td>
    </tr>
    <tr>
      <td>فشار زیاد upstream</td>
      <td>529</td>
      <td>ظرفیت upstream</td>
      <td>Backoff کوتاه؛ اختیاری downgrade مدل</td>
    </tr>
    <tr>
      <td>احراز هویت / سیاست</td>
      <td>403</td>
      <td>کلید نامعتبر یا دسترسی رد شده</td>
      <td>کورکورانه retry نکنید؛ وضعیت حساب را بررسی کنید</td>
    </tr>
    <tr>
      <td>درخواست بد</td>
      <td>400</td>
      <td>Schema یا سقف توکن</td>
      <td>Payload را اصلاح کنید؛ context را کوتاه کنید</td>
    </tr>
  </tbody>
</table>

<h3>الگوی retry و failover</h3>
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

<h3>کنترل هم‌زمانی</h3>
<ul>
  <li><strong>سطل توکن در CI:</strong> jobهای agent موازی را سقف بگذارید (مثلاً حداکثر ۳ هم‌زمان) per organization.</li>
  <li><strong>ادغام درخواست:</strong> در صورت امکان اصلاح lint کوچک چندفایلی را یک فراخوانی API کنید نه یکی per فایل.</li>
  <li><strong>Circuit breaker:</strong> پس از N بار متوالی ۴۲۹، ۶۰ ثانیه مدار باز و failover خودکار به مسیر پشتیبان، جلوی طوفان retry را می‌گیرد.</li>
  <li><strong>قابلیت مشاهده:</strong> متریک export کنید: <code>claude_requests_total{status}</code>، <code>fallback_invocations_total</code>، p95 تأخیر. وقتی نرخ fallback بیش از ۱۵٪ برای ۱۰ دقیقه بود هشدار دهید.</li>
</ul>

<h3>403 در برابر 429؛ یکسان قلمداد نکنید</h3>
<p>۴۲۹ فشار موقت است، عقب بروید و ادامه دهید. ۴۰۳ اغلب لغو credential، محدودیت جغرافیایی یا تغییر وضعیت حساب را نشان می‌دهد. retry کردن ۴۰۳ با کلیدهای جایگزین بدون تشخیص می‌تواند اجرای سیاست را تسریع کند. قبل از چرخش زیرساخت از <a href="/guides/troubleshooting-guide/">راهنمای عیب‌یابی</a> برای طبقه‌بندی خطا استفاده کنید.</p>

<h2>سؤالات متداول</h2>

<h3>اگر منطقهٔ زمانی سیستم درست است، آیا <code>TZ</code> را تنظیم کنم؟</h3>
<p>اگر منطقهٔ زمانی OS، geo خروج proxy و پروفایل مرورگر هم‌راستا هستند، <code>TZ</code> صریح شاید اضافی باشد، اما کانتینرهای CI اغلب پیش‌فرض UTC دارند. export صریح رفتار را بین لپ‌تاپ و سرور قطعی می‌کند.</p>

<h3>آیا reseller عمومی API برای کد منبع شرکت «ایمن» است؟</h3>
<p>مثل هر پردازندهٔ فرعی سوم‌شخص با آن رفتار کنید؛ لاگ، نگهداری و فهرست subprocessors را مرور کنید. برای کد اختصاصی، relay self-hosted روی VPC شما از resellerهای ناشناس قطعاً ایمن‌تر است.</p>

<h3>چرا پس از عوض کردن gateway صرفه‌جویی cache ناپدید می‌شود؟</h3>
<p>رایج‌ترین علت این است که relay headerهای <code>anthropic-beta</code> را می‌زداید یا بلوک‌های system را جابه‌جا می‌کند و کلید cache باطل می‌شود. پس از هر تغییر gateway آزمایش کش دو درخواستی را دوباره اجرا کنید.</p>

<h3>آیا می‌توانم برای مرورگر و Claude Code proxy متفاوت استفاده کنم؟</h3>
<p>از نظر فنی بله، اما ریسک واگرایی بیشتر می‌شود. یک مسیر egress مستند برای همهٔ ترافیک Claude ترجیح دهید مگر حساب‌های آزمایشی را در پروفایل‌های جدا نگه دارید.</p>

<h3>Claude Code روی 429 باید به کدام مدل fallback کند؟</h3>
<p>خود Claude Code failover چندمدلی داخلی ندارد؛ در gateway (One-API/LiteLLM) پیاده‌سازی کنید یا موقتاً Claude Code را خاموش کنید و افزونهٔ IDE را به API پشتیبان اشاره دهید. جداول مسیریابی در <a href="/guides/domestic-and-open-source-alternatives/">جایگزین‌های بومی و متن‌باز</a>.</p>

<h3>چطور «در curl کار می‌کند ولی در Claude Code نه» را debug کنم؟</h3>
<ol>
  <li>headerها را diff کنید؛ curl در برابر CLI را با mitmproxy یا لاگ دسترسی gateway بگیرید.</li>
  <li>env در shell راه‌انداز را تأیید کنید؛ ترمینال‌های یکپارچهٔ IDE گاهی rc فایل‌های login را رد می‌کنند.</li>
  <li>agentهای proxy Node/fetch را بررسی کنید؛ بعضی نسخه‌ها <code>HTTPS_PROXY</code> را نادیده می‌گیرند مگر <code>GLOBAL_AGENT_HTTP_PROXY</code> تنظیم شود.</li>
  <li>بازرسی TLS روی شبکهٔ شرکتی را بررسی کنید.</li>
</ol>

<h3>فرض base URL شبیه first-party روی صورتحساب Anthropic اثر می‌گذارد؟</h3>
<p>نه. صورتحساب از کلید API و سازمانی که واقعاً درخواست را سرو می‌کند پیروی می‌کند. اگر gateway به Anthropic فوروارد کند، Anthropic را پرداخت می‌کنید؛ اگر مدل عوض کند، هر providerی که gateway صدا می‌زند را.</p>
`;
