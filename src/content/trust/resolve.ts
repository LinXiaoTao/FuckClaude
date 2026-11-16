import { localize } from '../../i18n/localize';
import type { Lang } from '../../i18n/locales';
import { PRIVACY_COUNTERS_SECTION, TRUST_CONTENT, type TrustPageId } from './index';

export function resolveTrustPageBody(page: TrustPageId, lang: Lang): string {
  const body = localize(TRUST_CONTENT[page], lang);
  return page === 'privacy' ? `${body}\n\n${localize(PRIVACY_COUNTERS_SECTION, lang)}` : body;
}
