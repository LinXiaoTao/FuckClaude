import { GUIDE_CONTENT } from '../content/guidesData';
import { localePath, stripLocalePrefix, type Lang } from './locales';
import type { ContentSource } from './types';

function loadGuideBodyModules(): Record<string, { content: string }> {
  try {
    return import.meta.glob<{ content: string }>('../content/guides-i18n/*/*.ts', { eager: true });
  } catch {
    return {};
  }
}

const guideBodyModules = loadGuideBodyModules();

type GuideBodyIndex = Partial<Record<Lang, Partial<Record<string, string>>>>;

function indexGuideBodies(): GuideBodyIndex {
  const index: GuideBodyIndex = {};
  for (const [filePath, mod] of Object.entries(guideBodyModules)) {
    const match = filePath.match(/\/guides-i18n\/([^/]+)\/([^/]+)\.ts$/);
    if (!match) continue;
    const [, lang, slugFile] = match;
    const slug = slugFile.replace(/\.ts$/, '');
    if (!index[lang as Lang]) {
      index[lang as Lang] = {};
    }
    index[lang as Lang]![slug] = mod.content;
  }
  return index;
}

const GUIDE_BODIES = indexGuideBodies();

export type GuideBodyResolution = {
  html: string;
  source: ContentSource;
};

const INTERNAL_HREF = /href="(\/(?!\/)[^"#?]*)([^"]*)"/g;

/** Point same-site links at the reader's locale whatever prefix the authored body used. */
function localizeInternalLinks(html: string, lang: Lang): string {
  return html.replace(INTERNAL_HREF, (_match, path: string, rest: string) => {
    if (/\.[a-z0-9]+$/i.test(path)) return `href="${path}${rest}"`;
    const stripped = stripLocalePrefix(path);
    const normalized = stripped === '/' || stripped.endsWith('/') ? stripped : `${stripped}/`;
    return `href="${localePath(lang, normalized)}${rest}"`;
  });
}

function pickGuideBody(slug: string, lang: Lang): GuideBodyResolution {
  const authored = GUIDE_CONTENT[slug];
  if (!authored) {
    return { html: '', source: 'fallback' };
  }

  const perLocale = GUIDE_BODIES[lang]?.[slug];
  if (perLocale) {
    return { html: perLocale, source: 'native' };
  }

  if (lang === 'en') {
    return { html: authored.en, source: 'native' };
  }
  if (lang === 'zh') {
    return { html: authored.zh, source: 'native' };
  }

  return { html: authored.en, source: 'fallback' };
}

export function resolveGuideBody(slug: string, lang: Lang): GuideBodyResolution {
  const body = pickGuideBody(slug, lang);
  return { ...body, html: localizeInternalLinks(body.html, lang) };
}
