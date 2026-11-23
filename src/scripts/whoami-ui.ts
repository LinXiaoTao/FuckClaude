import {
  READING_DEFS,
  RULE_COMPARES,
  displayValue,
  evaluateRules,
  formatElapsed,
  layerSortIndex,
  type Finding,
  type Layer,
  type Reading,
  type ReadingId,
  type Snapshot,
  type Verdict,
} from '../config/whoami';
import { isLang as isSiteLang, type Lang } from '../i18n/locales';
import { loadLocaleData } from '../i18n/locale-data-client';
import { langFromDocument, useTranslations } from '../i18n/ui-client';
import type { UiKey } from '../i18n/ui';
import { collectWhoAmISnapshot, runWebrtcProbe } from './whoami-collect';

type Translate = ReturnType<typeof useTranslations>;

const LAYER_KEYS: Record<Layer, { title: UiKey; desc: UiKey }> = {
  request: { title: 'whoami.layer.request', desc: 'whoami.layer.request.desc' },
  network: { title: 'whoami.layer.network', desc: 'whoami.layer.network.desc' },
  script: { title: 'whoami.layer.script', desc: 'whoami.layer.script.desc' },
  probe: { title: 'whoami.layer.probe', desc: 'whoami.layer.probe.desc' },
};

const VERDICT_KEYS: Record<Exclude<Verdict, 'unknown'>, UiKey> = {
  match: 'whoami.verdict.match',
  mismatch: 'whoami.verdict.mismatch',
};

const RELATION_GLYPHS: Record<Exclude<Verdict, 'unknown'>, string> = {
  match: '=',
  mismatch: '≠',
};

/** Readings longer than this take a full row in the readings grid. */
const WIDE_VALUE_LENGTH = 44;

function readingLabelKey(id: ReadingId): UiKey {
  return `whoami.reading.${id}` as UiKey;
}

function ruleTitleKey(id: string): UiKey {
  return `whoami.rule.${id}.title` as UiKey;
}

function ruleVerdictKey(id: string, verdict: Verdict): UiKey | null {
  if (verdict === 'unknown') return null;
  return `whoami.rule.${id}.${verdict}` as UiKey;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function textEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const node = el(tag, className);
  node.textContent = text;
  return node;
}

// Reading values are raw machine strings (IDs, header values, GPU names). A bdi isolates their
// direction so parentheses and slashes keep their place on `rtl` pages, while the row itself
// stays aligned to the inline start.
function valueEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const node = el(tag, className);
  node.appendChild(textEl('bdi', '', text));
  return node;
}

function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function langOf(root: HTMLElement): Lang {
  const raw = root.dataset.lang ?? langFromDocument();
  return isSiteLang(raw) ? raw : 'en';
}

function regionName(code: string, lang: Lang): string | null {
  const upper = code.trim().toUpperCase();
  try {
    const name = new Intl.DisplayNames(lang, { type: 'region' }).of(upper);
    return name && name !== upper ? name : null;
  } catch {
    return null;
  }
}

function placeFor(snap: Snapshot, lang: Lang): string | null {
  const city = snap['request.city']?.value.trim();
  const code = snap['request.country']?.value;
  const country = code ? (regionName(code, lang) ?? code.trim().toUpperCase()) : null;
  const parts = [city, country].filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts.join(', ') : null;
}

function comparedValue(reading: Reading, lang: Lang): string {
  if (reading.id === 'request.country') {
    const code = reading.value.trim().toUpperCase();
    const name = regionName(code, lang);
    return name ? `${name} (${code})` : code;
  }
  return displayValue(reading.id, reading.value);
}

function verdictLineFor(findings: Finding[], t: Translate): string {
  const decidable = findings.filter((f) => f.verdict !== 'unknown');
  const mismatches = decidable.filter((f) => f.verdict === 'mismatch');
  if (decidable.length === 0) return t('whoami.headline.pending');
  if (mismatches.length > 0) {
    return t('whoami.headline.mismatches')
      .replace('{n}', String(mismatches.length))
      .replace('{total}', String(decidable.length));
  }
  return t('whoami.headline.consistent');
}

function renderHeadline(host: Element, findings: Finding[], snap: Snapshot, lang: Lang, t: Translate): void {
  const where = host.querySelector<HTMLElement>('[data-whoami-where]');
  const verdict = host.querySelector<HTMLElement>('[data-whoami-verdict]');
  if (!where || !verdict) return;
  const place = placeFor(snap, lang);
  where.hidden = place === null;
  where.textContent = place === null ? '' : t('whoami.headline.where').replace('{place}', place);
  verdict.textContent = verdictLineFor(findings, t);
}

function cellNode(reading: Reading, lang: Lang, t: Translate): HTMLElement {
  const cell = el('div', 'whoami__cell');
  const label = el('span', 'whoami__cell-label');
  label.appendChild(textEl('span', 'whoami__time', formatElapsed(reading.atMs)));
  label.appendChild(document.createTextNode(` · ${t(readingLabelKey(reading.id))}`));
  cell.appendChild(label);
  cell.appendChild(valueEl('strong', 'whoami__cell-value', comparedValue(reading, lang)));
  return cell;
}

function relationNode(verdict: Exclude<Verdict, 'unknown'>, t: Translate): HTMLElement {
  const rel = textEl('span', `whoami__rel whoami__rel--${verdict}`, RELATION_GLYPHS[verdict]);
  rel.setAttribute('role', 'img');
  rel.setAttribute('aria-label', t(VERDICT_KEYS[verdict]));
  return rel;
}

