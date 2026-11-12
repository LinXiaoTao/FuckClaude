export const content = `
<p>Claude Code y las integraciones personalizadas con API envían más que prompts: emiten metadatos del entorno, decisiones de enrutamiento y comportamiento de reintentos que los sistemas upstream pueden correlacionar con el estado de la cuenta. Esta guía se centra en la <em>seguridad operativa</em>: configuración coherente del shell, elección del gateway y conmutación por error ordenada cuando se endurecen las cuotas. El objetivo son flujos de ingeniería confiables, no eludir las políticas de Anthropic.</p>

<p>Parta de una línea base limpia: <a href="/guides/environment-cleanup-and-ip-setup/">limpieza del entorno y configuración de IP</a> y <a href="/guides/vpn-and-proxy-selection/">selección de VPN y proxy</a> antes de ajustar las variables del CLI. Si opera relays o enrutadores multi-modelo, consulte también <a href="/guides/domestic-and-open-source-alternatives/">alternativas locales y de código abierto</a> para rutas de degradación.</p>

<h2>1. Configuraciones de seguridad de Claude Code</h2>
<p>Claude Code lee las variables de entorno del shell al iniciar. Zona horaria, proxy o URL base desalineados pueden producir errores confusos o hacer que el cliente se comporte distinto a la sesión del navegador. Trate la terminal como un entorno de primera clase, no como un detalle posterior.</p>

<h3>Variables de entorno principales</h3>
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

<h3>Lista de verificación de configuración</h3>
<ol>
  <li><strong>Única fuente de verdad:</strong> guarde las variables en <code>~/.zshrc</code> (macOS) o en un archivo dedicado <code>~/.claude/env</code> cargado por el shell; evite exportarlas al vuelo en una sola pestaña de terminal.</li>
  <li><strong>Verificar antes del arranque:</strong> ejecute <code>env | grep -E 'ANTHROPIC|TZ|PROXY'</code> en la misma ventana desde la que inicia Claude Code.</li>
  <li><strong>Alinear la geografía del navegador y del CLI:</strong> si el perfil del navegador usa la zona horaria de Tokio mediante herramientas anti-detect, el CLI no debería reportar <code>Asia/Shanghai</code>.</li>
  <li><strong>Documentar cambios de URL base:</strong> al pasar de Anthropic directo a un relay, actualice <code>ANTHROPIC_BASE_URL</code> y los runbooks internos para que el equipo no mezcle endpoints.</li>
  <li><strong>Higiene de secretos:</strong> no suba API keys al repositorio; use <code>chmod 600</code> en archivos de entorno y rote las claves del relay cada trimestre.</li>
</ol>

<h3>Qué hace y qué no hace <code>_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL</code></h3>
<p>Este indicador indica a Claude Code tratar un <code>ANTHROPIC_BASE_URL</code> no predeterminado como si fuera el endpoint estándar de Anthropic en ciertas comprobaciones del lado del cliente. Reduce fricción cuando la organización ejecuta un gateway interno aprobado. <strong>No</strong> cambia la política del servidor, la facturación ni la elegibilidad. Para cómo aún pueden evaluarse los metadatos del cliente, vea <a href="/guides/claude-steganography-and-risk-model/">esteganografía de Claude y modelo de riesgo</a>.</p>

<h3>Fallos habituales por mala configuración</h3>
<ul>
  <li><strong>Proxy dividido:</strong> el navegador usa VPN y el CLI no; las solicitudes salen de distintos ASN. Síntoma: el chat web funciona y el CLI devuelve 403.</li>
  <li><strong><code>NO_PROXY</code> obsoleto:</strong> un gateway local en <code>127.0.0.1</code> debe omitir el proxy corporativo o los bucles fallan con connection reset.</li>
  <li><strong>Alcance incorrecto de la API key:</strong> las claves de organización y de proyecto se comportan distinto bajo rate limits; confirme el tipo de clave en la consola de Anthropic.</li>
  <li><strong>Shell interactivo frente a no interactivo:</strong> los jobs de CI que invocan Claude Code deben cargar el mismo archivo de entorno; en portátiles, los login shells suelen ocultar exports faltantes.</li>
</ul>

<h2>2. Selección de gateways relay para API</h2>
<p>Cuando el acceso directo a <code>api.anthropic.com</code> está limitado por enrutamiento o adquisiciones, los relays pueden mejorar la disponibilidad si conservan la fidelidad del protocolo. Un gateway deficiente elimina encabezados en silencio, reescribe prompts o añade picos de latencia que parecen regresión de calidad del modelo.</p>

<h3>Matriz de evaluación de gateways</h3>
<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th>Aprobado</th>
      <th>Reprobado (cambiar gateway)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Encabezados de Prompt Cache</td>
      <td>Reenvía sin cambios <code>anthropic-beta: prompt-caching-2024-07-15</code> (o la beta vigente)</td>
      <td>Elimina encabezados beta; cache_read_input_tokens siempre en cero</td>
    </tr>
    <tr>
      <td>Integridad del system prompt</td>
      <td>Reenvío byte a byte de los bloques system</td>
      <td>Inyecta anuncios, texto de marca de agua o prefijos «útiles»</td>
    </tr>
    <tr>
      <td>Streaming SSE</td>
      <td>Conserva límites de eventos y deltas de herramientas</td>
      <td>Bufferiza la respuesta completa antes de emitir; rompe la UI de herramientas</td>
    </tr>
    <tr>
      <td>Transparencia de errores</td>
      <td>Pasa códigos de estado y cuerpos de Anthropic</td>
      <td>Mapea todo a un 502 genérico</td>
    </tr>
    <tr>
      <td>Neutralidad del hostname</td>
      <td>Dominio neutro (p. ej., <code>api.yourcorp.net</code>)</td>
      <td>Hostnames públicos con palabras clave de otro proveedor de IA o TLD <code>.cn</code> usado solo para tráfico Claude</td>
    </tr>
    <tr>
      <td>TLS &amp; cert pinning</td>
      <td>CA pública válida, HSTS, sin MITM por inspección SSL</td>
      <td>Ruptura SSL corporativa sin actualizar el almacén de confianza del cliente</td>
    </tr>
  </tbody>
</table>

<h3>Preservación de Prompt Cache (impacto en costo)</h3>
<p>El prompt caching de Anthropic puede reducir hasta un 90% el costo de entradas repetidas. Los relays que descartan encabezados de caché cobran tokens de entrada a precio completo en cada turno, a menudo con sorpresas de 4×–10× en system prompts largos. Valide con una prueba de dos solicitudes:</p>
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
<p>Los patrones de optimización avanzada están en <a href="/guides/api-advanced-optimization/">optimización avanzada de API</a>.</p>

<h3>Debida diligencia operativa antes de producción</h3>
<ul>
  <li>Ejecute sondeos sintéticos de 24 horas (un mensaje cada 15 minutos) midiendo latencia p95 y tasa de error.</li>
  <li>Registre una muestra de request ID; confirme que la aplicación puede correlacionar logs del gateway con IDs upstream en incidentes.</li>
  <li>Revise el acuerdo de tratamiento de datos: algunos relays registran prompts para detección de abuso, lo cual no es aceptable para cargas reguladas.</li>
  <li>Prefiera gateways bajo control de la organización (LiteLLM autohospedado, One-API en VPC) frente a revendedores públicos opacos cuando se maneja código fuente.</li>
</ul>

<p>La estabilidad a nivel de cuenta sigue dependiendo de la higiene del registro; consulte <a href="/guides/account-registration-and-payment-antiban/">registro de cuenta y pago anti-ban</a> si la adopción del relay coincide con la creación de una organización nueva.</p>

<h2>3. Límites de tasa (429) y conmutación por error ordenada</h2>
<p>Los rate limits de Anthropic aplican a nivel de organización y nivel de modelo, no solo por API key aislada. Agentes en ráfaga, jobs de CI en paralelo y bucles de reintento sin límite pueden agotar la cuota compartida y bloquear servicios no relacionados en la misma organización.</p>

<h3>Clases de límite (simplificado)</h3>
<table>
  <thead>
    <tr>
      <th>Señal</th>
      <th>Código HTTP</th>
      <th>Significado</th>
      <th>Respuesta segura</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rate limit</td>
      <td>429</td>
      <td>Demasiadas solicitudes o tokens por minuto</td>
      <td>Backoff exponencial con jitter; reducir concurrencia</td>
    </tr>
    <tr>
      <td>Sobrecarga</td>
      <td>529</td>
      <td>Capacidad upstream</td>
      <td>Backoff corto; opcionalmente bajar de modelo</td>
    </tr>
    <tr>
      <td>Auth / política</td>
      <td>403</td>
      <td>Clave inválida o acceso denegado</td>
      <td>No reintentar a ciegas; revisar estado de la cuenta</td>
    </tr>
    <tr>
      <td>Solicitud incorrecta</td>
      <td>400</td>
      <td>Esquema o límite de tokens</td>
      <td>Corregir payload; recortar contexto</td>
    </tr>
  </tbody>
</table>

<h3>Patrón de reintento y conmutación por error</h3>
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

<h3>Controles de concurrencia</h3>
<ul>
  <li><strong>Token bucket en CI:</strong> limite los jobs de agente en paralelo (p. ej., máximo 3 concurrentes) por organización.</li>
  <li><strong>Fusión de solicitudes:</strong> agrupe correcciones de lint pequeñas en lugar de una llamada API por archivo cuando sea posible.</li>
  <li><strong>Circuit breaker:</strong> tras N 429 consecutivos, abra el circuito 60 s y enrute al fallback automáticamente; evita tormentas de reintentos.</li>
  <li><strong>Observabilidad:</strong> exporte métricas: <code>claude_requests_total{status}</code>, <code>fallback_invocations_total</code>, latencia p95. Alerte si la tasa de fallback supera el 15% durante 10 minutos.</li>
</ul>

<h3>403 frente a 429: no tratarlos igual</h3>
<p>Un 429 es presión temporal: retroceder y reanudar. Un 403 suele indicar revocación de credenciales, restricción geográfica o cambio de estado de la cuenta. Reintentar 403 con claves alternas sin diagnóstico puede acelerar la aplicación de políticas. Use la <a href="/guides/troubleshooting-guide/">guía de solución de problemas</a> para clasificar errores antes de rotar infraestructura.</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Debería definir <code>TZ</code> si la zona horaria del sistema ya es correcta?</h3>
<p>Si la zona horaria del SO, la geografía de salida del proxy y el perfil del navegador ya coinciden, un <code>TZ</code> explícito puede ser redundante, pero los contenedores de CI suelen usar UTC por defecto. La exportación explícita hace el comportamiento determinista entre portátiles y servidores.</p>

<h3>¿Es «seguro» un revendedor público de API para código fuente de la empresa?</h3>
<p>Trátelo como cualquier subprocesador de terceros: revise registro, retención y lista de subprocesadores. Para código propietario, los relays autohospedados en su VPC son estrictamente más seguros que revendedores anónimos.</p>

<h3>¿Por qué desaparecen los ahorros de caché al cambiar de gateway?</h3>
<p>Lo más habitual es que el relay elimine encabezados <code>anthropic-beta</code> o reordene bloques system, invalidando las claves de caché. Repita la prueba de caché de dos solicitudes tras cualquier cambio de gateway.</p>

<h3>¿Puedo usar proxies distintos para el navegador y Claude Code?</h3>
<p>Técnicamente sí, pero aumenta el riesgo de divergencia. Prefiera una ruta de salida documentada para todo el tráfico Claude, salvo que aísle cuentas experimentales en perfiles separados.</p>

<h3>¿Qué modelo de respaldo debería usar Claude Code ante un 429?</h3>
<p>Claude Code no tiene conmutación multi-modelo integrada; implémentela en el gateway (One-API/LiteLLM) o desactive Claude Code temporalmente y use plugins del IDE apuntando a APIs de respaldo. Vea <a href="/guides/domestic-and-open-source-alternatives/">alternativas locales y de código abierto</a> para tablas de enrutamiento.</p>

<h3>¿Cómo depurar «funciona en curl pero falla en Claude Code»?</h3>
<ol>
  <li>Compare encabezados: capture curl frente al CLI con mitmproxy o logs de acceso del gateway.</li>
  <li>Confirme el entorno en el shell de lanzamiento: las terminales integradas del IDE a veces omiten archivos rc de login.</li>
  <li>Revise los agentes proxy de Node/fetch; algunas versiones ignoran <code>HTTPS_PROXY</code> salvo que se defina <code>GLOBAL_AGENT_HTTP_PROXY</code>.</li>
  <li>Verifique interceptación TLS en redes corporativas.</li>
</ol>

<h3>¿Asumir URL base de first party afecta la facturación de Anthropic?</h3>
<p>No. La facturación sigue la API key y la organización ligadas al upstream que realmente atiende la solicitud. Si el gateway reenvía a Anthropic, paga Anthropic; si cambia de modelo, paga el proveedor que invoque el gateway.</p>
`;
