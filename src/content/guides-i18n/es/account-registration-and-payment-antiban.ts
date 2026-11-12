export const content = `
<h2>1. Verificación telefónica y elección del proveedor</h2>
<p>Anthropic exige verificación telefónica en el registro inicial y de nuevo cuando los patrones de inicio de sesión parecen inusuales: rangos de IP nuevos, dispositivos desconocidos o cambios geográficos rápidos. El objetivo no es «engañar» al sistema, sino presentar una identidad coherente y verificable que coincida con la región declarada de la cuenta. Los números VoIP virtuales (Google Voice, TextNow, Skype y la mayoría de los sitios de recepción de SMS) están ampliamente bloqueados porque son baratos, reutilizables y muy abusados.</p>

<p>Defina la región de la cuenta (US, UK, SG, JP) antes de registrarse. El número de teléfono debería poder atribuirse de forma plausible a esa región durante toda la vida de la cuenta. Las tasas de aprobación y los niveles de riesgo en las tablas siguientes son observaciones de la comunidad, no datos de Anthropic.</p>

<h3>SIM física frente a números de pool compartido</h3>
<table>
  <thead>
    <tr>
      <th>Método de verificación</th>
      <th>Tasa de aprobación típica</th>
      <th>Riesgo de asociación</th>
      <th>Mejor para</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SIM física personal (US/UK/SG/JP)</td>
      <td>Más alta</td>
      <td>Bajo si se usa para una sola cuenta</td>
      <td>Suscripciones Pro / Team a largo plazo</td>
    </tr>
    <tr>
      <td>Alquiler de SMS de pago por única vez (número dedicado)</td>
      <td>Media-alta</td>
      <td>Medio si el número se recicló</td>
      <td>Una cuenta, registro inmediato</td>
    </tr>
    <tr>
      <td>Pool público de SMS compartido</td>
      <td>Baja</td>
      <td>Muy alto</td>
      <td>Evitar para Claude</td>
    </tr>
    <tr>
      <td>VoIP / Google Voice</td>
      <td>Casi nula</td>
      <td>Alto</td>
      <td>No usar</td>
    </tr>
  </tbody>
</table>

<ul>
  <li><strong>Usar SIM de operador real cuando sea posible:</strong> Un número emitido por AT&T, T-Mobile, EE, Singtel o NTT SoftBank se lee como identidad regional legítima. Los servicios de alquiler temporal pueden funcionar si el número está fresco y no figura en sitios públicos de «SMS gratis».</li>
  <li><strong>Evitar números de pool público compartido:</strong> Los números que han registrado decenas de cuentas de Claude o ChatGPT suelen marcarse. Reutilizarlos puede vincular la cuenta nueva con entidades previamente baneadas.</li>
  <li><strong>Activar 2FA TOTP justo después del registro:</strong> Vincular Google Authenticator, 1Password o Authy antes del primer cambio de IP o dispositivo. Esto reduce solicitudes repetidas de SMS y disminuye el riesgo de perder acceso al viajar o rotar proxy.</li>
  <li><strong>Mantener el número activo:</strong> Si la SIM vence o termina el alquiler, los flujos de recuperación pueden fallar. Guarde los códigos de respaldo en un gestor de contraseñas.</li>
</ul>

<h2>2. Tipo de tarjeta, riesgo BIN y alineación de dirección de facturación</h2>
<p>Un pago rechazado o una suscripción reembolsada pueden tener varias causas, y Anthropic no recibe el motivo del banco. Las discrepancias de dirección de facturación y los tipos de tarjeta no admitidos son causas que Anthropic enumera. Alinee el perfil de pago con la región de la cuenta para eliminar las evitables.</p>

<p>Para lo que Claude acepta y la lista oficial de rechazos de Anthropic, consulte <a href="/guides/payment-methods-comparison/">Métodos de pago de Claude, riesgo de tarjeta y solución de rechazos</a>. Para contexto de registro por región, lea la <a href="/guides/regional-access-strategy/">guía de estrategias de acceso regional</a>.</p>

<h3>Resumen de tipo de tarjeta y riesgo BIN</h3>
<p>Los niveles de riesgo siguientes son observaciones de la comunidad, no datos de Anthropic. Anthropic no publica qué tipos de tarjeta o BIN bloquea.</p>
<table>
  <thead>
    <tr>
      <th>Categoría de tarjeta</th>
      <th>Puntuación de riesgo típica</th>
      <th>Notas al vincular en Claude</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Crédito emitida por banco de EE. UU. (Visa/MC)</td>
      <td>Baja</td>
      <td>Mejor para la primera suscripción Pro; renovaciones estables</td>
    </tr>
    <tr>
      <td>Débito fintech de EE. UU. (emisores tipo Chime)</td>
      <td>Baja-media</td>
      <td>Las tarjetas de débito están listadas como aceptadas para Pro y Max; mantener saldo suficiente para renovaciones</td>
    </tr>
    <tr>
      <td>Débito internacional de país admitido</td>
      <td>Media</td>
      <td>El país de facturación debe coincidir con la región de la cuenta</td>
    </tr>
    <tr>
      <td>Prepago de mercado masivo / prepago financiado con cripto</td>
      <td>Alta</td>
      <td>Las tarjetas prepago no están listadas para Pro o Max; rechazos y reembolsos instantáneos se reportan con frecuencia</td>
    </tr>
  </tbody>
</table>

<ul>
  <li><strong>Preferir tarjetas de bancos consolidados:</strong> Anthropic no publica qué BIN bloquea, así que las listas BIN en línea no están verificadas y caducan cuando los emisores cambian niveles de riesgo. Elija una tarjeta de crédito o débito de un banco que permita definir la dirección de facturación con exactitud.</li>
  <li><strong>Dirección de facturación:</strong> La lista de Anthropic exige que la dirección de facturación coincida con el registro del banco y con el país de origen de la tarjeta. Los reportes de la comunidad también indican que mantener coherentes el país de IP, el de facturación y el del teléfono reduce fricción. Es una observación, no una regla documentada.</li>
  <li><strong>Saldo suficiente:</strong> Asegúrese de que la tarjeta cubra el primer cargo y la siguiente renovación. Una renovación fallida puede degradar la cuenta al plan Free.</li>
  <li><strong>Una tarjeta, una identidad principal:</strong> No rotar tarjetas cada semana en la misma cuenta. Los instrumentos de pago estables generan confianza; cambios caóticos parecen toma de cuenta.</li>
</ul>

<h3>Lista de verificación del día de registro</h3>
<ol>
  <li>Perfil de navegador limpio alineado con la región objetivo (véase la <a href="/guides/environment-cleanup-and-ip-setup/">guía de limpieza del entorno</a>).</li>
  <li>IP residencial del mismo país que la dirección de facturación (véase <a href="/guides/vpn-and-proxy-selection/">Selección de VPN y proxy</a>).</li>
  <li>Número de teléfono nuevo o dedicado, no de un pool público de SMS.</li>
  <li>Tarjeta de crédito o débito cuya dirección de facturación coincida con el registro del banco.</li>
  <li>Activar 2FA y descargar códigos de respaldo antes de cerrar la sesión.</li>
</ol>

<h2>3. Evitar asociación de cuentas y baneos en cadena</h2>
<p>Anthropic vincula cuentas mediante instrumentos de pago compartidos, números de teléfono, huellas de dispositivo e identificadores organizacionales usados por Claude Code. Entender estos vectores de enlace ayuda a evitar suspensiones por lotes accidentales al gestionar varios asientos para un equipo o estudio.</p>

<p>La <a href="/guides/claude-steganography-and-risk-model/">guía de esteganografía y modelo de riesgo de Claude</a> explica cómo IP, zona horaria, BIN y patrones de uso se combinan en puntuaciones de riesgo. Para separación operativa, siga las <a href="/guides/multi-account-management/">mejores prácticas de gestión multi-cuenta</a>.</p>

<pre><code># Check local Claude Code organization UUID grouping
python3 -c "import json; d=json.load(open('.claude.json')); print(d.get('oauthAccount',{}).get('organizationUuid'))"</code></pre>

<ul>
  <li><strong>Limitar la reutilización de tarjetas:</strong> Nunca vincular la misma tarjeta de crédito a más de dos cuentas Claude Pro o Team salvo que Anthropic lo permita explícitamente en el contrato. Las tarjetas compartidas son la vía más rápida a baneos en cadena.</li>
  <li><strong>Un teléfono por cuenta comercial:</strong> Reutilizar números de verificación entre cuentas crea un enlace duro aunque pago e IP difieran.</li>
  <li><strong>Aislar entornos de máquina:</strong> Evitar ejecutar sesiones pesadas en paralelo bajo el mismo <code>organizationUuid</code> en distintas máquinas sin entender el agrupamiento de cuota. Perfiles de navegador e IP separados por cuenta (véase la <a href="/guides/browser-configuration-guide/">guía de configuración del navegador</a>).</li>
  <li><strong>No «calentar» identidades baneadas:</strong> Registrar una cuenta nueva inmediatamente tras una suspensión con la misma tarjeta, teléfono y dispositivo suele fallar en horas.</li>
</ul>

<h3>Qué NO hacer</h3>
<ul>
  <li>No abrir una disputa bancaria antes de usar la solicitud de reembolso de Anthropic. Anthropic no ha publicado cómo las disputas afectan una cuenta, y puede perder acceso al pago.</li>
  <li>No comprar cuentas Claude «prefabricadas» en mercados; arrastran baneos heredados y vínculos de pago robados.</li>
  <li>No registrarse desde una IP de datacenter y vincular una tarjeta de EE. UU. con país de facturación incompatible en la misma sesión.</li>
  <li>No desactivar 2FA para «simplificar» inicios de sesión; aumenta los disparadores de re-verificación por SMS en IPs nuevas.</li>
</ul>

<h2>Preguntas frecuentes</h2>

<h3>¿Por qué la suscripción mostró «Refunded» justo después del pago?</h3>
<p>Anthropic no recibe el motivo del banco por un rechazo, así que la causa no siempre se conoce. Candidatos habituales son discrepancia de dirección de facturación, tipo de tarjeta no aceptado o fallo en 3D Secure. Siga la <a href="/guides/payment-methods-comparison/">lista oficial de rechazos</a> y reintente una vez en lugar de repetir en la misma cuenta.</p>

<h3>¿Puedo usar el mismo número de Google Voice que en otros servicios?</h3>
<p>No. Los números VoIP se bloquean en la verificación en la mayoría de los casos. Use un número móvil del operador o un alquiler dedicado que no esté indexado públicamente.</p>

<h3>¿Cuántas cuentas Claude pueden compartir una IP de oficina?</h3>
<p>No hay límite publicado, pero muchos inicios de sesión simultáneos desde una IP residencial con tarjetas distintas pueden igualmente disparar revisiones. Prefiera una cuenta por perfil de navegador aislado y escalonar uso intensivo. Véase <a href="/guides/multi-account-management/">gestión multi-cuenta</a> para configuraciones de estudio.</p>

<h3>¿Debo registrarme antes o después de configurar el proxy?</h3>
<p>Después. Complete primero la alineación de entorno e IP (<a href="/guides/device-setup-guide/">guía de configuración del dispositivo</a>), luego regístrese, verifique el teléfono, vincule el pago y active 2FA en una sola sesión coherente sin cambiar de región a mitad del flujo.</p>

<h3>Mi tarjeta funciona en otros sitios SaaS pero falla en Claude: ¿por qué?</h3>
<p>Revise primero la lista de Anthropic: ubicación de facturación elegible, coincidencia exacta de dirección de facturación, 3D Secure completado y tipo de tarjeta crédito o débito. Una tarjeta prepago puede rechazarse en Pro y Max porque solo se listan crédito y débito. Véase la <a href="/guides/payment-methods-comparison/">guía de métodos de pago</a>.</p>
`;
