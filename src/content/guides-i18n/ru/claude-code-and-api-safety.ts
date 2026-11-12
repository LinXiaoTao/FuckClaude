export const content = `
<p>Claude Code и пользовательские интеграции с API передают не только промпты — они отправляют метаданные окружения, выбор маршрутизации и поведение при повторах, которые upstream-системы могут сопоставлять со «здоровьем» аккаунта. В этом руководстве — <em>операционная безопасность</em>: единообразная конфигурация shell, выбор шлюза и плавный failover при ужесточении квот. Цель — надёжные инженерные процессы, а не обход политики Anthropic.</p>

<p>Начните с чистой базы: <a href="/guides/environment-cleanup-and-ip-setup/">очистка окружения и настройка IP</a> и <a href="/guides/vpn-and-proxy-selection/">выбор VPN и прокси</a>, прежде чем настраивать переменные CLI. Если вы используете relay или мульти-модельные роутеры, прочитайте <a href="/guides/domestic-and-open-source-alternatives/">локальные и open-source альтернативы</a> про пути деградации.</p>

<h2>1. Параметры безопасности Claude Code</h2>
<p>Claude Code при запуске читает переменные окружения shell. Несогласованные часовой пояс, прокси или base URL дают запутанные ошибки или заставляют клиент вести себя иначе, чем сеанс в браузере. Считайте терминал полноценным окружением, а не второстепенной деталью.</p>

<h3>Основные переменные окружения</h3>
<pre><code># ~/.zshrc or ~/.bashrc — load in every interactive shell

# 1. Declare custom Anthropic-compatible endpoints explicitly
export ANTHROPIC_BASE_URL="https://your-gateway.example.com"
export ANTHROPIC_API_KEY="sk-your-key"

# 2. When using a trusted first-party-shaped gateway, reduce client mismatch warnings
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 3. Align terminal timezone with your documented operating region
export TZ=Asia/Tokyo   # or America/Los_Angeles — match proxy geo

# 4. Route CLI HTTPS through the same clean proxy as your browser (if required)
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export NO_PROXY="localhost,127.0.0.1,.internal"</code></pre>

<h3>Чеклист конфигурации</h3>
<ol>
  <li><strong>Единый источник истины:</strong> храните переменные в <code>~/.zshrc</code> (macOS) или в отдельном <code>~/.claude/env</code>, подключаемом в shell — не экспортируйте их наудачу в одной вкладке терминала.</li>
  <li><strong>Проверка перед запуском:</strong> в том же окне, откуда стартуете Claude Code, выполните <code>env | grep -E 'ANTHROPIC|TZ|PROXY'</code>.</li>
  <li><strong>Согласуйте географию браузера и CLI:</strong> если профиль браузера через anti-detect задаёт часовой пояс Токио, CLI не должен сообщать <code>Asia/Shanghai</code>.</li>
  <li><strong>Фиксируйте смену base URL:</strong> при переходе с прямого Anthropic на relay обновите и <code>ANTHROPIC_BASE_URL</code>, и внутренние runbook, чтобы коллеги не смешивали endpoint.</li>
  <li><strong>Гигиена секретов:</strong> не коммитьте API keys; для env-файлов — <code>chmod 600</code>, ключи relay ротируйте ежеквартально.</li>
</ol>

<h3>Что делает и чего не делает <code>_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL</code></h3>
<p>Флаг говорит Claude Code для части клиентских проверок воспринимать нестандартный <code>ANTHROPIC_BASE_URL</code> как обычный endpoint Anthropic. Это снижает трение, когда в организации одобрен внутренний шлюз. Он <strong>не</strong> меняет серверную политику, биллинг или право на доступ. Как по-прежнему могут оценивать метаданные клиента — см. <a href="/guides/claude-steganography-and-risk-model/">Claude: стеганография и модель риска</a>.</p>

<h3>Типичные сбои из-за неверной настройки</h3>
<ul>
  <li><strong>Раздвоение прокси:</strong> браузер через VPN, CLI — нет; запросы из разных ASN. Симптом: веб-чат работает, CLI возвращает 403.</li>
  <li><strong>Устаревший <code>NO_PROXY</code>:</strong> локальный шлюз на <code>127.0.0.1</code> должен обходить корпоративный прокси, иначе петля с connection reset.</li>
  <li><strong>Неверная область API key:</strong> organization keys и project keys по-разному ведут себя при rate limits; тип ключа проверьте в консоли Anthropic.</li>
  <li><strong>Интерактивный и неинтерактивный shell:</strong> CI, вызывающий Claude Code, должен подключать тот же env-файл; login shell на ноутбуке часто скрывает отсутствующие export.</li>
</ul>

<h2>2. Выбор API relay-шлюзов</h2>
<p>Когда прямой доступ к <code>api.anthropic.com</code> ограничен маршрутизацией или закупками, relay может повысить доступность — если сохраняется точность протокола. Плохой шлюз беззвучно срезает заголовки, переписывает промпты или даёт всплески задержки, похожие на регресс качества модели.</p>

<h3>Матрица оценки шлюза</h3>
<table>
  <thead>
    <tr>
      <th>Критерий</th>
      <th>Допуск</th>
      <th>Отказ (заменить шлюз)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Заголовки Prompt Cache</td>
      <td>Пробрасывает <code>anthropic-beta: prompt-caching-2024-07-15</code> (или актуальную beta) без изменений</td>
      <td>Срезает beta-заголовки; cache read tokens всегда ноль</td>
    </tr>
    <tr>
      <td>Целостность system prompt</td>
      <td>Байт-в-байт relay system blocks</td>
      <td>Вставляет рекламу, водяной знак или «полезные» префиксы</td>
    </tr>
    <tr>
      <td>Streaming SSE</td>
      <td>Сохраняет границы событий и tool deltas</td>
      <td>Буферизует весь ответ перед отдачей; ломает tool UI</td>
    </tr>
    <tr>
      <td>Прозрачность ошибок</td>
      <td>Пробрасывает коды и тела ответа Anthropic</td>
      <td>Всё сводит к generic 502</td>
    </tr>
    <tr>
      <td>Нейтральность hostname</td>
      <td>Нейтральный домен (напр. <code>api.yourcorp.net</code>)</td>
      <td>Публичные hostname с чужими AI-ключевыми словами или TLD <code>.cn</code> только для трафика Claude</td>
    </tr>
    <tr>
      <td>TLS &amp; cert pinning</td>
      <td>Валидный публичный CA, HSTS, без SSL inspection MITM</td>
      <td>Корпоративный SSL break без обновления trust store клиента</td>
    </tr>
  </tbody>
</table>

<h3>Сохранение Prompt Cache (влияние на стоимость)</h3>
<p>Prompt caching Anthropic может снизить стоимость повторного ввода до 90%. Relay без cache-заголовков тарифицирует полный input на каждом шаге — часто сюрприз 4×–10× на длинных system prompt. Проверьте тестом из двух запросов:</p>
<pre><code># Request 1: create cache
curl -s "$ANTHROPIC_BASE_URL/v1/messages" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: prompt-caching-2024-07-15" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":64,
       "system":[{"type":"text","text":"'$(python3 -c "print('x'*5000)")'",
         "cache_control":{"type":"ephemeral"}}],
       "messages":[{"role":"user","content":"ping"}]}'

# Request 2: expect cache_read_input_tokens &gt; 0 in usage</code></pre>
<p>Глубокие паттерны оптимизации — в <a href="/guides/api-advanced-optimization/">продвинутой оптимизации API</a>.</p>

<h3>Due diligence перед продакшеном</h3>
<ul>
  <li>24 часа синтетических проб (сообщение каждые 15 минут), замер p95 задержки и error rate.</li>
  <li>Логируйте выборку request ID; убедитесь, что приложение связывает логи шлюза с upstream ID при инцидентах.</li>
  <li>Соглашение об обработке данных: часть relay логирует промпты для abuse detection — недопустимо для регулируемых нагрузок.</li>
  <li>Предпочитайте шлюзы под контролем организации (self-hosted LiteLLM, One-API в VPC) непрозрачным публичным reseller при работе с исходным кодом.</li>
</ul>

<p>Стабильность на уровне аккаунта всё ещё зависит от гигиены регистрации — см. <a href="/guides/account-registration-and-payment-antiban/">регистрацию аккаунта и оплату: антибан</a>, если внедрение relay совпало с созданием новой org.</p>

<h2>3. Rate limits (429) и плавный failover</h2>
<p>Лимиты Anthropic действуют на уровне организации и тарифа модели, а не изолированно на один API key. Всплески agent, параллельные CI-задачи и неограниченные retry-циклы могут исчерпать общую квоту и заблокировать несвязанные сервисы той же org.</p>

<h3>Классы ограничений (упрощённо)</h3>
<table>
  <thead>
    <tr>
      <th>Сигнал</th>
      <th>HTTP-код</th>
      <th>Значение</th>
      <th>Безопасная реакция</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rate limit</td>
      <td>429</td>
      <td>Слишком много запросов / tokens в минуту</td>
      <td>Exponential backoff + jitter; снизить concurrency</td>
    </tr>
    <tr>
      <td>Overloaded</td>
      <td>529</td>
      <td>Ёмкость upstream</td>
      <td>Короткий backoff; опционально downgrade модели</td>
    </tr>
    <tr>
      <td>Auth / policy</td>
      <td>403</td>
      <td>Невалидный key или отказ в доступе</td>
      <td>Не ретраить вслепую; проверить статус аккаунта</td>
    </tr>
    <tr>
      <td>Bad request</td>
      <td>400</td>
      <td>Schema или лимит tokens</td>
      <td>Исправить payload; обрезать контекст</td>
    </tr>
  </tbody>
</table>

<h3>Паттерн retry и failover</h3>
<pre><code>// TypeScript — retry 429/529, failover on sustained pressure
async function callClaudeWithFallback(prompt: string, opts: CallOpts) {
  const maxRetries = 4;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callClaudeAPI(prompt, opts);
    } catch (error: any) {
      const status = error?.status;
      if (status === 429 || status === 529) {
        const delay = Math.min(30_000, 500 * 2 ** attempt + Math.random() * 250);
        await sleep(delay);
        continue;
      }
      if (status === 403) throw error; // surface auth issues
      throw error;
    }
  }
  console.warn('Claude quota saturated; failing over to backup upstream');
  return await callFallbackAPI(prompt, opts); // DeepSeek / GLM / local — see alternatives guide
}</code></pre>

<h3>Контроль параллелизма</h3>
<ul>
  <li><strong>Token bucket в CI:</strong> лимит параллельных agent jobs (напр. макс. 3) на организацию.</li>
  <li><strong>Объединение запросов:</strong> где возможно, пакетируйте мелкие lint-фиксы вместо одного API-вызова на файл.</li>
  <li><strong>Circuit breaker:</strong> после N подряд 429 разомкнуть цепь на 60 с и автоматически failover — против retry storm.</li>
  <li><strong>Наблюдаемость:</strong> метрики <code>claude_requests_total{status}</code>, <code>fallback_invocations_total</code>, p95 latency. Алерт, если доля fallback &gt; 15% за 10 минут.</li>
</ul>

<h3>403 и 429: не смешивайте</h3>
<p>429 — временное давление: отступите и продолжайте. 403 часто означает отзыв учётных данных, географическое ограничение или смену состояния аккаунта. Ретраить 403 с другими keys без диагностики может ускорить enforcement. Классифицируйте ошибки по <a href="/guides/troubleshooting-guide/">руководству по устранению неполадок</a>, прежде чем крутить инфраструктуру.</p>

<h2>FAQ</h2>

<h3>Нужно ли задавать <code>TZ</code>, если системный часовой пояс уже верный?</h3>
<p>Если часовой пояс ОС, geo выхода прокси и профиль браузера совпадают, явный <code>TZ</code> может быть лишним — но CI-контейнеры часто по умолчанию UTC. Явный export делает поведение предсказуемым на ноутбуках и серверах.</p>

<h3>«Безопасен» ли публичный API reseller для корпоративного исходного кода?</h3>
<p>Относитесь как к любому субпроцессору: логи, retention, список субпроцессоров. Для проприетарного кода self-hosted relay в VPC строго безопаснее анонимных reseller.</p>

<h3>Почему экономия cache пропадает после смены шлюза?</h3>
<p>Чаще всего relay срезает заголовки <code>anthropic-beta</code> или переставляет system blocks, ломая cache keys. После любой смены шлюза повторите двухзапросный cache-тест.</p>

<h3>Можно ли разные прокси для браузера и Claude Code?</h3>
<p>Технически да, но растёт риск расхождения. Предпочтительнее один задокументированный egress для всего трафика Claude, если только экспериментальные аккаунты не в отдельных профилях.</p>

<h3>Какую fallback-модель использовать в Claude Code при 429?</h3>
<p>В Claude Code нет встроенного multi-model failover — реализуйте на шлюзе (One-API/LiteLLM) или временно отключите Claude Code и используйте плагины IDE на backup API. Таблицы маршрутизации — в <a href="/guides/domestic-and-open-source-alternatives/">локальных и open-source альтернативах</a>.</p>

<h3>Как отладить «в curl работает, в Claude Code нет»?</h3>
<ol>
  <li>Сравните заголовки: curl vs CLI через mitmproxy или access log шлюза.</li>
  <li>Проверьте env в shell запуска: встроенные терминалы IDE иногда не читают login rc.</li>
  <li>Проверьте proxy agents Node/fetch — в некоторых версиях <code>HTTPS_PROXY</code> игнорируется без <code>GLOBAL_AGENT_HTTP_PROXY</code>.</li>
  <li>Проверьте TLS interception в корпоративной сети.</li>
</ol>

<h3>Влияет ли assume first-party base URL на биллинг Anthropic?</h3>
<p>Нет. Биллинг идёт по API key и организации того upstream, который реально обслуживает запрос. Если шлюз форвардит в Anthropic, платите Anthropic; если подменяет модели — платите провайдеру, которого вызывает шлюз.</p>
`;
