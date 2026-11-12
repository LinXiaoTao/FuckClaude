import type { Lang } from '../i18n/locales';
import {
  CN_TIMEZONES,
  GREATER_CN_TIMEZONES,
  CN_BROWSER_PATTERNS,
  CN_DEVICE_PATTERNS,
  FONTS_SC,
  FONTS_CN_VENDOR,
} from './signals-cn-assets';

export type SignalId =
  | 'timezone'
  | 'timezoneOffset'
  | 'language'
  | 'intlLocale'
  | 'fonts'
  | 'vendorFonts'
  | 'cnBrowser'
  | 'deviceVendor'
  | 'webrtcLeak'
  | 'emoji';

export type RegionId = 'cn' | 'ru' | 'ir' | 'cu' | 'sy' | 'mm';

export interface LangScore {
  tag: string;
  score: number;
}

export interface RegionProfile {
  id: RegionId;
  timezones: string[];
  partialTimezones: string[];
  offsetEastMinutes: number | null;
  languages: LangScore[];
  fontProbe: string;
  fonts: string[];
  vendorFonts: string[];
  browsers: Array<[RegExp, string]>;
  devices: Array<[RegExp, string, number]>;
  weights: Record<SignalId, number>;
}

const WEIGHTS_CN: Record<SignalId, number> = {
  timezone: 24,
  language: 18,
  fonts: 14,
  vendorFonts: 10,
  webrtcLeak: 10,
  cnBrowser: 8,
  deviceVendor: 6,
  intlLocale: 4,
  timezoneOffset: 3,
  emoji: 3,
};

const WEIGHTS_RU: Record<SignalId, number> = {
  timezone: 34,
  language: 22,
  fonts: 0,
  vendorFonts: 12,
  webrtcLeak: 10,
  cnBrowser: 10,
  deviceVendor: 0,
  intlLocale: 8,
  timezoneOffset: 0,
  emoji: 4,
};

const WEIGHTS_IR: Record<SignalId, number> = {
  timezone: 34,
  language: 24,
  fonts: 20,
  vendorFonts: 0,
  webrtcLeak: 10,
  cnBrowser: 0,
  deviceVendor: 0,
  intlLocale: 5,
  timezoneOffset: 4,
  emoji: 3,
};

const WEIGHTS_CU: Record<SignalId, number> = {
  timezone: 50,
  language: 25,
  fonts: 0,
  vendorFonts: 0,
  webrtcLeak: 15,
  cnBrowser: 0,
  deviceVendor: 0,
  intlLocale: 7,
  timezoneOffset: 0,
  emoji: 3,
};

const WEIGHTS_SY: Record<SignalId, number> = {
  timezone: 45,
  language: 25,
  fonts: 0,
  vendorFonts: 0,
  webrtcLeak: 15,
  cnBrowser: 0,
  deviceVendor: 0,
  intlLocale: 7,
  timezoneOffset: 5,
  emoji: 3,
};

const WEIGHTS_MM: Record<SignalId, number> = {
  timezone: 32,
  language: 22,
  fonts: 22,
  vendorFonts: 0,
  webrtcLeak: 10,
  cnBrowser: 0,
  deviceVendor: 0,
  intlLocale: 6,
  timezoneOffset: 5,
  emoji: 3,
};

