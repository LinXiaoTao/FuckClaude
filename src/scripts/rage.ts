/**
 * Smash button and counters.
 *
 * - Clicking the mascot throws a prop, shows a line in the speech bubble and
 *   adds to the visitor's own count (localStorage) and, when the global store
 *   is configured, to the global count by country.
 * - Clicks are batched and flushed with one POST every few seconds.
 * - A finished scan (`fc:scan-complete`, dispatched by detect.ts) adds one to
 *   the global scan count.
 *
 * Only counts are sent. See src/server/stats-store.ts.
 */
import { loadLocaleData } from '../i18n/locale-data-client';
import { langFromDocument, useTranslations } from '../i18n/ui-client';

type Kind = 'smash' | 'scan';

interface CountryCount {
  code: string;
  count: number;
}
interface Summary {
  total: number;
  top: CountryCount[];
}
interface Snapshot {
  enabled: boolean;
  smash: Summary;
  scan: Summary;
}

const STORAGE_KEY = 'fc:smashes';
const FLUSH_DELAY_MS = 1500;
const FLUSH_AT = 30;
const POLL_MS = 30_000;
const MAX_FX = 24;
const STAMP_EVERY = 25;
const LINE_COUNT = 8;
const PROPS = ['🍅', '🥚', '👟', '🔨', '📄'];

const pageLang = langFromDocument();
await loadLocaleData(pageLang);
const t = useTranslations(pageLang);

const q = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel);
const hit = q<HTMLButtonElement>('#mascot-hit');
const stage = q('#mascot-stage');
const fx = q('#mascot-fx');
const stamp = q('#mascot-stamp');
const bubble = q('#mascot-bubble');
const statsEl = q('#stats');
const numFormat = new Intl.NumberFormat(pageLang);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let enabled = false;
let smashTotal = 0;
let scanTotal = 0;
let you = readYou();
let pending = 0;
let flushTimer: number | undefined;
let bubbleTimer: number | undefined;
let lastLine = -1;

