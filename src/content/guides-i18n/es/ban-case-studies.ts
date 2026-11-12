export const content = `
<p><strong>Nota:</strong> Los detalles de los casos siguientes no se han verificado de forma independiente, y las causas raíz son interpretaciones, no hallazgos confirmados por Anthropic. Los motivos oficiales de baneo de Anthropic se resumen en <a href="/guides/antiban-essentials/">Esenciales anti-baneo</a>.</p>

<h2>1. Caso 1: baneo masivo por desajuste de zona horaria</h2>
<p><strong>Incidente:</strong> Un equipo de 15 desarrolladores registró cuentas Claude Pro mientras viajaban al extranjero. En 72 horas, 12 cuentas recibieron baneo permanente con avisos de «Terms of Service violation».</p>

<h3>Análisis de causa raíz</h3>
<ul>
  <li>La zona horaria del sistema seguía en <code>Asia/Shanghai</code> (UTC+8) mientras se usaban proxies residenciales basados en EE. UU.</li>
  <li>El navegador <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code> devolvía <code>"Asia/Shanghai"</code>, que Claude Code lee y codifica en los prompts del sistema.</li>
  <li>Las tarjetas se vincularon con direcciones de facturación de EE. UU., pero el desajuste de zona horaria activó clasificadores de riesgo automáticos.</li>
</ul>

<h3>Lista de prevención</h3>
<pre><code># Before registration, verify timezone alignment:
# macOS
sudo systemsetup -gettimezone

# Linux
timedatectl

# Ensure timezone matches proxy exit region:
sudo systemsetup -settimezone "America/New_York"</code></pre>

<ul>
  <li>Configurar la zona horaria del SO para que coincida con la región de salida del proxy IP <em>antes</em> de abrir Claude.ai.</li>
  <li>Verificar la zona horaria en la consola del navegador: <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code>.</li>
  <li>Borrar todas las cookies del navegador y reiniciar tras cambiar la zona horaria para vaciar huellas en caché.</li>
</ul>

<h2>2. Caso 2: reembolso con tarjeta prepago y suspensión</h2>
<p><strong>Incidente:</strong> Ocho suscripciones Claude Pro se cobraron correctamente el día 1, pero las cuentas se reembolsaron y suspendieron automáticamente en 48 horas.</p>

<h3>Análisis de causa raíz</h3>
<ul>
  <li>Todas las cuentas usaron tarjetas prepago Visa virtuales emitidas bajo el mismo BIN. Anthropic no publica qué BIN bloquea, y las prepago no están listadas como aceptadas para Pro o Max.</li>
  <li>Las direcciones de facturación eran genéricas (p. ej. «123 Main St»), no direcciones residenciales reales que coincidieran con la región del banco emisor.</li>
  <li>Los cargos se reembolsaron y las cuentas quedaron marcadas «Refunded / Suspended». Anthropic no ha explicado el motivo.</li>
</ul>

<h3>Lista de prevención</h3>
<ul>
  <li>Usar una tarjeta de crédito o débito de un banco consolidado en lugar de una prepago virtual.</li>
  <li>Completar la dirección de facturación con direcciones reales y verificables de EE. UU. (usar búsqueda de direcciones USPS) que coincidan con el estado de la IP del proxy.</li>
  <li>Asegurar que el saldo de la tarjeta cubra el primer cargo y la siguiente renovación.</li>
  <li>Nunca vincular la misma tarjeta virtual a más de 2 cuentas Claude.</li>
</ul>

<h2>3. Caso 3: detección de abuso de tasa en la API</h2>
<p><strong>Incidente:</strong> La clave API de una startup quedó limitada a 1 solicitud por minuto tras ejecutar un trabajo de destilación por lotes que envió 50,000 solicitudes en 6 horas.</p>

<h3>Análisis de causa raíz</h3>
<ul>
  <li>El script envió solicitudes al máximo rendimiento sin limitación de tasa ni jitter.</li>
  <li>Todos los prompts eran casi idénticos con solo variaciones menores de parámetros, activando los clasificadores de detección de destilación de Anthropic.</li>
  <li>Las solicitudes provenían de una sola IP de datacenter AWS EC2, elevando aún más la puntuación de riesgo de abuso.</li>
</ul>

<h3>Lista de prevención</h3>
<pre><code>// Implement exponential backoff and jitter in API client
async function callClaudeWithBackoff(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropic.messages.create({
        model: "claude-sonnet-4.5-high",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error: any) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}</code></pre>

<ul>
  <li>Implementar retroceso exponencial con jitter aleatorio (100-3000 ms) entre llamadas a la API.</li>
  <li>Rotar claves API entre varias organizaciones si se escala más allá de 1000 solicitudes/hora.</li>
  <li>Usar IP de proxy residencial para tráfico API, nunca IP de datacenter.</li>
  <li>Variar estructuras de prompt e inyectar variaciones naturales tipo humano para evitar detección del clasificador.</li>
</ul>

<h2>4. Caso 4: baneo en cadena por asociación de cuentas</h2>
<p><strong>Incidente:</strong> Cinco cuentas Claude se banearon simultáneamente tras violar los ToS una cuenta del grupo.</p>

<h3>Análisis de causa raíz</h3>
<ul>
  <li>Las cinco cuentas compartían el mismo <code>organizationUuid</code> porque iniciaron sesión vía Claude Code en la misma máquina con distintos perfiles de navegador.</li>
  <li>La misma tarjeta de crédito virtual estaba vinculada a 4 de las 5 cuentas.</li>
  <li>Cuando una cuenta se marcó por uso de script automatizado, el backend de Anthropic vinculó todas las cuentas asociadas y aplicó un baneo general.</li>
</ul>

<h3>Lista de prevención</h3>
<pre><code># Check Claude Code's organizationUuid grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li>Nunca compartir tarjetas de crédito virtuales entre más de 2 cuentas Claude.</li>
  <li>Usar máquinas o máquinas virtuales separadas para cuentas de alto valor y evitar compartir <code>organizationUuid</code>.</li>
  <li>Si se usan perfiles de navegador, asegurar que cada perfil tenga cookies, localStorage y huellas (Canvas, WebGL) totalmente aislados.</li>
  <li>Evitar operaciones por lotes entre cuentas asociadas en ventanas de tiempo cortas.</li>
</ul>

<h2>5. Lecciones aprendidas y lista maestra de prevención</h2>
<p>Todo caso de baneo comparte patrones comunes. Siga esta lista maestra para minimizar el riesgo:</p>

<ul>
  <li><strong>Pre-registro:</strong> Sincronizar zona horaria del SO, limpiar estado del navegador, verificar IP residencial, preparar número de teléfono y tarjeta conformes.</li>
  <li><strong>Vinculación de pago:</strong> Usar crédito o débito de banco consolidado, dirección de facturación real que coincida con el registro del banco, saldo suficiente para renovaciones y evitar reutilizar una tarjeta en varias cuentas.</li>
  <li><strong>Uso diario:</strong> Mantener huellas coherentes de zona horaria/IP/dispositivo, activar 2FA, evitar cambios rápidos de IP sin reautenticación 2FA.</li>
  <li><strong>Automatización API:</strong> Implementar limitación de tasa, jitter, proxies residenciales y variación de prompts para evitar banderas de destilación.</li>
  <li><strong>Multi-cuenta:</strong> Aislar organizationUuid, métodos de pago y patrones de uso para prevenir baneos por asociación.</li>
</ul>
`;
