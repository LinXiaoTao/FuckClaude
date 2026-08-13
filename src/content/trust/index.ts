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
<p>Fuck Claude is an open-source browser tool that estimates whether your environment looks like a "Claude China user" based on public reverse-engineering reports of Claude Code fingerprinting. The companion <a href="/guides/">Anti-Ban Guides</a> knowledge base explains risk mechanisms, environment cleanup, payment safety, and appeal workflows in depth.</p>

<h2>Source code</h2>
<p>The project is open source under the MIT License: <a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude</a>.</p>

<h2>Disclaimer</h2>
<p>This site is <strong>not</strong> affiliated with, endorsed by, or an official product of Anthropic. All content is for educational and reference purposes only, based on publicly available reverse-engineering research — not insider or official documentation.</p>
`.trim(),
    zh: `
<h2>网站运营者</h2>
<p><strong>${SITE_AUTHOR.name}</strong> — ${SITE_AUTHOR.bio.zh}</p>

<h2>Fuck Claude 是什么</h2>
<p>Fuck Claude 是一款开源浏览器工具,基于 Claude Code 指纹检测的公开逆向报告,估算你的环境是否像「Claude 中国用户」。配套的 <a href="/zh/guides/">防封指南</a> 知识库深入讲解风控机制、环境纯化、支付安全与申诉流程。</p>

<h2>源代码</h2>
<p>项目基于 MIT 协议开源:<a href="${SITE_AUTHOR.githubUrl}/FuckClaude" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude</a>。</p>

<h2>免责声明</h2>
<p>本站<strong>与 Anthropic 无任何关联</strong>,未获其背书,亦非官方产品。所有内容仅供教育与参考,基于公开逆向研究 —— 并非内部或官方文档。</p>
`.trim(),
  },

  contact: {
    en: `
<h2>Email</h2>
<p>General inquiries and privacy requests: <a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a></p>

<h2>GitHub Issues</h2>
<p>Bug reports, feature requests, and technical discussion: <a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude/issues</a></p>

<h2>Social</h2>
<p>Find ${SITE_AUTHOR.name} on <a href="${SITE_AUTHOR.xUrl}" target="_blank" rel="noopener noreferrer">X (Twitter)</a>, Xiaohongshu, Douyin, and Jike — links in the site header.</p>
`.trim(),
    zh: `
<h2>电子邮件</h2>
<p>一般咨询与隐私请求:<a href="mailto:${SITE_AUTHOR.email}">${SITE_AUTHOR.email}</a></p>

<h2>GitHub Issues</h2>
<p>Bug 反馈、功能建议与技术讨论:<a href="${SITE_AUTHOR.githubUrl}/FuckClaude/issues" target="_blank" rel="noopener noreferrer">${SITE_AUTHOR.github}/FuckClaude/issues</a></p>

<h2>社交媒体</h2>
<p>在 <a href="${SITE_AUTHOR.xUrl}" target="_blank" rel="noopener noreferrer">X (Twitter)</a>、小红书、抖音与即刻找到 ${SITE_AUTHOR.name} —— 链接见网站顶部导航。</p>
`.trim(),
  },
};
