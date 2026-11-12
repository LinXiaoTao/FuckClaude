export const content = `
<h2>1. Evaluación de riesgo: IP residencial frente a IP de datacenter</h2>
<p>El tipo de dirección IP impacta directamente las puntuaciones de riesgo de la cuenta Claude. Anthropic asigna mayor peso de riesgo a IP de datacenter asociadas con frecuencia a servicios proxy y tráfico bot:</p>

<h3>Comparación de tipos de IP</h3>
<table>
  <thead>
    <tr>
      <th>Tipo de IP</th>
      <th>Nivel de riesgo</th>
      <th>Características</th>
      <th>Caso de uso</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>IP residencial</strong></td>
      <td>Bajo</td>
      <td>Asignada por ISP a usuarios domésticos, reputación limpia, ASN estable</td>
      <td>Registro de cuenta, suscripción Pro, uso a largo plazo</td>
    </tr>
    <tr>
      <td><strong>IP de operador móvil</strong></td>
      <td>Bajo-medio</td>
      <td>IP de red celular con asignación dinámica, uso móvil legítimo</td>
      <td>Acceso desde app móvil, sesiones temporales</td>
    </tr>
    <tr>
      <td><strong>IP de datacenter</strong></td>
      <td>Alto</td>
      <td>Rangos AWS, Hetzner, DigitalOcean, marcados a menudo por tráfico bot</td>
      <td>Solo pruebas a corto plazo, alto riesgo de bloqueo</td>
    </tr>
    <tr>
      <td><strong>Pool compartido de VPN</strong></td>
      <td>Alto</td>
      <td>Rangos de IP sobreutilizados compartidos por miles, en listas negras de muchos servicios</td>
      <td>Evitar para acceso a Claude</td>
    </tr>
  </tbody>
</table>

<h3>Cómo verificar el tipo de IP</h3>
<pre><code># Check IP reputation and type
curl https://ipinfo.io

# Sample output shows:
# "org": "AS7922 Comcast Cable Communications" → Residential (Good)
# "org": "AS16509 Amazon.com, Inc." → Datacenter (High Risk)</code></pre>

<h2>2. Selección de protocolo proxy</h2>
<p>Distintos protocolos proxy ofrecen distintos niveles de seguridad, velocidad y resistencia a huellas:</p>

<ul>
  <li><strong>Proxy HTTP/HTTPS:</strong> simple y ampliamente compatible, pero los encabezados de proxy transparente pueden filtrar la IP original. Usar solo proxies anónimos «élite» que eliminen encabezados <code>X-Forwarded-For</code>.</li>
  <li><strong>SOCKS5:</strong> más seguro que proxies HTTP, admite UDP para resolución DNS y no modifica encabezados HTTP. Preferido para acceso web general a Claude.</li>
  <li><strong>Shadowsocks / V2Ray:</strong> protocolos cifrados diseñados para evadir inspección profunda de paquetes. Fuga mínima de huella, pero asegurar que el nodo de salida sea IP residencial.</li>
  <li><strong>Wireguard / OpenVPN:</strong> túneles VPN completos con enrutamiento a nivel de sistema. Mejor aislamiento, pero pueden filtrar consultas DNS si no se configuran bien.</li>
</ul>

<h3>Ejemplo de configuración de protocolo (macOS/Linux)</h3>
<pre><code># SOCKS5 proxy via SSH tunnel (requires a remote server)
ssh -D 1080 -N user@your-residential-server.com

# Configure system to use SOCKS5 proxy
export ALL_PROXY=socks5://127.0.0.1:1080

# Test proxy connection
curl --proxy socks5://127.0.0.1:1080 https://ipinfo.io</code></pre>

<h2>3. Criterios de evaluación de proveedores VPN</h2>
<p>Al elegir un servicio VPN para acceso a Claude, priorizar proveedores que ofrezcan IP residenciales dedicadas en lugar de pools compartidos de datacenter:</p>

<ul>
  <li><strong>Tipo de pool de IP:</strong> verificar que el proveedor ofrezca IP residenciales reales de ISP, no rangos de datacenter etiquetados como «residenciales».</li>
  <li><strong>Dedicada frente a compartida:</strong> las IP dedicadas eliminan el riesgo de compartir con usuarios abusivos, pero cuestan mucho más. IP residenciales compartidas son aceptables si el pool es limpio y rota con frecuencia.</li>
  <li><strong>Selección de región de salida:</strong> elegir IP de salida en regiones admitidas por Anthropic (EE. UU., Reino Unido, SG, JP) y asegurar que la dirección de facturación coincida con el país de la IP.</li>
  <li><strong>Política de no registros:</strong> elegir proveedores con políticas de no registros auditadas para minimizar riesgos de cumplimiento y privacidad.</li>
  <li><strong>Protección contra fugas DNS:</strong> asegurar que el cliente VPN incluya protección integrada contra fugas DNS y use servidores DNS remotos (1.1.1.1, 8.8.8.8).</li>
</ul>

<h2>4. Configuración de cadena proxy y prevención de fugas DNS</h2>
<p>En escenarios de alta seguridad, configurar una cadena proxy para enrutar el tráfico por varios saltos y reducir el riesgo de correlación de IP:</p>

<h3>Configuración proxy multi-salto</h3>
<pre><code># Example: Local SOCKS5 → Residential Proxy → Claude
# Configure Clash / Sing-box with proxy chain rules

proxies:
  - name: "residential-us"
    type: socks5
    server: residential-proxy.example.com
    port: 1080
  
proxy-groups:
  - name: "claude-chain"
    type: relay
    proxies:
      - "residential-us"</code></pre>

<h3>Lista de verificación contra fugas DNS</h3>
<ul>
  <li>Configurar DNS del sistema en 1.1.1.1 u 8.8.8.8; no usar DNS de ISP ni DNS públicos chinos.</li>
  <li>Habilitar DNS-over-HTTPS (DoH) o DNS-over-TLS (DoT) en la configuración del navegador.</li>
  <li>Probar fugas DNS en <code>https://dnsleaktest.com</code> con el proxy conectado.</li>
  <li>Deshabilitar WebRTC por completo para evitar fugas de IP local vía servidores STUN.</li>
</ul>
`;
