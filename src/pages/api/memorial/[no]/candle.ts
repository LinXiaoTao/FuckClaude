import type { APIRoute } from 'astro';
import { candleMemorial } from '../../../../server/memorial-store';
import { clientKeyOf } from '../../memorial';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, 'Cache-Control': 'no-store' },
  });
}

function parseNo(raw: string | undefined): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export const POST: APIRoute = async (context) => {
  const no = parseNo(context.params.no);
  if (no === null) return json({ error: 'bad_request' }, 400);

  try {
    const outcome = await candleMemorial(no, clientKeyOf(context));
    switch (outcome.status) {
      case 'disabled':
        return json({ error: 'unavailable' }, 503);
      case 'forbidden':
        return json({ error: 'forbidden' }, 403);
      case 'limited':
        return json({ error: 'rate_limited' }, 429);
      case 'ok':
        return json({ ok: true }, 200);
      default: {
        const unreachable: never = outcome;
        return unreachable;
      }
    }
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
};