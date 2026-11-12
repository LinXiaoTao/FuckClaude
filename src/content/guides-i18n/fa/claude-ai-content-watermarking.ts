export const content = `
<h2>۱. سازوکار نشان‌گذاری محتوای هوش مصنوعی Claude</h2>
<p>از ۲ اوت ۲۰۲۶، Anthropic برای رعایت ماده ۵۰(۲) قانون هوش مصنوعی اتحادیه اروپا، نشان‌گذاری ماشین‌خوان برای محتوای تولیدشده توسط هوش مصنوعی را اجرا کرد. Claude اکنون دو نوع نشان در محتوای تولیدی تعبیه می‌کند:</p>

<h3>۱.۱ واترمارک متنی تعبیه‌شده</h3>
<p>Claude در سطح مدل، واترمارک‌های نامحسوس را مستقیماً در متن تولیدی می‌بافد. ویژگی‌های کلیدی:</p>
<ul>
  <li><strong>برای خواننده نامرئی:</strong> بر معنا، کیفیت یا خوانایی اثر نمی‌گذارد</li>
  <li><strong>پایدار:</strong> از copy-paste و ویرایش سبک جان سالم به در می‌برد</li>
  <li><strong>سراسری:</strong> روی همه محصولات Claude (API، Code، Cowork، Desktop) اعمال می‌شود</li>
  <li><strong>مستقل از پلتفرم:</strong> روی AWS Bedrock، Google Cloud، Microsoft Foundry کار می‌کند</li>
</ul>

<h3>۱.۲ متادیتای منشأ امضاشده (C2PA)</h3>
<p>فایل‌های تولید Claude (.svg، .png، .jpg و غیره) شامل متادیتای امضاشده مطابق استاندارد Coalition for Content Provenance and Authenticity (C2PA) هستند:</p>
<ul>
  <li><strong>تشخیص دستکاری:</strong> آشکار می‌کند آیا فایل‌ها تغییر کرده‌اند</li>
  <li><strong>استاندارد صنعتی:</strong> با Adobe، Microsoft و سایر پذیرندگان C2PA سازگار است</li>
  <li><strong>امضای دیجیتال:</strong> زنجیره منشأ قابل تأیید رمزنگاری</li>
</ul>

<h2>۲. شناسایی واترمارک Claude</h2>

<h3>۲.۱ تشخیص واترمارک متنی</h3>
<p>Anthropic ابزارهای تشخیص رسمی منتشر خواهد کرد. روش‌های تشخیص شخص ثالث:</p>

<pre><code># Planned Anthropic detection API (not yet released)
curl -X POST https://api.anthropic.com/v1/watermark/detect \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{"text": "Your text here"}'

# Response indicates probability of Claude origin
{
  "detected": true,
  "confidence": 0.92,
  "model_family": "claude-4"
}</code></pre>

<h3>۲.۲ بازرسی متادیتای C2PA</h3>
<p>برای تأیید منشأ فایل از ابزارهای استاندارد C2PA استفاده کنید:</p>

<pre><code># Install c2pa-tool (Rust-based)
cargo install c2pa-tool

# Inspect a Claude-generated image
c2pa-tool image.png

# Extract full manifest
c2pa-tool image.png --output manifest.json

# Python example using c2pa-python
from c2pa import Reader

reader = Reader("image.png")
manifest = reader.get_manifest()
print(manifest.claim_generator)  # Should show "Anthropic Claude"</code></pre>

<h2>۳. حذف واترمارک و فنون دور زدن</h2>

<h3>۳.۱ روش‌های دور زدن واترمارک متنی</h3>

<h4>روش ۱: بازنویسی معنایی</h4>
<p>خروجی Claude را با مدل دیگر یا ویرایش دستی بازنویسی کنید:</p>
<pre><code># Use DeepSeek or GPT to paraphrase
deepseek-chat "Rewrite this text while preserving meaning: [Claude output]"

# Manual techniques:
# - Synonym replacement (preserve → maintain, ensure → guarantee)
# - Sentence restructuring (passive → active voice)
# - Paragraph reordering</code></pre>

<h4>روش ۲: دور مترجم</h4>
<pre><code># Claude EN → Translation → Back to EN destroys watermark pattern
echo "Claude output" | translate en→ja | translate ja→en

# Multi-hop translation reduces detection confidence
EN → JA → KO → ZH → EN</code></pre>

<h4>روش ۳: مبهم‌سازی سطح کاراکتر</h4>
<pre><code># Replace similar Unicode characters (risky for readability)
# Example: Replace spaces with non-breaking spaces (U+00A0)
# Replace hyphens with em-dashes, en-dashes, minus signs

# Python script
import unicodedata
def obfuscate_text(text):
    # Replace ASCII apostrophe with Unicode variants
    variants = ["'", "'", "‛", "‚"]
    # Randomize selection to break watermark pattern
    # (This may reduce text quality)</code></pre>

<h3>۳.۲ حذف متادیتای C2PA</h3>

<h4>روش ۱: ضبط مجدد اسکرین‌شات</h4>
<pre><code># Take a screenshot of the Claude-generated image
# Strips all EXIF/C2PA metadata
# Trade-off: Slight quality loss, no transparency preservation

# Automated with ImageMagick
convert input.png -strip output.png</code></pre>

<h4>روش ۲: تبدیل قالب</h4>
<pre><code># Convert through multiple formats to strip metadata
convert image.png temp.bmp
convert temp.bmp output.png

# Or use JPEG compression (lossy, removes metadata)
convert image.png -quality 95 output.jpg</code></pre>

<h4>روش ۳: ابزار حذف متادیتا</h4>
<pre><code># ExifTool - removes all metadata
exiftool -all= image.png -o clean_image.png

# MAT2 (Metadata Anonymization Toolkit)
mat2 image.png

# Python PIL
from PIL import Image
img = Image.open("input.png")
data = list(img.getdata())
clean_img = Image.new(img.mode, img.size)
clean_img.putdata(data)
clean_img.save("output.png")</code></pre>

<h3>۳.۳ رویکرد ترکیبی: بازنویسی با کمک هوش مصنوعی</h3>
<pre><code># Use local open-source models to rewrite
# Ollama + Llama 3.1 or Qwen 2.5
ollama run llama3.1:70b "Rewrite this professionally: [text]"

# Or self-hosted DeepSeek R1
curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Paraphrase: [text]"}]
  }'</code></pre>

<h2>۴. محدودیت‌های تشخیص و بهترین رویه‌ها</h2>

<h3>۴.۱ تشخیص واترمارک احتمالی است</h3>
<ul>
  <li><strong>متن کوتاه:</strong> سیگنال برای تشخیص قابل اعتماد کم است (&lt;100 words)</li>
  <li><strong>ویرایش سنگین:</strong> بازبینی دستی سیگنال واترمارک را تضعیف می‌کند</li>
  <li><strong>مدل‌های قدیمی:</strong> مدل‌های Claude پیش از اوت ۲۰۲۶ واترمارک ندارند</li>
  <li><strong>محتوای ترکیبی:</strong> همکاری انسان و هوش مصنوعی آشکارسازها را گیج می‌کند</li>
</ul>

<h3>۴.۲ توصیه‌های استفاده مسئولانه</h3>
<p>با وجود این فنون، پیامدهای اخلاقی را در نظر بگیرید:</p>
<ul>
  <li><strong>صداقت آکادمیک:</strong> بسیاری نهادها افشای کمک هوش مصنوعی را الزام می‌کنند</li>
  <li><strong>قانون حق نسخه‌برداری:</strong> حذف واترمارک ممکن است شرایط سرویس را نقض کند</li>
  <li><strong>استانداردهای روزنامه‌نگاری:</strong> رسانه‌ها فزاینده شفافیت هوش مصنوعی می‌خواهند</li>
  <li><strong>انطباق قانونی:</strong> قانون هوش مصنوعی اتحادیه اروپا در برخی زمینه‌ها حفظ واترمارک را الزام می‌کند</li>
</ul>

<h2>۵. مقاومت در برابر تشخیص آینده</h2>

<h3>۵.۱ از مدل‌های محلی استفاده کنید</h3>
<pre><code># Self-hosted models avoid cloud watermarking entirely
# Ollama setup
ollama pull qwen2.5:72b
ollama pull deepseek-r1:70b

# LM Studio for GUI users
# Download models from HuggingFace
# Run locally without watermarks</code></pre>

<h3>۵.۲ ترکیب چند مدل</h3>
<pre><code># Generate with multiple models, blend outputs
claude_output = call_claude(prompt)
deepseek_output = call_deepseek(prompt)
gpt_output = call_gpt(prompt)

# Manual merge: take Claude's structure + DeepSeek's details + GPT's polish
# Watermark signal becomes statistically undetectable</code></pre>

<h3>۵.۳ ویرایش با انسان در حلقه</h3>
<p>قابل اعتمادترین روش: خروجی هوش مصنوعی را پیش‌نویس اول بدانید و ویرایش انسانی قابل توجه انجام دهید:</p>
<ul>
  <li>بیش از ۳۰٪ جملات را با صدای خود بازنویسی کنید</li>
  <li>مثال‌های شخصی و تخصص حوزه اضافه کنید</li>
  <li>جریان منطقی و پیشروی استدلال را بازساختار دهید</li>
  <li>این واقعاً محتوا را «مال شما» می‌کند و همزمان واترمارک را می‌شکند</li>
</ul>

<h2>۶. مقایسه ابزارهای تشخیص</h2>

<table>
  <thead>
    <tr>
      <th>ابزار</th>
      <th>نوع تشخیص</th>
      <th>دقت</th>
      <th>محدودیت‌ها</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>API رسمی Anthropic</td>
      <td>واترمارک Claude</td>
      <td>بالا (۹۰٪+)</td>
      <td>مختص Claude، متن کوتاه شکست می‌خورد</td>
    </tr>
    <tr>
      <td>GPTZero</td>
      <td>تشخیص عمومی هوش مصنوعی</td>
      <td>متوسط (۷۰-۸۰٪)</td>
      <td>مثبت کاذب بالا در نگارش فنی</td>
    </tr>
    <tr>
      <td>Originality.ai</td>
      <td>تشخیص چندمدلی</td>
      <td>متوسط (۷۵-۸۵٪)</td>
      <td>اشتراک لازم، محدودیت API</td>
    </tr>
    <tr>
      <td>C2PA Verify</td>
      <td>متادیتای فایل</td>
      <td>بالا (۹۵٪+)</td>
      <td>فقط روی فایل‌های بدون تغییر کار می‌کند</td>
    </tr>
    <tr>
      <td>Winston AI</td>
      <td>تشخیص عمومی هوش مصنوعی</td>
      <td>متوسط (۷۰-۸۵٪)</td>
      <td>با محتوای بازنویسی‌شده مشکل دارد</td>
    </tr>
  </tbody>
</table>

<h2>۷. ملاحظات حقوقی و اخلاقی</h2>

<p><strong>سلب مسئولیت:</strong> این راهنما با هدف آموزشی است. حذف واترمارک ممکن است نقض کند:</p>
<ul>
  <li>شرایط سرویس Anthropic (ماده ۸.۳)</li>
  <li>الزامات شفافیت قانون هوش مصنوعی اتحادیه اروپا (ماده ۵۰)</li>
  <li>مفاد ضد دور زدن DMCA (17 U.S.C. § 1201)</li>
  <li>منشور افتخار آکادمیک مؤسسات آموزشی</li>
</ul>

<p><strong>موارد استفاده مشروع توصیه‌شده:</strong></p>
<ul>
  <li>حفاظت حریم خصوصی: حذف امضای هوش مصنوعی از اسناد شخصی</li>
  <li>تحلیل رقابتی: درک استحکام واترمارک برای پژوهش امنیتی</li>
  <li>مهاجرت قالب: محتوای legacy که پاک‌سازی متادیتا می‌خواهد</li>
  <li>تحولات استفاده منصفانه: بازکار خلاقانه قابل توجه روی پیش‌نویس‌های تولیدشده توسط هوش مصنوعی</li>
</ul>
`;
