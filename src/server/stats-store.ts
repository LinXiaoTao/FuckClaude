/**
 * Minimal global counters for the smash button and the scan count.
 *
 * Storage: two Redis hashes on Upstash, talked to over the REST API with
 * `fetch` (no SDK). Each hash maps an ISO country code to a count; the total
 * is the sum of the fields, so there is no separate total key to keep in sync.
 *
 *   fc:smash   { CN: 120, US: 33, ... }
 *   fc:scan    { CN: 80,  US: 12, ... }
 *
 * Nothing else is stored: no IPs, no user ids, no timestamps. Rate limiting is
 * an in-memory window per serverless instance, so it costs no Redis keys.
 *
 * Without Redis credentials every call reports `enabled: false` and the
 * client falls back to local-only counting.
 */

export type StatKind = 'smash' | 'scan';

export interface CountryCount {
  code: string;
  count: number;
}

export interface StatSummary {
  total: number;
  top: CountryCount[];
}

export interface StatsSnapshot {
  enabled: boolean;
  smash: StatSummary;
  scan: StatSummary;
}

const HASH_KEY: Record<StatKind, string> = {
  smash: 'fc:smash',
  scan: 'fc:scan',
};

const TOP_N = 8;
const UNKNOWN_COUNTRY = 'XX';

/** Largest increment accepted in one request; the client batches clicks. */
export const MAX_BATCH: Record<StatKind, number> = { smash: 30, scan: 1 };

const RATE_WINDOW_MS = 10_000;
const RATE_MAX: Record<StatKind, number> = { smash: 120, scan: 3 };

interface RedisConfig {
  url: string;
  token: string;
}

function readEnv(name: string): string {
  return (process.env[name] ?? '').trim();
}

function redisConfig(): RedisConfig | null {
  const url = readEnv('KV_REST_API_URL') || readEnv('UPSTASH_REDIS_REST_URL');
  const token = readEnv('KV_REST_API_TOKEN') || readEnv('UPSTASH_REDIS_REST_TOKEN');
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

type PipelineCell = { result?: unknown; error?: string };

async function pipeline(config: RedisConfig, commands: (string | number)[][]): Promise<PipelineCell[]> {
  const res = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(2500),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const cells = (await res.json()) as PipelineCell[];
  const failed = cells.find((cell) => cell.error);
  if (failed) throw new Error(failed.error);
  return cells;
}

/** `HGETALL` returns a flat `[field, value, field, value, ...]` array. */
function summarize(flat: unknown): StatSummary {
  const counts: CountryCount[] = [];
  let total = 0;
  if (Array.isArray(flat)) {
    for (let i = 0; i + 1 < flat.length; i += 2) {
      const count = Number(flat[i + 1]);
      if (!Number.isFinite(count) || count <= 0) continue;
      total += count;
      counts.push({ code: String(flat[i]), count });
    }
  }
  counts.sort((a, b) => b.count - a.count);
  return { total, top: counts.filter((c) => c.code !== UNKNOWN_COUNTRY).slice(0, TOP_N) };
}

const EMPTY: StatSummary = { total: 0, top: [] };

export async function readStats(): Promise<StatsSnapshot> {
  const config = redisConfig();
  if (!config) return { enabled: false, smash: EMPTY, scan: EMPTY };
  const [smash, scan] = await pipeline(config, [
    ['HGETALL', HASH_KEY.smash],
    ['HGETALL', HASH_KEY.scan],
  ]);
  return { enabled: true, smash: summarize(smash.result), scan: summarize(scan.result) };
}

export function countryOf(headers: Headers): string {
  const code = (headers.get('x-vercel-ip-country') ?? '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : UNKNOWN_COUNTRY;
}

const windows = new Map<string, { start: number; used: number }>();

/** Fixed-window limiter keyed by client; returns how many units may still be added. */
function takeAllowance(clientKey: string, kind: StatKind, wanted: number): number {
  const now = Date.now();
  if (windows.size > 2000) {
    for (const [key, w] of windows) if (now - w.start > RATE_WINDOW_MS) windows.delete(key);
  }
  const key = `${kind}:${clientKey}`;
  const current = windows.get(key);
  const w = current && now - current.start <= RATE_WINDOW_MS ? current : { start: now, used: 0 };
  const granted = Math.max(0, Math.min(wanted, RATE_MAX[kind] - w.used));
  w.used += granted;
  windows.set(key, w);
  return granted;
}

export type RecordOutcome =
  | { status: 'disabled' }
  | { status: 'limited' }
  | { status: 'ok'; added: number };

export async function recordStat(
  kind: StatKind,
  requested: number,
  country: string,
  clientKey: string,
): Promise<RecordOutcome> {
  const config = redisConfig();
  if (!config) return { status: 'disabled' };
  const wanted = Math.min(Math.max(1, Math.floor(requested)), MAX_BATCH[kind]);
  const added = takeAllowance(clientKey, kind, wanted);
  if (added <= 0) return { status: 'limited' };
  await pipeline(config, [['HINCRBY', HASH_KEY[kind], country, added]]);
  return { status: 'ok', added };
}
