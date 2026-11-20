/** Client-side memorial helpers (localStorage, no server). */

export type SavedMemorial = { no: number; editToken: string };

const MEM_KEY = 'fc:memorials';
const CANDLE_KEY = 'fc:candles';

export function loadSaved(): SavedMemorial[] {
  try {
    const raw = localStorage.getItem(MEM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is SavedMemorial =>
        !!r &&
        typeof r === 'object' &&
        Number.isInteger((r as SavedMemorial).no) &&
        typeof (r as SavedMemorial).editToken === 'string',
    );
  } catch {
    return [];
  }
}

export function savePair(no: number, editToken: string): void {
  const list = loadSaved().filter((e) => e.no !== no);
  list.push({ no, editToken });
  localStorage.setItem(MEM_KEY, JSON.stringify(list));
}

export function removePair(no: number): void {
  const list = loadSaved().filter((e) => e.no !== no);
  localStorage.setItem(MEM_KEY, JSON.stringify(list));
}

export function loadCandleNos(): Set<number> {
  try {
    const raw = localStorage.getItem(CANDLE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map((n) => Number(n)).filter((n) => Number.isInteger(n) && n > 0));
  } catch {
    return new Set();
  }
}

export function markCandle(no: number): void {
  const set = loadCandleNos();
  set.add(no);
  localStorage.setItem(CANDLE_KEY, JSON.stringify([...set]));
}