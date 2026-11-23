export type Layer = 'request' | 'network' | 'script' | 'probe';

export type ReadingId =
  | 'request.ip'
  | 'request.country'
  | 'request.region'
  | 'request.city'
  | 'request.ipTimezone'
  | 'request.acceptLanguage'
  | 'request.userAgent'
  | 'request.secChUaPlatform'
  | 'request.secGpc'
  | 'request.dnt'
  | 'network.type'
  | 'network.asn'
  | 'network.org'
  | 'network.proxy'
  | 'script.timezone'
  | 'script.languages'
  | 'script.userAgent'
  | 'script.uaDataPlatform'
  | 'script.screen'
  | 'script.gpu'
  | 'script.cores'
  | 'script.memory'
  | 'script.touch'
  | 'script.canvas'
  | 'script.privacy'
  | 'probe.srflxIp'
  | 'probe.hostIps';

export type RuleId =
  | 'tz-offset'
  | 'lang-country'
  | 'lang-header-script'
  | 'ua-platform'
  | 'ua-gpu'
  | 'webrtc-ip'
  | 'webrtc-tun'
  | 'ip-network-type';

export type Reading = { id: ReadingId; layer: Layer; value: string; atMs: number };
export type Snapshot = Partial<Record<ReadingId, Reading>>;
export type Verdict = 'match' | 'mismatch' | 'unknown';

export type Finding = {
  ruleId: RuleId;
  verdict: Verdict;
  evidence: ReadingId[];
  params: Record<string, string>;
};

export type Rule = { id: RuleId; needs: readonly ReadingId[]; evaluate(s: Snapshot): Finding };

export const READING_DEFS: Record<ReadingId, { layer: Layer }> = {
  'request.ip': { layer: 'request' },
  'request.country': { layer: 'request' },
  'request.region': { layer: 'request' },
  'request.city': { layer: 'request' },
  'request.ipTimezone': { layer: 'request' },
  'request.acceptLanguage': { layer: 'request' },
  'request.userAgent': { layer: 'request' },
  'request.secChUaPlatform': { layer: 'request' },
  'request.secGpc': { layer: 'request' },
  'request.dnt': { layer: 'request' },
  'network.type': { layer: 'network' },
  'network.asn': { layer: 'network' },
  'network.org': { layer: 'network' },
  'network.proxy': { layer: 'network' },
  'script.timezone': { layer: 'script' },
  'script.languages': { layer: 'script' },
  'script.userAgent': { layer: 'script' },
  'script.uaDataPlatform': { layer: 'script' },
  'script.screen': { layer: 'script' },
  'script.gpu': { layer: 'script' },
  'script.cores': { layer: 'script' },
  'script.memory': { layer: 'script' },
  'script.touch': { layer: 'script' },
  'script.canvas': { layer: 'script' },
  'script.privacy': { layer: 'script' },
  'probe.srflxIp': { layer: 'probe' },
  'probe.hostIps': { layer: 'probe' },
};

const LAYER_ORDER: readonly Layer[] = ['request', 'network', 'script', 'probe'];

export function layerSortIndex(layer: Layer): number {
  const i = LAYER_ORDER.indexOf(layer);
  if (i === -1) {
    const _exhaustive: never = layer;
    return _exhaustive;
  }
  return i;
}

export const COUNTRY_LANGS: Record<string, readonly string[]> = {
  AR: ['es'],
  AT: ['de'],
  AU: ['en'],
  BE: ['nl', 'fr', 'de'],
  BR: ['pt'],
  CA: ['en', 'fr'],
  CH: ['de', 'fr', 'it'],
  CL: ['es'],
  CN: ['zh'],
  CO: ['es'],
  CZ: ['cs'],
  DE: ['de'],
  DK: ['da'],
  EG: ['ar'],
  ES: ['es'],
  FI: ['fi', 'sv'],
  FR: ['fr'],
  GB: ['en'],
  GR: ['el'],
  HK: ['zh', 'en'],
  HU: ['hu'],
  ID: ['id'],
  IE: ['en', 'ga'],
  IL: ['he'],
  IN: ['hi', 'en'],
  IR: ['fa'],
  IT: ['it'],
  JP: ['ja'],
  KR: ['ko'],
  MX: ['es'],
  MY: ['ms', 'en'],
  NG: ['en'],
  NL: ['nl'],
  NO: ['no'],
  NZ: ['en'],
  PH: ['en', 'fil'],
  PL: ['pl'],
  PT: ['pt'],
  RO: ['ro'],
  RU: ['ru'],
  SA: ['ar'],
  SE: ['sv'],
  SG: ['en', 'zh', 'ms'],
  TH: ['th'],
  TR: ['tr'],
  TW: ['zh'],
  UA: ['uk'],
  US: ['en'],
  VN: ['vi'],
  ZA: ['en', 'af', 'zu'],
};

