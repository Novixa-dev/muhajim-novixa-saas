import { LANGUAGES, Language, DEFAULT_LANGUAGE } from '../i18n/languages';
import { RELATED_FALLBACK, TRANSLATED_LANGUAGES } from '../i18n/translations';

const STORAGE_KEY = 'muhajim.lang';

/**
 * Resolve the best matching supported language for an incoming tag.
 * Accepts BCP-47 tags such as `en-US`, `ar-EG`, `zh-Hans` and matches them to
 * one of the 20 supported languages by primary subtag.
 */
export function matchLanguage(tag: string | null | undefined): Language | null {
  if (!tag) return null;
  const primary = tag.split('-')[0].toLowerCase();
  return LANGUAGES.find((l) => l.code === primary) || null;
}

/**
 * Resolve a language *with a native translation pack* for an incoming tag.
 * For languages we list in the UI but have not translated yet (for example
 * Portuguese or Italian), prefer a closely related translated language so the
 * user sees real translated copy rather than English. Returns `null` when no
 * sensible match exists, letting the caller fall back to the default.
 */
export function matchTranslatedLanguage(
  tag: string | null | undefined
): Language | null {
  const direct = matchLanguage(tag);
  if (!direct) return null;
  if ((TRANSLATED_LANGUAGES as readonly string[]).includes(direct.code)) {
    return direct;
  }
  const relatedCode = RELATED_FALLBACK[direct.code];
  return matchLanguage(relatedCode);
}

/**
 * Determine the initial language using, in priority order:
 *  1. `?lang=` URL parameter
 *  2. Saved user preference in localStorage
 *  3. The device/browser language(s)
 *  4. Arabic (project default)
 */
export function detectInitialLanguage(search: string): Language {
  const params = new URLSearchParams(search);
  const fromUrl = matchLanguage(params.get('lang'));
  if (fromUrl) return fromUrl;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const fromStorage = matchLanguage(saved);
    if (fromStorage) return fromStorage;
  } catch {
    /* localStorage may be unavailable (private mode) */
  }

  if (typeof navigator !== 'undefined') {
    const candidates = [
      ...(Array.isArray(navigator.languages) ? navigator.languages : []),
      navigator.language,
    ];
    for (const candidate of candidates) {
      const match = matchTranslatedLanguage(candidate);
      if (match) return match;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function persistLanguage(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
}
