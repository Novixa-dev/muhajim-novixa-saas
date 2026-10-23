import React from 'react';
import { LANGUAGES, Language } from '../i18n/languages';
import { TranslationKeys } from '../i18n/translations';
import { ModalType } from './InfoModal';

interface FooterProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenModal: (type: ModalType) => void;
  t: TranslationKeys;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onSelectLang, onOpenModal, t }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Footer: Brand Info & Novixa Ecosystem */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-lg font-black gradient-text">{t.appName}</div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              {t.tagline}
            </p>
          </div>
          
          <div className="text-xs text-slate-400 font-mono">
            <span>{t.poweredBy} </span>
            <a
              href="https://novixa-cyan.vercel.app/ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              Novixa Digital Engineering
            </a>
          </div>
        </div>

        {/* 20-Language Link Matrix for SEO Crawlers */}
        <div className="pt-6 border-t border-slate-800/60">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            {t.languagesHeading}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-xs">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelectLang(lang)}
                className={`text-start px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  currentLang.code === lang.code
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <div>{t.footerRights}</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenModal('privacy')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {t.privacyPolicy}
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenModal('terms')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {t.termsOfService}
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenModal('security')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {t.securityWhitepaper}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
