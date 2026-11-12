import type { Lang } from './locales';

/** Config strings authored in English and Simplified Chinese. */
export type Localized = {
  en: string;
  zh: string;
};

export type ContentSource = 'native' | 'fallback';

export type LocalizedResolution = {
  text: string;
  source: ContentSource;
};

/** Keys present on config records before localization to other locales. */
export type LocalizedKey = keyof Localized;

export function isLocalizedValue(value: unknown): value is Localized {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === 'string' && typeof record.zh === 'string';
}

export function isNativeLocale(lang: Lang): boolean {
  return lang === 'en' || lang === 'zh';
}
