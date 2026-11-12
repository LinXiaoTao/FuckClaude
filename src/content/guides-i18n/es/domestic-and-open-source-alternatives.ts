export const content = `
<p>Cuando el acceso directo a Claude, las cuotas de API o el enrutamiento regional dejan de ser fiables, una pila de contingencia bien diseñada mantiene en marcha el pipeline de desarrollo. Los modelos regionales de frontera y las pilas open source locales no son atajos para violar políticas: son herramientas legítimas de continuidad para equipos que necesitan latencia predecible, menor costo unitario y respaldos que funcionan sin conexión. Esta guía compara alternativas prácticas, recorre la configuración de Ollama y One-API, y muestra cómo enrutar cargas de trabajo sin reescribir cada integración.</p>

<p>Antes de desplegar alternativas, alinee el entorno base. Si Claude sigue siendo el upstream principal, consulte las guías de <a href="/guides/environment-cleanup-and-ip-setup/">limpieza del entorno y configuración de IP</a> y <a href="/guides/vpn-and-proxy-selection/">selección de VPN y proxy</a>. Para controlar costos de API en el lado de Claude, combine esta guía con <a href="/guides/api-advanced-optimization/">optimización avanzada de API</a>.</p>

<h2>1. Comparación de modelos de frontera regionales</h2>
<p>Los modelos de frontera chinos y regionales cubren hoy la mayoría de las tareas de ingeniería diaria: autocompletado de código, refactors, generación de pruebas, análisis de logs y Q&amp;A sobre documentos largos. Difieren en longitud de contexto, fidelidad de tool calling, profundidad de razonamiento y precios, no en si pueden reemplazar a Claude por completo.</p>

<h3>Matriz comparativa de capacidades</h3>
<table>
  <thead>
    <tr>
      <th>Modelo</th>
      <th>Ideal para</th>
      <th>Ventana de contexto</th>
      <th>Herramientas / JSON</th>
      <th>Latencia típica (CN)</th>
      <th>Perfil de costo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>DeepSeek R1 / V3</td>
      <td>Razonamiento complejo, diseño de algoritmos, refactors multiarchivo</td>
      <td>64K–128K (según API)</td>
      <td>Function calling sólido en V3</td>
      <td>Baja (CDN doméstico)</td>
      <td>Muy bajo por token</td>
    </tr>
    <tr>
      <td>Kimi / Kimi Code</td>
      <td>Lectura a escala de repositorio, revisión de especificaciones, documentación bilingüe</td>
      <td>Hasta 2M tokens (producto Code)</td>
      <td>Bueno; ideal para ingest de contexto largo</td>
      <td>Baja–media</td>
      <td>Nivel medio; los planes de contexto largo varían</td>
    </tr>
    <tr>
      <td>GLM-4 (Zhipu AI)</td>
      <td>APIs empresariales, salidas estructuradas, trabajos por lotes</td>
      <td>128K típico</td>
      <td>Modo JSON y herramientas maduros</td>
      <td>Baja</td>
      <td>Precios empresariales predecibles</td>
    </tr>
    <tr>
      <td>Qwen2.5-Coder local (Ollama)</td>
      <td>Desarrollo air-gapped, fragmentos sensibles a privacidad, CI offline</td>
      <td>32K–128K (limitado por hardware)</td>
      <td>Vía mapeo LiteLLM / One-API</td>
      <td>Depende de GPU</td>
      <td>Solo hardware y electricidad</td>
    </tr>
  </tbody>
</table>

<h3>Selección de modelo por carga de trabajo</h3>
<ul>
  <li><strong>DeepSeek R1 / V3:</strong> Use R1 cuando necesite depuración estilo chain-of-thought o lógica de nivel de programación competitiva. V3 es el mejor valor por defecto para llamadas API en producción: más rápido, más barato y estable para generación de código. Vigile los límites de tasa en horas pico; encole trabajos por lotes no urgentes fuera de pico.</li>
  <li><strong>Kimi / Kimi Code:</strong> Ideal cuando un solo prompt debe absorber todo el árbol README de un monorepo, una especificación OpenAPI y tres RFC. Kimi Code añade flujos orientados al IDE. Modo de fallo: contextos muy largos pueden diluir el foco; anteponga un esquema estructurado para que el modelo ancle secciones.</li>
  <li><strong>GLM-4 / Zhipu AI:</strong> Buena opción cuando el cumplimiento exige facturación, SLA y endpoints accesibles en territorio continental sin VPN. Function calling y modos de esquema JSON están listos para producción. Menos apto para debates abiertos de arquitectura que R1 o Claude Opus.</li>
  <li><strong>Open source local (Qwen, DeepSeek destilado, variantes Llama):</strong> Mejor para código adyacente a secretos, entornos regulados o cuando las llamadas API salientes están bloqueadas por completo. La brecha de calidad frente a modelos de frontera en la nube es menor en tareas acotadas: correcciones de lint, plantillas, stubs de pruebas unitarias.</li>
</ul>

<h3>Cuándo no cambiar</h3>
<p>Mantenga Claude (o el upstream principal) en tareas de alto riesgo que dependen de un ajuste de seguridad específico, bucles de agente de largo horizonte o integraciones de toolchain probadas solo contra modelos de Anthropic. Las alternativas destacan en <em>continuidad</em>, no en clonar cada comportamiento específico de Claude. Si el acceso a la cuenta es inestable, lea <a href="/guides/account-registration-and-payment-antiban/">registro de cuenta y pago antiban</a> antes de asumir que un modelo regional corrige un problema de elegibilidad de fondo.</p>

<h2>2. Configuración privada de Ollama y compatibilidad One-API con Claude</h2>
<p>Una pasarela local o privada que hable la API Messages de Anthropic permite que CLIs, plugins de IDE y scripts existentes sigan funcionando al cambiar el modelo upstream. Dos capas habituales: <strong>Ollama</strong> (runtime del modelo) y <strong>One-API</strong> o <strong>LiteLLM</strong> (traducción de protocolo y gestión de claves).</p>

<h3>Lista de requisitos previos</h3>
<ul>
  <li>Host con 16 GB+ de RAM para modelos 7B–14B; 32 GB+ y GPU dedicada para 32B+ a velocidad usable.</li>
  <li>Docker (para One-API) o Python 3.10+ (para LiteLLM).</li>
  <li>Una API key dedicada por entorno (dev/staging/prod); nunca reutilice claves de Claude en producción en una pasarela compartida.</li>
  <li>Política de egress de red documentada: solo local, VPC interna o VPN del equipo.</li>
</ul>

<h3>Configuración de ruta local Claude con Ollama</h3>
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

<h3>Alternativa LiteLLM (mismo objetivo, otra pila)</h3>
<pre><code># pip install 'litellm[proxy]'
# config.yaml excerpt:
model_list:
  - model_name: claude-fallback
    litellm_params:
      model: ollama/qwen2.5-coder:14b
      api_base: http://127.0.0.1:11434

litellm --config config.yaml --port 4000</code></pre>

<h3>Verificación posterior al despliegue</h3>
<ol>
  <li>Envíe una solicitud mínima de Messages API (<code>max_tokens: 64</code>) y confirme HTTP 200.</li>
  <li>Compare campos del esquema de respuesta (<code>content</code>, <code>usage</code>) con la documentación de Anthropic; algunas pasarelas omiten <code>cache_creation_input_tokens</code>; es esperado en backends que no son Claude.</li>
  <li>Ejecute una tarea real desde el plugin de IDE o Claude Code con <code>ANTHROPIC_BASE_URL</code> definido; capture logs de latencia y forma de error.</li>
  <li>Documente el rollback: desactive variables de entorno para restaurar el enrutamiento directo a Anthropic en menos de 30 segundos.</li>
</ol>

<h3>Modos de fallo frecuentes</h3>
<ul>
  <li><strong>Docker no alcanza Ollama en el host:</strong> Use <code>host.docker.internal</code> (macOS/Windows) o <code>--network host</code> (Linux).</li>
  <li><strong>El modelo alucina tool calls:</strong> Desactive el uso nativo de herramientas en el cliente o mapee a un backend con function calling verificado (canal API GLM-4 / DeepSeek V3 en One-API).</li>
  <li><strong>Desbordamiento de contexto:</strong> Los modelos locales 14B degradan por encima de ~32K tokens efectivos; recorte contexto del repositorio o enrute trabajos largos a Kimi.</li>
  <li><strong>Caché obsoleta de la pasarela:</strong> Tras cambiar el modelo, reinicie el proceso proxy para refrescar tablas de alias.</li>
</ul>

<p>Los endpoints personalizados interactúan con el fingerprinting del cliente. Si usa Claude Code contra una base URL no predeterminada, revise <a href="/guides/claude-steganography-and-risk-model/">esteganografía y modelo de riesgo de Claude</a> y <a href="/guides/claude-code-and-api-safety/">Claude Code y seguridad de API</a> para higiene del entorno: no evasión, sino configuración coherente que evite filtraciones accidentales de señales.</p>

<h2>3. Estrategia de enrutamiento híbrido de modelos</h2>
<p>El enrutamiento híbrido asigna cada tipo de solicitud al modelo adecuado más barato. El objetivo es reducir más del 90% del costo en trabajo masivo mientras se reserva Claude para tareas donde supera de forma medible a las alternativas.</p>

<h3>Reglas de enrutamiento sugeridas</h3>
<table>
  <thead>
    <tr>
      <th>Tipo de tarea</th>
      <th>Principal</th>
      <th>Respaldo</th>
      <th>Disparador del respaldo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Revisión de arquitectura / seguridad</td>
      <td>Claude Sonnet/Opus</td>
      <td>DeepSeek R1</td>
      <td>429, 403 o SLA &gt; 30s</td>
    </tr>
    <tr>
      <td>Generación de pruebas unitarias</td>
      <td>DeepSeek V3</td>
      <td>Qwen Coder local</td>
      <td>Corte de API</td>
    </tr>
    <tr>
      <td>Q&amp;A de documentación de todo el repo</td>
      <td>Kimi Code</td>
      <td>GLM-4 contexto largo</td>
      <td>Errores de límite de contexto</td>
    </tr>
    <tr>
      <td>Ediciones con PII / adyacentes a secretos</td>
      <td>Ollama local</td>
      <td>—</td>
      <td>Siempre local</td>
    </tr>
    <tr>
      <td>Autofix de CI ante fallo de lint</td>
      <td>DeepSeek V3</td>
      <td>Qwen local</td>
      <td>Tope de costo alcanzado</td>
    </tr>
  </tbody>
</table>

<h3>Bosquejo de implementación</h3>
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

<h3>Prácticas operativas</h3>
<ul>
  <li><strong>Tope de presupuesto:</strong> Configure alertas de gasto diario en cada API en la nube; el exceso va automáticamente a Ollama local.</li>
  <li><strong>Plantillas de prompt:</strong> Mantenga un system prompt canónico por tipo de tarea; los modelos regionales suelen necesitar instrucciones explícitas de formato de salida que Claude infiere de forma implícita.</li>
  <li><strong>Bucle de evaluación:</strong> Semanalmente, ejecute 20 prompts golden por Claude y respaldos; registre tasa de aprobación en pruebas y puntuación de revisión humana. Sustituya reglas de enrutamiento cuando la calidad del respaldo cruce el umbral definido.</li>
  <li><strong>Playbooks de incidentes:</strong> Documente quién puede cambiar <code>ANTHROPIC_BASE_URL</code> y quién aprueba enrutar cargas sensibles a APIs de terceros frente a solo local.</li>
</ul>

<p>Cuando la contingencia misma falla (timeouts de pasarela, JSON de herramientas corrupto o respuestas 403 ambiguas), use el árbol de decisión de la <a href="/guides/troubleshooting-guide/">guía de resolución de problemas</a> antes de cambiar modelos al azar.</p>

<h2>FAQ</h2>

<h3>¿Puede One-API reemplazar por completo a Claude para Claude Code?</h3>
<p>Puede mantener el CLI en ejecución, pero la fidelidad de herramientas y el comportamiento de seguridad diferirán. Trate One-API como una ruta degradada para asistencia de codificación, no como sustituto byte a byte de Claude. Valide ediciones críticas con pruebas y revisión.</p>

<h3>¿Qué modelo regional se acerca más a Claude para trabajo backend en Python?</h3>
<p>DeepSeek V3 es el valor por defecto más habitual para generación de código backend y diseño de API. Kimi gana cuando el tamaño de entrada domina el costo. GLM-4 es más sólido cuando se necesitan facturación empresarial estable y salidas con esquema JSON.</p>

<h3>¿Es seguro Ollama local para código propietario?</h3>
<p>Los datos permanecen en la máquina, pero los pesos del modelo siguen procesando texto en claro. Para datos regulados, use hosts air-gapped, cifrado de disco y controles de acceso. La inferencia local elimina el riesgo de retención de terceros; no elimina el riesgo interno ni de malware.</p>

<h3>¿Enrutar por alternativas reduce el riesgo de ban en la cuenta de Claude?</h3>
<p>Usar alternativas reduce la <em>dependencia</em> del tiempo de actividad de Claude; no inmuniza una cuenta de Claude frente a la aplicación de políticas. Mantenga cuentas, pagos y entornos conformes; consulte <a href="/guides/account-registration-and-payment-antiban/">registro y pago antiban</a>.</p>

<h3>¿Cómo estimar el ahorro de costos?</h3>
<p>Mida tokens por tipo de tarea durante dos semanas en Claude, luego reproduzca el mismo conjunto golden en DeepSeek/Kimi. El ahorro depende de la mezcla de tareas y los modelos comparados; mídalo en la propia carga de trabajo en lugar de confiar en una cifra genérica. Las revisiones de arquitectura suelen quedarse en Claude porque domina el tiempo de revisión humana.</p>

<h3>¿Qué hardware se necesita para una velocidad local aceptable?</h3>
<p>Apple Silicon M2 Pro con 32 GB de RAM ejecuta modelos 14B de forma interactiva. GPUs clase NVIDIA RTX 4090 o A5000 manejan cuantizaciones 32B para pasarelas compartidas de equipos pequeños. La inferencia solo con CPU es viable para ediciones de un archivo, no para bucles de agente grandes.</p>
`;
