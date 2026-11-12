import { defaultLang, isLang, LOCALE_CODES, type Lang } from './locales';

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/_/g, '-');
}

/** Map Accept-Language / navigator tags to a site locale. */
export function pickLocaleFromAcceptLanguage(header: string | null | undefined): Lang {
  if (!header) return defaultLang;

  const parts = header.split(',').map((chunk) => {
    const [tag, ...params] = chunk.trim().split(';');
    const qParam = params.find((p) => p.trim().startsWith('q='));
    const q = qParam ? Number.parseFloat(qParam.split('=')[1]) : 1;
    return { tag: normalizeTag(tag), q: Number.isFinite(q) ? q : 0 };
  });

  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    if (isLang(tag)) return tag;

    if (tag === 'zh' || tag.startsWith('zh-')) {
      return 'zh';
    }

    const base = tag.split('-')[0];
    if (isLang(base)) return base;

    const byPrefix = LOCALE_CODES.find((code) => code === base || code.startsWith(`${base}-`));
    if (byPrefix) return byPrefix;
  }

  return defaultLang;
}

export function pickLangFromQueryOrHeader(
  queryLang: string | null,
  acceptLanguage: string | null | undefined,
): Lang {
  if (queryLang && isLang(queryLang)) {
    return queryLang;
  }
  return pickLocaleFromAcceptLanguage(acceptLanguage);
}