function findingNode(f: Finding & { verdict: Exclude<Verdict, 'unknown'> }, snap: Snapshot, lang: Lang, t: Translate): HTMLElement {
  const li = el('li', `whoami__finding whoami__finding--${f.verdict}`);

  const head = el('div', 'whoami__finding-head');
  head.appendChild(textEl('h3', 'whoami__finding-title', t(ruleTitleKey(f.ruleId))));
  head.appendChild(textEl('span', `whoami__verdict-badge whoami__verdict-badge--${f.verdict}`, t(VERDICT_KEYS[f.verdict])));
  li.appendChild(head);

  const cells = f.evidence.map((id) => snap[id]).filter((r): r is Reading => r !== undefined);
  const paired = RULE_COMPARES[f.ruleId] && cells.length >= 2;
  if (paired) {
    const pair = el('div', 'whoami__pair');
    pair.appendChild(cellNode(cells[0], lang, t));
    pair.appendChild(relationNode(f.verdict, t));
    pair.appendChild(cellNode(cells[1], lang, t));
    li.appendChild(pair);
  }
  const rest = paired ? cells.slice(2) : cells;
  if (rest.length > 0) {
    const list = el('div', 'whoami__cells');
    for (const reading of rest) list.appendChild(cellNode(reading, lang, t));
    li.appendChild(list);
  }

  const verdictKey = ruleVerdictKey(f.ruleId, f.verdict);
  if (verdictKey) li.appendChild(textEl('p', 'whoami__finding-verdict', t(verdictKey)));
  return li;
}

function renderFindings(host: Element, findings: Finding[], snap: Snapshot, lang: Lang, t: Translate): void {
  clear(host);
  const decidable = findings
    .filter((f): f is Finding & { verdict: Exclude<Verdict, 'unknown'> } => f.verdict !== 'unknown')
    .sort((a, b) => {
      if (a.verdict === b.verdict) return 0;
      return a.verdict === 'mismatch' ? -1 : 1;
    });

  if (decidable.length === 0) {
    host.appendChild(textEl('p', 'whoami__empty', t('whoami.headline.pending')));
    return;
  }

  const ul = el('ul', 'whoami__findings');
  for (const f of decidable) ul.appendChild(findingNode(f, snap, lang, t));
  host.appendChild(ul);
}

const READING_ORDER = Object.keys(READING_DEFS) as ReadingId[];

function layerNode(layer: Layer, readings: Reading[], t: Translate): HTMLElement {
  const section = el('section', 'whoami__layer');

  const head = el('div', 'whoami__layer-head');
  const finishedAt = Math.max(...readings.map((r) => r.atMs));
  head.appendChild(textEl('span', 'whoami__layer-time', formatElapsed(finishedAt)));
  const titles = el('div', 'whoami__layer-titles');
  titles.appendChild(textEl('h3', 'whoami__layer-title', t(LAYER_KEYS[layer].title)));
  titles.appendChild(textEl('p', 'whoami__layer-desc', t(LAYER_KEYS[layer].desc)));
  head.appendChild(titles);
  head.appendChild(textEl('span', 'whoami__layer-count', t('whoami.layer.count').replace('{n}', String(readings.length))));
  section.appendChild(head);

  const rows = el('dl', 'whoami__rows');
  for (const reading of readings) {
    const wide = reading.value.length > WIDE_VALUE_LENGTH;
    const row = el('div', wide ? 'whoami__row whoami__row--wide' : 'whoami__row');
    const dt = el('dt', 'whoami__row-label');
    dt.appendChild(textEl('span', 'whoami__time', formatElapsed(reading.atMs)));
    dt.appendChild(document.createTextNode(` · ${t(readingLabelKey(reading.id))}`));
    row.appendChild(dt);
    row.appendChild(valueEl('dd', 'whoami__mono', reading.value));
    rows.appendChild(row);
  }
  section.appendChild(rows);
  return section;
}

function renderReadings(host: Element, snap: Snapshot, t: Translate): void {
  clear(host);
  const byLayer = new Map<Layer, Reading[]>();
  for (const id of READING_ORDER) {
    const reading = snap[id];
    if (!reading) continue;
    const list = byLayer.get(reading.layer) ?? [];
    list.push(reading);
    byLayer.set(reading.layer, list);
  }
  const layers = [...byLayer.keys()].sort((a, b) => layerSortIndex(a) - layerSortIndex(b));
  for (const layer of layers) host.appendChild(layerNode(layer, byLayer.get(layer) ?? [], t));
}

async function mountRoot(root: HTMLElement): Promise<void> {
  const lang = langOf(root);
  await loadLocaleData(lang);
  const t = useTranslations(lang);

  const headlineEl = root.querySelector('[data-whoami-headline]');
  const findingsEl = root.querySelector('[data-whoami-findings]');
  const readingsEl = root.querySelector('[data-whoami-readings]');
  const probeBtn = root.querySelector<HTMLButtonElement>('[data-whoami-probe]');
  if (!headlineEl || !findingsEl || !readingsEl || !probeBtn) return;

  let snap: Snapshot = {};

  const refreshUi = () => {
    const findings = evaluateRules(snap);
    renderHeadline(headlineEl, findings, snap, lang, t);
    renderFindings(findingsEl, findings, snap, lang, t);
    renderReadings(readingsEl, snap, t);
  };

  probeBtn.addEventListener('click', async () => {
    probeBtn.disabled = true;
    const prev = probeBtn.textContent;
    probeBtn.textContent = t('whoami.probe.running');
    const probe = await runWebrtcProbe();
    snap = { ...snap, ...probe };
    refreshUi();
    probeBtn.disabled = false;
    probeBtn.textContent = prev ?? t('whoami.probe.run');
  });

  snap = await collectWhoAmISnapshot();
  refreshUi();
}

export function mountWhoAmI(): void {
  document.querySelectorAll<HTMLElement>('[data-whoami]').forEach((root) => {
    void mountRoot(root);
  });
}
