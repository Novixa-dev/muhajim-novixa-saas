import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { ControlsPanel, ResizeOptions } from './components/ControlsPanel';
import { ResultPreview, ProcessedItem } from './components/ResultPreview';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DEFAULT_LANGUAGE, Language } from './i18n/languages';
import { getTranslation } from './i18n/translations';
import { detectInitialLanguage, persistLanguage } from './lib/language';
import { defaultFormatForFile, isSvgFile } from './lib/formats';
import { WorkerInputMessage, WorkerOutputMessage } from './workers/image.worker';
import { AlertCircle, X, Loader2 } from 'lucide-react';

const SeoSection = lazy(() =>
  import('./components/SeoSection').then((m) => ({ default: m.SeoSection }))
);
const InfoModal = lazy(() =>
  import('./components/InfoModal').then((m) => ({ default: m.InfoModal }))
);
type ModalType = 'privacy' | 'terms' | 'security' | null;

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() =>
    detectInitialLanguage(typeof window !== 'undefined' ? window.location.search : '')
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    mode: 'percentage',
    percentage: 50,
    width: 0,
    height: 0,
    lockAspect: true,
    format: 'image/webp',
    quality: 0.85,
    fitMode: 'cover',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [processedItems, setProcessedItems] = useState<ProcessedItem[] | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, (output: WorkerOutputMessage) => void>>(new Map());

  const t = getTranslation(currentLang.code);

  // Track object URLs created for results so they can always be revoked.
  const createdUrls = useRef<Set<string>>(new Set());

  const trackUrl = (url: string) => {
    createdUrls.current.add(url);
    return url;
  };

  const revokeAllUrls = () => {
    createdUrls.current.forEach((url) => URL.revokeObjectURL(url));
    createdUrls.current.clear();
  };

  // Initialize Web Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./workers/image.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e: MessageEvent<WorkerOutputMessage>) => {
      const { id } = e.data;
      const callback = pendingRequests.current.get(id);
      if (callback) {
        callback(e.data);
        pendingRequests.current.delete(id);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Revoke any outstanding object URLs when the app unmounts.
  useEffect(() => {
    const urls = createdUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  // Update HTML dir & lang attributes and URL parameter when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLang.dir);
    document.documentElement.setAttribute('lang', currentLang.code);
    persistLanguage(currentLang.code);

    const url = new URL(window.location.href);
    if (currentLang.code === DEFAULT_LANGUAGE.code) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', currentLang.code);
    }
    window.history.replaceState({}, '', url.toString());
  }, [currentLang]);

  // Handle files selection (Single or Multiple)
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setErrorMessage(null);
    setSelectedFiles(files);
    setProcessedItems(null);
    revokeAllUrls();

    // Read first file dimensions for initial control defaults
    const firstFile = files[0];
    const img = new Image();
    const objectUrl = URL.createObjectURL(firstFile);
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      setOriginalWidth(w);
      setOriginalHeight(h);

      const defaultScaleW = Math.round(w * 0.5);
      const defaultScaleH = Math.round(h * 0.5);

      // Default format = the uploaded image's own format (user can change it)
      const defaultFormat = defaultFormatForFile(firstFile);

      setResizeOptions((prev) => ({
        ...prev,
        width: defaultScaleW,
        height: defaultScaleH,
        percentage: 50,
        format: defaultFormat,
      }));

      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      setErrorMessage(t.loadErrorText);
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  // Rasterize SVG files into PNG blobs (SVG can't be decoded by createImageBitmap)
  const rasterizeSvg = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const size = 1024;
        const scale = Math.min(1, size / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('SVG rasterization failed'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('SVG rasterization failed'));
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load SVG image'));
      };
      img.src = url;
    });
  };

  // Helper to process one file through the Web Worker via Promise
  const processOneFile = (file: File): Promise<ProcessedItem> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Web Worker not initialized'));
        return;
      }

      // First get native image dimensions for aspect ratio handling
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        const fileW = img.width;
        const fileH = img.height;
        URL.revokeObjectURL(objUrl);

        let targetW = resizeOptions.width;
        let targetH = resizeOptions.height;

        if (resizeOptions.mode === 'percentage') {
          targetW = Math.round((fileW * resizeOptions.percentage) / 100);
          targetH = Math.round((fileH * resizeOptions.percentage) / 100);
        }

        const msgId = Math.random().toString(36).substring(2, 9);
        const inputMsg: WorkerInputMessage = {
          id: msgId,
          file,
          targetWidth: targetW,
          targetHeight: targetH,
          format: resizeOptions.format,
          quality: resizeOptions.quality,
          fitMode: resizeOptions.fitMode,
          backgroundColor: resizeOptions.backgroundColor,
          maxSizeKB: resizeOptions.maxSizeKB,
          enhance: resizeOptions.enhance,
          enhanceStrength: resizeOptions.enhanceStrength,
          enhanceMode: resizeOptions.enhanceMode,
          contrastBoost: resizeOptions.contrastBoost,
          brightnessAdjust: resizeOptions.brightnessAdjust,
          denoise: resizeOptions.denoise,
        };

        pendingRequests.current.set(msgId, (out: WorkerOutputMessage) => {
          if (out.success && out.blob) {
            const dataUrl = trackUrl(URL.createObjectURL(out.blob));
            resolve({
              originalFile: file,
              originalWidth: fileW,
              originalHeight: fileH,
              blob: out.blob,
              width: out.width,
              height: out.height,
              dataUrl,
            });
          } else {
            reject(new Error(out.error || `Failed to process ${file.name}`));
          }
        });

        workerRef.current?.postMessage(inputMsg);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        reject(new Error(`Failed to read file ${file.name}`));
      };

      img.src = objUrl;
    });
  };

  // Process all selected images with a small concurrency window so large
  // batches stay responsive and individual failures don't abort the whole run.
  const handleProcessImages = async () => {
    if (selectedFiles.length === 0 || !workerRef.current) return;

    setErrorMessage(null);
    setIsProcessing(true);
    setBatchProgress({ current: 0, total: selectedFiles.length });

    const results: ProcessedItem[] = [];
    const failures: string[] = [];
    let completed = 0;
    let cursor = 0;
    const concurrency = 2;

    const runWorker = async () => {
      while (cursor < selectedFiles.length) {
        const index = cursor++;
        let file = selectedFiles[index];
        try {
          if (isSvgFile(file)) {
            const pngBlob = await rasterizeSvg(file);
            file = new File([pngBlob], file.name.replace(/\.svg$/i, '.png'), {
              type: 'image/png',
            });
          }
          const item = await processOneFile(file);
          results.push(item);
        } catch (err) {
          failures.push(`${selectedFiles[index].name}: ${(err as Error).message}`);
        } finally {
          completed++;
          setBatchProgress({ current: completed, total: selectedFiles.length });
        }
      }
    };

    try {
      await Promise.all(
        Array.from({ length: Math.min(concurrency, selectedFiles.length) }, () => runWorker())
      );

      if (results.length > 0) {
        setProcessedItems(results);
      }
      if (failures.length > 0) {
        setErrorMessage(`${t.batchPartialWarning} ${failures.join(' • ')}`);
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Error occurred while processing images');
    } finally {
      setIsProcessing(false);
      setBatchProgress(null);
    }
  };

  const handleReset = () => {
    revokeAllUrls();
    setSelectedFiles([]);
    setProcessedItems(null);
    setErrorMessage(null);
    setBatchProgress(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-cyan-500 focus:text-slate-950 focus:font-bold focus:text-sm"
      >
        {t.tagline}
      </a>

      {/* Top Header Navigation */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        t={t}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold">
            <span>{t.heroBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 leading-tight">
            {t.tagline}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {t.privacySubtitle}
          </p>
        </div>

        {/* In-App Error Notification Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm flex items-center justify-between shadow-lg" role="alert">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              aria-label={t.closeBannerLabel}
              className="text-rose-400 hover:text-rose-200 p-1"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Step 1: Dropzone (if no files chosen) */}
        {selectedFiles.length === 0 && (
          <Dropzone onFilesSelected={handleFilesSelected} t={t} />
        )}

        {/* Step 2: Controls & Processing (if files chosen & not processed yet) */}
        {selectedFiles.length > 0 && !processedItems && (
          <div className="space-y-6">
            
            {/* File Selected Badge */}
            <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  {selectedFiles.length > 1 ? `${selectedFiles.length}X` : 'IMG'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
                    {selectedFiles.length === 1
                      ? selectedFiles[0].name
                      : t.selectedCountText.replace('{count}', String(selectedFiles.length))}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB {t.totalLabel} • {originalWidth} × {originalHeight} px
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 font-semibold"
              >
                {t.changeImagesBtn}
              </button>
            </div>

            {/* Batch Progress Bar if running */}
            {isProcessing && batchProgress && (
              <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-2">
                <div className="flex justify-between text-xs font-bold text-cyan-300">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>{t.batchProcessingText}</span>
                  </span>
                  <span className="font-mono">
                    {batchProgress.current} / {batchProgress.total}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-200"
                    style={{
                      width: `${(batchProgress.current / batchProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <ControlsPanel
              originalWidth={originalWidth}
              originalHeight={originalHeight}
              options={resizeOptions}
              onChangeOptions={setResizeOptions}
              onProcess={handleProcessImages}
              isProcessing={isProcessing}
              t={t}
              fileCount={selectedFiles.length}
            />

          </div>
        )}

        {/* Step 3: Result Preview & Download */}
        {selectedFiles.length > 0 && processedItems && (
          <ResultPreview
            items={processedItems}
            onReset={handleReset}
            t={t}
          />
        )}

        {/* In-feed Ad Banner (Between processing/result and SEO) */}
        <div className="pt-2">
          <AdBanner slotType="in-feed" t={t} />
        </div>

        {/* Programmatic SEO & Format Guide Section with FAQ (lazy) */}
        <ErrorBoundary
          fallbackTitle={t.appName}
          fallbackMessage={t.loadErrorText}
          reloadLabel={t.resetBtn}
        >
          <Suspense fallback={<div className="h-32 rounded-3xl bg-slate-900/40 animate-pulse" />}>
            <SeoSection t={t} />
          </Suspense>
        </ErrorBoundary>

      </main>

      {/* Sticky Bottom Ad Unit (Core Web Vitals Optimized) */}
      <div className="sticky bottom-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 p-2.5 text-center">
        <div className="max-w-4xl mx-auto">
          <AdBanner slotType="bottom-sticky" t={t} />
        </div>
      </div>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenModal={setActiveModal}
        t={t}
      />

      {/* Legal & Trust Info Modals (lazy) */}
      <ErrorBoundary
        fallbackTitle={t.appName}
        fallbackMessage={t.loadErrorText}
        reloadLabel={t.closeModalLabel}
      >
        <Suspense fallback={null}>
          <InfoModal
            type={activeModal}
            onClose={() => setActiveModal(null)}
            t={t}
          />
        </Suspense>
      </ErrorBoundary>

    </div>
  );
}

export default App;
