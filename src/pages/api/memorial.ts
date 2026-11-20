import type { APIRoute } from 'astro';
import { createMemorial, listMemorial, type MemorialSort } from '../../server/memorial-store';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
const MAX_BODY_BYTES = 1024;

function json(body: unknown, status: number, cache: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, 'Cache-Control': cache },
  });
}

function isSort(value: string | null): value is MemorialSort {
  return value === 'new' || value === 'long' || value === 'short';
}

function clientKeyOf(context: { clientAddress?: string }): string {
  try {
    return context.clientAddress ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export const GET: APIRoute = async ({ url }) => {
  const sortParam = url.searchParams.get('sort');
  const sort = isSort(sortParam) ? sortParam : 'new';
  const cursor = url.searchParams.get('cursor');
  const limit = Number(url.searchParams.get('limit'));
  try {
    const result = await listMemorial(sort, cursor, limit);
    return json(result, 200, 'public, s-maxage=30, stale-while-revalidate=60');
  } catch {
    return json({ error: 'unavailable' }, 503, 'no-store');
  }
};

export const POST: APIRoute = async (context) => {
  const rawBody = await context.request.arrayBuffer();
  if (rawBody.byteLength > MAX_BODY_BYTES) {
    return json({ error: 'bad_request' }, 400, 'no-store');
  }
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return json({ error: 'bad_request' }, 400, 'no-store');
  }

  try {
    const outcome = await createMemorial(payload, clientKeyOf(context), new Date());
    switch (outcome.status) {
      case 'disabled':
        return json({ enabled: false }, 503, 'no-store');
      case 'limited':
        return json({ error: 'rate_limited' }, 429, 'no-store');
      case 'invalid':
        return json({ error: outcome.code }, 400, 'no-store');
      case 'ok':
        return json({ no: outcome.no, editToken: outcome.editToken }, 201, 'no-store');
      default: {
        const unreachable: never = outcome;
        return unreachable;
      }
    }
  } catch {
    return json({ error: 'unavailable' }, 503, 'no-store');
  }
};

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') ?? '';
  const m = /^Bearer\s+(.+)$/i.exec(header);
  return m ? m[1].trim() : null;
}

export { clientKeyOf };