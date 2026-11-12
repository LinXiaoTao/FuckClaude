import './locale-data-server';
import { getDictionary } from './locale-data';
import type { Lang } from './locales';
import type { ContentSource, Localized, LocalizedResolution } from './types';

function dictionaryLookup(lang: Lang, englishSource: string): string | undefined {
  return getDictionary(lang)[englishSource];
}

/**
 * Resolve a bilingual config string for any locale.
 * Order: native field → translation dict → English.
 */
export function localize(record: Localized, lang: Lang): string {
  return localizeDetailed(record, lang).text;
}

export function localizeDetailed(record: Localized, lang: Lang): LocalizedResolution {
  if (lang === 'en') {
    return { text: record.en, source: 'native' };
  }
  if (lang === 'zh') {
    return { text: record.zh, source: 'native' };
  }

  const translated = dictionaryLookup(lang, record.en);
  if (translated) {
    return { text: translated, source: 'fallback' };
  }

  return { text: record.en, source: 'fallback' };
}

export function translationNoticeApplies(lang: Lang, source: ContentSource): boolean {
  if (lang === 'en' || lang === 'zh') return false;
  return source !== 'native';
}
