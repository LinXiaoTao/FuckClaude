# Site Locale Control / 站点区域控制

Manifest V3 扩展。只改已授权站点看到的时区、时区偏移、语言、`Intl` 默认区域，以及可选的桌面 Chrome 标识、字体测量和网页内 WebRTC 候选。不改系统时区，也不改 IP 地址。

## 开发

在 `extension/` 目录里：

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

`pnpm build` 会生成时区、语言、字体名单和 UA 配置片段，打包 `public/injected/patch.js`，生成图标，再用 WXT 产出 `.output/chrome-mv3`。

弹窗文案来自 `_locales/en` 和 `_locales/zh_CN`。默认语言是英语。

## 权限

固定权限只有 `storage`、`scripting`、`declarativeNetRequestWithHostAccess`。`privacy` 是可选权限，只在用户单独确认浏览器级 WebRTC 策略时申请。

可选主机权限：

- `https://claude.ai/*` 与 `https://*.claude.ai/*`
- `https://claude.com/*` 与 `https://*.claude.com/*`
- `https://fuck-claude.vercel.app/*`
- `https://*/*`，只给用户手动添加的具体 HTTPS 站点用。运行时按该站点的 origin 申请，不会直接请求通配。

正式构建没有 `host_permissions`，也没有 `<all_urls>`。

## `SLC_E2E=1`

自动化测试专用。这个环境变量会：

- 把 `host_permissions` 设为 `http://localhost/*` 和 `http://127.0.0.1/*`
- 把 `privacy` 同时放进 `permissions`，方便自动化直接调用策略接口。正式构建不会这样做
- 把 `localhost` 和 `127.0.0.1` 放进默认站点

产物写到 `.output-e2e`，避免覆盖正式包。正式构建不要设置 `SLC_E2E`。正式清单里不能出现 localhost，也不能把 `privacy` 放进固定权限。

```bash
SLC_E2E=1 pnpm build
node e2e/run.mjs
```

端到端脚本用 new headless，通过 Puppeteer 的 `enableExtensions` 和 `browser.installExtension()` 加载 `/usr/bin/google-chrome`。扩展目录和网站目录都相对这个脚本解析：扩展根是 `e2e/` 的上一级，仓库根是扩展根的上一级。网站读取 `<仓库根>/.vercel/output/static`，没有则读 `<仓库根>/dist`。结果写到 `/workspace/fc-ext-e2e2/`。网站构建需要 Node >= 22.12（Astro 7）；`e2e/run.mjs` 不会构建网站。

## 网站上的下载包

正式 zip 不进仓库。仓库根目录的 `pnpm build` 会先运行 `scripts/build-extension-zip.mjs`：在 `extension/` 里执行 `pnpm install --frozen-lockfile`（`PUPPETEER_SKIP_DOWNLOAD=1`），做一次不带 `SLC_E2E` 的生产构建，再用 `wxt zip` 打包。成品写到 `public/downloads/site-locale-control-<version>.zip`，根目录直接是 `manifest.json`，由网站 `/extension/` 提供下载。`public/downloads/` 已在 `.gitignore` 里。

可选的 WebRTC 子测试不替换上面的浏览器。先准备好 `SLC_E2E=1` 的构建，再执行 `node e2e/webrtc-cft.mjs`（或 `SLC_E2E_CFT=1 node e2e/run.mjs`）。它先看 `free -m`，用 `npx @puppeteer/browsers install chrome@<本机大版本> --path /workspace/.fc-e2e-tmp/cft` 下载 Chrome for Testing，加上 `--disable-features=WebRtcHideLocalIpsWithMdns`，跑 off、phase-2，以及浏览器级 `set('disable_non_proxied_udp')` / `clear()`。结果合并进同一份 `results.json` 和 `results.md` 的「WebRTC（Chrome for Testing）」一节。结束后只关掉这次启动的浏览器，并删除 `/workspace/.fc-e2e-tmp`。之后的 `pnpm e2e` 仍用 `/usr/bin/google-chrome`，重写结果时保留这一节。

## 配置怎么进页面

Service worker 用 `chrome.scripting.registerContentScripts` 注册 MAIN world 脚本（`document_start`、`allFrames`、`matchOriginAsFallback`，并尽量带上 `matchAboutBlank`）。同一次注册里按顺序执行：选中的时区片段、语言片段、四个开关片段、`patch.js`。片段把值写进临时全局槽位，`patch.js` 第一行读出并立刻删掉。不用 `sessionStorage`，不自动刷新，不用 `postMessage` 传配置。Chrome 155 的动态注册 schema 会拒绝 `matchAboutBlank`；这时去掉该字段再注册一次。`matchOriginAsFallback` 仍会注入 `about:blank` 和 `srcdoc` 帧。

## UA 预设

选项是「保持真实 UA」（默认）和「桌面 Chrome」。桌面预设使用本机操作系统和真实 Chrome 大版本：

- Windows：`Windows NT 10.0; Win64; x64`，`navigator.platform` 为 `Win32`
- macOS：`Macintosh; Intel Mac OS X 10_15_7`，`navigator.platform` 为 `MacIntel`
- Linux：`X11; Linux x86_64`，`navigator.platform` 为 `Linux x86_64`

