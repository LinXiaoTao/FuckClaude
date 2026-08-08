export const vpn_and_proxy_selection_content = {
  en: `
<h2>1. Residential IP vs Datacenter IP Risk Assessment</h2>
<p>The IP address type directly impacts Claude account risk scores. Anthropic assigns higher risk weights to datacenter IPs commonly associated with proxy services and bot traffic:</p>

<h3>IP Type Comparison</h3>
<table>
  <thead>
    <tr>
      <th>IP Type</th>
      <th>Risk Level</th>
      <th>Characteristics</th>
      <th>Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Residential IP</strong></td>
      <td>Low</td>
      <td>Assigned by ISPs to home users, clean reputation, stable ASN</td>
      <td>Account registration, Pro subscription, long-term usage</td>
    </tr>
    <tr>
      <td><strong>Mobile Carrier IP</strong></td>
      <td>Low-Medium</td>
      <td>Cellular network IPs with dynamic assignment, legitimate mobile usage</td>
      <td>Mobile app access, temporary sessions</td>
    </tr>
    <tr>
      <td><strong>Datacenter IP</strong></td>
      <td>High</td>
      <td>AWS, Hetzner, DigitalOcean ranges, frequently flagged for bot traffic</td>
      <td>Short-term testing only, high ban risk</td>
    </tr>
    <tr>
      <td><strong>VPN Shared Pool</strong></td>
      <td>High</td>
      <td>Overused IP ranges shared by thousands, blacklisted by many services</td>
      <td>Avoid for Claude access</td>
    </tr>
  </tbody>
</table>

<h3>How to Verify Your IP Type</h3>
<pre><code># Check IP reputation and type
curl https://ipinfo.io

# Sample output shows:
# "org": "AS7922 Comcast Cable Communications" → Residential (Good)
# "org": "AS16509 Amazon.com, Inc." → Datacenter (High Risk)</code></pre>

<h2>2. Proxy Protocol Selection</h2>
<p>Different proxy protocols offer varying levels of security, speed, and fingerprint resistance:</p>

<ul>
  <li><strong>HTTP/HTTPS Proxy:</strong> Simple and widely supported, but transparent proxy headers can leak original IP. Only use with "elite" anonymous proxies that strip <code>X-Forwarded-For</code> headers.</li>
  <li><strong>SOCKS5:</strong> More secure than HTTP proxies, supports UDP for DNS resolution, and does not modify HTTP headers. Preferred for general Claude web access.</li>
  <li><strong>Shadowsocks / V2Ray:</strong> Encrypted protocols designed to bypass deep packet inspection. Minimal fingerprint leakage, but ensure the exit node is a residential IP.</li>
  <li><strong>Wireguard / OpenVPN:</strong> Full VPN tunnels with system-wide routing. Best isolation but can leak DNS queries if not configured properly.</li>
</ul>

<h3>Protocol Configuration Example (macOS/Linux)</h3>
<pre><code># SOCKS5 proxy via SSH tunnel (requires a remote server)
ssh -D 1080 -N user@your-residential-server.com

# Configure system to use SOCKS5 proxy
export ALL_PROXY=socks5://127.0.0.1:1080

# Test proxy connection
curl --proxy socks5://127.0.0.1:1080 https://ipinfo.io</code></pre>

<h2>3. VPN Provider Evaluation Criteria</h2>
<p>When selecting a VPN service for Claude access, prioritize providers that offer dedicated residential IPs rather than shared datacenter pools:</p>

<ul>
  <li><strong>IP Pool Type:</strong> Verify the provider offers true residential IPs sourced from ISPs, not datacenter ranges labeled as "residential".</li>
  <li><strong>Dedicated vs Shared:</strong> Dedicated IPs eliminate the risk of sharing with abusive users, but cost significantly more. Shared residential IPs are acceptable if the pool is clean and rotates frequently.</li>
  <li><strong>Exit Region Selection:</strong> Choose exit IPs in Anthropic-supported regions (US, UK, SG, JP) and ensure the billing address aligns with the IP country.</li>
  <li><strong>No-Log Policy:</strong> Select providers with audited no-log policies to minimize compliance and privacy risks.</li>
  <li><strong>DNS Leak Protection:</strong> Ensure the VPN client includes built-in DNS leak protection and uses remote DNS servers (1.1.1.1, 8.8.8.8).</li>
</ul>

<h2>4. Proxy Chain Configuration & DNS Leak Prevention</h2>
<p>For high-security scenarios, configure a proxy chain to route traffic through multiple hops, reducing the risk of IP correlation:</p>

<h3>Multi-Hop Proxy Setup</h3>
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

<h3>DNS Leak Prevention Checklist</h3>
<ul>
  <li>Set system DNS to 1.1.1.1 or 8.8.8.8, never use ISP or Chinese public DNS.</li>
  <li>Enable DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT) in browser settings.</li>
  <li>Test for DNS leaks at <code>https://dnsleaktest.com</code> while connected to proxy.</li>
  <li>Disable WebRTC completely to prevent local IP leaks via STUN servers.</li>
</ul>
`,
  zh: `
<h2>一、 住宅 IP vs 数据中心 IP 风险对比</h2>
<p>IP 地址类型直接影响 Claude 账号风控评分。Anthropic 对常见于代理服务和机器人流量的数据中心 IP 赋予更高风险权重：</p>

<h3>IP 类型对比</h3>
<table>
  <thead>
    <tr>
      <th>IP 类型</th>
      <th>风险等级</th>
      <th>特征</th>
      <th>适用场景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>住宅 IP</strong></td>
      <td>低</td>
      <td>ISP 分配给家庭用户，信誉干净，ASN 稳定</td>
      <td>账号注册、Pro 订阅、长期使用</td>
    </tr>
    <tr>
      <td><strong>移动运营商 IP</strong></td>
      <td>低-中</td>
      <td>蜂窝网络 IP，动态分配，合法移动使用</td>
      <td>移动端访问、临时会话</td>
    </tr>
    <tr>
      <td><strong>数据中心 IP</strong></td>
      <td>高</td>
      <td>AWS、Hetzner、DigitalOcean 等段，频繁被标记为机器流量</td>
      <td>仅短期测试，封号风险高</td>
    </tr>
    <tr>
      <td><strong>VPN 共享池</strong></td>
      <td>高</td>
      <td>被数千用户共享的过度使用 IP 段，多服务黑名单</td>
      <td>避免用于 Claude 访问</td>
    </tr>
  </tbody>
</table>

<h3>如何验证 IP 类型</h3>
<pre><code># 检查 IP 信誉和类型
curl https://ipinfo.io

# 示例输出显示：
# "org": "AS7922 Comcast Cable Communications" → 住宅 IP（良好）
# "org": "AS16509 Amazon.com, Inc." → 数据中心 IP（高风险）</code></pre>

<h2>二、 代理协议选择</h2>
<p>不同代理协议提供不同级别的安全性、速度和抗指纹能力：</p>

<ul>
  <li><strong>HTTP/HTTPS 代理：</strong> 简单且广泛支持，但透明代理头可能泄漏原始 IP。仅使用剥离 <code>X-Forwarded-For</code> 头的"精英"匿名代理。</li>
  <li><strong>SOCKS5：</strong> 比 HTTP 代理更安全，支持 UDP 进行 DNS 解析，且不修改 HTTP 头。推荐用于 Claude 网页访问。</li>
  <li><strong>Shadowsocks / V2Ray：</strong> 设计用于绕过深度包检测的加密协议。最小指纹泄漏，但需确保出口节点为住宅 IP。</li>
  <li><strong>Wireguard / OpenVPN：</strong> 全系统路由的完整 VPN 隧道。最佳隔离，但配置不当可能泄漏 DNS 查询。</li>
</ul>

<h3>协议配置示例（macOS/Linux）</h3>
<pre><code># 通过 SSH 隧道建立 SOCKS5 代理（需要远程服务器）
ssh -D 1080 -N user@your-residential-server.com

# 配置系统使用 SOCKS5 代理
export ALL_PROXY=socks5://127.0.0.1:1080

# 测试代理连接
curl --proxy socks5://127.0.0.1:1080 https://ipinfo.io</code></pre>

<h2>三、 VPN 服务商评估标准</h2>
<p>选择用于 Claude 访问的 VPN 服务时，优先选择提供专用住宅 IP 而非共享数据中心池的服务商：</p>

<ul>
  <li><strong>IP 池类型：</strong> 验证服务商提供真实的 ISP 来源住宅 IP，而非标记为"住宅"的数据中心段。</li>
  <li><strong>专用 vs 共享：</strong> 专用 IP 消除与滥用用户共享的风险，但成本显著更高。共享住宅 IP 可接受，前提是池干净且频繁轮换。</li>
  <li><strong>出口地区选择：</strong> 选择 Anthropic 支持地区（美国、英国、新加坡、日本）的出口 IP，确保账单地址与 IP 国家一致。</li>
  <li><strong>无日志政策：</strong> 选择经审计的无日志政策服务商，以最小化合规和隐私风险。</li>
  <li><strong>DNS 泄漏防护：</strong> 确保 VPN 客户端包含内置 DNS 泄漏防护，使用远程 DNS 服务器（1.1.1.1、8.8.8.8）。</li>
</ul>

<h2>四、 代理链路配置与 DNS 泄漏防护</h2>
<p>对于高安全场景，配置代理链通过多跳路由流量，减少 IP 关联风险：</p>

<h3>多跳代理设置</h3>
<pre><code># 示例：本地 SOCKS5 → 住宅代理 → Claude
# 使用 Clash / Sing-box 配置代理链规则

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

<h3>DNS 泄漏防护检查清单</h3>
<ul>
  <li>将系统 DNS 设置为 1.1.1.1 或 8.8.8.8，绝不使用 ISP 或国内公共 DNS。</li>
  <li>在浏览器设置中启用 DNS-over-HTTPS (DoH) 或 DNS-over-TLS (DoT)。</li>
  <li>连接代理时在 <code>https://dnsleaktest.com</code> 测试 DNS 泄漏。</li>
  <li>完全禁用 WebRTC 以防止通过 STUN 服务器泄漏本地 IP。</li>
</ul>
`,
};
