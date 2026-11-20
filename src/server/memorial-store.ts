/**
 * Memorial wall storage on Upstash Redis (REST `fetch`, no SDK).
 * Keys under `fc:mem:${VERCEL_ENV || 'development'}:` — see `memorialPrefix()`.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import {
  daysBetween,
  memorialPrefix,
  type CreateInput,
  type Memorial,
  type MemorialPlan,
  type MemorialStats,
  validateCreateInput,
} from '../config/memorial';

export type MemorialSort = 'new' | 'long' | 'short';

export type MemorialListResult = {
  enabled: boolean;
  items: Memorial[];
  nextCursor: string | null;
  stats: MemorialStats;
};

interface RedisConfig {
  url: string;
  token: string;
}

type PipelineCell = { result?: unknown; error?: string };

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 48;

const RATE_CREATE_WINDOW_MS = 10 * 60_000;
const RATE_CREATE_MAX = 3;
const RATE_CANDLE_WINDOW_MS = 60_000;
const RATE_CANDLE_MAX = 30;
const RATE_MUTATE_WINDOW_MS = 60_000;
const RATE_MUTATE_MAX = 10;

const createWindows = new Map<string, { start: number; used: number }>();
const candleWindows = new Map<string, { start: number; used: number }>();
const mutateWindows = new Map<string, { start: number; used: number }>();

function readEnv(name: string): string {
  return (process.env[name] ?? '').trim();
}

function redisConfig(): RedisConfig | null {
  const url = readEnv('KV_REST_API_URL') || readEnv('UPSTASH_REDIS_REST_URL');
  const token = readEnv('KV_REST_API_TOKEN') || readEnv('UPSTASH_REDIS_REST_TOKEN');
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

function keys() {
  const p = memorialPrefix();
  return {
    seq: `${p}seq`,
    entry: (no: number) => `${p}m:${no}`,
    idxNew: `${p}idx:new`,
    idxDays: `${p}idx:days`,
    agg: `${p}agg`,
  };
}

async function pipeline(config: RedisConfig, commands: (string | number)[][]): Promise<PipelineCell[]> {
  const res = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const cells = (await res.json()) as PipelineCell[];
  const failed = cells.find((cell) => cell.error);
  if (failed) throw new Error(failed.error);
  return cells;
}

async function multiExec(config: RedisConfig, commands: (string | number)[][]): Promise<PipelineCell[]> {
  const res = await fetch(`${config.url}/multi-exec`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const cells = (await res.json()) as PipelineCell[];
  const failed = cells.find((cell) => cell.error);
  if (failed) throw new Error(failed.error);
  return cells;
}

function pruneMap(map: Map<string, { start: number; used: number }>, windowMs: number): void {
  if (map.size <= 2000) return;
  const now = Date.now();
  for (const [key, w] of map) {
    if (now - w.start > windowMs) map.delete(key);
  }
}

function takeAllowance(
  map: Map<string, { start: number; used: number }>,
  clientKey: string,
  bucket: string,
  windowMs: number,
  max: number,
): boolean {
  pruneMap(map, windowMs);
  const now = Date.now();
  const key = `${bucket}:${clientKey}`;
  const current = map.get(key);
  const w = current && now - current.start <= windowMs ? current : { start: now, used: 0 };
  if (w.used >= max) {
    map.set(key, w);
    return false;
  }
  w.used += 1;
  map.set(key, w);
  return true;
}

export function hashEditToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function verifyEditToken(token: string, storedHex: string): boolean {
  const a = Buffer.from(hashEditToken(token), 'utf8');
  const b = Buffer.from(storedHex, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function generateEditToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function flatHashToRecord(flat: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!Array.isArray(flat)) return out;
  for (let i = 0; i + 1 < flat.length; i += 2) {
    out[String(flat[i])] = String(flat[i + 1]);
  }
  return out;
}

function entryFromHash(no: number, fields: Record<string, string>): Memorial | null {
  if (fields.status !== 'visible') return null;
  const days = Number(fields.days);
  const candles = Number(fields.candles);
  if (!fields.createdOn || !fields.bannedOn || !fields.plan || !fields.submittedAt) return null;
  if (!Number.isFinite(days) || !Number.isFinite(candles)) return null;
  const plan = fields.plan as MemorialPlan;
  return {
    no,
    createdOn: fields.createdOn,
    bannedOn: fields.bannedOn,
    days,
    plan,
    candles,
    submittedAt: fields.submittedAt,
  };
}

const EMPTY_STATS: MemorialStats = {
  count: 0,
  avgDays: 0,
  medianDays: 0,
  maxDays: 0,
  minDays: 0,
  candles: 0,
  quantiles: Array.from({ length: 21 }, () => 0),
};

function scoreFromZrange(cell: unknown): number {
  if (!Array.isArray(cell) || cell.length < 2) return 0;
  return Number(cell[1]) || 0;
}

async function readStats(config: RedisConfig): Promise<MemorialStats> {
  const k = keys();
  const [aggCell, cardCell] = await pipeline(config, [
    ['HGETALL', k.agg],
    ['ZCARD', k.idxDays],
  ]);
  const agg = flatHashToRecord(aggCell.result);
  const count = Number(agg.count) || 0;
  const sumDays = Number(agg.sumDays) || 0;
  const candles = Number(agg.candles) || 0;
  if (count <= 0) return { ...EMPTY_STATS, candles };

  const ranks: number[] = [];
  for (let i = 0; i < 21; i += 1) {
    const p = i * 5;
    ranks.push(Math.floor((p / 100) * Math.max(0, count - 1)));
  }
  const medianRank = Math.floor((count - 1) / 2);
  const uniqueRanks = [...new Set([0, medianRank, count - 1, ...ranks])];

  const zcmds: (string | number)[][] = uniqueRanks.map((rank) => [
    'ZRANGE',
    k.idxDays,
    rank,
    rank,
    'WITHSCORES',
  ]);
  const zcells = await pipeline(config, zcmds);
  const rankToScore = new Map<number, number>();
  uniqueRanks.forEach((rank, idx) => {
    rankToScore.set(rank, scoreFromZrange(zcells[idx]?.result));
  });

  const quantiles = ranks.map((r) => rankToScore.get(r) ?? 0);
  return {
    count,
    avgDays: Math.round((sumDays / count) * 100) / 100,
    medianDays: rankToScore.get(medianRank) ?? 0,
    maxDays: rankToScore.get(count - 1) ?? 0,
    minDays: rankToScore.get(0) ?? 0,
    candles,
    quantiles,
  };
}

export async function listMemorial(
  sort: MemorialSort,
  cursorRaw: string | null,
  limitRaw: number,
): Promise<MemorialListResult> {
  const config = redisConfig();
  if (!config) {
    return { enabled: false, items: [], nextCursor: null, stats: { ...EMPTY_STATS } };
  }

  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limitRaw) || DEFAULT_LIMIT));
  const offset = Math.max(0, Math.floor(Number(cursorRaw)) || 0);
  const k = keys();

  let rangeCmd: (string | number)[];
  if (sort === 'new') {
    rangeCmd = ['ZREVRANGE', k.idxNew, offset, offset + limit - 1];
  } else if (sort === 'long') {
    rangeCmd = ['ZREVRANGE', k.idxDays, offset, offset + limit - 1];
  } else {
    rangeCmd = ['ZRANGE', k.idxDays, offset, offset + limit - 1];
  }

  const [idsCell, stats] = await Promise.all([
    pipeline(config, [rangeCmd]).then((c) => c[0]?.result),
    readStats(config),
  ]);

  const ids: number[] = Array.isArray(idsCell)
    ? idsCell.map((v) => Number(v)).filter((n) => Number.isFinite(n))
    : [];
  if (ids.length === 0) {
    return { enabled: true, items: [], nextCursor: null, stats };
  }

  const hcmds = ids.map((no) => ['HGETALL', k.entry(no)] as (string | number)[]);
  const hashes = await pipeline(config, hcmds);
  const items: Memorial[] = [];
  for (let i = 0; i < ids.length; i += 1) {
    const rec = entryFromHash(ids[i], flatHashToRecord(hashes[i]?.result));
    if (rec) items.push(rec);
  }

  const nextCursor = ids.length >= limit ? String(offset + limit) : null;
  return { enabled: true, items, nextCursor, stats };
}

export type CreateOutcome =
  | { status: 'disabled' }
  | { status: 'limited' }
  | { status: 'invalid'; code: string }
  | { status: 'ok'; no: number; editToken: string };

export async function createMemorial(
  raw: unknown,
  clientKey: string,
  now: Date,
): Promise<CreateOutcome> {
  const config = redisConfig();
  if (!config) return { status: 'disabled' };

  const validated = validateCreateInput(raw, now);
  if (!validated.ok) return { status: 'invalid', code: validated.code };

  if (!takeAllowance(createWindows, clientKey, 'create', RATE_CREATE_WINDOW_MS, RATE_CREATE_MAX)) {
    return { status: 'limited' };
  }

  const { value } = validated;
  const days = daysBetween(value.createdOn, value.bannedOn);
  const editToken = generateEditToken();
  const editHash = hashEditToken(editToken);
  const submittedAt = now.toISOString();
  const k = keys();

  const tx = await multiExec(config, [['INCR', k.seq]]);
  const no = Number(tx[0]?.result);
  if (!Number.isFinite(no) || no <= 0) throw new Error('seq failed');

  await multiExec(config, [
    [
      'HSET',
      k.entry(no),
      'createdOn',
      value.createdOn,
      'bannedOn',
      value.bannedOn,
      'days',
      days,
      'plan',
      value.plan,
      'candles',
      0,
      'submittedAt',
      submittedAt,
      'status',
      'visible',
      'editHash',
      editHash,
    ],
    ['ZADD', k.idxNew, no, no],
    ['ZADD', k.idxDays, days, no],
    ['HINCRBY', k.agg, 'count', 1],
    ['HINCRBY', k.agg, 'sumDays', days],
  ]);

  return { status: 'ok', no, editToken };
}

async function loadEntry(
  config: RedisConfig,
  no: number,
): Promise<{ fields: Record<string, string>; exists: boolean }> {
  const k = keys();
  const [cell] = await pipeline(config, [['HGETALL', k.entry(no)]]);
  const fields = flatHashToRecord(cell?.result);
  return { fields, exists: fields.createdOn !== undefined };
}

export type TokenOutcome =
  | { status: 'disabled' }
  | { status: 'forbidden' }
  | { status: 'limited' }
  | { status: 'not_found' }
  | { status: 'ok' };

export async function authorizeMemorial(
  no: number,
  editToken: string | null,
  clientKey: string,
): Promise<TokenOutcome> {
  const config = redisConfig();
  if (!config) return { status: 'disabled' };
  if (!editToken) return { status: 'forbidden' };
  const { fields, exists } = await loadEntry(config, no);
  if (!exists) return { status: 'forbidden' };
  const hash = fields.editHash ?? '';
  if (!hash || !verifyEditToken(editToken, hash)) return { status: 'forbidden' };
  if (!takeAllowance(mutateWindows, clientKey, 'mutate', RATE_MUTATE_WINDOW_MS, RATE_MUTATE_MAX)) {
    return { status: 'limited' };
  }
  return { status: 'ok' };
}

export type UpdateOutcome =
  | { status: 'disabled' }
  | { status: 'forbidden' }
  | { status: 'limited' }
  | { status: 'invalid'; code: string }
  | { status: 'ok' };

export async function updateMemorial(
  no: number,
  raw: unknown,
  editToken: string | null,
  clientKey: string,
  now: Date,
): Promise<UpdateOutcome> {
  const auth = await authorizeMemorial(no, editToken, clientKey);
  if (auth.status !== 'ok') return auth;

  const validated = validateCreateInput(raw, now);
  if (!validated.ok) return { status: 'invalid', code: validated.code };

  const config = redisConfig();
  if (!config) return { status: 'disabled' };

  const { fields } = await loadEntry(config, no);
  if (fields.status !== 'visible') return { status: 'forbidden' };

  const { value } = validated;
  const newDays = daysBetween(value.createdOn, value.bannedOn);
  const oldDays = Number(fields.days) || 0;
  const k = keys();

  const cmds: (string | number)[][] = [
    [
      'HSET',
      k.entry(no),
      'createdOn',
      value.createdOn,
      'bannedOn',
      value.bannedOn,
      'days',
      newDays,
      'plan',
      value.plan,
    ],
    ['ZADD', k.idxDays, newDays, no],
    ['HINCRBY', k.agg, 'sumDays', newDays - oldDays],
  ];
  await multiExec(config, cmds);
  return { status: 'ok' };
}

export type DeleteOutcome =
  | { status: 'disabled' }
  | { status: 'forbidden' }
  | { status: 'limited' }
  | { status: 'ok' };

export async function deleteMemorial(
  no: number,
  editToken: string | null,
  clientKey: string,
): Promise<DeleteOutcome> {
  const auth = await authorizeMemorial(no, editToken, clientKey);
  if (auth.status !== 'ok') return auth;

  const config = redisConfig();
  if (!config) return { status: 'disabled' };

  const { fields } = await loadEntry(config, no);
  if (!fields.createdOn) return { status: 'forbidden' };

  const days = Number(fields.days) || 0;
  const candles = Number(fields.candles) || 0;
  const k = keys();
  const wasVisible = fields.status === 'visible';

  const cmds: (string | number)[][] = [['DEL', k.entry(no)], ['ZREM', k.idxNew, no], ['ZREM', k.idxDays, no]];
  if (wasVisible) {
    cmds.push(['HINCRBY', k.agg, 'count', -1]);
    cmds.push(['HINCRBY', k.agg, 'sumDays', -days]);
    cmds.push(['HINCRBY', k.agg, 'candles', -candles]);
  }
  await multiExec(config, cmds);
  return { status: 'ok' };
}

export type CandleOutcome =
  | { status: 'disabled' }
  | { status: 'forbidden' }
  | { status: 'limited' }
  | { status: 'ok' };

export async function candleMemorial(no: number, clientKey: string): Promise<CandleOutcome> {
  const config = redisConfig();
  if (!config) return { status: 'disabled' };
  if (!takeAllowance(candleWindows, clientKey, 'candle', RATE_CANDLE_WINDOW_MS, RATE_CANDLE_MAX)) {
    return { status: 'limited' };
  }

  const { fields, exists } = await loadEntry(config, no);
  if (!exists || fields.status !== 'visible') return { status: 'forbidden' };

  const k = keys();
  await multiExec(config, [
    ['HINCRBY', k.entry(no), 'candles', 1],
    ['HINCRBY', k.agg, 'candles', 1],
  ]);
  return { status: 'ok' };
}

/** Admin / maintenance: hide visible entry (keeps hash, removes from indexes). */
export async function hideMemorial(no: number, config: RedisConfig): Promise<boolean> {
  const { fields } = await loadEntry(config, no);
  if (!fields.createdOn || fields.status !== 'visible') return false;
  const days = Number(fields.days) || 0;
  const candles = Number(fields.candles) || 0;
  const k = keys();
  await multiExec(config, [
    ['HSET', k.entry(no), 'status', 'hidden'],
    ['ZREM', k.idxNew, no],
    ['ZREM', k.idxDays, no],
    ['HINCRBY', k.agg, 'count', -1],
    ['HINCRBY', k.agg, 'sumDays', -days],
    ['HINCRBY', k.agg, 'candles', -candles],
  ]);
  return true;
}

