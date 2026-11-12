#!/usr/bin/env node
/**
 * Translation coverage report. Runs under tsx (see package.json) so TypeScript sources load.
 * Does not import Vite-only import.meta.glob modules; scans translation paths on disk instead.
 */
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { collectEnglishSources, loadTsModule, projectRoot } from './i18n-sources.mjs';

const localesMod = await loadTsModule('src/i18n/locales.ts');
const uiMod = await loadTsModule('src/i18n/ui.ts');
const guidesDataMod = await loadTsModule('src/content/guidesData.ts');

const { LOCALE_CODES, LOCALES, defaultLang } = localesMod;
const { ui } = uiMod;
const { GUIDE_CONTENT } = guidesDataMod;

const englishSources = await collectEnglishSources();

const uiKeys = Object.keys(ui.en);
const guideSlugs = Object.keys(GUIDE_CONTENT);

const exportLang = process.argv.find((a) => a.startsWith('--export='))?.split('=')[1];

async function loadDictionary(lang) {
  const dir = path.join(projectRoot, 'src/i18n/translations', lang);
  if (!existsSync(dir)) return {};
  const dict = {};
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.ts')) continue;
    const mod = await import(pathToFileURL(path.join(dir, name)).href);
    Object.assign(dict, mod.default ?? {});
  }
  return dict;
}

async function loadMessageOverlay(lang) {
  const file = path.join(projectRoot, 'src/i18n/messages', `${lang}.ts`);
  if (!existsSync(file)) return {};
  const mod = await import(pathToFileURL(file).href);
  return mod.default ?? {};
}

function guideBodySource(slug, lang) {
  const perLocaleFile = path.join(
    projectRoot,
    'src/content/guides-i18n',
    lang,
    `${slug}.ts`,
  );
  if (existsSync(perLocaleFile)) return 'native';
  if (lang === 'en' || lang === 'zh') return 'native';
  return 'fallback';
}

async function reportLocale(lang) {
  const overlay = await loadMessageOverlay(lang);
  const missingUi = uiKeys.filter((key) => {
    if (lang === 'en' || lang === 'zh') return false;
    if (overlay[key]) return false;
    return true;
  });

  const dict = await loadDictionary(lang);
  const missingDict =
    lang === 'en' || lang === 'zh'
      ? []
      : [...englishSources].filter((en) => !dict[en]);
  const missingGuides = guideSlugs.filter((slug) => guideBodySource(slug, lang) === 'fallback');

  console.log(`\n== ${lang} ==`);
  console.log(`UI keys missing overlay: ${missingUi.length}`);
  console.log(`Dictionary missing: ${missingDict.length} (of ${englishSources.size} sources)`);
  if (missingDict.length) {
    console.log(`  examples: ${missingDict.slice(0, 5).join(' | ')}`);
  }
  console.log(`Guide bodies falling back to English: ${missingGuides.length}`);
  if (missingGuides.length) {
    console.log(`  examples: ${missingGuides.slice(0, 5).join(', ')}`);
  }

  if (exportLang === lang) {
    const outPath = `/tmp/i18n-${lang}-missing.json`;
    writeFileSync(
      outPath,
      JSON.stringify(
        {
          lang,
          missingUiKeys: missingUi,
          missingDictionary: missingDict,
          missingGuideBodies: missingGuides,
        },
        null,
        2,
      ),
    );
    console.log(`Wrote ${outPath}`);
  }
}

for (const lang of LOCALE_CODES) {
  if (lang === defaultLang) continue;
  await reportLocale(lang);
}

console.log('\nDone (report only, exit 0).');
