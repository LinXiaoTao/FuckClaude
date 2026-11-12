/** China-only lists shared by the cn region profile and detectors (also re-exported from signals.ts). */

export const CN_TIMEZONES = [
  'Asia/Shanghai',
  'Asia/Urumqi',
  'Asia/Chongqing',
  'Asia/Chungking',
  'Asia/Harbin',
  'Asia/Kashgar',
];
export const CLAUDE_TIMEZONES = ['Asia/Shanghai', 'Asia/Urumqi'];
export const GREATER_CN_TIMEZONES = ['Asia/Hong_Kong', 'Asia/Macau'];

export const FONTS_SC = [
  'Microsoft YaHei',
  'Microsoft YaHei UI',
  'SimSun',
  'NSimSun',
  'SimHei',
  'KaiTi',
  'FangSong',
  'DengXian',
  'PingFang SC',
  'Hiragino Sans GB',
  'STHeiti',
  'STSong',
  'Songti SC',
  'Source Han Sans CN',
  'Source Han Sans SC',
  'Noto Sans CJK SC',
  'Noto Serif CJK SC',
  'WenQuanYi Micro Hei',
  'WenQuanYi Zen Hei',
];
export const FONTS_TC = [
  'Microsoft JhengHei',
  'PMingLiU',
  'MingLiU',
  'DFKai-SB',
  'PingFang TC',
  'PingFang HK',
  'Source Han Sans TW',
  'Noto Sans CJK TC',
];
export const FONTS_CN_VENDOR = [
  'MiSans',
  'MIUI',
  'HarmonyOS Sans SC',
  'HarmonyOS Sans',
  'HONOR Sans',
  'OPPO Sans',
  'vivo Sans',
  'Alibaba PuHuiTi',
  'Alibaba Sans',
  'DingTalk JinBuTi',
  'Douyin Sans',
  'HYQiHei',
  'FZShuSong-Z01S',
  'FZKai-Z03S',
  'FZHei-B01S',
  'FZFangSong-Z02S',
];

export const CN_BROWSER_PATTERNS: Array<[RegExp, string]> = [
  [/micromessenger|wxwork/i, 'WeChat'],
  [/mqqbrowser|qqbrowser|\bqq\//i, 'QQ Browser'],
  [/quark/i, 'Quark'],
  [/ucbrowser|ucweb/i, 'UC Browser'],
  [/baiduboxapp|bidubrowser|baidubrowser/i, 'Baidu'],
  [/miuibrowser|xiaomi\/|mibrowser/i, 'Mi Browser'],
  [/huaweibrowser/i, 'Huawei Browser'],
  [/heytapbrowser|oppobrowser/i, 'HeyTap (OPPO)'],
  [/vivobrowser/i, 'vivo Browser'],
  [/sogoumobilebrowser|\bmetasr\b|\bse 2\.x\b/i, 'Sogou'],
  [/maxthon/i, 'Maxthon'],
  [/360se|360ee|qihoobrowser|\bqhbrowser\b/i, '360 Browser'],
  [/2345explorer|2345browser/i, '2345'],
  [/lbbrowser/i, 'Liebao'],
  [/theworld/i, 'TheWorld'],
  [/aweme|bytedancewebview|newsarticle|toutiaomicroapp/i, 'Douyin / Toutiao'],
  [/alipayclient/i, 'Alipay'],
  [/dingtalk/i, 'DingTalk'],
  [/weibo/i, 'Weibo'],
  [/xiaohongshu|xhsminiapp/i, 'Xiaohongshu'],
  [/\bbilibili\b/i, 'Bilibili'],
];

export const CN_DEVICE_PATTERNS: Array<[RegExp, string, number]> = [
  [/harmonyos|openharmony/i, 'HarmonyOS', 1],
  [/huawei|\bhonor\b/i, 'Huawei / Honor', 0.8],
  [/meizu/i, 'Meizu', 0.8],
  [/nubia|\bzte\b/i, 'ZTE / nubia', 0.7],
  [/xiaomi|redmi|\bpoco\b|\bm2\d{3}[a-z0-9]+\b/i, 'Xiaomi', 0.6],
  [/oppo|\bpd[a-z]m\d{2}\b/i, 'OPPO', 0.6],
  [/vivo|\bv2\d{3}[a-z]{1,2}\b/i, 'vivo', 0.6],
  [/realme|\brmx\d{4}\b/i, 'realme', 0.6],
  [/oneplus/i, 'OnePlus', 0.6],
  [/\blenovo\b|\bzuk\b/i, 'Lenovo', 0.5],
];
