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
    'credit': 'Built with Claude Fable 5',

    'hero.title': 'Are you a Claude “China user”?',
    'hero.badge.local': '100% local scan',
    'hero.badge.noUpload': 'Results never uploaded',
    'hero.badge.openSource': 'Open source',
    'hero.scoreOutOf': '/ 100',

    'sponsors.label': 'Sponsors',
    'sponsors.cta': 'Want to be listed here?',

    'cnModels.label': 'Chinese AI models',
    'cnModels.slogan': 'Chinese models are simply better',
    'cnModels.cta': 'Check it out',

    'band.low.title': 'Low risk',
    'band.low.desc': '🐶You are not a “Claude China user”🐶',
    'band.medium.title': 'Medium risk',
    'band.medium.desc': '🐶You are probably a “Claude China user”🐶',
    'band.high.title': 'High risk',
    'band.high.desc': '🐶You are definitely a “Claude China user”🐶',
    'band.high.extra': 'But you still have',
    'band.high.extraLink': 'Kimi Code',

    'signal.timezone.name': 'System timezone',
    'signal.timezone.desc':
      'Intl.DateTimeFormat exposes the same OS timezone Claude Code reads; compared against Asia/Shanghai, Asia/Urumqi and other China zones.',
    'signal.language.name': 'Browser language',
    'signal.language.desc':
      'navigator.languages — zh-CN / Simplified Chinese at the top of the list scores highest.',
    'signal.fonts.name': 'Installed Chinese fonts',
    'signal.fonts.desc':
      'Canvas width-probing for Simplified / Traditional Chinese fonts such as Microsoft YaHei and PingFang SC.',
    'signal.intlLocale.name': 'Intl locale',
    'signal.intlLocale.desc':
      'The locale your browser resolves for date and number formatting.',
    'signal.timezoneOffset.name': 'Timezone offset',
    'signal.timezoneOffset.desc': 'Whether getTimezoneOffset() equals UTC+8.',
    'signal.emoji.name': 'Emoji rendering style',
    'signal.emoji.desc':
      'OS vendor guessed from the user agent; a weak, loosely correlated signal.',

    'scan.detecting': 'Checking',
    'scan.ready': 'Ready to scan',
    'result.hitsTitle': 'Matched signals',
    'result.noHits': 'No strong China signals matched. Low risk.',

    'signals.title': 'What gets scanned',
    'signals.sub': 'Six locale fingerprints, weighted to a 0–100 risk score.',

    'how.title': 'How the check works',
    'how.p1':
      'When Claude Code is pointed at a proxy endpoint via ANTHROPIC_BASE_URL, public reverse-engineering reports found it reads your operating-system timezone and the proxy hostname, then hides the verdict inside the system prompt with Unicode steganography — the date separator and four look-alike apostrophes in the “Today’s date” line encode whether you look like a China user.',
    'how.p2':
      'A web page cannot read everything Claude Code can, but the key signal is identical: this tool reads the same OS timezone, then adds five more browser-visible locale fingerprints — UI language, installed Chinese fonts, Intl locale, UTC+8 offset and emoji style — into a weighted score. Signals scoring ≥0.25 count as hits; bands are Low 0–30, Medium 31–60, High 61–100.',
    'ui.weight': 'Weight',

    'faq.title': 'FAQ',
    'faq.q1': 'Does Claude really check my timezone?',
    'faq.a1':
      'According to public reverse-engineering reports, when Claude Code talks to a non-official endpoint it reads the OS timezone and proxy hostname, and steganographically encodes the result into its system prompt. The timezone this page reads via Intl.DateTimeFormat is the very same OS timezone.',
    'faq.q2': 'Is this score the exact check Claude runs?',
    'faq.a2':
      'No. Only the system timezone maps one-to-one onto Claude’s reported mechanism. The other five signals are common Chinese-environment fingerprints that correlate with it, so treat the score as an estimate, not a verdict.',
    'faq.q3': 'How do I lower my score?',
    'faq.a3':
      'Switch your OS timezone away from China zones such as Asia/Shanghai, move zh-CN off the top of your browser language list, and avoid routing Claude Code through proxies whose hostnames contain flagged domains or AI-lab keywords.',
    'faq.q4': 'Is any data uploaded?',
    'faq.a4':
      'No. Every check runs locally in your browser and none of the detected signals are ever sent anywhere. The site only loads standard Google Analytics for anonymous page-view stats.',

    'privacy.title': 'Privacy',
    'privacy.body':
      'Every check runs locally in your browser — your scan results never leave your device. The site only loads Google Analytics for anonymous page-view stats; none of the detected signals are ever sent.',

    'footer.disclaimer':
      'For reference only, based on public reverse-engineering reports. Not an official statement or advice.',

    'ui.claudeBadge': 'Claude Same',
    'ui.retest': 'Scan again',
    'ui.start': 'Start scan',
  },

  zh: {
    'meta.title': 'Fuck Claude ｜ 你是「Claude 中国用户」吗',
    'meta.description':
      '一键检测浏览器时区、语言、中文字体与 locale 等信号,评估你是否会被 Claude Code 判定为中国用户并有封号风险。纯本地运行,零数据上传。',

    'nav.title': 'Fuck Claude',
    'credit': '此网站使用 Claude Fable 5 开发',

    'hero.title': '你是「Claude 中国用户」吗',
    'hero.badge.local': '纯本地检测',
    'hero.badge.noUpload': '结果零上传',
    'hero.badge.openSource': '开源代码',
    'hero.scoreOutOf': '/ 100',

    'sponsors.label': '赞助商',
    'sponsors.cta': '想显示在下方？',

    'cnModels.label': '国产大模型',
    'cnModels.slogan': '模型还是中国的好',
    'cnModels.cta': '去看看',

    'band.low.title': '低风险',
    'band.low.desc': '🐶你不是「Claude 中国用户」🐶',
    'band.medium.title': '中等风险',
    'band.medium.desc': '🐶你可能是「Claude 中国用户」🐶',
    'band.high.title': '高风险',
    'band.high.desc': '🐶你绝对是「Claude 中国用户」🐶',
    'band.high.extra': '但是你还有',
    'band.high.extraLink': 'Kimi Code',

    'signal.timezone.name': '系统时区',
    'signal.timezone.desc':
      'Intl.DateTimeFormat 读到的就是 Claude Code 读取的同一个系统时区,与 Asia/Shanghai、Asia/Urumqi 等中国时区比对。',
    'signal.language.name': '浏览器语言',
    'signal.language.desc': '检查 navigator.languages;首选 zh-CN / 简体中文得分最高。',
    'signal.fonts.name': '已安装中文字体',
    'signal.fonts.desc': '用 canvas 宽度探测微软雅黑、苹方等简繁中文字体。',
    'signal.intlLocale.name': 'Intl 区域设置',
    'signal.intlLocale.desc': '浏览器用于日期 / 数字格式化的 locale。',
    'signal.timezoneOffset.name': '时区偏移',
    'signal.timezoneOffset.desc': 'getTimezoneOffset() 是否为 UTC+8。',
    'signal.emoji.name': 'Emoji 渲染风格',
    'signal.emoji.desc': '由 UA 推断操作系统厂商,弱相关信号。',

    'scan.detecting': '检测中',
    'scan.ready': '待检测',
    'result.hitsTitle': '命中的信号',
    'result.noHits': '没有命中明显的中国信号,风险较低。',

    'signals.title': '检测哪些信号',
    'signals.sub': '六项区域指纹,加权得出 0–100 风险分。',

    'how.title': '检测原理',
    'how.p1':
      '当 Claude Code 通过 ANTHROPIC_BASE_URL 指向中转端点时,据公开逆向分析,它会读取操作系统时区与中转 hostname,再把结果用 Unicode 隐写术藏进 system prompt:「Today’s date」那一行的日期分隔符和 4 种几乎一样的撇号变体,编码了你是否像中国用户。',
    'how.p2':
      '网页读不到 Claude Code 能读的全部信息,但关键信号完全一致:本工具读取同一个系统时区,再叠加浏览器语言、中文字体、Intl locale、UTC+8 偏移与 emoji 风格五项指纹,加权得分。得分 ≥0.25 计为命中;分档:低 0–30、中 31–60、高 61–100。',
    'ui.weight': '权重',

    'faq.title': '常见问题',
    'faq.q1': 'Claude 真的会检查我的时区吗?',
    'faq.a1':
      '据公开逆向分析,Claude Code 连接非官方端点时会读取系统时区与中转 hostname,并把结果隐写进 system prompt。本页通过 Intl.DateTimeFormat 读到的,正是同一个系统时区。',
    'faq.q2': '这个分数就是 Claude 的真实判定吗?',
    'faq.a2':
      '不是。只有系统时区能与 Claude 被披露的机制一一对应,其余五项是与之相关的「中文环境指纹」。分数是估计,不是定论。',
    'faq.q3': '怎么降低分数?',
    'faq.a3':
      '把系统时区改出 Asia/Shanghai 等中国时区,把 zh-CN 从浏览器语言列表首位移除,并避免让 Claude Code 走 hostname 含敏感域名 / AI 实验室关键词的中转。',
    'faq.q4': '会上传我的数据吗?',
    'faq.a4':
      '不会。所有检测都在浏览器本地完成,检测到的任何信号都不会被发送。网站仅加载 Google Analytics 统计匿名访问量。',

    'privacy.title': '隐私说明',
    'privacy.body':
      '所有检测都在你的浏览器本地完成,扫描结果不会离开你的设备。网站仅加载 Google Analytics 统计匿名页面访问量,检测到的信号不会被发送。',

    'footer.disclaimer': '本工具仅供参考,基于公开逆向分析,不构成任何官方结论或建议。',

    'ui.claudeBadge': 'Claude 同款',
    'ui.retest': '重新扫描',
    'ui.start': '开始检测',
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
