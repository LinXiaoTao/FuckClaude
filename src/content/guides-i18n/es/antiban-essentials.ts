export const content = `
<p>Esta lista de verificación comienza con lo que Anthropic declara oficialmente y luego enumera las prácticas que con más frecuencia aparecen en informes de la comunidad y en análisis públicos de ingeniería inversa. Los puntos fuera de la sección oficial son observaciones, no reglas documentadas, y ninguno de ellos convierte una cuenta no elegible en elegible. Cada sección enlaza a una guía más detallada.</p>

<h2>Reglas oficiales primero</h2>
<ul>
  <li><strong>Motivos de bloqueo:</strong> el <a href="https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals" target="_blank" rel="noopener noreferrer">Centro de ayuda</a> de Anthropic enumera violaciones repetidas de la política de uso, creación de cuenta desde una ubicación no admitida y violaciones de los términos de servicio.</li>
  <li><strong>Regiones admitidas:</strong> China continental, Hong Kong y Macao no figuran en la <a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">lista de regiones admitidas</a>; Taiwán, Singapur, Japón e India sí. Usuarios en Hong Kong informaron suspensiones desde el 1 de octubre de 2026, incluidos quienes se conectaron mediante salidas VPN en regiones admitidas, y Anthropic no ha comentado (véase <a href="/news/">Noticias</a>).</li>
  <li><strong>Pago:</strong> Pro y Max en la web solo aceptan tarjetas de crédito o débito, y la dirección de facturación debe coincidir con el país de emisión de la tarjeta. Véase <a href="/guides/payment-methods-comparison/">métodos de pago y solución de rechazos de cargo</a>.</li>
  <li><strong>Apelaciones:</strong> iniciar sesión en claude.ai con la cuenta bloqueada para acceder al formulario de apelación. Las advertencias de API van a usersafety@anthropic.com.</li>
  <li><strong>Escala:</strong> el <a href="https://www.anthropic.com/transparency/system-trust-reporting" target="_blank" rel="noopener noreferrer">informe de transparencia</a> de Anthropic muestra que alrededor del 10,5 % de las apelaciones en la primera mitad de 2026 terminaron en restablecimiento de la cuenta.</li>
</ul>

<h2>1. Seguridad de cuenta y pago</h2>
<ul>
  <li><strong>Una cuenta, una pila de identidad:</strong> no reutilizar la misma tarjeta, número de teléfono o dirección de facturación en varias cuentas Pro. Informes de la comunidad vinculan deshabilitaciones masivas con instrumentos de pago, números de teléfono e IP compartidos.</li>
  <li><strong>La propiedad corporativa importa:</strong> desde septiembre de 2025, las entidades con más del 50 % de propiedad de empresas con sede en regiones no admitidas (p. ej. China) quedan excluidas, incluso si están constituidas en Singapur o en EE. UU.</li>
  <li><strong>Alinear la geografía:</strong> el país de la tarjeta y la dirección de facturación deben coincidir (requisito oficial). Informes de la comunidad también mencionan como combinación frecuente en casos de bloqueo una tarjeta de EE. UU. con IP de Singapur y zona horaria de China.</li>
  <li><strong>Evitar números VoIP:</strong> usar SIM física o servicios de SMS con buena reputación; muchos prefijos VoIP no pasan la verificación o activan revisión inmediata.</li>
  <li><strong>Usar primero la solicitud de reembolso:</strong> Anthropic no ha publicado cómo las disputas bancarias afectan una cuenta. Ante un cargo fallido o no deseado, usar Get help &gt; Claude Refund Request antes de contactar al banco.</li>
</ul>
<p>→ Guía completa: <a href="/guides/account-registration-and-payment-antiban/">Registro de cuenta y pago seguro</a></p>

<h2>2. Higiene del entorno y del navegador</h2>
<ul>
  <li><strong>Corregir la zona horaria primero:</strong> informes públicos de ingeniería inversa indican que Claude Code lee la zona horaria del sistema. Salir de Asia/Shanghai y confirmar que <code>getTimezoneOffset()</code> no sea UTC+8.</li>
  <li><strong>Idioma y fuentes:</strong> quitar zh-CN del inicio de <code>navigator.languages</code>; aislar fuentes de proveedores chinos (MiSans, HarmonyOS Sans) en un perfil de navegador limpio.</li>
  <li><strong>Frenar fugas WebRTC:</strong> deshabilitar o restringir WebRTC para que la IP real no eluda el proxy.</li>
  <li><strong>Usar una IP limpia y estable:</strong> rangos compartidos de datacenter y VPN comerciales aparecen con más frecuencia en informes de bloqueo que IP residenciales o móviles. Preferir una IP residencial o móvil limpia en una región admitida.</li>
</ul>
<p>→ Guía completa: <a href="/guides/environment-cleanup-and-ip-setup/">Limpieza del entorno y configuración de IP</a> · <a href="/guides/browser-configuration-guide/">Configuración del navegador</a></p>

<h2>3. Uso de API y Claude Code</h2>
<ul>
  <li><strong>Emparejar CLI y navegador:</strong> exportar el mismo <code>TZ</code>, proxy y <code>ANTHROPIC_BASE_URL</code> en cada shell donde se ejecute Claude Code. Configuraciones divididas (navegador con VPN, CLI directo) son una causa principal de errores 403.</li>
  <li><strong>Respetar límites de velocidad:</strong> la <a href="https://platform.claude.com/docs/en/api/rate-limits" target="_blank" rel="noopener noreferrer">documentación de la API</a> enumera los niveles Start, Build y Scale; Start permite 1.000 RPM por modelo, y las organizaciones nuevas pueden comenzar en un nivel Evaluation más bajo. Margen de cuota no excluye la revisión de tráfico altamente repetitivo o coordinado. Usar retroceso exponencial, la Batch API o prompt caching para trabajo masivo.</li>
  <li><strong>Elegir relays con cuidado:</strong> gateways que eliminan marcadores <code>cache_control</code> o encabezados <code>anthropic-beta</code>, o inyectan texto, rompen prompt cache y pueden parecer abuso.</li>
  <li><strong>No compartir credenciales:</strong> no pegar claves API en repositorios públicos, registros de chat o logs compartidos de CI. Rotar claves si se exponen.</li>
</ul>
<p>→ Guía completa: <a href="/guides/claude-code-and-api-safety/">Seguridad de Claude Code y API</a> · <a href="/guides/automation-safety-practices/">Prácticas de seguridad en automatización</a></p>

<h2>4. Patrones de uso y frecuencia</h2>
<ul>
  <li><strong>Calentar cuentas nuevas:</strong> evitar cientos de llamadas API o maratones de Claude Code el primer día. El uso gradual parece más natural que carga instantánea al máximo nivel.</li>
  <li><strong>Evitar patrones tipo destilación:</strong> el informe de destilación de Anthropic de febrero de 2026 describe el marcado de solicitudes estrechas y de alto volumen orientadas a capacidades, como miles de prompts de código casi idénticos. Las cuentas creadas después del 31 de agosto de 2026 enfrentan un enlace más estricto de reenvío de thinking blocks; nunca cachear y reenviar thinking blocks en bruto. Distribuir cargas en el tiempo y variar la estructura de los prompts.</li>
  <li><strong>Separar cargas de trabajo:</strong> no ejecutar scraping agresivo, creación masiva de cuentas ni prompts al límite de la política en la cuenta de pago principal.</li>
  <li><strong>Una huella de dispositivo por cuenta:</strong> alternar entre un portátil con locale de China y un VPS en EE. UU. en el mismo inicio de sesión en pocas horas aumenta el riesgo de asociación.</li>
  <li><strong>Registrar y auditar:</strong> mantener visibles volumen de solicitudes y tasas de error para detectar picos 429 antes de que escalen a revisión.</li>
</ul>
<p>→ Guía completa: <a href="/guides/multi-account-management/">Gestión de múltiples cuentas</a> · <a href="/guides/ban-case-studies/">Casos de estudio de bloqueos</a></p>

<h2>5. Cuando algo sale mal</h2>
<ul>
  <li><strong>Diagnosticar el tipo de bloqueo:</strong> 403 al iniciar sesión (IP/geo), correo de reembolso forzado (desajuste de pago) o deshabilitación total (política); cada caso requiere una respuesta distinta.</li>
  <li><strong>Apelar por canales oficiales:</strong> cuentas deshabilitadas → <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a>; advertencias de API → usersafety@anthropic.com. Anthropic no publica tiempos de respuesta; describir el caso de uso legítimo en inglés con contexto verificable.</li>
  <li><strong>No crear cuentas por pánico:</strong> informes de la comunidad van desde restablecimiento en días hasta semanas sin respuesta, y Anthropic no publica tiempos de respuesta. Según informes de la comunidad, crear cuentas de reemplazo mientras hay apelación pendiente aumenta el riesgo de asociación.</li>
  <li><strong>Conmutar con gracia:</strong> tener listo un modelo local o una ruta Ollama/One-API para que la producción no se detenga durante la recuperación.</li>
</ul>
<p>→ Guía completa: <a href="/guides/account-appeal-and-recovery-sop/">Apelación y recuperación de cuenta (SOP)</a> · <a href="/guides/domestic-and-open-source-alternatives/">Alternativas locales</a></p>

<h2>Autocomprobación rápida</h2>
<p>Ejecutar el <a href="/">detector Fuck Claude</a> en el mismo perfil de navegador que se usa para Claude. ¿Puntuación superior a 60? Corregir zona horaria e idioma antes de tocar pago o configuración de API. ¿Puntuación inferior a 30 pero sigue bloqueado? El escaneo no ve la región de registro de la cuenta, reputación de IP, método de pago ni patrón de uso; revisar esos puntos a continuación. Una cuenta creada desde una ubicación no admitida puede deshabilitarse con independencia de la puntuación del navegador.</p>
`;
