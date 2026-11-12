#!/usr/bin/env node
/**
 * Region profile + scorer regression checks. Run: npm run signals:check
 */
import { loadTsModule } from './i18n-sources.mjs';

const {
  REGIONS,
  assertRegionProfiles,
  regionForLang,
} = await loadTsModule('src/config/regions.ts');

const {
  scoreTimezone,
  scoreTimezoneForRegion,
  scoreLanguages,
  scoreLanguagesForRegion,
  signalsFor,
} = await loadTsModule('src/config/signals.ts');

const REGION_IDS = ['cn', 'ru', 'ir', 'cu', 'sy', 'mm'];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`ok: ${msg}`);
}

assertRegionProfiles();
ok('profile load assertions');

for (const id of REGION_IDS) {
  const w = Object.values(REGIONS[id].weights).reduce((a, b) => a + b, 0);
  if (w !== 100) fail(`${id} weights sum ${w}`);
}

if (scoreTimezone('Asia/Shanghai') !== 1) fail('cn Asia/Shanghai');
if (scoreTimezone('Asia/Taipei') !== 0) fail('cn Asia/Taipei');
if (scoreTimezone('Asia/Hong_Kong') !== 0.6) fail('cn Asia/Hong_Kong');
if (scoreLanguages(['zh-TW', 'zh', 'en']) !== 0) fail('cn zh-TW list');
if (scoreLanguages(['zh-CN']) !== 1) fail('cn zh-CN');

const regionMainTz = {
  ru: 'Europe/Moscow',
  ir: 'Asia/Tehran',
  cu: 'America/Havana',
  sy: 'Asia/Damascus',
  mm: 'Asia/Yangon',
};

const regionMainLang = {
  ru: 'ru-RU',
  ir: 'fa-IR',
  cu: 'es-CU',
  sy: 'ar-SY',
  mm: 'my-MM',
};

for (const id of REGION_IDS) {
  if (id === 'cn') continue;
  const profile = REGIONS[id];
  const tz = regionMainTz[id];
  if (scoreTimezoneForRegion(tz, profile) !== 1) fail(`${id} main tz ${tz}`);
  if (scoreTimezoneForRegion('Asia/Shanghai', profile) !== 0) fail(`${id} Shanghai is 0`);
  const tag = regionMainLang[id];
  if (scoreLanguagesForRegion([tag], id) !== 1) fail(`${id} main lang ${tag}`);
  if (scoreLanguagesForRegion(['en-US'], id) !== 0) fail(`${id} en-US is 0`);
}

const expectedRows = {
  en: 10,
  zh: 10,
  ru: 7,
  fa: 7,
  es: 5,
  ar: 6,
  my: 7,
};

for (const [lang, count] of Object.entries(expectedRows)) {
  const region = regionForLang(lang);
  const n = signalsFor(region).length;
  if (n !== count) fail(`${lang} expects ${count} signals, got ${n}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
console.log('signals:check passed');
