/**
 * IP purity aggregation for `/api/ip`.
 *
 * 2026-11-03 decision: this score is purity 0–100 (higher = cleaner / more
 * residential-like). It is a different number from the China-user score and
 * must never be added to, averaged with, or written into that score.
 *
 * The scored IP is always the request egress. A client `?ip=` is ignored.
 * Reputation keys stay in server env (`PROXYCHECK_API_KEY`, `ABUSEIPDB_API_KEY`)
 * and are never returned to the browser. ipwho.is is geo/ASN fallback only.
 *
 * Cache and rate limit are in-memory on this instance only. Vercel can run
 * many isolates, and a cold start drops both. That is a short de-dupe, not a
 * durable store and not a visitor profile.
 */

export type SourceStatus = 'ok' | 'unavailable' | 'unconfigured' | 'error';
export type NetworkType = 'Residential' | 'Datacenter' | 'Business' | 'Unknown';
export type PurityBand = 'high' | 'medium' | 'low';
export type HintLevel = 'ok' | 'caution' | 'risky';
export type NoticeCode = 'no_ip' | 'private_ip' | 'unconfigured' | 'partial' | 'degraded';

export interface Deduction {
  code: string;
  /** English explanation for API clients. The UI translates `code`. */
  label: string;
  /** Points added to the starting 100. Zero or negative. */
  points: number;
  source: string;
}

export interface SourceReport {
  status: SourceStatus;
  detail?: string;
}

export interface Geo {
  country: string | null;
  region: string | null;
  city: string | null;
  countryCode: string | null;
}

export interface Network {
  asn: string | null;
  org: string | null;
  isp: string | null;
  type: NetworkType;
}

export interface Flags {
  proxy: boolean | null;
  vpn: boolean | null;
  tor: boolean | null;
  datacenter: boolean | null;
  abusive: boolean | null;
}

export interface ClaudeHint {
  level: HintLevel;
  textEn: string;
  textZh: string;
}

export interface Notice {
  code: NoticeCode;
  textEn: string;
  textZh: string;
}

export interface IpPurityResponse {
  ip: string | null;
  purity: number | null;
  band: PurityBand | null;
  geo: Geo;
  network: Network;
  flags: Flags;
  claudeHint: ClaudeHint;
  deductions: Deduction[];
  sources: {
    proxycheck: SourceReport;
    abuseipdb: SourceReport;
    ipwho: SourceReport;
  };
  sourcesConfigured: boolean;
  notice: Notice | null;
  cached: boolean;
  disclaimer: string;
}

export interface ParsedSource {
  status: SourceStatus;
  detail?: string;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  countryCode?: string | null;
  asn?: string | null;
  org?: string | null;
  isp?: string | null;
  type?: NetworkType | null;
  proxy?: boolean | null;
  vpn?: boolean | null;
  tor?: boolean | null;
  datacenter?: boolean | null;
  abusive?: boolean | null;
  abuseConfidence?: number | null;
  risk?: number | null;
}

export const DISCLAIMER = {
  en: 'Heuristic only. Not an Anthropic product and not a guarantee of passing Claude. IP purity is separate from the China-user score and is never merged into it.',
  zh: '仅为启发式判断，不是 Anthropic 的产品，也不保证能通过 Claude。IP 纯净度与中国用户分相互独立，绝不并入该分数。',
} as const;

/** Per-instance de-dupe. Not shared across serverless isolates. */
const CACHE_TTL_MS = 8 * 60 * 1000;
const CACHE_MAX = 400;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const FETCH_TIMEOUT_MS = 3500;

/**
 * Deductions from a clean 100. Worst case wins when sources disagree.
 * - Datacenter / hosting: −42 (inside the −35…−45 band).
 * - Business / other non-residential: −35.
 * - Proxy alone or VPN alone: −30. Both: −35 once, not stacked.
 * - Tor: −40, and it does not also take the proxy cut.
 * - AbuseIPDB: −floor(confidence × 0.4), so 100 → −40. Zero reports add nothing.
 * - Abuser flag with no confidence score: −20.
 * - proxycheck risk ≥ 75: −20; ≥ 50: −10. Below that, no extra cut.
 * A 0-point `conflict` row records that a worse reading was kept.
 */
const POINTS = {
  datacenter: -42,
  business: -35,
  proxy: -30,
  vpn: -30,
  proxyVpn: -35,
  tor: -40,
  abuser: -20,
  riskHigh: -20,
  riskMid: -10,
} as const;

