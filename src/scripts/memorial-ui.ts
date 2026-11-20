/**
 * Memorial wall UI: list, form, compare (local-only), my tombstones, candles.
 */
import { daysBetween, percentBelow, todayUtcPlus14, type Memorial, type MemorialStats } from '../config/memorial';
import { loadLocaleData } from '../i18n/locale-data-client';
import { langFromDocument, useTranslations } from '../i18n/ui-client';
import { loadCandleNos, loadSaved, markCandle, removePair, savePair, type SavedMemorial } from './memorial';

await loadLocaleData(langFromDocument());
const t = useTranslations(langFromDocument());
const lang = langFromDocument();
const numFormat = new Intl.NumberFormat(lang, { numberingSystem: 'latn' });

type Sort = 'new' | 'long' | 'short';

const root = document.querySelector<HTMLElement>('[data-memorial-root]');
const grid = document.getElementById('mem-grid');
const loadMore = document.getElementById('mem-load-more');
const offline = document.getElementById('mem-offline');
const wall = document.querySelector<HTMLElement>('[data-mem-wall]');
const formWrap = document.querySelector<HTMLElement>('[data-mem-form-wrap]');
const mySection = document.querySelector<HTMLElement>('[data-mem-my]');

let enabled = true;
let sort: Sort = 'new';
let cursor: string | null = null;
let stats: MemorialStats | null = null;
let items: Memorial[] = [];
let formOpenedAt = Date.now();

function errText(code: string): string {
  const key = `memorial.err.${code}` as const;
  try {
    return t(key);
  } catch {
    return code;
  }
}

function setNum(id: string, value: number): void {
  const el = document.getElementById(id);
  if (!el) return;
  const text = numFormat.format(value);
  el.textContent = text;
  el.style.setProperty('--len', String(text.length));
}

function fillStats(s: MemorialStats): void {
  setNum('mem-stat-count', s.count);
  setNum('mem-stat-median', s.medianDays);
  setNum('mem-stat-max', s.maxDays);
  setNum('mem-stat-min', s.minDays);
  setNum('mem-stat-candles', s.candles);
}

function planLabel(plan: string): string {
  try {
    return t(`memorial.plan.${plan}` as 'memorial.plan.free');
  } catch {
    return plan;
  }
}

function renderCard(m: Memorial): HTMLElement {
  const lit = loadCandleNos().has(m.no);
  const card = document.createElement('article');
  card.className = 'mem-card';
  card.dataset.no = String(m.no);

  const noEl = document.createElement('p');
  noEl.className = 'mem-card__no';
  noEl.textContent = t('memorial.card.no').replace('{no}', String(m.no));

  const daysEl = document.createElement('p');
  daysEl.className = 'mem-card__days';
  daysEl.textContent = t('memorial.card.survived').replace('{days}', numFormat.format(m.days));

  const chip = document.createElement('span');
  chip.className = 'mem-chip';
  chip.textContent = planLabel(m.plan);

  const meta = document.createElement('p');
  meta.className = 'mem-card__meta';
  meta.textContent = `${t('memorial.card.created').replace('{date}', m.createdOn)} · ${t('memorial.card.banned').replace('{date}', m.bannedOn)}`;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mem-candle';
  btn.disabled = lit;
  const label = document.createElement('span');
  label.textContent = t('memorial.card.candle');
  const count = document.createElement('span');
  count.className = 'mem-candle__n';
  count.textContent = t('memorial.card.candleCount').replace('{n}', numFormat.format(m.candles));
  btn.append(label, count);
  btn.addEventListener('click', () => void onCandle(m.no, count, btn));

  card.append(noEl, daysEl, chip, meta, btn);
  return card;
}

function renderGrid(): void {
  if (!grid) return;
  grid.replaceChildren(...items.map(renderCard));
}

async function fetchPage(append: boolean): Promise<void> {
  const params = new URLSearchParams({ sort, limit: '24' });
  if (append && cursor) params.set('cursor', cursor);
  const res = await fetch(`/api/memorial?${params}`);
  const data = (await res.json()) as {
    enabled?: boolean;
    items?: Memorial[];
    nextCursor?: string | null;
    stats?: MemorialStats;
    error?: string;
  };
  enabled = data.enabled !== false;
  if (!enabled) {
    setOffline();
    return;
  }
  stats = data.stats ?? stats;
  if (stats) fillStats(stats);
  const batch = data.items ?? [];
  items = append ? [...items, ...batch] : batch;
  cursor = data.nextCursor ?? null;
  renderGrid();
  if (loadMore) loadMore.hidden = !cursor;
  root?.setAttribute('data-state', 'on');
  showInteractive();
  updateCompare();
}