UA 使用现行精简格式 `Chrome/<major>.0.0.0`。`userAgentData.brands` 含 Chromium、Google Chrome 和一个按该大版本算出的 GREASE brand，`mobile` 为 false，`model` 为空字符串。`getHighEntropyValues` 无论请求哪些 hint，都返回与这套预设一致的 brands、fullVersionList、mobile、platform、platformVersion、model、architecture、bitness、wow64。`navigator.vendor` 为 `Google Inc.`。

大版本来自真实 UA 或 brands 里的 Chrome/Chromium，必须和真实大版本相同。构建期按 3 种操作系统和 120 到 170 的大版本各写一个片段文件到 `public/snippets/ua/`。Service worker 只注册对得上的那一个。这些文件是扩展包里的数据，不是远程代码。超出 120–170 时不套用桌面预设。

Service worker 读取真实 `navigator.userAgent` 和 `navigator.userAgentData`，并用仓库 `../src/config/signals.ts` 里的 `scoreCnBrowser`、`scoreCnDevice` 判断。命中国产浏览器或国产设备时，弹窗会说明，并且「应用推荐」选中桌面 Chrome。都未命中时，「应用推荐」保持真实 UA。选「保持真实 UA」时不注册 UA 片段，也不添加 UA 相关的动态规则。

已授权站点上的请求头，和 `Accept-Language` 使用同一套 `requestDomains` / `regexFilter`。低熵头 `User-Agent`、`Sec-CH-UA`、`Sec-CH-UA-Mobile`、`Sec-CH-UA-Platform` 用 `set` 写成预设值。

高熵头 `Sec-CH-UA-Full-Version-List`、`Sec-CH-UA-Platform-Version`、`Sec-CH-UA-Model`、`Sec-CH-UA-Arch`、`Sec-CH-UA-Bitness`、`Sec-CH-UA-WoW64` 也用 `set`，值与预设一致。取舍是：`set` 会让没有请求这些 hint 的站点也收到它们；`remove` 会让已经请求的站点拿不到，浏览器在 `Accept-CH` 之后补上的真实高熵值也不会留下。这里选择 `set`，避免站点拿到半套真实高熵值、半套预设低熵值。若 Chrome 拒绝某个头，注册时会丢掉该头并记到 `chrome.storage.local` 的 `slc-dnr-notes`，回显请求仍能看到原值。

## 字体

隐藏名单来自 `../src/config/signals.ts` 源码里的 `FONTS_SC`、`FONTS_TC`、`FONTS_CN_VENDOR`。这三个数组没有 export，构建脚本解析源码生成 `src/generated/fonts.ts`。解析失败时构建失败，名单不手抄。

开关默认关闭。「应用推荐」会打开它。打开后，`CanvasRenderingContext2D.prototype.measureText` 和 `OffscreenCanvasRenderingContext2D.prototype.measureText` 在 `ctx.font` 含隐藏字体时，去掉这些 family 再测量。`FontFaceSet.prototype.check` 对含隐藏字体的参数返回 false。包装自己出错时回退到原始函数，不另外抛错。

局限：只对基于 canvas `measureText` / `fonts.check` 的探测有效。DOM 尺寸和像素比对挡不住。系统字体本身仍在，页面照常用它渲染。

## WebRTC

网页内过滤默认关闭。「应用推荐」会打开它，且不改浏览器策略。它包装 `RTCPeerConnection` 和仍然存在的 `webkitRTCPeerConnection`：`onicecandidate`、`addEventListener('icecandidate')`、三个本地描述 getter，以及 `createOffer` / `createAnswer` 返回的 SDP。暴露 IPv4 或 IPv6 的 host、srflx、prflx 候选会被丢掉。`.local` 的 mDNS 候选可以保留。relay 候选保留。candidate 为空的结束事件照常传递。不伪造地址。

「整个浏览器的 WebRTC 策略」是单独按钮，不属于「应用推荐」。点击后先显示确认，说明会影响所有网站并且可以撤销。确认后才 `chrome.permissions.request(['privacy'])`。`get` 之后只有 `levelOfControl` 为 `controllable_by_this_extension` 或 `controlled_by_this_extension` 才 `set('disable_non_proxied_udp')`。企业策略或其它扩展已经控制该项时，弹窗说明没有修改，不会覆盖。撤销会 `clear()`，再 `permissions.remove(['privacy'])`。

## 表情符号

不单独实现。它跟随 UA 和 `platform`。按网站 `scoreEmojiVendor`，Apple 贡献四舍五入后是 1 分，Windows 是 1 分，Linux 是 2 分。最低仍有 1 到 2 分，不能变成 0。桌面预设不会为了这一项假装另一个操作系统。

## 图标

源文件是 `assets/icon.svg`，几何图形，没有吉祥物，也没有品牌字样。`scripts/gen-icons.mjs` 用 sharp 生成 16、32、48、128 的 PNG，放在 `public/icons/` 并随构建进入清单的 `icons` 和 `action.default_icon`。

## 已知缺口

- Worker 里的 `Intl`、`navigator.userAgent` 和 `navigator.platform` 仍是浏览器真实值。发往已授权站点的请求头仍会被动态规则改写，所以 Worker 里的 UA 和请求头可能不一致。
- 包装函数的 `toString()` 不是 `[native code]`。
- 已经打开的页面需要手动刷新。
- 未授权的跨源 iframe 不会被改。
- 字体钩子挡不住 DOM 尺寸和像素比对。
- 表情符号按当前公式不能降到 0 分。
- 浏览器级 WebRTC 策略影响整个配置里的所有网站。企业策略优先，扩展不能覆盖。
