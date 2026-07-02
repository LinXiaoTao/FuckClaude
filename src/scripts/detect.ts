/**
 * Client-side entry point. Runs an animated "scan": each signal lights up in
 * turn, the gauge climbs as contributions add up, and once every signal has
 * been checked it shows a verdict plus the list of matched signals.
 * Everything runs locally in the browser.
 */
import { SIGNALS, riskBand, signalVerdict, type SignalDef } from '../config/signals';
import { useTranslations, type Lang } from '../i18n/ui';

const SCAN_STEP_MS = 460;
const SETTLE_MS = 150;

function currentLang(): Lang {
  return document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}
const t = useTranslations(currentLang());

function q<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(sel);
}
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

interface Hit {
  signal: SignalDef;
  contribution: number;
}

type MascotState = 'doze' | 'search' | 'low' | 'medium' | 'high';
function setMascot(state: MascotState) {
  q('#mascot')?.setAttribute('data-state', state);
}

function setRing(total: number) {
  const ring = q<SVGCircleElement>('#score-ring');
  const valueEl = q('#score-value');
  if (ring) {
    ring.style.strokeDasharray = `${RING_C}px`;
    ring.style.strokeDashoffset = `${RING_C * (1 - total / 100)}px`;
  }
  if (valueEl) valueEl.textContent = String(total);
}

function resetUI() {
  setRing(0);
  const gauge = q('#score-gauge');
  gauge?.removeAttribute('data-band');
  gauge?.setAttribute('data-scanning', 'true');

  const badge = q('#risk-badge');
  if (badge) {
    badge.textContent = t('scan.detecting') + '…';
    badge.removeAttribute('data-band');
  }
  const desc = q('#risk-desc');
  if (desc) desc.textContent = '';

  const result = q('#result');
  if (result) result.hidden = true;

  for (const s of SIGNALS) {
    const row = q(`[data-signal="${s.id}"]`);
    if (!row) continue;
    row.classList.remove('is-active', 'is-done');
    row.classList.add('is-pending');
    row.removeAttribute('data-verdict');
    const val = q('[data-field="value"]', row);
    const contrib = q('[data-field="contribution"]', row);
    const dot = q('[data-field="dot"]', row);
    if (val) val.textContent = '';
    if (contrib) contrib.textContent = '';
    if (dot) dot.className = 'dot';
  }
}

function finalize(total: number, hits: Hit[]) {
  const band = riskBand(total);
  setMascot(band);
  q('#score-gauge')?.removeAttribute('data-scanning');
  q('#score-gauge')?.setAttribute('data-band', band);

  const badge = q('#risk-badge');
  if (badge) {
    badge.textContent = t(`band.${band}.title`);
    badge.setAttribute('data-band', band);
  }
  const desc = q('#risk-desc');
  if (desc) desc.textContent = t(`band.${band}.desc`);

  const titleEl = q('#result-title');
  const hitsBox = q('#result-hits');
  if (hitsBox) hitsBox.innerHTML = '';

  if (hits.length === 0) {
    if (titleEl) titleEl.textContent = t('result.noHits');
  } else {
    if (titleEl) titleEl.textContent = t('result.hitsTitle');
    for (const { signal, contribution } of hits) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('data-verdict', signalVerdict(contribution / signal.weight));
      chip.innerHTML =
        `<span class="chip__icon">${signal.icon}</span>` +
        `<span>${t(`signal.${signal.id}.name`)}</span>` +
        `<b>+${contribution}</b>`;
      hitsBox.appendChild(chip);
    }
  }
  const result = q('#result');
  if (result) result.hidden = false;
}

let running = false;

async function run() {
  if (running) return;
  running = true;
  const btn = q<HTMLButtonElement>('#retest');
  if (btn) btn.disabled = true;

  setMascot('search');
  resetUI();
  await delay(SETTLE_MS);

  let total = 0;
  const hits: Hit[] = [];

  for (const signal of SIGNALS) {
    const row = q(`[data-signal="${signal.id}"]`);
    row?.classList.remove('is-pending');
    row?.classList.add('is-active');
    await delay(SCAN_STEP_MS);

    let outcome;
    try {
      outcome = signal.detect();
    } catch {
      outcome = { raw: '—', score: 0 };
    }
    const contribution = Math.round(outcome.score * signal.weight);
    const verdict = signalVerdict(outcome.score);
    total += contribution;

    if (row) {
      const val = q('[data-field="value"]', row);
      const contrib = q('[data-field="contribution"]', row);
      const dot = q('[data-field="dot"]', row);
      if (val) val.textContent = outcome.raw;
      if (contrib) contrib.textContent = `+${contribution}`;
      if (dot) dot.className = `dot dot--${verdict}`;
      row.classList.remove('is-active');
      row.classList.add('is-done');
      row.setAttribute('data-verdict', verdict);
    }

    setRing(Math.min(100, total));
    if (verdict !== 'low') hits.push({ signal, contribution });
    await delay(SETTLE_MS);
  }

  finalize(Math.min(100, total), hits);
  const label = q('#retest-label');
  if (label) label.textContent = t('ui.retest');
  if (btn) btn.disabled = false;
  running = false;
}

/**
 * No auto-run: the mascot dozes until the user hits "Start scan",
 * then it wakes up and hunts for signals.
 */
function init() {
  q('#retest')?.addEventListener('click', () => run());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
