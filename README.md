# Fuck Claude — Are You a Claude "China User"?

English | [中文](#中文)

A lightweight, SEO-friendly, bilingual (EN / 中文) single-page tool that scans your
**browser environment** and tells you whether Claude Code would flag you as a China
user. One click runs an animated scan of each signal, the gauge climbs as risk adds
up, and you get a verdict plus the list of matched signals. Everything runs **100%
locally** — no network requests, no data upload.

Built with **Claude Fable 5**.

## How it works

When Claude Code is pointed at a non-official endpoint via `ANTHROPIC_BASE_URL`, it
was reported to read the **system timezone** and the **proxy hostname**, then encode
the result steganographically into the `Today's date is …` line of the system prompt
(date separator `-` → `/` on a China timezone; the apostrophe swapped among four
near-identical Unicode variants to encode domain-list / AI-lab-keyword hits).

A web page can only read browser-visible signals. Crucially, `Intl` reads the **same
OS timezone** Claude Code does, so timezone is the one signal that maps directly onto
Claude's real check. The other signals are general "Chinese environment" fingerprints.

## Sponsors

[Want to be listed below?](mailto:linxiaotao1993@gmail.com)

| 🏆 Sponsors 🏆 | Introduction |
| --- | --- |
| <a href="https://ergouapi.com/r/gh-fuckclaude"><img src="public/sponsors/ergou-wordmark-340x112.png" width="170" alt="Ergou API"></a> | **[Ergou API](https://ergouapi.com/r/gh-fuckclaude)**<br>Thanks to Ergou API for sponsoring this project! Ergou API is the rock-solid AI API gateway: ultra-low multipliers (0.1x–0.2x) across the board, with 100% genuine, unfiltered endpoints for top-tier LLMs including **Claude**, GPT and Gemini. Powered by premium IPLC routes and dual residential ISP redundancy for battle-tested stability and ultra-low latency. Built for developers and studios — [sign up](https://ergouapi.com/r/gh-fuckclaude) and start building today. |
| <a href="https://roxybrowser.com/invite/0326196A"><img src="public/sponsors/roxy-wordmark.jpg" width="140" alt="Roxy Browser"></a> | **[Roxy Browser \| Multi-account farming & anti-ban](https://roxybrowser.com/invite/0326196A)** (10% off promo code)<br>Thanks to Roxy Browser for sponsoring this project! Built to bypass AI-platform risk-control checks: fully masks Canvas, WebGL and other low-level fingerprints, gives every account absolute physical isolation, and keeps batch account farming stable and ban-free. |
| <a href="https://hk.geek2api.com?ref=fuckclaude"><img src="public/sponsors/geek2api-wordmark-340x108.jpg" width="170" alt="Geek2API"></a> | **[Geek2API — enterprise-grade AI gateway](https://hk.geek2api.com?ref=fuckclaude)**<br>Thanks to Geek2API for sponsoring this project! The ultra-low-rate AI gateway chosen by universities and enterprises: full access to **Claude**, GPT, Gemini and Image2 at rock-bottom multipliers, with invoices available. [Try it now](https://hk.geek2api.com?ref=fuckclaude). |
| <a href="https://agentearth.ai/r/NYf7jJZq"><img src="public/sponsors/agentearth-wordmark-290x48.png" width="170" alt="AgentEarth"></a> | **[AgentEarth](https://agentearth.ai/r/NYf7jJZq)**<br>Thanks to AgentEarth for sponsoring this project! Your agent needs tools that get things done right: AgentEarth puts 600+ plug-and-play external API tools — AI generation, web search, scraping, maps, weather, finance data and more — behind a single MCP endpoint. [Get started](https://agentearth.ai/r/NYf7jJZq) today. |

## Detected signals & weights

| Signal | Weight | How it's detected |
| --- | --- | --- |
| System timezone | 26 | `Intl.DateTimeFormat().resolvedOptions().timeZone` vs. `Asia/Shanghai`, `Asia/Urumqi`, … (**used by Claude**) |
| Browser language | 20 | `navigator.language(s)`; `zh-CN` / `zh-Hans` scores highest |
| Installed Chinese fonts | 16 | Canvas width-probing for SC/TC fonts (Microsoft YaHei, PingFang SC, …) |
| Chinese vendor fonts | 10 | Canvas probing for vendor/software faces (MiSans, HarmonyOS Sans, OPPO Sans, WPS Founder FZ\*, …) — any hit is a strong tell |
| Chinese browser / WebView | 8 | UA + UA-CH brands vs. WeChat, QQ, Quark, UC, Baidu, 360, Sogou, Douyin … |
| Chinese-brand device | 6 | UA-CH high-entropy `model` (`navigator.userAgentData`) + UA vs. HarmonyOS, Huawei, Xiaomi, OPPO, vivo, … |
| Intl locale | 6 | `Intl` resolved locale (date/number formatting) |
| Timezone offset | 4 | `getTimezoneOffset() === -480` (UTC+8) |
| Emoji rendering style | 4 | OS-vendor guess from platform/UA; weakly correlated |

Each signal returns a `0–1` "China-like" score, multiplied by its weight; the nine
weights sum to **100**, so the total score is the sum of contributions. Bands: Low
`0–30`, Medium `31–60`, High `61–100`. A signal counts as a "hit" when its score
≥ 0.25.

## Share & API

- **One-click share** — after a scan, share your verdict together with an
  auto-generated result image via the native share sheet (Web Share API, so
  mobile clients get their real app list), or straight to X, Weibo, Telegram,
  Facebook, LinkedIn or Reddit, plus copy-to-clipboard. A **Save result image**
  button also appears next to _Scan again_.
- **curl / HTTP endpoint** — the site is static, but a tiny Vercel Function at
  `/api/check` returns a server-side estimate for terminals and scripts. It
  scores what the request exposes — the Vercel geo timezone
  (`x-vercel-ip-timezone`), country, the `Accept-Language` header and the
  User-Agent (emoji vendor + Chinese browser + Chinese device brand) — over
  the measurable 68/100 of the weight (Chinese fonts, vendor fonts and Intl
  locale are browser-only) and normalises it to 0–100, reusing the exact same
  scorers as the browser scan. The response language follows your
  `Accept-Language` header automatically.

```bash
# Text report — replies in the language of your Accept-Language header
curl https://fuck-claude.vercel.app/api/check

# Force a language via the request header
curl -H "Accept-Language: zh" https://fuck-claude.vercel.app/api/check

# JSON
curl "https://fuck-claude.vercel.app/api/check?format=json"
```

> The API is an IP/header estimate and differs from the in-browser OS scan; the
> geo headers only exist on the Vercel deployment.

## Tech stack

- [Astro](https://astro.build) `7.x`, static output (`output: 'static'`)
- [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/)
  adapter so the single on-demand route `/api/check` runs as a Vercel Function
  (every page still prerenders to static HTML)
- Built-in i18n: English at `/`, Chinese at `/zh/`, plus `@astrojs/sitemap`
- No UI framework; the scan/scoring logic is a single bundled TypeScript module
- Package manager: **pnpm**

## Project structure

```
src/
├── config/signals.ts    # signal definitions, weights, detectors, icons
├── config/sponsors.ts   # sponsor list (logo, link, EN/ZH taglines)
├── config/cn-models.ts  # domestic-model picks (DeepSeek / GLM / Kimi name-only links)
├── config/socials.ts    # header social profiles (Xiaohongshu / Douyin / X) + QR payloads
├── i18n/ui.ts           # EN/ZH copy dictionary + translator
├── scripts/detect.ts    # animated scan + scoring + verdict + share wiring (client)
├── scripts/track.ts     # GA click tracking for outbound promo links
├── layouts/BaseLayout.astro  # <head> SEO + GA + global styles
├── components/          # Detector (+ share buttons), Sponsors, CnModels, ScoreRing, Mascot, LangToggle, SocialLinks (QR popovers), Footer
└── pages/               # index.astro (en) + zh/index.astro + api/check.ts (curl/HTTP endpoint)
public/mascot/           # cartoon CEO state images (doze / search / low / medium / high)
public/sponsors/         # sponsor logos
scripts/
└── gen-assets.mjs       # regenerates favicon / PWA icons / og.png (node scripts/gen-assets.mjs)
skills/
└── detection-signals/SKILL.md  # agent playbook for adding/tuning detection signals
```

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # -> dist/
pnpm preview
```

## Deploy

Optimised for **Vercel** (`@astrojs/vercel`): every page prerenders to static
HTML and only `/api/check` runs as a Vercel Function that reads the request's
geo headers. It also works on any static host (Cloudflare Pages, Netlify,
GitHub Pages) — the site is fully functional there, only the `/api/check`
endpoint is Vercel-specific. Before deploying, set your real origin in
[`astro.config.mjs`](astro.config.mjs) (`site`) and
[`public/robots.txt`](public/robots.txt) so canonical URLs, `hreflang` links and the
sitemap point to the correct domain.

## Disclaimer

For reference only, based on public reverse-engineering reports of Claude Code's
former proxy-fingerprinting behaviour. Not an official statement or advice.

## License

Released under the [MIT License](LICENSE), © LinXiaoTao.

You are free to use, modify and redistribute this project, **but any copy or
substantial portion must keep the original copyright and license notice** (i.e.
credit the original project [`LinXiaoTao/FuckClaude`](https://github.com/LinXiaoTao/FuckClaude)).
If you redeploy it, please keep the footer credit / repo link so visitors can
find the original project.

---

<a id="中文"></a>

# Fuck Claude — 你是「Claude 中国用户」吗

[English](#fuck-claude--are-you-a-claude-china-user) | 中文

一个轻量、SEO 友好、中英双语的单页工具:扫描你的**浏览器环境**,判断你是否会被
Claude Code 标记为中国用户。点击后会有逐项检测的扫描动效,分数环随风险累加而增长,
最后给出结论与命中的信号列表。所有检测都在**本地浏览器**完成——不发起任何网络请求,
不上传任何数据。

本网站使用 **Claude Fable 5** 开发。

## 原理

当 Claude Code 通过 `ANTHROPIC_BASE_URL` 指向非官方中转时,据公开逆向分析它会读取
**系统时区**与**中转 hostname**,再把结果用隐写术编码进 system prompt 的
`Today's date is …` 这一行(命中中国时区时日期分隔符 `-` 变 `/`;撇号在 4 种视觉几乎
相同的 Unicode 变体间切换,编码是否命中域名清单 / AI 实验室关键词)。

网页只能读取浏览器可见信号。关键在于:`Intl` 读到的时区与 Claude Code 读的是**同一个
操作系统时区**,因此时区是唯一能直接对应 Claude 真实判定的信号;其余信号属于更广义的
「中文环境指纹」。

## 赞助商

[想显示在下方？](mailto:linxiaotao1993@gmail.com)

| 🏆 赞助商 🏆 | 介绍 |
| --- | --- |
| <a href="https://ergouapi.com/r/gh-fuckclaude"><img src="public/sponsors/ergou-wordmark-340x112.png" width="170" alt="二狗 API"></a> | **[二狗 API](https://ergouapi.com/r/gh-fuckclaude)**<br>感谢 二狗 API 赞助本项目!接入二狗,稳如老狗。二狗 API 中转站全站 0.1x~0.2x 超低倍率,提供 **Claude**/GPT/Gemini 等多个国内外 100% 纯血大模型接口;顶级 IPLC 线路 + 住宅双 ISP 冗余,确保全国范围稳定低延迟访问。欢迎各位开发者、工作室[注册使用](https://ergouapi.com/r/gh-fuckclaude)。 |
| <a href="https://roxybrowser.com/invite/0326196A"><img src="public/sponsors/roxy-wordmark.jpg" width="140" alt="Roxy 浏览器"></a> | **[Roxy 浏览器 \| 养号&多账号防封号](https://roxybrowser.com/invite/0326196A)**(优惠码 9 折)<br>感谢 Roxy 浏览器 赞助本项目!专为绕过 AI 平台风控检测而生!完美屏蔽 Canvas、WebGL 等底层指纹,实现多账号绝对物理隔离,批量养号稳定防封。 |
| <a href="https://agentearth.ai/r/NYf7jJZq"><img src="public/sponsors/agentearth-wordmark-290x48.png" width="170" alt="AgentEarth"></a> | **[AgentEarth](https://agentearth.ai/r/NYf7jJZq)**<br>感谢 AgentEarth 赞助本项目!你的智能体需要的是能把事情做对的工具:AgentEarth 把 600+ 即插即用的外部 API 工具——AI 生成、搜索、爬虫、地图、天气、金融数据等——汇聚在一个 MCP 接入点。欢迎[立即接入](https://agentearth.ai/r/NYf7jJZq)。 |
| <a href="https://www.geek2api.com/?utm_source=fuckclaude&utm_medium=sponsor"><img src="public/sponsors/geek2api-wordmark-340x108.jpg" width="170" alt="Geek2API"></a> | **[Geek2API 企业级 AI 中转站](https://www.geek2api.com/?utm_source=fuckclaude&utm_medium=sponsor)**<br>感谢 Geek2API 赞助本项目!高校企业都在选择的超低倍率中转站,支持 **Claude**/GPT/Gemini/Image2 全模型接入,全站超低倍率,并可开发票。欢迎[立即体验](https://www.geek2api.com/?utm_source=fuckclaude&utm_medium=sponsor)。 |

## 检测信号与权重

| 信号 | 权重 | 检测方式 |
| --- | --- | --- |
| 系统时区 | 26 | `Intl.DateTimeFormat().resolvedOptions().timeZone` 对比 `Asia/Shanghai`、`Asia/Urumqi` 等(**Claude 实际使用**) |
| 浏览器语言 | 20 | `navigator.language(s)`;`zh-CN` / `zh-Hans` 得分最高 |
| 已安装中文字体 | 16 | canvas 宽度探测简/繁体中文字体(微软雅黑、PingFang SC 等) |
| 国产厂商字体 | 10 | canvas 探测厂商 / 软件字体(MiSans、鸿蒙黑体、OPPO Sans、WPS 方正 FZ\* 等),命中即强信号 |
| 国产浏览器 / WebView | 8 | UA + UA-CH brands 匹配微信、QQ、夸克、UC、百度、360、搜狗、抖音等 |
| 国产品牌设备 | 6 | UA-CH 高熵 `model`(`navigator.userAgentData`)+ UA 匹配鸿蒙、华为、小米、OPPO、vivo 等 |
| Intl 区域设置 | 6 | `Intl` 解析出的 locale(日期 / 数字格式) |
| 时区偏移 | 4 | `getTimezoneOffset() === -480`(UTC+8) |
| Emoji 渲染风格 | 4 | 由平台 / UA 推断 OS 厂商,弱相关 |

每个信号输出 `0–1` 的「中国相似度」,乘以权重;九项权重合计为 **100**,所以总分即各项
贡献之和。分档:低 `0–30`、中 `31–60`、高 `61–100`。信号得分 ≥ 0.25 记为「命中」。

> 台湾不在 Anthropic 的封禁名单内,因此 `Asia/Taipei` 时区与 `zh-TW` 语言 / locale
> **不计分**;繁体中文字体只保留极低的模糊分(无法区分台湾与港澳)。香港、澳门
> 属于受限地区,相关信号保留部分风险分。

## 分享与 API

- **一键分享** —— 检测完成后,可连同自动生成的结果图片一起,通过系统原生分享面板
  (Web Share API,移动端会弹出真实的应用列表)分享结论,或直达 X、微博、Telegram、
  Facebook、LinkedIn、Reddit,以及复制链接。「重新扫描」按钮旁还会出现 **保存结果图片**。
- **curl / HTTP 接口** —— 网站是静态的,但 `/api/check` 是一个极小的 Vercel Function,
  为终端与脚本返回服务端估算。它基于请求可见的信息评分 —— Vercel 归属地时区
  (`x-vercel-ip-timezone`)、国家、`Accept-Language` 头与 User-Agent(emoji 厂商 +
  国产浏览器 + 国产品牌设备)—— 在可检测的 68/100 权重上(中文字体、厂商字体与
  Intl locale 仅浏览器可测)归一化到 0–100,复用与浏览器扫描完全一致的评分器。
  响应语言会自动跟随你的 `Accept-Language` 请求头。

```bash
# 纯文本报告 —— 语言自动跟随 Accept-Language 请求头
curl https://fuck-claude.vercel.app/api/check

# 通过请求头指定语言
curl -H "Accept-Language: zh" https://fuck-claude.vercel.app/api/check

# JSON
curl "https://fuck-claude.vercel.app/api/check?format=json"
```

> 该接口是基于 IP / 请求头的估算,与浏览器端读取操作系统的检测结果不同;geo 头仅在
> Vercel 部署上存在。

## 技术栈

- [Astro](https://astro.build) `7.x`,静态输出(`output: 'static'`)
- [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/)
  适配器,让唯一的按需路由 `/api/check` 作为 Vercel Function 运行(其余页面仍全部
  预渲染为静态 HTML)
- 内置 i18n:英文在 `/`,中文在 `/zh/`,并使用 `@astrojs/sitemap`
- 不依赖任何 UI 框架;扫描 / 打分逻辑是单个打包的 TypeScript 模块
- 包管理器:**pnpm**

## 目录结构

```
src/
├── config/signals.ts    # 信号定义、权重、检测函数、图标
├── config/sponsors.ts   # 赞助商列表(logo、链接、中英文案)
├── config/cn-models.ts  # 国产模型推荐(DeepSeek / GLM / Kimi 纯文字链接)
├── config/socials.ts    # 头部社交主页(小红书 / 抖音 / X)+ 二维码内容
├── i18n/ui.ts           # 中英文案字典 + 取值 helper
├── scripts/detect.ts    # 扫描动效 + 打分 + 结论 + 分享逻辑(客户端)
├── scripts/track.ts     # 出站推广链接的 GA 点击埋点
├── layouts/BaseLayout.astro  # <head> SEO + GA + 全局样式
├── components/          # Detector(含分享按钮)、Sponsors、CnModels、ScoreRing、Mascot、LangToggle、SocialLinks(二维码浮层)、Footer
└── pages/               # index.astro(英)+ zh/index.astro + api/check.ts(curl/HTTP 接口)(中)
public/mascot/           # 卡通 CEO 各状态图(打瞌睡 / 检测中 / 低 / 中 / 高风险)
public/sponsors/         # 赞助商 logo
scripts/
└── gen-assets.mjs       # 重新生成 favicon / PWA 图标 / og.png(node scripts/gen-assets.mjs)
skills/
└── detection-signals/SKILL.md  # 新增 / 调整检测信号的 agent 操作手册
```

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # 产物在 dist/
pnpm preview
```

## 部署

针对 **Vercel** 优化(`@astrojs/vercel`):所有页面都会预渲染为静态 HTML,只有
`/api/check` 作为 Vercel Function 运行以读取请求的 geo 头。它同样支持任意静态托管
(Cloudflare Pages、Netlify、GitHub Pages)—— 网站在这些平台上完全可用,只有
`/api/check` 接口是 Vercel 特有的。部署前请把 [`astro.config.mjs`](astro.config.mjs) 的
`site` 和 [`public/robots.txt`](public/robots.txt) 换成你的真实域名,以保证 canonical、
`hreflang` 与 sitemap 指向正确。

## 免责声明

本工具仅供参考,基于对 Claude Code 早期中转指纹行为的公开逆向分析,不构成任何官方结论
或建议。

## 开源协议

基于 [MIT 协议](LICENSE) 开源,© LinXiaoTao。

你可以自由使用、修改与再分发本项目,**但任何副本或实质性部分都必须保留原始的版权与许可
声明**(即注明来自原项目 [`LinXiaoTao/FuckClaude`](https://github.com/LinXiaoTao/FuckClaude))。
若你重新部署,请保留页脚署名 / 仓库链接,方便访问者找到原项目。
