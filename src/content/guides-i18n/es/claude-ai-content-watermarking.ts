export const content = `
<h2>1. Mecanismo de marcado de contenido IA de Claude</h2>
<p>A partir del 2 de agosto de 2026, Anthropic implementó marcado legible por máquina para contenido generado por IA en cumplimiento del artículo 50(2) de la Ley de IA de la UE. Claude ahora incorpora dos tipos de marcas en el contenido generado:</p>

<h3>1.1 Marcas de agua de texto incrustadas</h3>
<p>Claude teje marcas de agua imperceptibles directamente en el texto generado a nivel de modelo. Características clave:</p>
<ul>
  <li><strong>Invisibles para lectores:</strong> no afectan significado, calidad ni legibilidad</li>
  <li><strong>Persistentes:</strong> sobreviven a copiar y pegar y a edición ligera</li>
  <li><strong>Universales:</strong> aplicadas en todos los productos Claude (API, Code, Cowork, Desktop)</li>
  <li><strong>Agnósticas de plataforma:</strong> funcionan en AWS Bedrock, Google Cloud, Microsoft Foundry</li>
</ul>

<h3>1.2 Metadatos de procedencia firmados (C2PA)</h3>
<p>Los archivos generados por Claude (.svg, .png, .jpg, etc.) incluyen metadatos firmados según el estándar Coalition for Content Provenance and Authenticity (C2PA):</p>
<ul>
  <li><strong>Detección de manipulación:</strong> revela si los archivos fueron modificados</li>
  <li><strong>Estándar de la industria:</strong> compatible con Adobe, Microsoft y otros adoptantes C2PA</li>
  <li><strong>Firma digital:</strong> cadena de procedencia criptográficamente verificable</li>
</ul>

<h2>2. Detección de marcas de agua de Claude</h2>

<h3>2.1 Detección de marca de agua en texto</h3>
<p>Anthropic publicará herramientas oficiales de detección. Métodos de detección de terceros:</p>

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

<h3>2.2 Inspección de metadatos C2PA</h3>
<p>Usar herramientas C2PA estándar para verificar la procedencia del archivo:</p>

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

<h2>3. Técnicas de eliminación y evasión de marcas de agua</h2>

<h3>3.1 Métodos para eludir marca de agua en texto</h3>

<h4>Método 1: Parafraseo semántico</h4>
<p>Reescribir la salida de Claude con otro modelo o edición manual:</p>
<pre><code># Use DeepSeek or GPT to paraphrase
deepseek-chat "Rewrite this text while preserving meaning: [Claude output]"

# Manual techniques:
# - Synonym replacement (preserve → maintain, ensure → guarantee)
# - Sentence restructuring (passive → active voice)
# - Paragraph reordering</code></pre>

<h4>Método 2: Ida y vuelta por traducción</h4>
<pre><code># Claude EN → Translation → Back to EN destroys watermark pattern
echo "Claude output" | translate en→ja | translate ja→en

# Multi-hop translation reduces detection confidence
EN → JA → KO → ZH → EN</code></pre>

<h4>Método 3: Ofuscación a nivel de carácter</h4>
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

<h3>3.2 Eliminación de metadatos C2PA</h3>

<h4>Método 1: Nueva captura por captura de pantalla</h4>
<pre><code># Take a screenshot of the Claude-generated image
# Strips all EXIF/C2PA metadata
# Trade-off: Slight quality loss, no transparency preservation

# Automated with ImageMagick
convert input.png -strip output.png</code></pre>

<h4>Método 2: Conversión de formato</h4>
<pre><code># Convert through multiple formats to strip metadata
convert image.png temp.bmp
convert temp.bmp output.png

# Or use JPEG compression (lossy, removes metadata)
convert image.png -quality 95 output.jpg</code></pre>

<h4>Método 3: Herramientas de eliminación de metadatos</h4>
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

<h3>3.3 Enfoque híbrido: reescritura asistida por IA</h3>
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

<h2>4. Limitaciones de detección y mejores prácticas</h2>

<h3>4.1 La detección de marcas de agua es probabilística</h3>
<ul>
  <li><strong>Texto corto:</strong> señal insuficiente para detección fiable (&lt;100 palabras)</li>
  <li><strong>Edición intensa:</strong> revisiones manuales degradan la señal de marca de agua</li>
  <li><strong>Modelos antiguos:</strong> modelos Claude anteriores a agosto de 2026 carecen de marcas de agua</li>
  <li><strong>Contenido mixto:</strong> colaboración humano + IA confunde a los detectores</li>
</ul>

<h3>4.2 Recomendaciones de uso responsable</h3>
<p>Aunque estas técnicas existen, conviene considerar las implicaciones éticas:</p>
<ul>
  <li><strong>Integridad académica:</strong> muchas instituciones exigen divulgar asistencia de IA</li>
  <li><strong>Derecho de autor:</strong> quitar marcas de agua puede violar los términos de servicio</li>
  <li><strong>Estándares periodísticos:</strong> los medios exigen cada vez más transparencia sobre IA</li>
  <li><strong>Cumplimiento legal:</strong> la Ley de IA de la UE exige preservar marcas de agua en ciertos contextos</li>
</ul>

<h2>5. Preparación ante detección futura</h2>

<h3>5.1 Usar modelos locales</h3>
<pre><code># Self-hosted models avoid cloud watermarking entirely
# Ollama setup
ollama pull qwen2.5:72b
ollama pull deepseek-r1:70b

# LM Studio for GUI users
# Download models from HuggingFace
# Run locally without watermarks</code></pre>

<h3>5.2 Mezcla multi-modelo</h3>
<pre><code># Generate with multiple models, blend outputs
claude_output = call_claude(prompt)
deepseek_output = call_deepseek(prompt)
gpt_output = call_gpt(prompt)

# Manual merge: take Claude's structure + DeepSeek's details + GPT's polish
# Watermark signal becomes statistically undetectable</code></pre>

<h3>5.3 Edición con humano en el bucle</h3>
<p>Método más fiable: tratar la salida de IA como borrador inicial y realizar edición humana sustancial:</p>
<ul>
  <li>Reescribir más del 30 % de las oraciones con voz propia</li>
  <li>Añadir ejemplos personales y experiencia de dominio</li>
  <li>Reestructurar flujo lógico y progresión del argumento</li>
  <li>Así el contenido pasa a ser genuinamente propio y se rompe la marca de agua</li>
</ul>

<h2>6. Comparación de herramientas de detección</h2>

<table>
  <thead>
    <tr>
      <th>Herramienta</th>
      <th>Tipo de detección</th>
      <th>Precisión</th>
      <th>Limitaciones</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>API oficial de Anthropic</td>
      <td>Marca de agua Claude</td>
      <td>Alta (90 %+)</td>
      <td>Específica de Claude; falla con texto corto</td>
    </tr>
    <tr>
      <td>GPTZero</td>
      <td>Detección genérica de IA</td>
      <td>Media (70-80 %)</td>
      <td>Altos falsos positivos en redacción técnica</td>
    </tr>
    <tr>
      <td>Originality.ai</td>
      <td>Detección multi-modelo</td>
      <td>Media (75-85 %)</td>
      <td>Requiere suscripción; límites de API</td>
    </tr>
    <tr>
      <td>C2PA Verify</td>
      <td>Metadatos de archivo</td>
      <td>Alta (95 %+)</td>
      <td>Solo en archivos no modificados</td>
    </tr>
    <tr>
      <td>Winston AI</td>
      <td>Detección genérica de IA</td>
      <td>Media (70-85 %)</td>
      <td>Dificultad con contenido parafraseado</td>
    </tr>
  </tbody>
</table>

<h2>7. Consideraciones legales y éticas</h2>

<p><strong>Aviso:</strong> esta guía es con fines educativos. Quitar marcas de agua puede violar:</p>
<ul>
  <li>Los términos de servicio de Anthropic (artículo 8.3)</li>
  <li>Requisitos de transparencia de la Ley de IA de la UE (artículo 50)</li>
  <li>Disposiciones anticircunvención DMCA (17 U.S.C. § 1201)</li>
  <li>Códigos de honor académico en instituciones educativas</li>
</ul>

<p><strong>Casos de uso legítimos recomendados:</strong></p>
<ul>
  <li>Protección de privacidad: quitar firmas de IA de documentos personales</li>
  <li>Análisis competitivo: entender la robustez de marcas de agua para investigación de seguridad</li>
  <li>Migración de formato: contenido heredado que requiere limpieza de metadatos</li>
  <li>Transformaciones de uso legítimo: reelaboración creativa sustancial de borradores generados por IA</li>
</ul>
`;
