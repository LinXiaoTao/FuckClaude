/**
 * Bilingual (English / Simplified-Chinese) copy for the whole site.
 * Isomorphic + framework-free so the client detect script can import it too.
 */

export const languages = {
  en: 'English',
  zh: '中文',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'meta.title': 'Fuck Claude | Are You a Claude "China User"?',
    'meta.description':
      'One-click check of your browser timezone, language, Chinese fonts and locale to see if Claude Code would flag you as a China user. 100% local, nothing uploaded.',

    'nav.title': 'Fuck Claude',
    'nav.guides': 'Anti-Ban Guides',
    'nav.news': 'News',
    'nav.extension': 'Extension',
    'nav.about': 'About',
    'nav.home': 'Home',

    'news.title': 'Claude Latest News',
    'news.sub':
      'Curated updates on Claude products, API changes, regional policy, and community-reported security trends.',
    'news.note':
      'Items are manually curated from official Anthropic announcements and community reports. Links open external sources.',
    'news.backHome': '← Back to Home',
    'news.viewAll': 'View all news',
    'news.source': 'Source',

    'community.title': 'Community Anti-Ban Field Reports',
    'community.sub':
      'Real-world tips from X (Twitter) on Claude bans, appeals, payments, and Claude Code — curated with direct links to original posts.',
    'community.viewAll': 'View all field reports',
    'community.takeaway': 'Takeaway:',
    'community.viewOnX': 'View original on X (Twitter)',
    'community.externalHint': 'Opens external link in a new tab',

    'credit': 'Built with Claude Fable 5',

    'guides.title': 'Claude Anti-Ban & Safety Knowledge Base',
    'guides.sub':
      'Anthropic’s published rules summarized first, then in-depth guides on risk mechanisms, environment cleanup, payment safety, API safety, and appeal SOPs.',
    'guides.readMore': 'Read Guide',
    'guides.back': '← Back to Knowledge Base',
    'guides.backHome': '← Back to Home',
    'guides.editorial':
      'Written and maintained by LinXiaoTao, an independent developer. Guides are updated as new reverse-engineering findings and community reports emerge. This knowledge base is educational and for reference — not official Anthropic documentation.',
    'guides.intro':
      'This knowledge base collects what is publicly known about how Claude Code fingerprints users and how bans happen, from Unicode steganography and Anthropic’s multi-layer risk model to environment cleanup, account and payment safety, and what to do once an account is flagged. Statements about Anthropic’s rules link to official pages and carry a verification date. Everything else comes from community reports and public reverse-engineering and is labeled as such. Every article is bilingual and can be read on its own or as part of a path below.',
    'guides.paths.title': 'Where to start',
    'guides.paths.sub': 'Not sure which article to open first? Pick the path that matches your situation.',
    'guides.path0.title': '0 · Quick anti-ban checklist',
    'guides.path0.desc': 'Need the essentials fast? Account safety, API limits, and frequency rules in one short guide.',
    'guides.path0.cta': 'Open the checklist',
    'guides.path1.title': '1 · Understand the risk',
    'guides.path1.desc': 'New here? Start with how the fingerprinting and 4-layer risk model actually work before you change anything.',
    'guides.path1.cta': 'Read the risk model',
    'guides.path2.title': '2 · Clean your environment',
    'guides.path2.desc': 'Sync your timezone, isolate Chinese fonts, stop WebRTC leaks and set up a residential IP the right way.',
    'guides.path2.cta': 'Clean up your setup',
    'guides.path3.title': '3 · Register & pay safely',
    'guides.path3.desc': 'Choose a verification number, use a card type Claude accepts and align your billing details with the card before you subscribe.',
    'guides.path3.cta': 'Register the safe way',
    'guides.path4.title': '4 · Use Claude Code & the API safely',
    'guides.path4.desc': 'Keep the CLI and browser consistent, choose relays that preserve prompt caching, and stay inside rate limits.',
    'guides.path4.cta': 'Configure Claude Code',
    'guides.path5.title': '5 · Recover a banned account',
    'guides.path5.desc': 'Already flagged? Diagnose the ban type, send a fact-based English appeal, or fail over to an alternative model.',
    'guides.path5.cta': 'Start recovery',
    'guides.related': 'Related reading',
    'guides.allGuides': 'Browse all guides',
    'guides.catalog.title': 'All guides by topic',
    'guides.catalog.nav': 'Jump to a topic',
    'guides.readTime': '{n} min read',
    'guides.toc': 'On this page',
    'guides.compliance':
      'Educational and diagnostic content: it explains how risk signals work so you can understand and troubleshoot your own setup. It is not advice to break any rules. Follow Anthropic’s Usage Policy and Terms of Service and the laws where you live; if your region is not supported, use an officially available alternative.',
    'guides.sources': 'Sources',
    'guides.verified': 'Official facts checked on {date}.',
    'guides.unverified': 'Based on community reports and public reverse-engineering. Not checked against Anthropic documentation item by item; confirm important details on the official Help Center.',
    'guides.tableLabel': 'Scrollable table',
    'guides.news.title': 'Policy & risk-control updates',
    'guides.news.sub': 'Recent region, policy, and enforcement changes that affect accounts.',

    'rules.title': 'Official rules at a glance',
    'rules.sub': 'What Anthropic states publicly. Last checked {date}. Everything else in these guides is community experience or reverse-engineering and is labeled as such.',
    'rules.source': 'Source',

    'community.relatedGuide': 'Related guide',

    'hero.title': 'Are you a Claude “China user”?',
    'hero.badge.local': '100% local scan',
    'hero.badge.noUpload': 'Results never uploaded',
    'hero.badge.openSource': 'Open source',
    'hero.scoreOutOf': '/ 100',

    'sponsors.label': 'Sponsored',
    'sponsors.cta': 'Want to be listed here?',

    'cnModels.label': 'Chinese AI models',
    'cnModels.slogan': 'Chinese models are simply better',

    'band.low.title': 'Low risk',
    'band.low.desc': '🐶You are not a “Claude China user”🐶',
    'band.medium.title': 'Medium risk',
    'band.medium.desc': '🐶You are probably a “Claude China user”🐶',
    'band.high.title': 'High risk',
    'band.high.desc': '🐶You are definitely a “Claude China user”🐶',
    'band.high.extra': 'But you still have',
    'band.high.extraSep': ', ',
    'band.high.extraSepLast': ' and ',

    'signal.timezone.name': 'System timezone',
    'signal.timezone.desc':
      'Intl.DateTimeFormat exposes the same OS timezone Claude Code reads; compared against Asia/Shanghai, Asia/Urumqi and other China zones.',
    'signal.language.name': 'Browser language',
    'signal.language.desc':
      'navigator.languages — zh-CN / Simplified Chinese at the top of the list scores highest.',
    'signal.fonts.name': 'Installed Chinese fonts',
    'signal.fonts.desc':
      'Canvas width-probing for Simplified / Traditional Chinese fonts such as Microsoft YaHei and PingFang SC.',
    'signal.vendorFonts.name': 'Chinese vendor fonts',
    'signal.vendorFonts.desc':
      'Canvas probing for fonts shipped by Chinese vendors or software — MiSans, HarmonyOS Sans, OPPO Sans, WPS Founder faces. Any hit is a strong tell.',
    'signal.cnBrowser.name': 'Chinese browser / WebView',
    'signal.cnBrowser.desc':
      'User agent and UA-CH brands matched against WeChat, QQ, Quark, UC, Baidu and other Chinese browsers or in-app WebViews.',
    'signal.deviceVendor.name': 'Chinese-brand device',
    'signal.deviceVendor.desc':
      'UA-CH device model (navigator.userAgentData) and UA matched against HarmonyOS, Huawei, Xiaomi, OPPO, vivo and other Chinese brands.',
    'signal.intlLocale.name': 'Intl locale',
    'signal.intlLocale.desc':
      'The locale your browser resolves for date and number formatting.',
    'signal.timezoneOffset.name': 'Timezone offset',
    'signal.timezoneOffset.desc': 'Whether getTimezoneOffset() equals UTC+8.',
    'signal.webrtcLeak.name': 'WebRTC IP leak',
    'signal.webrtcLeak.desc':
      'RTCPeerConnection probing for local or real public IP candidate leaks through STUN.',
    'signal.emoji.name': 'Emoji rendering style',
    'signal.emoji.desc':
      'OS vendor guessed from the user agent; a weak, loosely correlated signal.',

    'scan.detecting': 'Checking',
    'scan.ready': 'Ready to scan',
    'result.hitsTitle': 'Matched signals',
    'result.noHits': 'No strong China signals matched. Low risk.',

    'signals.title': 'What gets scanned',
    'signals.sub': 'Ten locale & network fingerprints, weighted to a 0–100 risk score.',

    'how.title': 'How the check works',
    'how.p1':
      'When Claude Code is pointed at a proxy endpoint via ANTHROPIC_BASE_URL, public reverse-engineering reports found it reads your operating-system timezone and the proxy hostname, then hides the verdict inside the system prompt with Unicode steganography — the date separator and four look-alike apostrophes in the “Today’s date” line encode whether you look like a China user.',
    'how.p2':
      'A web page cannot read everything Claude Code can, but the key signal is identical: this tool reads the same OS timezone, then adds nine more browser-visible fingerprints — UI language, Chinese fonts, Chinese vendor fonts, WebRTC IP leaks, Chinese browsers, device brand, Intl locale, UTC+8 offset and emoji style — into a weighted score. Signals scoring ≥0.25 count as hits; bands are Low 0–30, Medium 31–60, High 61–100.',
    'ui.weight': 'Weight',

    'why.title': 'Why Claude flags you as a “China user”',
    'why.p1':
      'Anthropic does not sell Claude in mainland China, and Claude Code was reported to treat traffic that “looks Chinese” as higher risk. The judgement is not a single toggle — it stacks several weak signals into one probability. Your system timezone is the heaviest single tell because it travels with every request and is hard to fake accidentally, but language, fonts, device brand and network all add weight on top of it.',
    'why.p2':
      'The reason a whole browser environment leaks so much is that locale settings bleed into everything: the OS timezone drives Intl and Date, your language preference sets navigator.languages and the Accept-Language header, and the fonts your OS ships with can be probed pixel by pixel through a canvas. Route Claude Code through a proxy on top of that, and the proxy hostname itself becomes another signal — reverse-engineering reports found the verdict encoded steganographically into the “Today’s date” line of the system prompt.',
    'why.p3':
      'None of these signals is decisive on its own, which is exactly why the risk is cumulative. A US timezone with a Chinese font pack and a WeChat WebView still reads as suspicious. The steganography and full risk model are broken down in the',
    'why.link1': 'steganography & 4-layer risk model guide',
    'why.p3b': ', and the practical fixes live in the',
    'why.link2': 'environment cleanup & residential IP guide',
    'why.p3c': '.',

    'reduce.title': 'How to lower your risk score',
    'reduce.sub':
      'A quick, ordered checklist. Each step maps directly to one of the weighted signals above — start from the top, because timezone and language carry the most weight.',
    'reduce.s1':
      'Set your OS timezone to a non-China zone (for example America/New_York or Europe/London) and confirm getTimezoneOffset() is no longer UTC+8. In the reverse-engineering reports this is the one signal Claude Code is said to read directly, which is why it carries the most weight in this score.',
    'reduce.s2':
      'Move zh-CN / zh-Hans off the top of your browser and OS language list so navigator.languages and Accept-Language lead with English or another non-Chinese locale.',
    'reduce.s3':
      'Isolate Chinese and vendor fonts (Microsoft YaHei, PingFang SC, MiSans, HarmonyOS Sans) — use a clean browser profile or an anti-detect browser so the canvas font probe finds nothing distinctly Chinese.',
    'reduce.s4':
      'Block WebRTC IP leaks and route through a residential IP rather than a datacenter one, so your real network and geography don’t override an otherwise clean profile.',
    'reduce.s5':
      'When using Claude Code through a relay, keep the ANTHROPIC_BASE_URL hostname neutral — avoid domains that contain flagged keywords or AI-lab names, and override the TZ environment variable if the host machine is in China.',
    'reduce.cta': 'Full step-by-step walkthroughs are in the',
    'reduce.ctaLink': 'Anti-Ban Guides knowledge base',

    'faq.title': 'FAQ',
    'faq.q1': 'Does Claude really check my timezone?',
    'faq.a1':
      'According to public reverse-engineering reports, when Claude Code talks to a non-official endpoint it reads the OS timezone and proxy hostname, and steganographically encodes the result into its system prompt. The timezone this page reads via Intl.DateTimeFormat is the very same OS timezone.',
    'faq.q2': 'Is this score the exact check Claude runs?',
    'faq.a2':
      'No. Only the system timezone maps one-to-one onto Claude’s reported mechanism. The other nine signals are common Chinese-environment or network fingerprints that correlate with it, so treat the score as an estimate, not a verdict.',
    'faq.q3': 'How do I lower my score?',
    'faq.a3':
      'Switch your OS timezone away from China zones such as Asia/Shanghai, move zh-CN off the top of your browser language list, block WebRTC leaks, and avoid routing Claude Code through proxies whose hostnames contain flagged domains or AI-lab keywords. The “How to lower your risk score” checklist above walks through it in order.',
    'faq.q4': 'Is any data uploaded?',
    'faq.a4':
      'No. Every check runs locally in your browser and none of the detected signals are ever sent anywhere. The site loads Google Analytics for anonymous page-view stats and Google AdSense for advertising (ads may use cookies). WebRTC leak detection may briefly contact a public STUN server to gather ICE candidates.',
    'faq.q5': 'Will a low score guarantee I won’t get banned?',
    'faq.a5':
      'No guarantee. This tool only measures browser-visible fingerprints. Anthropic’s real risk model also weighs your IP reputation, payment-card BIN, account age and usage patterns — none of which a web page can see. A low score removes obvious local tells, but a datacenter IP or a high-risk virtual card can still get an account flagged.',
    'faq.q6': 'Is using this tool or the guides against Anthropic’s terms?',
    'faq.a6':
      'The scanner just reads your own browser and reports what it sees — nothing about that is against any terms. The guides are educational reference material about how fingerprinting works. You are responsible for your own use of Claude and for complying with Anthropic’s policies and your local laws. Note that Anthropic’s Help Center lists account creation from an unsupported location as a ban reason, so no browser setting makes an ineligible account eligible.',
    'faq.q7': 'Why does the timezone matter more than my IP address?',
    'faq.a7':
      'Because the OS timezone is read on the client and rides inside the request in a way the reverse-engineering reports tied directly to the encoded verdict. A VPN changes your IP but usually leaves the OS timezone untouched — which is the most common reason a “clean” VPN setup still scores high here.',
    'faq.q8': 'The API result differs from the browser scan — why?',
    'faq.a8':
      'The curl endpoint at /api/check runs on the server, so it can only see what your request exposes: the Vercel geo timezone, country, Accept-Language and User-Agent. It cannot probe fonts, Intl locale or WebRTC leaks, so it scores roughly 62/100 of the total weight and normalises that to 0–100. The in-browser scan reads your actual OS and is the more complete picture.',
    'faq.q9': 'My account was already banned — what now?',
    'faq.a9':
      'First identify the ban type (IP block, forced refund, or a fully disabled account), because each has a different path. The account ban diagnosis & English appeal SOP guide covers how to tell them apart and includes appeal-email templates; if recovery isn’t realistic, the domestic & open-source failover guide covers switching to alternative models with minimal disruption. The official appeal form is reached by signing in at claude.ai with the banned account.',

    'privacy.title': 'Privacy',
    'privacy.body':
      'Every check runs locally in your browser — your scan results never leave your device. The site loads Google Analytics for anonymous page-view stats and Google AdSense for ads; none of the detected signals are ever sent. WebRTC leak detection may briefly contact a public STUN server.',
    'privacy.fullPolicy': 'Full privacy policy →',

    'author.by': 'Written by',
    'author.updated': 'Updated:',

    'trust.privacy.title': 'Privacy Policy',
    'trust.privacy.description':
      'How Fuck Claude handles local scans, Google Analytics, Google AdSense, and WebRTC STUN probing.',
    'trust.terms.title': 'Terms of Service',
    'trust.terms.description':
      'Terms and conditions governing the educational and technical use of Fuck Claude.',
    'trust.about.title': 'About',
    'trust.about.description':
      'Who runs Fuck Claude, why it exists, editorial standards, and its relationship to Anthropic.',
    'trust.contact.title': 'Contact',
    'trust.contact.description':
      'Contact LinXiaoTao by email or GitHub Issues for bug reports, guide corrections, privacy requests, and sponsorship inquiries.',

    'social.x': 'X (Twitter)',
    'social.xiaohongshu': 'Xiaohongshu (RED)',
    'social.douyin': 'Douyin',
    'social.jike': 'Jike',
    'social.scan': 'Scan with the app, or click to open',

    'footer.disclaimer':
      'For reference only, based on public reverse-engineering reports. Not an official statement or advice.',
    'footer.license':
      'Open sourced under the MIT License — redistributions must keep the original project notice.',
    'footer.repo': 'Original project',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.about': 'About',
    'footer.contact': 'Contact',

    'share.label': 'Share your result',
    'share.native': 'Share',
    'share.copy': 'Copy link',
    'share.copied': 'Copied!',
    'share.save': 'Save result image',
    'share.saved': 'Saved!',
    'share.text':
      'I scored {score}/100 on the “Am I a Claude China User?” test — {verdict}! 🐶 Check yours:',
    'share.to.x': 'Share on X',
    'share.to.weibo': 'Share on Weibo',
    'share.to.telegram': 'Share on Telegram',
    'share.to.facebook': 'Share on Facebook',
    'share.to.linkedin': 'Share on LinkedIn',
    'share.to.reddit': 'Share on Reddit',

    'api.title': 'Also available over curl',
    'api.desc':
      'Prefer the terminal? Hit the endpoint below — it estimates your risk from your IP geo + request headers, and replies in the language of your Accept-Language header.',
    'api.ex1': '# Text report — follows your Accept-Language',
    'api.ex2': '# Force a language via header',
    'api.ex3': '# JSON output',

    'ui.claudeBadge': 'Claude Same',
    'ui.retest': 'Scan again',
    'ui.start': 'Start scan',

    'ext.title': 'Site Locale Control',
    'ext.description':
      'On sites you choose, this extension presents the time zone, language, Intl locale, user agent, font measurements, and WebRTC candidates as the region you select. It does not change your IP address, does not upload data, and has no analytics. It is not listed on the Chrome Web Store yet, so load the unpacked folder in developer mode.',
    'ext.versionLabel': 'Version',
    'ext.download': 'Download',
    'ext.downloadWithSize': 'Download ({size})',
    'ext.installTitle': 'Install',
    'ext.step1': 'Download the zip and unzip it. The folder should contain manifest.json directly.',
    'ext.step2': 'Open chrome://extensions.',
    'ext.step3': 'Turn on Developer mode in the top-right corner.',
    'ext.step4': 'Click Load unpacked and select the unzipped folder.',
    'ext.step5': 'Click the toolbar icon, allow the site in the popup, and choose Apply recommended.',
    'ext.step6': 'Return to this site’s check page and run the check.',
    'ext.checkCta': 'Open the check page',
    'ext.updateTitle': 'Update',
    'ext.update':
      'After downloading a new version, replace the unpacked folder, then open chrome://extensions and click Reload.',
    'ext.featuresTitle': 'What it changes',
    'ext.f1': 'Time zone and UTC offset reported by Date and Intl.DateTimeFormat.',
    'ext.f2': 'navigator.language / navigator.languages and the default Intl locale.',
    'ext.f3': 'Optional: a desktop Chrome user agent string for the selected region.',
    'ext.f4': 'Optional: font measurements, so locale-specific system fonts are not exposed through text metrics.',
    'ext.f5': 'Optional: WebRTC ICE candidates seen by the page, so local addresses are not listed.',
    'ext.f6': 'It does not change your operating system clock, your IP address, or anything outside the sites you allow.',
    'ext.privacyTitle': 'Permissions and privacy',
    'ext.p1': 'Required permissions are only storage, scripting and declarativeNetRequestWithHostAccess. The release build requests no host permissions at install time.',
    'ext.p2': 'Site access is requested per site from the popup, only for the sites you add. The browser-wide WebRTC policy uses the optional privacy permission and is asked for separately.',
    'ext.p3': 'Settings stay in chrome.storage on your device. The extension sends no network requests of its own, has no analytics, and uploads nothing.',
    'ext.p4': 'The source code is open on GitHub under the extension/ folder of the project repository.',
    'ext.useTitle': 'Responsible use',
    'ext.use':
      'Site Locale Control is a diagnostic and privacy tool for checking what a web page can read about your browser locale. It does not hide your network location, and it is not a way around any service’s rules. Follow the Terms of Service of every site you use it on.',
    'ext.faqTitle': 'FAQ',
    'ext.q1': 'Why is it not on the Chrome Web Store?',
    'ext.a1': 'It has not been submitted yet. Until then, install the unpacked folder in developer mode. Chrome may show a developer mode reminder at startup; that is expected.',
    'ext.q2': 'My changes did not apply. What should I check?',
    'ext.a2': 'Make sure the switch in the popup is on and the site is allowed, then reload the tab. The extension does not reload pages automatically.',
    'ext.q3': 'Which browsers are supported?',
    'ext.a3': 'Desktop Chrome with Manifest V3. Other Chromium browsers that load unpacked extensions usually work but are not tested.',
    'ext.q4': 'How do I remove it?',
    'ext.a4': 'Open chrome://extensions and click Remove on Site Locale Control. Its stored settings are deleted with it.',

    'banner.prompt': 'Choose another language to browse content adapted for your browser language preference.',
    'banner.continue': 'Continue',
    'banner.dismiss': 'Close',
  },

  zh: {
    'meta.title': 'Fuck Claude ｜ 你是「Claude 中国用户」吗',
    'meta.description':
      '一键检测浏览器时区、语言、中文字体与 locale 等信号，评估你是否会被 Claude Code 判定为中国用户并有封号风险。纯本地运行，零数据上传。',

    'nav.title': 'Fuck Claude',
    'nav.guides': '防封指南',
    'nav.news': '最新动态',
    'nav.extension': '浏览器扩展',
    'nav.about': '关于本站',
    'nav.home': '首页',

    'news.title': 'Claude 最新动态',
    'news.sub':
      '精选 Claude 产品更新、API 变更、地区政策与社区风控趋势，助你及时调整使用策略。',
    'news.note':
      '条目由本站人工整理，来源为 Anthropic 官方公告与社区反馈。点击标题将在新标签页打开外部链接。',
    'news.backHome': '← 返回首页',
    'news.viewAll': '查看全部动态',
    'news.source': '来源',

    'community.title': '社区防封实战精选',
    'community.sub':
      '来自 X (Twitter) 的 Claude 封号、申诉、支付与 Claude Code 第一手经验，附原文直达链接与实战避坑提炼。',
    'community.viewAll': '查看全部实战帖',
    'community.takeaway': '实战要点：',
    'community.viewOnX': '在 X (Twitter) 查看原文',
    'community.externalHint': '将在新标签页打开外部链接',

    'credit': '此网站使用 Claude Fable 5 开发',

    'guides.title': 'Claude 防封避坑与环境纯化资料库',
    'guides.sub':
      '先汇总 Anthropic 公开的规则，再深入讲解风控原理、环境纯化、注册支付避坑、API 中转规范与英文申诉 SOP。',
    'guides.readMore': '阅读全文',
    'guides.back': '← 返回资料库',
    'guides.backHome': '← 返回首页',
    'guides.editorial':
      '由独立开发者 LinXiaoTao 撰写与维护。指南会随新的逆向发现与社区反馈持续更新。本资料库仅供教育与参考，并非 Anthropic 官方文档。',
    'guides.intro':
      '这个资料库整理了公开信息中关于 Claude Code 如何给用户打指纹、封号如何发生的内容：从 Unicode 隐写与 Anthropic 多维风控模型，到环境纯化、账号与支付安全，再到账号被标记后的处理。涉及 Anthropic 规则的陈述附官方链接和核对日期，其余内容来自社区反馈与公开逆向分析，并会标明。每篇文章均为中英双语，可单独阅读，也可按下方路径阅读。',
    'guides.paths.title': '从哪里开始',
    'guides.paths.sub': '不知道先看哪一篇？挑一条最贴合你当前处境的路径。',
    'guides.path0.title': '0 · 防封速查手册',
    'guides.path0.desc': '想快速上手？账号安全、API 限制与频率控制要点，一篇搞定。',
    'guides.path0.cta': '打开速查手册',
    'guides.path1.title': '1 · 先搞懂风控',
    'guides.path1.desc': '刚接触？动手改任何东西之前，先看懂指纹检测与四维风控模型到底是怎么运作的。',
    'guides.path1.cta': '阅读风控原理',
    'guides.path2.title': '2 · 纯化你的环境',
    'guides.path2.desc': '同步时区、隔离中文字体、堵住 WebRTC 泄露，并正确配置原生住宅 IP。',
    'guides.path2.cta': '开始纯化环境',
    'guides.path3.title': '3 · 安全注册与支付',
    'guides.path3.desc': '选对接码号段，使用 Claude 接受的卡类型，并在订阅前让账单信息与银行卡保持一致。',
    'guides.path3.cta': '按安全方式注册',
    'guides.path4.title': '4 · 安全使用 Claude Code 与 API',
    'guides.path4.desc': '保持命令行与浏览器环境一致，选择不破坏 Prompt Cache 的中转，并控制在速率限制之内。',
    'guides.path4.cta': '配置 Claude Code',
    'guides.path5.title': '5 · 封号后的自救',
    'guides.path5.desc': '已经被封？先判定封号类型，发送基于事实的英文申诉，或平滑切换到平替模型。',
    'guides.path5.cta': '开始自救',
    'guides.related': '相关阅读',
    'guides.allGuides': '浏览全部指南',
    'guides.catalog.title': '按主题浏览全部指南',
    'guides.catalog.nav': '跳转到主题',
    'guides.readTime': '{n} 分钟阅读',
    'guides.toc': '本页目录',
    'guides.compliance':
      '本文为教育与诊断用途，解释风控信号的原理，帮助你理解并排查自己的环境，不构成违反任何规则的建议。请遵守 Anthropic 的使用政策、服务条款以及所在地法律；如所在地区不受支持，请选用官方可用的替代方案。',
    'guides.sources': '来源',
    'guides.verified': '官方信息核对于 {date}。',
    'guides.unverified': '本文基于社区反馈与公开逆向分析，未逐项对照 Anthropic 官方文档核对；重要细节请以官方帮助中心为准。',
    'guides.tableLabel': '可横向滚动的表格',
    'guides.news.title': '政策与风控动态',
    'guides.news.sub': '近期影响账号的地区、政策与风控变化。',

    'rules.title': '官方规则速览',
    'rules.sub': 'Anthropic 公开声明的内容，最近核对于 {date}。指南中的其余内容来自社区经验或逆向分析，并会标明。',
    'rules.source': '来源',

    'community.relatedGuide': '相关指南',

    'hero.title': '你是「Claude 中国用户」吗',
    'hero.badge.local': '纯本地检测',
    'hero.badge.noUpload': '结果零上传',
    'hero.badge.openSource': '开源代码',
    'hero.scoreOutOf': '/ 100',

    'sponsors.label': '赞助',
    'sponsors.cta': '想显示在下方？',

    'cnModels.label': '国产大模型',
    'cnModels.slogan': '模型还是中国的好',

    'band.low.title': '低风险',
    'band.low.desc': '🐶你不是「Claude 中国用户」🐶',
    'band.medium.title': '中等风险',
    'band.medium.desc': '🐶你可能是「Claude 中国用户」🐶',
    'band.high.title': '高风险',
    'band.high.desc': '🐶你绝对是「Claude 中国用户」🐶',
    'band.high.extra': '但是你还有',
    'band.high.extraSep': '、',
    'band.high.extraSepLast': ' 和 ',

    'signal.timezone.name': '系统时区',
    'signal.timezone.desc':
      'Intl.DateTimeFormat 读到的就是 Claude Code 读取的同一个系统时区，与 Asia/Shanghai、Asia/Urumqi 等中国时区比对。',
    'signal.language.name': '浏览器语言',
    'signal.language.desc': '检查 navigator.languages；首选 zh-CN / 简体中文得分最高。',
    'signal.fonts.name': '已安装中文字体',
    'signal.fonts.desc': '用 canvas 宽度探测微软雅黑、苹方等简繁中文字体。',
    'signal.vendorFonts.name': '国产厂商字体',
    'signal.vendorFonts.desc':
      '用 canvas 探测 MiSans、鸿蒙黑体、OPPO Sans、WPS 方正字体等国产厂商 / 软件字体，命中即为强信号。',
    'signal.cnBrowser.name': '国产浏览器 / WebView',
    'signal.cnBrowser.desc':
      '用 UA 与 UA-CH brands 匹配微信、QQ、夸克、UC、百度等国产浏览器或应用内 WebView。',
    'signal.deviceVendor.name': '国产品牌设备',
    'signal.deviceVendor.desc':
      '用 UA-CH 设备型号(navigator.userAgentData)与 UA 匹配鸿蒙、华为、小米、OPPO、vivo 等国产品牌。',
    'signal.intlLocale.name': 'Intl 区域设置',
    'signal.intlLocale.desc': '浏览器用于日期 / 数字格式化的 locale。',
    'signal.timezoneOffset.name': '时区偏移',
    'signal.timezoneOffset.desc': 'getTimezoneOffset() 是否为 UTC+8。',
    'signal.webrtcLeak.name': 'WebRTC IP 泄露',
    'signal.webrtcLeak.desc':
      '探测浏览器 RTCPeerConnection 是否通过 STUN 服务泄露真实内网或公网 IP。',
    'signal.emoji.name': 'Emoji 渲染风格',
    'signal.emoji.desc': '由 UA 推断操作系统厂商，弱相关信号。',

    'scan.detecting': '检测中',
    'scan.ready': '待检测',
    'result.hitsTitle': '命中的信号',
    'result.noHits': '没有命中明显的中国信号，风险较低。',

    'signals.title': '检测哪些信号',
    'signals.sub': '十项区域与网络指纹，加权得出 0–100 风险分。',

    'how.title': '检测原理',
    'how.p1':
      '当 Claude Code 通过 ANTHROPIC_BASE_URL 指向中转端点时，据公开逆向分析，它会读取操作系统时区与中转 hostname，再把结果用 Unicode 隐写术藏进 system prompt:「Today’s date」那一行的日期分隔符和 4 种几乎一样的撇号变体，编码了你是否像中国用户。',
    'how.p2':
      '网页读不到 Claude Code 能读的全部信息，但关键信号完全一致：本工具读取同一个系统时区，再叠加浏览器语言、中文字体、国产厂商字体、WebRTC IP 泄露、国产浏览器、设备品牌、Intl locale、UTC+8 偏移与 emoji 风格九项指纹，加权得分。得分 ≥0.25 计为命中；分档：低 0–30、中 31–60、高 61–100。',
    'ui.weight': '权重',

    'why.title': '为什么会被 Claude 判为「中国用户」',
    'why.p1':
      'Anthropic 并不在中国大陆销售 Claude，而 Claude Code 被曝会把「看起来像中国」的流量视为更高风险。这个判定并不是一个开关，而是把多个弱信号叠加成一个概率。系统时区是单项里最重的一环 —— 它伴随每一次请求，又很难被无意伪装；但语言、字体、设备品牌与网络都会在它之上继续加权。',
    'why.p2':
      '整个浏览器环境之所以会泄露这么多，是因为区域设置会渗透到方方面面：操作系统时区决定了 Intl 与 Date，语言偏好决定了 navigator.languages 与 Accept-Language 请求头，而操作系统自带的字体可以被 canvas 逐像素探测。如果再让 Claude Code 走一层中转，中转的 hostname 本身又成了一个信号 —— 逆向分析发现，判定结果被隐写进了 system prompt 里「Today’s date」那一行。',
    'why.p3':
      '这些信号单看没有一个是决定性的，而这恰恰是风险会累积的原因：一个美国时区，配上一整套中文字体和一个微信 WebView，照样会被读成可疑。隐写机制与完整风控模型拆解见',
    'why.link1': '隐写暗记与四维风控模型指南',
    'why.p3b': '，而具体的解决办法收在',
    'why.link2': '环境纯化与住宅 IP 配置指南',
    'why.p3c': '。',

    'reduce.title': '如何降低你的风险分',
    'reduce.sub':
      '一份简明的有序清单。每一步都直接对应上方某一项加权信号 —— 请从上往下做，因为时区和语言的权重最高。',
    'reduce.s1':
      '把系统时区改成非中国时区(例如 America/New_York 或 Europe/London)，并确认 getTimezoneOffset() 不再是 UTC+8。逆向分析披露 Claude Code 直接读取的信号只有这一项，所以它在本页评分中权重最高。',
    'reduce.s2':
      '把 zh-CN / zh-Hans 从浏览器与系统语言列表的首位移除，让 navigator.languages 和 Accept-Language 以英文或其他非中文 locale 打头。',
    'reduce.s3':
      '隔离中文与厂商字体(微软雅黑、PingFang SC、MiSans、鸿蒙黑体)—— 使用干净的浏览器 Profile 或防指纹浏览器，让 canvas 字体探测找不到任何明显的中文痕迹。',
    'reduce.s4':
      '堵住 WebRTC 的 IP 泄露，并走原生住宅 IP 而非数据中心 IP，避免真实网络与地理位置盖过一个本来已经很干净的环境。',
    'reduce.s5':
      '通过中转使用 Claude Code 时，保持 ANTHROPIC_BASE_URL 的 hostname 中性 —— 避开含敏感关键词或 AI 实验室名称的域名，若宿主机在中国还需覆盖 TZ 环境变量。',
    'reduce.cta': '完整的逐步操作收录在',
    'reduce.ctaLink': '防封指南资料库',

    'faq.title': '常见问题',
    'faq.q1': 'Claude 真的会检查我的时区吗？',
    'faq.a1':
      '据公开逆向分析，Claude Code 连接非官方端点时会读取系统时区与中转 hostname，并把结果隐写进 system prompt。本页通过 Intl.DateTimeFormat 读到的，正是同一个系统时区。',
    'faq.q2': '这个分数就是 Claude 的真实判定吗？',
    'faq.a2':
      '不是。只有系统时区能与 Claude 被披露的机制一一对应，其余九项是与之相关的「中文环境 / 网络指纹」。分数是估计，不是定论。',
    'faq.q3': '怎么降低分数？',
    'faq.a3':
      '把系统时区改出 Asia/Shanghai 等中国时区，把 zh-CN 从浏览器语言列表首位移除，禁用 WebRTC 泄露，并避免让 Claude Code 走 hostname 含敏感域名 / AI 实验室关键词的中转。上方「如何降低你的风险分」清单按顺序完整讲了一遍。',
    'faq.q4': '会上传我的数据吗？',
    'faq.a4':
      '不会。所有检测都在浏览器本地完成，检测到的任何信号都不会被发送。网站加载 Google Analytics 统计匿名访问量，并通过 Google AdSense 展示广告(广告可能使用 Cookie)。WebRTC 泄露检测可能短暂连接公共 STUN 服务器以收集 ICE 候选。',
    'faq.q5': '分数低就一定不会被封吗？',
    'faq.a5':
      '不能保证。本工具只衡量浏览器可见的指纹。Anthropic 真实的风控模型还会权衡你的 IP 信誉、支付卡 BIN、账号资历与使用模式 —— 这些网页都看不到。低分能消除明显的本地破绽，但一个数据中心 IP 或高风险虚拟卡照样可能让账号被标记。',
    'faq.q6': '用这个工具或看这些指南会违反 Anthropic 条款吗？',
    'faq.a6':
      '检测器只是读取你自己的浏览器并如实报告 —— 这本身不违反任何条款。指南是关于指纹检测原理的教育性参考资料。你需要为自己如何使用 Claude、以及是否遵守 Anthropic 政策与当地法律负责。另请注意：Anthropic 帮助中心把「从不受支持的地区创建账户」列为封禁原因，任何浏览器设置都不会让不符合资格的账号变得合规。',
    'faq.q7': '为什么时区比我的 IP 地址还重要？',
    'faq.a7':
      '因为系统时区是在客户端读取的，并以逆向报告直接关联到「被编码的判定结果」的方式随请求一起传出。VPN 换的是 IP，通常不会改动系统时区 —— 这正是很多「干净」的 VPN 配置在这里依然高分的最常见原因。',
    'faq.q8': 'API 结果和浏览器检测不一样，为什么？',
    'faq.a8':
      '/api/check 的 curl 接口跑在服务端，只能看到请求暴露的信息:Vercel 归属地时区、国家、Accept-Language 与 User-Agent。它无法探测字体、Intl locale 或 WebRTC 泄露，因此只覆盖约 62/100 的权重再归一化到 0–100。浏览器端检测读取的是你真实的操作系统，是更完整的画像。',
    'faq.q9': '我的账号已经被封了，现在怎么办？',
    'faq.a9':
      '先判定封号类型(IP 拦截、被迫退款，还是账号被完全禁用)，因为每一种的处理路径都不一样。「封号类型判定与英文申诉 SOP」指南讲了如何区分并附有申诉信模板；如果恢复不现实，「国产 / 开源灾备」指南讲了如何以最小损失切换到平替模型。官方申诉入口是用被封账号登录 claude.ai 后进入的申诉表单。',

    'privacy.title': '隐私说明',
    'privacy.body':
      '所有检测都在你的浏览器本地完成，扫描结果不会离开你的设备。网站加载 Google Analytics 统计匿名页面访问量，并通过 Google AdSense 展示广告；检测到的信号不会被发送。WebRTC 泄露检测可能短暂连接公共 STUN 服务器。',
    'privacy.fullPolicy': '完整隐私政策 →',

    'author.by': '作者',
    'author.updated': '更新于:',

    'trust.privacy.title': '隐私政策',
    'trust.privacy.description':
      'Fuck Claude 如何处理本地检测、Google Analytics、Google AdSense 与 WebRTC STUN 探测。',
    'trust.terms.title': '服务条款',
    'trust.terms.description':
      '使用 Fuck Claude 诊断工具与知识库的法律条款、用户责任与免责声明。',
    'trust.about.title': '关于本站',
    'trust.about.description': 'Fuck Claude 的运营者、项目目的、编辑准则及其与 Anthropic 的关系。',
    'trust.contact.title': '联系我们',
    'trust.contact.description': '通过电子邮件或 GitHub Issues 联系 LinXiaoTao：问题反馈、指南勘误、隐私请求与赞助合作。',

    'social.x': 'X(推特)',
    'social.xiaohongshu': '小红书',
    'social.douyin': '抖音',
    'social.jike': '即刻',
    'social.scan': '用 App 扫码关注，或点击直达',

    'footer.disclaimer': '本工具仅供参考，基于公开逆向分析，不构成任何官方结论或建议。',
    'footer.license': '基于 MIT 协议开源 —— 二次发布请保留原项目署名。',
    'footer.repo': 'GitHub 原项目',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.about': '关于',
    'footer.contact': '联系',

    'share.label': '分享你的结果',
    'share.native': '分享',
    'share.copy': '复制链接',
    'share.copied': '已复制！',
    'share.save': '保存结果图片',
    'share.saved': '已保存！',
    'share.text': '我在「你是 Claude 中国用户吗」测试里得了 {score}/100 —— {verdict}！🐶 快来测测你的:',
    'share.to.x': '分享到 X',
    'share.to.weibo': '分享到微博',
    'share.to.telegram': '分享到 Telegram',
    'share.to.facebook': '分享到 Facebook',
    'share.to.linkedin': '分享到 LinkedIn',
    'share.to.reddit': '分享到 Reddit',

    'api.title': '也支持 curl 命令行',
    'api.desc':
      '喜欢终端？请求下面的接口 —— 它会根据你的 IP 归属地 + 请求头估算风险，并按你的 Accept-Language 请求头返回对应语言。',
    'api.ex1': '# 文本报告 —— 跟随 Accept-Language',
    'api.ex2': '# 通过请求头指定语言',
    'api.ex3': '# JSON 输出',

    'ui.claudeBadge': 'Claude 同款',
    'ui.retest': '重新扫描',
    'ui.start': '开始检测',

    'ext.title': '站点区域控制',
    'ext.description':
      '在你选择的网站上，这个扩展把时区、语言、Intl 区域、UA、字体测量和 WebRTC 候选呈现为所选地区。它不修改 IP，不上传数据，也没有统计。扩展尚未上架 Chrome 网上应用店，需要在开发者模式下加载解压后的文件夹。',
    'ext.versionLabel': '版本',
    'ext.download': '下载',
    'ext.downloadWithSize': '下载（{size}）',
    'ext.installTitle': '安装',
    'ext.step1': '下载压缩包并解压。解压后的文件夹里应直接有 manifest.json。',
    'ext.step2': '打开 chrome://extensions。',
    'ext.step3': '打开右上角的“开发者模式”。',
    'ext.step4': '点击“加载已解压的扩展程序”，选择解压后的文件夹。',
    'ext.step5': '点击工具栏图标，在弹窗里授权站点，并点击“应用推荐”。',
    'ext.step6': '回到本站检测页，运行检测。',
    'ext.checkCta': '打开检测页',
    'ext.updateTitle': '更新',
    'ext.update': '下载新版本后，用新文件夹替换原来的文件夹，再在 chrome://extensions 中点击“重新加载”。',
    'ext.featuresTitle': '它会改什么',
    'ext.f1': 'Date 与 Intl.DateTimeFormat 报告的时区和 UTC 偏移。',
    'ext.f2': 'navigator.language / navigator.languages 以及 Intl 默认区域。',
    'ext.f3': '可选：按所选地区使用桌面 Chrome 的 UA 字符串。',
    'ext.f4': '可选：字体测量，避免网页通过文字度量看出本地区专属系统字体。',
    'ext.f5': '可选：网页可见的 WebRTC ICE 候选，不列出本机地址。',
    'ext.f6': '不修改系统时钟和 IP 地址，也不影响你没有授权的网站。',
    'ext.privacyTitle': '权限与隐私',
    'ext.p1': '固定权限只有 storage、scripting 和 declarativeNetRequestWithHostAccess。正式版安装时不申请任何主机权限。',
    'ext.p2': '站点权限在弹窗里按站点申请，只针对你添加的网站。浏览器级 WebRTC 策略使用可选的 privacy 权限，会单独询问。',
    'ext.p3': '设置保存在本机的 chrome.storage 中。扩展自身不发网络请求，没有统计，不上传任何数据。',
    'ext.p4': '源码在 GitHub 项目仓库的 extension/ 目录中公开。',
    'ext.useTitle': '合理使用',
    'ext.use':
      '站点区域控制是一个诊断与隐私工具，用来查看网页能读到哪些浏览器区域信息。它不会隐藏你的网络位置，也不是绕过任何服务规则的手段。在任何网站上使用时，请遵守该网站的服务条款。',
    'ext.faqTitle': '常见问题',
    'ext.q1': '为什么没有上架 Chrome 网上应用店？',
    'ext.a1': '目前还没有提交审核。在此之前，请在开发者模式下加载解压后的文件夹。Chrome 启动时可能提示正在使用开发者模式扩展，这是正常的。',
    'ext.q2': '设置没有生效怎么办？',
    'ext.a2': '确认弹窗里的总开关已打开、当前网站已授权，然后刷新标签页。扩展不会自动刷新页面。',
    'ext.q3': '支持哪些浏览器？',
    'ext.a3': '桌面版 Chrome（Manifest V3）。其他能加载解压扩展的 Chromium 浏览器通常也能用，但没有测试过。',
    'ext.q4': '如何卸载？',
    'ext.a4': '打开 chrome://extensions，在“站点区域控制”上点击“移除”。已保存的设置会一起删除。',

    'banner.prompt': '选择另一语言以浏览适用于你浏览器语言偏好的内容。',
    'banner.continue': '继续',
    'banner.dismiss': '关闭',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];

/** Returns a translator that falls back to English, then to the raw key. */
export function useTranslations(lang: Lang) {
  const table = ui[lang] ?? ui[defaultLang];
  return function t(key: string): string {
    return (
      (table as Record<string, string>)[key] ??
      (ui[defaultLang] as Record<string, string>)[key] ??
      key
    );
  };
}

/** `/` for English (default), `/zh/` for Chinese. */
export function localePath(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

/** Detect the current language from an Astro request URL. */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg && seg in languages) return seg as Lang;
  return defaultLang;
}
