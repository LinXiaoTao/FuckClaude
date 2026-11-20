import type { APIRoute } from 'astro';

export const prerender = false;

const ALLOWED_HEADERS = [
  'accept-language',
  'user-agent',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-gpc',
  'dnt',
  'accept-encoding',
] as const;

function decodeHeaderValue(raw: string | null): string | null {
  if (raw === null || raw === '') return null;
  try {
    return decodeURIComponent(raw.replace(/\+/g, ' '));
  } catch {
    return raw;
  }
}

function pickHeaders(request: Request): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const key of ALLOWED_HEADERS) {
    const v = request.headers.get(key);
    out[key] = v && v.length > 0 ? v : null;
  }
  return out;
}

function clientAddressOf(context: { clientAddress?: string }): string | null {
  try {
    return context.clientAddress ?? null;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async (context) => {
  const h = context.request.headers;
  const geo = {
    country: decodeHeaderValue(h.get('x-vercel-ip-country')),
    region: decodeHeaderValue(h.get('x-vercel-ip-country-region')),
    city: decodeHeaderValue(h.get('x-vercel-ip-city')),
    timezone: decodeHeaderValue(h.get('x-vercel-ip-timezone')),
  };

  const body = {
    ip: clientAddressOf(context),
    geo,
    headers: pickHeaders(context.request),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  });
};