/**
 * Client-side entry point. Runs an animated "scan": each signal lights up in
 * turn, the gauge climbs as contributions add up, and once every signal has
 * been checked it shows a verdict plus the list of matched signals.
 * Everything runs locally in the browser.
 */
import { SIGNALS, riskBand, signalVerdict, type SignalDef, type RiskBand } from '../config/signals';
import { CN_MODELS } from '../config/cn-models';
import { useTranslations, type Lang } from '../i18n/ui';
import { renderResultCard, type CardHit } from './share-card';

/**
 * High-risk consolation links — "But you still have Kimi Code, DeepSeek and GLM".
 * Kimi leads and is branded "Kimi Code"; URLs come from CN_MODELS (utm-tagged).
 */
const BAND_HIGH_LINKS = [
  { id: 'kimi', label: 'Kimi Code' },
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'glm', label: 'GLM' },
].flatMap((link) => {
  const model = CN_MODELS.find((m) => m.id === link.id);
  return model ? [{ ...link, url: model.url }] : [];
});

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


function updateResultSponsor(total: number) {
  const title = q('#result-sponsor-title');
  if (!title) return;
  const tpl = title.getAttribute('data-title-template') ?? '';
  title.textContent = tpl.replace('{score}', String(total));
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
  const share = q('#share');
  if (share) share.hidden = true;
  const save = q('#share-save');
  if (save) save.hidden = true;
  resetCard();

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
  if (desc) {
    desc.textContent = t(`band.${band}.desc`);
    // High risk gets a consolation plug:
    // "But you still have <Kimi Code>, <DeepSeek> and <GLM>".
    if (band === 'high') {
      desc.append(` ${t('band.high.extra')} `);
      BAND_HIGH_LINKS.forEach((link, i) => {
        if (i > 0) {
          desc.append(i === BAND_HIGH_LINKS.length - 1 ? t('band.high.extraSepLast') : t('band.high.extraSep'));
        }
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.label;
        a.setAttribute('data-ga-event', 'cn_model_click');
        a.setAttribute('data-ga-id', `${link.id}-band-high`);
        desc.appendChild(a);
      });
    }
  }

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
      hitsBox?.appendChild(chip);
    }
  }

  const cardHits: CardHit[] = hits.map(({ signal, contribution }) => ({
    name: t(`signal.${signal.id}.name`),
    contribution,
    verdict: signalVerdict(contribution / signal.weight),
  }));

  updateShare(total, band);
  void buildCard(total, band, cardHits);
  updateResultSponsor(total);

  const result = q('#result');
  if (result) result.hidden = false;
}

/**
 * One-click sharing of the result. The message is rebuilt on every scan so it
 * always carries the latest score + verdict, then wired to native sharing
 * (Web Share API — the "adapt to clients" path that pops the OS/app share
 * sheet on mobile) and to per-platform web share links as a fallback.
 */
interface SharePayload {
  text: string;
  url: string;
}
let sharePayload: SharePayload = { text: '', url: '' };

type ShareData = { title?: string; text?: string; url?: string; files?: File[] };
const nav = navigator as Navigator & {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
};

const CARD_FILENAME = 'fuck-claude-result.png';
let cardBlob: Blob | null = null;

function resetCard() {
  cardBlob = null;
}

/** Render the shareable result image off the current scan (async, non-blocking). */
async function buildCard(total: number, band: RiskBand, hits: CardHit[]) {
  try {
    const blob = await renderResultCard({
      lang: currentLang(),
      title: t('hero.title'),
      score: total,
      band,
      bandTitle: t(`band.${band}.title`),
      bandDesc: t(`band.${band}.desc`),
      outOf: t('hero.scoreOutOf'),
      hits,
      url: pageShareUrl(),
      brand: 'Fuck Claude',
    });
    cardBlob = blob;
    const save = q<HTMLButtonElement>('#share-save');
    if (save && blob) save.hidden = false;
  } catch {
    cardBlob = null;
  }
}

function cardFile(): File | null {
  return cardBlob ? new File([cardBlob], CARD_FILENAME, { type: 'image/png' }) : null;
}

