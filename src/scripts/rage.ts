/**
 * Smash button and counters.
 *
 * - Clicking the mascot swings a hammer. At the moment of impact the figure
 *   is knocked back, stars and plasters appear and a streak of hits tints it
 *   red. A line shows in the speech bubble, and the visitor's own count
 *   (localStorage) and, when the global store is configured, the global count
 *   by country go up.
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
const MAX_FX = 64;
const MAX_MARKS = 5;
const STAMP_EVERY = 25;
const LINE_COUNT = 8;
const PROPS = ['🍅', '🥚', '👟', '📄'];
const HAMMER_SRC = '/mascot/hammer.svg';
const HAMMER_SIZE = 78;
const SWING_MS = 380;
const IMPACT_AT = 0.4;
const DIZZY_MS = 1100;
const STREAK_RESET_MS = 3500;
const HURT_AT = [1, 5, 12];

const pageLang = langFromDocument();
await loadLocaleData(pageLang);
const t = useTranslations(pageLang);

const q = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel);
const hit = q<HTMLButtonElement>('#mascot-hit');
const mascotEl = q('#mascot');
const stage = q('#mascot-stage');
const body = q('#mascot-body');
const fx = q('#mascot-fx');
const marksEl = q('#mascot-marks');
const stamp = q('#mascot-stamp');
const bubble = q('#mascot-bubble');
const statsEls = document.querySelectorAll('[data-stats]');
const numFormat = new Intl.NumberFormat(pageLang);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let enabled = false;
let smashTotal = 0;
let scanTotal = 0;
let you = readYou();
let pending = 0;
let flushTimer: number | undefined;
let bubbleTimer: number | undefined;
let dizzyTimer: number | undefined;
let streakTimer: number | undefined;
let streak = 0;
let lastLine = -1;
const marks: HTMLElement[] = [];

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
  for (const el of statsEls) el.setAttribute('data-enabled', String(enabled));
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
  window.clearTimeout(bubbleTimer);
  bubbleTimer = window.setTimeout(() => {
    bubble.textContent = t('rage.hint');
  }, holdMs);
}

function pickLine(): string {
  let i = Math.floor(Math.random() * LINE_COUNT);
  if (i === lastLine) i = (i + 1) % LINE_COUNT;
  lastLine = i;
  return t(`rage.line${i + 1}`);
}

interface FxOptions {
  frames?: Keyframe[];
  duration?: number;
  style?: string;
}

function mountFx(el: HTMLElement, frames: Keyframe[], duration: number, easing = 'ease-out') {
  if (!fx || reduceMotion.matches) return;
  while (fx.childElementCount >= MAX_FX) fx.firstElementChild?.remove();
  fx.append(el);
  const anim = el.animate(frames, { duration, easing, fill: 'forwards' });
  anim.onfinish = () => el.remove();
}

function spawnFx(text: string, x: number, y: number, size: number, opts: FxOptions = {}) {
  const el = document.createElement('span');
  el.textContent = text;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:${size}px;line-height:1;pointer-events:none;will-change:transform,opacity;${opts.style ?? ''}`;
  const dx = (Math.random() - 0.5) * 120;
  const spin = (Math.random() - 0.5) * 540;
  const frames: Keyframe[] = opts.frames ?? [
    { transform: 'translate(-50%,-50%) scale(0.4) rotate(0deg)', opacity: 0 },
    { transform: `translate(calc(-50% + ${dx * 0.5}px), -190%) scale(1.15) rotate(${spin * 0.5}deg)`, opacity: 1, offset: 0.35 },
    { transform: `translate(calc(-50% + ${dx}px), 120%) scale(0.9) rotate(${spin}deg)`, opacity: 0 },
  ];
  mountFx(el, frames, opts.duration ?? 750);
}

function spawnPlusOne(x: number, y: number) {
  spawnFx('+1', x, y, 15, {
    frames: [
      { transform: 'translate(-50%,-50%)', opacity: 1 },
      { transform: 'translate(-50%,-230%)', opacity: 0 },
    ],
  });
}

/** Hammer that winds up, swings down onto (x, y) and fades. */
function swingHammer(x: number, y: number) {
  if (reduceMotion.matches) return;
  const img = document.createElement('img');
  img.src = HAMMER_SRC;
  img.alt = '';
  img.draggable = false;
  img.style.cssText = `position:absolute;left:${x - HAMMER_SIZE * 0.34}px;top:${y - HAMMER_SIZE * 0.34}px;width:${HAMMER_SIZE}px;height:${HAMMER_SIZE}px;pointer-events:none;transform-origin:80% 80%;will-change:transform,opacity;`;
  mountFx(
    img,
    [
      { transform: 'rotate(62deg) scale(1.05)', opacity: 0 },
      { transform: 'rotate(62deg) scale(1.05)', opacity: 1, offset: 0.12, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' },
      { transform: 'rotate(0deg) scale(1)', opacity: 1, offset: IMPACT_AT },
      { transform: 'rotate(-5deg) scale(1)', opacity: 1, offset: 0.7 },
      { transform: 'rotate(-5deg) scale(1)', opacity: 0 },
    ],
    SWING_MS,
    'linear',
  );
}

function spawnRing(x: number, y: number) {
  const el = document.createElement('span');
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:22px;height:22px;border:3px solid var(--accent);border-radius:50%;pointer-events:none;will-change:transform,opacity;`;
  mountFx(
    el,
    [
      { transform: 'translate(-50%,-50%) scale(0.3)', opacity: 0.9 },
      { transform: 'translate(-50%,-50%) scale(4.5)', opacity: 0 },
    ],
    420,
  );
}

function spawnSparks(x: number, y: number, count: number) {
  const base = Math.random() * Math.PI;
  for (let i = 0; i < count; i++) {
    const angle = base + (i / count) * Math.PI * 2;
    const dist = 42 + Math.random() * 34;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    spawnFx(i % 2 ? '✦' : '★', x, y, 14 + Math.random() * 8, {
      style: 'color:var(--accent-strong);',
      duration: 460,
      frames: [
        { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.1) rotate(${dx * 4}deg)`, opacity: 0 },
      ],
    });
  }
}

