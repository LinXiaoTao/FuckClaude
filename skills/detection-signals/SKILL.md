---
name: detection-signals
description: Add, adjust or remove detection signals in the FuckClaude project (browser scan + /api/check). Use when adding detection methods, changing signal weights or scorers, or when the user mentions 检测信号 / 检测手段 / 新增检测 / signals / weights / detectors / regions.
---

# 检测信号 (Detection Signals)

浏览器端扫描与 `/api/check` 共用同一套**纯评分函数**。检测只读浏览器 API，零上传。

## 区域档案 (`src/config/regions.ts`)

每页语言映射到 `RegionId`（`regionForLang`）：`en`/`zh` → `cn`（中国信号，与改造前一致）；`ru`、`fa`→`ir`、`es`→`cu`、`ar`→`sy`、`my`→`mm` 使用各自时区、语言、字体、浏览器等列表。

`RegionProfile` 含 `timezones`、`partialTimezones`（仅 cn 港澳 0.6）、`languages`、`fonts`、`vendorFonts`、`browsers`、`devices`、`offsetEastMinutes`、`weights`（总和必须 100；列表为空则对应 weight 为 0）。

## 信号 API (`src/config/signals.ts`)

- `signalsFor(regionId)`：返回 weight>0 的信号，降序排列，detector 绑定该区域档案。
- `SIGNALS`：`signalsFor('cn')` 的别名（扩展等仍假设中国档）。
- 纯函数：`scoreTimezoneForRegion`、`scoreLanguagesForRegion`（cn 仍用 `scoreLanguages`）、`scoreBrowserForRegion`、`scoreDeviceForRegion`、`scoreTimezoneOffsetMinutes` 等，供 API 与客户端共用。
- `claudeUsed` 仅 `cn` 的 `timezone` 为 true。

中国专用列表在 `src/config/signals-cn-assets.ts`（`FONTS_SC` 等；扩展 snippet 生成读取此文件）。

## 改信号时的清单

1. **regions.ts**：改档案数据或 `weights`；运行 `npm run signals:check`。
2. **signals.ts**：改 detector / 纯函数；非 cn 区域勿破坏 `scoreLanguages` 台湾/HK 规则。
3. **Detector.astro** / **detect.ts**：已用 `signalsFor(regionForLang(...))`，一般无需再改。
4. **api/check.ts**：可测信号由 `isServerMeasurable` + 区域 weight 决定；勿写死 62/100。
5. **BaseLayout.astro**：`featureList` 随 `signalsFor` 变化。
6. **i18n**：`signal.<id>.name/desc` 覆盖全部 `SignalId`（含 weight 0 的 id）。改某区域的信号集合时，同步该语言 `messages/<lang>.ts` 中的 `signals.sub`、`how.p1/p2`、`why.*`、`reduce.*`、`faq.a2–a4/a8`，使文案只描述该区域真正检查的项。

## 验证

```bash
npm run signals:check
npx astro build
npm run i18n:validate -- <ru|fa|es|ar|my>
```

构建后抽查 `dist/client/<locale>/index.html` 中 `data-signal=` 行数：`en`/`zh` 10 行；`ru`/`fa`/`my` 7；`es` 5；`ar` 6。

## 常见陷阱

- 权重总和 ≠ 100 或「空列表 ↔ weight 0」不一致 → 模块加载或 `signals:check` 失败。
- 只为 cn 写特殊逻辑却忘记 `regionId === 'cn'` 分支。
- API 与浏览器各写一套打分逻辑 → 必须共用 `score*ForRegion`。