function pageShareUrl(): string {
  try {
    const u = new URL(window.location.href);
    u.hash = '';
    u.search = '';
    return u.toString();
  } catch {
    return window.location.href;
  }
}

function shareCaption(): string {
  return `${sharePayload.text} ${sharePayload.url}`.trim();
}

function updateShare(total: number, band: RiskBand) {
  const verdict = t(`band.${band}.title`);
  const text = t('share.text').replace('{score}', String(total)).replace('{verdict}', verdict);
  const url = pageShareUrl();
  sharePayload = { text, url };

  const enc = encodeURIComponent;
  const links: Record<string, string> = {
    x: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
    weibo: `https://service.weibo.com/share/share.php?url=${enc(url)}&title=${enc(text)}`,
    telegram: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    reddit: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(text)}`,
  };
  for (const key of Object.keys(links)) {
    const a = q<HTMLAnchorElement>(`[data-share="${key}"]`);
    if (a) a.href = links[key];
  }

  const native = q<HTMLButtonElement>('#share-native');
  if (native && typeof nav.share === 'function') native.hidden = false;

  const share = q('#share');
  if (share) share.hidden = false;
}

function fallbackCopy(textToCopy: string): boolean {
  try {
    const ta = document.createElement('textarea');
    ta.value = textToCopy;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the execCommand fallback */
  }
  return fallbackCopy(text);
}

/** Flash a button into its confirmed state, then restore the idle label. */
function flashCopied(btn: HTMLElement, label: Element | null, idle: string, flashText = t('share.copied')) {
  btn.classList.add('is-copied');
  if (label) label.textContent = flashText;
  setTimeout(() => {
    btn.classList.remove('is-copied');
    if (label) label.textContent = idle;
  }, 1600);
}

/** Native share sheet, attaching the result image when the platform allows it. */
async function nativeShare(): Promise<boolean> {
  if (typeof nav.share !== 'function') return false;
  const file = cardFile();
  try {
    if (file && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
      await nav.share({ text: sharePayload.text, url: sharePayload.url, files: [file] });
    } else {
      await nav.share({ text: sharePayload.text, url: sharePayload.url });
    }
    return true;
  } catch {
    return false; // user dismissed or the platform refused
  }
}

function saveImage(): boolean {
  if (!cardBlob) return false;
  try {
    const url = URL.createObjectURL(cardBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = CARD_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

function initShare() {
  q<HTMLButtonElement>('#share-native')?.addEventListener('click', () => {
    void nativeShare();
  });

  const copy = q<HTMLButtonElement>('#share-copy');
  const copyLabel = q('#share-copy-label');
  const copyIdle = copyLabel?.textContent ?? t('share.copy');
  copy?.addEventListener('click', async () => {
    if (await copyText(shareCaption())) flashCopied(copy, copyLabel, copyIdle);
  });

  const save = q<HTMLButtonElement>('#share-save');
  const saveLabel = q('#share-save-label');
  const saveIdle = saveLabel?.textContent ?? t('share.save');
  save?.addEventListener('click', () => {
    if (saveImage()) flashCopied(save, saveLabel, saveIdle, t('share.saved'));
  });
}

/** Remember an explicit language choice so the homepage auto-detect respects it. */
function initLangMemory() {
  for (const a of document.querySelectorAll<HTMLAnchorElement>('.lang-toggle a[data-lang]')) {
    a.addEventListener('click', () => {
      try {
        localStorage.setItem('fc-lang', a.dataset.lang || '');
      } catch {
        /* localStorage unavailable (private mode) — auto-detect still works */
      }
    });
  }
}

/** Copy-to-clipboard for the default curl command shown in the API section. */
function initApiCopy() {
  const btn = q<HTMLButtonElement>('#api-copy');
  const label = q('#api-copy-label');
  const idle = label?.textContent ?? t('share.copy');
  btn?.addEventListener('click', async () => {
    const text = btn.dataset.copy?.trim() ?? '';
    if (text && (await copyText(text))) flashCopied(btn, label, idle);
  });
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
      outcome = await signal.detect();
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
  initShare();
  initApiCopy();
  initLangMemory();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