export const REGIONS: Record<RegionId, RegionProfile> = {
  cn: {
    id: 'cn',
    timezones: CN_TIMEZONES,
    partialTimezones: GREATER_CN_TIMEZONES,
    offsetEastMinutes: 480,
    languages: [],
    fontProbe: '中文字体检测ABCabc012',
    fonts: FONTS_SC,
    vendorFonts: FONTS_CN_VENDOR,
    browsers: CN_BROWSER_PATTERNS,
    devices: CN_DEVICE_PATTERNS,
    weights: WEIGHTS_CN,
  },
  ru: {
    id: 'ru',
    timezones: [
      'Europe/Kaliningrad',
      'Europe/Moscow',
      'Europe/Simferopol',
      'Europe/Kirov',
      'Europe/Volgograd',
      'Europe/Astrakhan',
      'Europe/Saratov',
      'Europe/Ulyanovsk',
      'Europe/Samara',
      'Asia/Yekaterinburg',
      'Asia/Omsk',
      'Asia/Novosibirsk',
      'Asia/Barnaul',
      'Asia/Tomsk',
      'Asia/Novokuznetsk',
      'Asia/Krasnoyarsk',
      'Asia/Irkutsk',
      'Asia/Chita',
      'Asia/Yakutsk',
      'Asia/Khandyga',
      'Asia/Vladivostok',
      'Asia/Ust-Nera',
      'Asia/Magadan',
      'Asia/Sakhalin',
      'Asia/Srednekolymsk',
      'Asia/Kamchatka',
      'Asia/Anadyr',
    ],
    partialTimezones: [],
    offsetEastMinutes: null,
    languages: [
      { tag: 'ru-ru', score: 1 },
      { tag: 'ru', score: 0.8 },
    ],
    fontProbe: 'Привет мир ABCabc012',
    fonts: [],
    vendorFonts: ['YS Text', 'YS Display', 'SB Sans Text', 'SB Sans Display', 'VK Sans Display'],
    browsers: [[/yabrowser|yowser/i, 'Yandex Browser']],
    devices: [],
    weights: WEIGHTS_RU,
  },
  ir: {
    id: 'ir',
    timezones: ['Asia/Tehran'],
    partialTimezones: [],
    offsetEastMinutes: 210,
    languages: [
      { tag: 'fa-ir', score: 1 },
      { tag: 'fa', score: 0.8 },
    ],
    fontProbe: 'ایران فارسی ABCabc012',
    fonts: [
      'B Nazanin',
      'B Titr',
      'B Yekan',
      'B Mitra',
      'B Lotus',
      'B Zar',
      'IRANSans',
      'IRANSansX',
      'Vazir',
      'Vazirmatn',
      'Sahel',
      'Shabnam',
      'Samim',
      'Tanha',
      'Parastoo',
      'Estedad',
    ],
    vendorFonts: [],
    browsers: [],
    devices: [],
    weights: WEIGHTS_IR,
  },
  cu: {
    id: 'cu',
    timezones: ['America/Havana'],
    partialTimezones: [],
    offsetEastMinutes: null,
    languages: [
      { tag: 'es-cu', score: 1 },
      { tag: 'es', score: 0.3 },
    ],
    fontProbe: '',
    fonts: [],
    vendorFonts: [],
    browsers: [],
    devices: [],
    weights: WEIGHTS_CU,
  },
  sy: {
    id: 'sy',
    timezones: ['Asia/Damascus'],
    partialTimezones: [],
    offsetEastMinutes: 180,
    languages: [
      { tag: 'ar-sy', score: 1 },
      { tag: 'ar', score: 0.3 },
    ],
    fontProbe: '',
    fonts: [],
    vendorFonts: [],
    browsers: [],
    devices: [],
    weights: WEIGHTS_SY,
  },
  mm: {
    id: 'mm',
    timezones: ['Asia/Yangon', 'Asia/Rangoon'],
    partialTimezones: [],
    offsetEastMinutes: 390,
    languages: [
      { tag: 'my-mm', score: 1 },
      { tag: 'my', score: 0.9 },
    ],
    fontProbe: 'မြန်မာ ABCabc012',
    fonts: [
      'Pyidaungsu',
      'Padauk',
      'Myanmar3',
      'Zawgyi-One',
      'Masterpiece Uni Sans',
      'Parabaik',
      'WinUni Innwa',
      'Myanmar Sans Pro',
    ],
    vendorFonts: [],
    browsers: [],
    devices: [],
    weights: WEIGHTS_MM,
  },
};

const LANG_REGION = {
  en: 'cn',
  zh: 'cn',
  ru: 'ru',
  fa: 'ir',
  es: 'cu',
  ar: 'sy',
  my: 'mm',
} as const satisfies Record<Lang, RegionId>;

export function regionForLang(lang: Lang): RegionId {
  return LANG_REGION[lang];
}

function listWeightPair(
  weight: number,
  listLength: number,
  id: RegionId,
  field: string,
): void {
  const empty = listLength === 0;
  const zero = weight === 0;
  if (empty !== zero) {
    throw new Error(`Region ${id}: ${field} empty=${empty} but weight=${weight}`);
  }
}

const REGION_IDS: RegionId[] = ['cn', 'ru', 'ir', 'cu', 'sy', 'mm'];

export function assertRegionProfiles(): void {
  for (const id of REGION_IDS) {
    const p = REGIONS[id];
    const sum = Object.values(p.weights).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      throw new Error(`Region ${p.id} weights sum to ${sum}, expected 100`);
    }
    listWeightPair(p.weights.fonts, p.fonts.length, p.id, 'fonts');
    listWeightPair(p.weights.vendorFonts, p.vendorFonts.length, p.id, 'vendorFonts');
    listWeightPair(p.weights.cnBrowser, p.browsers.length, p.id, 'browsers');
    listWeightPair(p.weights.deviceVendor, p.devices.length, p.id, 'devices');
    const offsetActive = p.weights.timezoneOffset > 0;
    const offsetSet = p.offsetEastMinutes !== null;
    if (offsetActive !== offsetSet) {
      throw new Error(`Region ${p.id}: timezoneOffset weight vs offsetEastMinutes mismatch`);
    }
  }
}
