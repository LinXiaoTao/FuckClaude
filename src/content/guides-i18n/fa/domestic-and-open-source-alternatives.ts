export const content = `
<p>وقتی دسترسی مستقیم Claude، سهمیه API یا مسیریابی منطقه‌ای ناپایدار می‌شود، یک پشته failover طراحی‌شده خط لوله توسعه شما را روشن نگه می‌دارد. مدل‌های پیشرو داخلی و پشته‌های open source محلی راه دور زدن نقض سیاست نیستند؛ ابزارهای مشروع تداوم برای تیم‌هایی‌اند که به تأخیر قابل پیش‌بینی، هزینه واحد پایین‌تر و fallback آفلاین نیاز دارند. این راهنما جایگزین‌های عملی را مقایسه می‌کند، راه‌اندازی Ollama و One-API را گام‌به‌گام می‌دهد و نشان می‌دهد چگونه بدون بازنویسی همه یکپارچه‌سازی‌ها بار کاری را مسیریابی کنید.</p>

<p>قبل از استقرار جایگزین‌ها، محیط پایه را هم‌راستا کنید. اگر Claude همچنان upstream اصلی است، راهنماهای <a href="/guides/environment-cleanup-and-ip-setup/">پاک‌سازی محیط و تنظیم IP</a> و <a href="/guides/vpn-and-proxy-selection/">انتخاب VPN و پروکسی</a> را ببینید. برای کنترل هزینه API در سمت Claude، این راهنما را با <a href="/guides/api-advanced-optimization/">بهینه‌سازی پیشرفته API</a> ترکیب کنید.</p>

<h2>1. مقایسه مدل‌های پیشرو داخلی</h2>
<p>مدل‌های پیشرو چینی و منطقه‌ای اکنون بیشتر کارهای روزمره مهندسی را پوشش می‌دهند: تکمیل کد، refactor، تولید تست، تحلیل لاگ و پرسش‌وپاسخ سند بلند. تفاوت در طول context، وفاداری tool calling، عمق استدلال و قیمت است، نه در اینکه آیا می‌توانند Claude را کاملاً جایگزین کنند.</p>

<h3>ماتریس مقایسه قابلیت</h3>
<table>
  <thead>
    <tr>
      <th>مدل</th>
      <th>بهترین برای</th>
      <th>پنجره context</th>
      <th>ابزار / JSON</th>
      <th>تأخیر معمول (CN)</th>
      <th>پروفایل هزینه</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>DeepSeek R1 / V3</td>
      <td>استدلال پیچیده، طراحی الگوریتم، refactor چندفایلی</td>
      <td>64K–128K (وابسته به API)</td>
      <td>function calling قوی در V3</td>
      <td>پایین (CDN داخلی)</td>
      <td>بسیار پایین به‌ازای توکن</td>
    </tr>
    <tr>
      <td>Kimi / Kimi Code</td>
      <td>خواندن مقیاس repo، بازبینی spec، مستندات دوزبانه</td>
      <td>تا 2M توکن (محصول Code)</td>
      <td>خوب؛ بهترین برای ingest context بلند</td>
      <td>پایین تا متوسط</td>
      <td>رده میانی؛ سطوح context بلند متفاوت</td>
    </tr>
    <tr>
      <td>GLM-4 (Zhipu AI)</td>
      <td>API سازمانی، خروجی ساخت‌یافته، کار batch</td>
      <td>معمولاً 128K</td>
      <td>حالت JSON و ابزار بالغ</td>
      <td>پایین</td>
      <td>قیمت‌گذاری سازمانی قابل پیش‌بینی</td>
    </tr>
    <tr>
      <td>Qwen2.5-Coder محلی (Ollama)</td>
      <td>توسعه air-gapped، قطعه حساس حریم خصوصی، CI آفلاین</td>
      <td>32K–128K (محدود به سخت‌افزار)</td>
      <td>از طریق نگاشت LiteLLM / One-API</td>
      <td>بسته به GPU</td>
      <td>فقط سخت‌افزار و برق</td>
    </tr>
  </tbody>
</table>

<h3>انتخاب مدل بر اساس بار کاری</h3>
<ul>
  <li><strong>DeepSeek R1 / V3:</strong> R1 وقتی به دیباگ با سبک chain-of-thought یا منطق سطح مسابقه برنامه‌نویسی نیاز دارید. V3 پیش‌فرض بهتر برای فراخوانی API تولید است: سریع‌تر، ارزان‌تر و پایدار برای codegen. در ساعات اوج به محدودیت نرخ توجه کنید؛ کار batch غیرفوری را خارج از اوج صف کنید.</li>
  <li><strong>Kimi / Kimi Code:</strong> وقتی یک prompt باید کل درخت README مونورپو، spec OpenAPI و سه RFC را ببلعد ایده‌آل است. Kimi Code جریان‌های مبتنی بر IDE اضافه می‌کند. حالت شکست: context بسیار بلند می‌تواند تمرکز را رقیق کند — outline ساخت‌یافته در ابتدا بگذارید تا مدل به بخش‌ها لنگر بیندازد.</li>
  <li><strong>GLM-4 / Zhipu AI:</strong> وقتی انطباق به فاکتور، SLA و endpoint قابل دسترس در سرزمین اصلی بدون VPN نیاز دارد انتخاب قوی است. function calling و حالت JSON schema برای تولید آماده است. برای بحث معماری بازپایان کمتر از R1 یا Claude Opus مناسب است.</li>
  <li><strong>open source محلی (Qwen، distilled DeepSeek، انواع Llama):</strong> بهترین برای کد مجاور secret، محیط‌های تنظیم‌شده، یا وقتی فراخوانی API خروجی کاملاً مسدود است. شکاف کیفیت نسبت به مدل‌های پیشرو ابری در کارهای محدود کمترین است: اصلاح lint، boilerplate، اسکلت unit test.</li>
</ul>

<h3>چه زمانی تعویض نکنید</h3>
<p>Claude (یا upstream اصلی) را برای کارهای پرریسک که به tuning امنیتی خاص، حلقه agent بلندمدت، یا یکپارچه‌سازی‌های toolchain فقط روی مدل‌های Anthropic آزمایش شده وابسته‌اند نگه دارید. جایگزین‌ها در <em>تداوم</em> عالی‌اند، نه در کپی هر رفتار اختصاصی Claude. اگر دسترسی حساب ناپایدار است، قبل از فرض اینکه مدل داخلی مشکل eligibility زیرین را حل می‌کند <a href="/guides/account-registration-and-payment-antiban/">ثبت‌نام حساب و ضد مسدودسازی پرداخت</a> را بخوانید.</p>

<h2>2. راه‌اندازی سازگاری خصوصی Ollama و One-API با Claude</h2>
<p>درگاه محلی یا خصوصی که Messages API Anthropic را صحبت می‌کند به CLIها، افزونه IDE و اسکریپت موجود اجازه می‌دهد با عوض کردن upstream مدل به کار ادامه دهند. دو لایه رایج: <strong>Ollama</strong> (زمان اجرای مدل) و <strong>One-API</strong> یا <strong>LiteLLM</strong> (ترجمه پروتکل و مدیریت کلید).</p>

<h3>چک‌لیست پیش‌نیاز</h3>
<ul>
  <li>میزبان با 16 GB+ RAM برای مدل 7B–14B؛ 32 GB+ و GPU مجزا برای 32B+ با سرعت قابل استفاده.</li>
  <li>Docker (برای One-API) یا Python 3.10+ (برای LiteLLM).</li>
  <li>کلید API جدا برای هر محیط (dev/staging/prod) — هرگز کلید تولید Claude را روی درگاه مشترک بازاستفاده نکنید.</li>
  <li>سیاست خروجی شبکه مستند: فقط محلی، داخل VPC یا VPN تیم.</li>
</ul>

<h3>راه‌اندازی مسیر محلی Claude با Ollama</h3>
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

<h3>جایگزین LiteLLM (هدف یکسان، پشته متفاوت)</h3>
<pre><code># pip install 'litellm[proxy]'
# config.yaml excerpt:
model_list:
  - model_name: claude-fallback
    litellm_params:
      model: ollama/qwen2.5-coder:14b
      api_base: http://127.0.0.1:11434

litellm --config config.yaml --port 4000</code></pre>

<h3>تأیید پس از استقرار</h3>
<ol>
  <li>درخواست حداقلی Messages API (<code>max_tokens: 64</code>) بفرستید و HTTP 200 را تأیید کنید.</li>
  <li>فیلدهای schema پاسخ (<code>content</code>، <code>usage</code>) را با مستندات Anthropic مقایسه کنید — برخی درگاه‌ها <code>cache_creation_input_tokens</code> را حذف می‌کنند؛ در backend غیر Claude انتظار می‌رود.</li>
  <li>یک کار واقعی از افزونه IDE یا Claude Code با <code>ANTHROPIC_BASE_URL</code> تنظیم‌شده اجرا کنید؛ لاگ تأخیر و شکل خطا را ضبط کنید.</li>
  <li>بازگشت را مستند کنید: با حذف متغیرهای محیطی در کمتر از 30 ثانیه مسیریابی مستقیم Anthropic را برگردانید.</li>
</ol>

<h3>حالت‌های شکست رایج</h3>
<ul>
  <li><strong>Docker به Ollama روی میزبان نمی‌رسد:</strong> از <code>host.docker.internal</code> (macOS/Windows) یا <code>--network host</code> (Linux) استفاده کنید.</li>
  <li><strong>مدل tool call توهمی می‌سازد:</strong> استفاده بومی ابزار را در کلاینت غیرفعال کنید یا به کانالی با پشتیبانی function calling تأییدشده (کانال API GLM-4 / DeepSeek V3 در One-API) نگاشت دهید.</li>
  <li><strong>سرریز context:</strong> مدل‌های محلی 14B بالای حدود 32K توکن مؤثر افت کیفیت دارند؛ context repo را کوتاه کنید یا کار بلند را به Kimi بفرستید.</li>
  <li><strong>کش کهنه درگاه:</strong> پس از تعویض مدل، فرآیند proxy را ری‌استارت کنید تا جدول alias به‌روز شود.</li>
</ul>

<p>endpointهای سفارشی با fingerprinting کلاینت تعامل دارند. اگر Claude Code را علیه base URL غیر پیش‌فرض استفاده می‌کنید، <a href="/guides/claude-steganography-and-risk-model/">رمزنگاری پنهان Claude و مدل ریسک</a> و <a href="/guides/claude-code-and-api-safety/">Claude Code و ایمنی API</a> را برای بهداشت محیط ببینید — نه دور زدن، بلکه پیکربندی ثابت که از نشت تصادفی سیگنال جلوگیری کند.</p>

<h2>3. استراتژی مسیریابی مدل ترکیبی</h2>
<p>مسیریابی ترکیبی هر نوع درخواست را به ارزان‌ترین مدل کافی اختصاص می‌دهد. هدف کاهش 90%+ هزینه روی کار bulk است در حالی که Claude برای کارهایی که اندازه‌گیزی‌پذیر بهترند رزرو می‌شود.</p>

<h3>قواعد مسیریابی پیشنهادی</h3>
<table>
  <thead>
    <tr>
      <th>نوع کار</th>
      <th>اصلی</th>
      <th>fallback</th>
      <th>ماشه fallback</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>بازبینی معماری / امنیت</td>
      <td>Claude Sonnet/Opus</td>
      <td>DeepSeek R1</td>
      <td>429، 403، یا SLA &gt; 30s</td>
    </tr>
    <tr>
      <td>تولید unit test</td>
      <td>DeepSeek V3</td>
      <td>Qwen Coder محلی</td>
      <td>قطع API</td>
    </tr>
    <tr>
      <td>پرسش‌وپاسخ مستند کل repo</td>
      <td>Kimi Code</td>
      <td>GLM-4 context بلند</td>
      <td>خطاهای حد context</td>
    </tr>
    <tr>
      <td>ویرایش مجاور PII / secret</td>
      <td>Ollama محلی</td>
      <td>—</td>
      <td>همیشه محلی</td>
    </tr>
    <tr>
      <td>autofix CI روی شکست lint</td>
      <td>DeepSeek V3</td>
      <td>Qwen محلی</td>
      <td>رسیدن به سقف هزینه</td>
    </tr>
  </tbody>
</table>

<h3>طرح پیاده‌سازی</h3>
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

<h3>شیوه‌های عملیاتی</h3>
<ul>
  <li><strong>سقف بودجه:</strong> هشدار مصرف روزانه روی هر API ابری؛ سرریز خودکار به Ollama محلی.</li>
  <li><strong>قالب prompt:</strong> یک system prompt کانونیک برای هر نوع کار نگه دارید؛ مدل‌های داخلی اغلب به دستورالعمل صریح فرمت خروج نیاز دارند که Claude ضمنی استنتاج می‌کند.</li>
  <li><strong>حلقه ارزیابی:</strong> هفتگی، 20 prompt طلایی را از Claude و fallbackها عبور دهید؛ نرخ قبولی تست و امتیاز بازبینی انسانی را رصد کنید. وقتی کیفیت fallback از آستانه عبور کرد قواعد مسیریابی را عوض کنید.</li>
  <li><strong>playbook حادثه:</strong> مستند کنید چه کسی <code>ANTHROPIC_BASE_URL</code> را عوض می‌کند و چه کسی مسیریابی بار حساس به API شخص ثالث در برابر فقط محلی را تأیید می‌کند.</li>
</ul>

<p>وقتی خود failover شکست می‌خورد — timeout درگاه، JSON ابزار نامفهوم، یا پاسخ 403 مبهم — قبل از تعویض تصادفی مدل از درخت تصمیم <a href="/guides/troubleshooting-guide/">راهنمای عیب‌یابی</a> استفاده کنید.</p>

<h2>پرسش‌های متداول</h2>

<h3>آیا One-API می‌تواند Claude را برای Claude Code کاملاً جایگزین کند؟</h3>
<p>CLI را روشن نگه می‌دارد، اما وفاداری ابزار و رفتار ایمنی متفاوت خواهد بود. One-API را مسیر تخریب برای کمک کدنویسی بدانید، نه جایگزین بایت‌به‌بایت Claude. ویرایش‌های بحرانی را با تست و بازبینی تأیید کنید.</p>

<h3>کدام مدل داخلی به Claude برای کار backend پایتون نزدیک‌تر است؟</h3>
<p>DeepSeek V3 پیش‌فرض رایج برای codegen backend و طراحی API است. Kimi وقتی اندازه ورودی هزینه را غالب می‌کند برنده است. GLM-4 وقتی صورتحساب سازمانی پایدار و خروجی JSON schema نیاز دارید قوی‌تر است.</p>

<h3>آیا Ollama محلی برای کد اختصاصی امن است؟</h3>
<p>داده روی دستگاه شما می‌ماند، اما وزن‌های مدل همچنان plaintext را پردازش می‌کنند. برای داده تنظیم‌شده، میزبان air-gapped، رمزنگاری دیسک و کنترل دسترسی استفاده کنید. استنتاج محلی ریسک نگهداری شخص ثالث را حذف می‌کند؛ ریسک insider یا بدافزار را حذف نمی‌کند.</p>

<h3>آیا مسیریابی از جایگزین‌ها ریسک مسدودسازی حساب Claude را کم می‌کند؟</h3>
<p>استفاده از جایگزین‌ها <em>وابستگی</em> به uptime Claude را کم می‌کند؛ حساب Claude را از اجرای سیاست مصون نمی‌کند. حساب‌ها، پرداخت و محیط را منطبق نگه دارید — <a href="/guides/account-registration-and-payment-antiban/">ثبت‌نام و ضد مسدودسازی پرداخت</a> را ببینید.</p>

<h3>چگونه صرفه‌جویی هزینه را تخمین بزنم؟</h3>
<p>دو هفته توکن به‌ازای نوع کار روی Claude اندازه بگیرید، سپس همان مجموعه طلایی را روی DeepSeek/Kimi تکرار کنید. صرفه‌جویی به ترکیب کار شما و مدل‌های مقایسه بستگی دارد؛ روی بار کاری خودتان اندازه بگیرید نه رقم تیتر. بازبینی معماری اغلب روی Claude می‌ماند چون زمان بازبینی انسانی غالب است.</p>

<h3>چه سخت‌افزاری برای سرعت قابل قبول محلی لازم است؟</h3>
<p>Apple Silicon M2 Pro با 32 GB RAM مدل 14B را تعاملی اجرا می‌کند. GPUهای کلاس NVIDIA RTX 4090 یا A5000 کوانتیزاسیون 32B را برای درگاه مشترک تیم کوچک مناسب می‌کنند. استنتاج فقط CPU برای ویرایش تک‌فایل عملی است، نه برای حلقه agent بزرگ.</p>
`;
