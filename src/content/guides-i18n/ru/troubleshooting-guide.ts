export const content = `
<h2>1. Диагностика сбоев входа (403/429/500)</h2>
<p>Сбои входа обычно сопоставляются с конкретными причинами по HTTP-кодам и текстам ошибок:</p>

<h3>Матрица кодов ошибок</h3>
<table>
  <thead>
    <tr>
      <th>Код статуса</th>
      <th>Сообщение об ошибке</th>
      <th>Корневая причина</th>
      <th>Решение</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>403 Forbidden</strong></td>
      <td>"Access denied"</td>
      <td>IP заблокирован или высокорисковый datacenter IP</td>
      <td>Переключитесь на residential proxy, очистите cookies, повторите через 1 час</td>
    </tr>
    <tr>
      <td><strong>429 Too Many Requests</strong></td>
      <td>"Rate limit exceeded"</td>
      <td>Превышены попытки входа или лимит API</td>
      <td>Подождите 15 минут, примените exponential backoff</td>
    </tr>
    <tr>
      <td><strong>500 Internal Server Error</strong></td>
      <td>"Something went wrong"</td>
      <td>Проблема backend Anthropic или невалидное состояние сессии</td>
      <td>Очистите все cookies claude.ai, перезапустите браузер, повторите</td>
    </tr>
    <tr>
      <td><strong>Account Disabled</strong></td>
      <td>"Your account has been disabled"</td>
      <td>Нарушение ToS или проблема с оплатой</td>
      <td>Проверьте почту на причину бана, следуйте SOP апелляции</td>
    </tr>
  </tbody>
</table>

<h3>Процедура диагностики</h3>
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

<h2>2. Устранение исключений при вызовах API</h2>
<p>Сбои API требуют системной диагностики сети, аутентификации и rate limiting:</p>

<h3>Типичные ошибки API</h3>
<ul>
  <li><strong>401 Unauthorized:</strong> Невалидный API key или ключ отозван. Проверьте ключ в Anthropic Console, при необходимости перегенерируйте.</li>
  <li><strong>429 Rate Limit:</strong> Организация превысила квоту RPM (requests per minute) или TPM (tokens per minute). Внедрите client-side rate limiting.</li>
  <li><strong>529 Overloaded:</strong> Backend Anthropic на пределе ёмкости. Повторяйте с exponential backoff (2^n секунд с jitter).</li>
  <li><strong>Timeout:</strong> Запрос превысил 60-секундный timeout. Разбейте большие prompts на части или уменьшите max_tokens.</li>
</ul>

<h3>Скрипт отладки API</h3>
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

<h2>3. Причины сбоя привязки оплаты</h2>
<p>Anthropic не получает от банка причину отклонения платежа, поэтому проходите вероятные причины по порядку. Полный официальный чеклист — в <a href="/guides/payment-methods-comparison/">payment methods guide</a>:</p>

<ul>
  <li><strong>Card Declined:</strong> Недостаточный баланс, неверный CVV или просроченная карта. Убедитесь, что баланса хватает на полную сумму.</li>
  <li><strong>Card Type Not Accepted:</strong> Pro и Max принимают только кредитные и дебетовые карты, prepaid может быть отклонена только из-за типа. Anthropic не публикует заблокированные BIN.</li>
  <li><strong>Address Mismatch:</strong> Billing address должен совпадать с записью банка и страной выпуска карты и быть в допустимой billing location.</li>
  <li><strong>3D Secure Not Completed:</strong> Подтвердите SMS-код или запрос в приложении банка, когда банк этого требует.</li>
  <li><strong>Repeated Attempts:</strong> Повторите один раз, затем спросите банк. Только эмитент карты может объяснить отклонение.</li>
</ul>

<h2>4. FAQ по типичным проблемам и быстрые исправления</h2>

<h3>Q: «Claude пишет, что сессия истекла, хотя я только что вошёл»</h3>
<p><strong>A:</strong> Session cookies привязаны к IP и fingerprint устройства. Резкая смена IP аннулирует сессии. Решение: включите 2FA, чтобы реже запрашивали повторную верификацию, держите стабильный IP на сессию.</p>

<h3>Q: «API возвращает кэшированные ответы на новые prompts»</h3>
<p><strong>A:</strong> Prompt Cache совпал с нежелательным содержимым. Решение: добавьте уникальный идентификатор или timestamp в prompts, чтобы принудить cache miss: <code>{prompt} [request_id: {Date.now()}]</code>.</p>

<h3>Q: «WebRTC показывает мой реальный IP, хотя использую proxy»</h3>
<p><strong>A:</strong> WebRTC обходит proxy для peer-соединений. Решение: полностью отключите WebRTC в настройках браузера или используйте расширение WebRTC Control для блокировки STUN-запросов.</p>

<h3>Q: «Аккаунт внезапно требует верификацию по телефону»</h3>
<p><strong>A:</strong> Срабатывает при смене IP, входе с нового устройства или подозрительной активности. Решение: используйте сервис верификации на реальной физической SIM, сразу после верификации привяжите 2FA, чтобы не запрашивали снова.</p>
`;