type OsFamily = 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'ChromeOS';

function hasAll(s: Snapshot, needs: readonly ReadingId[]): boolean {
  return needs.every((id) => s[id] !== undefined);
}

function presentEvidence(s: Snapshot, needs: readonly ReadingId[]): ReadingId[] {
  return needs.filter((id) => s[id] !== undefined);
}

function unknownFinding(ruleId: RuleId, s: Snapshot, needs: readonly ReadingId[]): Finding {
  return { ruleId, verdict: 'unknown', evidence: presentEvidence(s, needs), params: {} };
}

export function primarySubtag(tag: string): string {
  const base = tag.trim().split(/[-_]/)[0]?.toLowerCase() ?? '';
  return base;
}

function firstLanguageFromHeader(header: string): string {
  const first = header.split(',')[0]?.trim() ?? '';
  const tag = first.split(';')[0]?.trim() ?? '';
  return primarySubtag(tag);
}

function firstScriptLanguage(langs: string): string {
  const first = langs.split(',')[0]?.trim() ?? langs.trim();
  return primarySubtag(first);
}

/** UTC offset in minutes east of UTC at `at` for IANA zone name. */
export function utcOffsetMinutesForZone(zone: string, at: Date = new Date()): number | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'shortOffset',
    }).formatToParts(at);
    const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name) ?? /UTC([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
    if (!m) return null;
    const sign = m[1] === '-' ? -1 : 1;
    const hours = Number(m[2]);
    const mins = m[3] ? Number(m[3]) : 0;
    return sign * (hours * 60 + mins);
  } catch {
    return null;
  }
}

