export const content = `
<h2>1. Настройка Chrome для снижения риска блокировок</h2>
<p>Chrome — самый частый браузер для доступа к Claude. Правильная настройка устраняет несоответствия часового пояса, утечки WebRTC и китайский отпечаток шрифтов:</p>

<h3>Синхронизация системного часового пояса</h3>
<pre><code># macOS: Set timezone to match proxy exit region
sudo systemsetup -settimezone "America/Los_Angeles"

# Windows: via PowerShell (requires admin)
Set-TimeZone -Id "Pacific Standard Time"

# Linux
sudo timedatectl set-timezone America/Los_Angeles</code></pre>

<h3>Флаги запуска Chrome для усиленной приватности</h3>
<pre><code># Launch Chrome with fingerprint-resistant flags
google-chrome \
  --disable-blink-features=AutomationControlled \
  --disable-webrtc \
  --lang=en-US \
  --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0"</code></pre>

<h3>Чеклист настроек Chrome</h3>
<ul>
  <li><strong>Языки:</strong> в <code>chrome://settings/languages</code> установите English (United States) и удалите все записи китайского языка.</li>
  <li><strong>Контроль WebRTC:</strong> установите расширение <em>WebRTC Network Limiter</em> и выберите «Use my proxy server (if any)».</li>
  <li><strong>Do Not Track:</strong> включите в <code>chrome://settings/privacy</code>.</li>
  <li><strong>Очистка при выходе:</strong> в <code>chrome://settings/cookies</code> настройте очистку cookie и данных сайтов при закрытии всех окон.</li>
</ul>

<h2>2. Усиление приватности в Firefox</h2>
<p>Firefox даёт детальный контроль через <code>about:config</code>. Эти параметры уменьшают отпечаток браузера и предотвращают утечки часового пояса и WebRTC:</p>

<h3>Критические параметры about:config</h3>
<pre><code># Open about:config and set:
privacy.resistFingerprinting = true
webgl.disabled = true
media.peerconnection.enabled = false
geo.enabled = false
intl.accept_languages = en-US, en
general.useragent.locale = en-US</code></pre>

<h3>Контейнерные вкладки для изоляции нескольких аккаунтов</h3>
<p>Используйте Firefox Multi-Account Containers, чтобы изолировать аккаунты Claude в отдельные контексты cookie и хранилища без отдельных профилей браузера:</p>
<pre><code>1. Install "Firefox Multi-Account Containers" extension
2. Create a dedicated container per Claude account
3. Right-click Claude.ai → "Open in New Container Tab"
4. Each container maintains isolated cookies, localStorage, IndexedDB</code></pre>

<h2>3. Корпоративные политики Edge</h2>
<p>Microsoft Edge поддерживает Group Policy для тонкой настройки WebRTC, геолокации и аппаратного ускорения:</p>

<h3>Конфигурация Group Policy в Windows</h3>
<pre><code># Open gpedit.msc (Windows Pro/Enterprise)
Computer Configuration → Administrative Templates → Microsoft Edge

WebRtcUdpPortRange: Disabled
DefaultGeolocationSetting: Block geolocation
HardwareAccelerationModeEnabled: Disabled (prevents GPU fingerprinting)</code></pre>

<h3>Флаги Edge для приватности</h3>
<pre><code>edge://flags

#edge-enable-webrtc-hide-local-ips-with-mdns → Enabled
#smooth-scrolling → Disabled
#calculate-native-win-occlusion → Disabled</code></pre>

<h2>4. Необходимые расширения браузера</h2>
<p>Установите расширения с упором на приватность, чтобы снижать утечки отпечатка и управлять cookie между сессиями:</p>

<ul>
  <li><strong>User-Agent Switcher:</strong> меняйте строки User-Agent под целевой регион (US/UK/SG).</li>
  <li><strong>Cookie AutoDelete:</strong> автоматически очищайте cookie при закрытии вкладок, кроме доменов из белого списка.</li>
  <li><strong>uBlock Origin:</strong> блокируйте сторонние трекеры и аналитику, которые могут связать сессии.</li>
  <li><strong>Decentraleyes:</strong> отдавайте распространённые JS-библиотеки локально, чтобы не тянуть CDN-трекинг.</li>
  <li><strong>Clear Browsing Data:</strong> планируйте автоочистку кэша, cookie и истории при перезапуске браузера.</li>
</ul>

<h3>Лучшие практики настройки расширений</h3>
<ul>
  <li>В Cookie AutoDelete в белый список — только нужные домены (claude.ai, anthropic.com).</li>
  <li>В User-Agent Switcher укажите ОС и версию браузера, согласованные с регионом выхода прокси.</li>
  <li>Отключайте расширения с широкими правами или внедряющие скрипты на все страницы.</li>
</ul>
`;
