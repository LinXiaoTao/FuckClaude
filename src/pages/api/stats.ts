/**
 * Global counters: how many times the mascot was smashed and how many scans ran.
 *
 * GET  → { enabled, smash: { total, top }, scan: { total, top } }
 * POST → body { kind: 'smash', n } or { kind: 'scan' }; adds to the caller's country.
 *
 * Only a count and the country from `x-vercel-ip-country` are stored. See
 * `src/server/stats-store.ts`.
 */
import type { APIRoute } from 'astro';
import { MAX_BATCH, countryOf, readStats, recordStat, type StatKind } from '../../server/stats-store';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function json(body: unknown, status: number, cache: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, 'Cache-Control': cache },
  });
}

function isKind(value: unknown): value is StatKind {
  return value === 'smash' || value === 'scan';
}

function clientKeyOf(context: { clientAddress?: string }): string {
  try {
    return context.clientAddress ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export const GET: APIRoute = async () => {
  try {
    return json(await readStats(), 200, 'public, s-maxage=30, stale-while-revalidate=60');
  } catch {
    return json({ error: 'unavailable' }, 503, 'no-store');
  }
};

export const POST: APIRoute = async (context) => {
  let payload: unknown;
  try {
    payload = await context.request.json();
  } catch {
    return json({ error: 'bad_request' }, 400, 'no-store');
  }
  const body = (payload ?? {}) as { kind?: unknown; n?: unknown };
  if (!isKind(body.kind)) return json({ error: 'bad_request' }, 400, 'no-store');
  const requested = body.kind === 'scan' ? 1 : Number(body.n);
  if (!Number.isFinite(requested) || requested < 1 || requested > MAX_BATCH[body.kind]) {
    return json({ error: 'bad_request' }, 400, 'no-store');
  }

  try {
    const outcome = await recordStat(
      body.kind,
      requested,
      countryOf(context.request.headers),
      clientKeyOf(context),
    );
    switch (outcome.status) {
      case 'disabled':
        return json({ enabled: false }, 200, 'no-store');
      case 'limited':
        return json({ error: 'rate_limited' }, 429, 'no-store');
      case 'ok':
        return json({ enabled: true, added: outcome.added }, 200, 'no-store');
      default: {
        const unreachable: never = outcome;
        return unreachable;
      }
    }
  } catch {
    return json({ error: 'unavailable' }, 503, 'no-store');
  }
};
