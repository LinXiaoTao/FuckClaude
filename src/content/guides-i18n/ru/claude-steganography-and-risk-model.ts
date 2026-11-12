export const content = `
<h2>1. Разбор инцидента со стеганографией в Claude Code</h2>
<p>В апреле 2026 года при реверс-инжиниринге официального CLI <code>@anthropic-ai/claude-code</code> выяснилось, что при маршрутизации запросов через неофициальный endpoint с помощью <code>ANTHROPIC_BASE_URL</code> CLI выполнял клиентскую логику детекции без уведомления пользователя:</p>

<ul>
  <li><strong>Проверка часового пояса:</strong> Определялось, совпадает ли системный часовой пояс с <code>Asia/Shanghai</code> или <code>Asia/Urumqi</code>. При совпадении разделитель даты в строке system prompt <code>Today's date is 2026-06-30</code> заменялся с дефисов на слэши: <code>2026/06/30</code>.</li>
  <li><strong>Чёрный список хостов и лабораторных ключевых слов:</strong> Имя прокси-хоста сверялось с XOR-зашифрованным (ключ: 91) base64-списком из 147+ доменов и ключевых слов китайских AI-лабораторий (например, <code>deepseek</code>, <code>moonshot</code>, <code>zhipu</code>, <code>minimax</code>, <code>dashscope</code>, <code>*.cn</code>).</li>
  <li><strong>Замена Unicode-апострофа:</strong> Апостроф в "Today's date" подменялся визуально похожими вариантами Unicode:
    <ul>
      <li>Хост в списке реселлерских доменов → замена на <code>U+2019</code> (’ Right Single Quotation Mark)</li>
      <li>Хост совпал с ключевыми словами AI-лабораторий → замена на <code>U+02BC</code> (Modifier Letter Apostrophe)</li>
      <li>Совпадение по обоим критериям → замена на <code>U+02B9</code> (Modifier Letter Prime)</li>
    </ul>
  </li>
</ul>

<p>Эта стеганографическая нагрузка проходила через прокси без изменений, что позволяло backend-классификаторам Anthropic отслеживать кампании дистилляции и несанкционированную коммерческую перепродажу без явных HTTP-заголовков.</p>

<h3>Защита окружения и меры смягчения</h3>
<pre><code># 1. Tell client to treat custom endpoint as first-party
export _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1

# 2. Override system timezone for CLI executions
export TZ=Asia/Tokyo

# Launch Claude Code
claude</code></pre>

<h2>2. Четырёхуровневая модель риск-контроля Anthropic</h2>
<p>Anthropic применяет комплексный конвейер защиты от злоупотреблений и дистилляции на <code>claude.ai</code>, API endpoints и в Claude Code:</p>

<ol>
  <li><strong>Сетевой слой и IP:</strong> Диапазонам IP дата-центров (AWS, Hetzner, DigitalOcean, Linode) назначаются высокие оценки риска. Выделенные residential IP с двумя ISP в поддерживаемых регионах (US, UK, SG, JP, TW) несут наименьший риск.</li>
  <li><strong>Отпечаток браузера и устройства:</strong> Сочетает часовой пояс ОС (<code>Intl.DateTimeFormat</code>), список языков браузера (<code>navigator.languages</code>), Canvas-зондирование китайских шрифтов (Microsoft YaHei, PingFang SC, MiSans) и заголовки User-Agent CH.</li>
  <li><strong>Слой платежей и идентичности:</strong> Высокорисковые BIN виртуальных карт (например, перегретые prepaid BIN), несовпадение страны billing address и VoIP-номера виртуальной телефонии могут вызвать мгновенную отмену подписки или отказ в оплате.</li>
  <li><strong>Поведенческие классификаторы и дистилляция:</strong> Автоматизированные скрипты, отправляющие миллионы повторяющихся prompt, высокочастотное насыщение context window и злоупотребление prompt caching приводят к автоматической блокировке аккаунта и квотам организации.</li>
</ol>
`;
