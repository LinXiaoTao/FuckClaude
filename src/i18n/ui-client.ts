/**
 * Client-side UI strings. Call `loadLocaleData(lang)` first; until then non-English locales fall back to English.
 */
import { getDictionary, getOverlay } from './locale-data';
import { defaultLang, isLang, type Lang } from './locales';
import { ui, type UiKey } from './ui';

function lookupKey(lang: Lang, key: UiKey): string | undefined {
  const overlay = getOverlay(lang)[key];
  if (overlay) return overlay;

  if (lang === 'en') return ui.en[key];
  if (lang === 'zh') return ui.zh[key];

  const enVal = ui.en[key];
  const fromDict = enVal ? getDictionary(lang)[enVal] : undefined;
  if (fromDict) return fromDict;

  return enVal;
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const resolved = lookupKey(lang, key as UiKey);
    if (resolved) return resolved;
    const fallback =
      (ui[defaultLang] as Record<string, string>)[key] ??
      (ui.en as Record<string, string>)[key];
    return fallback ?? key;
  };
}

export function langFromDocument(): Lang {
  const raw = document.documentElement.getAttribute('data-lang') ?? 'en';
  return isLang(raw) ? raw : defaultLang;
}