const EMPTY_GEO = (): Geo => ({ country: null, region: null, city: null, countryCode: null });

const HINT = {
  ok: {
    level: 'ok' as const,
    textEn:
      'This egress looks residential. That is a milder heuristic for Claude account risk models — not an Anthropic check, and it does not guarantee the account will pass.',
    textZh:
      '这条出口看起来更接近住宅网络，对 Claude 账号风控模型只是偏温和的启发式判断。不是 Anthropic 的检测，也不保证账号能通过。',
  },
  caution: {
    level: 'caution' as const,
    textEn:
      'Signals are mixed or incomplete. Treat this as a rough purity hint only — not an Anthropic verdict, and it does not guarantee passing Claude.',
    textZh:
      '信号不完整或彼此不一致。只当作粗略的纯净度提示，不是 Anthropic 的判定，也不保证能通过 Claude。',
  },
  risky: {
    level: 'risky' as const,
    textEn:
      'Datacenter, VPN/proxy, Tor, or a high abuse score — higher risk for Claude account risk models. Heuristic only, not Anthropic, and it does not guarantee a block or a pass.',
    textZh:
      '数据中心、VPN/代理、Tor 或较高滥用分，对 Claude 账号风控模型偏险。仅为启发式，不是 Anthropic 的结论，不保证会被拦截或放行。',
  },
  unknown: {
    level: 'caution' as const,
    textEn:
      'No purity score. Reputation sources are missing or did not answer, and this check does not invent a clean result. Not a Claude verdict.',
    textZh:
      '没有纯净度分数。信誉源未配置或没有返回，本次检查不会编造一个“干净”的结果。这不是 Claude 的判定。',
  },
};

const NOTICE: Record<NoticeCode, Notice> = {
  no_ip: {
    code: 'no_ip',
    textEn: 'No egress IP was visible on this request, so nothing was sent to reputation sources.',
    textZh: '这次请求上看不到出口 IP，因此没有向信誉源发送查询。',
  },
  private_ip: {
    code: 'private_ip',
    textEn: 'The visible address is loopback or private, so reputation lookups were skipped.',
    textZh: '可见地址是回环或内网地址，已跳过信誉查询。',
  },
  unconfigured: {
    code: 'unconfigured',
    textEn:
      'Reputation sources are not configured (or only weak geo answered). Purity is withheld instead of showing a fake high score.',
    textZh: '信誉源尚未配置（或只有较弱的地理信息）。纯净度留空，不会显示一个虚假的高分。',
  },
  partial: {
    code: 'partial',
    textEn:
      'Reputation API keys are not fully configured. Any score below uses only the sources that answered, and it is incomplete.',
    textZh: '信誉 API 密钥并未配齐。下面的分数只来自有回应的来源，并不完整。',
  },
  degraded: {
    code: 'degraded',
    textEn: 'The configured reputation sources did not return a usable reading. Purity is withheld.',
    textZh: '已配置的信誉源没有返回可用结果。纯净度留空。',
  },
};

interface CacheEntry {
  at: number;
  body: IpPurityResponse;
}

const cache = new Map<string, CacheEntry>();
const hits = new Map<string, number[]>();

function envKey(name: string): string {
  return (process.env[name] ?? '').trim();
}

export function sourcesConfiguredFromEnv(): boolean {
  return Boolean(envKey('PROXYCHECK_API_KEY') || envKey('ABUSEIPDB_API_KEY'));
}

export function normalizeIp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let s = raw.trim().replace(/^"|"$/g, '');
  if (!s || s.toLowerCase() === 'unknown') return null;
  const bracket = s.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracket) s = bracket[1] ?? '';
  const v4port = s.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (v4port) s = v4port[1] ?? '';
  if (s.toLowerCase().startsWith('::ffff:')) {
    const mapped = s.slice(7);
    if (isIpv4(mapped)) s = mapped;
  }
  if (isIpv4(s)) return s;
  if (isIpv6(s)) return s.toLowerCase();
  return null;
}

