import React, { useState } from 'react';
import { ShieldCheck, Globe, Sparkles, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, Language } from '../i18n/languages';
import { TranslationKeys } from '../i18n/translations';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  t: TranslationKeys;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onSelectLang, t }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight gradient-text">
                {t.appName}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                v{__APP_VERSION__}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {t.byNovixa}
            </p>
          </div>
        </div>

        {/* Privacy Badge & Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Security Guarantee Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.privacyBadge}</span>
          </div>

          {/* 20-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label={t.selectLanguageLabel}
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sm font-semibold text-slate-200 transition-all shadow-sm"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.nativeName}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute top-full mt-2 end-0 w-72 max-w-[calc(100vw-2rem)] glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-slate-700/60">
                <div className="p-2 border-b border-slate-800 mb-2">
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute top-2.5 left-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t.langSearchPlaceholder.replace('{count}', String(LANGUAGES.length))}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label={t.langSearchPlaceholder.replace('{count}', String(LANGUAGES.length))}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar" role="listbox" aria-label={t.selectLanguageLabel}>
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={currentLang.code === lang.code}
                      onClick={() => {
                        onSelectLang(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        currentLang.code === lang.code
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                          : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-500">({lang.name})</span>
                      </div>
                      {currentLang.code === lang.code && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
