export const content = `
<h2>1. Оценка риска: residential IP vs datacenter IP</h2>
<p>Тип IP-адреса напрямую влияет на оценку риска аккаунта Claude. Anthropic назначает более высокие веса риска IP дата-центров, типичных для прокси и бот-трафика:</p>

<h3>Сравнение типов IP</h3>
<table>
  <thead>
    <tr>
      <th>Тип IP</th>
      <th>Уровень риска</th>
      <th>Характеристики</th>
      <th>Сценарий использования</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Residential IP</strong></td>
      <td>Низкий</td>
      <td>Выдаётся ISP домашним пользователям, чистая репутация, стабильный ASN</td>
      <td>Регистрация аккаунта, подписка Pro, долгосрочное использование</td>
    </tr>
    <tr>
      <td><strong>Mobile Carrier IP</strong></td>
      <td>Низкий–средний</td>
      <td>IP сотовых сетей с динамическим назначением, легитимное мобильное использование</td>
      <td>Доступ через мобильное приложение, кратковременные сессии</td>
    </tr>
    <tr>
      <td><strong>Datacenter IP</strong></td>
      <td>Высокий</td>
      <td>Диапазоны AWS, Hetzner, DigitalOcean, часто помечаются как бот-трафик</td>
      <td>Только краткосрочные тесты, высокий риск бана</td>
    </tr>
    <tr>
      <td><strong>VPN Shared Pool</strong></td>
      <td>Высокий</td>
      <td>Перегруженные диапазоны IP, которыми пользуются тысячи пользователей; многие сервисы вносят в чёрные списки</td>
      <td>Избегайте для доступа к Claude</td>
    </tr>
  </tbody>
</table>

<h3>Как проверить тип вашего IP</h3>
<pre><code># Check IP reputation and type
curl https://ipinfo.io

# Sample output shows:
# "org": "AS7922 Comcast Cable Communications" → Residential (Good)
# "org": "AS16509 Amazon.com, Inc." → Datacenter (High Risk)</code></pre>

<h2>2. Выбор протокола прокси</h2>
<p>Разные протоколы прокси дают разный уровень безопасности, скорости и устойчивости к fingerprinting:</p>

<ul>
  <li><strong>HTTP/HTTPS Proxy:</strong> Простой и широко поддерживаемый, но заголовки прозрачного прокси могут раскрыть исходный IP. Используйте только «elite» анонимные прокси, которые удаляют заголовки <code>X-Forwarded-For</code>.</li>
  <li><strong>SOCKS5:</strong> Безопаснее HTTP-прокси, поддерживает UDP для DNS, не меняет HTTP-заголовки. Предпочтителен для обычного веб-доступа к Claude.</li>
  <li><strong>Shadowsocks / V2Ray:</strong> Шифрованные протоколы для обхода DPI. Минимальная утечка отпечатка, но убедитесь, что exit-узел — residential IP.</li>
  <li><strong>Wireguard / OpenVPN:</strong> Полноценные VPN-туннели с маршрутизацией на уровне системы. Лучшая изоляция, но при неверной настройке возможны утечки DNS.</li>
</ul>

<h3>Пример настройки протокола (macOS/Linux)</h3>
<pre><code># SOCKS5 proxy via SSH tunnel (requires a remote server)
ssh -D 1080 -N user@your-residential-server.com

# Configure system to use SOCKS5 proxy
export ALL_PROXY=socks5://127.0.0.1:1080

# Test proxy connection
curl --proxy socks5://127.0.0.1:1080 https://ipinfo.io</code></pre>

<h2>3. Критерии оценки VPN-провайдера</h2>
<p>При выборе VPN для доступа к Claude отдавайте приоритет провайдерам с выделенными residential IP, а не общими пулами дата-центров:</p>

<ul>
  <li><strong>Тип пула IP:</strong> Убедитесь, что провайдер предлагает настоящие residential IP от ISP, а не диапазоны дата-центров с пометкой «residential».</li>
  <li><strong>Dedicated vs Shared:</strong> Выделенные IP исключают риск соседства с злоупотребляющими пользователями, но заметно дороже. Общие residential IP допустимы, если пул чистый и часто ротируется.</li>
  <li><strong>Выбор региона выхода:</strong> Выбирайте exit IP в поддерживаемых Anthropic регионах (US, UK, SG, JP) и сверяйте billing address со страной IP.</li>
  <li><strong>No-Log Policy:</strong> Выбирайте провайдеров с аудируемой политикой отсутствия логов, чтобы снизить риски compliance и приватности.</li>
  <li><strong>Защита от утечек DNS:</strong> Убедитесь, что VPN-клиент встроенно защищает от утечек DNS и использует удалённые DNS-серверы (1.1.1.1, 8.8.8.8).</li>
</ul>

<h2>4. Цепочка прокси и защита от утечек DNS</h2>
<p>В сценариях с повышенными требованиями к безопасности настройте цепочку прокси с несколькими hop, чтобы снизить риск корреляции IP:</p>

<h3>Многоступенчатая настройка прокси</h3>
<pre><code># Example: Local SOCKS5 → Residential Proxy → Claude
# Configure Clash / Sing-box with proxy chain rules

proxies:
  - name: "residential-us"
    type: socks5
    server: residential-proxy.example.com
    port: 1080
  
proxy-groups:
  - name: "claude-chain"
    type: relay
    proxies:
      - "residential-us"</code></pre>

<h3>Чеклист защиты от утечек DNS</h3>
<ul>
  <li>Задайте системный DNS на 1.1.1.1 или 8.8.8.8, не используйте ISP или публичные DNS в Китае.</li>
  <li>Включите DNS-over-HTTPS (DoH) или DNS-over-TLS (DoT) в настройках браузера.</li>
  <li>Проверьте утечки DNS на <code>https://dnsleaktest.com</code> при подключённом прокси.</li>
  <li>Полностью отключите WebRTC, чтобы локальный IP не утекал через STUN-серверы.</li>
</ul>
`;
