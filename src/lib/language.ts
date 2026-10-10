import { LANGUAGES, Language, DEFAULT_LANGUAGE } from '../i18n/languages';

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
      const match = matchLanguage(candidate);
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
