import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Globe, Layers, HelpCircle, ChevronDown } from 'lucide-react';
import { TranslationKeys } from '../i18n/translations';

interface SeoSectionProps {
  t: TranslationKeys;
}

export const SeoSection: React.FC<SeoSectionProps> = ({ t }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const rows = [
    {
      format: 'WEBP',
      color: 'text-cyan-400',
      compression: t.rowWebpCompression,
      compressionColor: 'text-emerald-400',
      transparency: t.rowWebpTransparency,
      transparencyColor: 'text-emerald-400',
      use: t.rowWebpUse,
    },
    {
      format: 'SVG',
      color: 'text-indigo-400',
      compression: t.rowSvgCompression,
      compressionColor: 'text-cyan-300',
      transparency: t.rowSvgTransparency,
      transparencyColor: 'text-emerald-400',
      use: t.rowSvgUse,
    },
    {
      format: 'AVIF',
      color: 'text-violet-400',
      compression: t.rowAvifCompression,
      compressionColor: 'text-emerald-400',
      transparency: t.rowAvifTransparency,
      transparencyColor: 'text-emerald-400',
      use: t.rowAvifUse,
    },
    {
      format: 'JPEG / JPG',
      color: 'text-amber-400',
      compression: t.rowJpegCompression,
      compressionColor: 'text-emerald-400',
      transparency: t.noLabel,
      transparencyColor: 'text-rose-400',
      use: t.rowJpegUse,
    },
    {
      format: 'PNG',
      color: 'text-sky-400',
      compression: t.rowPngCompression,
      compressionColor: 'text-amber-400',
      transparency: t.rowPngTransparency,
      transparencyColor: 'text-emerald-400',
      use: t.rowPngUse,
    },
    {
      format: 'PDF',
      color: 'text-rose-400',
      compression: t.rowPdfCompression,
      compressionColor: 'text-slate-300',
      transparency: t.rowPdfTransparency,
      transparencyColor: 'text-slate-400',
      use: t.rowPdfUse,
    },
    {
      format: 'ICO',
      color: 'text-teal-400',
      compression: t.rowIcoCompression,
      compressionColor: 'text-slate-300',
      transparency: t.rowIcoTransparency,
      transparencyColor: 'text-emerald-400',
      use: t.rowIcoUse,
    },
  ];

  const faqs = [
    { q: t.faq1q, a: t.faq1a },
    { q: t.faq2q, a: t.faq2a },
    { q: t.faq3q, a: t.faq3a },
    { q: t.faq4q, a: t.faq4a },
    { q: t.faq5q, a: t.faq5a },
    { q: t.faq6q, a: t.faq6a },
    { q: t.faq7q, a: t.faq7a },
  ];

  return (
    <section className="mt-16 glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 space-y-10">
      
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5" />
          <span>{t.seoBadge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
          {t.seoTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Feature 1 */}
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-200">{t.seoFeature1Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.seoParagraph1}
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-200">{t.seoFeature2Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.seoParagraph2}
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-200">{t.seoFeature3Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.seoParagraph3}
          </p>
        </div>

      </div>

      {/* Structured Comparison Table */}
      <div className="pt-6 border-t border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{t.formatCompareTitle}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start text-slate-400">
            <thead className="bg-slate-900/80 text-slate-200 font-bold uppercase font-mono border-b border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3">{t.thFormat}</th>
                <th scope="col" className="px-4 py-3">{t.thCompression}</th>
                <th scope="col" className="px-4 py-3">{t.thTransparency}</th>
                <th scope="col" className="px-4 py-3">{t.thBestUse}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {rows.map((row) => (
                <tr key={row.format} className="hover:bg-slate-900/40">
                  <td className={`px-4 py-3 font-bold ${row.color}`}>{row.format}</td>
                  <td className={`px-4 py-3 ${row.compressionColor}`}>{row.compression}</td>
                  <td className={`px-4 py-3 ${row.transparencyColor}`}>{row.transparency}</td>
                  <td className="px-4 py-3 text-slate-300">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="pt-6 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-slate-100">{t.faqTitle}</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  id={buttonId}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full p-4 text-start font-bold text-xs sm:text-sm text-slate-200 flex items-center justify-between gap-3 hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
