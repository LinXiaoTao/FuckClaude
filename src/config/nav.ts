import type { UiKey } from '../i18n/ui';

export type NavGroup = 'tools' | 'explore';

type NavItemShape = {
  id: string;
  path: string;
  group: NavGroup;
  labelKey: UiKey;
  descKey: UiKey;
  footer: boolean;
};

export const NAV_ITEMS = [
  {
    id: 'home',
    path: '/',
    group: 'tools',
    labelKey: 'nav.detector',
    descKey: 'nav.detector.desc',
    footer: true,
  },
  {
    id: 'ip',
    path: '/ip/',
    group: 'tools',
    labelKey: 'nav.ip',
    descKey: 'nav.ip.desc',
    footer: true,
  },
  {
    id: 'whoami',
    path: '/who-am-i/',
    group: 'tools',
    labelKey: 'nav.whoami',
    descKey: 'nav.whoami.desc',
    footer: false,
  },
  {
    id: 'extension',
    path: '/extension/',
    group: 'tools',
    labelKey: 'nav.extension',
    descKey: 'nav.extension.desc',
    footer: false,
  },
  {
    id: 'guides',
    path: '/guides/',
    group: 'explore',
    labelKey: 'nav.guides',
    descKey: 'nav.guides.desc',
    footer: true,
  },
  {
    id: 'news',
    path: '/news/',
    group: 'explore',
    labelKey: 'nav.news',
    descKey: 'nav.news.desc',
    footer: true,
  },
  {
    id: 'memorial',
    path: '/memorial/',
    group: 'explore',
    labelKey: 'nav.memorial',
    descKey: 'nav.memorial.desc',
    footer: false,
  },
] as const satisfies readonly NavItemShape[];

export type NavItem = (typeof NAV_ITEMS)[number];
export type NavItemId = NavItem['id'];
