/**
 * Server-side "China user" estimate, reachable over curl / HTTP.
 *
 * The in-browser scan reads OS-level signals (timezone, fonts, Intl locale, …)
 * that a plain HTTP request can't see. This endpoint instead estimates the risk
 * from what Vercel exposes about the request:
 *   - `x-vercel-ip-timezone` — IANA timezone of the requester's IP (the big one)
 *   - `x-vercel-ip-country`   — country of the requester's IP
 *   - `accept-language`       — browser/UA language preferences
 *   - `user-agent`            — OS/vendor guess for the emoji signal
 *
 * Fonts (Chinese + vendor faces), Intl locale and WebRTC IP leak are
 * browser-only, so the score is computed over the measurable weight (62/100)
 * and normalised to 0–100. It reuses the exact same pure scorers as the client
 * so results stay consistent.
 *
 * Response format:
 *   - default (curl, browser, …)                      → pretty plain-text report
 *       · terminals get ANSI colour, browsers get plain text (`?color=0/1` forces)
 *   - `Accept: application/json` (or `?format=json`)  → JSON
 *   - `?format=text` forces the report even for JSON clients
 *   - `?lang=zh` / `?lang=en` (default: Accept-Language) → localised output
 *
 * Needs the Vercel adapter + on-demand rendering; geo headers are only present
 * on a real Vercel deployment (absent locally / on other hosts).
 */
import type { APIRoute } from 'astro';
import {
  SIGNALS,
  riskBand,
  scoreTimezone,
  scoreLanguages,
  scoreEmojiVendor,
  scoreCnBrowser,
  scoreCnDevice,
  type RiskBand,
  type SignalId,
} from '../../config/signals';
import { useTranslations, type Lang } from '../../i18n/ui';

export const prerender = false;

const SITE = 'https://fuck-claude.vercel.app';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface SignalResult {
  id: SignalId;
  name: string;
  weight: number;
  measured: boolean;
  value: string | null;
  score: number | null;
  contribution: number;
}

interface Analysis {
  score: number;
  band: RiskBand;
  measuredWeight: number;
  totalWeight: number;
  rawContribution: number;
  geo: { country: string | null; timezone: string | null };
  signals: SignalResult[];
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((part) => part.split(';')[0].trim())
    .filter(Boolean);
}

/** Minutes east of UTC for an IANA timezone (Asia/Shanghai → 480), or null. */
function tzOffsetEastMinutes(timeZone: string): number | null {
  if (!timeZone) return null;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    const sign = m[1] === '-' ? -1 : 1;
    const h = parseInt(m[2] ?? '0', 10);
    const min = parseInt(m[3] ?? '0', 10);
    return sign * (h * 60 + min);
  } catch {
    return null;
  }
}

function fmtOffset(min: number | null): string {
  if (min === null) return 'unknown';
  const sign = min >= 0 ? '+' : '-';
  const h = Math.abs(min) / 60;
  return `UTC${sign}${Number.isInteger(h) ? h : h.toFixed(1)}`;
}

