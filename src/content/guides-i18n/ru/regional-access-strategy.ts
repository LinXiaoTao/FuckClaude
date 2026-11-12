export const content = `
<h2>1. Поддерживаемые и ограниченные регионы Anthropic</h2>
<p>Anthropic явно ограничивает доступ к Claude из ряда регионов. Поймите классификацию, чтобы выбрать compliant-стратегии регистрации и использования:</p>

<h3>Классификация регионов</h3>
<table>
  <thead>
    <tr>
      <th>Категория</th>
      <th>Регионы</th>
      <th>Статус доступа</th>
      <th>Стратегия</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Полная поддержка</strong></td>
      <td>Например США, Великобритания, Канада, Австралия, Новая Зеландия, Сингапур, Япония, Тайвань, Индия, Бразилия. См. <a href="https://www.anthropic.com/supported-countries" target="_blank" rel="noopener noreferrer">полный список Supported Regions</a></td>
      <td>В списке Supported Regions (API и Claude.ai)</td>
      <td>Регистрация напрямую с локальных IP</td>
    </tr>
    <tr>
      <td><strong>EU/EEA</strong></td>
      <td>Германия, Франция, Нидерланды и др.</td>
      <td>Поддержка с соблюдением GDPR</td>
      <td>IP в EU, согласие на обработку данных</td>
    </tr>
    <tr>
      <td><strong>Ограничено</strong></td>
      <td>Китай (материк), Гонконг, Макао, Россия, Иран, Северная Корея, Куба</td>
      <td>Не в списке Supported Regions; создание аккаунта из неподдерживаемой локации — официально указанная причина бана</td>
      <td>Residential IP в поддерживаемом регионе, согласование биллинга/телефона. Выходной IP в поддерживаемом регионе не делает аккаунт eligible; с 1 октября 2026 в community reports фигурировали блокировки пользователей из Гонконга</td>
    </tr>
  </tbody>
</table>

<h3>Методы определения региона</h3>
<p>Anthropic не документирует, как определяется ваш регион. Ниже сигналы, о которых часто пишут в community reports, а не подтверждённые правила:</p>
<ul>
  <li><strong>IP Geolocation:</strong> широко считается основным сигналом</li>
  <li><strong>Страна платёжной карты:</strong> billing address должен совпадать со страной выпуска карты (официальное требование)</li>
  <li><strong>Код страны телефона:</strong> номер SMS-верификации намекает на вероятную локацию</li>
  <li><strong>Billing address:</strong> должен быть в допустимой для биллинга локации (официальное требование)</li>
</ul>

<h2>2. Лучшие практики регистрации US/UK/SG</h2>
<p>Три часто используемых поддерживаемых региона. Держите IP, часовой пояс, телефон и биллинг согласованными с выбранным регионом:</p>

<h3>Регистрация в США</h3>
<pre><code># Optimal Configuration for US Registration
Proxy IP: US residential (Comcast, AT&T, Verizon ASNs)
Timezone: America/New_York or America/Los_Angeles
Phone: Real US carrier SIM (+1 area codes: 212, 310, 415, etc.)
Card: US-issued credit or debit card with US billing address
Billing Address: Real US residential address matching IP state

# Verification Script
curl https://ipinfo.io | jq '{ip, city, region, country, org}'
# Ensure country="US", org shows ISP not datacenter</code></pre>

<h3>Регистрация в Великобритании</h3>
<pre><code># UK-Specific Configuration
Proxy IP: UK residential (BT, Virgin Media, Sky ASNs)
Timezone: Europe/London
Phone: Real UK carrier SIM (+44)
Card: UK or EU-issued credit or debit card
Billing Address: Real UK address with valid postcode

# UK Address Validation
# Use Royal Mail Postcode Finder to verify address legitimacy</code></pre>

<h3>Регистрация в Сингапуре</h3>
<pre><code># Singapore Configuration
Proxy IP: Singapore residential (Singtel, StarHub, M1 ASNs)
Timezone: Asia/Singapore
Phone: Singapore carrier SIM (+65)
Card: Singapore or international card accepted in SG
Billing Address: Real Singapore address with postal code

# Note: Singapore is on the Supported Regions list</code></pre>

<h2>3. GDPR в EU и суверенитет данных</h2>
<p>Пользователям в EU нужны дополнительные согласия по GDPR. Anthropic обязан соблюдать нормы обработки данных:</p>

<h3>Чеклист согласия GDPR</h3>
<ul>
  <li>Принять privacy policy Anthropic, совместимую с GDPR, при регистрации</li>
  <li>Проверить локацию обработки данных (Anthropic использует AWS в США, с мерами трансфера данных в EU)</li>
  <li>При необходимости запросить экспорт данных через Anthropic Console (GDPR Article 20)</li>
  <li>Реализовать право на удаление через support (GDPR Article 17)</li>
</ul>

<h3>Факторы риска, специфичные для EU</h3>
<ul>
  <li>Некоторые банки EU отклоняют подписки на US — используйте virtual cards международных провайдеров</li>
  <li>Strong Customer Authentication (SCA) может требовать 3D Secure — убедитесь, что карта поддерживает</li>
  <li>VAT начисляется автоматически по стране billing address</li>
</ul>

<h2>4. Соответствие при зарубежных командировках</h2>
<p>Есть законные сценарии доступа к Claude в поездках. Настройте окружение так, чтобы оно выдержало проверку:</p>

<h3>Настройка для compliant travel</h3>
<pre><code># Before international travel:
1. Enable 2FA on Claude account (Google Authenticator)
2. Notify payment card issuer of travel dates
3. Bring documentation proving business travel (conference tickets, etc.)
4. Use hotel/office WiFi rather than public hotspots
5. If using VPN, choose exit IP in your account's home region

# During travel access:
# Document business purpose in case of appeal:
# - Conference attendance
# - Client meetings
# - Remote work for US/UK employer</code></pre>

<h3>Шаблон апелляции при блокировке из-за поездки</h3>
<pre><code>Subject: Account Access Issue During Business Travel

Dear Anthropic Support,

I am a Claude Pro subscriber (email: your@email.com) and my account 
was restricted while I was traveling for business to [Country].

I am a [Your Country] resident and citizen, and registered my account 
while physically located in [Home Country]. I am currently traveling 
for work and need continued access to Claude for my professional duties.

Attached is documentation of my business travel: [conference ticket, 
work visa, employer letter, etc.]

I maintain 2FA on my account and am accessing from secure networks. 
Please restore access to my account.

Thank you,
[Your Name]</code></pre>
`;