function setOffline(): void {
  enabled = false;
  offline?.removeAttribute('hidden');
  wall?.setAttribute('hidden', '');
  formWrap?.setAttribute('hidden', '');
  mySection?.setAttribute('hidden', '');
  root?.setAttribute('data-state', 'off');
  for (const id of ['mem-stat-count', 'mem-stat-median', 'mem-stat-max', 'mem-stat-min', 'mem-stat-candles']) {
    const el = document.getElementById(id);
    if (el) el.textContent = '–';
  }
}

function showInteractive(): void {
  wall?.removeAttribute('hidden');
  formWrap?.removeAttribute('hidden');
  mySection?.removeAttribute('hidden');
}

async function onCandle(no: number, countEl: HTMLElement, btn: HTMLButtonElement): Promise<void> {
  if (loadCandleNos().has(no)) return;
  const res = await fetch(`/api/memorial/${no}/candle`, { method: 'POST' });
  if (!res.ok) return;
  markCandle(no);
  btn.disabled = true;
  const item = items.find((i) => i.no === no);
  if (item) {
    item.candles += 1;
    countEl.textContent = t('memorial.card.candleCount').replace('{n}', numFormat.format(item.candles));
  }
  if (stats) {
    stats.candles += 1;
    setNum('mem-stat-candles', stats.candles);
  }
}

function updateCompare(): void {
  const input = document.getElementById('mem-compare-date') as HTMLInputElement | null;
  const out = document.getElementById('mem-compare-out');
  if (!input || !out || !stats) return;
  const created = input.value;
  if (!created) {
    out.hidden = true;
    return;
  }
  const today = todayUtcPlus14(new Date());
  const days = daysBetween(created, today);
  if (days < 0) {
    out.hidden = true;
    return;
  }
  const pct = percentBelow(days, stats.quantiles);
  out.textContent = t('memorial.compare.result').replace('{pct}', numFormat.format(pct));
  out.hidden = false;
}

function renderMyList(): void {
  const list = document.getElementById('mem-my-list');
  const empty = document.getElementById('mem-my-empty');
  const saved = loadSaved();
  if (!list || !empty) return;
  if (saved.length === 0) {
    empty.hidden = false;
    list.replaceChildren();
    return;
  }
  empty.hidden = true;
  list.replaceChildren(...saved.map((entry) => myRow(entry)));
}

function myRow(entry: SavedMemorial): HTMLElement {
  const li = document.createElement('li');
  li.className = 'mem-my-item';
  const label = document.createElement('span');
  label.textContent = t('memorial.card.no').replace('{no}', String(entry.no));
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'mem-btn mem-btn--ghost';
  edit.textContent = t('memorial.my.edit');
  edit.addEventListener('click', () => void startEdit(entry));
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'mem-btn mem-btn--ghost';
  del.textContent = t('memorial.my.delete');
  del.addEventListener('click', () => void deleteMine(entry));
  li.append(label, edit, del);
  return li;
}

let editing: SavedMemorial | null = null;

async function findMemorial(no: number): Promise<Memorial | null> {
  const local = items.find((i) => i.no === no);
  if (local) return local;
  let pageCursor: string | null = null;
  for (let page = 0; page < 24; page += 1) {
    const params = new URLSearchParams({ sort: 'new', limit: '48' });
    if (pageCursor) params.set('cursor', pageCursor);
    const res = await fetch(`/api/memorial?${params}`);
    const data = (await res.json()) as { items?: Memorial[]; nextCursor?: string | null };
    const hit = (data.items ?? []).find((i) => i.no === no);
    if (hit) return hit;
    pageCursor = data.nextCursor ?? null;
    if (!pageCursor) break;
  }
  return null;
}

