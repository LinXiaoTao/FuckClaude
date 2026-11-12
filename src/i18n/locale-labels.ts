import { LOCALE_CODES, LOCALES, type Lang } from './locales';

/** Native locale names for switchers and banners (from registry). */
export const LOCALE_LABELS = Object.fromEntries(
  LOCALE_CODES.map((code) => [code, LOCALES[code].label]),
) as Record<Lang, string>;