function addMark(x: number, y: number) {
  if (!marksEl) return;
  while (marks.length >= MAX_MARKS) marks.shift()?.remove();
  const rotate = Math.round((Math.random() - 0.5) * 80);
  const el = document.createElement('span');
  el.textContent = '🩹';
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:26px;line-height:1;transform:translate(-50%,-50%) rotate(${rotate}deg);`;
  marksEl.append(el);
  marks.push(el);
  if (reduceMotion.matches) return;
  el.animate(
    [
      { transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(2.4)`, opacity: 0 },
      { transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(1)`, opacity: 1 },
    ],
    { duration: 160, easing: 'ease-out' },
  );
}

function clearDamage() {
  streak = 0;
  mascotEl?.setAttribute('data-hurt', '0');
  for (const el of marks.splice(0)) {
    if (reduceMotion.matches) {
      el.remove();
      continue;
    }
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).onfinish = () => el.remove();
  }
}

function registerStreak() {
  streak += 1;
  const level = HURT_AT.filter((n) => streak >= n).length;
  mascotEl?.setAttribute('data-hurt', String(level));
  window.clearTimeout(streakTimer);
  streakTimer = window.setTimeout(clearDamage, STREAK_RESET_MS);
}

function fireStamp() {
  if (!stamp) return;
  stamp.classList.remove('is-on');
  void stamp.offsetWidth;
  stamp.classList.add('is-on');
}

/** Everything that happens when the hammer lands. */
function impact(x: number, y: number, dir: number, milestone: boolean) {
  if (body) {
    body.style.setProperty('--dir', String(dir));
    body.classList.remove('is-hit');
    void body.offsetWidth;
    body.classList.add('is-hit');
  }
  spawnFx('💥', x, y, milestone ? 96 : 58, {
    duration: 400,
    frames: [
      { transform: 'translate(-50%,-50%) scale(0.3)', opacity: 1 },
      { transform: 'translate(-50%,-50%) scale(1.15)', opacity: 1, offset: 0.35 },
      { transform: 'translate(-50%,-50%) scale(1.35)', opacity: 0 },
    ],
  });
  spawnRing(x, y);
  spawnSparks(x, y, milestone ? 10 : 6);
  spawnFx(PROPS[Math.floor(Math.random() * PROPS.length)], x, y, 28);
  spawnPlusOne(x + 14, y - 8);
  addMark(x, y);

  mascotEl?.classList.add('is-dizzy');
  window.clearTimeout(dizzyTimer);
  dizzyTimer = window.setTimeout(() => mascotEl?.classList.remove('is-dizzy'), DIZZY_MS);
  if ('vibrate' in navigator) navigator.vibrate(milestone ? [12, 30, 12] : 10);
}

function onHit(event: MouseEvent) {
  you += 1;
  smashTotal += 1;
  pending += 1;
  saveYou();
  setNum('#stat-you', you, true);
  setNum('#stat-smash', smashTotal, true);
  mascotEl?.setAttribute('data-engaged', 'true');
  registerStreak();

  const milestone = you % STAMP_EVERY === 0;
  if (stage) {
    const rect = stage.getBoundingClientRect();
    const keyboard = event.detail === 0;
    const x = keyboard ? rect.width / 2 : event.clientX - rect.left;
    const y = keyboard ? rect.height * 0.4 : event.clientY - rect.top;
    const dir = x < rect.width / 2 ? 1 : -1;
    if (reduceMotion.matches) {
      impact(x, y, dir, milestone);
    } else {
      swingHammer(x, y);
      window.setTimeout(() => impact(x, y, dir, milestone), SWING_MS * IMPACT_AT);
    }
  }
  if (milestone) {
    fireStamp();
    say(t('rage.stamp'), 1800);
  } else {
    say(pickLine());
  }

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
if (you > 0) mascotEl?.setAttribute('data-engaged', 'true');
await refresh();
window.setInterval(() => {
  if (document.visibilityState === 'visible') void refresh();
}, POLL_MS);

export {};
