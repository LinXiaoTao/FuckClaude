export const content = `
<h2>1. Comparación entre aislamiento físico y por software</h2>
<p>Esta guía es para casos legítimos, como cuentas separadas de trabajo y personal o asientos individuales de equipo. No es una forma de evadir una prohibición ni sortear límites por cuenta, lo cual prohíben los términos de Anthropic. Mantener cuentas separadas de forma limpia implica separar perfiles de navegador, sesiones de red y facturación. Elija el nivel de separación que se ajuste a las necesidades y al presupuesto:</p>

<table>
  <thead>
    <tr>
      <th>Método de aislamiento</th>
      <th>Costo</th>
      <th>Nivel de seguridad</th>
      <th>Mejor para</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Máquinas físicas separadas</strong></td>
      <td>Alto</td>
      <td>Máximo</td>
      <td>Cuentas empresariales de alto valor</td>
    </tr>
    <tr>
      <td><strong>Máquinas virtuales (VMware/VirtualBox)</strong></td>
      <td>Medio</td>
      <td>Alto</td>
      <td>Equipos que gestionan 5-20 cuentas</td>
    </tr>
    <tr>
      <td><strong>Navegadores anti-detección</strong></td>
      <td>Medio</td>
      <td>Medio-alto</td>
      <td>Agencias de marketing, flujos con varias cuentas</td>
    </tr>
    <tr>
      <td><strong>Perfiles de navegador (Chrome/Firefox)</strong></td>
      <td>Bajo</td>
      <td>Medio</td>
      <td>Uso personal, 2-5 cuentas</td>
    </tr>
    <tr>
      <td><strong>Ventanas de incógnito/privadas</strong></td>
      <td>Gratis</td>
      <td>Bajo</td>
      <td>Solo pruebas temporales</td>
    </tr>
  </tbody>
</table>

<h2>2. Aislamiento completo por perfil de navegador</h2>
<p>Para la gestión de varias cuentas a escala media (3-10 cuentas), perfiles de navegador bien configurados ofrecen aislamiento adecuado sin la carga de máquinas virtuales:</p>

<h3>Configuración de perfil de Chrome</h3>
<pre><code># Create isolated Chrome profiles via command line
# macOS/Linux
google-chrome --user-data-dir="/path/to/profile-account1" --proxy-server="socks5://proxy1:1080"

# Windows
chrome.exe --user-data-dir="C:\ChromeProfiles\account1" --proxy-server="socks5://proxy1:1080"

# Each profile maintains separate:
# - Cookies, localStorage, IndexedDB
# - Extensions and settings
# - Autofill data and passwords</code></pre>

<h3>Contenedores multi-cuenta de Firefox</h3>
<pre><code># Firefox containers provide lighter-weight isolation within a single profile
1. Install "Firefox Multi-Account Containers" extension
2. Create a container per Claude account
3. Assign container-specific proxy settings via "FoxyProxy" or "Proxy SwitchyOmega"
4. Open Claude.ai in dedicated container tabs</code></pre>

<h2>3. Separación de IP y pagos entre cuentas</h2>
<p>Aun con aislamiento perfecto del navegador, IP o métodos de pago compartidos pueden vincular cuentas y provocar prohibiciones en cadena:</p>

<h3>Estrategia de aislamiento de IP</h3>
<ul>
  <li><strong>Proxies residenciales dedicados:</strong> Asigne una IP residencial única por cuenta. Nunca rote IP dentro de una misma sesión de cuenta.</li>
  <li><strong>Sesiones sticky:</strong> Configure el proveedor de proxy para mantener la misma IP al menos 24 horas por cuenta y evitar marcas por cambios rápidos de IP.</li>
  <li><strong>Distribución geográfica:</strong> Reparta cuentas entre regiones de EE. UU., Reino Unido y Singapur para reducir el riesgo de correlación.</li>
</ul>

<h3>Separación de tarjetas de pago</h3>
<ul>
  <li><strong>Regla de 2:</strong> Nunca vincule la misma tarjeta virtual a más de 2 cuentas de Claude.</li>
  <li><strong>Convención de nombre del titular:</strong> Use nombres de titular distintos por cuenta para romper aún más la correlación.</li>
  <li><strong>Renovaciones escalonadas:</strong> Desplace las fechas de renovación de suscripción 5-7 días para evitar eventos de pago sincronizados.</li>
</ul>

<h2>4. Procedimiento seguro de cambio de cuenta</h2>
<p>Cambiar entre cuentas en la misma máquina requiere un procedimiento cuidadoso para no filtrar identificadores compartidos:</p>

<h3>Lista de verificación previa al cambio</h3>
<pre><code># 1. Close all browser windows for Account A
# 2. Clear DNS cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns            # Windows
sudo systemd-resolve --flush-caches  # Linux

# 3. Switch proxy to Account B's dedicated IP
# 4. Verify new IP
curl https://ipinfo.io

# 5. Launch Account B's browser profile
google-chrome --user-data-dir="/path/to/profile-accountB"</code></pre>

<h3>Matriz de riesgo al cambiar de cuenta</h3>
<table>
  <thead>
    <tr>
      <th>Escenario</th>
      <th>Riesgo</th>
      <th>Mitigación</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Misma IP, perfiles distintos</td>
      <td>Alto</td>
      <td>Usar siempre IP dedicada por cuenta</td>
    </tr>
    <tr>
      <td>Misma tarjeta, cuentas distintas</td>
      <td>Crítico</td>
      <td>No superar 2 cuentas por tarjeta</td>
    </tr>
    <tr>
      <td>Inicios de sesión secuenciales rápidos</td>
      <td>Medio</td>
      <td>Esperar 5-10 minutos entre cambios de cuenta</td>
    </tr>
    <tr>
      <td>organizationUuid compartido</td>
      <td>Crítico</td>
      <td>Usar máquinas o VM separadas para cuentas de alto valor</td>
    </tr>
  </tbody>
</table>
`;
