import React, { useState, useEffect } from 'react';
import { Sliders, Maximize2, Lock, Unlock, Layers, FileType, Zap, Crop, Shield, Palette, Sparkles } from 'lucide-react';
import { TranslationKeys } from '../i18n/translations';
import { OutputFormat } from '../lib/formats';

export interface ResizeOptions {
  mode: 'percentage' | 'custom' | 'preset' | 'passport';
  percentage: number;
  width: number;
  height: number;
  lockAspect: boolean;
  format: OutputFormat;
  quality: number; // 0.1 to 1.0
  fitMode?: 'stretch' | 'contain' | 'cover';
  backgroundColor?: string;
  maxSizeKB?: number;
  enhance?: boolean;
  enhanceStrength?: number;
  enhanceMode?: 'smart' | 'document' | 'photo' | 'custom';
  contrastBoost?: number;
  brightnessAdjust?: number;
  denoise?: boolean;
}

interface ControlsPanelProps {
  originalWidth: number;
  originalHeight: number;
  options: ResizeOptions;
  onChangeOptions: (opts: ResizeOptions) => void;
  onProcess: () => void;
  isProcessing: boolean;
  t: TranslationKeys;
  fileCount?: number;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  originalWidth,
  originalHeight,
  options,
  onChangeOptions,
  onProcess,
  isProcessing,
  t,
  fileCount = 1,
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  useEffect(() => {
    if (originalWidth && originalHeight) {
      setAspectRatio(originalWidth / originalHeight);
    }
  }, [originalWidth, originalHeight]);

