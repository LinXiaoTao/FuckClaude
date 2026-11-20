import {
  READING_DEFS,
  evaluateRules,
  layerSortIndex,
  type Finding,
  type Layer,
  type ReadingId,
  type Snapshot,
  type Verdict,
} from '../config/whoami';
import { isLang as isSiteLang, type Lang } from '../i18n/locales';
import { loadLocaleData } from '../i18n/locale-data-client';
import { langFromDocument, useTranslations } from '../i18n/ui-client';
import type { UiKey } from '../i18n/ui';
import { collectWhoAmISnapshot, runWebrtcProbe } from './whoami-collect';

function layerKey(layer: Layer): UiKey {
  switch (layer) {
    case 'request':
      return 'whoami.layer.request';
    case 'network':
      return 'whoami.layer.network';
    case 'script':
      return 'whoami.layer.script';
    case 'probe':
      return 'whoami.layer.probe';
    default: {
      const _exhaustive: never = layer;
      return _exhaustive;
    }
  }
}

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

function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function langOf(root: HTMLElement): Lang {
  const raw = root.dataset.lang ?? langFromDocument();
  return isSiteLang(raw) ? raw : 'en';
}

function headlineFor(findings: Finding[], t: ReturnType<typeof useTranslations>): string {
  const decidable = findings.filter((f) => f.verdict !== 'unknown');
  const mismatches = decidable.filter((f) => f.verdict === 'mismatch');
  const matches = decidable.filter((f) => f.verdict === 'match');
  if (decidable.length === 0) return t('whoami.headline.pending');
  if (mismatches.length > 0) return t('whoami.headline.mismatches').replace('{n}', String(mismatches.length));
  if (matches.length > 0) return t('whoami.headline.consistent');
  return t('whoami.headline.pending');
}

function renderFindings(
  host: Element,
  findings: Finding[],
  snap: Snapshot,
  t: ReturnType<typeof useTranslations>,
): void {
  clear(host);
  const decidable = findings
    .filter((f) => f.verdict === 'match' || f.verdict === 'mismatch')
    .sort((a, b) => {
      if (a.verdict === b.verdict) return 0;
      return a.verdict === 'mismatch' ? -1 : 1;
    });

  if (decidable.length === 0) {
    const p = el('p', 'whoami__empty');
    p.textContent = t('whoami.headline.pending');
    host.appendChild(p);
    return;
  }

  const ul = el('ul', 'whoami__findings');
  for (const f of decidable) {
    const li = el('li', `whoami__finding whoami__finding--${f.verdict}`);
    const title = el('h3', 'whoami__finding-title');
    title.textContent = t(ruleTitleKey(f.ruleId));
    li.appendChild(title);
    const badge = el('span', `whoami__verdict-badge whoami__verdict-badge--${f.verdict}`);
    badge.textContent =
      f.verdict === 'match' ? t('whoami.verdict.match') : t('whoami.verdict.mismatch');
    li.appendChild(badge);
    const verdictKey = ruleVerdictKey(f.ruleId, f.verdict);
    if (verdictKey) {
      const verdict = el('p', 'whoami__finding-verdict');
      verdict.textContent = t(verdictKey);
      li.appendChild(verdict);
    }
    const ev = el('dl', 'whoami__evidence');
    for (const id of f.evidence) {
      const reading = snap[id];
      if (!reading) continue;
      const dt = el('dt');
      dt.textContent = t(readingLabelKey(id));
      const dd = el('dd', 'whoami__mono');
      dd.textContent = reading.value;
      ev.appendChild(dt);
      ev.appendChild(dd);
    }
    li.appendChild(ev);
    ul.appendChild(li);
  }
  host.appendChild(ul);
}

function renderReadings(host: Element, snap: Snapshot, t: ReturnType<typeof useTranslations>): void {
  clear(host);
  const byLayer = new Map<Layer, ReadingId[]>();
  for (const id of Object.keys(snap) as ReadingId[]) {
    if (!snap[id]) continue;
    const layer = READING_DEFS[id].layer;
    const list = byLayer.get(layer) ?? [];
    list.push(id);
    byLayer.set(layer, list);
  }

  const layers = [...byLayer.keys()].sort((a, b) => layerSortIndex(a) - layerSortIndex(b));
  for (const layer of layers) {
    const section = el('section', 'whoami__layer');
    const h2 = el('h2', 'whoami__layer-title');
    h2.textContent = t(layerKey(layer));
    section.appendChild(h2);
    const table = el('table', 'whoami__table');
    const thead = el('thead');
    const headRow = el('tr');
    for (const label of [t('whoami.col.reading'), t('whoami.col.value'), t('whoami.col.timing')]) {
      const th = el('th');
      th.textContent = label;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = el('tbody');
    const ids = byLayer.get(layer) ?? [];
    ids.sort();
    for (const id of ids) {
      const reading = snap[id]!;
      const tr = el('tr');
      const tdName = el('td');
      tdName.textContent = t(readingLabelKey(id));
      const tdVal = el('td', 'whoami__mono');
      tdVal.textContent = reading.value;
      const tdMs = el('td', 'whoami__ms');
      tdMs.textContent = t('whoami.ms').replace('{n}', String(Math.round(reading.atMs)));
      tr.appendChild(tdName);
      tr.appendChild(tdVal);
      tr.appendChild(tdMs);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    section.appendChild(table);
    host.appendChild(section);
  }
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
  let started = performance.now();

  const refreshUi = () => {
    const findings = evaluateRules(snap);
    if (headlineEl) headlineEl.textContent = headlineFor(findings, t);
    renderFindings(findingsEl, findings, snap, t);
    renderReadings(readingsEl, snap, t);
  };

  probeBtn.addEventListener('click', async () => {
    probeBtn.disabled = true;
    const prev = probeBtn.textContent;
    probeBtn.textContent = t('whoami.probe.running');
    const probe = await runWebrtcProbe(started);
    snap = { ...snap, ...probe };
    refreshUi();
    probeBtn.disabled = false;
    probeBtn.textContent = prev ?? t('whoami.probe.run');
  });

  snap = await collectWhoAmISnapshot();
  started = performance.now();
  refreshUi();
}

export function mountWhoAmI(): void {
  document.querySelectorAll<HTMLElement>('[data-whoami]').forEach((root) => {
    void mountRoot(root);
  });
}