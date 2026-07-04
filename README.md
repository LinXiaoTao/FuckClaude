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
| <a href="https://agentearth.ai/r/NYf7jJZq"><img src="public/sponsors/agentearth-wordmark-290x48.png" width="170" alt="AgentEarth"></a> | **[AgentEarth](https://agentearth.ai/r/NYf7jJZq)**<br>Thanks to AgentEarth for sponsoring this project! Your agent needs tools that get things done right: AgentEarth puts 600+ plug-and-play external API tools — AI generation, web search, scraping, maps, weather, finance data and more — behind a single MCP endpoint. [Get started](https://agentearth.ai/r/NYf7jJZq) today. |

## Detected signals & weights

| Signal | Weight | How it's detected |
| --- | --- | --- |
| System timezone | 30 | `Intl.DateTimeFormat().resolvedOptions().timeZone` vs. `Asia/Shanghai`, `Asia/Urumqi`, … (**used by Claude**) |
| Browser language | 24 | `navigator.language(s)`; `zh-CN` / `zh-Hans` scores highest |
| Installed Chinese fonts | 20 | Canvas width-probing for SC/TC fonts (Microsoft YaHei, PingFang SC, …) |
| Intl locale | 10 | `Intl` resolved locale (date/number formatting) |
| Timezone offset | 8 | `getTimezoneOffset() === -480` (UTC+8) |
| Emoji rendering style | 8 | OS-vendor guess from platform/UA; weakly correlated |

Each signal returns a `0–1` "China-like" score, multiplied by its weight; the six
weights sum to **100**, so the total score is the sum of contributions. Bands: Low
`0–30`, Medium `31–60`, High `61–100`. A signal counts as a "hit" when its score
≥ 0.25.

## Tech stack

- [Astro](https://astro.build) `7.x`, static output (`output: 'static'`)
- Built-in i18n: English at `/`, Chinese at `/zh/`, plus `@astrojs/sitemap`
- No UI framework; the scan/scoring logic is a single bundled TypeScript module
- Package manager: **pnpm**

## Project structure

```
src/
├── config/signals.ts    # signal definitions, weights, detectors, icons
├── config/sponsors.ts   # sponsor list (logo, link, EN/ZH taglines)
├── config/cn-models.ts  # domestic-model picks (DeepSeek / GLM / Kimi name-only links)
├── i18n/ui.ts           # EN/ZH copy dictionary + translator
├── scripts/detect.ts    # animated scan + scoring + verdict (client)
├── scripts/track.ts     # GA click tracking for outbound promo links
├── layouts/BaseLayout.astro  # <head> SEO + GA + global styles
├── components/          # Detector, Sponsors, CnModels, ScoreRing, Mascot (animated Claude-CEO), LangToggle, Footer
└── pages/               # index.astro (en) + zh/index.astro
public/mascot/           # cartoon CEO state images (doze / search / low / medium / high)
public/sponsors/         # sponsor logos
scripts/
└── gen-assets.mjs       # regenerates favicon / PWA icons / og.png (node scripts/gen-assets.mjs)
```

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # -> dist/
pnpm preview
```

## Deploy

Any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages). Before deploying,
set your real origin in [`astro.config.mjs`](astro.config.mjs) (`site`) and
[`public/robots.txt`](public/robots.txt) so canonical URLs, `hreflang` links and the
sitemap point to the correct domain.

## Disclaimer

For reference only, based on public reverse-engineering reports of Claude Code's
former proxy-fingerprinting behaviour. Not an official statement or advice.

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

## 检测信号与权重

| 信号 | 权重 | 检测方式 |
| --- | --- | --- |
| 系统时区 | 30 | `Intl.DateTimeFormat().resolvedOptions().timeZone` 对比 `Asia/Shanghai`、`Asia/Urumqi` 等(**Claude 实际使用**) |
| 浏览器语言 | 24 | `navigator.language(s)`;`zh-CN` / `zh-Hans` 得分最高 |
| 已安装中文字体 | 20 | canvas 宽度探测简/繁体中文字体(微软雅黑、PingFang SC 等) |
| Intl 区域设置 | 10 | `Intl` 解析出的 locale(日期 / 数字格式) |
| 时区偏移 | 8 | `getTimezoneOffset() === -480`(UTC+8) |
| Emoji 渲染风格 | 8 | 由平台 / UA 推断 OS 厂商,弱相关 |

每个信号输出 `0–1` 的「中国相似度」,乘以权重;六项权重合计为 **100**,所以总分即各项
贡献之和。分档:低 `0–30`、中 `31–60`、高 `61–100`。信号得分 ≥ 0.25 记为「命中」。

## 技术栈

- [Astro](https://astro.build) `7.x`,静态输出(`output: 'static'`)
- 内置 i18n:英文在 `/`,中文在 `/zh/`,并使用 `@astrojs/sitemap`
- 不依赖任何 UI 框架;扫描 / 打分逻辑是单个打包的 TypeScript 模块
- 包管理器:**pnpm**

## 目录结构

```
src/
├── config/signals.ts    # 信号定义、权重、检测函数、图标
├── config/sponsors.ts   # 赞助商列表(logo、链接、中英文案)
├── config/cn-models.ts  # 国产模型推荐(DeepSeek / GLM / Kimi 纯文字链接)
├── i18n/ui.ts           # 中英文案字典 + 取值 helper
├── scripts/detect.ts    # 扫描动效 + 打分 + 结论(客户端)
├── scripts/track.ts     # 出站推广链接的 GA 点击埋点
├── layouts/BaseLayout.astro  # <head> SEO + GA + 全局样式
├── components/          # Detector、Sponsors、CnModels、ScoreRing、Mascot(会动的 Claude CEO)、LangToggle、Footer
└── pages/               # index.astro(英)+ zh/index.astro(中)
public/mascot/           # 卡通 CEO 各状态图(打瞌睡 / 检测中 / 低 / 中 / 高风险)
public/sponsors/         # 赞助商 logo
scripts/
└── gen-assets.mjs       # 重新生成 favicon / PWA 图标 / og.png(node scripts/gen-assets.mjs)
```

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # 产物在 dist/
pnpm preview
```

## 部署

支持任意静态托管(Cloudflare Pages、Vercel、Netlify、GitHub Pages)。部署前请把
[`astro.config.mjs`](astro.config.mjs) 的 `site` 和 [`public/robots.txt`](public/robots.txt)
换成你的真实域名,以保证 canonical、`hreflang` 与 sitemap 指向正确。

## 免责声明

本工具仅供参考,基于对 Claude Code 早期中转指纹行为的公开逆向分析,不构成任何官方结论
或建议。
