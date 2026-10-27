import { LANGUAGES, TIME_ZONES } from '../../src/generated/catalog';
import { formatUtcOffsetLabel, getOffsetMinutes } from '../../src/patch/time';
import { readWebrtcPolicy, setWebrtcPolicy, clearWebrtcPolicy } from '../../src/lib/webrtc-policy';
import type { RealEnv } from '../../src/lib/real-env';
import {
  normalizeSettings,
  recommendedSettings,
  saveSettings,
  loadSettings,
  type Settings,
} from '../../src/lib/settings';
import { originPatterns, parseSiteInput, requestablePatterns, urlMatchesSite, type SiteEntry } from '../../src/lib/sites';
import { buildUaProfile } from '../../src/lib/ua-profile.js';
import './style.css';

let current: Settings = {
  enabled: false,
  timezone: false,
  timezoneOffset: false,
  language: false,
  intlLocale: false,
  fonts: false,
  webrtc: false,
  uaPreset: 'native',
  timeZoneId: 'America/Los_Angeles',
  languageTag: 'en-US',
  sites: [],
};

let env: RealEnv | null = null;

function t(key: string, subs?: string[]): string {
  const value = subs ? chrome.i18n.getMessage(key, subs) : chrome.i18n.getMessage(key);
  return value || key;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function requestOrigins(sites: SiteEntry[]): void {
  const origins = requestablePatterns(sites, __SLC_E2E__);
  if (!origins.length) {
    document.body.dataset.perm = 'skipped';
    return;
  }
  try {
    const pending = chrome.permissions.request({ origins });
    void pending.then(
      (ok) => {
        document.body.dataset.perm = ok ? 'granted' : 'denied';
        const note = document.querySelector('[data-field="perm"]');
        if (note) note.textContent = ok ? t('permOk') : t('permPartial');
      },
      () => {
        document.body.dataset.perm = 'error';
        const note = document.querySelector('[data-field="perm"]');
        if (note) note.textContent = t('permPartial');
      },
    );
  } catch {
    document.body.dataset.perm = 'error';
  }
}

function dropOrigins(sites: SiteEntry[]): void {
  removePatterns(requestablePatterns(sites, __SLC_E2E__));
}

function removePatterns(patterns: string[]): void {
  const origins = patterns.filter((pattern) => {
    if (pattern === 'https://*/*' || pattern === 'http://*/*' || pattern === '<all_urls>') return false;
    if (__SLC_E2E__ && /^http:\/\/(\*\.)?(localhost|127\.0\.0\.1)\//.test(pattern)) return false;
    return true;
  });
  if (!origins.length) return;
  try {
    void chrome.permissions.remove({ origins }).catch(() => {});
  } catch {
    /* required host permissions cannot be removed */
  }
}

async function persist(next: Settings): Promise<void> {
  document.body.dataset.applied = '0';
  current = next;
  sync();
  try {
    await saveSettings(next);
    document.body.dataset.applied = '1';
  } catch (err) {
    document.body.dataset.applied = 'error';
    console.error('slc', err);
  }
}

async function loadEnv(): Promise<RealEnv | null> {
  try {
    const value = (await chrome.runtime.sendMessage({ type: 'slc-real-env' })) as RealEnv | { error?: string };
    if (value && typeof value === 'object' && 'ua' in value && value.ua) return value;
  } catch (err) {
    console.error('slc', err);
  }
  return null;
}

function effectiveIdentity(): { ua: string; platform: string } {
  if (current.uaPreset === 'desktop-chrome' && env?.os && env.major != null) {
    try {
      const profile = buildUaProfile(env.os, env.major);
      return { ua: profile.userAgent, platform: `${profile.navPlatform} / ${profile.uaPlatform}` };
    } catch (err) {
      console.error('slc', err);
    }
  }
  const platform = env?.navPlatform || navigator.platform;
  const uaPlatform = env?.platform ? ` / ${env.platform}` : '';
  return { ua: env?.ua || navigator.userAgent, platform: `${platform}${uaPlatform}` };
}

function zoneLabel(id: string): string {
  try {
    const offset = getOffsetMinutes(Date.now(), id, { Date, DateTimeFormat: Intl.DateTimeFormat });
    const note = offset === -480 ? t('utc8Yes') : t('utc8No');
    return t('tzMeta', [id, formatUtcOffsetLabel(offset), note]);
  } catch {
    return id;
  }
}

function warningText(): string {
  const parts: string[] = [];
  if (current.timezone !== current.timezoneOffset) parts.push(t('mismatchTz'));
  if (current.language !== current.intlLocale) parts.push(t('mismatchLocale'));
  return parts.join('\n');
}

async function fillStatus(): Promise<void> {
  const node = document.querySelector('[data-field="status"]');
  if (!node) return;
  if (!current.enabled) {
    node.textContent = `${t('statusPrefix')}${t('statusOff')}`;
    return;
  }
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab?.url || '';
    if (!url || !urlMatchesSite(url, current.sites)) {
      node.textContent = `${t('statusPrefix')}${t('statusUnauth')}`;
      return;
    }
    const host = new URL(url).hostname.toLowerCase();
    const site = current.sites.find((item) => item.host === host || (item.includeSubdomains && host.endsWith(`.${item.host}`)));
    const pattern = site ? originPatterns(site)[0] : '';
    const ok = pattern ? await chrome.permissions.contains({ origins: [pattern] }) : false;
    node.textContent = `${t('statusPrefix')}${ok ? t('statusOn') : t('statusUnauth')}`;
  } catch {
    node.textContent = `${t('statusPrefix')}${t('statusUnauth')}`;
  }
}

function renderSites(): void {
  const list = document.querySelector('[data-field="site-list"]');
  if (!list) return;
  list.replaceChildren();
  for (const site of current.sites) {
    const row = el('div', 'site');
    row.dataset.host = site.host;
    const name = el('span', undefined, site.host);
    row.append(name);
    const sub = el('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = site.includeSubdomains;
    box.addEventListener('change', () => {
      const nextSites = current.sites.map((item) =>
        item.host === site.host ? { ...item, includeSubdomains: box.checked } : item,
      );
      const updated = nextSites.find((item) => item.host === site.host);
      if (box.checked && updated) requestOrigins([updated]);
      if (!box.checked) {
        const wildcards = originPatterns({ host: site.host, includeSubdomains: true }).filter((pattern) => pattern.includes('://*.'));
        removePatterns(wildcards);
      }
      void persist({ ...current, sites: nextSites });
    });
    sub.append(box, document.createTextNode(t('includeSub')));
    row.append(sub);
    if (site.host === 'fuck-claude.vercel.app') row.append(el('span', 'tag', t('selfTest')));
    else if (site.suggested) row.append(el('span', 'tag', t('suggested')));
    const remove = el('button', undefined, t('remove'));
    remove.type = 'button';
    remove.dataset.action = 'remove-site';
    remove.addEventListener('click', () => {
      dropOrigins([site]);
      void persist({ ...current, sites: current.sites.filter((item) => item.host !== site.host) });
    });
    row.append(remove);
    list.append(row);
  }
}

function sync(): void {
  const master = document.querySelector<HTMLInputElement>('[data-field="master"]');
  const timezone = document.querySelector<HTMLInputElement>('[data-field="timezone"]');
  const offset = document.querySelector<HTMLInputElement>('[data-field="timezone-offset"]');
  const language = document.querySelector<HTMLInputElement>('[data-field="language"]');
  const intl = document.querySelector<HTMLInputElement>('[data-field="intl"]');
  const fonts = document.querySelector<HTMLInputElement>('[data-field="fonts"]');
  const webrtc = document.querySelector<HTMLInputElement>('[data-field="webrtc"]');
  const tz = document.querySelector<HTMLSelectElement>('[data-field="tz"]');
  const lang = document.querySelector<HTMLSelectElement>('[data-field="lang"]');
  const ua = document.querySelector<HTMLSelectElement>('[data-field="ua"]');
  const warning = document.querySelector('[data-field="warning"]');
  if (master) master.checked = current.enabled;
  if (timezone) timezone.checked = current.timezone;
  if (offset) offset.checked = current.timezoneOffset;
  if (language) language.checked = current.language;
  if (intl) intl.checked = current.intlLocale;
  if (fonts) fonts.checked = current.fonts;
  if (webrtc) webrtc.checked = current.webrtc;
  if (tz) tz.value = current.timeZoneId;
  if (lang) lang.value = current.languageTag;
  if (ua) ua.value = current.uaPreset;
  const identity = effectiveIdentity();
  const uaLine = document.querySelector('[data-field="ua-preview"]');
  const platformLine = document.querySelector('[data-field="ua-platform"]');
  const browserLine = document.querySelector('[data-field="cn-browser"]');
  const deviceLine = document.querySelector('[data-field="cn-device"]');
  const suggestLine = document.querySelector('[data-field="ua-suggest"]');
  if (uaLine) uaLine.textContent = t('uaActive', [identity.ua]);
  if (platformLine) platformLine.textContent = t('uaPlatformLine', [identity.platform]);
  if (browserLine) {
    browserLine.textContent = env?.cnBrowserName ? t('cnBrowserHit', [env.cnBrowserName]) : t('cnBrowserClear');
  }
  if (deviceLine) {
    deviceLine.textContent = env?.cnDeviceName ? t('cnDeviceHit', [env.cnDeviceName]) : t('cnDeviceClear');
  }
  if (suggestLine) suggestLine.textContent = env?.suggestDesktop ? t('uaSuggestOn') : t('uaSuggestOff');
  document.body.dataset.uaPreset = current.uaPreset;
  document.body.dataset.suggestDesktop = env?.suggestDesktop ? '1' : '0';
  if (warning) {
    warning.textContent = warningText();
    warning.toggleAttribute('hidden', warning.textContent.length === 0);
  }
  renderSites();
  void fillStatus();
}

function checkbox(field: string, label: string, onChange: (checked: boolean) => void): HTMLLabelElement {
  const row = el('label', 'row');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.dataset.field = field;
  input.addEventListener('change', () => onChange(input.checked));
  row.append(input, document.createTextNode(label));
  return row;
}

function build(): void {
  const app = document.querySelector('#app');
  if (!app) return;
  app.replaceChildren();
  document.documentElement.lang = chrome.i18n.getUILanguage() || 'en';
  document.title = t('extName');

  app.append(el('h1', undefined, t('extName')));

  const switches = el('section');
  switches.append(
    checkbox('master', t('master'), (checked) => {
      if (checked) requestOrigins(current.sites);
      void persist({ ...current, enabled: checked });
    }),
    checkbox('timezone', t('sigTimezone'), (checked) => {
      void persist({ ...current, timezone: checked });
    }),
    checkbox('timezone-offset', t('sigOffset'), (checked) => {
      void persist({ ...current, timezoneOffset: checked });
    }),
    checkbox('language', t('sigLanguage'), (checked) => {
      void persist({ ...current, language: checked });
    }),
    checkbox('intl', t('sigIntl'), (checked) => {
      void persist({ ...current, intlLocale: checked });
    }),
    checkbox('fonts', t('sigFonts'), (checked) => {
      void persist({ ...current, fonts: checked });
    }),
    checkbox('webrtc', t('sigWebrtc'), (checked) => {
      void persist({ ...current, webrtc: checked });
    }),
  );
  const warning = el('p', 'warning');
  warning.dataset.field = 'warning';
  warning.setAttribute('role', 'status');
  switches.append(warning);
  app.append(switches);

  const picks = el('section');
  const tzLabel = el('label', 'field', t('tzLabel'));
  const tz = document.createElement('select');
  tz.dataset.field = 'tz';
  for (const zone of TIME_ZONES) {
    const option = document.createElement('option');
    option.value = zone.id;
    option.textContent = zoneLabel(zone.id);
    tz.append(option);
  }
  tz.addEventListener('change', () => {
    void persist({ ...current, timeZoneId: tz.value });
  });
  tzLabel.append(tz);

  const langLabel = el('label', 'field', t('langLabel'));
  const lang = document.createElement('select');
  lang.dataset.field = 'lang';
  for (const item of LANGUAGES) {
    const option = document.createElement('option');
    option.value = item.tag;
    option.textContent = item.tag;
    lang.append(option);
  }
  lang.addEventListener('change', () => {
    void persist({ ...current, languageTag: lang.value });
  });
  langLabel.append(lang);

  const uaLabel = el('label', 'field', t('uaLabel'));
  const ua = document.createElement('select');
  ua.dataset.field = 'ua';
  for (const [value, label] of [
    ['native', t('uaNative')],
    ['desktop-chrome', t('uaDesktop')],
  ] as const) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    ua.append(option);
  }
  ua.addEventListener('change', () => {
    void persist({ ...current, uaPreset: ua.value === 'desktop-chrome' ? 'desktop-chrome' : 'native' });
  });
  uaLabel.append(ua);
  const uaLine = el('p', 'mono');
  uaLine.dataset.field = 'ua-preview';
  const platformLine = el('p', 'mono');
  platformLine.dataset.field = 'ua-platform';
  const browserLine = el('p', 'hint');
  browserLine.dataset.field = 'cn-browser';
  const deviceLine = el('p', 'hint');
  deviceLine.dataset.field = 'cn-device';
  const suggestLine = el('p', 'hint');
  suggestLine.dataset.field = 'ua-suggest';
  picks.append(tzLabel, langLabel, uaLabel, uaLine, platformLine, browserLine, deviceLine, suggestLine, el('p', 'hint', t('fontHint')), el('p', 'hint', t('webrtcHint')), el('p', 'hint', t('emojiHint')));
  app.append(picks);

  const actions = el('section');
  const row = el('div', 'actions');
  const apply = el('button', 'primary', t('apply'));
  apply.type = 'button';
  apply.dataset.action = 'apply-recommended';
  apply.addEventListener('click', () => {
    const next = recommendedSettings(current, env?.suggestDesktop === true);
    requestOrigins(next.sites);
    void persist(next);
  });
  const enable = el('button', undefined, t('enable'));
  enable.type = 'button';
  enable.dataset.action = 'enable';
  enable.addEventListener('click', () => {
    requestOrigins(current.sites);
    void persist({ ...current, enabled: true });
  });
  const restore = el('button', undefined, t('restore'));
  restore.type = 'button';
  restore.dataset.action = 'restore';
  restore.addEventListener('click', () => {
    void persist({ ...current, enabled: false });
  });
  row.append(apply, enable, restore);
  const status = el('p', 'status');
  status.dataset.field = 'status';
  const refresh = el('p', 'hint', t('refreshHint'));
  refresh.dataset.field = 'refresh';
  const unchanged = el('p', 'hint', t('unchanged'));
  unchanged.dataset.field = 'unchanged';
  const perm = el('p', 'perm');
  perm.dataset.field = 'perm';
  actions.append(row, status, refresh, unchanged, perm);
  app.append(actions);

  const policy = el('section');
  policy.append(el('p', 'sites-title', t('policyTitle')));
  policy.append(el('p', 'hint', t('policyBody')));
  const policyNow = el('p', 'status');
  policyNow.dataset.field = 'webrtc-state';
  const policyError = el('p', 'error');
  policyError.dataset.field = 'webrtc-error';
  const confirmBox = el('div', 'confirm');
  confirmBox.dataset.field = 'webrtc-confirm';
  confirmBox.hidden = true;
  confirmBox.append(el('p', 'hint', t('policyNeedConfirm')));
  const confirm = el('button', 'primary', t('policyConfirm'));
  confirm.type = 'button';
  confirm.dataset.action = 'confirm-webrtc-policy';
  confirm.addEventListener('click', () => {
    void (async () => {
      policyError.textContent = '';
      let granted = false;
      try {
        granted = await chrome.permissions.contains({ permissions: ['privacy'] });
        if (!granted) granted = await chrome.permissions.request({ permissions: ['privacy'] });
      } catch {
        granted = false;
      }
      if (!granted) {
        policyError.textContent = t('policyDenied');
        document.body.dataset.webrtcPolicy = 'denied';
        return;
      }
      const result = await setWebrtcPolicy();
      document.body.dataset.webrtcPolicy = result.value || 'error';
      if (!result.ok && result.error === 'not-controllable') policyError.textContent = t('policyBlocked');
      else if (!result.ok) policyError.textContent = t('policyDenied');
      policyNow.textContent = t('policyNow', [result.value || t('policyNone')]);
    })();
  });
  confirmBox.append(confirm);
  const policyRow = el('div', 'actions');
  const openPolicy = el('button', undefined, t('policyOpen'));
  openPolicy.type = 'button';
  openPolicy.dataset.action = 'webrtc-policy';
  openPolicy.addEventListener('click', () => {
    confirmBox.hidden = false;
    policyError.textContent = '';
  });
  const revoke = el('button', undefined, t('policyRevoke'));
  revoke.type = 'button';
  revoke.dataset.action = 'revoke-webrtc-policy';
  revoke.addEventListener('click', () => {
    void (async () => {
      policyError.textContent = '';
      const result = await clearWebrtcPolicy();
      document.body.dataset.webrtcPolicy = result.value || 'default';
      policyNow.textContent = t('policyNow', [result.value || t('policyNone')]);
      confirmBox.hidden = true;
    })();
  });
  policyRow.append(openPolicy, revoke);
  policy.append(policyRow, confirmBox, policyNow, policyError);
  app.append(policy);

  const sites = el('section');
  sites.append(el('p', 'sites-title', t('sites')));
  const addRow = el('div', 'add');
  const input = document.createElement('input');
  input.type = 'text';
  input.dataset.field = 'site-input';
  input.placeholder = t('addPlaceholder');
  input.spellcheck = false;
  const add = el('button', undefined, t('add'));
  add.type = 'button';
  add.dataset.action = 'add-site';
  const error = el('p', 'error');
  error.dataset.field = 'form-error';
  const submit = () => {
    const parsed = parseSiteInput(input.value);
    if (!parsed.ok) {
      error.textContent = t('invalidSite');
      return;
    }
    if (current.sites.some((site) => site.host === parsed.host)) {
      error.textContent = '';
      input.value = '';
      return;
    }
    const site: SiteEntry = { host: parsed.host, includeSubdomains: false };
    error.textContent = '';
    input.value = '';
    requestOrigins([site]);
    void persist({ ...current, sites: [...current.sites, site] });
  };
  add.addEventListener('click', submit);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  });
  addRow.append(input, add);
  const list = el('div');
  list.dataset.field = 'site-list';
  sites.append(addRow, error, list);
  app.append(sites);
}

async function showPolicy(): Promise<void> {
  const node = document.querySelector('[data-field="webrtc-state"]');
  if (!node) return;
  try {
    const has = await chrome.permissions.contains({ permissions: ['privacy'] });
    if (!has) {
      node.textContent = t('policyNow', [t('policyNone')]);
      return;
    }
    const got = await readWebrtcPolicy();
    node.textContent = t('policyNow', [got.value || t('policyNone')]);
    if (got.value) document.body.dataset.webrtcPolicy = got.value;
  } catch {
    node.textContent = t('policyNow', [t('policyNone')]);
  }
}

async function main(): Promise<void> {
  current = await loadSettings();
  env = await loadEnv();
  build();
  sync();
  await showPolicy();
  document.body.dataset.ready = '1';
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes['slc-settings']) return;
    current = normalizeSettings(changes['slc-settings'].newValue);
    sync();
  });
}

void main();