function isIpv4(s: string): boolean {
  const parts = s.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function isIpv6(s: string): boolean {
  if (!s.includes(':') || s.length > 45 || s.includes('%')) return false;
  try {
    const hostname = new URL(`http://[${s}]/`).hostname;
    return hostname.toLowerCase() === `[${s.toLowerCase()}]`;
  } catch {
    return false;
  }
}

export function isPublicIp(ip: string): boolean {
  if (ip.includes(':')) return isPublicIpv6(ip);
  return isPublicIpv4(ip);
}

function isPublicIpv4(ip: string): boolean {
  if (!isIpv4(ip)) return false;
  const [a, b, c] = ip.split('.').map((n) => Number(n));
  if (a === 0 || a === 10 || a === 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 192 && b === 0 && c === 2) return false;
  if (a === 198 && (b === 18 || b === 19)) return false;
  if (a === 198 && b === 51 && c === 100) return false;
  if (a === 203 && b === 0 && c === 113) return false;
  if (a >= 224) return false;
  return true;
}

function isPublicIpv6(ip: string): boolean {
  const n = ip.toLowerCase();
  if (n === '::' || n === '::1') return false;
  if (n.startsWith('fc') || n.startsWith('fd')) return false;
  if (/^fe[89ab]/.test(n)) return false;
  if (n.startsWith('ff')) return false;
  if (n.startsWith('2001:db8')) return false;
  return true;
}

function firstHop(value: string | null): string | null {
  if (!value) return null;
  const hop = value.split(',')[0]?.trim() ?? '';
  return hop || null;
}

function ipFromVercelHeaders(headers: Headers): string | null {
  const named = ['x-vercel-ip', 'x-vercel-proxied-for'];
  for (const name of named) {
    const ip = normalizeIp(firstHop(headers.get(name)));
    if (ip) return ip;
  }
  let found: string | null = null;
  headers.forEach((value, key) => {
    if (found || !key.startsWith('x-vercel-')) return;
    if (
      key.includes('country') ||
      key.includes('city') ||
      key.includes('timezone') ||
      key.includes('latitude') ||
      key.includes('longitude') ||
      key.includes('postal')
    ) {
      return;
    }
    found = normalizeIp(firstHop(value));
  });
  return found;
}

/** Header order is fixed. `clientAddress` is only a last resort for local dev. Query `ip` is never read. */
export function resolveEgressIp(headers: Headers, clientAddress: string | null): string | null {
  const forwarded = normalizeIp(firstHop(headers.get('x-forwarded-for')));
  if (forwarded) return forwarded;
  const real = normalizeIp(firstHop(headers.get('x-real-ip')));
  if (real) return real;
  const vercelForwarded = normalizeIp(firstHop(headers.get('x-vercel-forwarded-for')));
  if (vercelForwarded) return vercelForwarded;
  const vercelIp = ipFromVercelHeaders(headers);
  if (vercelIp) return vercelIp;
  return normalizeIp(clientAddress);
}

export function vercelGeo(headers: Headers): Geo {
  const code = (headers.get('x-vercel-ip-country') ?? '').trim().toUpperCase();
  return {
    country: null,
    region: decodeHeader(headers.get('x-vercel-ip-country-region')),
    city: decodeHeader(headers.get('x-vercel-ip-city')),
    countryCode: /^[A-Z]{2}$/.test(code) ? code : null,
  };
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return decodeURIComponent(trimmed) || null;
  } catch {
    return trimmed;
  }
}

function asObj(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asStr(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asBool(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function asNum(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

export function normalizeAsn(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return `AS${Math.trunc(value)}`;
  const text = asStr(value);
  if (!text) return null;
  const match = text.match(/(\d{1,10})/);
  return match ? `AS${match[1]}` : null;
}

function mapNetworkType(raw: string | null): NetworkType | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (
    s.includes('datacenter') ||
    s.includes('data center') ||
    s.includes('hosting') ||
    s.includes('cdn') ||
    s.includes('content delivery') ||
    s.includes('search engine') ||
    s.includes('spider')
  ) {
    return 'Datacenter';
  }
  if (s.includes('residential') || s.includes('wireless') || s.includes('mobile') || s.includes('fixed line') || s.includes('isp')) {
    return 'Residential';
  }
  if (s.includes('business') || s.includes('commercial') || s.includes('education') || s.includes('government')) {
    return 'Business';
  }
  return null;
}

function blank(status: SourceStatus, detail: string): ParsedSource {
  return { status, detail };
}

type FetchFail = { ok: false; kind: 'timeout' | 'network' | 'http' | 'parse'; http: number | null };
type FetchOk = { ok: true; json: unknown };

async function fetchJson(url: string, headers: Record<string, string>): Promise<FetchOk | FetchFail> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'FuckClaude-ip-purity/1.0', ...headers },
      signal: ctrl.signal,
      redirect: 'follow',
    });
    const text = await res.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    if (!res.ok) return { ok: false, kind: 'http', http: res.status };
    if (json === null) return { ok: false, kind: 'parse', http: res.status };
    return { ok: true, json };
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    return { ok: false, kind: aborted ? 'timeout' : 'network', http: null };
  } finally {
    clearTimeout(timer);
  }
}