function parseScriptTimezone(value: string): { zone: string; offsetMin: number | null } | null {
  const m = /^([^\s(]+)\s*\(UTC([+-]?\d+(?::\d{2})?)\)/.exec(value.trim());
  if (!m) return null;
  const zone = m[1];
  const offsetPart = m[2];
  const offMatch = /^([+-]?)(\d{1,2})(?::(\d{2}))?$/.exec(offsetPart);
  if (!offMatch) return { zone, offsetMin: utcOffsetMinutesForZone(zone) };
  const sign = offMatch[1] === '-' ? -1 : 1;
  const h = Number(offMatch[2]);
  const min = offMatch[3] ? Number(offMatch[3]) : 0;
  return { zone, offsetMin: sign * (h * 60 + min) };
}

function normalizeOsFamily(raw: string): OsFamily | null {
  const x = raw.trim().toLowerCase();
  if (!x) return null;
  if (x.includes('win')) return 'Windows';
  if (x.includes('mac') || x.includes('os x')) return 'macOS';
  if (x.includes('iphone') || x.includes('ipad') || x.includes('ios')) return 'iOS';
  if (x.includes('android')) return 'Android';
  if (x.includes('cros') || x.includes('chrome os') || x.includes('chromeos')) return 'ChromeOS';
  if (x.includes('linux') || x.includes('x11')) return 'Linux';
  return null;
}

function osFamilyFromUserAgent(ua: string): OsFamily | null {
  const s = ua.toLowerCase();
  if (s.includes('windows')) return 'Windows';
  if (s.includes('iphone') || s.includes('ipad')) return 'iOS';
  if (s.includes('android')) return 'Android';
  if (s.includes('cros')) return 'ChromeOS';
  if (s.includes('macintosh') || s.includes('mac os')) return 'macOS';
  if (s.includes('linux')) return 'Linux';
  return null;
}

function isIPv4(ip: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
}

function isIPv6(ip: string): boolean {
  return ip.includes(':');
}

function sameIpFamily(a: string, b: string): boolean {
  return (isIPv4(a) && isIPv4(b)) || (isIPv6(a) && isIPv6(b));
}

function ipv4ToInt(ip: string): number | null {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null;
  return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
}

/** True when `ip` lies in 198.18.0.0/15 (benchmark / TUN heuristic range). */
export function ipInTunBenchmarkRange(ip: string): boolean {
  const n = ipv4ToInt(ip.trim());
  if (n === null) return false;
  const low = ipv4ToInt('198.18.0.0');
  const high = ipv4ToInt('198.19.255.255');
  if (low === null || high === null) return false;
  return n >= low && n <= high;
}

function uaSignalsMobile(ua: string): boolean {
  return /iphone|ipad|android|mobile/i.test(ua);
}

function uaSignalsDesktop(ua: string): boolean {
  return /windows nt|macintosh|x11|cros/i.test(ua) && !uaSignalsMobile(ua);
}

function ruleTzOffset(s: Snapshot): Finding {
  const needs = ['script.timezone', 'request.ipTimezone'] as const;
  if (!hasAll(s, needs)) return unknownFinding('tz-offset', s, needs);
  const script = parseScriptTimezone(s['script.timezone']!.value);
  const ipZone = s['request.ipTimezone']!.value.trim();
  if (!script || !ipZone) return unknownFinding('tz-offset', s, needs);
  const serverOff = utcOffsetMinutesForZone(ipZone);
  const browserOff = script.offsetMin ?? utcOffsetMinutesForZone(script.zone);
  if (serverOff === null || browserOff === null) return unknownFinding('tz-offset', s, needs);
  const verdict: Verdict = serverOff === browserOff ? 'match' : 'mismatch';
  return {
    ruleId: 'tz-offset',
    verdict,
    evidence: [...needs],
    params: {
      browserOffset: String(browserOff),
      serverOffset: String(serverOff),
    },
  };
}

function ruleLangCountry(s: Snapshot): Finding {
  const needs = ['script.languages', 'request.country'] as const;
  if (!hasAll(s, needs)) return unknownFinding('lang-country', s, needs);
  const country = s['request.country']!.value.trim().toUpperCase();
  const langs = s['script.languages']!.value;
  const allowed = COUNTRY_LANGS[country];
  if (!allowed) return unknownFinding('lang-country', s, needs);
  const tags = langs.split(',').map((t) => primarySubtag(t.trim())).filter(Boolean);
  const hit = tags.some((t) => allowed.includes(t));
  return {
    ruleId: 'lang-country',
    verdict: hit ? 'match' : 'mismatch',
    evidence: [...needs],
    params: { country },
  };
}

function ruleLangHeaderScript(s: Snapshot): Finding {
  const needs = ['request.acceptLanguage', 'script.languages'] as const;
  if (!hasAll(s, needs)) return unknownFinding('lang-header-script', s, needs);
  const headerLang = firstLanguageFromHeader(s['request.acceptLanguage']!.value);
  const scriptLang = firstScriptLanguage(s['script.languages']!.value);
  if (!headerLang || !scriptLang) return unknownFinding('lang-header-script', s, needs);
  return {
    ruleId: 'lang-header-script',
    verdict: headerLang === scriptLang ? 'match' : 'mismatch',
    evidence: [...needs],
    params: { headerLang, scriptLang },
  };
}

function ruleUaPlatform(s: Snapshot): Finding {
  const needs = ['request.userAgent', 'script.uaDataPlatform', 'request.secChUaPlatform'] as const;
  const ua = s['request.userAgent']?.value;
  if (!ua) return unknownFinding('ua-platform', s, needs);
  const platformRaw = s['script.uaDataPlatform']?.value ?? s['request.secChUaPlatform']?.value;
  if (!platformRaw) return unknownFinding('ua-platform', s, needs);
  const fromUa = osFamilyFromUserAgent(ua);
  const fromPlatform = normalizeOsFamily(platformRaw.replace(/^"|"$/g, ''));
  if (!fromUa || !fromPlatform) return unknownFinding('ua-platform', s, needs);
  const evidence = presentEvidence(s, ['request.userAgent', 'script.uaDataPlatform', 'request.secChUaPlatform']);
  return {
    ruleId: 'ua-platform',
    verdict: fromUa === fromPlatform ? 'match' : 'mismatch',
    evidence,
    params: { uaFamily: fromUa, platformFamily: fromPlatform },
  };
}

function ruleUaGpu(s: Snapshot): Finding {
  const needs = ['script.userAgent', 'script.gpu'] as const;
  if (!hasAll(s, needs)) return unknownFinding('ua-gpu', s, needs);
  const ua = s['script.userAgent']!.value;
  const gpu = s['script.gpu']!.value.toLowerCase();
  if (!gpu || gpu === 'masked' || gpu === 'unavailable') return unknownFinding('ua-gpu', s, needs);

  const isMac = /macintosh|mac os/i.test(ua);
  const isWin = /windows/i.test(ua);
  const isIos = /iphone|ipad/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const d3d = /direct3d|d3d11|d3d12/.test(gpu);
  const apple = /apple|metal/.test(gpu);
  const desktopDiscrete = /nvidia|amd|radeon|intel.*direct3d/.test(gpu) && d3d;

  if (isMac && d3d) {
    return { ruleId: 'ua-gpu', verdict: 'mismatch', evidence: [...needs], params: {} };
  }
  if (isWin && apple && !/intel/.test(gpu)) {
    return { ruleId: 'ua-gpu', verdict: 'mismatch', evidence: [...needs], params: {} };
  }
  if ((isIos || isAndroid) && desktopDiscrete && uaSignalsDesktop(ua)) {
    return { ruleId: 'ua-gpu', verdict: 'mismatch', evidence: [...needs], params: {} };
  }
  if ((isMac && apple) || (isWin && d3d) || (isIos || isAndroid)) {
    return { ruleId: 'ua-gpu', verdict: 'match', evidence: [...needs], params: {} };
  }
  return unknownFinding('ua-gpu', s, needs);
}

function ruleWebrtcIp(s: Snapshot): Finding {
  const needs = ['probe.srflxIp', 'request.ip'] as const;
  if (!hasAll(s, needs)) return unknownFinding('webrtc-ip', s, needs);
  const probe = s['probe.srflxIp']!.value.trim();
  const req = s['request.ip']!.value.trim();
  if (!probe || !req) return unknownFinding('webrtc-ip', s, needs);
  if (!sameIpFamily(probe, req)) return unknownFinding('webrtc-ip', s, needs);
  return {
    ruleId: 'webrtc-ip',
    verdict: probe === req ? 'match' : 'mismatch',
    evidence: [...needs],
    params: {},
  };
}

function ruleWebrtcTun(s: Snapshot): Finding {
  const needs = ['probe.hostIps'] as const;
  if (!hasAll(s, needs)) return unknownFinding('webrtc-tun', s, needs);
  const raw = s['probe.hostIps']!.value.trim();
  if (!raw || raw === 'none') return unknownFinding('webrtc-tun', s, needs);
  const hosts = raw.split(/,\s*/).filter(Boolean);
  if (hosts.length === 0) return unknownFinding('webrtc-tun', s, needs);
  const tunHit = hosts.some((h) => ipInTunBenchmarkRange(h));
  return {
    ruleId: 'webrtc-tun',
    verdict: tunHit ? 'mismatch' : 'match',
    evidence: [...needs],
    params: {},
  };
}

function ruleIpNetworkType(s: Snapshot): Finding {
  const needs = ['network.type', 'network.proxy'] as const;
  const typeReading = s['network.type'];
  const proxyReading = s['network.proxy'];
  if (!typeReading && !proxyReading) return unknownFinding('ip-network-type', s, needs);
  const evidence = presentEvidence(s, needs);
  const type = typeReading?.value ?? '';
  const proxy = proxyReading?.value?.toLowerCase() ?? '';
  if (proxy === 'yes' || type === 'Datacenter') {
    return { ruleId: 'ip-network-type', verdict: 'mismatch', evidence, params: {} };
  }
  if (type === 'Residential') {
    return { ruleId: 'ip-network-type', verdict: 'match', evidence, params: {} };
  }
  return unknownFinding('ip-network-type', s, needs);
}

export const RULES: readonly Rule[] = [
  { id: 'tz-offset', needs: ['script.timezone', 'request.ipTimezone'], evaluate: ruleTzOffset },
  { id: 'lang-country', needs: ['script.languages', 'request.country'], evaluate: ruleLangCountry },
  {
    id: 'lang-header-script',
    needs: ['request.acceptLanguage', 'script.languages'],
    evaluate: ruleLangHeaderScript,
  },
  {
    id: 'ua-platform',
    needs: ['request.userAgent', 'script.uaDataPlatform', 'request.secChUaPlatform'],
    evaluate: ruleUaPlatform,
  },
  { id: 'ua-gpu', needs: ['script.userAgent', 'script.gpu'], evaluate: ruleUaGpu },
  { id: 'webrtc-ip', needs: ['probe.srflxIp', 'request.ip'], evaluate: ruleWebrtcIp },
  { id: 'webrtc-tun', needs: ['probe.hostIps'], evaluate: ruleWebrtcTun },
  {
    id: 'ip-network-type',
    needs: ['network.type', 'network.proxy'],
    evaluate: ruleIpNetworkType,
  },
];

export function evaluateRules(s: Snapshot): Finding[] {
  return RULES.map((rule) => rule.evaluate(s));
}

/**
 * Whether a rule compares two readings against each other (shown side by side
 * with `≠` or `=`) or checks one reading against an expectation.
 */
export const RULE_COMPARES: Record<RuleId, boolean> = {
  'tz-offset': true,
  'lang-country': true,
  'lang-header-script': true,
  'ua-platform': true,
  'ua-gpu': true,
  'webrtc-ip': true,
  'webrtc-tun': false,
  'ip-network-type': false,
};

export function formatUtcOffset(minutes: number): string {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, '0')}`;
}

const BROWSER_PATTERNS: readonly (readonly [RegExp, string])[] = [
  [/Edg(?:e|A|iOS)?\/(\d+)/, 'Edge'],
  [/OPR\/(\d+)/, 'Opera'],
  [/Firefox\/(\d+)|FxiOS\/(\d+)/, 'Firefox'],
  [/(?:Chrome|CriOS)\/(\d+)/, 'Chrome'],
  [/Version\/(\d+)[^ ]* (?:Mobile\/\S+ )?Safari\//, 'Safari'],
];

/** "Chrome 150 · macOS" from a User-Agent string, or null when neither part is recognised. */
export function summarizeUserAgent(ua: string): string | null {
  let browser: string | null = null;
  for (const [pattern, name] of BROWSER_PATTERNS) {
    const m = pattern.exec(ua);
    if (m) {
      browser = `${name} ${m[1] ?? m[2]}`;
      break;
    }
  }
  const os = osFamilyFromUserAgent(ua);
  const parts = [browser, os].filter((p): p is string => p !== null);
  return parts.length > 0 ? parts.join(' · ') : null;
}

function zoneWithOffset(value: string): string {
  const zone = value.trim();
  const off = utcOffsetMinutesForZone(zone);
  return off === null ? zone : `${zone} (${formatUtcOffset(off)})`;
}

const VALUE_FORMATTERS: Partial<Record<ReadingId, (value: string) => string>> = {
  'request.ipTimezone': zoneWithOffset,
  'request.userAgent': (v) => summarizeUserAgent(v) ?? v,
  'script.userAgent': (v) => summarizeUserAgent(v) ?? v,
  'request.secChUaPlatform': (v) => v.replace(/^"|"$/g, ''),
};

/** Short, human-readable form of a raw reading; readings without a formatter pass through. */
export function displayValue(id: ReadingId, value: string): string {
  const format = VALUE_FORMATTERS[id];
  return format ? format(value) : value;
}

/** "320 ms" below one second, "6.1 s" above. */
export function formatElapsed(ms: number): string {
  const rounded = Math.round(ms);
  return rounded < 1000 ? `${rounded} ms` : `${(ms / 1000).toFixed(1)} s`;
}