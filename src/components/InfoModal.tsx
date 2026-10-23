import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { TranslationKeys } from '../i18n/translations';

export type ModalType = 'privacy' | 'terms' | 'security' | null;

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
  t: TranslationKeys;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, t }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!type) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Move focus into the dialog for screen readers and keyboard users.
    const firstButton = dialogRef.current?.querySelector<HTMLElement>('button');
    firstButton?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [type, onClose]);

  if (!type) return null;

  const title =
    type === 'privacy'
      ? t.privacyTitle
      : type === 'terms'
      ? t.termsTitle
      : t.securityTitle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {type === 'privacy' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
            {type === 'terms' && <FileText className="w-6 h-6 text-cyan-400" />}
            {type === 'security' && <Lock className="w-6 h-6 text-indigo-400" />}
            <h3 id="info-modal-title" className="text-xl font-bold text-slate-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label={t.closeModalLabel}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on type */}
        <div className="text-sm text-slate-300 space-y-4 leading-relaxed">
          {type === 'privacy' && (
            <>
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t.privacyGuarantee}</span>
              </div>
              <h4 className="font-bold text-slate-100 text-base">{t.privacyCollectTitle}</h4>
              <p>{t.privacyCollectText}</p>
              <h4 className="font-bold text-slate-100 text-base">{t.privacyAnalyticsTitle}</h4>
              <p>{t.privacyAnalyticsText}</p>
              <h4 className="font-bold text-slate-100 text-base">{t.privacyCookiesTitle}</h4>
              <p>{t.privacyCookiesText}</p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="font-bold text-slate-100 text-base">{t.termsFreeTitle}</h4>
              <p>{t.termsFreeText}</p>
              <h4 className="font-bold text-slate-100 text-base">{t.termsIpTitle}</h4>
              <p>{t.termsIpText}</p>
              <h4 className="font-bold text-slate-100 text-base">{t.termsDisclaimerTitle}</h4>
              <p>{t.termsDisclaimerText}</p>
            </>
          )}

          {type === 'security' && (
            <>
              <h4 className="font-bold text-slate-100 text-base">{t.securityTitle}</h4>
              <p>{t.securityIntro}</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>
                  <strong className="text-slate-200">HTML5 Canvas &amp; OffscreenCanvas:</strong>{' '}
                  {t.securityCanvas}
                </li>
                <li>
                  <strong className="text-slate-200">Web Workers:</strong> {t.securityWorkers}
                </li>
                <li>
                  <strong className="text-slate-200">EXIF Auto-Orientation:</strong> {t.securityExif}
                </li>
                <li>
                  <strong className="text-slate-200">Memory Cleanup:</strong> {t.securityMemory}
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            {t.closeModalLabel}
          </button>
        </div>

      </div>
    </div>
  );
};
