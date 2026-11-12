export const content = `
<h2>1. Claude ၏ AI အကြောင်းအရာ သမှတ်မှု ယန္တရား</h2>
<p>၂၀၂၆ ခုနှစ် ဩဂုတ်လ ၂ ရက်မှ စတင်၍ Anthropic သည် EU AI Act Article 50(2) လိုက်နာရန် AI မှ ထုတ်ပေးသော အကြောင်းအရာများအတွက် machine-readable marking ကို လက်ရှိအသွင်အပြောင်းထည့်ခဲ့သည်။ Claude သည် ယခု ထုတ်ပေးသော အကြောင်းအရာထဲသို့ အမှတ်အသား နှစ်မျိုးချထားသည်။</p>

<h3>1.1 ထည့်သွင်းထားသော စာသား watermark</h3>
<p>Claude သည် မော်ဒယ် အဆင့်တွင် မမြင်နိုင်သော watermark များကို ထုတ်ပေးစာသားထဲ ချိတ်ဆက်ဖွဲ့ထားသည်။ အဓိက လက္ခဏာများ။</p>
<ul>
  <li><strong>ဖတ်ရှုသူအား မမြင်ရ။</strong> အဓိပ္ပာယ်၊ အရည်အသွေး သို့မဟုတ် ဖတ်ရှုနိုင်မှု မထိခိုက်ပါ</li>
  <li><strong>တည်ငြိမ်။</strong> copy-paste နှင့် အနည်းငယ်တည်းဖြတ်မှုကို ခံနိုင်သည်</li>
  <li><strong>သီးခြား။</strong> Claude ထုတ်ကုန် အားလုံး (API၊ Code၊ Cowork၊ Desktop) တွင် သုံးသည်</li>
  <li><strong>ပလက်ဖောင်း မရွေးပါ။</strong> AWS Bedrock၊ Google Cloud၊ Microsoft Foundry တွင် အလုပ်လုပ်သည်</li>
</ul>

<h3>1.2 လက်မှတ်ထိုး provenance metadata (C2PA)</h3>
<p>Claude ထုတ်လုပ်သော ဖိုင်များ (.svg၊ .png၊ .jpg စသည်) တွင် Coalition for Content Provenance and Authenticity (C2PA) စံနှုန်းအလိုက် လက်မှတ်ထိုး metadata ပါသည်။</p>
<ul>
  <li><strong>ပြင်ဆင်မှု စစ်ဆေးမှု။</strong> ဖိုင်များ ပြင်ဆင်ခဲ့မရှိ ထုတ်ပြနိုင်သည်</li>
  <li><strong>လုပ်ငန်းစံနှုန်း။</strong> Adobe၊ Microsoft နှင့် အခြား C2PA လက်ခံသူများနှင့် ကိုက်ညီသည်</li>
  <li><strong>ဒစ်ဂျစ်တယ် လက်မှတ်။</strong> ကုဒ်ဖြင့်အတည်ပြုနိုင်သော provenance ကြိုး</li>
</ul>

<h2>2. Claude watermark ကို ရှာဖွေခြင်း</h2>

<h3>2.1 စာသား watermark စစ်ဆေးမှု</h3>
<p>Anthropic သည် တရားဝင် detection tool များ ထုတ်ပြန်မည်။ တတိယပါတီ detection နည်းလမ်းများ။</p>

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

<h3>2.2 C2PA metadata စစ်ဆေးမှု</h3>
<p>C2PA စံ tool များဖြင့် ဖိုင် provenance အတည်ပြုပါ။</p>

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

<h2>3. Watermark ဖယ်ရှားခြင်း နှင့် ရှောင်ရှားနည်းလမ်းများ</h2>

<h3>3.1 စာသား watermark ကျော်ဖြတ်နည်း</h3>

<h4>နည်းလမ်း ၁။ Semantic paraphrasing</h4>
<p>မတူညီသော မော်ဒယ် သို့မဟုတ် လက်ဖြင့် တည်းဖြတ်ခြင်းဖြင့် Claude output ကို ပြန်ရေးပါ။</p>
<pre><code># Use DeepSeek or GPT to paraphrase
deepseek-chat "Rewrite this text while preserving meaning: [Claude output]"

# Manual techniques:
# - Synonym replacement (preserve → maintain, ensure → guarantee)
# - Sentence restructuring (passive → active voice)
# - Paragraph reordering</code></pre>

<h4>နည်းလမ်း ၂။ ဘာသာပြန် round-trip</h4>
<pre><code># Claude EN → Translation → Back to EN destroys watermark pattern
echo "Claude output" | translate en→ja | translate ja→en

# Multi-hop translation reduces detection confidence
EN → JA → KO → ZH → EN</code></pre>

<h4>နည်းလမ်း ၃။ အက္ခရာ အဆင့် obfuscation</h4>
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

<h3>3.2 C2PA metadata ဖယ်ရှားခြင်း</h3>

<h4>နည်းလမ်း ၁။ Screenshot ပြန်ရိုက်ခြင်း</h4>
<pre><code># Take a screenshot of the Claude-generated image
# Strips all EXIF/C2PA metadata
# Trade-off: Slight quality loss, no transparency preservation

# Automated with ImageMagick
convert input.png -strip output.png</code></pre>

<h4>နည်းလမ်း ၂။ ဖော်မတ် ပြောင်းလဲခြင်း</h4>
<pre><code># Convert through multiple formats to strip metadata
convert image.png temp.bmp
convert temp.bmp output.png

# Or use JPEG compression (lossy, removes metadata)
convert image.png -quality 95 output.jpg</code></pre>

<h4>နည်းလမ်း ၃။ Metadata ဖယ်ရှားရေး tool များ</h4>
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

<h3>3.3 ပေါင်းစပ် နည်းလမ်း။ AI-assisted ပြန်ရေးခြင်း</h3>
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

<h2>4. Detection ကန့်သတ်ချက်များနှင့် အကောင်းဆုံး လုပ်ထုံးများ</h2>

<h3>4.1 Watermark detection သည် ဖြစ်နိုင်ခြေ အပေါ် အခြေခံသည်</h3>
<ul>
  <li><strong>စာတို။</strong> ယုံကြည်စိတ်ချရန် signal အလုံအလတ် မရှိ (&lt;100 words)</li>
  <li><strong>တည်းဖြတ်မှု ပြင်းထန်။</strong> လက်ဖြင့် ပြင်ဆင်မှုများက watermark signal အားနည်းစေသည်</li>
  <li><strong>မော်ဒယ်အဟောင်း။</strong> ၂၀၂၆ ဩဂုတ် မတိုင်မီ Claude မော်ဒယ်များတွင် watermark မပါ</li>
  <li><strong>အရောမျှစာ။</strong> လူသား + AI ပူးပေါင်းခြင်း detector များကို ရှုပ်ထွေးစေသည်</li>
</ul>

<h3>4.2 တာဝန်ယူမှုရှိသော အသုံးပြုမှု အကြံပြုချက်များ</h3>
<p>ဤနည်းလမ်းများ ရှိသော်လည်း ကျင့်ဝတ် သက်ရောက်မှုကို စဉ်းစားပါ။</p>
<ul>
  <li><strong>ပညာရေး သမာဓိ။</strong> အဖွဲ့အစည်းများစွာက AI အကူအညီ ဖော်ပြရန် လိုအပ်သည်</li>
  <li><strong>မူပိုင်ခွင့် ဥပဒေ။</strong> watermark ဖယ်ရှားခြင်းသည် ဝန်ဆောင်မှုစည်းကမ်းကို ဖောက်နိုင်သည်</li>
  <li><strong>သတင်းလုပ်ငန်း စံနှုန်း။</strong> မီဒီယာဌာနများက AI ပွင့်လင်းမြင်သာမှု ပိုလိုအပ်လာသည်</li>
  <li><strong>ဥပဒေလိုက်နာမှု။</strong> EU AI Act သည် အခြေအနေအချို့တွင် watermark ထိန်းသိမ်းရန် တားမြစ်သည်</li>
</ul>

<h2>5. နောက်ပိုင်း detection အတွက် ကြိုတင်ပြင်ဆင်မှု</h2>

<h3>5.1 Local မော်ဒယ်များ သုံးခြင်း</h3>
<pre><code># Self-hosted models avoid cloud watermarking entirely
# Ollama setup
ollama pull qwen2.5:72b
ollama pull deepseek-r1:70b

# LM Studio for GUI users
# Download models from HuggingFace
# Run locally without watermarks</code></pre>

<h3>5.2 မော်ဒယ်စုံ ရောနှောခြင်း</h3>
<pre><code># Generate with multiple models, blend outputs
claude_output = call_claude(prompt)
deepseek_output = call_deepseek(prompt)
gpt_output = call_gpt(prompt)

# Manual merge: take Claude's structure + DeepSeek's details + GPT's polish
# Watermark signal becomes statistically undetectable</code></pre>

<h3>5.3 Human-in-the-loop တည်းဖြတ်မှု</h3>
<p>အယုံကြည်စိတ်ချရဆုံးနည်းလမ်း။ AI output ကို ပထမမူကြမ်း အဖြစ် ယူပြီး လူသား တည်းဖြတ်မှု လုံလောက်အောင် လုပ်ပါ။</p>
<ul>
  <li>ကိုယ်ပိုင်အသံနှင့် စာကြောင်း ၃၀%+ ပြန်ရေးပါ</li>
  <li>ကိုယ်ပိုင် ဥပမာနှင့် domain အထူးပြု အရည်အချင်း ထည့်ပါ</li>
  <li>ဆင်ခြေလမ်းကြောင်း နှင့် သဘောတရားဆက်စပ်မှု ပြန်ဖွဲ့ပါ</li>
  <li>သာမှု watermark ဖြိုဖျက်ရုံသာမက အကြောင်းအရာကို တကယ်မူမိစေသည်</li>
</ul>

<h2>6. Detection tool နှိုင်းယှဉ်ခြင်း</h2>

<table>
  <thead>
    <tr>
      <th>Tool</th>
      <th>Detection အမျိုးအစား</th>
      <th>တိကျမှု</th>
      <th>ကန့်သတ်ချက်များ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Anthropic Official API</td>
      <td>Claude watermark</td>
      <td>မြင့် (90%+)</td>
      <td>Claude သီးသန့်၊ စာတို မအောင်မြင်ပါ</td>
    </tr>
    <tr>
      <td>GPTZero</td>
      <td>ယေဘုယျ AI detection</td>
      <td>အလယ် (70-80%)</td>
      <td>နည်းပညာဆိုင်ရာ ရေးသားမှုများတွင် false positive မြင့်</td>
    </tr>
    <tr>
      <td>Originality.ai</td>
      <td>မော်ဒယ်စုံ detection</td>
      <td>အလယ် (75-85%)</td>
      <td>subscription လိုအပ်၊ API ကန့်သတ်ချက်</td>
    </tr>
    <tr>
      <td>C2PA Verify</td>
      <td>ဖိုင် metadata</td>
      <td>မြင့် (95%+)</td>
      <td>မပြင်ဆင်ထားသော ဖိုင်များတွင်သာ အကျုံးဝင်</td>
    </tr>
    <tr>
      <td>Winston AI</td>
      <td>ယေဘုယျ AI detection</td>
      <td>အလယ် (70-85%)</td>
      <td>paraphrase လုပ်ထားသော အကြောင်းအရာနှင့် ကြိုးစားရခက်သည်</td>
    </tr>
  </tbody>
</table>

<h2>7. ဥပဒေနှင့် ကျင့်ဝတ် ဆိုင်ရာ ထင်ပေါ်ပေါက်များ</h2>

<p><strong>သတိပေးချက်။</strong> ဤလမ်းညွှန်သည် ပညာရေးရည်ရွယ်ချက်အတွက်သာ ဖြစ်သည်။ watermark ဖယ်ရှားခြင်းသည် အောက်ပါအရာများ ချိုးဖောက်နိုင်သည်။</p>
<ul>
  <li>Anthropic ဝန်ဆောင်မှုစည်းကမ်း (Article 8.3)</li>
  <li>EU AI Act ပွင့်လင်းမြင်သာမှု လိုအပ်ချက် (Article 50)</li>
  <li>DMCA anti-circumvention ပြဌာန်းချက် (17 U.S.C. § 1201)</li>
  <li>ပညာရေးဌာန honor code များ</li>
</ul>

<p><strong>တရားဝင် အသုံးပြုမှု အကြံပြုထားသော အခြေအနေများ။</strong></p>
<ul>
  <li>ကိုယ်ရေးကိုယ်တာ ကာကွယ်ရေး။ ကိုယ်ပိုင်စာရွက်များမှ AI လက်မှတ်ဖယ်ရှားခြင်း</li>
  <li>ယှဉ်ပြိုင်မှု ခွဲခြမ်းစိတ်ဖြာမှု။ လုံခြုံရေး သုတေသနအတွက် watermark ခိုင်မာမှု နားလည်ခြင်း</li>
  <li>ဖော်မတ် ရွေ့ပြောင်းမှု။ metadata သန့်ရှင်းရေး လိုအပ်သော အရောင်း အကြောင်းအရာ</li>
  <li>fair use ပြောင်းလဲမှု။ AI မူကြမ်းများအား ဖန်တီးမှု ပြင်းထန်စွာ ပြန်လည်ပြုလုပ်ခြင်း</li>
</ul>
`;