  const handleWidthChange = (newWidth: number) => {
    if (options.lockAspect && aspectRatio) {
      const calculatedHeight = Math.round(newWidth / aspectRatio);
      onChangeOptions({ ...options, width: newWidth, height: calculatedHeight });
    } else {
      onChangeOptions({ ...options, width: newWidth });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (options.lockAspect && aspectRatio) {
      const calculatedWidth = Math.round(newHeight * aspectRatio);
      onChangeOptions({ ...options, width: calculatedWidth, height: newHeight });
    } else {
      onChangeOptions({ ...options, height: newHeight });
    }
  };

  const handlePercentageChange = (pct: number) => {
    const newWidth = Math.round((originalWidth * pct) / 100);
    const newHeight = Math.round((originalHeight * pct) / 100);
    onChangeOptions({
      ...options,
      percentage: pct,
      width: newWidth,
      height: newHeight,
    });
  };

  const applyPreset = (w: number, h: number, fit: 'cover' | 'contain' = 'cover', maxKB?: number) => {
    onChangeOptions({
      ...options,
      width: w,
      height: h,
      fitMode: fit,
      maxSizeKB: maxKB,
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      
      {/* Tab Controls: Mode Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 gap-1">
        <button
          onClick={() => onChangeOptions({ ...options, mode: 'percentage' })}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            options.mode === 'percentage'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t.resizeTabPercentage}</span>
        </button>

        <button
          onClick={() => onChangeOptions({ ...options, mode: 'custom' })}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            options.mode === 'custom'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{t.resizeTabCustom}</span>
        </button>

        <button
          onClick={() => onChangeOptions({ ...options, mode: 'preset' })}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            options.mode === 'preset'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.resizeTabPresets}</span>
        </button>

        <button
          onClick={() => {
            onChangeOptions({
              ...options,
              mode: 'passport',
              width: 600,
              height: 600,
              fitMode: 'cover',
              maxSizeKB: 100,
              format: 'image/jpeg',
            });
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            options.mode === 'passport'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{t.passportTab || 'الهوية والجوازات (Gov)'}</span>
        </button>
      </div>

      {/* Mode 1: Percentage Scaling Slider */}
      {options.mode === 'percentage' && (
        <div className="space-y-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
            <span>{t.scalePercentage}</span>
            <span className="text-cyan-400 font-mono text-base font-bold bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800/50">
              {options.percentage}%
            </span>
          </div>
          
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={options.percentage}
            onChange={(e) => handlePercentageChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between gap-2">
            {[25, 50, 75, 100, 150].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercentageChange(pct)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  options.percentage === pct
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-700'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Custom Pixel Inputs */}
      {options.mode === 'custom' && (
        <div className="space-y-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.widthLabel}
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={options.width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.heightLabel}
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={options.height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

          </div>

          <button
            onClick={() => onChangeOptions({ ...options, lockAspect: !options.lockAspect })}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              options.lockAspect
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {options.lockAspect ? <Lock className="w-4 h-4 text-cyan-400" /> : <Unlock className="w-4 h-4 text-slate-500" />}
            <span>{t.lockAspectRatio}</span>
          </button>
        </div>
      )}

      {/* Mode 3: Presets Grid */}
      {options.mode === 'preset' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => applyPreset(1080, 1080)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 1080 && options.height === 1080
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{t.presetInstagramPost}</div>
              <div className="text-[11px] font-mono text-cyan-400">1080 × 1080 px</div>
            </button>

            <button
              onClick={() => applyPreset(1080, 1920)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 1080 && options.height === 1920
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{t.presetInstagramStory}</div>
              <div className="text-[11px] font-mono text-cyan-400">1080 × 1920 px</div>
            </button>

            <button
              onClick={() => applyPreset(1280, 720)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 1280 && options.height === 720
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{t.presetYoutubeThumb}</div>
              <div className="text-[11px] font-mono text-cyan-400">1280 × 720 px</div>
            </button>

            <button
              onClick={() => applyPreset(1500, 500)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 1500 && options.height === 500
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{t.presetTwitterHeader}</div>
              <div className="text-[11px] font-mono text-cyan-400">1500 × 500 px</div>
            </button>

            <button
              onClick={() => applyPreset(1000, 1000, 'cover')}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 1000 && options.height === 1000
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{t.presetEcommerceSquare}</div>
              <div className="text-[11px] font-mono text-cyan-400">1000 × 1000 px</div>
            </button>

            <button
              onClick={() => applyPreset(1200, 630)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 1200 && options.height === 630
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{t.presetFacebookCover || 'غلاف فيسبوك / لينكدإن'}</div>
              <div className="text-[11px] font-mono text-cyan-400">1200 × 630 px</div>
            </button>
          </div>
        </div>
      )}

      {/* Mode 4: Passport & Official Gov Documents Mode */}
      {options.mode === 'passport' && (
        <div className="space-y-4 bg-emerald-950/20 p-5 rounded-2xl border border-emerald-800/40">
          <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>{t.passportTitle || 'مقاسات الهوية الرسمية وجوازات السفر والفيزا (DPI 300)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => applyPreset(600, 600, 'cover', 100)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 600 && options.height === 600
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{t.passportUS || 'جواز سفر أمريكي / دولي'}</div>
              <div className="text-[11px] font-mono text-emerald-400">{t.passportUSSub || '2×2 إنش (600×600 px)'}</div>
              <div className="text-[10px] text-slate-400">{t.passportUnder100 || 'مضمونة أقل من 100KB'}</div>
            </button>

            <button
              onClick={() => applyPreset(413, 531, 'cover', 100)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 413 && options.height === 531
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{t.passportSchengen || 'فيزا الشنغن / أوروبا والخليج'}</div>
              <div className="text-[11px] font-mono text-emerald-400">{t.passportSchengenSub || '35×45 ملم (413×531 px)'}</div>
              <div className="text-[10px] text-slate-400">معايير السفارات</div>
            </button>

            <button
              onClick={() => applyPreset(472, 709, 'cover', 200)}
              className={`p-3 rounded-xl border text-start space-y-1 transition-all ${
                options.width === 472 && options.height === 709
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{t.passportArab || 'الهوية والوثائق العربية'}</div>
              <div className="text-[11px] font-mono text-emerald-400">{t.passportArabSub || '4×6 سم (472×709 px)'}</div>
              <div className="text-[10px] text-slate-400">{t.passportUnder200 || 'أقل من 200KB تلقائياً'}</div>
            </button>
          </div>

          {/* Background color fill selector for official photos */}
          <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.bgColorLabel || 'لون خلفية الهوية:'}</span>
            </span>
            <div className="flex gap-2">
              {[
                { name: t.bgWhite || 'أبيض', color: '#FFFFFF' },
                { name: t.bgLightGray || 'رمادي فاتح', color: '#F3F4F6' },
                { name: t.bgLightBlue || 'أزرق فاتح', color: '#E0F2FE' },
              ].map((bg) => (
                <button
                  key={bg.color}
                  onClick={() => onChangeOptions({ ...options, backgroundColor: bg.color })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    options.backgroundColor === bg.color
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-600" style={{ backgroundColor: bg.color }} />
                  <span>{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fit & Crop Mode Picker */}
      {(options.mode === 'preset' || options.mode === 'passport' || (options.mode === 'custom' && !options.lockAspect)) && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Crop className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.fitModeLabel}</span>
          </label>
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            {(['cover', 'contain', 'stretch'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeOptions({ ...options, fitMode: mode })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  (options.fitMode || 'cover') === mode
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'cover' ? t.fitModeCover : mode === 'contain' ? t.fitModeContain : t.fitModeStretch}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Output Formats & Quality Section */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileType className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.formatLabel}</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {options.format === 'image/webp'
                ? '⭐ الأفضل للمواقع والمتاجر (-90%)'
                : options.format === 'image/svg+xml'
                ? '📐 ' + (t.formatSvgDesc || 'متجهي قابل للتكبير بدون بكسلة')
                : options.format === 'image/avif'
                ? '🚀 ' + (t.formatAvifDesc || 'ضغط الجيل القادم فائق الصغر')
                : options.format === 'image/x-icon'
                ? '🌐 ' + (t.formatIcoDesc || 'أيقونة مواقع Favicon')
                : options.format === 'application/pdf'
                ? '📄 ' + (t.formatPdfDesc || 'مستند PDF رسمي جاهز للطباعة')
                : options.format.replace('image/', '').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'image/webp', label: 'WEBP', badge: '⭐ الأفضل' },
              { key: 'image/jpeg', label: 'JPG / JPEG', badge: 'شائع' },
              { key: 'image/png', label: 'PNG', badge: 'شفاف' },
              { key: 'image/svg+xml', label: 'SVG', badge: 'متجهي' },
              { key: 'image/avif', label: 'AVIF', badge: 'فائق' },
              { key: 'image/x-icon', label: 'ICO', badge: 'Favicon' },
              { key: 'application/pdf', label: 'PDF', badge: 'مستند' },
              { key: 'image/bmp', label: 'BMP', badge: 'خام' },
            ].map((fmt) => (
              <button
                key={fmt.key}
                onClick={() => onChangeOptions({ ...options, format: fmt.key as OutputFormat })}
                className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all text-start border flex items-center justify-between ${
                  options.format === fmt.key
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <span>{fmt.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/80 font-sans text-slate-400">
                  {fmt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Compression Quality Slider (for lossy formats) */}
        {options.format !== 'image/png' &&
          options.format !== 'image/bmp' &&
          options.format !== 'image/svg+xml' &&
          options.format !== 'image/x-icon' && (
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                <span>{t.qualityLabel}</span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                  {Math.round(options.quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={options.quality}
                onChange={(e) =>
                  onChangeOptions({ ...options, quality: Number(e.target.value) })
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          )}
      </div>

      {/* Advanced Clarity & Image Enhancement Studio */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-950/80 border border-violet-700/60 flex items-center justify-center text-violet-400 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                {t.clarityStudioTitle || 'استوديو توضيح وتحسين جودة الصورة (AI/HD Clarity)'}
              </h4>
              <p className="text-[10px] text-slate-400">
                {t.enhanceHint || 'يُبرز التفاصيل ويجعل الصور غير الواضحة أكثر حدّة وقراءة'}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onChangeOptions({
                ...options,
                enhance: !options.enhance,
                enhanceStrength: options.enhance ? options.enhanceStrength : options.enhanceStrength ?? 0.45,
                enhanceMode: options.enhanceMode ?? 'smart',
              })
            }
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              options.enhance
                ? 'bg-violet-950 text-violet-300 border-violet-500 shadow-lg shadow-violet-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${options.enhance ? 'text-violet-400' : 'text-slate-500'}`} />
            <span>{options.enhance ? 'مُفعّل ✓' : 'تفعيل التوضيح'}</span>
          </button>
        </div>

        {options.enhance && (
          <div className="bg-slate-900/70 p-4 rounded-2xl border border-violet-900/40 space-y-4">
            {/* 4 Clarity Modes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onChangeOptions({ ...options, enhanceMode: 'smart' })}
                className={`p-2.5 rounded-xl border text-start space-y-1 transition-all ${
                  (options.enhanceMode || 'smart') === 'smart'
                    ? 'bg-violet-950/90 border-violet-500 text-violet-200 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-violet-400" />
                  <span>{t.claritySmart || 'توضيح ذكي'}</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {t.claritySmartDesc || 'يضبط التباين والحدة وإبراز التفاصيل تلقائياً'}
                </div>
              </button>

              <button
                onClick={() => onChangeOptions({ ...options, enhanceMode: 'document' })}
                className={`p-2.5 rounded-xl border text-start space-y-1 transition-all ${
                  options.enhanceMode === 'document'
                    ? 'bg-violet-950/90 border-violet-500 text-violet-200 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.clarityDoc || 'نصوص ووثائق'}</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {t.clarityDocDesc || 'تغميق النصوص وتبييض الخلفية للأوراق والوثائق'}
                </div>
              </button>

              <button
                onClick={() => onChangeOptions({ ...options, enhanceMode: 'photo' })}
                className={`p-2.5 rounded-xl border text-start space-y-1 transition-all ${
                  options.enhanceMode === 'photo'
                    ? 'bg-violet-950/90 border-violet-500 text-violet-200 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.clarityPhoto || 'وجوه وبورتريه'}</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {t.clarityPhotoDesc || 'تنقية الشوائب وتوضيح الملامح بدقة'}
                </div>
              </button>

              <button
                onClick={() => onChangeOptions({ ...options, enhanceMode: 'custom' })}
                className={`p-2.5 rounded-xl border text-start space-y-1 transition-all ${
                  options.enhanceMode === 'custom'
                    ? 'bg-violet-950/90 border-violet-500 text-violet-200 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.clarityCustom || 'تحكم متقدم'}</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  محددات يدوية كاملة
                </div>
              </button>
            </div>

            {/* Main Sharpness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span>{t.enhanceStrengthLabel || 'مستوى حدة وتوضيح التفاصيل'}</span>
                <span className="font-mono text-violet-400 font-bold bg-violet-950 px-2.5 py-0.5 rounded border border-violet-800/40">
                  {Math.round((options.enhanceStrength ?? 0.45) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.2"
                step="0.05"
                value={options.enhanceStrength ?? 0.45}
                onChange={(e) =>
                  onChangeOptions({ ...options, enhanceStrength: Number(e.target.value) })
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
              />
            </div>

            {/* Granular Sliders when Custom Mode is selected */}
            {options.enhanceMode === 'custom' && (
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                {/* Contrast Boost */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{t.clarityContrast || 'زيادة التباين (Contrast)'}</span>
                    <span className="font-mono text-cyan-400 text-[11px]">
                      {Math.round((options.contrastBoost ?? 0) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={options.contrastBoost ?? 0}
                    onChange={(e) =>
                      onChangeOptions({ ...options, contrastBoost: Number(e.target.value) })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Brightness Adjust */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{t.clarityBrightness || 'تعديل الإضاءة (Brightness)'}</span>
                    <span className="font-mono text-amber-400 text-[11px]">
                      {Math.round((options.brightnessAdjust ?? 0) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-0.3"
                    max="0.3"
                    step="0.02"
                    value={options.brightnessAdjust ?? 0}
                    onChange={(e) =>
                      onChangeOptions({ ...options, brightnessAdjust: Number(e.target.value) })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* Denoise Filter Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300">
                    {t.clarityDenoise || 'تنقية الحبيبات والشوائب (Denoise)'}
                  </span>
                  <button
                    onClick={() => onChangeOptions({ ...options, denoise: !options.denoise })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      options.denoise
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {options.denoise ? 'مُفعّل ✓' : 'مُعطّل'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button: Process & Save */}
      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="w-full gradient-button py-4 rounded-2xl font-bold text-slate-950 text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
      >
        <Zap className="w-5 h-5 fill-slate-950" />
        <span>
          {isProcessing
            ? t.processingText
            : fileCount > 1
            ? (t.processBatchBtn || `معالجة وتجهيز جميع الصور (${fileCount}) الآن ➔`).replace('{count}', String(fileCount))
            : t.processBtn}
        </span>
      </button>

    </div>
  );
};
