import type { Lang } from './locales';
import type { UiKey } from './ui';

export type Dictionary = Record<string, string>;
export type MessageOverlay = Partial<Record<UiKey, string>>;
const dictionaries: Partial<Record<Lang, Dictionary>> = {};
const overlays: Partial<Record<Lang, MessageOverlay>> = {};
/**
 * Per-locale translation data. The server fills it from every locale at import time
 * (`locale-data-server.ts`); the browser fills only the page's locale (`locale-data-client.ts`).
 */
export function registerDictionary(lang: Lang, chunk: Dictionary): void {
  dictionaries[lang] = { ...dictionaries[lang], ...chunk };
}

export function registerOverlay(lang: Lang, chunk: MessageOverlay): void {
  overlays[lang] = { ...overlays[lang], ...chunk };
}

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? {};
}

export function getOverlay(lang: Lang): MessageOverlay {
  return overlays[lang] ?? {};
}