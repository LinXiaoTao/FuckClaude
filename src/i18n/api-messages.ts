import type { Localized } from './types';

export const API_IP_RATE_LIMIT: Localized = {
  en: 'Too many requests for this IP. Try again in about a minute.',
  zh: '这个 IP 的请求太频繁，请约一分钟后再试。',
};

export const API_IP_FAILED: Localized = {
  en: 'IP purity check failed.',
  zh: 'IP 纯净度检查失败。',
};

export const CHECK_CLI_SUBTITLE: Localized = {
  en: 'Claude "China user" check',
  zh: '「Claude 中国用户」检测',
};

export const CHECK_CLI_TAGLINE: Localized = {
  en: 'Server-side estimate from IP geo + request headers',
  zh: '基于 IP 归属地 + 请求头的服务端估算',
};

export const CHECK_CLI_SCORE: Localized = {
  en: 'Score',
  zh: '风险分',
};

export const CHECK_CLI_MEASURED: Localized = {
  en: 'Signals visible server-side',
  zh: '服务端可见信号',
};

export const CHECK_CLI_BROWSER_ONLY: Localized = {
  en: 'Browser-only (invisible to curl)',
  zh: '仅浏览器可测(curl 看不到)',
};

export const CHECK_CLI_COVERAGE: Localized = {
  en: 'Coverage',
  zh: '覆盖',
};

export const CHECK_CLI_GEO: Localized = {
  en: 'Geo',
  zh: '归属地',
};

export const CHECK_CLI_NOTE: Localized = {
  en: 'IP/header estimate; differs from the in-browser OS scan.',
  zh: 'IP/请求头估算,与浏览器端系统检测结果可能不同。',
};

export const CHECK_CLI_FULL: Localized = {
  en: 'Full scan',
  zh: '完整检测',
};

export const CHECK_CLI_HINT_JSON: Localized = {
  en: 'JSON      → add ?format=json',
  zh: 'JSON      → 加 ?format=json',
};

export const CHECK_CLI_HINT_LANG: Localized = {
  en: 'Language  → follows Accept-Language',
  zh: '语言      → 自动跟随 Accept-Language',
};

export const CHECK_CLI_NONE: Localized = {
  en: 'none',
  zh: '无',
};

export const IP_TEXT_HEADER: Localized = {
  en: 'Fuck Claude · IP purity (separate from the China-user score)',
  zh: 'Fuck Claude · IP 纯净度（与中国用户分独立）',
};

export const IP_TEXT_UNKNOWN_IP: Localized = {
  en: 'unknown',
  zh: '未知',
};

export const IP_TEXT_PURITY: Localized = {
  en: 'Purity',
  zh: '纯净度',
};

export const IP_TEXT_TYPE: Localized = {
  en: 'Type',
  zh: '类型',
};

export const IP_TEXT_PROXY: Localized = {
  en: 'Proxy',
  zh: '代理',
};

export const IP_TEXT_DATACENTER: Localized = {
  en: 'Datacenter',
  zh: '机房',
};

export const IP_TEXT_NA: Localized = {
  en: 'n/a',
  zh: '无',
};

export const BOOL_YES: Localized = { en: 'yes', zh: '是' };
export const BOOL_NO: Localized = { en: 'no', zh: '否' };
export const BOOL_UNKNOWN: Localized = { en: '?', zh: '?' };

export const CHECK_JSON_NOTE: Localized = {
  en: 'Server-side estimate from IP geo + request headers; it can differ from the in-browser OS scan. Chinese fonts, vendor fonts, Intl locale and WebRTC leaks can only be measured in a browser.',
  zh: '基于 IP 归属地与请求头的服务端估算,与浏览器端读取操作系统的检测结果可能不同;中文字体、厂商字体、Intl locale 与 WebRTC 泄露只能在浏览器里检测。',
};
