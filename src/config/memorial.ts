/** Self-reported banned-account wall: types and pure validation (no I/O). */

export type MemorialPlan = 'free' | 'pro' | 'max' | 'other';

export const PLANS: readonly MemorialPlan[] = ['free', 'pro', 'max', 'other'] as const;

/** First broad public Claude release (API + partners). Source: Anthropic announcement below. */
export const CLAUDE_FIRST_RELEASE = '2023-03-14';

export const CLAUDE_FIRST_RELEASE_SOURCE =
  'https://www.anthropic.com/news/introducing-claude';

export interface Memorial {
  no: number;
  createdOn: string;
  bannedOn: string;
  days: number;
  plan: MemorialPlan;
  candles: number;
  submittedAt: string;
}

export interface MemorialStats {
  count: number;
  avgDays: number;
  medianDays: number;
  maxDays: number;
  minDays: number;
  candles: number;
  quantiles: number[];
}

export type CreateInput = {
  createdOn: string;
  bannedOn: string;
  plan: MemorialPlan;
  website: string;
  elapsedMs: number;
};

export type MemorialValidationCode =
  | 'bad_request'
  | 'invalid_date'
  | 'dates_reversed'
  | 'banned_future'
  | 'before_release'
  | 'invalid_plan'
  | 'honeypot'
  | 'elapsed_too_short';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseCalendarDate(value: string): Date | null {
  if (!DATE_RE.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return dt;
}

/** Latest calendar date anywhere on Earth (UTC+14, Kiritimati). */
export function todayUtcPlus14(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Pacific/Kiritimati',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function daysBetween(createdOn: string, bannedOn: string): number {
  const a = parseCalendarDate(createdOn);
  const b = parseCalendarDate(bannedOn);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function isPlan(value: unknown): value is MemorialPlan {
  return typeof value === 'string' && (PLANS as readonly string[]).includes(value);
}

export function validateCreateInput(
  raw: unknown,
  now: Date,
): { ok: true; value: CreateInput } | { ok: false; code: MemorialValidationCode } {
  if (!raw || typeof raw !== 'object') return { ok: false, code: 'bad_request' };
  const body = raw as Record<string, unknown>;

  const createdOn = typeof body.createdOn === 'string' ? body.createdOn.trim() : '';
  const bannedOn = typeof body.bannedOn === 'string' ? body.bannedOn.trim() : '';
  if (!parseCalendarDate(createdOn) || !parseCalendarDate(bannedOn)) {
    return { ok: false, code: 'invalid_date' };
  }
  if (bannedOn < createdOn) return { ok: false, code: 'dates_reversed' };
  if (createdOn < CLAUDE_FIRST_RELEASE) return { ok: false, code: 'before_release' };
  const latest = todayUtcPlus14(now);
  if (bannedOn > latest) return { ok: false, code: 'banned_future' };
  if (!isPlan(body.plan)) return { ok: false, code: 'invalid_plan' };

  const website = typeof body.website === 'string' ? body.website : String(body.website ?? '');
  if (website.trim() !== '') return { ok: false, code: 'honeypot' };

  const elapsedMs = Number(body.elapsedMs);
  if (!Number.isFinite(elapsedMs) || elapsedMs < 2000) {
    return { ok: false, code: 'elapsed_too_short' };
  }

  return {
    ok: true,
    value: {
      createdOn,
      bannedOn,
      plan: body.plan,
      website,
      elapsedMs,
    },
  };
}

/** Share of quantile sample strictly below `days` (0–100). */
export function percentBelow(days: number, quantiles: number[]): number {
  if (quantiles.length === 0) return 0;
  let below = 0;
  for (const q of quantiles) {
    if (q < days) below += 1;
  }
  return Math.round((below / quantiles.length) * 1000) / 10;
}

export function memorialPrefix(): string {
  return `fc:mem:${process.env.VERCEL_ENV || 'development'}:`;
}