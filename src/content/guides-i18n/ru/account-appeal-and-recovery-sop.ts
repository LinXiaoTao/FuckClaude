export const content = `
<h2>1. Статус аккаунта и диагностика типа бана</h2>
<p>При проблемах с доступом сначала определите точный тип ограничения, чтобы выбрать подходящее восстановление:</p>

<ul>
  <li><strong>IP Region Block (Access Denied / 403):</strong> «Claude is not available in your region». Решение: с аккаунтом всё в порядке; смените proxy node на residential IP в поддерживаемой стране (US, UK, SG, JP).</li>
  <li><strong>Subscription Refunded or Payment Declined:</strong> Неудачный платёж завершает доступ Pro и возвращает аккаунт на план Free. Anthropic не получает от банка причину отклонения и не публикует, какие карты блокирует. Решение: пройдите <a href="/guides/payment-methods-comparison/">official decline checklist</a>, затем привяжите кредитную или дебетовую карту с billing address, совпадающим с записью банка.</li>
  <li><strong>Account Permanently Disabled (Disabled):</strong> «Your account has been disabled after review». Решение: отправьте формальную апелляцию на английском через портал <a href="https://claude.ai/restricted" target="_blank" rel="noopener noreferrer">claude.ai/restricted</a>. Форма открывается только при входе в отключённый аккаунт. Help Center Anthropic перечисляет три причины бана: повторные нарушения Usage Policy, создание аккаунта из неподдерживаемого региона и нарушения Terms of Service. На том же экране можно экспортировать данные или удалить аккаунт; объём экспорта может быть ограничен в зависимости от нарушения — экспортируйте до удаления. Anthropic отмечает, что сроки ответа сейчас длиннее обычного.</li>
  <li><strong>Organization On Hold:</strong> Ваш аккаунт в порядке, но организация, к которой вы относитесь, приостановлена из-за необычной активности. Экран restricted-account перечисляет каждую приостановленную организацию. Решение: нажмите «Request a review» у затронутой организации.</li>
  <li><strong>API Violation Warning / False Positive:</strong> Предупреждения API на уровне организации или подозрение на misclassification. Решение: напишите на <a href="mailto:usersafety@anthropic.com">usersafety@anthropic.com</a> с request ID и контекстом использования.</li>
</ul>

<h2>2. Данные Transparency за H1 2026 и реалистичные ожидания</h2>
<p>Transparency Hub Anthropic (последнее обновление 23 июля 2026) сообщает: только за первую половину 2026 года отключено <strong>11,4 million</strong> аккаунтов с нарушениями политики, получено <strong>398,000</strong> апелляций, успешно восстановлено <strong>42,000</strong> — примерно <strong>10.5% appeal success rate</strong>. Эти цифры охватывают все аккаунты и не предсказывают исход вашего случая. Anthropic не публикует критерии успешной апелляции. Под вашим контролем — фактическая апелляция с проверяемым контекстом; по сообщениям community, создание replacement-аккаунтов во время review повышает association risk.</p>

<h2>3. SOP апелляции на английском на основе фактов</h2>
<p>При апелляции отключённого аккаунта описывайте только факты, которые можете проверить. Выдуманное объяснение нельзя сверить с историей аккаунта и оно ослабляет апелляцию. Заполните каждый placeholder реальной ситуацией и удалите строки, которые не применимы:</p>

<h3>Шаблон апелляции на английском (укажите реальные данные)</h3>
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
<p>Отправьте через форму апелляции, будучи залогиненными; сохраните уведомление и копию отправки; не подавайте дубликаты и не открывайте replacement-аккаунты, пока review в процессе.</p>

<h2>4. Возвраты после бана</h2>
<p>Если аккаунт отключили сразу после оплаты Claude Pro или Team:</p>

<ol>
  <li>Сначала отправьте апелляцию по шаблону выше.</li>
  <li>Запросите refund в продукте: Get help &gt; Claude Refund Request. Для подписок через App Store или Google Play используйте refund flow магазина. Сохраните письма «Your receipt from Anthropic».</li>
  <li>Банковский dispute — крайняя мера после запроса refund. Anthropic не публиковала, как dispute влияет на аккаунт.</li>
</ol>
`;