export async function showMemorial(no: number, config: RedisConfig): Promise<boolean> {
  const { fields } = await loadEntry(config, no);
  if (!fields.createdOn || fields.status !== 'hidden') return false;
  const days = Number(fields.days) || 0;
  const candles = Number(fields.candles) || 0;
  const k = keys();
  await multiExec(config, [
    ['HSET', k.entry(no), 'status', 'visible'],
    ['ZADD', k.idxNew, no, no],
    ['ZADD', k.idxDays, days, no],
    ['HINCRBY', k.agg, 'count', 1],
    ['HINCRBY', k.agg, 'sumDays', days],
    ['HINCRBY', k.agg, 'candles', candles],
  ]);
  return true;
}

export async function adminDeleteMemorial(no: number, config: RedisConfig): Promise<boolean> {
  const { fields } = await loadEntry(config, no);
  if (!fields.createdOn) return false;
  const days = Number(fields.days) || 0;
  const candles = Number(fields.candles) || 0;
  const wasVisible = fields.status === 'visible';
  const k = keys();
  const cmds: (string | number)[][] = [['DEL', k.entry(no)], ['ZREM', k.idxNew, no], ['ZREM', k.idxDays, no]];
  if (wasVisible) {
    cmds.push(['HINCRBY', k.agg, 'count', -1]);
    cmds.push(['HINCRBY', k.agg, 'sumDays', -days]);
    cmds.push(['HINCRBY', k.agg, 'candles', -candles]);
  }
  await multiExec(config, cmds);
  return true;
}

export { redisConfig, readStats, pipeline, multiExec, keys, flatHashToRecord };