export const content = `
<h2>1. Механизм маркировки AI-контента Claude</h2>
<p>С 2 августа 2026 года Anthropic ввела машиночитаемую маркировку контента, сгенерированного ИИ, в соответствии со статьёй 50(2) EU AI Act. Claude теперь встраивает в сгенерированный контент два типа меток:</p>

<h3>1.1 Встроенные текстовые watermark</h3>
<p>Claude на уровне модели вплетает малозаметные watermark прямо в сгенерированный текст. Ключевые свойства:</p>
<ul>
  <li><strong>Невидимы для читателя:</strong> Не влияют на смысл, качество и читаемость</li>
  <li><strong>Устойчивы:</strong> Переживают копирование и лёгкое редактирование</li>
  <li><strong>Универсальны:</strong> Применяются во всех продуктах Claude (API, Code, Cowork, Desktop)</li>
  <li><strong>Независимы от платформы:</strong> Работают на AWS Bedrock, Google Cloud, Microsoft Foundry</li>
</ul>

<h3>1.2 Подписанные метаданные происхождения (C2PA)</h3>
<p>Файлы, созданные Claude (.svg, .png, .jpg и т. д.), содержат подписанные метаданные по стандарту Coalition for Content Provenance and Authenticity (C2PA):</p>
<ul>
  <li><strong>Детекция изменений:</strong> Показывают, менялся ли файл</li>
  <li><strong>Отраслевой стандарт:</strong> Совместимы с Adobe, Microsoft и другими сторонами C2PA</li>
  <li><strong>Цифровая подпись:</strong> Криптографически проверяемая цепочка происхождения</li>
</ul>

<h2>2. Обнаружение watermark Claude</h2>

<h3>2.1 Детекция текстового watermark</h3>
<p>Anthropic выпустит официальные инструменты детекции. Сторонние методы:</p>

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

<h3>2.2 Проверка метаданных C2PA</h3>
<p>Используйте стандартные инструменты C2PA для проверки происхождения файла:</p>

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

<h2>3. Удаление watermark и техники обхода</h2>

<h3>3.1 Обход текстового watermark</h3>

<h4>Метод 1: Семантический парафраз</h4>
<p>Перепишите вывод Claude другой моделью или вручную:</p>
<pre><code># Use DeepSeek or GPT to paraphrase
deepseek-chat "Rewrite this text while preserving meaning: [Claude output]"

# Manual techniques:
# - Synonym replacement (preserve → maintain, ensure → guarantee)
# - Sentence restructuring (passive → active voice)
# - Paragraph reordering</code></pre>

<h4>Метод 2: Перевод туда-обратно</h4>
<pre><code># Claude EN → Translation → Back to EN destroys watermark pattern
echo "Claude output" | translate en→ja | translate ja→en

# Multi-hop translation reduces detection confidence
EN → JA → KO → ZH → EN</code></pre>

<h4>Метод 3: Обфускация на уровне символов</h4>
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

<h3>3.2 Удаление метаданных C2PA</h3>

<h4>Метод 1: Повторный захват скриншотом</h4>
<pre><code># Take a screenshot of the Claude-generated image
# Strips all EXIF/C2PA metadata
# Trade-off: Slight quality loss, no transparency preservation

# Automated with ImageMagick
convert input.png -strip output.png</code></pre>

<h4>Метод 2: Конвертация форматов</h4>
<pre><code># Convert through multiple formats to strip metadata
convert image.png temp.bmp
convert temp.bmp output.png

# Or use JPEG compression (lossy, removes metadata)
convert image.png -quality 95 output.jpg</code></pre>

<h4>Метод 3: Инструменты снятия метаданных</h4>
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

<h3>3.3 Гибрид: переписывание с помощью ИИ</h3>
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

<h2>4. Ограничения детекции и лучшие практики</h2>

<h3>4.1 Детекция watermark вероятностна</h3>
<ul>
  <li><strong>Короткий текст:</strong> Слишком мало сигнала для надёжной детекции (&lt;100 words)</li>
  <li><strong>Сильное редактирование:</strong> Ручные правки ослабляют сигнал watermark</li>
  <li><strong>Старые модели:</strong> У моделей Claude до августа 2026 нет watermark</li>
  <li><strong>Смешанный контент:</strong> Совместная работа человека и ИИ сбивает детекторы</li>
</ul>

<h3>4.2 Рекомендации ответственного использования</h3>
<p>Несмотря на существование этих техник, учитывайте этические последствия:</p>
<ul>
  <li><strong>Академическая честность:</strong> Многие учреждения требуют раскрывать помощь ИИ</li>
  <li><strong>Авторское право:</strong> Удаление watermark может нарушать terms of service</li>
  <li><strong>Журналистские стандарты:</strong> СМИ всё чаще требуют прозрачности по ИИ</li>
  <li><strong>Правовое соответствие:</strong> EU AI Act в ряде контекстов обязывает сохранять watermark</li>
</ul>

<h2>5. Подготовка к будущей детекции</h2>

<h3>5.1 Локальные модели</h3>
<pre><code># Self-hosted models avoid cloud watermarking entirely
# Ollama setup
ollama pull qwen2.5:72b
ollama pull deepseek-r1:70b

# LM Studio for GUI users
# Download models from HuggingFace
# Run locally without watermarks</code></pre>

<h3>5.2 Смешивание нескольких моделей</h3>
<pre><code># Generate with multiple models, blend outputs
claude_output = call_claude(prompt)
deepseek_output = call_deepseek(prompt)
gpt_output = call_gpt(prompt)

# Manual merge: take Claude's structure + DeepSeek's details + GPT's polish
# Watermark signal becomes statistically undetectable</code></pre>

<h3>5.3 Редактирование с участием человека</h3>
<p>Самый надёжный подход: считайте вывод ИИ черновиком и существенно правьте вручную:</p>
<ul>
  <li>Перепишите более 30% предложений своим голосом</li>
  <li>Добавьте личные примеры и экспертизу в предметной области</li>
  <li>Перестройте логику и ход аргументации</li>
  <li>Так контент по-настоящему становится «вашим», при этом ломая watermark</li>
</ul>

<h2>6. Сравнение инструментов детекции</h2>

<table>
  <thead>
    <tr>
      <th>Инструмент</th>
      <th>Тип детекции</th>
      <th>Точность</th>
      <th>Ограничения</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Anthropic Official API</td>
      <td>Claude watermark</td>
      <td>Высокая (90%+)</td>
      <td>Только Claude, короткий текст не срабатывает</td>
    </tr>
    <tr>
      <td>GPTZero</td>
      <td>Generic AI detection</td>
      <td>Средняя (70-80%)</td>
      <td>Много ложных срабатываний на техническом тексте</td>
    </tr>
    <tr>
      <td>Originality.ai</td>
      <td>Multi-model detection</td>
      <td>Средняя (75-85%)</td>
      <td>Нужна подписка, лимиты API</td>
    </tr>
    <tr>
      <td>C2PA Verify</td>
      <td>File metadata</td>
      <td>Высокая (95%+)</td>
      <td>Только для неизменённых файлов</td>
    </tr>
    <tr>
      <td>Winston AI</td>
      <td>Generic AI detection</td>
      <td>Средняя (70-85%)</td>
      <td>Слабо справляется с парафразированным контентом</td>
    </tr>
  </tbody>
</table>

<h2>7. Правовые и этические аспекты</h2>

<p><strong>Дисклеймер:</strong> Это руководство в образовательных целях. Удаление watermark может нарушать:</p>
<ul>
  <li>Terms of Service Anthropic (статья 8.3)</li>
  <li>Требования прозрачности EU AI Act (статья 50)</li>
  <li>Нормы DMCA об обходе защиты (17 U.S.C. § 1201)</li>
  <li>Кодексы академической честности учебных заведений</li>
</ul>

<p><strong>Рекомендуемые легитимные сценарии:</strong></p>
<ul>
  <li>Защита приватности: снятие AI-подписей с личных документов</li>
  <li>Конкурентный анализ: изучение устойчивости watermark для исследований безопасности</li>
  <li>Миграция форматов: устаревший контент, требующий очистки метаданных</li>
  <li>Трансформации fair use: существенная творческая переработка черновиков, сгенерированных ИИ</li>
</ul>
`;
