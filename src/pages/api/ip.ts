/**
 * Egress IP purity. Separate from `/api/check` and from the China-user score.
 *
 * `Accept: application/json` or `?format=json` → JSON (what the site uses).
 * Anything else → a short plain-text report. `?format=text` forces text.
 * `?ip=` is ignored. The scored address is the request egress only.
 *
 * In-memory cache (~8 min) and 30 requests/minute are per serverless instance.
 */
import type { APIRoute } from 'astro';
import { API_IP_FAILED, API_IP_RATE_LIMIT } from '../../i18n/api-messages';
import { pickLangFromQueryOrHeader } from '../../i18n/pick-lang';
import type { Lang } from '../../i18n/locales';
import { localize } from '../../i18n/localize';
import { DISCLAIMER, evaluateIp, renderText, type IpPurityResponse } from '../../server/ip-purity';

export const prerender = false;

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept, Content-Type',
};

function wantsJson(url: URL, request: Request): boolean {
  const fmt = (url.searchParams.get('format') || '').toLowerCase();
  if (fmt === 'json') return true;
  if (fmt === 'text' || fmt === 'txt') return false;
  return (request.headers.get('accept') || '').toLowerCase().includes('application/json');
}

function localizeResponse(body: IpPurityResponse, lang: Lang): IpPurityResponse {
  return { ...body, disclaimer: localize(DISCLAIMER, lang) };
}

function clientAddressOf(context: { clientAddress?: string }): string | null {
  try {
    return context.clientAddress ?? null;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async (context) => {
  const lang = pickLangFromQueryOrHeader(
    context.url.searchParams.get('lang'),
    context.request.headers.get('accept-language'),
  );
  const json = wantsJson(context.url, context.request);
  try {
    const outcome = await evaluateIp(context.request.headers, clientAddressOf(context));
    if (outcome.kind === 'rate_limited') {
      const message = localize(API_IP_RATE_LIMIT, lang);
      const payload = { error: 'rate_limited', message, limit: 30, windowSeconds: 60 };
      return new Response(json ? JSON.stringify(payload, null, 2) : `${message}\n`, {
        status: 429,
        headers: {
          'Content-Type': json ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'Retry-After': '60',
          Vary: 'Accept, Accept-Language',
          ...CORS,
        },
      });
    }

    const body = localizeResponse(outcome.body, lang);
    if (!json) {
      return new Response(renderText(body, lang), {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'private, max-age=300',
          Vary: 'Accept, Accept-Language',
          ...CORS,
        },
      });
    }
    return new Response(JSON.stringify(body, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'private, max-age=300',
        Vary: 'Accept, Accept-Language',
        ...CORS,
      },
    });
  } catch {
    const message = localize(API_IP_FAILED, lang);
    return new Response(JSON.stringify({ error: 'error', message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        ...CORS,
      },
    });
  }
};

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS });
