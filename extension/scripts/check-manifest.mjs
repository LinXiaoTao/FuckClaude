import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const mode = process.argv[2];
if (mode !== 'prod' && mode !== 'e2e') {
  console.error('usage: node scripts/check-manifest.mjs prod|e2e');
  process.exit(1);
}

const root = mode === 'e2e' ? '.output-e2e' : '.output';
const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs);
    else if (name === 'manifest.json') hits.push(abs);
  }
}
walk(root);
if (hits.length !== 1) throw new Error(`expected one manifest, found ${hits.join(', ') || 'none'}`);

const manifest = JSON.parse(readFileSync(hits[0], 'utf8'));
const permissions = ['storage', 'scripting', 'declarativeNetRequestWithHostAccess'];
const optional = [
  'https://claude.ai/*',
  'https://*.claude.ai/*',
  'https://claude.com/*',
  'https://*.claude.com/*',
  'https://fuck-claude.vercel.app/*',
  'https://*/*',
];
const icons = {
  16: 'icons/icon-16.png',
  32: 'icons/icon-32.png',
  48: 'icons/icon-48.png',
  128: 'icons/icon-128.png',
};
const bannedPerms = ['tabs', 'webRequest', 'cookies', 'debugger', 'proxy', 'userScripts', '<all_urls>'];

const expectedPermissions = mode === 'e2e' ? [...permissions, 'privacy'] : permissions;
if (JSON.stringify(manifest.permissions) !== JSON.stringify(expectedPermissions)) {
  throw new Error(`permissions ${JSON.stringify(manifest.permissions)}`);
}
if (JSON.stringify(manifest.optional_permissions) !== JSON.stringify(['privacy'])) {
  throw new Error(`optional_permissions ${JSON.stringify(manifest.optional_permissions)}`);
}
if (mode === 'prod' && (manifest.permissions || []).includes('privacy')) {
  throw new Error('prod manifest grants privacy');
}
if (JSON.stringify(manifest.optional_host_permissions) !== JSON.stringify(optional)) {
  throw new Error(`optional_host_permissions ${JSON.stringify(manifest.optional_host_permissions)}`);
}
if (JSON.stringify(manifest.icons) !== JSON.stringify(icons)) throw new Error(`icons ${JSON.stringify(manifest.icons)}`);
if (JSON.stringify(manifest.action?.default_icon) !== JSON.stringify({ 16: icons[16], 32: icons[32], 48: icons[48] })) {
  throw new Error(`default_icon ${JSON.stringify(manifest.action?.default_icon)}`);
}
for (const file of Object.values(icons)) {
  const abs = join(hits[0], '..', file);
  if (!statSync(abs).isFile()) throw new Error(`missing icon ${file}`);
}
if (manifest.default_locale !== 'en') throw new Error('default_locale');
if (manifest.name !== '__MSG_extName__' || manifest.description !== '__MSG_extDesc__') {
  throw new Error('name/description must be message keys');
}
for (const key of bannedPerms) {
  if ((manifest.permissions || []).includes(key)) throw new Error(`forbidden permission ${key}`);
}
const dumped = JSON.stringify(manifest);
if (dumped.includes('<all_urls>')) throw new Error('manifest contains all_urls');

if (mode === 'prod') {
  if ('host_permissions' in manifest) throw new Error('prod manifest has host_permissions');
  if (/localhost|127\.0\.0\.1/i.test(dumped)) throw new Error('prod manifest mentions localhost');
} else {
  if (JSON.stringify(manifest.host_permissions) !== JSON.stringify(['http://localhost/*', 'http://127.0.0.1/*'])) {
    throw new Error(`e2e host_permissions ${JSON.stringify(manifest.host_permissions)}`);
  }
}

const bannedCopy = [/fuck/i, /claude/i, /anthropic/i, /防封/, /绕过/, /风控/];
for (const locale of ['en', 'zh_CN']) {
  const file = join(hits[0], '..', '_locales', locale, 'messages.json');
  const messages = JSON.parse(readFileSync(file, 'utf8'));
  for (const key of ['extName', 'extDesc', 'extAction']) {
    const text = messages[key]?.message || '';
    if (text.length > 132) throw new Error(`${locale} ${key} is ${text.length} chars`);
    for (const pattern of bannedCopy) {
      if (pattern.test(text)) throw new Error(`${locale} ${key} matches ${pattern}`);
    }
  }
}

console.log(`${mode} manifest ok: ${hits[0]}`);
