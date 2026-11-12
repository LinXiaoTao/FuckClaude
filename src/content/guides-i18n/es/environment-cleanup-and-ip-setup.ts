export const content = `
<h2>1. Alineación de región del sistema operativo y del navegador</h2>
<p>Cuando la zona horaria del sistema operativo, la configuración regional, la lista de idiomas del navegador y la región de salida de red no coinciden, los sistemas automatizados de riesgo pueden marcar la sesión, incluso en usuarios legítimos que acceden a Claude desde países compatibles mediante VPN o mientras viajan. El objetivo práctico es <strong>alinear el entorno con la región de la cuenta</strong> para que las señales se lean de forma coherente, reduciendo falsos positivos en lugar de intentar ocultar por completo la identidad.</p>

<p>Esta guía se centra en la higiene a nivel de sistema y de navegador. Para la configuración detallada por navegador en Chrome, Firefox y Edge, consulte la <a href="/guides/browser-configuration-guide/">guía de configuración del navegador</a>. Para particularidades de macOS, Windows, Linux y móvil, consulte la <a href="/guides/device-setup-guide/">guía de configuración de dispositivos multiplataforma</a>.</p>

<h3>Por qué las incoherencias activan revisiones</h3>
<p>Los proveedores antifraude correlacionan la configuración regional de <code>Intl</code>, <code>navigator.languages</code>, el desfase horario, las métricas de fuentes y la geolocalización por IP. Una IP de Tokio con zona horaria de Pekín y <code>zh-CN</code> como idioma principal del navegador difiere del perfil típico de usuarios de la región; es el patrón que apuntan las reglas automatizadas.</p>

<h3>Comandos de zona horaria en macOS / Linux</h3>
<pre><code># macOS: Set system timezone to match your account region
sudo systemsetup -settimezone "America/Los_Angeles"
# Or for JP/SG accounts:
sudo systemsetup -settimezone "Asia/Tokyo"

# Linux (Ubuntu/Debian)
sudo timedatectl set-timezone America/Los_Angeles

# Verify
date
# Expected: local time matching proxy exit region (PST, JST, etc.)</code></pre>

<h3>Lista de verificación de idioma del navegador y huella de fuentes</h3>
<ul>
  <li><strong>Orden de idiomas:</strong> Coloque <code>en-US</code> (cuentas de EE. UU.) o <code>ja-JP</code> (cuentas JP) primero en <code>navigator.languages</code>. Mueva <code>zh-CN</code> por debajo del inglés o elimínelo del perfil activo que use para Claude.</li>
  <li><strong>Configuración regional Intl:</strong> Confirme que <code>Intl.DateTimeFormat().resolvedOptions().locale</code> resuelva a la región objetivo (por ejemplo <code>en-US</code>, no <code>zh-CN</code>).</li>
  <li><strong>Fuentes de fabricantes chinos:</strong> MiSans, HarmonyOS Sans y OPPO Sans producen mediciones de ancho en Canvas muy distintivas. Use un perfil de navegador dedicado sin estas fuentes instaladas a nivel de sistema, o un perfil aislado con navegador anti-detección.</li>
  <li><strong>Cabecera Accept-Language:</strong> Debe coincidir con la entrada principal de <code>navigator.languages</code>; las incoherencias entre cabeceras HTTP y APIs de JS son un vector de detección conocido (se explica en nuestra <a href="/guides/claude-steganography-and-risk-model/">guía del modelo de riesgo</a>).</li>
</ul>

<h3>Configuración regional del SO frente a región de la cuenta</h3>
<table>
  <thead>
    <tr>
      <th>Señal</th>
      <th>Objetivo cuenta EE. UU.</th>
      <th>Objetivo cuenta JP/SG</th>
      <th>Error frecuente</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Zona horaria del sistema</td>
      <td>America/Los_Angeles o America/New_York</td>
      <td>Asia/Tokyo o Asia/Singapore</td>
      <td>Dejar Asia/Shanghai con IP de EE. UU.</td>
    </tr>
    <tr>
      <td>Idioma principal del navegador</td>
      <td>en-US</td>
      <td>en-US o ja-JP</td>
      <td>zh-CN primero en la lista de idiomas</td>
    </tr>
    <tr>
      <td>Formato de fecha/número</td>
      <td>MM/DD/YYYY, USD</td>
      <td>Según la configuración regional local</td>
      <td>Símbolo CNY en Intl.NumberFormat</td>
    </tr>
    <tr>
      <td>Fuentes CJK instaladas</td>
      <td>Mínimas o aisladas por perfil</td>
      <td>Mínimas o aisladas por perfil</td>
      <td>Pila completa de fuentes chinas del OEM</td>
    </tr>
  </tbody>
</table>

<h2>2. Nodos proxy, IP residenciales y prevención de fugas</h2>
<p>Los informes de la comunidad sugieren que los ASN de centros de datos se bloquean con más frecuencia que los ISP residenciales. Alinear la IP con un ISP residencial en el país de la cuenta es la base para un acceso estable; no garantiza la ausencia de prohibiciones, pero es condición necesaria para evitar bloqueos inmediatos. Lea la <a href="/guides/vpn-and-proxy-selection/">guía de selección de VPN y proxy</a> para criterios de evaluación de proveedores.</p>

<h3>Comparación de tipos de IP</h3>
<table>
  <thead>
    <tr>
      <th>Categoría de IP</th>
      <th>Perfil ASN</th>
      <th>Acceso típico a Claude</th>
      <th>Notas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ISP residencial (AT&amp;T, Comcast, NTT)</td>
      <td>Banda ancha de consumo</td>
      <td>Mayor estabilidad</td>
      <td>Coincidir estado/ciudad con la facturación cuando sea posible</td>
    </tr>
    <tr>
      <td>IP de operador móvil (4G/5G)</td>
      <td>ISP celular</td>
      <td>Adecuada para viajes</td>
      <td>Las IP rotan; evite cambios a mitad de sesión</td>
    </tr>
    <tr>
      <td>Centro de datos / VPS</td>
      <td>ASN de proveedor cloud</td>
      <td>A menudo bloqueado o con muchos CAPTCHA</td>
      <td>No recomendado para el registro</td>
    </tr>
    <tr>
      <td>Pool de proxy compartido económico</td>
      <td>Mixto, uso frecuente indebido</td>
      <td>Alta tasa de prohibiciones</td>
      <td>Un vecino malo afecta todo el pool</td>
    </tr>
  </tbody>
</table>

<h3>Prevención de fugas WebRTC</h3>
<p>Los navegadores pueden exponer IP locales o públicas reales mediante WebRTC aunque el tráfico HTTP use un proxy: proxy de EE. UU. en las cabeceras más una IP residencial de CN en WebRTC es una incoherencia de alta confianza.</p>
<ul>
  <li>Desactive WebRTC en la configuración del navegador o con extensiones como <em>WebRTC Control</em> en «Disable non-proxied UDP».</li>
  <li>En Firefox, establezca <code>media.peerconnection.enabled = false</code> en <code>about:config</code>.</li>
  <li>Pruebe en browserleaks.com/webrtc después de cada cambio de proxy o perfil.</li>
</ul>

<h3>Prevención de fugas DNS</h3>
<ul>
  <li>No resuelva <code>claude.ai</code> mediante DNS públicos chinos (223.5.5.5, 119.29.29.29) mientras presente una IP de EE. UU.; las fugas de geolocalización DNS contradicen el nodo de salida.</li>
  <li>Enrute el DNS por el túnel del proxy (Clash fake-ip, DNS remoto de Sing-box) o use DoH/DoT vía Cloudflare (1.1.1.1) o Google (8.8.8.8) por la misma ruta que el tráfico HTTP.</li>
  <li>Verifique con dnsleaktest.com antes de iniciar sesión en Claude o vincular el pago (consulte la <a href="/guides/account-registration-and-payment-antiban/">guía de registro de cuenta y pago</a>).</li>
</ul>

<h2>3. Lista de aislamiento con navegador anti-detección</h2>
<p>Cuando un equipo opera legítimamente cuentas separadas (por ejemplo, asientos individuales de empresa), los navegadores anti-detección (AdsPower, GoLogin, Multilogin, etc.) mantienen la configuración de cada perfil separada y coherente. Esto es higiene del entorno, no una forma de eludir los términos de Anthropic: compartir cuentas, evadir prohibiciones y acceder desde regiones no compatibles siguen siendo contrarios a las reglas.</p>

<ol>
  <li><strong>Un perfil dedicado por cuenta:</strong> Nunca comparta cookies ni localStorage entre asientos Pro.</li>
  <li><strong>Vincule cada perfil a una IP residencial dedicada:</strong> Se prefieren sesiones fijas (sticky); documente qué IP corresponde a qué cuenta (<a href="/guides/multi-account-management/">gestión de múltiples cuentas</a>).</li>
  <li><strong>Active ruido en Canvas, máscara WebGL y aislamiento de AudioContext:</strong> Evita la correlación de huellas entre perfiles en la misma máquina física.</li>
  <li><strong>Sincronice automáticamente la zona horaria del perfil con la geo del proxy:</strong> La mayoría de herramientas anti-detección lo ofrecen; verifique manualmente con <code>Date()</code> en la consola de DevTools.</li>
  <li><strong>Coincida el User-Agent con el SO declarado:</strong> Un UA de Windows en un host Mac con cadenas de renderer WebGL incoherentes falla las comprobaciones de consistencia.</li>
</ol>

<h3>Pasos de verificación previos a la sesión</h3>
<ol>
  <li>Confirme la zona horaria: <code>new Date().getTimezoneOffset()</code> coincide con la región objetivo.</li>
  <li>Confirme idiomas: <code>navigator.languages</code> en DevTools.</li>
  <li>Ejecute pruebas de fuga WebRTC y DNS.</li>
  <li>Revise el ASN en ipinfo.io: ¿es residencial, no cloud?</li>
  <li>Solo entonces abra claude.ai o el flujo OAuth de Claude Code.</li>
</ol>

<h3>Qué NO hacer</h3>
<ul>
  <li>No cambie de país del proxy a mitad del registro o del pago; complete todo el flujo en una sola región.</li>
  <li>No use extensiones de navegador VPN «gratuitas» junto con un proxy residencial de pago; el doble enrutamiento provoca salidas impredecibles.</li>
  <li>No inicie sesión en la misma cuenta desde un perfil anti-detección «limpio» y desde el Chrome diario con configuración regional china; los entornos se vincularán con el tiempo.</li>
  <li>No ignore fugas IPv6; desactive IPv6 a nivel de sistema o asegúrese de que el proxy maneje v6 si el ISP lo asigna.</li>
</ul>

<h2>Preguntas frecuentes</h2>

<h3>¿Se necesita un navegador anti-detección para una sola cuenta personal?</h3>
<p>No necesariamente. Un perfil dedicado de Chrome o Firefox con zona horaria, idiomas, WebRTC desactivado e IP residencial estable basta para la mayoría de usuarios individuales. Las herramientas anti-detección aportan valor al gestionar varias cuentas o cuando el SO diario no puede reconfigurarse (por ejemplo, portátil corporativo).</p>

<h3>¿La zona horaria debe coincidir exactamente con la IP?</h3>
<p>Debe ser plausiblemente coherente. Una IP de la costa oeste de EE. UU. con <code>America/Los_Angeles</code> es lo ideal. Una IP de EE. UU. con zona horaria <code>Asia/Shanghai</code> es una incoherencia de alto riesgo aunque la IP sea válida.</p>

<h3>¿Se puede usar Claude en móvil con la misma cuenta?</h3>
<p>Sí, pero la configuración regional del SO móvil y la IP también deben alinearse con la región de la cuenta cuando sea posible. Cambios bruscos de un perfil de escritorio en EE. UU. a una red móvil CN activan una nueva verificación. Consulte la <a href="/guides/device-setup-guide/">configuración de dispositivos</a> para notas de iOS/Android.</p>

<h3>¿Por qué Claude funciona en el navegador pero Claude Code devuelve 403?</h3>
<p>Claude Code usa huellas TLS y de cabeceras distintas a las del navegador. Asegure que la zona horaria del terminal (variable de entorno <code>TZ</code>), las variables de proxy y la configuración del relé API coincidan con la sesión web. Detalles en la <a href="/guides/claude-steganography-and-risk-model/">guía del modelo de riesgo</a> y en documentación de estrategia regional.</p>

<h3>¿Con qué frecuencia conviene volver a revisar el entorno?</h3>
<p>Tras cualquier cambio de proveedor de proxy, actualización del SO, actualización mayor del navegador o viaje. Revisiones mensuales puntuales (zona horaria, WebRTC, DNS) evitan la deriva lenta que se acumula tras meses de uso.</p>
`;
