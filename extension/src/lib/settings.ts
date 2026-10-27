import { STORAGE_KEY } from '../shared/constants';
import type { SiteEntry } from './sites';

export type UaPreset = 'native' | 'desktop-chrome';

export interface Settings {
  enabled: boolean;
  timezone: boolean;
  timezoneOffset: boolean;
  language: boolean;
  intlLocale: boolean;
  fonts: boolean;
  webrtc: boolean;
  uaPreset: UaPreset;
  timeZoneId: string;
  languageTag: string;
  sites: SiteEntry[];
}

export const DEFAULT_TIME_ZONE = 'America/Los_Angeles';
export const DEFAULT_LANGUAGE = 'en-US';

export function suggestedSites(): SiteEntry[] {
  const sites: SiteEntry[] = [
    { host: 'claude.ai', includeSubdomains: true, suggested: true },
    { host: 'claude.com', includeSubdomains: true, suggested: true },
    { host: 'fuck-claude.vercel.app', includeSubdomains: false, suggested: true },
  ];
  if (__SLC_E2E__) {
    sites.push({ host: 'localhost', includeSubdomains: false, suggested: true });
    sites.push({ host: '127.0.0.1', includeSubdomains: false, suggested: true });
  }
  return sites;
}

export function defaultSettings(): Settings {
  return {
    enabled: false,
    timezone: false,
    timezoneOffset: false,
    language: false,
    intlLocale: false,
    fonts: false,
    webrtc: false,
    uaPreset: 'native',
    timeZoneId: DEFAULT_TIME_ZONE,
    languageTag: DEFAULT_LANGUAGE,
    sites: suggestedSites(),
  };
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeSite(value: unknown): SiteEntry | null {
  if (!value || typeof value !== 'object') return null;
  const site = value as SiteEntry;
  if (typeof site.host !== 'string' || !site.host) return null;
  return {
    host: site.host.toLowerCase(),
    includeSubdomains: Boolean(site.includeSubdomains),
    suggested: Boolean(site.suggested),
  };
}

export function normalizeSettings(value: unknown): Settings {
  const base = defaultSettings();
  if (!value || typeof value !== 'object') return base;
  const raw = value as Partial<Settings>;
  const sites = Array.isArray(raw.sites) ? raw.sites.map(normalizeSite).filter((site): site is SiteEntry => !!site) : base.sites;
  return {
    enabled: asBool(raw.enabled, false),
    timezone: asBool(raw.timezone, false),
    timezoneOffset: asBool(raw.timezoneOffset, false),
    language: asBool(raw.language, false),
    intlLocale: asBool(raw.intlLocale, false),
    fonts: asBool(raw.fonts, false),
    webrtc: asBool(raw.webrtc, false),
    uaPreset: raw.uaPreset === 'desktop-chrome' ? 'desktop-chrome' : 'native',
    timeZoneId: typeof raw.timeZoneId === 'string' && raw.timeZoneId ? raw.timeZoneId : base.timeZoneId,
    languageTag: typeof raw.languageTag === 'string' && raw.languageTag ? raw.languageTag : base.languageTag,
    sites,
  };
}

/** Recommended profile. The desktop Chrome preset is selected only when the real UA hits a domestic rule. */
export function recommendedSettings(current?: Settings, suggestDesktop = false): Settings {
  const sites = mergeSites(current?.sites ?? [], suggestedSites());
  return {
    enabled: true,
    timezone: true,
    timezoneOffset: true,
    language: true,
    intlLocale: true,
    fonts: true,
    webrtc: true,
    uaPreset: suggestDesktop ? 'desktop-chrome' : 'native',
    timeZoneId: DEFAULT_TIME_ZONE,
    languageTag: DEFAULT_LANGUAGE,
    sites,
  };
}

function mergeSites(current: SiteEntry[], suggested: SiteEntry[]): SiteEntry[] {
  const extras = current.filter((site) => !suggested.some((item) => item.host === site.host));
  return [...suggested, ...extras];
}

export async function loadSettings(): Promise<Settings> {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  if (!(STORAGE_KEY in stored)) return defaultSettings();
  return normalizeSettings(stored[STORAGE_KEY]);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
}

export async function ensureDefaults(): Promise<void> {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  if (!(STORAGE_KEY in stored)) await saveSettings(defaultSettings());
}
