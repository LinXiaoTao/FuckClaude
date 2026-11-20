#!/usr/bin/env node
/**
 * Who-am-i rule engine + UI key regression checks. Run: npm run whoami:check
 */
import { loadTsModule } from './i18n-sources.mjs';

const {
  READING_DEFS,
  RULES,
  evaluateRules,
  ipInTunBenchmarkRange,
  utcOffsetMinutesForZone,
  primarySubtag,
} = await loadTsModule('src/config/whoami.ts');

const { ui } = await loadTsModule('src/i18n/ui.ts');

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`ok: ${msg}`);
}

function r(id, layer, value) {
  return { id, layer, value, atMs: 0 };
}

function snap(partial) {
  return Object.fromEntries(
    Object.entries(partial).map(([id, value]) => [id, r(id, READING_DEFS[id].layer, value)]),
  );
}

function expectRule(ruleId, snapshot, verdict) {
  const findings = evaluateRules(snapshot);
  const f = findings.find((x) => x.ruleId === ruleId);
  if (!f) {
    fail(`missing finding ${ruleId}`);
    return;
  }
  if (f.verdict !== verdict) fail(`${ruleId} expected ${verdict}, got ${f.verdict}`);
  else ok(`${ruleId} ${verdict}`);
}

// --- rule cases ---
const tzMatch = snap({
  'script.timezone': 'Asia/Tokyo (UTC+9)',
  'request.ipTimezone': 'Asia/Tokyo',
});
expectRule('tz-offset', tzMatch, 'match');

const tzMismatch = snap({
  'script.timezone': 'America/New_York (UTC-5)',
  'request.ipTimezone': 'Asia/Tokyo',
});
expectRule('tz-offset', tzMismatch, 'mismatch');

expectRule('tz-offset', snap({ 'script.timezone': 'Asia/Tokyo (UTC+9)' }), 'unknown');

expectRule(
  'lang-country',
  snap({ 'script.languages': 'ja, en', 'request.country': 'JP' }),
  'match',
);
expectRule(
  'lang-country',
  snap({ 'script.languages': 'en-US', 'request.country': 'JP' }),
  'mismatch',
);
expectRule('lang-country', snap({ 'script.languages': 'en', 'request.country': 'ZZ' }), 'unknown');

expectRule(
  'lang-header-script',
  snap({ 'request.acceptLanguage': 'de-DE,en', 'script.languages': 'de, en' }),
  'match',
);
expectRule(
  'lang-header-script',
  snap({ 'request.acceptLanguage': 'fr-FR', 'script.languages': 'de, en' }),
  'mismatch',
);

expectRule(
  'ua-platform',
  snap({
    'request.userAgent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'request.secChUaPlatform': '"Windows"',
  }),
  'match',
);
expectRule(
  'ua-platform',
  snap({
    'request.userAgent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'script.uaDataPlatform': 'Windows',
  }),
  'mismatch',
);
expectRule('ua-platform', snap({ 'request.userAgent': 'Mozilla/5.0' }), 'unknown');

expectRule(
  'ua-gpu',
  snap({
    'script.userAgent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
    'script.gpu': 'ANGLE (Apple, Apple M1, OpenGL 4.1)',
  }),
  'match',
);
expectRule(
  'ua-gpu',
  snap({
    'script.userAgent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
    'script.gpu': 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1080 Direct3D11)',
  }),
  'mismatch',
);
expectRule('ua-gpu', snap({ 'script.userAgent': 'Mozilla/5.0', 'script.gpu': 'masked' }), 'unknown');

expectRule(
  'webrtc-ip',
  snap({ 'probe.srflxIp': '203.0.113.10', 'request.ip': '203.0.113.10' }),
  'match',
);
expectRule(
  'webrtc-ip',
  snap({ 'probe.srflxIp': '203.0.113.11', 'request.ip': '203.0.113.10' }),
  'mismatch',
);
expectRule(
  'webrtc-ip',
  snap({ 'probe.srflxIp': '2001:db8::1', 'request.ip': '203.0.113.10' }),
  'unknown',
);

expectRule('webrtc-tun', snap({ 'probe.hostIps': '192.168.1.5, 10.0.0.2' }), 'match');
expectRule('webrtc-tun', snap({ 'probe.hostIps': '198.18.0.4' }), 'mismatch');
expectRule('webrtc-tun', snap({ 'probe.hostIps': 'none' }), 'unknown');

expectRule('ip-network-type', snap({ 'network.type': 'Residential', 'network.proxy': 'no' }), 'match');
expectRule(
  'ip-network-type',
  snap({ 'network.type': 'Datacenter', 'network.proxy': 'no' }),
  'mismatch',
);
expectRule(
  'ip-network-type',
  snap({ 'network.type': 'Unknown', 'network.proxy': 'yes' }),
  'mismatch',
);
expectRule('ip-network-type', snap({ 'network.type': 'Unknown' }), 'unknown');

if (!ipInTunBenchmarkRange('198.18.1.1')) fail('tun range positive');
else ok('tun range detects 198.18.1.1');
if (ipInTunBenchmarkRange('8.8.8.8')) fail('tun range negative');
else ok('tun range ignores 8.8.8.8');

const offTokyo = utcOffsetMinutesForZone('Asia/Tokyo');
const offNy = utcOffsetMinutesForZone('America/New_York');
if (offTokyo === null || offNy === null) fail('utc offset helper');
else ok('utc offset helper');

if (primarySubtag('zh-CN') !== 'zh') fail('primarySubtag');
else ok('primarySubtag');

const readingIds = Object.keys(READING_DEFS);
const ruleIds = RULES.map((rule) => rule.id);

for (const id of readingIds) {
  const key = `whoami.reading.${id}`;
  if (ui.en[key] === undefined) fail(`missing ui.en ${key}`);
  if (ui.zh[key] === undefined) fail(`missing ui.zh ${key}`);
}
ok(`ui reading keys (${readingIds.length})`);

for (const id of ruleIds) {
  for (const suffix of ['title', 'match', 'mismatch']) {
    const key = `whoami.rule.${id}.${suffix}`;
    if (ui.en[key] === undefined) fail(`missing ui.en ${key}`);
    if (ui.zh[key] === undefined) fail(`missing ui.zh ${key}`);
  }
}
ok(`ui rule keys (${ruleIds.length})`);

if (process.exitCode) {
  process.exit(process.exitCode);
}