function failStatus(fail: FetchFail): ParsedSource {
  if (fail.kind === 'timeout') return blank('unavailable', 'timeout');
  if (fail.kind === 'network') return blank('unavailable', 'network error');
  if (fail.kind === 'parse') return blank('error', 'unreadable response');
  if (fail.http !== null && (fail.http >= 500 || fail.http === 429 || fail.http === 408)) {
    return blank('unavailable', `HTTP ${fail.http}`);
  }
  return blank('error', fail.http ? `HTTP ${fail.http}` : 'request failed');
}

export function parseProxycheck(json: unknown, ip: string): ParsedSource {
  const root = asObj(json);
  if (!root) return blank('error', 'unreadable response');
  const status = (asStr(root.status) ?? '').toLowerCase();
  if (status && status !== 'ok' && status !== 'warning') return blank('error', 'provider rejected the lookup');
  const direct = asObj(root[ip]) ?? findProxycheckRow(root);
  if (!direct) return blank('error', 'provider rejected the lookup');
  const typeRaw = asStr(direct.type);
  const bits = proxycheckTypeBits(typeRaw);
  const proxyField = (asStr(direct.proxy) ?? '').toLowerCase();
  let proxy = bits.proxy;
  let vpn = bits.vpn;
  let tor = bits.tor;
  if (proxyField === 'yes') {
    if (tor !== true && vpn !== true) proxy = true;
  } else if (proxyField === 'no') {
    if (proxy !== true) proxy = false;
    if (vpn !== true) vpn = false;
    if (tor !== true) tor = false;
  }
  const risk = asNum(direct.risk);
  return {
    status: 'ok',
    country: asStr(direct.country),
    region: asStr(direct.region),
    city: asStr(direct.city),
    countryCode: (asStr(direct.isocode) ?? '').toUpperCase() || null,
    asn: normalizeAsn(direct.asn),
    org: asStr(direct.organisation) ?? asStr(direct.organization) ?? asStr(direct.provider),
    isp: asStr(direct.provider),
    type: bits.type,
    proxy,
    vpn,
    tor,
    datacenter: bits.datacenter,
    abusive: bits.abusive,
    risk: risk === null ? null : Math.max(0, Math.min(100, risk)),
  };
}

function findProxycheckRow(root: Record<string, unknown>): Record<string, unknown> | null {
  for (const [key, value] of Object.entries(root)) {
    if (key === 'status' || key === 'message' || key === 'node' || key === 'query time') continue;
    const row = asObj(value);
    if (row) return row;
  }
  return null;
}

