export const content = `
<h2>1. Regiones admitidas y restringidas por Anthropic</h2>
<p>Anthropic restringe explícitamente el acceso a Claude desde ciertas regiones. Comprenda la clasificación para elegir estrategias de registro y uso conformes:</p>

<h3>Clasificación por región</h3>
<table>
  <thead>
    <tr>
      <th>Categoría</th>
      <th>Regiones</th>
      <th>Estado de acceso</th>
      <th>Estrategia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Totalmente admitidas</strong></td>
      <td>Por ejemplo EE. UU., Reino Unido, Canadá, Australia, Nueva Zelanda, Singapur, Japón, Taiwán, India, Brasil. Consulte la <a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">lista completa de regiones admitidas</a></td>
      <td>En la lista de regiones admitidas (API y Claude.ai)</td>
      <td>Registrarse directamente con IP local</td>
    </tr>
    <tr>
      <td><strong>UE/EEE</strong></td>
      <td>Alemania, Francia, Países Bajos, etc.</td>
      <td>Admitidas con cumplimiento del GDPR</td>
      <td>Usar IP de la UE y consentir el tratamiento de datos</td>
    </tr>
    <tr>
      <td><strong>Restringidas</strong></td>
      <td>China (continental), Hong Kong, Macao, Rusia, Irán, Corea del Norte, Cuba</td>
      <td>Fuera de la lista de regiones admitidas; crear una cuenta desde una ubicación no admitida es un motivo de ban listado</td>
      <td>Usar IP residencial de región admitida y alinear facturación y teléfono. Una IP de salida en región admitida no hace elegible la cuenta; usuarios de Hong Kong reportaron suspensiones desde el 1 de octubre de 2026</td>
    </tr>
  </tbody>
</table>

<h3>Métodos de detección de región</h3>
<p>Anthropic no documenta cómo determina la región. Estas son señales que la comunidad discute con frecuencia en reportes, no reglas confirmadas:</p>
<ul>
  <li><strong>Geolocalización por IP:</strong> se asume ampliamente como señal principal</li>
  <li><strong>País de la tarjeta de pago:</strong> la dirección de facturación debe coincidir con el país de emisión de la tarjeta (requisito oficial)</li>
  <li><strong>Código de país del teléfono:</strong> el número de verificación por SMS sugiere una ubicación probable</li>
  <li><strong>Dirección de facturación:</strong> debe ser una ubicación de facturación elegible (requisito oficial)</li>
</ul>

<h2>2. Mejores prácticas de registro en EE. UU., Reino Unido y Singapur</h2>
<p>Tres regiones admitidas de uso frecuente. Mantenga coherentes IP, zona horaria, teléfono y datos de facturación con la región elegida:</p>

<h3>Registro en Estados Unidos</h3>
<pre><code># Optimal Configuration for US Registration
Proxy IP: US residential (Comcast, AT&T, Verizon ASNs)
Timezone: America/New_York or America/Los_Angeles
Phone: Real US carrier SIM (+1 area codes: 212, 310, 415, etc.)
Card: US-issued credit or debit card with US billing address
Billing Address: Real US residential address matching IP state

# Verification Script
curl https://ipinfo.io | jq '{ip, city, region, country, org}'
# Ensure country="US", org shows ISP not datacenter</code></pre>

<h3>Registro en Reino Unido</h3>
<pre><code># UK-Specific Configuration
Proxy IP: UK residential (BT, Virgin Media, Sky ASNs)
Timezone: Europe/London
Phone: Real UK carrier SIM (+44)
Card: UK or EU-issued credit or debit card
Billing Address: Real UK address with valid postcode

# UK Address Validation
# Use Royal Mail Postcode Finder to verify address legitimacy</code></pre>

<h3>Registro en Singapur</h3>
<pre><code># Singapore Configuration
Proxy IP: Singapore residential (Singtel, StarHub, M1 ASNs)
Timezone: Asia/Singapore
Phone: Singapore carrier SIM (+65)
Card: Singapore or international card accepted in SG
Billing Address: Real Singapore address with postal code

# Note: Singapore is on the Supported Regions list</code></pre>

<h2>3. Cumplimiento del GDPR en la UE y soberanía de datos</h2>
<p>Los usuarios de la UE enfrentan requisitos adicionales de consentimiento bajo el GDPR. Anthropic debe cumplir las normas de tratamiento de datos:</p>

<h3>Lista de verificación de consentimiento GDPR</h3>
<ul>
  <li>Aceptar la política de privacidad de Anthropic conforme al GDPR durante el registro</li>
  <li>Verificar la ubicación del tratamiento de datos (Anthropic usa AWS en EE. UU., con salvaguardas de transferencia de datos de la UE)</li>
  <li>Solicitar exportación de datos vía Anthropic Console si hace falta (artículo 20 del GDPR)</li>
  <li>Ejercer el derecho de supresión contactando a soporte (artículo 17 del GDPR)</li>
</ul>

<h3>Factores de riesgo específicos de la UE</h3>
<ul>
  <li>Algunos bancos de la UE rechazan suscripciones con base en EE. UU.; use tarjetas virtuales de proveedores internacionales</li>
  <li>La autenticación reforzada del cliente (SCA) puede exigir 3D Secure; confirme que la tarjeta lo admite</li>
  <li>El IVA se aplica automáticamente según el país de la dirección de facturación</li>
</ul>

<h2>4. Guía de cumplimiento para viajes de negocios transfronterizos</h2>
<p>Existen usos legítimos de Claude durante viajes. Estructure la configuración para resistir escrutinio:</p>

<h3>Configuración de escenario de viaje conforme</h3>
<pre><code># Before international travel:
1. Enable 2FA on Claude account (Google Authenticator)
2. Notify payment card issuer of travel dates
3. Bring documentation proving business travel (conference tickets, etc.)
4. Use hotel/office WiFi rather than public hotspots
5. If using VPN, choose exit IP in your account's home region

# During travel access:
# Document business purpose in case of appeal:
# - Conference attendance
# - Client meetings
# - Remote work for US/UK employer</code></pre>

<h3>Plantilla de apelación por bloqueos relacionados con viajes</h3>
<pre><code>Subject: Account Access Issue During Business Travel

Dear Anthropic Support,

I am a Claude Pro subscriber (email: your@email.com) and my account 
was restricted while I was traveling for business to [Country].

I am a [Your Country] resident and citizen, and registered my account 
while physically located in [Home Country]. I am currently traveling 
for work and need continued access to Claude for my professional duties.

Attached is documentation of my business travel: [conference ticket, 
work visa, employer letter, etc.]

I maintain 2FA on my account and am accessing from secure networks. 
Please restore access to my account.

Thank you,
[Your Name]</code></pre>
`;
