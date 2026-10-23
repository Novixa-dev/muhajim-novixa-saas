import React, { useEffect, useRef } from 'react';
import { ADS_CONFIG } from '../config/ads.config';
import { TranslationKeys } from '../i18n/translations';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdBannerProps {
  slotType: 'bottom-sticky' | 'in-feed';
  className?: string;
  t: TranslationKeys;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotType, className = '', t }) => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (ADS_CONFIG.network === 'adsense' && adRef.current) {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    }
  }, []);

  // Mode 1: Live Google AdSense
  if (ADS_CONFIG.network === 'adsense') {
    const slotId = slotType === 'bottom-sticky' ? ADS_CONFIG.adsense.bottomSlot : ADS_CONFIG.adsense.resultSlot;

    return (
      <div className={`w-full overflow-hidden text-center bg-slate-900/60 border border-slate-800/80 rounded-2xl min-h-[90px] flex flex-col items-center justify-center ${className}`}>
        <span className="text-[10px] uppercase font-mono text-slate-600 mb-1">{t.sponsoredLabel}</span>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px', width: '100%' }}
          data-ad-client={ADS_CONFIG.adsense.client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Mode 2: Novixa Ecosystem Promotion / Direct Affiliate Mode
  return (
    <div
      className={`w-full bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border border-cyan-800/40 rounded-2xl p-3.5 sm:p-4 shadow-lg backdrop-blur-md ${className}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-slate-200 text-xs sm:text-sm">
              {ADS_CONFIG.promo.title}
            </div>
            <div className="text-[11px] text-slate-400">
              {ADS_CONFIG.promo.description}
            </div>
          </div>
        </div>

        <a
          href={ADS_CONFIG.promo.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
        >
          <span>{ADS_CONFIG.promo.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

      </div>
    </div>
  );
};
