import { describe, it, expect, beforeEach } from 'vitest';
import { matchLanguage, detectInitialLanguage } from './language';
import { DEFAULT_LANGUAGE } from '../i18n/languages';

describe('Language Resolution & Detection', () => {
  beforeEach(() => {
    if (typeof globalThis.localStorage === 'undefined') {
      const store: Record<string, string> = {};
      globalThis.localStorage = {
        getItem: (k: string) => store[k] || null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { for (const k in store) delete store[k]; },
        length: 0,
        key: () => null,
      } as any;
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
});
