import type { APIRoute } from 'astro';
import { deleteMemorial, updateMemorial } from '../../../server/memorial-store';
import { bearerToken, clientKeyOf } from '../memorial';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
const MAX_BODY_BYTES = 1024;

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

export const PATCH: APIRoute = async (context) => {
  const no = parseNo(context.params.no);
  if (no === null) return json({ error: 'bad_request' }, 400);

  const rawBody = await context.request.arrayBuffer();
  if (rawBody.byteLength > MAX_BODY_BYTES) {
    return json({ error: 'bad_request' }, 400);
  }
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const token = bearerToken(context.request);
  try {
    const outcome = await updateMemorial(no, payload, token, clientKeyOf(context), new Date());
    switch (outcome.status) {
      case 'disabled':
        return json({ error: 'unavailable' }, 503);
      case 'forbidden':
        return json({ error: 'forbidden' }, 403);
      case 'limited':
        return json({ error: 'rate_limited' }, 429);
      case 'invalid':
        return json({ error: outcome.code }, 400);
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

export const DELETE: APIRoute = async (context) => {
  const no = parseNo(context.params.no);
  if (no === null) return json({ error: 'bad_request' }, 400);

  const token = bearerToken(context.request);
  try {
    const outcome = await deleteMemorial(no, token, clientKeyOf(context));
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