function proxycheckTypeBits(raw: string | null): {
  type: NetworkType | null;
  proxy: boolean | null;
  vpn: boolean | null;
  tor: boolean | null;
  datacenter: boolean | null;
  abusive: boolean | null;
} {
  if (!raw) {
    return { type: null, proxy: null, vpn: null, tor: null, datacenter: null, abusive: null };
  }
  const parts = raw
    .split(/[,/|]/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  let type: NetworkType | null = null;
  let proxy: boolean | null = null;
  let vpn: boolean | null = null;
  let tor: boolean | null = null;
  let datacenter: boolean | null = null;
  let abusive: boolean | null = null;
  for (const part of parts) {
    if (part.includes('tor')) tor = true;
    else if (part.includes('vpn')) vpn = true;
    else if (part.includes('socks') || part.includes('proxy') || part === 'http' || part === 'https' || part.includes('scraper')) {
      proxy = true;
    } else if (part.includes('compromised')) {
      proxy = true;
      abusive = true;
    } else if (part.includes('host') || part.includes('datacenter') || part.includes('data center') || part === 'cdn') {
      datacenter = true;
      type = 'Datacenter';
    } else if (part.includes('business') || part.includes('commercial')) {
      if (type !== 'Datacenter') type = 'Business';
    } else if (part.includes('residential') || part.includes('wireless') || part.includes('mobile')) {
      if (type !== 'Datacenter' && type !== 'Business') type = 'Residential';
    }
  }
  return { type, proxy, vpn, tor, datacenter, abusive };
}

export function parseAbuse(json: unknown): ParsedSource {
  const root = asObj(json);
  const data = asObj(root?.data);
  if (!data) return blank('error', 'provider rejected the lookup');
  const confidence = asNum(data.abuseConfidenceScore);
  if (confidence === null) return blank('error', 'provider rejected the lookup');
  const usage = mapNetworkType(asStr(data.usageType));
  const tor = asBool(data.isTor);
  const clamped = Math.max(0, Math.min(100, confidence));
  return {
    status: 'ok',
    countryCode: (asStr(data.countryCode) ?? '').toUpperCase() || null,
    isp: asStr(data.isp),
    org: asStr(data.domain) ?? asStr(data.isp),
    type: usage,
    tor,
    datacenter: usage === 'Datacenter' ? true : null,
    abusive: clamped >= 25 ? true : clamped === 0 ? false : null,
    abuseConfidence: clamped,
  };
}

export function parseIpwho(json: unknown): ParsedSource {
  const root = asObj(json);
  if (!root || root.success === false) return blank('error', 'provider rejected the lookup');
  const conn = asObj(root.connection);
  if (!asStr(root.ip) && !asStr(root.country) && !conn) return blank('error', 'provider rejected the lookup');
  return {
    status: 'ok',
    detail: 'geo only, not a reputation source',
    country: asStr(root.country),
    region: asStr(root.region),
    city: asStr(root.city),
    countryCode: (asStr(root.country_code) ?? '').toUpperCase() || null,
    asn: normalizeAsn(conn?.asn),
    org: asStr(conn?.org),
    isp: asStr(conn?.isp),
  };
}

function worstType(types: Array<NetworkType | null | undefined>): NetworkType {
  const rank: Record<NetworkType, number> = { Unknown: 0, Residential: 1, Business: 2, Datacenter: 3 };
  let best: NetworkType = 'Unknown';
  for (const type of types) {
    if (!type || type === 'Unknown') continue;
    if (rank[type] > rank[best]) best = type;
  }
  return best;
}

function mergeBool(values: Array<boolean | null | undefined>): boolean | null {
  let sawFalse = false;
  for (const value of values) {
    if (value === true) return true;
    if (value === false) sawFalse = true;
  }
  return sawFalse ? false : null;
}

function disagreedBool(values: Array<boolean | null | undefined>): boolean {
  let yes = false;
  let no = false;
  for (const value of values) {
    if (value === true) yes = true;
    if (value === false) no = true;
  }
  return yes && no;
}

function firstText(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return null;
}

function sourceNames(ids: string[]): string {
  return [...new Set(ids)].join('+');
}

export function buildPurity(input: {
  ip: string | null;
  sourcesConfigured: boolean;
  sources: {
    proxycheck: ParsedSource;
    abuseipdb: ParsedSource;
    ipwho: ParsedSource;
  };
  vercelGeo: Geo;
  notice: NoticeCode | null;
}): IpPurityResponse {
  const { proxycheck, abuseipdb, ipwho } = input.sources;
  const reputation = [proxycheck, abuseipdb];
  const geoOrder = [proxycheck, abuseipdb, ipwho];

  const geo: Geo = {
    country: firstText(...geoOrder.map((source) => source.country), input.vercelGeo.country),
    region: firstText(...geoOrder.map((source) => source.region), input.vercelGeo.region),
    city: firstText(...geoOrder.map((source) => source.city), input.vercelGeo.city),
    countryCode: firstText(
      ...geoOrder.map((source) => source.countryCode),
      input.vercelGeo.countryCode,
    )?.toUpperCase() ?? null,
  };
  if (geo.countryCode && !/^[A-Z]{2}$/.test(geo.countryCode)) geo.countryCode = null;

  const reportedTypes = reputation.map((source) => source.type).filter((type): type is NetworkType => Boolean(type));
  let type = worstType(reportedTypes);
  const flags: Flags = {
    proxy: mergeBool(reputation.map((source) => source.proxy)),
    vpn: mergeBool(reputation.map((source) => source.vpn)),
    tor: mergeBool(reputation.map((source) => source.tor)),
    datacenter: mergeBool(reputation.map((source) => source.datacenter)),
    abusive: mergeBool(reputation.map((source) => source.abusive)),
  };
  if (flags.datacenter === true || reportedTypes.includes('Datacenter')) {
    flags.datacenter = true;
    type = 'Datacenter';
  }

  const abuseValues = reputation
    .map((source) => source.abuseConfidence)
    .filter((value): value is number => typeof value === 'number');
  const abuseConfidence = abuseValues.length ? Math.max(...abuseValues) : null;
  const riskValues = reputation
    .map((source) => source.risk)
    .filter((value): value is number => typeof value === 'number');
  const risk = riskValues.length ? Math.max(...riskValues) : null;
  if (abuseConfidence !== null && abuseConfidence >= 25) flags.abusive = true;

  const typeConflict = new Set(reportedTypes.filter((item) => item !== 'Unknown')).size > 1;
  const flagConflict =
    disagreedBool(reputation.map((source) => source.proxy)) ||
    disagreedBool(reputation.map((source) => source.vpn)) ||
    disagreedBool(reputation.map((source) => source.tor)) ||
    disagreedBool(reputation.map((source) => source.datacenter));

  const deductions: Deduction[] = [];
  const who = (pred: (source: ParsedSource) => boolean, ids: Array<['proxycheck' | 'abuseipdb', ParsedSource]>) =>
    sourceNames(ids.filter(([, source]) => pred(source)).map(([id]) => id));

  const tagged = [
    ['proxycheck', proxycheck],
    ['abuseipdb', abuseipdb],
  ] as Array<['proxycheck' | 'abuseipdb', ParsedSource]>;

  if (type === 'Datacenter' || flags.datacenter === true) {
    deductions.push({
      code: 'datacenter',
      label: 'Datacenter or hosting network',
      points: POINTS.datacenter,
      source: who((source) => source.type === 'Datacenter' || source.datacenter === true, tagged) || 'aggregate',
    });
  } else if (type === 'Business') {
    deductions.push({
      code: 'business',
      label: 'Business or other non-residential network',
      points: POINTS.business,
      source: who((source) => source.type === 'Business', tagged) || 'aggregate',
    });
  }

  if (flags.tor === true) {
    deductions.push({
      code: 'tor',
      label: 'Tor exit',
      points: POINTS.tor,
      source: who((source) => source.tor === true, tagged) || 'aggregate',
    });
  }

  const proxy = flags.proxy === true;
  const vpn = flags.vpn === true;
  if (proxy && vpn) {
    deductions.push({
      code: 'proxy_vpn',
      label: 'Proxy and VPN',
      points: POINTS.proxyVpn,
      source: who((source) => source.proxy === true || source.vpn === true, tagged) || 'aggregate',
    });
  } else if (proxy) {
    deductions.push({
      code: 'proxy',
      label: 'Proxy',
      points: POINTS.proxy,
      source: who((source) => source.proxy === true, tagged) || 'aggregate',
    });
  } else if (vpn) {
    deductions.push({
      code: 'vpn',
      label: 'VPN',
      points: POINTS.vpn,
      source: who((source) => source.vpn === true, tagged) || 'aggregate',
    });
  }

  if (abuseConfidence !== null && abuseConfidence > 0) {
    deductions.push({
      code: 'abuse',
      label: `AbuseIPDB confidence ${abuseConfidence}`,
      points: -Math.floor(abuseConfidence * 0.4),
      source: 'abuseipdb',
    });
  } else if (flags.abusive === true) {
    deductions.push({
      code: 'abuser',
      label: 'Listed as an abuser',
      points: POINTS.abuser,
      source: who((source) => source.abusive === true, tagged) || 'aggregate',
    });
  }

  if (risk !== null && risk >= 75) {
    deductions.push({
      code: 'proxycheck_risk',
      label: `proxycheck risk ${risk}`,
      points: POINTS.riskHigh,
      source: 'proxycheck',
    });
  } else if (risk !== null && risk >= 50) {
    deductions.push({
      code: 'proxycheck_risk',
      label: `proxycheck risk ${risk}`,
      points: POINTS.riskMid,
      source: 'proxycheck',
    });
  }

  if (typeConflict || flagConflict) {
    deductions.push({
      code: 'conflict',
      label: 'Sources disagree; the higher-risk reading is kept',
      points: 0,
      source: 'aggregate',
    });
  }

  const hasRisk =
    type === 'Datacenter' ||
    type === 'Business' ||
    flags.datacenter === true ||
    flags.proxy === true ||
    flags.vpn === true ||
    flags.tor === true ||
    flags.abusive === true ||
    (abuseConfidence !== null && abuseConfidence >= 25) ||
    (risk !== null && risk >= 50);
  const affirmativeClean = type === 'Residential' && !hasRisk;
  let purity: number | null = null;
  if (hasRisk || affirmativeClean) {
    const total = deductions.reduce((sum, row) => sum + row.points, 100);
    purity = Math.max(0, Math.min(100, total));
  }

  // Missing reputation keys must not present a clean 100 as if it were verified.
  if (!input.sourcesConfigured && purity !== null && !hasRisk) purity = null;

  let notice = input.notice;
  if (!notice && !input.sourcesConfigured && purity === null) notice = 'unconfigured';
  if (!notice && !input.sourcesConfigured && purity !== null) notice = 'partial';
  if (!notice && input.sourcesConfigured && purity === null) {
    const anyReputationOk = reputation.some((source) => source.status === 'ok');
    if (!anyReputationOk) notice = 'degraded';
  }

  // 80+ is high, 50–79 medium, below 50 low. A real risk flag keeps the band out of "high"
  // so a small abuse cut cannot read as a clean residential result.
  let band: PurityBand | null =
    purity === null ? null : purity >= 80 ? 'high' : purity >= 50 ? 'medium' : 'low';
  if (band === 'high' && hasRisk) band = 'medium';

  const network: Network = {
    asn: firstText(proxycheck.asn, abuseipdb.asn, ipwho.asn),
    org: firstText(proxycheck.org, abuseipdb.org, ipwho.org),
    isp: firstText(proxycheck.isp, abuseipdb.isp, ipwho.isp),
    type,
  };

  let hint: ClaudeHint = HINT.unknown;
  if (purity !== null) {
    const risky =
      flags.datacenter === true ||
      flags.tor === true ||
      flags.vpn === true ||
      flags.proxy === true ||
      type === 'Datacenter' ||
      (abuseConfidence !== null && abuseConfidence >= 50) ||
      purity < 50;
    const ok =
      purity >= 80 &&
      type === 'Residential' &&
      flags.proxy !== true &&
      flags.vpn !== true &&
      flags.tor !== true &&
      flags.datacenter !== true &&
      flags.abusive !== true &&
      (abuseConfidence === null || abuseConfidence < 25);
    hint = risky ? HINT.risky : ok ? HINT.ok : HINT.caution;
  }

  const report = (source: ParsedSource): SourceReport =>
    source.detail ? { status: source.status, detail: source.detail } : { status: source.status };

  return {
    ip: input.ip,
    purity,
    band,
    geo,
    network,
    flags,
    claudeHint: hint,
    deductions: purity === null ? deductions.filter((row) => row.code === 'conflict') : deductions,
    sources: {
      proxycheck: report(proxycheck),
      abuseipdb: report(abuseipdb),
      ipwho: report(ipwho),
    },
    sourcesConfigured: input.sourcesConfigured,
    notice: notice ? NOTICE[notice] : null,
    cached: false,
    disclaimer: DISCLAIMER.en,
  };
}

async function lookupSource(
  enabled: boolean,
  unconfiguredDetail: string,
  load: () => Promise<FetchOk | FetchFail>,
  parse: (json: unknown) => ParsedSource,
): Promise<ParsedSource> {
  if (!enabled) return blank('unconfigured', unconfiguredDetail);
  const result = await load();
  return result.ok ? parse(result.json) : failStatus(result);
}

async function lookupPublic(ip: string): Promise<{
  proxycheck: ParsedSource;
  abuseipdb: ParsedSource;
  ipwho: ParsedSource;
}> {
  const proxyKey = envKey('PROXYCHECK_API_KEY');
  const abuseKey = envKey('ABUSEIPDB_API_KEY');
  const encoded = encodeURIComponent(ip);
  // Colons in an IPv6 path stay literal. Query values are fully encoded.
  const pathIp = ip.includes(':') ? ip : encoded;

  const [proxycheck, abuseipdb, ipwho] = await Promise.all([
    lookupSource(
      Boolean(proxyKey),
      'API key not set',
      () =>
        fetchJson(
          `https://proxycheck.io/v2/${pathIp}?vpn=1&asn=1&risk=1&port=1&key=${encodeURIComponent(proxyKey)}`,
          {},
        ),
      (json) => parseProxycheck(json, ip),
    ),
    lookupSource(
      Boolean(abuseKey),
      'API key not set',
      () =>
        fetchJson(`https://api.abuseipdb.com/api/v2/check?ipAddress=${encoded}&maxAgeInDays=90`, {
          Key: abuseKey,
        }),
      (json) => parseAbuse(json),
    ),
    lookupSource(true, '', () => fetchJson(`https://ipwho.is/${pathIp}`, {}), (json) => parseIpwho(json)),
  ]);

  return { proxycheck, abuseipdb, ipwho };
}

function skipped(detail: string): ParsedSource {
  return blank('unavailable', detail);
}

function takeCache(ip: string): IpPurityResponse | null {
  const hit = cache.get(ip);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(ip);
    return null;
  }
  return { ...hit.body, cached: true };
}