function pickLang(url: URL, acceptLang: string[]): Lang {
  const q = (url.searchParams.get('lang') || '').toLowerCase();
  if (q === 'zh' || q === 'en') return q;
  return (acceptLang[0] || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

/**
 * The human-readable report is the default. JSON is opt-in so a bare
 * `curl`/browser hit never dumps raw JSON — only clients that explicitly ask
 * for it (`?format=json`, or `Accept: application/json` from fetch/XHR) get it.
 */
function wantsJson(url: URL, req: Request): boolean {
  const fmt = (url.searchParams.get('format') || '').toLowerCase();
  if (fmt === 'json') return true;
  if (fmt === 'text' || fmt === 'txt') return false;
  return (req.headers.get('accept') || '').toLowerCase().includes('application/json');
}

/**
 * ANSI colour only for terminal clients — a browser hitting the URL would show
 * raw escape codes, so it gets plain text. `?color=0` / `?color=1` force it.
 */
function wantsColor(url: URL, req: Request): boolean {
  const q = (url.searchParams.get('color') || '').toLowerCase();
  if (url.searchParams.has('no-color') || ['0', 'false', 'no', 'off'].includes(q)) return false;
  if (['1', 'true', 'yes', 'on', 'force'].includes(q)) return true;
  const accept = (req.headers.get('accept') || '').toLowerCase();
  if (accept.includes('text/html')) return false;
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  return !/mozilla|chrome\/|safari\/|firefox\/|edg\//.test(ua);
}

function analyze(req: Request, lang: Lang): Analysis {
  const t = useTranslations(lang);
  const tz = req.headers.get('x-vercel-ip-timezone') || '';
  const country = req.headers.get('x-vercel-ip-country') || '';
  const acceptLang = parseAcceptLanguage(req.headers.get('accept-language') || '');
  const ua = req.headers.get('user-agent') || '';

  const offsetEast = tzOffsetEastMinutes(tz);
  const emoji = scoreEmojiVendor(ua);
  const cnBrowser = scoreCnBrowser(ua);
  const cnDevice = scoreCnDevice(ua);

  const measured: Partial<Record<SignalId, { value: string; score: number }>> = {
    timezone: { value: tz || 'unknown', score: scoreTimezone(tz) },
    language: { value: acceptLang.join(', ') || 'unknown', score: scoreLanguages(acceptLang) },
    cnBrowser: { value: cnBrowser.name ?? 'none detected', score: cnBrowser.score },
    deviceVendor: { value: cnDevice.name ?? 'none detected', score: cnDevice.score },
    timezoneOffset: { value: fmtOffset(offsetEast), score: offsetEast === 480 ? 0.7 : 0 },
    emoji: { value: `${emoji.vendor} style`, score: emoji.score },
  };

  let rawContribution = 0;
  let measuredWeight = 0;
  let totalWeight = 0;

  const signals: SignalResult[] = SIGNALS.map((s) => {
    totalWeight += s.weight;
    const m = measured[s.id];
    if (m) {
      const contribution = Math.round(m.score * s.weight);
      rawContribution += contribution;
      measuredWeight += s.weight;
      return {
        id: s.id,
        name: t(`signal.${s.id}.name`),
        weight: s.weight,
        measured: true,
        value: m.value,
        score: Math.round(m.score * 100) / 100,
        contribution,
      };
    }
    return {
      id: s.id,
      name: t(`signal.${s.id}.name`),
      weight: s.weight,
      measured: false,
      value: null,
      score: null,
      contribution: 0,
    };
  });

  const score = measuredWeight ? Math.round((rawContribution / measuredWeight) * 100) : 0;

  return {
    score,
    band: riskBand(score),
    measuredWeight,
    totalWeight,
    rawContribution,
    geo: { country: country || null, timezone: tz || null },
    signals,
  };
}

function jsonBody(a: Analysis, lang: Lang) {
  const t = useTranslations(lang);
  return {
    app: 'Fuck Claude',
    estimate: true,
    lang,
    score: a.score,
    band: a.band,
    verdict: t(`band.${a.band}.title`),
    message: t(`band.${a.band}.desc`),
    coverage: { measuredWeight: a.measuredWeight, totalWeight: a.totalWeight },
    geo: a.geo,
    signals: a.signals,
    note:
      lang === 'zh'
        ? '基于 IP 归属地与请求头的服务端估算,与浏览器端读取操作系统的检测结果可能不同;中文字体、厂商字体、Intl locale 与 WebRTC 泄露只能在浏览器里检测。'
        : 'Server-side estimate from IP geo + request headers; it can differ from the in-browser OS scan. Chinese fonts, vendor fonts, Intl locale and WebRTC leaks can only be measured in a browser.',
    docs: lang === 'zh' ? `${SITE}/zh/` : `${SITE}/`,
  };
}

function textBody(a: Analysis, lang: Lang, color: boolean): string {
  const t = useTranslations(lang);

  // Minimal ANSI painter — a no-op when colour is disabled (browsers/pipes).
  const paint = (open: string) => (s: string) => (color ? `\x1b[${open}m${s}\x1b[0m` : s);
  const accent = paint('38;5;173'); // Claude's warm orange (#d7875f)
  const dim = paint('38;5;245'); // muted grey
  const bold = paint('1');
  const bandColor = { low: paint('38;5;71'), medium: paint('38;5;178'), high: paint('38;5;167') }[
    a.band
  ];

  const L =
    lang === 'zh'
      ? {
          subtitle: '「Claude 中国用户」检测',
          tagline: '基于 IP 归属地 + 请求头的服务端估算',
          score: '风险分',
          measured: '服务端可见信号',
          browserOnly: '仅浏览器可测(curl 看不到)',
          coverage: '覆盖',
          geo: '归属地',
          noteBody: 'IP/请求头估算,与浏览器端系统检测结果可能不同。',
          full: '完整检测',
          hintJson: 'JSON      → 加 ?format=json',
          hintLang: '语言      → 自动跟随 Accept-Language',
          none: '无',
        }
      : {
          subtitle: 'Claude "China user" check',
          tagline: 'Server-side estimate from IP geo + request headers',
          score: 'Score',
          measured: 'Signals visible server-side',
          browserOnly: 'Browser-only (invisible to curl)',
          coverage: 'Coverage',
          geo: 'Geo',
          noteBody: 'IP/header estimate; differs from the in-browser OS scan.',
          full: 'Full scan',
          hintJson: 'JSON      → add ?format=json',
          hintLang: 'Language  → follows Accept-Language',
          none: 'none',
        };

  const home = lang === 'zh' ? `${SITE}/zh/` : `${SITE}/`;
  const geoStr = [a.geo.country, a.geo.timezone].filter(Boolean).join(' · ') || L.none;
  const browserOnly =
    a.signals
      .filter((s) => !s.measured)
      .map((s) => s.name)
      .join(' · ') || L.none;
  const measured = a.signals
    .filter((s) => s.measured)
    .sort((x, y) => y.contribution - x.contribution);

  const bar = accent('│');
  const rule = (corner: string) => accent(corner + '─'.repeat(52));
  const badge = bandColor('●');

  const out: string[] = [];
  out.push(rule('╭'));
  out.push(`${bar}  ${accent(bold('Fuck Claude'))}  ${dim(L.subtitle)}`);
  out.push(`${bar}  ${dim(L.tagline)}`);
  out.push(bar);
  out.push(
    `${bar}  ${L.score}  ${bandColor(bold(`${a.score}/100`))}   ${badge} ${bandColor(
      t(`band.${a.band}.title`).toUpperCase(),
    )}`,
  );
  out.push(`${bar}  ${t(`band.${a.band}.desc`)}`);
  out.push(bar);
  out.push(`${bar}  ${dim(L.measured)}`);
  for (const s of measured) {
    const c = (s.contribution > 0 ? `+${s.contribution}` : `${s.contribution}`).padStart(4);
    const mark = s.contribution > 0 ? badge : dim('·');
    out.push(`${bar}    ${mark} ${dim(c)}  ${s.name}${s.value ? dim(` · ${s.value}`) : ''}`);
  }
  out.push(bar);
  out.push(`${bar}  ${dim(L.browserOnly)}`);
  out.push(`${bar}    ${dim(browserOnly)}`);
  out.push(bar);
  out.push(`${bar}  ${dim(`${L.coverage} ${a.measuredWeight}/${a.totalWeight}  ·  ${L.geo} ${geoStr}`)}`);
  out.push(`${bar}  ${dim(L.noteBody)}`);
  out.push(rule('╰'));
  out.push(`   ${accent('→')}  ${L.full}  ${accent(home)}`);
  out.push(`   ${dim(L.hintJson)}`);
  out.push(`   ${dim(L.hintLang)}`);
  out.push('');
  return out.join('\n');
}

export const GET: APIRoute = ({ request, url }) => {
  const acceptLang = parseAcceptLanguage(request.headers.get('accept-language') || '');
  const lang = pickLang(url, acceptLang);
  const analysis = analyze(request, lang);
  const vary = 'Accept, Accept-Language, User-Agent';

  if (!wantsJson(url, request)) {
    return new Response(textBody(analysis, lang, wantsColor(url, request)), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        Vary: vary,
        ...CORS,
      },
    });
  }

  return new Response(JSON.stringify(jsonBody(analysis, lang), null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      Vary: vary,
      ...CORS,
    },
  });
};

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS });
