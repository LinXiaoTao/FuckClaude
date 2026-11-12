export const content = `
<h2>1. Diagnóstico de fallos de inicio de sesión (403/429/500)</h2>
<p>Los fallos de inicio de sesión suelen mapearse a causas raíz concretas según códigos de estado HTTP y mensajes de error:</p>

<h3>Matriz de códigos de error</h3>
<table>
  <thead>
    <tr>
      <th>Código de estado</th>
      <th>Mensaje de error</th>
      <th>Causa raíz</th>
      <th>Resolución</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>403 Forbidden</strong></td>
      <td>"Access denied"</td>
      <td>IP bloqueada o IP de datacenter de alto riesgo</td>
      <td>Cambiar a proxy residencial, borrar cookies, reintentar tras 1 hora</td>
    </tr>
    <tr>
      <td><strong>429 Too Many Requests</strong></td>
      <td>"Rate limit exceeded"</td>
      <td>Se superaron intentos de inicio de sesión o límite de tasa de API</td>
      <td>Espere 15 minutos, implemente retroceso exponencial</td>
    </tr>
    <tr>
      <td><strong>500 Internal Server Error</strong></td>
      <td>"Something went wrong"</td>
      <td>Problema en el backend de Anthropic o estado de sesión inválido</td>
      <td>Borre todas las cookies de claude.ai, reinicie el navegador, reintente</td>
    </tr>
    <tr>
      <td><strong>Account Disabled</strong></td>
      <td>"Your account has been disabled"</td>
      <td>Violación de ToS o problema de pago</td>
      <td>Revise el correo por el motivo del ban, siga el SOP de apelación</td>
    </tr>
  </tbody>
</table>

<h3>Procedimiento de diagnóstico</h3>
<pre><code># 1. Check current IP reputation
curl https://ipinfo.io
# Verify "org" does not show datacenter ASN (AWS, Hetzner, etc.)

# 2. Test DNS resolution
nslookup claude.ai
# Should resolve to Cloudflare IPs (104.18.x.x range)

# 3. Clear browser state completely
# Chrome: Settings → Privacy → Clear browsing data → All time → Cookies, Cache
# Firefox: Settings → Privacy → Clear Data → Everything

# 4. Test login with clean profile
google-chrome --user-data-dir="/tmp/test-profile" --proxy-server="socks5://proxy:1080"</code></pre>

<h2>2. Resolución de excepciones en llamadas API</h2>
<p>Los fallos de API requieren un diagnóstico sistemático de red, autenticación y limitación de tasa:</p>

<h3>Errores de API frecuentes</h3>
<ul>
  <li><strong>401 Unauthorized:</strong> API key inválida o revocada. Verifique la clave en Anthropic Console; regenérela si hace falta.</li>
  <li><strong>429 Rate Limit:</strong> La organización superó la cuota RPM (solicitudes por minuto) o TPM (tokens por minuto). Implemente limitación de tasa en el cliente.</li>
  <li><strong>529 Overloaded:</strong> El backend de Anthropic está al límite de capacidad. Reintente con retroceso exponencial (2^n segundos con jitter).</li>
  <li><strong>Timeout:</strong> La solicitud superó el tiempo de espera de 60 segundos. Divida prompts grandes en fragmentos o reduzca max_tokens.</li>
</ul>

<h3>Script de depuración de API</h3>
<pre><code>#!/usr/bin/env node
const Anthropic = require('@anthropic-ai/sdk');

async function diagnoseAPI() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    console.log('Testing API connectivity...');
    const response = await client.messages.create({
      model: 'claude-sonnet-4.5-high',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('✓ API key valid, connection successful');
    console.log('Response:', response.content[0].text);
  } catch (error) {
    console.error('✗ API Error:', error.status, error.message);
    if (error.status === 401) console.log('→ Check API key validity');
    if (error.status === 429) console.log('→ Rate limit exceeded, wait 60s');
    if (error.status === 529) console.log('→ Backend overloaded, retry with backoff');
  }
}

diagnoseAPI();</code></pre>

<h2>3. Causa raíz del fallo al vincular pago</h2>
<p>Anthropic no recibe el motivo del banco por un rechazo, así que recorra las causas probables en orden. La <a href="/guides/payment-methods-comparison/">guía de métodos de pago</a> tiene la lista oficial completa:</p>

<ul>
  <li><strong>Card Declined:</strong> Saldo insuficiente, CVV inválido o tarjeta vencida. Asegúrese de que el saldo cubra el monto completo.</li>
  <li><strong>Card Type Not Accepted:</strong> Pro y Max solo listan tarjetas de crédito y débito; una tarjeta prepago puede rechazarse solo por eso. Anthropic no publica BIN bloqueados.</li>
  <li><strong>Address Mismatch:</strong> La dirección de facturación debe coincidir con el registro del banco y el país de origen de la tarjeta, y ser una ubicación de facturación elegible.</li>
  <li><strong>3D Secure Not Completed:</strong> Confirme el código SMS o el aviso de la app del banco cuando el banco lo solicite.</li>
  <li><strong>Repeated Attempts:</strong> Reintente una vez y luego consulte al banco. Solo el emisor puede explicar un rechazo.</li>
</ul>

<h2>4. FAQ de problemas frecuentes y correcciones rápidas</h2>

<h3>P: "Claude dice que mi sesión expiró, pero acabo de iniciar sesión"</h3>
<p><strong>R:</strong> Las cookies de sesión están ligadas a la IP y huellas del dispositivo. Cambios rápidos de IP invalidan la sesión. Solución: active 2FA para reducir solicitudes de re-verificación; mantenga una IP consistente por sesión.</p>

<h3>P: "La API devuelve respuestas en caché a prompts nuevos"</h3>
<p><strong>R:</strong> Prompt Cache coincide con contenido no previsto. Solución: añada un identificador único o marca de tiempo al prompt para forzar cache miss: <code>{prompt} [request_id: {Date.now()}]</code>.</p>

<h3>P: "WebRTC muestra mi IP real aunque uso proxy"</h3>
<p><strong>R:</strong> WebRTC evita el proxy en conexiones peer. Solución: desactive WebRTC por completo en la configuración del navegador o use la extensión WebRTC Control para bloquear solicitudes STUN.</p>

<h3>P: "La cuenta de repente exige verificación por teléfono"</h3>
<p><strong>R:</strong> Se activa por cambio de IP, inicio de sesión en dispositivo nuevo o actividad sospechosa. Solución: use un servicio de verificación con SIM física real; vincule 2FA inmediatamente después de verificar para evitar nuevas solicitudes.</p>
`;
