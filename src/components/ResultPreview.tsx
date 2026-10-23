import React, { useState } from 'react';
import { Download, RefreshCw, Sparkles, ExternalLink, HardDrive, Archive, Eye, FileText, Copy, Check, Share2 } from 'lucide-react';
import { TranslationKeys } from '../i18n/translations';
import { formatExtension, OutputFormat } from '../lib/formats';
import { ComparisonSlider } from './ComparisonSlider';

export interface ProcessedItem {
  originalFile: File;
  originalWidth: number;
  originalHeight: number;
  blob: Blob;
  width: number;
  height: number;
  dataUrl: string;
}

interface ResultPreviewProps {
  items: ProcessedItem[];
  onReset: () => void;
  t: TranslationKeys;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({ items, onReset, t }) => {
  const [viewMode, setViewMode] = useState<'slider' | 'preview'>('slider');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isZipping, setIsZipping] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeItem = items[selectedIndex] || items[0];

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = items.reduce((acc, curr) => acc + curr.originalFile.size, 0);
  const totalNewSize = items.reduce((acc, curr) => acc + curr.blob.size, 0);

  const savingsPercent = Math.max(
    0,
    Math.round(((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100)
  );

  const originalObjectUrl = React.useMemo(() => {
    if (!activeItem) return '';
    return URL.createObjectURL(activeItem.originalFile);
  }, [activeItem]);

  React.useEffect(() => {
    return () => {
      if (originalObjectUrl) {
        URL.revokeObjectURL(originalObjectUrl);
      }
    };
  }, [originalObjectUrl]);

  const extensionFor = (item: ProcessedItem) =>
    formatExtension((item.blob.type as OutputFormat) || 'image/webp');

  const fileNameFor = (item: ProcessedItem) =>
    `resized_${item.originalFile.name.split('.')[0]}.${extensionFor(item)}`;

  const triggerConfetti = async () => {
    const { default: confetti } = await import('canvas-confetti');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleDownloadSingle = async (item: ProcessedItem) => {
    void triggerConfetti();

    const link = document.createElement('a');
    link.href = item.dataUrl;
    link.download = fileNameFor(item);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      items.forEach((item, idx) => {
        const ext = extensionFor(item);
        const cleanName = item.originalFile.name.split('.')[0];
        zip.file(`muhajim_${idx + 1}_${cleanName}.${ext}`, item.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const { default: confetti } = await import('canvas-confetti');
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `muhajim_batch_${items.length}_images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyImage = async () => {
    if (!activeItem) return;
    try {
      const item = activeItem;
      const pngBlob =
        item.blob.type === 'image/png'
          ? item.blob
          : await new Promise<Blob>((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  reject(new Error('Canvas unavailable'));
                  return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
              };
              img.onerror = () => reject(new Error('Image load failed'));
              img.src = item.dataUrl;
            });

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy image failed:', err);
    }
  };

  const handleShare = async () => {
    if (!activeItem) return;
    const file = new File([activeItem.blob], fileNameFor(activeItem), {
      type: activeItem.blob.type || 'image/png',
    });
    const nav = navigator as Navigator & {
      canShare?: (data: { files?: File[] }) => boolean;
      share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
    };
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      try {
        await nav.share({
          files: [file],
          title: t.appName,
          text: t.tagline,
        });
      } catch {
        /* user cancelled */
      }
    }
  };

  const canShare =
    typeof navigator !== 'undefined' &&
    typeof (navigator as Navigator & { canShare?: unknown }).canShare === 'function';

  const canCopy =
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof (window as Window & { ClipboardItem?: unknown }).ClipboardItem !== 'undefined';

  return (
    <div className="space-y-6">
      
      {/* File Size Comparison Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 bg-cyan-950/20 text-center space-y-4">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{t.savingsLabel}: {savingsPercent}% {items.length > 1 && `(${t.batchTotalLabel} ${items.length})`}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center max-w-xl mx-auto">
          {/* Before */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-1">{t.originalSize}</div>
            <div className="text-xl font-bold font-mono text-slate-200">{formatBytes(totalOriginalSize)}</div>
            <div className="text-[11px] font-mono text-slate-500">
              {items.length === 1 ? `${activeItem.originalWidth} × ${activeItem.originalHeight} px` : `${items.length} ${t.originalFilesLabel}`}
            </div>
          </div>

          {/* After */}
          <div className="bg-cyan-950/60 p-4 rounded-2xl border border-cyan-800/60">
            <div className="text-xs text-cyan-300 font-semibold mb-1">{t.newSize}</div>
            <div className="text-xl font-bold font-mono text-cyan-400">{formatBytes(totalNewSize)}</div>
            <div className="text-[11px] font-mono text-cyan-300">
              {items.length === 1 ? `${activeItem.width} × ${activeItem.height} px` : t.readyToDownload}
            </div>
          </div>
        </div>

        {/* Action Buttons: Single / Batch Zip / Reset */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
          {items.length > 1 ? (
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex-1 gradient-button py-4 px-6 rounded-2xl font-bold text-slate-950 text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
            >
              <Archive className="w-5 h-5" />
              <span>{isZipping ? t.zippingText : t.batchZipBtn.replace('{count}', String(items.length))}</span>
            </button>
          ) : (
            <button
              onClick={() => handleDownloadSingle(activeItem)}
              className="flex-1 gradient-button py-4 px-6 rounded-2xl font-bold text-slate-950 text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20"
            >
              <Download className="w-5 h-5" />
              <span>{t.downloadBtn}</span>
            </button>
          )}

          {items.length === 1 && canCopy && (
            <button
              onClick={handleCopyImage}
              className="py-4 px-6 rounded-2xl font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-sm flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? t.copiedBtn : t.copyBtn}</span>
            </button>
          )}

          {items.length === 1 && canShare && (
            <button
              onClick={handleShare}
              className="py-4 px-6 rounded-2xl font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>{t.shareBtn}</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="py-4 px-6 rounded-2xl font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-sm flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>{t.resetBtn}</span>
          </button>
        </div>

      </div>

      {/* Multi-item Thumbnail Selector (If Batch Mode) */}
      {items.length > 1 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400">{t.chooseImagePreview}</div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                aria-label={t.thumbAlt.replace('{idx}', String(idx + 1))}
                aria-pressed={selectedIndex === idx}
                className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedIndex === idx
                    ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={item.dataUrl} alt={t.thumbAlt.replace('{idx}', String(idx + 1))} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] font-mono text-cyan-400 text-center py-0.5">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview & Comparison Mode Switcher */}
      {activeItem && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 truncate max-w-xs">
              {t.previewLabel}: {activeItem.originalFile.name}
            </span>

            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('slider')}
                aria-pressed={viewMode === 'slider'}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'slider'
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.compareSliderLabel}</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                aria-pressed={viewMode === 'preview'}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'preview'
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.livePreviewLabel}</span>
              </button>
            </div>
          </div>

          {/* View Container */}
          {activeItem.blob.type === 'application/pdf' ? (
            <div className="w-full py-12 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 shadow-lg">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-slate-100">{t.pdfReadyTitle}</div>
                <div className="text-xs font-mono text-slate-400">
                  {activeItem.originalFile.name.split('.')[0]}.pdf • ({formatBytes(activeItem.blob.size)})
                </div>
              </div>
              <button
                onClick={() => handleDownloadSingle(activeItem)}
                className="gradient-button py-2.5 px-6 rounded-xl font-bold text-slate-950 text-xs flex items-center gap-2 mt-2"
              >
                <Download className="w-4 h-4" />
                <span>{t.pdfDownloadBtn}</span>
              </button>
            </div>
          ) : viewMode === 'slider' ? (
            <ComparisonSlider
              originalUrl={originalObjectUrl}
              processedUrl={activeItem.dataUrl}
              t={t}
            />
          ) : (
            <div className="w-full max-h-[450px] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
              <img
                src={activeItem.dataUrl}
                alt={t.processedImageAlt}
                className="max-h-[430px] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>
          )}
        </div>
      )}

      {/* Monetization & Novixa Ecosystem Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Affiliate Link */}
        <a
          href="https://canva.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card rounded-2xl p-4 flex items-center gap-3 border border-slate-800 hover:border-cyan-500/40"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-200">{t.canvaAffiliate}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span>{t.canvaAffiliateSub}</span>
              <ExternalLink className="w-3 h-3 text-purple-400" />
            </div>
          </div>
        </a>

        {/* Novixa Enterprise Funnel */}
        <a
          href="https://novixa-cyan.vercel.app/ar"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card rounded-2xl p-4 flex items-center gap-3 border border-slate-800 hover:border-cyan-500/40"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-200">{t.novixaDevLink}</div>
            <div className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
              <span>{t.novixaDevLinkSub}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </a>

      </div>

    </div>
  );
};
