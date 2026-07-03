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

## Detected signals & weights

| Signal | Weight | How it's detected |
| --- | --- | --- |
| System timezone | 30 | `Intl.DateTimeFormat().resolvedOptions().timeZone` vs. `Asia/Shanghai`, `Asia/Urumqi`, … (**used by Claude**); `Asia/Tokyo` is shown as the Osaka baseline |
| Browser language | 24 | `navigator.language(s)`; `zh-CN` / `zh-Hans` scores highest, while `ja-JP` / Japanese is the Osaka baseline |
| Installed Chinese fonts | 20 | Canvas width-probing for SC/TC fonts (Microsoft YaHei, PingFang SC, …) |
| Intl locale | 10 | `Intl` resolved locale (date/number formatting); `ja-JP` is shown as the Osaka baseline |
| Timezone offset | 8 | `getTimezoneOffset() === -480` (UTC+8); Osaka / `Asia/Tokyo` is UTC+9 |
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
├── i18n/ui.ts           # EN/ZH copy dictionary + translator
├── scripts/detect.ts    # animated scan + scoring + verdict (client)
├── layouts/BaseLayout.astro  # <head> SEO + GA + global styles
├── components/          # Detector, ScoreRing, Mascot (animated Claude-CEO), LangToggle, Footer
└── pages/               # index.astro (en) + zh/index.astro
public/mascot/           # cartoon CEO state images (doze / search / low / medium / high)
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

## 检测信号与权重

| 信号 | 权重 | 检测方式 |
| --- | --- | --- |
| 系统时区 | 30 | `Intl.DateTimeFormat().resolvedOptions().timeZone` 对比 `Asia/Shanghai`、`Asia/Urumqi` 等(**Claude 实际使用**);`Asia/Tokyo` 显示为大阪基线 |
| 浏览器语言 | 24 | `navigator.language(s)`;`zh-CN` / `zh-Hans` 得分最高,`ja-JP` / 日语为大阪基线 |
| 已安装中文字体 | 20 | canvas 宽度探测简/繁体中文字体(微软雅黑、PingFang SC 等) |
| Intl 区域设置 | 10 | `Intl` 解析出的 locale(日期 / 数字格式);`ja-JP` 显示为大阪基线 |
| 时区偏移 | 8 | `getTimezoneOffset() === -480`(UTC+8);大阪 / `Asia/Tokyo` 为 UTC+9 |
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
├── i18n/ui.ts           # 中英文案字典 + 取值 helper
├── scripts/detect.ts    # 扫描动效 + 打分 + 结论(客户端)
├── layouts/BaseLayout.astro  # <head> SEO + GA + 全局样式
├── components/          # Detector、ScoreRing、Mascot(会动的 Claude CEO)、LangToggle、Footer
└── pages/               # index.astro(英)+ zh/index.astro(中)
public/mascot/           # 卡通 CEO 各状态图(打瞌睡 / 检测中 / 低 / 中 / 高风险)
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
