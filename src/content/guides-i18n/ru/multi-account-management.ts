export const content = `
<h2>1. Сравнение физической и программной изоляции</h2>
<p>Руководство для легитимных сценариев: отдельные рабочие и личные аккаунты или индивидуальные места в команде. Это не способ обойти бан или лимиты на аккаунт — такое запрещено условиями Anthropic. Чтобы аккаунты не пересекались, разделяйте профили браузера, сетевые сессии и биллинг. Выберите уровень изоляции под задачи и бюджет:</p>

<table>
  <thead>
    <tr>
      <th>Метод изоляции</th>
      <th>Стоимость</th>
      <th>Уровень безопасности</th>
      <th>Лучше всего для</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Отдельные физические машины</strong></td>
      <td>Высокая</td>
      <td>Максимальный</td>
      <td>Ценных корпоративных аккаунтов</td>
    </tr>
    <tr>
      <td><strong>Виртуальные машины (VMware/VirtualBox)</strong></td>
      <td>Средняя</td>
      <td>Высокий</td>
      <td>Команд с 5–20 аккаунтами</td>
    </tr>
    <tr>
      <td><strong>Антидетект-браузеры</strong></td>
      <td>Средняя</td>
      <td>Средне-высокий</td>
      <td>Маркетинговых агентств, мультиаккаунтных workflow</td>
    </tr>
    <tr>
      <td><strong>Профили браузера (Chrome/Firefox)</strong></td>
      <td>Низкая</td>
      <td>Средний</td>
      <td>Личного использования, 2–5 аккаунтов</td>
    </tr>
    <tr>
      <td><strong>Окна инкогнито/приватные</strong></td>
      <td>Бесплатно</td>
      <td>Низкий</td>
      <td>Только временных тестов</td>
    </tr>
  </tbody>
</table>

<h2>2. Полная изоляция профилей браузера</h2>
<p>При среднем масштабе (3–10 аккаунтов) правильно настроенные профили дают достаточную изоляцию без накладных расходов виртуальных машин:</p>

<h3>Настройка профиля Chrome</h3>
<pre><code># Create isolated Chrome profiles via command line
# macOS/Linux
google-chrome --user-data-dir="/path/to/profile-account1" --proxy-server="socks5://proxy1:1080"

# Windows
chrome.exe --user-data-dir="C:\ChromeProfiles\account1" --proxy-server="socks5://proxy1:1080"

# Each profile maintains separate:
# - Cookies, localStorage, IndexedDB
# - Extensions and settings
# - Autofill data and passwords</code></pre>

<h3>Контейнеры Firefox Multi-Account</h3>
<pre><code># Firefox containers provide lighter-weight isolation within a single profile
1. Install "Firefox Multi-Account Containers" extension
2. Create a container per Claude account
3. Assign container-specific proxy settings via "FoxyProxy" or "Proxy SwitchyOmega"
4. Open Claude.ai in dedicated container tabs</code></pre>

<h2>3. Разделение IP и оплаты между аккаунтами</h2>
<p>Даже при идеальной изоляции браузера общие IP или способы оплаты могут связать аккаунты и вызвать цепочку банов:</p>

<h3>Стратегия изоляции IP</h3>
<ul>
  <li><strong>Выделенные резидентные прокси:</strong> один уникальный резидентный IP на аккаунт. Не ротируйте IP внутри одной сессии аккаунта.</li>
  <li><strong>Sticky-сессии:</strong> настройте провайдера держать тот же IP минимум 24 часа на аккаунт, чтобы не ловить флаги из-за частой смены IP.</li>
  <li><strong>Географическое распределение:</strong> раскидайте аккаунты по US, UK и SG, чтобы снизить риск корреляции.</li>
</ul>

<h3>Разделение платёжных карт</h3>
<ul>
  <li><strong>Правило двух:</strong> не привязывайте одну виртуальную карту более чем к 2 аккаунтам Claude.</li>
  <li><strong>Именование карт:</strong> разные имена держателя на аккаунт, чтобы сильнее разорвать корреляцию.</li>
  <li><strong>Сдвиг дат продления:</strong> сдвиньте даты продления подписки на 5–7 дней, чтобы не синхронизировать платёжные события.</li>
</ul>

<h2>4. Безопасный SOP переключения аккаунтов</h2>
<p>Переключение между аккаунтами на одной машине требует аккуратной процедуры, чтобы не утекли общие идентификаторы:</p>

<h3>Чеклист перед переключением</h3>
<pre><code># 1. Close all browser windows for Account A
# 2. Clear DNS cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns            # Windows
sudo systemd-resolve --flush-caches  # Linux

# 3. Switch proxy to Account B's dedicated IP
# 4. Verify new IP
curl https://ipinfo.io

# 5. Launch Account B's browser profile
google-chrome --user-data-dir="/path/to/profile-accountB"</code></pre>

<h3>Матрица рисков при переключении аккаунтов</h3>
<table>
  <thead>
    <tr>
      <th>Сценарий</th>
      <th>Риск</th>
      <th>Смягчение</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Один IP, разные профили</td>
      <td>Высокий</td>
      <td>Всегда выделенный IP на аккаунт</td>
    </tr>
    <tr>
      <td>Одна карта, разные аккаунты</td>
      <td>Критический</td>
      <td>Не более 2 аккаунтов на карту</td>
    </tr>
    <tr>
      <td>Быстрые последовательные входы</td>
      <td>Средний</td>
      <td>Ждать 5–10 минут между переключениями</td>
    </tr>
    <tr>
      <td>Общий organizationUuid</td>
      <td>Критический</td>
      <td>Отдельные машины или ВМ для ценных аккаунтов</td>
    </tr>
  </tbody>
</table>
`;
