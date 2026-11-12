/**
 * Single registry for site locales (path prefix, hreflang, text direction).
 */

export interface LocaleMeta {
  code: string;
  label: string;
  htmlLang: string;
  hreflang: string;
  ogLocale: string;
  dir: 'ltr' | 'rtl';
  /** Empty string for the default English root; otherwise e.g. `/zh`, `/ru`. */
  pathPrefix: string;
}

export const LOCALES = {
  en: {
    code: 'en',
    label: 'English',
    htmlLang: 'en',
    hreflang: 'en',
    ogLocale: 'en_US',
    dir: 'ltr',
    pathPrefix: '',
  },
  zh: {
    code: 'zh',
    label: '中文',
    htmlLang: 'zh-CN',
    hreflang: 'zh-CN',
    ogLocale: 'zh_CN',
    dir: 'ltr',
    pathPrefix: '/zh',
  },
  ru: {
    code: 'ru',
    label: 'Русский',
    htmlLang: 'ru',
    hreflang: 'ru',
    ogLocale: 'ru_RU',
    dir: 'ltr',
    pathPrefix: '/ru',
  },
  fa: {
    code: 'fa',
    label: 'فارسی',
    htmlLang: 'fa',
    hreflang: 'fa',
    ogLocale: 'fa_IR',
    dir: 'rtl',
    pathPrefix: '/fa',
  },
  es: {
    code: 'es',
    label: 'Español',
    htmlLang: 'es',
    hreflang: 'es',
    ogLocale: 'es_ES',
    dir: 'ltr',
    pathPrefix: '/es',
  },
  ar: {
    code: 'ar',
    label: 'العربية',
    htmlLang: 'ar',
    hreflang: 'ar',
    ogLocale: 'ar_SA',
    dir: 'rtl',
    pathPrefix: '/ar',
  },
  my: {
    code: 'my',
    label: 'မြန်မာ',
    htmlLang: 'my',
    hreflang: 'my',
    ogLocale: 'my_MM',
    dir: 'ltr',
    pathPrefix: '/my',
  },
} as const satisfies Record<string, LocaleMeta>;

export type Lang = keyof typeof LOCALES;

export const defaultLang: Lang = 'en';

export const LOCALE_CODES = Object.keys(LOCALES) as Lang[];

/** Locales that use a path prefix (all except English). */
export const PREFIXED_LOCALES = LOCALE_CODES.filter((code) => LOCALES[code].pathPrefix !== '');

export function isLang(value: string): value is Lang {
  return Object.hasOwn(LOCALES, value);
}

/** Build a locale-prefixed path. `path` is the English/default route (e.g. `/guides/foo/`). */
export function localePath(lang: Lang, path = '/'): string {
  const { pathPrefix } = LOCALES[lang];
  if (!pathPrefix) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  if (path === '/' || path === '') {
    return `${pathPrefix}/`;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${pathPrefix}${normalized}`;
}

/** Strip any known locale prefix, returning the default-locale path. */
export function stripLocalePrefix(pathname: string): string {
  let normalized = pathname.replace(/\/index\.html$/, '') || '/';
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  const sorted = [...PREFIXED_LOCALES].sort(
    (a, b) => LOCALES[b].pathPrefix.length - LOCALES[a].pathPrefix.length,
  );

  for (const code of sorted) {
    const prefix = LOCALES[code].pathPrefix;
    if (normalized === prefix) {
      return '/';
    }
    if (normalized.startsWith(`${prefix}/`)) {
      const rest = normalized.slice(prefix.length);
      return rest || '/';
    }
  }

  return normalized === '' ? '/' : normalized;
}

/** Map the same logical page to every locale's URL path. */
export function alternatePaths(pathname: string): Record<Lang, string> {
  const stripped = stripLocalePrefix(pathname);
  const suffix = stripped === '/' ? '/' : stripped.endsWith('/') ? stripped : `${stripped}/`;
  const out = {} as Record<Lang, string>;
  for (const code of LOCALE_CODES) {
    out[code] = localePath(code, suffix);
  }
  return out;
}
