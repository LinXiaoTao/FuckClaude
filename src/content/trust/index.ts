import { SITE_AUTHOR } from '../../config/site';

export type TrustPageId = 'privacy' | 'about' | 'contact';

export const TRUST_CONTENT: Record<TrustPageId, { en: string; zh: string }> = {
  privacy: {
    en: `
<h2>Local scan — your data stays on your device</h2>
<p>Every fingerprint check runs entirely in your browser. Scan results, detected signals, and risk scores are never uploaded to our servers or shared with third parties as part of the scan itself.</p>

<h2>Google Analytics</h2>
<p>We load Google Analytics (GA4) to collect anonymous page-view statistics — which pages are visited, approximate geography, and browser type. Analytics does not receive your scan results or fingerprint data.</p>

<h2>Google AdSense</h2>
<p>This site displays ads through Google AdSense. Google and its partners may use cookies or similar technologies to serve ads, measure ad performance, and (depending on your region and ad settings) show personalized or non-personalized advertising. You can manage ad personalization through <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or your browser's cookie controls.</p>

<h2>WebRTC STUN probing</h2>
<p>During the optional WebRTC leak check, your browser may briefly connect to a public STUN server to gather ICE candidates. This is standard WebRTC behavior and does not send your full scan report anywhere.</p>

<h2>Privacy requests</h2>
<p>For privacy-related questions or requests, contact <a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>.</p>
`.trim(),
    zh: `
<h2>本地检测 — 数据不离开你的设备</h2>
<p>所有指纹检测完全在浏览器本地运行。扫描结果、命中信号与风险分数不会作为检测过程的一部分上传到我们的服务器,也不会因此分享给第三方。</p>

<h2>Google Analytics</h2>
<p>本站加载 Google Analytics (GA4) 以统计匿名页面访问量 —— 包括访问页面、大致地区与浏览器类型。Analytics 不会收到你的扫描结果或指纹数据。</p>

<h2>Google AdSense</h2>
<p>本站通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie 或类似技术投放广告、衡量广告效果,并根据你的地区与广告设置展示个性化或非个性化广告。你可以通过 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google 广告设置</a> 或浏览器 Cookie 控制进行管理。</p>

<h2>WebRTC STUN 探测</h2>
<p>在可选的 WebRTC 泄露检测中,浏览器可能短暂连接公共 STUN 服务器以收集 ICE 候选。这是标准 WebRTC 行为,不会将你的完整扫描报告发送到任何地方。</p>

<h2>隐私相关请求</h2>
<p>如有隐私相关问题或请求,请联系 <a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>。</p>
`.trim(),
  },

  about: {
    en: `
<h2>Who runs this site</h2>
<p><strong>${SITE_AUTHOR.name}</strong> — ${SITE_AUTHOR.bio.en}</p>

<h2>What Fuck Claude is</h2>
<p>Fuck Claude is an open-source, browser-based tool that estimates whether your environment looks like a "Claude China user", based on public reverse-engineering reports of how Claude Code fingerprints traffic. Run it once and it scans ten locale and network signals — timezone, language, installed Chinese fonts, vendor fonts, WebRTC leaks, Chinese browsers and device brands, Intl locale, UTC+8 offset and emoji style — then combines them into a weighted 0–100 risk score with a plain-language verdict. Everything happens in your browser; you can read a full breakdown on the <a href="/">home page</a>.</p>

<h2>Why this site exists</h2>
<p>Anthropic does not officially serve mainland China, and a wave of developers who reached Claude through proxies found their accounts silently rate-limited or banned — often without knowing which part of their setup gave them away. The reverse-engineering discovery that Claude Code was encoding a "China user" verdict into its system prompt made the problem concrete but hard to act on for non-experts. This site turns that research into something you can actually check: a one-click scan that shows you, signal by signal, exactly what your environment is leaking.</p>

<h2>How we research this</h2>
<p>The scoring model is built from publicly available reverse-engineering write-ups and community ban reports, not from any insider or official source. Each signal is weighted by how strongly it correlates with the reported mechanism: the system timezone carries the most weight because it maps one-to-one onto Claude's real check, while softer fingerprints like emoji rendering style carry only a few points. When new findings or community reports emerge, the weights and the <a href="/guides/">Anti-Ban Guides</a> are updated to match.</p>

<h2>What the tool can and cannot tell you</h2>
<p>The scan measures only what a web page can see about your browser and operating system. It is a useful proxy, but it is <strong>not</strong> the exact check Anthropic runs. Their real risk model also weighs your IP reputation, payment-card BIN, account age and usage patterns — none of which are visible to a static site. Treat a low score as "no obvious local tells", not as a guarantee against a ban.</p>

<h2>Data & privacy commitment</h2>
<p>Every scan runs entirely on your device. Detected signals, matched fingerprints and risk scores are never uploaded to our servers as part of the scan, and never sold or shared. The site does load Google Analytics for anonymous page-view statistics and Google AdSense for advertising; neither receives your scan results. The full details are in our <a href="/privacy/">privacy policy</a>.</p>

<h2>Source code</h2>
<p>The project is open source under the MIT License: <a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude</a>. Issues and pull requests are welcome — see the <a href="/contact/">contact page</a> for the fastest ways to reach us.</p>

<h2>Disclaimer</h2>
<p>This site is <strong>not</strong> affiliated with, endorsed by, or an official product of Anthropic. All content is for educational and reference purposes only, based on publicly available reverse-engineering research — not insider or official documentation. You remain responsible for how you use Claude and for complying with Anthropic's policies and your local laws.</p>
`.trim(),
    zh: `
<h2>网站运营者</h2>
<p><strong>${SITE_AUTHOR.name}</strong> — ${SITE_AUTHOR.bio.zh}</p>

<h2>Fuck Claude 是什么</h2>
<p>Fuck Claude 是一款开源的浏览器工具,基于 Claude Code 如何给流量打指纹的公开逆向报告,估算你的环境是否像「Claude 中国用户」。运行一次,它会扫描十项区域与网络信号 —— 时区、语言、已安装中文字体、厂商字体、WebRTC 泄露、国产浏览器与设备品牌、Intl locale、UTC+8 偏移与 emoji 风格 —— 再加权得出 0–100 的风险分与一句大白话结论。全过程都在你的浏览器里完成;完整拆解可在<a href="/zh/">首页</a>查看。</p>

<h2>为什么会有这个网站</h2>
<p>Anthropic 并不正式面向中国大陆提供服务,而一批通过中转访问 Claude 的开发者发现自己的账号被悄悄限流或封禁 —— 却往往不知道到底是配置里的哪一环出卖了自己。当逆向分析揭示 Claude Code 会把「中国用户」的判定编码进 system prompt 时,问题变得具体了,但对非专业用户来说仍然难以下手。本站把这些研究变成你真正能检查的东西:一键扫描,逐项告诉你环境究竟泄露了什么。</p>

<h2>我们如何做研究</h2>
<p>评分模型取材自公开的逆向分析文章与社区封号反馈,并非来自任何内部或官方渠道。每项信号的权重取决于它与被披露机制的相关强度:系统时区权重最高,因为它与 Claude 的真实判定一一对应;而 emoji 渲染风格这类较弱的指纹只占几分。每当出现新的发现或社区反馈,权重与<a href="/zh/guides/">防封指南</a>都会随之更新。</p>

<h2>这个工具能告诉你什么、不能告诉你什么</h2>
<p>扫描只衡量网页能看到的浏览器与操作系统信息。它是一个有用的参考,但<strong>并不是</strong> Anthropic 实际运行的那套检查。他们真实的风控模型还会权衡你的 IP 信誉、支付卡 BIN、账号资历与使用模式 —— 这些静态网站都看不到。请把低分理解为「没有明显的本地破绽」,而非「一定不会被封」的保证。</p>

<h2>数据与隐私承诺</h2>
<p>每一次扫描都完全在你的设备上运行。检测到的信号、命中的指纹与风险分数不会作为扫描的一部分上传到我们的服务器,也不会被出售或分享。网站确实会加载 Google Analytics 统计匿名页面访问量、并通过 Google AdSense 展示广告;二者都不会收到你的扫描结果。完整说明见<a href="/zh/privacy/">隐私政策</a>。</p>

<h2>源代码</h2>
<p>项目基于 MIT 协议开源:<a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude</a>。欢迎提交 Issue 与 PR —— 最快的联系方式见<a href="/zh/contact/">联系页面</a>。</p>

<h2>免责声明</h2>
<p>本站<strong>与 Anthropic 无任何关联</strong>,未获其背书,亦非官方产品。所有内容仅供教育与参考,基于公开逆向研究 —— 并非内部或官方文档。你仍需为自己如何使用 Claude、以及是否遵守 Anthropic 政策与当地法律负责。</p>
`.trim(),
  },

  contact: {
    en: `
<h2>Get in touch</h2>
<p>Questions about the scan, a signal that looks wrong, a guide correction, or a sponsorship enquiry — all of it is welcome. Pick whichever channel below fits best; for anything technical, a GitHub Issue gets the fastest and most trackable response.</p>

<h2>Email</h2>
<p>General inquiries, sponsorship, and privacy requests: <a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>. To help us reply quickly, include what you were doing, which page you were on, and — for a scan question — your browser and operating system.</p>

<h2>GitHub Issues</h2>
<p>Bug reports, feature requests, signal-accuracy feedback, and technical discussion: <a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude/issues</a>. Because the project is open source, this is also the best place to propose changes or read what others have reported.</p>

<h2>Social</h2>
<p>Find ${SITE_AUTHOR.name} on <a href="${SITE_AUTHOR.xUrl}" target="_blank" rel="noopener noreferrer">X (Twitter)</a>, Xiaohongshu, Douyin, and Jike — links are in the site header. Social channels are good for quick questions and updates, but please use email or GitHub for anything that needs a paper trail.</p>

<h2>Before you write</h2>
<p>Many common questions — how the timezone signal works, why the API result differs from the browser scan, and how to lower your score — are already answered on the <a href="/">home page</a> FAQ and throughout the <a href="/guides/">Anti-Ban Guides</a>. It is worth a quick look first.</p>
`.trim(),
    zh: `
<h2>联系我们</h2>
<p>无论是关于检测的疑问、某项信号看起来不对、指南需要勘误,还是赞助合作 —— 都欢迎。请从下面挑选最合适的渠道;技术类问题走 GitHub Issue 响应最快、也最方便追踪。</p>

<h2>电子邮件</h2>
<p>一般咨询、赞助与隐私请求:<a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a>。为便于我们尽快回复,请附上你当时在做什么、在哪个页面,若是检测相关问题,也请说明你的浏览器与操作系统。</p>

<h2>GitHub Issues</h2>
<p>Bug 反馈、功能建议、信号准确性反馈与技术讨论:<a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude/issues</a>。项目开源,这里也是提出改动、或查看他人已反馈问题的最佳去处。</p>

<h2>社交媒体</h2>
<p>在 <a href="${SITE_AUTHOR.xUrl}" target="_blank" rel="noopener noreferrer">X(推特)</a>、小红书、抖音与即刻找到 ${SITE_AUTHOR.name} —— 链接见网站顶部导航。社交渠道适合快速提问与获取更新,但需要留痕的事项请走邮件或 GitHub。</p>

<h2>写信之前</h2>
<p>很多常见问题 —— 时区信号如何运作、为什么 API 结果与浏览器检测不同、如何降低分数 —— 在<a href="/zh/">首页</a>的常见问题以及<a href="/zh/guides/">防封指南</a>里已有解答,建议先快速看一眼。</p>
`.trim(),
  },
};
