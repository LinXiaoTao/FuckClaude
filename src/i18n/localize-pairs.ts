import { getDictionary } from './locale-data';
import type { Lang } from './locales';
import type { Localized } from './types';

/** Localize `{ en, zh }` in the browser. Needs `loadLocaleData(lang)` to have run. */
export function localizePair(record: Localized, lang: Lang): string {
  if (lang === 'en') return record.en;
  if (lang === 'zh') return record.zh;

  const translated = getDictionary(lang)[record.en];
  if (translated) return translated;

  return record.en;
}
