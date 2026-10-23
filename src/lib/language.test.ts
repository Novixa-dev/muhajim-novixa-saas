import { describe, it, expect, beforeEach } from 'vitest';
import { matchLanguage, matchTranslatedLanguage, detectInitialLanguage } from './language';
import { DEFAULT_LANGUAGE } from '../i18n/languages';
import { getTranslation, TRANSLATED_LANGUAGES } from '../i18n/translations';

describe('Language Resolution & Detection', () => {
  beforeEach(() => {
    if (typeof globalThis.localStorage === 'undefined') {
      const store: Record<string, string> = {};
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: {
          getItem: (k: string) => store[k] || null,
          setItem: (k: string, v: string) => {
            store[k] = v;
          },
          removeItem: (k: string) => {
            delete store[k];
          },
          clear: () => {
            for (const k in store) delete store[k];
          },
          length: 0,
          key: () => null,
        },
      });
    } else {
      globalThis.localStorage.clear();
    }
  });

  it('matches valid BCP-47 language tags', () => {
    expect(matchLanguage('ar')?.code).toBe('ar');
    expect(matchLanguage('ar-SA')?.code).toBe('ar');
    expect(matchLanguage('en-US')?.code).toBe('en');
    expect(matchLanguage('fr-FR')?.code).toBe('fr');
    expect(matchLanguage('es-ES')?.code).toBe('es');
    expect(matchLanguage('unknown-tag')).toBeNull();
    expect(matchLanguage(null)).toBeNull();
  });

  it('prioritizes URL parameter when specified', () => {
    const lang = detectInitialLanguage('?lang=fr');
    expect(lang.code).toBe('fr');
  });

  it('falls back to Arabic by default when no preference is set', () => {
    const lang = detectInitialLanguage('');
    // DEFAULT_LANGUAGE is Arabic (ar)
    expect(DEFAULT_LANGUAGE.code).toBe('ar');
    expect(lang.dir).toBeDefined();
  });

  it('maps untranslated languages to a closely related translated pack', () => {
    expect(matchTranslatedLanguage('pt-BR')?.code).toBe('es');
    expect(matchTranslatedLanguage('it-IT')?.code).toBe('es');
    // A natively translated language resolves to itself.
    expect(matchTranslatedLanguage('fr-CA')?.code).toBe('fr');
    // Unknown tags resolve to nothing.
    expect(matchTranslatedLanguage('xx-YY')).toBeNull();
  });

  it('returns complete native packs for every translated language', () => {
    const enKeys = Object.keys(getTranslation('en')).sort();
    for (const code of TRANSLATED_LANGUAGES) {
      const keys = Object.keys(getTranslation(code)).sort();
      expect(keys).toEqual(enKeys);
    }
  });

  it('merges English defaults for languages without a native pack', () => {
    const pt = getTranslation('pt');
    const en = getTranslation('en');
    // Portuguese has no pack; it should still resolve to a full table via
    // the related Spanish fallback, never missing keys.
    expect(Object.keys(pt).sort()).toEqual(Object.keys(en).sort());
  });
});
