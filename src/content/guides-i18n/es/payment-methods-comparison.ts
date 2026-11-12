export const content = `
<p>Esta guía cubre qué acepta la facturación de Claude, qué dice la lista de rechazos de Anthropic y de dónde viene el riesgo de tarjeta. Versiones anteriores listaban «tasas de éxito» y «BIN de alto éxito». Esas cifras no tenían fuente y se eliminaron: Anthropic no publica qué tarjetas o BIN bloquea.</p>

<h2>1. Qué acepta Claude</h2>
<ul>
  <li><strong>Pro y Max en la web:</strong> solo tarjetas de crédito o débito. No se aceptan PayPal, Venmo ni otros procesadores de pago de terceros.</li>
  <li><strong>Plan Team:</strong> tarjetas de crédito, débito o prepago. No se aceptan transferencias bancarias ACH.</li>
  <li><strong>App Store y Google Play:</strong> si se suscribe en la app iOS o Android, la tienda gestiona pago, facturas y cancelación, y Apple o Google decide qué métodos de pago están disponibles.</li>
  <li><strong>Impuestos:</strong> se calculan a partir de la dirección de facturación, tomada de la dirección del método de pago.</li>
</ul>

<h2>2. Tipo de tarjeta y riesgo</h2>
<p>El artículo de rechazos de Anthropic indica que no recibe el motivo del banco emisor por un rechazo, y ninguna página oficial lista tipos de tarjeta o BIN bloqueados. Trate cualquier lista BIN o tabla de tasa de éxito de otros sitios como no verificada.</p>
<ul>
  <li><strong>Lo que respaldan las páginas oficiales:</strong> Pro y Max listan tarjetas de crédito y débito. Las prepago solo se listan para el plan Team, así que una prepago en Pro o Max puede rechazarse solo por ese motivo.</li>
  <li><strong>Lo que sugieren reportes de campo:</strong> algunos reportes describen un baneo tras pagar con tarjeta virtual, y una cuenta estable pagando con crédito de banco de EE. UU. Son casos individuales, no una regla. Véase los <a href="/news/#community-posts">reportes de campo de la comunidad</a>.</li>
  <li><strong>Tarjetas vendidas por terceros:</strong> no se puede saber quién más usa la tarjeta, si el emisor la congelará o si el saldo cubrirá la siguiente renovación. No hay recurso si la tarjeta se rechaza o revierte.</li>
  <li><strong>Tarjetas financiadas con cripto:</strong> suelen ser prepago, así que aplica la limitación de Pro y Max anterior.</li>
</ul>

<h2>3. Por qué falla un pago</h2>
<p>La lista de Anthropic, en el orden que la presenta:</p>
<ol>
  <li><strong>Ubicación de facturación:</strong> la dirección de facturación y el país de origen de la tarjeta deben ser una ubicación de facturación elegible, y la dirección debe coincidir con el país de origen.</li>
  <li><strong>Dirección de facturación:</strong> debe coincidir con la dirección que el banco tiene registrada. Falta un acento o un error en el nombre de la calle puede causar rechazo.</li>
  <li><strong>3D Secure:</strong> completar la contraseña de un solo uso o la confirmación en la app bancaria cuando el banco lo solicite.</li>
  <li><strong>Método aceptado:</strong> usar tarjeta de crédito o débito, no PayPal ni Venmo.</li>
  <li><strong>Fondos:</strong> el saldo debe cubrir el monto total.</li>
  <li><strong>Reintento:</strong> probar otra tarjeta o la misma más tarde, porque problemas de red temporales también causan rechazos.</li>
  <li><strong>Consultar al banco:</strong> solo el emisor puede decir por qué rechazó el cargo.</li>
</ol>

<h2>4. Suscribirse por App Store o Google Play</h2>
<p>Las suscripciones por tienda usan los métodos de pago y la facturación de la tienda, y Anthropic no emite la factura. Para compras en App Store, Apple gestiona reembolsos; para Google Play, contacte a Claude Support. Algunos reportes de campo recomiendan esta vía como respaldo de reembolso. Anthropic no documenta si cambia el riesgo de la cuenta.</p>

<h2>5. Renovaciones, reembolsos y contracargos</h2>
<ul>
  <li><strong>Renovación fallida:</strong> si falla el método de pago, la cuenta puede degradarse al plan Free. Revise Settings &gt; Billing para el estado del pago y actualice la tarjeta allí.</li>
  <li><strong>Reembolsos:</strong> los pagos en general no son reembolsables salvo que los Consumer Terms o la ley local indiquen lo contrario. Fuera de Europa, solicite reembolso en la app en Get help &gt; Claude Refund Request.</li>
  <li><strong>Contracargos:</strong> Anthropic no ha publicado cómo una disputa bancaria afecta una cuenta. Use primero la solicitud de reembolso y conserve los correos de recibo («Your receipt from Anthropic») por si los necesita después.</li>
</ul>

<h2>6. Lista de verificación antes de suscribirse</h2>
<pre><code>1. A credit or debit card issued by a bank, held in your own name
2. The billing country is an eligible billing location (check the Help Center)
3. The billing address matches your bank's record character for character
4. The card supports 3D Secure and you can receive the code
5. The balance covers the first charge and the next renewal
6. The card is not shared with other Claude accounts
7. Keep the receipt emails</code></pre>
`;