function readYou(): number {
  try {
    const n = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

function saveYou() {
  try {
    localStorage.setItem(STORAGE_KEY, String(you));
  } catch {
    /* private mode: the count just lives for this page view */
  }
}

function setNum(id: string, value: number, bump = false) {
  const el = q(id);
  if (!el) return;
  el.textContent = numFormat.format(value);
  if (!bump || reduceMotion.matches) return;
  el.classList.remove('is-bump');
  void el.offsetWidth;
  el.classList.add('is-bump');
}

function flagOf(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return '';
  return String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

function regionName(code: string): string {
  try {
    return new Intl.DisplayNames([pageLang], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

function renderTop(listId: string, rows: CountryCount[]) {
  const list = q(listId);
  if (!list) return;
  list.replaceChildren();
  if (rows.length === 0) {
    const li = document.createElement('li');
    li.className = 'is-empty';
    li.textContent = t('rage.empty');
    list.append(li);
    return;
  }
  for (const row of rows) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = `${flagOf(row.code)} ${regionName(row.code)}`.trim();
    const count = document.createElement('span');
    count.textContent = numFormat.format(row.count);
    li.append(name, count);
    list.append(li);
  }
}

function renderAll() {
  setNum('#stat-smash', smashTotal);
  setNum('#stat-scan', scanTotal);
  setNum('#stat-you', you);
}

function applySnapshot(snap: Snapshot) {
  enabled = snap.enabled;
  statsEl?.setAttribute('data-enabled', String(enabled));
  const note = q('#stats-note');
  if (note) note.textContent = enabled ? t('rage.note') : t('rage.offline');
  if (!enabled) return;
  smashTotal = snap.smash.total + pending;
  scanTotal = snap.scan.total;
  renderAll();
  renderTop('#top-smash', snap.smash.top);
  renderTop('#top-scan', snap.scan.top);
}

async function refresh() {
  try {
    const res = await fetch('/api/stats', { headers: { Accept: 'application/json' } });
    if (res.ok) applySnapshot((await res.json()) as Snapshot);
  } catch {
    /* offline: keep what is on screen */
  }
}

function send(kind: Kind, n: number, keepalive = false) {
  if (!enabled || n <= 0) return;
  void fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, n }),
    keepalive,
  }).catch(() => {
    /* best effort */
  });
}

function flush(keepalive = false) {
  window.clearTimeout(flushTimer);
  flushTimer = undefined;
  const n = Math.min(pending, FLUSH_AT);
  pending -= n;
  send('smash', n, keepalive);
  if (pending > 0) scheduleFlush();
}

function scheduleFlush() {
  if (flushTimer !== undefined) return;
  flushTimer = window.setTimeout(() => flush(), FLUSH_DELAY_MS);
}

function say(text: string, holdMs = 2600) {
  if (!bubble) return;
  bubble.textContent = text;
  bubble.setAttribute('data-visible', 'true');
  window.clearTimeout(bubbleTimer);
  bubbleTimer = window.setTimeout(() => bubble.setAttribute('data-visible', 'false'), holdMs);
}

function pickLine(): string {
  let i = Math.floor(Math.random() * LINE_COUNT);
  if (i === lastLine) i = (i + 1) % LINE_COUNT;
  lastLine = i;
  return t(`rage.line${i + 1}`);
}

function spawnFx(text: string, x: number, y: number, size: number, extra?: Keyframe[]) {
  if (!fx || reduceMotion.matches) return;
  while (fx.childElementCount >= MAX_FX) fx.firstElementChild?.remove();
  const el = document.createElement('span');
  el.textContent = text;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:${size}px;line-height:1;pointer-events:none;will-change:transform,opacity;`;
  fx.append(el);
  const dx = (Math.random() - 0.5) * 120;
  const spin = (Math.random() - 0.5) * 540;
  const frames: Keyframe[] = extra ?? [
    { transform: 'translate(-50%,-50%) scale(0.4) rotate(0deg)', opacity: 0 },
    { transform: `translate(calc(-50% + ${dx * 0.5}px), -190%) scale(1.15) rotate(${spin * 0.5}deg)`, opacity: 1, offset: 0.35 },
    { transform: `translate(calc(-50% + ${dx}px), 120%) scale(0.9) rotate(${spin}deg)`, opacity: 0 },
  ];
  const anim = el.animate(frames, { duration: 750, easing: 'ease-out', fill: 'forwards' });
  anim.onfinish = () => el.remove();
}

function spawnPlusOne(x: number, y: number) {
  spawnFx('+1', x, y, 15, [
    { transform: 'translate(-50%,-50%)', opacity: 1 },
    { transform: 'translate(-50%,-230%)', opacity: 0 },
  ]);
}

function fireStamp() {
  if (!stamp) return;
  stamp.classList.remove('is-on');
  void stamp.offsetWidth;
  stamp.classList.add('is-on');
}

function onHit(event: MouseEvent) {
  you += 1;
  smashTotal += 1;
  pending += 1;
  saveYou();
  setNum('#stat-you', you, true);
  setNum('#stat-smash', smashTotal, true);

  if (stage) {
    stage.classList.remove('is-hit');
    void stage.offsetWidth;
    stage.classList.add('is-hit');
    const rect = stage.getBoundingClientRect();
    const keyboard = event.detail === 0;
    const x = keyboard ? rect.width / 2 : event.clientX - rect.left;
    const y = keyboard ? rect.height / 2 : event.clientY - rect.top;
    const milestone = you % STAMP_EVERY === 0;
    spawnFx(milestone ? '🔨' : PROPS[Math.floor(Math.random() * PROPS.length)], x, y, milestone ? 44 : 28);
    spawnPlusOne(x + 14, y - 8);
  }
  if (you % STAMP_EVERY === 0) {
    fireStamp();
    say(t('rage.stamp'), 1800);
  } else {
    say(pickLine());
  }
  if ('vibrate' in navigator) navigator.vibrate(8);

  if (pending >= FLUSH_AT) flush();
  else scheduleFlush();
}

function onScanComplete() {
  scanTotal += 1;
  setNum('#stat-scan', scanTotal, true);
  send('scan', 1);
}

hit?.addEventListener('click', onHit);
document.addEventListener('fc:scan-complete', onScanComplete);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush(true);
});
window.addEventListener('pagehide', () => flush(true));

setNum('#stat-you', you);
await refresh();
window.setInterval(() => {
  if (document.visibilityState === 'visible') void refresh();
}, POLL_MS);

export {};
