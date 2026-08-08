export const multi_account_management_content = {
  en: `
<h2>1. Physical vs Software Isolation Comparison</h2>
<p>Managing multiple Claude accounts safely requires isolation at the browser fingerprint, IP, and payment levels. Choose the appropriate isolation strategy based on your risk tolerance and budget:</p>

<table>
  <thead>
    <tr>
      <th>Isolation Method</th>
      <th>Cost</th>
      <th>Security Level</th>
      <th>Best For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Separate Physical Machines</strong></td>
      <td>High</td>
      <td>Maximum</td>
      <td>High-value enterprise accounts</td>
    </tr>
    <tr>
      <td><strong>Virtual Machines (VMware/VirtualBox)</strong></td>
      <td>Medium</td>
      <td>High</td>
      <td>Teams managing 5-20 accounts</td>
    </tr>
    <tr>
      <td><strong>Anti-Detect Browsers</strong></td>
      <td>Medium</td>
      <td>Medium-High</td>
      <td>Marketing agencies, multi-account workflows</td>
    </tr>
    <tr>
      <td><strong>Browser Profiles (Chrome/Firefox)</strong></td>
      <td>Low</td>
      <td>Medium</td>
      <td>Personal use, 2-5 accounts</td>
    </tr>
    <tr>
      <td><strong>Incognito/Private Windows</strong></td>
      <td>Free</td>
      <td>Low</td>
      <td>Temporary testing only</td>
    </tr>
  </tbody>
</table>

<h2>2. Browser Profile Complete Isolation</h2>
<p>For mid-scale multi-account management (3-10 accounts), properly configured browser profiles provide adequate isolation without the overhead of virtual machines:</p>

<h3>Chrome Profile Setup</h3>
<pre><code># Create isolated Chrome profiles via command line
# macOS/Linux
google-chrome --user-data-dir="/path/to/profile-account1" --proxy-server="socks5://proxy1:1080"

# Windows
chrome.exe --user-data-dir="C:\ChromeProfiles\account1" --proxy-server="socks5://proxy1:1080"

# Each profile maintains separate:
# - Cookies, localStorage, IndexedDB
# - Extensions and settings
# - Autofill data and passwords</code></pre>

<h3>Firefox Multi-Account Containers</h3>
<pre><code># Firefox containers provide lighter-weight isolation within a single profile
1. Install "Firefox Multi-Account Containers" extension
2. Create a container per Claude account
3. Assign container-specific proxy settings via "FoxyProxy" or "Proxy SwitchyOmega"
4. Open Claude.ai in dedicated container tabs</code></pre>

<h2>3. Multi-Account IP & Payment Separation</h2>
<p>Even with perfect browser isolation, shared IPs or payment methods can link accounts and trigger chain bans:</p>

<h3>IP Isolation Strategy</h3>
<ul>
  <li><strong>Dedicated Residential Proxies:</strong> Assign one unique residential IP per account. Never rotate IPs within a single account session.</li>
  <li><strong>Sticky Sessions:</strong> Configure proxy provider to maintain the same IP for at least 24 hours per account to avoid rapid IP change flags.</li>
  <li><strong>Geographic Distribution:</strong> Spread accounts across US, UK, and SG regions to reduce correlation risk.</li>
</ul>

<h3>Payment Card Separation</h3>
<ul>
  <li><strong>Rule of 2:</strong> Never bind the same virtual card to more than 2 Claude accounts.</li>
  <li><strong>Card Naming Convention:</strong> Use distinct cardholder names per account to further break correlation.</li>
  <li><strong>Staggered Renewals:</strong> Offset subscription renewal dates by 5-7 days to avoid synchronized payment events.</li>
</ul>

<h2>4. Safe Account Switching SOP</h2>
<p>Switching between accounts on the same machine requires careful procedure to avoid leaking shared identifiers:</p>

<h3>Pre-Switch Checklist</h3>
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

<h3>Account Switching Risk Matrix</h3>
<table>
  <thead>
    <tr>
      <th>Scenario</th>
      <th>Risk</th>
      <th>Mitigation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Same IP, Different Profiles</td>
      <td>High</td>
      <td>Always use dedicated IPs per account</td>
    </tr>
    <tr>
      <td>Same Card, Different Accounts</td>
      <td>Critical</td>
      <td>Never exceed 2 accounts per card</td>
    </tr>
    <tr>
      <td>Rapid Sequential Logins</td>
      <td>Medium</td>
      <td>Wait 5-10 minutes between account switches</td>
    </tr>
    <tr>
      <td>Shared organizationUuid</td>
      <td>Critical</td>
      <td>Use separate machines or VMs for high-value accounts</td>
    </tr>
  </tbody>
</table>
`,
  zh: `
<h2>一、 物理隔离 vs 软件隔离方案对比</h2>
<p>安全管理多个 Claude 账号需要在浏览器指纹、IP 和支付层面进行隔离。根据风险承受能力和预算选择合适的隔离策略：</p>

<table>
  <thead>
    <tr>
      <th>隔离方法</th>
      <th>成本</th>
      <th>安全级别</th>
      <th>适用场景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>独立物理机器</strong></td>
      <td>高</td>
      <td>最高</td>
      <td>高价值企业账号</td>
    </tr>
    <tr>
      <td><strong>虚拟机（VMware/VirtualBox）</strong></td>
      <td>中</td>
      <td>高</td>
      <td>管理 5-20 个账号的团队</td>
    </tr>
    <tr>
      <td><strong>防指纹浏览器</strong></td>
      <td>中</td>
      <td>中-高</td>
      <td>营销机构、多账号工作流</td>
    </tr>
    <tr>
      <td><strong>浏览器配置文件（Chrome/Firefox）</strong></td>
      <td>低</td>
      <td>中</td>
      <td>个人使用、2-5 个账号</td>
    </tr>
    <tr>
      <td><strong>隐身/隐私窗口</strong></td>
      <td>免费</td>
      <td>低</td>
      <td>仅临时测试</td>
    </tr>
  </tbody>
</table>

<h2>二、 浏览器 Profile 完全隔离配置</h2>
<p>对于中等规模的多账号管理（3-10 个账号），正确配置的浏览器配置文件可提供足够的隔离，无需虚拟机的开销：</p>

<h3>Chrome Profile 设置</h3>
<pre><code># 通过命令行创建隔离的 Chrome 配置文件
# macOS/Linux
google-chrome --user-data-dir="/path/to/profile-account1" --proxy-server="socks5://proxy1:1080"

# Windows
chrome.exe --user-data-dir="C:\ChromeProfiles\account1" --proxy-server="socks5://proxy1:1080"

# 每个配置文件维护独立的：
# - Cookie、localStorage、IndexedDB
# - 扩展和设置
# - 自动填充数据和密码</code></pre>

<h3>Firefox 多账号容器</h3>
<pre><code># Firefox 容器在单个配置文件内提供轻量级隔离
1. 安装 "Firefox Multi-Account Containers" 扩展
2. 为每个 Claude 账号创建容器
3. 通过 "FoxyProxy" 或 "Proxy SwitchyOmega" 分配容器特定的代理设置
4. 在专用容器标签页中打开 Claude.ai</code></pre>

<h2>三、 多账号 IP 与支付分离策略</h2>
<p>即使浏览器完全隔离，共享 IP 或支付方式也会关联账号并触发连带封禁：</p>

<h3>IP 隔离策略</h3>
<ul>
  <li><strong>专用住宅代理：</strong> 为每个账号分配一个唯一的住宅 IP。切勿在单个账号会话中轮换 IP。</li>
  <li><strong>粘性会话：</strong> 配置代理服务商为每个账号维护至少 24 小时的相同 IP，避免快速 IP 更改标记。</li>
  <li><strong>地理分布：</strong> 将账号分散在美国、英国和新加坡地区，降低关联风险。</li>
</ul>

<h3>支付卡分离</h3>
<ul>
  <li><strong>2 的规则：</strong> 切勿将同一张虚拟卡绑定到超过 2 个 Claude 账号。</li>
  <li><strong>卡持有人命名约定：</strong> 每个账号使用不同的持卡人姓名，进一步打破关联。</li>
  <li><strong>错峰续费：</strong> 将订阅续费日期错开 5-7 天，避免同步支付事件。</li>
</ul>

<h2>四、 账号切换安全 SOP 与风险矩阵</h2>
<p>在同一台机器上切换账号需要谨慎操作，以避免泄漏共享标识符：</p>

<h3>切换前检查清单</h3>
<pre><code># 1. 关闭账号 A 的所有浏览器窗口
# 2. 清除 DNS 缓存
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns            # Windows
sudo systemd-resolve --flush-caches  # Linux

# 3. 切换代理到账号 B 的专用 IP
# 4. 验证新 IP
curl https://ipinfo.io

# 5. 启动账号 B 的浏览器配置文件
google-chrome --user-data-dir="/path/to/profile-accountB"</code></pre>

<h3>账号切换风险矩阵</h3>
<table>
  <thead>
    <tr>
      <th>场景</th>
      <th>风险</th>
      <th>缓解措施</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>同一 IP，不同配置文件</td>
      <td>高</td>
      <td>始终为每个账号使用专用 IP</td>
    </tr>
    <tr>
      <td>同一卡，不同账号</td>
      <td>严重</td>
      <td>每张卡切勿超过 2 个账号</td>
    </tr>
    <tr>
      <td>快速连续登录</td>
      <td>中</td>
      <td>账号切换之间等待 5-10 分钟</td>
    </tr>
    <tr>
      <td>共享 organizationUuid</td>
      <td>严重</td>
      <td>为高价值账号使用单独的机器或虚拟机</td>
    </tr>
  </tbody>
</table>
`,
};
