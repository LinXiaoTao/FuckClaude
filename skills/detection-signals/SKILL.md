---
name: detection-signals
description: Add, adjust or remove "China user" detection signals in the FuckClaude project (browser scan + /api/check). Use when adding detection methods, changing signal weights or scorers, or when the user mentions 检测信号 / 检测手段 / 新增检测 / signals / weights / detectors.
---

# 检测信号(Detection Signals)开发

本项目的核心是一组「中国用户」指纹信号:浏览器端跑扫描动画逐项检测,服务端 `/api/check` 复用同一批纯评分函数做估算。所有检测**只读浏览器 API,零上传**。

## 信号解剖(src/config/signals.ts)

```ts
export type SignalId = 'timezone' | /* … */ | 'emoji'; // 先扩展联合类型

interface SignalDef {
  id: SignalId;
  weight: number;        // 所有信号权重之和必须恰好 = 100
  claudeUsed?: boolean;  // 仅当 Claude Code 真实机制读取该信号时为 true
  icon: string;          // 内联 SVG(24×24, stroke=currentColor, 复用 ICON 表)
  detect: () => DetectOutcome | Promise<DetectOutcome>; // 支持 async(如 UA-CH 高熵值)
}

interface DetectOutcome {
  raw: string;   // 展示给用户的检测值,如 'Asia/Shanghai'、'none detected'
  score: number; // 0..1 的「中国相似度」;≥0.25 记为命中,≥0.6 为 high
}
```

- `detect()` 内部禁止网络请求;异常无需自行兜底,调用方 `detect.ts` 已 try/catch。
- 探测字体用现成的 `isFontAvailable(font, ctx)`(canvas 宽度探测)。
- 读 UA-CH 用 `uaData()` helper;高熵值(`model` 等)需 `await getHighEntropyValues`,拿不到时降级为纯 UA 正则。

## 新增一个信号的完整清单

1. **signals.ts**
   - `SignalId` 联合类型加新 id。
   - 写 `detectXxx()`;若服务端(仅凭请求头)也能测,把纯打分逻辑抽成
     `export function scoreXxx(probe: string)` 供 API 复用(参照
     `scoreTimezone` / `scoreLanguages` / `scoreCnBrowser` / `scoreCnDevice`)。
   - 在 `SIGNALS` 数组按权重降序插入,并**重新分配权重使总和 = 100**。
   - 图标加进 `ICON` 表(线性 stroke 风格,与现有一致)。
2. **i18n/ui.ts**(en + zh 两份都要)
   - 新增 `signal.<id>.name` 与 `signal.<id>.desc`。
   - 以下文案硬编码了信号数量,改动数量时同步更新:
     `signals.sub`(N 项指纹)、`how.p2`(N-1 项叠加指纹列表)、`faq.a2`(其余 N-1 项)。
3. **pages/api/check.ts**(仅当服务端可测)
   - `analyze()` 的 `measured` map 增加条目,复用第 1 步导出的纯评分函数。
   - 更新文件头注释与 `note` 里的 browser-only 列表及可测权重数(当前 62/100)。
4. **layouts/BaseLayout.astro**:JSON-LD `featureList` 追加 `t('signal.<id>.name')`。
5. **README.md**:英文与中文两张「信号与权重」表、API 段落的可测权重描述。

## 打分约定

- 决定性证据(如系统时区命中中国时区、检出国产厂商字体)→ score 接近 1。
- 全球化品牌 / 弱相关线索(如小米设备、emoji 风格)→ 0.4–0.7,并压低 weight。
- 检不到 / 不适用 → `{ raw: 'none detected', score: 0 }`,不要抛错。
- 阈值语义:`signalVerdict` — ≥0.6 high、≥0.25 medium(命中)、其余 low。

## 验证(必做)

```bash
pnpm build                 # tsc + astro 构建必须通过
pnpm dev                   # http://localhost:4321
```

- 浏览器打开 `/zh/` 点「开始检测」,确认新信号出现、动画逐项走完、总分 ≤100。
- 服务端可测信号用伪造 UA 验证,例如:

```bash
curl -s "http://localhost:4321/api/check?format=json" \
  -H "User-Agent: Mozilla/5.0 (Linux; Android 12; HarmonyOS; NOH-AN00) MicroMessenger/8.0.47" \
  -H "Accept-Language: zh-CN,zh;q=0.9"
```

检查 JSON 里新信号 `measured: true`、`coverage.measuredWeight` 与注释一致。

## 常见陷阱

- 权重总和 ≠ 100:总分语义会坏掉(README 与文案都声称满分 100)。
- 只改了英文文案忘了中文(或反之):`ui.ts` 是 en/zh 双份字典。
- 服务端 scorer 与浏览器 detect 各写一套逻辑导致结果漂移:必须共用纯函数。
- UA 正则过宽误伤(如 `/mi/` 会匹配 "Mozilla"):用 `\b` 边界并放到真机 UA 上验证。
