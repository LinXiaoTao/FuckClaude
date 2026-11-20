import { localize } from '../../i18n/localize';
import type { Lang } from '../../i18n/locales';
import { PRIVACY_COUNTERS_SECTION, TRUST_CONTENT, type TrustPageId } from './index';
import { PRIVACY_MEMORIAL_SECTION } from './privacy-memorial';
import { PRIVACY_WHOAMI_SECTION } from './privacy-whoami';

const PRIVACY_SECTIONS = [
  PRIVACY_COUNTERS_SECTION,
  PRIVACY_WHOAMI_SECTION,
  PRIVACY_MEMORIAL_SECTION,
];

export function resolveTrustPageBody(page: TrustPageId, lang: Lang): string {
  const body = localize(TRUST_CONTENT[page], lang);
  if (page !== 'privacy') return body;
  return [body, ...PRIVACY_SECTIONS.map((section) => localize(section, lang))].join('\n\n');
}
