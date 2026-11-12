export const content = `
<h2>1. Análisis del incidente de esteganografía en Claude Code</h2>
<p>En abril de 2026, la ingeniería inversa del CLI oficial <code>@anthropic-ai/claude-code</code> reveló que, cuando los usuarios enrutaban solicitudes por un endpoint no oficial mediante <code>ANTHROPIC_BASE_URL</code>, el CLI ejecutaba lógica de detección del lado del cliente sin divulgación al usuario:</p>

<ul>
  <li><strong>Comprobación de zona horaria:</strong> evaluaba si la zona horaria del sistema era <code>Asia/Shanghai</code> o <code>Asia/Urumqi</code>. Si coincidía, el separador de fecha en la línea del system prompt <code>Today's date is 2026-06-30</code> pasaba de guiones a barras: <code>2026/06/30</code>.</li>
  <li><strong>Lista negra de host y palabras clave de laboratorios:</strong> cruzaba el host del proxy con una lista en base64 de más de 147 dominios cifrada con XOR (clave: 91) y palabras clave de laboratorios de IA chinos (p. ej. <code>deepseek</code>, <code>moonshot</code>, <code>zhipu</code>, <code>minimax</code>, <code>dashscope</code>, <code>*.cn</code>).</li>
  <li><strong>Sustitución de apóstrofo Unicode:</strong> modificaba el apóstrofo en "Today's date" usando variantes Unicode similares visualmente:
    <ul>
      <li>Host coincide con lista de dominios de revendedores → reemplazo por <code>U+2019</code> (’ Right Single Quotation Mark)</li>
      <li>Host coincide con palabras clave de laboratorios de IA → reemplazo por <code>U+02BC</code> (Modifier Letter Apostrophe)</li>
      <li>Coinciden ambos → reemplazo por <code>U+02B9</code> (Modifier Letter Prime)</li>
    </ul>
  </li>
</ul>

<p>Esta carga esteganográfica sobrevivió al reenvío por proxy, permitiendo a los clasificadores del backend de Anthropic rastrear campañas de destilación y reventa comercial no autorizada sin añadir encabezados HTTP explícitos.</p>

<h3>Salvaguardas del entorno y mitigaciones</h3>
<pre><code># 1. Tell client to treat custom endpoint as first-party
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Override system timezone for CLI executions
export TZ=Asia/Tokyo

# Launch Claude Code
claude</code></pre>

<h2>2. Modelo de control de riesgo en cuatro capas de Anthropic</h2>
<p>Anthropic aplica un pipeline integral de seguridad contra abuso y destilación en <code>claude.ai</code>, endpoints de API y Claude Code:</p>

<ol>
  <li><strong>Capa de red e IP:</strong> rangos de IP de datacenter (AWS, Hetzner, DigitalOcean, Linode) reciben puntuaciones de riesgo altas. IP residenciales dedicadas con doble ISP en regiones admitidas (EE. UU., Reino Unido, SG, JP, TW) llevan el riesgo más bajo.</li>
  <li><strong>Huella de navegador y dispositivo:</strong> combina zona horaria del SO (<code>Intl.DateTimeFormat</code>), lista de idiomas del navegador (<code>navigator.languages</code>), sondeo de ancho de Canvas para fuentes chinas (Microsoft YaHei, PingFang SC, MiSans) y encabezados User-Agent CH.</li>
  <li><strong>Capa de pago e identidad:</strong> BIN de tarjetas virtuales de alto riesgo (p. ej. BIN de prepago sobreemitidos), países de dirección de facturación desajustados y números de teléfono virtuales VoIP activan cancelación instantánea de suscripción o rechazo de pago.</li>
  <li><strong>Clasificadores de comportamiento y destilación:</strong> scripts automatizados que envían millones de prompts repetitivos, saturaciones de ventana de contexto de alta frecuencia y uso indebido de prompt caching activan bloqueos automáticos de cuenta y cuotas de organización.</li>
</ol>
`;
