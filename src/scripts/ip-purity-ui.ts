/**
 * Client render for the IP purity card and the /ip page.
 *
 * Homepage cards use `data-ip-defer`: they wait for Start scan (detect.ts)
 * to call `startDeferredIpPurity`. Full /ip pages still fetch on mount.
 * Does not touch the China-user score.
 */
import { useTranslations, type Lang } from '../i18n/ui';

interface Deduction {
  code: string;
  label: string;
  points: number;
  source: string;
}

interface SourceReport {
  status?: string;
  detail?: string;
}

export interface IpPayload {
  ip?: string | null;
  purity?: number | null;
  band?: string | null;
  geo?: { country?: string | null; region?: string | null; city?: string | null; countryCode?: string | null };
  network?: { asn?: string | null; org?: string | null; isp?: string | null; type?: string | null };
  flags?: {
    proxy?: boolean | null;
    vpn?: boolean | null;
    tor?: boolean | null;
    datacenter?: boolean | null;
    abusive?: boolean | null;
  };
  claudeHint?: { level?: string; textEn?: string; textZh?: string };
  deductions?: Deduction[];
  sources?: Record<string, SourceReport | undefined>;
  sourcesConfigured?: boolean;
  notice?: { code?: string; textEn?: string; textZh?: string } | null;
  disclaimer?: string;
  error?: string;
  message?: string;
}

export type IpFetchResult =
  | { kind: 'ok'; data: IpPayload }
  | { kind: 'rate_limited'; message?: string }
  | { kind: 'error'; message?: string };

const FLAG_KEYS = ['proxy', 'vpn', 'tor', 'datacenter', 'abusive'] as const;
const SOURCE_KEYS = ['proxycheck', 'abuseipdb', 'ipwho'] as const;

function isLang(value: string | null): value is Lang {
  return value === 'en' || value === 'zh';
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function noticeText(data: IpPayload, lang: Lang): string {
  if (!data.notice) return '';
  return lang === 'zh' ? data.notice.textZh || data.notice.textEn || '' : data.notice.textEn || data.notice.textZh || '';
}

function hintText(data: IpPayload, lang: Lang): string {
  const hint = data.claudeHint;
  if (!hint) return '';
  return lang === 'zh' ? hint.textZh || hint.textEn || '' : hint.textEn || hint.textZh || '';
}

function langOf(root: HTMLElement): Lang {
  return isLang(root.dataset.lang ?? null) ? (root.dataset.lang as Lang) : 'en';
}

function bodyOf(root: HTMLElement): Element | null {
  return root.querySelector('[data-ip-body]');
}

/** Relative `/api/ip` fetch. Never throws; callers decide how to render. */
export async function fetchIpPurity(): Promise<IpFetchResult> {
  try {
    const res = await fetch('/api/ip', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    let data: IpPayload = {};
    try {
      data = (await res.json()) as IpPayload;
    } catch {
      data = {};
    }
    if (res.status === 429) {
      return { kind: 'rate_limited', message: data.message };
    }
    if (!res.ok || data.error) {
      return { kind: 'error', message: data.message };
    }
    return { kind: 'ok', data };
  } catch {
    return { kind: 'error' };
  }
}

export function setIpPurityIdle(root: HTMLElement): void {
  // Invalidate in-flight fetch so a late response cannot paint over idle/pending.
  root.dataset.ipGen = String((Number(root.dataset.ipGen || '0') || 0) + 1);
  const body = bodyOf(root);
  if (!body) return;
  const t = useTranslations(langOf(root));
  clear(body);
  root.removeAttribute('data-band');
  body.append(el('p', 'ip-card__state', t('ip.waitScan')));
}

export function setIpPurityPending(root: HTMLElement): void {
  const body = bodyOf(root);
  if (!body) return;
  const t = useTranslations(langOf(root));
  clear(body);
  root.removeAttribute('data-band');
  body.append(el('p', 'ip-card__state', t('ip.loading')));
}

export function applyIpPurityResult(root: HTMLElement, result: IpFetchResult): void {
  const body = bodyOf(root);
  if (!body) return;
  const lang = langOf(root);
  const t = useTranslations(lang);
  if (result.kind === 'rate_limited') {
    renderMessage(root, body, result.message || t('ip.rateLimited'), t('ip.retry'), () => {
      void startIpPurityLoad(root);
    });
    return;
  }
  if (result.kind === 'error') {
    renderMessage(root, body, result.message || t('ip.error'), t('ip.retry'), () => {
      void startIpPurityLoad(root);
    });
    return;
  }
  renderResult(root, body, result.data, lang);
}

/** Fetch + render for one card (page mount, retry, or homepage Start scan). */
export async function startIpPurityLoad(root: HTMLElement): Promise<void> {
  const gen = String((Number(root.dataset.ipGen || '0') || 0) + 1);
  root.dataset.ipGen = gen;
  setIpPurityPending(root);
  const result = await fetchIpPurity();
  if (root.dataset.ipGen !== gen) return; // superseded by a newer scan/retry
  applyIpPurityResult(root, result);
}

/**
 * Wire every `[data-ip-purity]` once.
 * Deferred homepage cards stay idle until `startDeferredIpPurity`.
 * Full /ip pages fetch immediately.
 */
export function mountAllIpPurity(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ip-purity]').forEach((node) => {
    if (node.dataset.ipReady === '1') return;
    node.dataset.ipReady = '1';
    if (node.hasAttribute('data-ip-defer')) {
      setIpPurityIdle(node);
      return;
    }
    void startIpPurityLoad(node);
  });
}

