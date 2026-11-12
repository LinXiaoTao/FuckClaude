#!/usr/bin/env node
/**
 * Structural checks for translation files of one locale: `tsx scripts/i18n-validate.mjs <lang>`.
 * Verifies that translators kept code, placeholders, URLs and HTML structure intact.
 * Exits 1 when any error is found. It cannot judge translation quality.
 */
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { collectEnglishSources, loadTsModule, projectRoot } from './i18n-sources.mjs';

const lang = process.argv[2];
const { LOCALES } = await loadTsModule('src/i18n/locales.ts');
if (!lang || !LOCALES[lang] || lang === 'en' || lang === 'zh') {
  console.error('usage: tsx scripts/i18n-validate.mjs <ru|fa|es|ar|my>');
  process.exit(2);
}

const { ui } = await loadTsModule('src/i18n/ui.ts');
const { GUIDE_CONTENT } = await loadTsModule('src/content/guidesData.ts');
const sources = await collectEnglishSources();
const latinScript = lang === 'es';

const errors = [];
const warnings = [];
let checked = 0;

const multiset = (items) => [...items].sort().join('\u0000');
const spans = (text) => multiset(text.match(/`[^`]*`/g) ?? []);
const placeholders = (text) => multiset(text.match(/\{[A-Za-z0-9_]+\}/g) ?? []);
const urls = (text) => multiset(text.match(/https?:\/\/[^\s"'<>)`]+/g) ?? []);
const tagNames = (text) => multiset((text.match(/<\/?[a-zA-Z][a-zA-Z0-9]*/g) ?? []).map((t) => t.toLowerCase()));

function untranslatedRatio(text) {
  const visible = text.replace(/<[^>]*>/g, ' ').replace(/`[^`]*`/g, ' ').replace(/https?:\/\/\S+/g, ' ');
  const letters = visible.match(/\p{L}/gu) ?? [];
  if (letters.length < 40) return 0;
  const latin = letters.filter((c) => /\p{Script=Latin}/u.test(c)).length;
  return latin / letters.length;
}

function compareText(label, en, tr, { html = false } = {}) {
  checked += 1;
  if (typeof tr !== 'string' || !tr.trim()) return errors.push(`${label}: empty translation`);
  if (spans(en) !== spans(tr)) errors.push(`${label}: backtick code spans differ`);
  if (placeholders(en) !== placeholders(tr)) errors.push(`${label}: {placeholders} differ`);
  if (urls(en) !== urls(tr)) errors.push(`${label}: URLs differ`);
  if (html && tagNames(en) !== tagNames(tr)) errors.push(`${label}: HTML tags differ`);
  if (!latinScript && en.length > 60 && untranslatedRatio(tr) > 0.5) {
    warnings.push(`${label}: looks mostly untranslated (Latin letters > 50%)`);
  }
}

async function loadDefault(file) {
  return (await import(pathToFileURL(file).href)).default ?? {};
}

const messagesFile = path.join(projectRoot, 'src/i18n/messages', `${lang}.ts`);
if (existsSync(messagesFile)) {
  const overlay = await loadDefault(messagesFile);
  for (const [key, value] of Object.entries(overlay)) {
    if (!(key in ui.en)) errors.push(`messages/${lang}.ts: unknown UI key "${key}"`);
    else compareText(`ui[${key}]`, ui.en[key], value);
  }
}

const dictDir = path.join(projectRoot, 'src/i18n/translations', lang);
if (existsSync(dictDir)) {
  for (const name of readdirSync(dictDir).filter((n) => n.endsWith('.ts'))) {
    const dict = await loadDefault(path.join(dictDir, name));
    for (const [en, tr] of Object.entries(dict)) {
      const label = `translations/${lang}/${name}["${en.slice(0, 48)}"]`;
      if (!sources.has(en)) errors.push(`${label}: key is not a current English source string`);
      else compareText(label, en, tr);
    }
  }
}

const guideDir = path.join(projectRoot, 'src/content/guides-i18n', lang);
if (existsSync(guideDir)) {
  for (const name of readdirSync(guideDir).filter((n) => n.endsWith('.ts'))) {
    const slug = name.replace(/\.ts$/, '');
    const label = `guides-i18n/${lang}/${name}`;
    const authored = GUIDE_CONTENT[slug];
    if (!authored) {
      errors.push(`${label}: unknown guide slug`);
      continue;
    }
    const mod = await import(pathToFileURL(path.join(guideDir, name)).href);
    const html = mod.content;
    if (typeof html !== 'string') {
      errors.push(`${label}: missing "export const content"`);
      continue;
    }
    compareText(label, authored.en, html, { html: true });
    const attrs = (text, attr) => multiset([...text.matchAll(new RegExp(`\\s${attr}="([^"]*)"`, 'g'))].map((m) => m[1]));
    for (const attr of ['id', 'class', 'target', 'rel']) {
      if (attrs(authored.en, attr) !== attrs(html, attr)) errors.push(`${label}: ${attr} attributes differ`);
    }
    const hrefs = (text) =>
      multiset(
        [...text.matchAll(/\shref="([^"]*)"/g)].map((m) => m[1].replace(/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?(?=guides|news|extension|ip)/, '/')),
      );
    if (hrefs(authored.en) !== hrefs(html)) errors.push(`${label}: href values differ`);
    const codeSpans = (text) => multiset([...text.matchAll(/<code[^>]*>([\s\S]*?)<\/code>/g)].map((m) => m[1]));
    if (codeSpans(authored.en) !== codeSpans(html)) errors.push(`${label}: <code> contents differ`);
  }
}

console.log(`[${lang}] checked ${checked} items, ${errors.length} errors, ${warnings.length} warnings`);
for (const line of errors.slice(0, 60)) console.log(`ERROR ${line}`);
for (const line of warnings.slice(0, 20)) console.log(`WARN  ${line}`);
process.exit(errors.length ? 1 : 0);
