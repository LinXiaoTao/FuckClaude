import { registerDictionary, registerOverlay, type Dictionary, type MessageOverlay } from './locale-data';
import { isLang } from './locales';

// Vite rewrites each `import.meta.glob(...)` call. Under plain tsx (coverage and validate scripts)
// the call throws, so those scripts load this module with no translation data.
function globOrEmpty<T>(run: () => Record<string, T>): Record<string, T> {
  try {
    return run();
  } catch {
    return {};
  }
}

const dictionaryModules = globOrEmpty(() =>
  import.meta.glob<{ default: Dictionary }>('./translations/*/*.ts', { eager: true }),
);
const messageModules = globOrEmpty(() =>
  import.meta.glob<{ default: MessageOverlay }>('./messages/*.ts', { eager: true }),
);

for (const [filePath, mod] of Object.entries(dictionaryModules)) {
  const code = filePath.match(/\/translations\/([^/]+)\//)?.[1];
  if (code && isLang(code)) registerDictionary(code, mod.default ?? {});
}

for (const [filePath, mod] of Object.entries(messageModules)) {
  const code = filePath.match(/\/messages\/([^/]+)\.ts$/)?.[1];
  if (code && isLang(code)) registerOverlay(code, mod.default ?? {});
}
