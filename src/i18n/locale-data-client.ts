import { registerDictionary, registerOverlay, type Dictionary, type MessageOverlay } from './locale-data';
import type { Lang } from './locales';

const dictionaryLoaders = import.meta.glob<{ default: Dictionary }>('./translations/*/*.ts');
const messageLoaders = import.meta.glob<{ default: MessageOverlay }>('./messages/*.ts');

/** Load only the translation data the current page needs, so other locales never ship to the browser. */
export async function loadLocaleData(lang: Lang): Promise<void> {
  const pending: Promise<void>[] = [];

  for (const [filePath, load] of Object.entries(dictionaryLoaders)) {
    if (!filePath.includes(`/translations/${lang}/`)) continue;
    pending.push(load().then((mod) => registerDictionary(lang, mod.default ?? {})));
  }
  for (const [filePath, load] of Object.entries(messageLoaders)) {
    if (!filePath.endsWith(`/messages/${lang}.ts`)) continue;
    pending.push(load().then((mod) => registerOverlay(lang, mod.default ?? {})));
  }

  await Promise.all(pending);
}
