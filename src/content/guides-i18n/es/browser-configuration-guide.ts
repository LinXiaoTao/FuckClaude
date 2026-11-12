export const content = `
<h2>1. Configuración anti-prohibición de Chrome</h2>
<p>Chrome es el navegador más usado para acceder a Claude. Una configuración correcta evita incoherencias de zona horaria, fugas WebRTC y huellas de fuentes chinas:</p>

<h3>Sincronización de zona horaria del sistema</h3>
<pre><code># macOS: Set timezone to match proxy exit region
sudo systemsetup -settimezone "America/Los_Angeles"

# Windows: via PowerShell (requires admin)
Set-TimeZone -Id "Pacific Standard Time"

# Linux
sudo timedatectl set-timezone America/Los_Angeles</code></pre>

<h3>Indicadores de lanzamiento de Chrome para mayor privacidad</h3>
<pre><code># Launch Chrome with fingerprint-resistant flags
google-chrome \
  --disable-blink-features=AutomationControlled \
  --disable-webrtc \
  --lang=en-US \
  --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0"</code></pre>

<h3>Lista de verificación de ajustes de Chrome</h3>
<ul>
  <li><strong>Idiomas:</strong> En <code>chrome://settings/languages</code> configure inglés (Estados Unidos) y elimine todas las entradas de idioma chino.</li>
  <li><strong>Control WebRTC:</strong> Instale la extensión <em>WebRTC Network Limiter</em> y configúrela en «Use my proxy server (if any)».</li>
  <li><strong>Do Not Track:</strong> Actívelo en <code>chrome://settings/privacy</code>.</li>
  <li><strong>Borrar al salir:</strong> En <code>chrome://settings/cookies</code> configure borrar cookies y datos del sitio al cerrar todas las ventanas.</li>
</ul>

<h2>2. Refuerzo de privacidad en Firefox</h2>
<p>Firefox ofrece controles de privacidad granulares mediante <code>about:config</code>. Estos ajustes minimizan la huella del navegador y previenen fugas de zona horaria/WebRTC:</p>

<h3>Ajustes críticos en about:config</h3>
<pre><code># Open about:config and set:
privacy.resistFingerprinting = true
webgl.disabled = true
media.peerconnection.enabled = false
geo.enabled = false
intl.accept_languages = en-US, en
general.useragent.locale = en-US</code></pre>

<h3>Pestañas contenedor de Firefox para aislamiento multi-cuenta</h3>
<p>Use Firefox Multi-Account Containers para aislar cuentas de Claude en contextos separados de cookies/almacenamiento sin necesitar perfiles de navegador distintos:</p>
<pre><code>1. Install "Firefox Multi-Account Containers" extension
2. Create a dedicated container per Claude account
3. Right-click Claude.ai → "Open in New Container Tab"
4. Each container maintains isolated cookies, localStorage, IndexedDB</code></pre>

<h2>3. Directivas empresariales de Edge</h2>
<p>Microsoft Edge admite directivas de grupo para control detallado de WebRTC, geolocalización y aceleración por hardware:</p>

<h3>Configuración de directiva de grupo en Windows</h3>
<pre><code># Open gpedit.msc (Windows Pro/Enterprise)
Computer Configuration → Administrative Templates → Microsoft Edge

WebRtcUdpPortRange: Disabled
DefaultGeolocationSetting: Block geolocation
HardwareAccelerationModeEnabled: Disabled (prevents GPU fingerprinting)</code></pre>

<h3>Indicadores de Edge para privacidad</h3>
<pre><code>edge://flags

#edge-enable-webrtc-hide-local-ips-with-mdns → Enabled
#smooth-scrolling → Disabled
#calculate-native-win-occlusion → Disabled</code></pre>

<h2>4. Extensiones de navegador esenciales</h2>
<p>Instale extensiones centradas en privacidad para evitar fugas de huella y gestionar cookies entre sesiones:</p>

<ul>
  <li><strong>User-Agent Switcher:</strong> Rote cadenas User-Agent para coincidir con la región objetivo (EE. UU./Reino Unido/SG).</li>
  <li><strong>Cookie AutoDelete:</strong> Borre cookies automáticamente al cerrar pestañas, excepto dominios en lista blanca.</li>
  <li><strong>uBlock Origin:</strong> Bloquee rastreadores de terceros y scripts de analítica que pueden correlacionar sesiones.</li>
  <li><strong>Decentraleyes:</strong> Sirva bibliotecas JavaScript comunes en local para evitar seguimiento por CDN.</li>
  <li><strong>Clear Browsing Data:</strong> Programe el borrado automático de caché, cookies e historial al reiniciar el navegador.</li>
</ul>

<h3>Mejores prácticas de configuración de extensiones</h3>
<ul>
  <li>En Cookie AutoDelete, incluya en lista blanca solo dominios esenciales (claude.ai, anthropic.com).</li>
  <li>Configure User-Agent Switcher para que coincida con el SO y la versión del navegador alineados con la región de salida del proxy.</li>
  <li>Desactive extensiones que requieran permisos amplios o inyecten scripts en todas las páginas.</li>
</ul>
`;
