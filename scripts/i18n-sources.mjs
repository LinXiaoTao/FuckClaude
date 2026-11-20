import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function loadTsModule(relativePath) {
  return import(pathToFileURL(path.join(projectRoot, relativePath)).href);
}

const CONFIG_FILES = [
  'src/config/guides.ts',
  'src/config/news.ts',
  'src/config/community-posts.ts',
  'src/config/official-rules.ts',
  'src/config/signals.ts',
  'src/config/sponsors.ts',
  'src/config/site.ts',
  'src/i18n/api-messages.ts',
  'src/server/ip-purity.ts',
];

/** Every trust module except the resolver holds `{ en, zh }` page text, so a new section file needs no registration. */
const TRUST_DIR = 'src/content/trust';
const TRUST_NON_SOURCES = new Set(['resolve.ts']);

function trustFiles() {
  return readdirSync(path.join(projectRoot, TRUST_DIR))
    .filter((name) => name.endsWith('.ts') && !TRUST_NON_SOURCES.has(name))
    .sort()
    .map((name) => `${TRUST_DIR}/${name}`);
}

function englishOf(node) {
  if (typeof node.en === 'string' && typeof node.zh === 'string') return node.en;
  if (typeof node.textEn === 'string' && typeof node.textZh === 'string') return node.textEn;
  return null;
}

/** Every English source string the dictionary can translate, in stable order. */
export async function collectEnglishSources() {
  const sources = new Set();
  const visited = new WeakSet();

  function walk(node) {
    if (!node || typeof node !== 'object' || visited.has(node)) return;
    visited.add(node);
    const english = englishOf(node);
    if (english !== null) {
      sources.add(english);
      return;
    }
    for (const value of Array.isArray(node) ? node : Object.values(node)) walk(value);
  }

  for (const file of [...CONFIG_FILES, ...trustFiles()]) {
    const mod = await loadTsModule(file);
    for (const value of Object.values(mod)) walk(value);
  }
  return sources;
}