/** Homepage: kick deferred cards when Start scan begins (parallel with signals). */
export function startDeferredIpPurity(root: ParentNode = document): Promise<void> {
  const jobs: Promise<void>[] = [];
  root.querySelectorAll<HTMLElement>('[data-ip-purity][data-ip-defer]').forEach((node) => {
    jobs.push(startIpPurityLoad(node));
  });
  return Promise.all(jobs).then(() => undefined);
}

function renderMessage(root: HTMLElement, body: Element, message: string, retryLabel: string, retry: () => void): void {
  clear(body);
  root.removeAttribute('data-band');
  body.append(el('p', 'ip-card__state', message));
  const button = el('button', 'ip-card__retry', retryLabel);
  button.type = 'button';
  button.addEventListener('click', retry);
  body.append(button);
}

function renderResult(root: HTMLElement, body: Element, data: IpPayload, lang: Lang): void {
  const t = useTranslations(lang);
  const page = root.dataset.variant === 'page';
  clear(body);
  if (data.band === 'high' || data.band === 'medium' || data.band === 'low') root.dataset.band = data.band;
  else root.removeAttribute('data-band');

  const head = el('div', 'ip-card__scoreline');
  const scoreWrap = el('div', 'ip-card__scoreblock');
  const scoreLabel = el('span', 'ip-card__kicker', t('ip.scoreLabel'));
  const scoreValue = el('p', 'ip-card__score');
  if (typeof data.purity === 'number') {
    scoreValue.append(document.createTextNode(String(data.purity)));
    scoreValue.append(el('small', undefined, t('ip.outOf')));
  } else {
    scoreValue.textContent = t('ip.scoreUnknown');
  }
  scoreWrap.append(scoreLabel, scoreValue);
  if (data.band === 'high' || data.band === 'medium' || data.band === 'low') {
    scoreWrap.append(el('span', `ip-card__band ip-card__band--${data.band}`, t(`ip.band.${data.band}`)));
  }
  head.append(scoreWrap);

  const typeName = data.network?.type || 'Unknown';
  const typeKey = `ip.type.${typeName}`;
  const typeLabel = t(typeKey) === typeKey ? typeName : t(typeKey);
  head.append(el('span', 'ip-card__type', typeLabel));
  body.append(head);

  const note = noticeText(data, lang);
  if (note) body.append(el('p', 'ip-card__notice', note));

  const meta = el('dl', 'ip-card__meta');
  addMeta(meta, t('ip.yourIp'), data.ip || '—');
  const place = [data.geo?.country || data.geo?.countryCode, data.geo?.region, data.geo?.city]
    .filter((part): part is string => Boolean(part))
    .join(' · ');
  addMeta(meta, t('ip.geo'), place || '—');
  const net = [data.network?.asn, data.network?.org || data.network?.isp].filter((part): part is string => Boolean(part)).join(' · ');
  addMeta(meta, t('ip.network'), net || '—');
  body.append(meta);

  const flags = el('ul', 'ip-card__flags');
  for (const key of FLAG_KEYS) {
    const value = data.flags?.[key];
    const state = value === true ? 'yes' : value === false ? 'no' : 'unknown';
    const item = el('li', `ip-flag ip-flag--${state}`);
    item.append(el('span', 'ip-flag__name', t(`ip.flag.${key}`)));
    item.append(el('span', 'ip-flag__val', t(`ip.flag.${state}`)));
    flags.append(item);
  }
  body.append(flags);

  const hint = hintText(data, lang);
  if (hint) {
    const level = data.claudeHint?.level === 'ok' || data.claudeHint?.level === 'risky' ? data.claudeHint.level : 'caution';
    body.append(el('p', `ip-card__hint ip-card__hint--${level}`, hint));
  }

  if (page) {
    body.append(el('h3', 'ip-card__h', t('ip.deductions')));
    const rows = data.deductions ?? [];
    if (!rows.length) body.append(el('p', 'ip-card__muted', t('ip.noDeductions')));
    else {
      const list = el('ul', 'ip-card__deductions');
      for (const row of rows) {
        const item = el('li', 'ip-deduction');
        const codeKey = `ip.deduction.${row.code}`;
        const label = t(codeKey) === codeKey ? row.label : t(codeKey);
        item.append(el('span', 'ip-deduction__pts', row.points === 0 ? '0' : String(row.points)));
        const text = el('span', 'ip-deduction__label', label);
        if (row.source) text.append(el('small', undefined, ` · ${row.source}`));
        item.append(text);
        list.append(item);
      }
      body.append(list);
    }

    body.append(el('h3', 'ip-card__h', t('ip.sources')));
    const sources = el('ul', 'ip-card__sources');
    for (const key of SOURCE_KEYS) {
      const report = data.sources?.[key];
      const status = report?.status || 'unavailable';
      const statusKey = `ip.source.${status}`;
      const item = el('li', 'ip-source');
      item.append(el('span', 'ip-source__name', t(`ip.source.${key}`)));
      item.append(el('span', `ip-source__status ip-source__status--${status}`, t(statusKey) === statusKey ? status : t(statusKey)));
      if (key === 'ipwho') item.append(el('small', undefined, t('ip.source.ipwhoNote')));
      sources.append(item);
    }
    body.append(sources);
  }

  const links = el('div', 'ip-card__links');
  if (!page && root.dataset.details) links.append(anchor(root.dataset.details, t('ip.details'), true));
  if (root.dataset.extension) links.append(anchor(root.dataset.extension, t('ip.cta.extension'), false));
  if (root.dataset.guide) links.append(anchor(root.dataset.guide, t('ip.cta.guide'), false));
  body.append(links);
  body.append(el('p', 'ip-card__disclaimer', t('ip.disclaimer')));
  body.append(el('p', 'ip-card__separate', t('ip.separate')));
}

function addMeta(list: HTMLDListElement, label: string, value: string): void {
  list.append(el('dt', undefined, label));
  list.append(el('dd', undefined, value));
}

function anchor(href: string, label: string, primary: boolean): HTMLAnchorElement {
  const link = el('a', primary ? 'ip-card__link ip-card__link--primary' : 'ip-card__link', label);
  link.href = href;
  return link;
}
