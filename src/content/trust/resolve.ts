import { localize } from '../../i18n/localize';
import type { Lang } from '../../i18n/locales';
import { TRUST_CONTENT, type TrustPageId } from './index';

export function resolveTrustPageBody(page: TrustPageId, lang: Lang): string {
  return localize(TRUST_CONTENT[page], lang);
}