async function startEdit(entry: SavedMemorial): Promise<void> {
  const row = await findMemorial(entry.no);
  if (!row || !form) return;
  editing = entry;
  (form.elements.namedItem('createdOn') as HTMLInputElement).value = row.createdOn;
  (form.elements.namedItem('bannedOn') as HTMLInputElement).value = row.bannedOn;
  (form.elements.namedItem('plan') as HTMLSelectElement).value = row.plan;
  form.hidden = false;
  document.getElementById('mem-success')?.setAttribute('hidden', '');
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteMine(entry: SavedMemorial): Promise<void> {
  const res = await fetch(`/api/memorial/${entry.no}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${entry.editToken}` },
  });
  if (!res.ok) {
    alert(errText((await res.json().catch(() => ({})) as { error?: string }).error ?? 'forbidden'));
    return;
  }
  removePair(entry.no);
  items = items.filter((i) => i.no !== entry.no);
  renderGrid();
  renderMyList();
  await fetchPage(false);
}

const form = document.getElementById('mem-form') as HTMLFormElement | null;
form?.addEventListener('focusin', () => {
  if (formOpenedAt === 0) formOpenedAt = Date.now();
}, { once: true });
formOpenedAt = Date.now();

form?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const errEl = document.getElementById('mem-form-err');
  if (errEl) errEl.hidden = true;
  const fd = new FormData(form);
  const body = {
    createdOn: String(fd.get('createdOn') ?? ''),
    bannedOn: String(fd.get('bannedOn') ?? ''),
    plan: String(fd.get('plan') ?? ''),
    website: String(fd.get('website') ?? ''),
    elapsedMs: Date.now() - formOpenedAt,
  };
  if (editing) {
    const res = await fetch(`/api/memorial/${editing.no}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${editing.editToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      if (errEl) {
        errEl.textContent = errText(data.error ?? 'bad_request');
        errEl.hidden = false;
      }
      return;
    }
    editing = null;
    await fetchPage(false);
    renderMyList();
    return;
  }
  const res = await fetch('/api/memorial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { no?: number; editToken?: string; error?: string; enabled?: boolean };
  if (!res.ok) {
    if (errEl) {
      errEl.textContent = errText(data.error ?? 'bad_request');
      errEl.hidden = false;
    }
    return;
  }
  if (data.no !== undefined && data.editToken) {
    savePair(data.no, data.editToken);
    const success = document.getElementById('mem-success');
    const code = document.getElementById('mem-edit-code');
    if (code) code.textContent = data.editToken;
    success?.removeAttribute('hidden');
    form.hidden = true;
    renderMyList();
    await fetchPage(false);
  }
});

document.getElementById('mem-copy-code')?.addEventListener('click', async () => {
  const code = document.getElementById('mem-edit-code')?.textContent ?? '';
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
  } catch {
  void 0}
});

document.querySelectorAll<HTMLButtonElement>('.mem-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const next = tab.dataset.sort as Sort | undefined;
    if (!next || next === sort) return;
    sort = next;
    document.querySelectorAll('.mem-tab').forEach((el) => el.classList.remove('is-active'));
    tab.classList.add('is-active');
    cursor = null;
    void fetchPage(false);
  });
});

loadMore?.addEventListener('click', () => void fetchPage(true));

document.getElementById('mem-compare-date')?.addEventListener('input', updateCompare);

const claim = document.getElementById('mem-claim-form') as HTMLFormElement | null;
claim?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const errEl = document.getElementById('mem-claim-err');
  if (errEl) errEl.hidden = true;
  const fd = new FormData(claim);
  const no = Number(fd.get('no'));
  const editToken = String(fd.get('editToken') ?? '').trim();
  if (!Number.isInteger(no) || no <= 0 || !editToken) return;
  const row = await findMemorial(no);
  if (!row) {
    if (errEl) {
      errEl.textContent = errText('forbidden');
      errEl.hidden = false;
    }
    return;
  }
  const res = await fetch(`/api/memorial/${no}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${editToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      createdOn: row.createdOn,
      bannedOn: row.bannedOn,
      plan: row.plan,
      website: '',
      elapsedMs: 5000,
    }),
  });
  if (res.status === 403) {
    if (errEl) {
      errEl.textContent = errText('forbidden');
      errEl.hidden = false;
    }
    return;
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (errEl) {
      errEl.textContent = errText(data.error ?? 'bad_request');
      errEl.hidden = false;
    }
    return;
  }
  savePair(no, editToken);
  claim.reset();
  renderMyList();
});

renderMyList();
void fetchPage(false);

export {};