function storeCache(ip: string, body: IpPurityResponse): void {
  cache.set(ip, { at: Date.now(), body: { ...body, cached: false } });
  if (cache.size <= CACHE_MAX) return;
  const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at);
  const extra = cache.size - CACHE_MAX;
  for (let i = 0; i < extra; i += 1) {
    const key = oldest[i]?.[0];
    if (key) cache.delete(key);
  }
}

export function rateLimit(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) {
    for (const [key, stamps] of hits) {
      const live = stamps.filter((stamp) => now - stamp < RATE_WINDOW_MS);
      if (live.length === 0) hits.delete(key);
      else hits.set(key, live);
    }
  }
  return true;
}

export const RATE_LIMIT_PER_MINUTE = RATE_LIMIT;

export async function evaluateIp(headers: Headers, clientAddress: string | null): Promise<
  | { kind: 'rate_limited' }
  | { kind: 'ok'; body: IpPurityResponse }
> {
  const ip = resolveEgressIp(headers, clientAddress);
  const limitKey = ip ?? 'unknown';
  if (!rateLimit(limitKey)) return { kind: 'rate_limited' };

  if (ip) {
    const cached = takeCache(ip);
    if (cached) return { kind: 'ok', body: cached };
  }

  const configured = sourcesConfiguredFromEnv();
  const geo = vercelGeo(headers);

  if (!ip) {
    const missing = skipped('no egress IP');
    return {
      kind: 'ok',
      body: buildPurity({
        ip: null,
        sourcesConfigured: configured,
        sources: { proxycheck: missing, abuseipdb: missing, ipwho: missing },
        vercelGeo: geo,
        notice: 'no_ip',
      }),
    };
  }

  if (!isPublicIp(ip)) {
    const skippedPrivate = skipped('lookup skipped for non-public IP');
    const body = buildPurity({
      ip,
      sourcesConfigured: configured,
      sources: { proxycheck: skippedPrivate, abuseipdb: skippedPrivate, ipwho: skippedPrivate },
      vercelGeo: geo,
      notice: 'private_ip',
    });
    storeCache(ip, body);
    return { kind: 'ok', body };
  }

  let parsed: {
    proxycheck: ParsedSource;
    abuseipdb: ParsedSource;
    ipwho: ParsedSource;
  };
  try {
    parsed = await lookupPublic(ip);
  } catch {
    const failed = blank('unavailable', 'lookup failed');
    parsed = { proxycheck: failed, abuseipdb: failed, ipwho: failed };
  }

  const body = buildPurity({
    ip,
    sourcesConfigured: configured,
    sources: parsed,
    vercelGeo: geo,
    notice: null,
  });
  storeCache(ip, body);
  return { kind: 'ok', body };
}

