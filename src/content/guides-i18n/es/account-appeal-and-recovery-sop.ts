export const content = `
<h2>1. Diagnóstico del estado de cuenta y tipo de ban</h2>
<p>Cuando una cuenta tiene problemas de acceso, identifique primero el tipo exacto de ban para elegir la acción de recuperación adecuada:</p>

<ul>
  <li><strong>Bloqueo por región de IP (Access Denied / 403):</strong> "Claude is not available in your region". Solución: la cuenta está bien; actualice el nodo de proxy a una IP residencial en un país admitido (US, UK, SG, JP).</li>
  <li><strong>Suscripción reembolsada o pago rechazado:</strong> Un pago fallido termina el acceso Pro y devuelve la cuenta al plan Free. Anthropic no recibe el motivo del banco por un rechazo y no publica qué tarjetas bloquea. Solución: siga la <a href="/guides/payment-methods-comparison/">lista oficial de rechazos</a> y vuelva a vincular una tarjeta de crédito o débito cuya dirección de facturación coincida con el registro del banco.</li>
  <li><strong>Cuenta deshabilitada de forma permanente (Disabled):</strong> "Your account has been disabled after review". Solución: envíe una apelación formal en inglés por el portal dedicado en <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a>. El formulario solo se abre mientras se inicia sesión en la cuenta deshabilitada. El Help Center de Anthropic enumera tres motivos de ban: violaciones repetidas de la política de uso, creación de cuenta desde una ubicación no admitida y violaciones de los términos de servicio. En la misma pantalla puede exportar datos o eliminar la cuenta; los datos exportables pueden estar restringidos según la infracción, así que exporte antes de eliminar. Anthropic indica que los tiempos de respuesta son actualmente más largos de lo habitual.</li>
  <li><strong>Organización en espera:</strong> La propia cuenta está en regla, pero una organización a la que pertenece fue pausada por actividad inusual. La pantalla de cuenta restringida lista cada organización pausada. Solución: haga clic en "Request a review" en la organización afectada.</li>
  <li><strong>Advertencia de violación de API / falso positivo:</strong> Alertas de API a nivel de organización o sospecha de clasificación errónea. Solución: envíe correo a <a href="mailto:usersafety@anthropic.com">usersafety@anthropic.com</a> con request IDs y contexto de uso.</li>
</ul>

<h2>2. Datos de transparencia del primer semestre de 2026 y expectativas realistas</h2>
<p>El Transparency Hub de Anthropic (última actualización 23 de julio de 2026) informa que solo en el primer semestre de 2026 se deshabilitaron <strong>11.4 millones</strong> de cuentas por violación de políticas, se recibieron <strong>398,000</strong> apelaciones y <strong>42,000</strong> se restablecieron con éxito, una tasa de éxito de apelación aproximada del <strong>10.5%</strong>. Estas cifras cubren todas las cuentas y no predicen el resultado de la suya. Anthropic no publica qué hace que una apelación tenga éxito. Lo que se controla es una apelación factual con contexto verificable; los reportes de la comunidad indican que crear cuentas de reemplazo durante una revisión añade riesgo de asociación.</p>

<h2>3. SOP de apelación en inglés basado en hechos</h2>
<p>Al apelar una cuenta deshabilitada, describa solo hechos que pueda verificar. Una explicación inventada no puede contrastarse con el historial de la cuenta y debilita la apelación. Complete cada marcador de posición con la situación real y elimine cualquier línea que no aplique:</p>

<h3>Plantilla de apelación en inglés (complete con datos reales)</h3>
<pre><code>Subject: Appeal for Disabled Claude Account [Your-Email@domain.com]

Dear Anthropic Safeguards Team,

I am writing to request a review of my account (Email: [Your-Email@domain.com]), which was disabled on [date and time zone].

Notice received: "[exact text of the notice]"
Where I used Claude: [claude.ai / Claude Code / API]
How I use it: [your actual use, e.g. software development for project X, academic research at institution Y]
Network and location: [where you were located and how you connected, including any VPN or proxy, stated accurately]
Payment: [plan, type of payment method, and purchase date]

I have not shared my login, resold access, or used automation to bypass limits. [Delete this sentence if it is not accurate.]

Please review my account and let me know what additional information you need.

Thank you for your time.

Best regards,
[Your Name]</code></pre>
<p>Envíelo por el formulario de apelación con sesión iniciada, conserve el aviso y una copia del envío, y no presente apelaciones duplicadas ni abra cuentas de reemplazo mientras la revisión esté pendiente.</p>

<h2>4. Reembolsos tras un ban</h2>
<p>Si la cuenta se deshabilitó inmediatamente después de pagar Claude Pro o Team:</p>

<ol>
  <li>Envíe primero el correo de apelación anterior.</li>
  <li>Solicite reembolso en el producto con Get help &gt; Claude Refund Request. Para suscripciones compradas en App Store o Google Play, use el flujo de reembolso de esa tienda. Conserve los correos "Your receipt from Anthropic".</li>
  <li>Trate una disputa bancaria como último recurso tras la solicitud de reembolso. Anthropic no ha publicado cómo las disputas afectan una cuenta.</li>
</ol>
`;
