import { SITE_AUTHOR } from '../../config/site';

export type TrustPageId = 'privacy' | 'about' | 'contact' | 'terms';

export const TRUST_CONTENT: Record<TrustPageId, { en: string; zh: string }> = {
  privacy: {
    en: `
<h2>1. Local Scan Architecture — Zero Data Upload</h2>
<p>Every client-side fingerprinting and environmental risk test on <strong>Fuck Claude</strong> runs 100% inside your local web browser. Your scan results, detected locale signals, IP observations from WebRTC, and computed risk scores are processed in memory on your device. They are <strong>never uploaded</strong> to our servers, never stored in any remote database, and never shared with or sold to third parties.</p>

<h2>2. Google AdSense & Third-Party Advertising Cookies</h2>
<p>This website uses <strong>Google AdSense</strong> to display advertisements. Google and third-party advertising partners use cookies, web beacons, and similar technologies to serve and personalize ads based on a user's prior visits to this website and other websites across the Internet:</p>
<ul>
  <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
  <li>Google's use of advertising cookies, including the DoubleClick (DART) cookie, enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.</li>
  <li>Third-party vendors and ad networks may also serve ads on this website. Learn more in <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses information from sites or apps that use its services</a>.</li>
  <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
  <li>Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds.info</a> or <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices</a>.</li>
</ul>

<h2>3. Google Analytics (GA4) & Aggregated Metrics</h2>
<p>We use Google Analytics 4 (GA4) with IP anonymization enabled to collect aggregate, non-personally identifiable traffic metrics (such as page views, referrer domains, browser user-agent families, and general geographic regions). Google Analytics collects telemetry strictly to help us understand content performance and improve user experience. Analytics telemetry is completely decoupled from the local fingerprint scanner and does not receive your individual scan results.</p>

<h2>4. WebRTC STUN Probing</h2>
<p>When you run the optional WebRTC leak test, your browser establishes a temporary connection to public STUN (Session Traversal Utilities for NAT) servers to discover local and public ICE candidates. This is a standard, client-initiated WebRTC protocol operation. The discovered candidate strings are evaluated locally within your browser and are not transmitted to our backend.</p>

<h2>5. User Privacy Rights (GDPR & CCPA / CPRA)</h2>
<p>We respect international privacy frameworks including the EU/UK General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA / CPRA):</p>
<ul>
  <li><strong>Right to Know & Access:</strong> Since we do not collect personal profiles, accounts, or scan logs, we do not hold personal identification records on our visitors.</li>
  <li><strong>Right to Deletion:</strong> Any local scan state is cleared upon refreshing the page or clearing your browser storage.</li>
  <li><strong>Do Not Sell My Personal Information:</strong> We do not sell, rent, or trade your personal data. Advertising partners handle cookie preferences through the opt-out links provided above.</li>
</ul>

<h2>6. Data Security & Storage</h2>
<p>The website is deployed over secure HTTPS encryption (TLS 1.3). Static assets are served via global edge CDNs. We do not maintain server-side session databases or personal data caches.</p>

<h2>7. Policy Updates & Contact</h2>
<p>We may update this Privacy Policy periodically to reflect technological changes or regulatory requirements. For privacy inquiries or data rights requests, please contact our data controller at <a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>.</p>
`.trim(),
    zh: `
<h2>1. 本地检测架构 — 零数据上传承诺</h2>
<p><strong>Fuck Claude</strong> 上的所有客户端指纹检测与环境风控评估均 100% 在你的浏览器本地内存中运行。你的检测结果、命中的区域设置信号、WebRTC 探测到的网络信息以及最终计算出的风险分，<strong>绝不会上传</strong>到我们的服务器，不会存入任何远程数据库，更不会分享或出售给任何第三方。</p>

<h2>2. Google AdSense 与第三方广告 Cookie 说明</h2>
<p>本站使用 <strong>Google AdSense</strong> 展示广告。Google 及第三方广告合作伙伴会使用 Cookie、网络信标和类似技术，根据用户对本站及互联网上其他网站的历史访问记录投放与个性化广告：</p>
<ul>
  <li>包括 Google 在内的第三方供应商会使用 Cookie，根据用户此前对本网站或其他网站的访问情况投放广告。</li>
  <li>Google 对广告 Cookie（包括 DoubleClick / DART Cookie）的使用，使其及合作伙伴能够根据用户对本网站和/或互联网上其他网站的访问向用户投放个性化广告。</li>
  <li>第三方广告供应商和广告联盟也可能在本站投放广告。详见 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google 如何使用来自使用其服务的网站或应用的信息</a>。</li>
  <li>你可以随时访问 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google 广告设置</a> 停用个性化广告。</li>
  <li>你还可以访问 <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds.info</a> 或 <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices</a> 停用第三方供应商用于个性化广告的 Cookie。</li>
</ul>

<h2>3. Google Analytics (GA4) 匿名统计</h2>
<p>本站加载启用了 IP 匿名化的 Google Analytics 4 (GA4)，用于统计完全匿名的宏观访问数据（如页面浏览量、引荐来源、浏览器类型及粗略国家地区）。这些统计仅用于评估内容质量和优化网站体验。Analytics 系统与本地检测工具完全隔离，不会接收任何具体的扫描结果或设备指纹详情。</p>

<h2>4. WebRTC STUN 探测机制</h2>
<p>在进行可选的 WebRTC 泄露检测时，浏览器会短暂与公共 STUN（NAT 会话周转实用程序）服务器建立握手以发现本地与公网 ICE 候选。这是标准的客户端 WebRTC 探测行为，获取到的候选信息仅在浏览器本地进行对比分析，不会发送至后端服务器。</p>

<h2>5. 用户隐私权益（GDPR 与 CCPA / CPRA 合规）</h2>
<p>我们严格尊重包括欧盟/英国通用数据保护条例（GDPR）与美国加州消费者隐私法案（CCPA / CPRA）在内的全球隐私保护标准：</p>
<ul>
  <li><strong>知情权与访问权：</strong>由于本站不设用户账号、不收集个人身份信息、不记录检测日志，我们并不持有任何访问者的个人档案。</li>
  <li><strong>删除权：</strong>本地扫描状态在刷新网页或清除浏览器缓存后即彻底销毁。</li>
  <li><strong>不兜售个人信息承诺：</strong>我们绝不兜售、出租或交易用户的个人信息。广告合作伙伴的 Cookie 偏好可通过上方提供的渠道进行自主管理。</li>
</ul>

<h2>6. 数据安全与传输</h2>
<p>本站全站强制启用 HTTPS（TLS 1.3）安全传输协议，静态资源由全球边缘 CDN 节点加速分发。我们不设立任何服务端用户会话库或敏感数据持久化组件。</p>

<h2>7. 政策更新与隐私咨询</h2>
<p>本隐私政策可能会随技术方案迭代或法律法规要求适时修订。如对隐私保护有任何疑问或请求，欢迎通过邮件联系：<a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>。</p>
`.trim(),
  },

  about: {
    en: `
<h2>Who We Are</h2>
<p><strong>${SITE_AUTHOR.name}</strong> — ${SITE_AUTHOR.bio.en}</p>

<h2>What Fuck Claude Is</h2>
<p><strong>Fuck Claude</strong> is an open-source technical diagnostic tool and educational knowledge base. It was developed to help software engineers, researchers, and global developers analyze how modern AI client software (specifically Anthropic's Claude Code and Claude web interfaces) inspects system environments and performs locale fingerprinting.</p>
<p>Through ten distinct browser-accessible signals — including system timezone, language order, Chinese core fonts, hardware vendor fonts, WebRTC candidate leaks, domestic browser engines, device vendor attributes, Intl locale resolution, UTC offset, and emoji glyph metrics — our open scanner provides a transparent, weighted 0–100 risk score and clear debugging recommendations.</p>

<h2>Editorial Standards & Research Methodology</h2>
<p>All content published on Fuck Claude adheres to rigorous software engineering and technical verification standards:</p>
<ul>
  <li><strong>Empirical Reverse-Engineering:</strong> Our guides and scoring weights are grounded in reproducible reverse-engineering analyses of publicly distributed binaries, prompt injection diagnostics, and open-source network captures.</li>
  <li><strong>Continuous Validation:</strong> When Anthropic publishes updates, modifies model deprecation schedules, adjusts API rate limits, or updates terms of service, our team verifies and updates the corresponding <a href="/guides/">Anti-Ban Guides</a> and <a href="/news/">Claude News</a> archive.</li>
  <li><strong>Peer Review & Open Source Transparency:</strong> The entire website, detection algorithms, and guide repositories are open source under the MIT License on <a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">GitHub</a>. Community feedback and pull requests undergo technical review before merging.</li>
</ul>

<h2>Technical Capabilities & Scope Limitations</h2>
<p>Our browser scanner measures indicators that a client-side web application can legitimately observe. However, it represents an educational simulation rather than Anthropic's proprietary backend risk infrastructure:</p>
<ul>
  <li>Anthropic's complete risk engine incorporates server-side signals such as IP autonomous system number (ASN) classification, datacenter vs residential reputation scores, payment-card Bank Identification Number (BIN) velocity, account lifecycle metadata, and token consumption patterns.</li>
  <li>A clean 0/100 scan score confirms that your client-side browser and OS environment exhibit no obvious leakage tells; it is not an absolute warranty against platform rate limits or administrative account reviews.</li>
</ul>

<h2>Open Source & Community Collaboration</h2>
<p>We believe in open knowledge and software transparency. The project source code is available at <a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude</a>. For technical bug reports, algorithm suggestions, or editorial corrections, visit our <a href="/contact/">contact page</a> or submit an issue on GitHub.</p>

<h2>Disclaimer of Affiliation</h2>
<p>Fuck Claude is an independent open-source educational project. It is <strong>not affiliated with, maintained by, authorized by, or endorsed by Anthropic, PBC</strong>. Claude, Claude Code, Anthropic, and associated trademarks belong to Anthropic, PBC.</p>
`.trim(),
    zh: `
<h2>网站运营与作者团队</h2>
<p><strong>${SITE_AUTHOR.name}</strong> — ${SITE_AUTHOR.bio.zh}</p>

<h2>Fuck Claude 项目概述</h2>
<p><strong>Fuck Claude</strong> 是一套面向开发者与技术研究者的开源诊断工具与深度知识库。项目旨在帮助全球开发者与科研人员深入理解现代 AI 客户端（特别是 Anthropic 的 Claude Code 与 Web 界面）如何对运行环境进行区域指纹识别与风控检测。</p>
<p>通过检测系统时区、浏览器语言优先级、中文字体集、国产厂商专属字体、WebRTC 候选泄漏、国产浏览器引擎、硬件设备属性、Intl 区域解析、UTC 偏移量以及 Emoji 渲染等十项核心指标，本站提供透明的 0–100 加权风控分值及针对性的纯化配置建议。</p>

<h2>编辑准则与研究方法论</h2>
<p>Fuck Claude 知识库与动态资讯遵循严格的软件工程与技术验证准则：</p>
<ul>
  <li><strong>实证逆向分析：</strong>所有防封指南与指纹权重均基于公开可复现的二进制逆向分析、Prompt 注入测试及抓包协议分析，杜绝道听途说与虚假信息。</li>
  <li><strong>持续跟踪与校验：</strong>每当 Anthropic 调整地区政策、上线新模型架构（如 Claude 3.7 Sonnet 混合推理）、推行文本水印或更新 API 速率限制，团队均会第一时间在 <a href="/zh/guides/">防封指南</a> 与 <a href="/zh/news/">最新动态</a> 中同步实测结论与应对策略。</li>
  <li><strong>开源透明与同行评审：</strong>本站的全部代码、评分算法及指南文稿均在 <a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">GitHub</a> 上基于 MIT 协议完全开源，接受全球开发者的共同审查与改进。</li>
</ul>

<h2>技术范围与能力边界说明</h2>
<p>本站检测器衡量的是常规 Web 页面所能合法读取的客户端与操作系统特征。开发者需知悉其技术边界：</p>
<ul>
  <li>Anthropic 完整的后端风控体系还包括 IP 自治系统（ASN）评级、数据中心与住宅 IP 信誉库、支付卡发卡行 BIN 码与欺诈风控模型、账号注册生命周期及 API 异常调用模式等。</li>
  <li>获得低风险评分意味着你的客户端本地环境不存在明显的指纹泄露；但这不能替代合规的 IP 质量与正规支付手段，亦不构成对任何第三方账号状态的绝对保证。</li>
</ul>

<h2>开源协议与社区协作</h2>
<p>我们坚信开源透明的力量。项目仓库地址：<a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude</a>。欢迎通过 <a href="/zh/contact/">联系我们</a> 页面或 GitHub Issues 提交技术探讨、算法优化建议及勘误。</p>

<h2>独立声明</h2>
<p>Fuck Claude 为独立的开源技术与教育研究项目，<strong>与 Anthropic, PBC 无任何隶属、赞助、授权或官方关联</strong>。Claude、Claude Code、Anthropic 及其相关标识均为 Anthropic, PBC 的注册商标或许可财产。</p>
`.trim(),
  },

  contact: {
    en: `
<h2>Get in Touch</h2>
<p>Whether you have technical feedback on detection signals, guide corrections, sponsorship proposals, or general inquiries, we welcome open communication. Please review our preferred channels below to ensure the fastest response.</p>

<h2>Primary Contact Channels</h2>
<ul>
  <li><strong>GitHub Issues (Recommended for Technical Feedback):</strong> For bug reports, fingerprint algorithm improvements, new environment signals, or guide errata, please open an issue at <a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude/issues</a>. GitHub provides the fastest turnaround and public tracking.</li>
  <li><strong>Direct Email:</strong> For general inquiries, privacy notices, collaboration, or sponsorship: <a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>. We endeavor to respond to legitimate inquiries within 48 business hours.</li>
  <li><strong>Social Platforms:</strong> Connect with the author on <a href="${SITE_AUTHOR.xUrl}" target="_blank" rel="noopener noreferrer">X (Twitter)</a>, Xiaohongshu, Douyin, and Jike. Platform links are available in the top navigation.</li>
</ul>

<h2>Guidelines for Reporting Signal Issues</h2>
<p>To help us diagnose and improve fingerprint accuracy, please include the following technical context when reporting false positives or detection discrepancies:</p>
<ul>
  <li>Operating System & Version (e.g., macOS Sequoia 15.3, Windows 11 24H2, Ubuntu 24.04 LTS)</li>
  <li>Browser & Version (e.g., Chrome 134, Firefox 136, Safari 18)</li>
  <li>Specific Signal ID (e.g., System timezone, Chinese vendor fonts, WebRTC leak)</li>
  <li>Observed Output vs Expected Output</li>
</ul>

<h2>Privacy and Data Requests</h2>
<p>The scanner runs in your browser and we keep no scan logs, so in most cases there is no personal data for us to export or delete. If you believe we hold information about you, or you want to ask about cookies used by Google AdSense or Google Analytics on this site, email us with the subject line "Privacy request". See the <a href="/privacy/">Privacy Policy</a> for details and opt-out links.</p>

<h2>Advertising and Sponsorship</h2>
<p>Ads on this site are served by Google AdSense, and sponsor placements are labeled as sponsored. For sponsorship inquiries, email us with your product, the regions you target, and the placement you are interested in. Sponsorship never changes the content of our guides or the detector's scoring.</p>

<h2>What We Cannot Help With</h2>
<p>Fuck Claude is an independent project, not Anthropic. We cannot restore, unlock or review Claude accounts, process refunds, or change anything on your Anthropic subscription. For those, contact <a href="https://support.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic Support</a>. Our <a href="/guides/account-appeal-and-recovery-sop/">appeal guide</a> explains how the official appeal process works.</p>

<h2>Frequently Answered Topics</h2>
<p>Before sending an inquiry, please note that common questions regarding timezone mechanics, virtual card BIN selection, API prompt caching, and account appeal templates are comprehensively covered in our <a href="/guides/">Anti-Ban Knowledge Base</a> and homepage FAQ.</p>
`.trim(),
    zh: `
<h2>联系与反馈</h2>
<p>无论是关于指纹检测算法的技术建议、指南内容勘误、商务与赞助合作，还是普通咨询，我们都非常欢迎。请参考下方渠道以获得最及时的处理。</p>

<h2>主要联系渠道</h2>
<ul>
  <li><strong>GitHub Issues（技术反馈首选）：</strong>针对 Bug 报告、指纹算法优化、新环境特征补充或指南勘误，请在 <a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude/issues</a> 提交 Issue。这是响应最迅速、最透明的沟通方式。</li>
  <li><strong>官方电子邮件：</strong>一般咨询、隐私合规请求、技术交流与赞助合作，请发送邮件至：<a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>。我们通常会在 48 个工作小时内给予回复。</li>
  <li><strong>社交平台：</strong>欢迎在 <a href="${SITE_AUTHOR.xUrl}" target="_blank" rel="noopener noreferrer">X (Twitter)</a>、小红书、抖音与即刻关注作者（链接见顶部导航）。</li>
</ul>

<h2>反馈指纹检测问题时的建议</h2>
<p>为便于我们快速复现和修正检测算法，提交误报或检测异常时建议附带以下环境信息：</p>
<ul>
  <li>操作系统及具体版本（例如：macOS Sequoia 15.3、Windows 11 24H2、Ubuntu 24.04）</li>
  <li>浏览器及内核版本（例如：Chrome 134、Firefox 136、Safari 18）</li>
  <li>发生异常的具体检测项（如：系统时区、国产厂商字体、WebRTC 泄露等）</li>
  <li>实际检测值与预期值的差异说明</li>
</ul>

<h2>隐私与数据请求</h2>
<p>检测器完全在你的浏览器内运行，我们不保存检测日志，因此大多数情况下我们并不持有可以导出或删除的个人数据。如果你认为我们保存了与你有关的信息，或想咨询本站 Google AdSense、Google Analytics 使用的 Cookie，请发邮件并在标题注明“隐私请求”。详细说明与退出个性化广告的方式见 <a href="/zh/privacy/">隐私政策</a>。</p>

<h2>广告与赞助</h2>
<p>本站广告由 Google AdSense 投放，赞助位会明确标注为赞助内容。赞助合作请发邮件说明产品、目标地区和希望的展示位置。赞助不会影响指南内容或检测器的评分。</p>

<h2>我们无法处理的事项</h2>
<p>Fuck Claude 是独立项目，不是 Anthropic。我们无法恢复、解封或审核 Claude 账号，无法处理退款，也无法修改你的 Anthropic 订阅。这些问题请联系 <a href="https://support.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic 官方支持</a>。官方申诉流程可参考本站的 <a href="/zh/guides/account-appeal-and-recovery-sop/">申诉指南</a>。</p>

<h2>常见疑问先行解答</h2>
<p>在致信之前，关于时区判定原理、虚拟卡 BIN 挑选、API Prompt Cache 优化实战以及封号英文申诉模板等问题，在 <a href="/zh/guides/">防封指南知识库</a> 和首页常见问题中均有详尽阐述，建议先查阅参考。</p>
`.trim(),
  },

  terms: {
    en: `
<h2>1. Acceptance of Terms</h2>
<p>By accessing or using <strong>Fuck Claude</strong> (the "Website", "Service", or "Tool"), you agree to be bound by these Terms of Service ("Terms") and our <a href="/privacy/">Privacy Policy</a>. If you do not agree to these Terms, please discontinue using the Service immediately.</p>

<h2>2. Educational & Research Purpose</h2>
<p>Fuck Claude is an independent open-source educational and technical research tool. All tools, risk calculators, fingerprint scanners, and knowledge base articles are published strictly for educational, security auditing, and technical research purposes. Nothing on this website constitutes legal, financial, or commercial advice.</p>

<h2>3. User Responsibility & Compliance</h2>
<p>You acknowledge and agree that:</p>
<ul>
  <li>You are solely responsible for how you configure your local devices, networks, operating systems, and developer environments.</li>
  <li>You remain solely responsible for your use of third-party AI services (including Anthropic's Claude, Claude Code, and Claude API) and for complying with their applicable Terms of Service, Acceptable Use Policies, and your local laws.</li>
  <li>Fuck Claude does not guarantee that following any checklist or guide will prevent account suspension, rate-limiting, or administrative action by third-party service providers.</li>
</ul>

<h2>4. Disclaimer of Warranties</h2>
<p>THE SERVICE AND ALL CONTENT, SCANNERS, ARTICLES, AND SCRIPTS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.</p>

<h2>5. Limitation of Liability</h2>
<p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE AUTHORS, MAINTAINERS, OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, ACCOUNT SUSPENSION, OR SERVICE DISRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICE OR GUIDES.</p>

<h2>6. Intellectual Property & Open Source Licensing</h2>
<p>The source code of Fuck Claude is licensed under the <strong>MIT License</strong>. You may inspect, modify, and distribute the code in accordance with the MIT License terms, provided that original copyright notices and permission notices are retained.</p>

<h2>7. Third-Party Trademarks & External Links</h2>
<p>All third-party trademarks, service marks, product names, and company names mentioned on this Website (including "Claude", "Anthropic", "Google", "Cloudflare") are the property of their respective owners. Mention of third-party products or services does not imply endorsement, affiliation, or sponsorship. We are not responsible for the content, privacy practices, or availability of external third-party websites linked from our pages.</p>

<h2>8. Advertising & Monetization</h2>
<p>This Website displays third-party advertisements served by Google AdSense to offset server hosting and domain maintenance costs. Advertisements are clearly separated from editorial content. We do not endorse the specific products or services advertised by third-party ad networks.</p>

<h2>9. Modifications to the Terms</h2>
<p>We reserve the right to revise or update these Terms at any time without prior notice. The updated version will be posted directly on this page with the effective date. Your continued use of the Website following any changes constitutes your acceptance of the modified Terms.</p>

<h2>10. Contact Information</h2>
<p>If you have any questions or concerns regarding these Terms, please contact us at <a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a> or submit an issue via our <a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
`.trim(),
    zh: `
<h2>1. 条款的接受与确认</h2>
<p>欢迎访问并使用 <strong>Fuck Claude</strong>（以下简称“本站”、“服务”或“本工具”）。一旦你访问或使用本站，即表示你已充分阅读、理解并同意受本服务条款（以下简称“本条款”）及本站 <a href="/zh/privacy/">隐私政策</a> 的约束。如果你不同意本条款的任何内容，请立即停止使用本站。</p>

<h2>2. 教育与技术研究性质</h2>
<p>Fuck Claude 是一个独立的开源教育与技术研究项目。本站提供的所有检测工具、风险估算器、指纹扫描脚本及防封知识库文章，仅供技术研究、安全审计与学习参考之用。本站任何内容均不构成法律、财务、合规或商业建议。</p>

<h2>3. 用户责任与合规守则</h2>
<p>你理解并明确同意：</p>
<ul>
  <li>你对自身设备、网络环境、操作系统及开发工具的配置与使用承担全部责任。</li>
  <li>你对使用第三方 AI 服务（包括 Anthropic 的 Claude、Claude Code 及 Claude API）的行为承担全部责任，并承诺遵守相应服务商的服务条款、使用政策及你所在地区的适用法律法规。</li>
  <li>本站无法也不保证遵循任何指南或优化建议能够完全避免第三方平台的限流、封号或风控核查。</li>
</ul>

<h2>4. 免责声明与无担保保证</h2>
<p>本服务以及所有内容、检测工具、指南文章和代码均按“现状”（AS IS）和“现有”（AS AVAILABLE）的基础提供，不附带任何明示或暗示的保证，包括但不限于对适销性、特定用途适用性、准确性及不侵权的保证。我们不保证服务不会中断、无差错或完全排除潜在漏洞。</p>

<h2>5. 责任限制</h2>
<p>在适用法律允许的最大范围内，本站作者、维护者或贡献者在任何情况下均不对因使用或无法使用本站服务、工具或指南而引起的任何间接、附带、特殊、后果性或惩罚性损害（包括但不限于数据丢失、利润损失、账号封禁或业务中断）承担赔偿责任。</p>

<h2>6. 知识产权与开源授权</h2>
<p>Fuck Claude 项目源代码基于 <strong>MIT 开源协议</strong> 发布。你可以在保留原作者版权声明和许可声明的前提下，自由查阅、修改、分发与使用本项目的代码。</p>

<h2>7. 第三方商标与外部链接</h2>
<p>本站提及的所有第三方商标、服务标志、产品名称和公司名称（包括但不限于 "Claude"、"Anthropic"、"Google"、"Cloudflare" 等）均为其各自所有者的财产。提及这些商标仅用于描述与技术指代，不代表任何隶属、认可、赞助或官方合作关系。对于本站链接的第三方外部网站内容与隐私实践，本站概不负责。</p>

<h2>8. 广告展示与运营说明</h2>
<p>本站通过 Google AdSense 展示第三方广告以维持服务器与域名基础运维成本。广告内容与本站编辑内容严格区分。我们不对第三方广告网络展示的具体产品或服务做任何形式的背书。</p>

<h2>9. 条款修改与终止</h2>
<p>我们保留随时修订或更新本服务条款的权利。更新后的条款将直接发布于本页面。你在条款更新后继续使用本站，即视为接受修订后的条款。</p>

<h2>10. 联系与反馈</h2>
<p>如对本条款有任何疑问，请通过电子邮件联系我们：<a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>，或在 <a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">GitHub 仓库</a> 提交 Issue。</p>
`.trim(),
  },
};