export function renderText(body: IpPurityResponse, lang: 'en' | 'zh'): string {
  const zh = lang === 'zh';
  const purity = body.purity === null ? (zh ? '无' : 'n/a') : `${body.purity}/100`;
  const band = body.band ?? (zh ? '无' : 'n/a');
  const flag = (value: boolean | null) => (value === null ? '?' : value ? (zh ? '是' : 'yes') : (zh ? '否' : 'no'));
  const lines = [
    zh ? 'Fuck Claude · IP 纯净度（与中国用户分独立）' : 'Fuck Claude · IP purity (separate from the China-user score)',
    `${zh ? 'IP' : 'IP'}  ${body.ip ?? (zh ? '未知' : 'unknown')}`,
    `${zh ? '纯净度' : 'Purity'}  ${purity}  ${band}`,
    `${zh ? '类型' : 'Type'}  ${body.network.type}`,
    `ASN  ${body.network.asn ?? '-'}  ${body.network.org ?? ''}`,
    `${zh ? '代理' : 'Proxy'} ${flag(body.flags.proxy)}  VPN ${flag(body.flags.vpn)}  Tor ${flag(body.flags.tor)}  ${zh ? '机房' : 'Datacenter'} ${flag(body.flags.datacenter)}`,
    body.notice ? body.notice[zh ? 'textZh' : 'textEn'] : '',
    zh ? body.claudeHint.textZh : body.claudeHint.textEn,
    DISCLAIMER[lang],
    '',
  ];
  return lines.filter((line, index) => line !== '' || index === lines.length - 1).join('\n');
}
