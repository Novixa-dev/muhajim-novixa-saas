import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { ControlsPanel, ResizeOptions } from './components/ControlsPanel';
import { ResultPreview, ProcessedItem } from './components/ResultPreview';
import { SeoSection } from './components/SeoSection';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { InfoModal, ModalType } from './components/InfoModal';
import { DEFAULT_LANGUAGE, LANGUAGES, Language } from './i18n/languages';
import { getTranslation } from './i18n/translations';
import { WorkerInputMessage, WorkerOutputMessage } from './workers/image.worker';
import { AlertCircle, X, Loader2 } from 'lucide-react';

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    // Check URL query param ?lang=xx
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      if (langParam) {
        const found = LANGUAGES.find((l) => l.code === langParam);
        if (found) return found;
      }
    }
    return DEFAULT_LANGUAGE;
  });

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

  // Update HTML dir & lang attributes and URL parameter when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLang.dir);
    document.documentElement.setAttribute('lang', currentLang.code);

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

      let defaultFormat: 'image/webp' | 'image/jpeg' | 'image/png' = 'image/webp';
      const fileType = firstFile.type.toLowerCase();
      if (fileType === 'image/png') defaultFormat = 'image/png';
      else if (fileType === 'image/jpeg' || fileType === 'image/jpg') defaultFormat = 'image/jpeg';
      else if (fileType === 'image/webp') defaultFormat = 'image/webp';
      else if (fileType === 'image/avif') defaultFormat = 'image/webp';
      else if (fileType === 'image/gif') defaultFormat = 'image/png';
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
      setErrorMessage('Failed to load image file. Please ensure it is a valid format.');
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
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
        };

        pendingRequests.current.set(msgId, (out: WorkerOutputMessage) => {
          if (out.success && out.blob) {
            const dataUrl = URL.createObjectURL(out.blob);
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

  // Process all selected images
  const handleProcessImages = async () => {
    if (selectedFiles.length === 0 || !workerRef.current) return;

    setErrorMessage(null);
    setIsProcessing(true);
    setBatchProgress({ current: 0, total: selectedFiles.length });

    const results: ProcessedItem[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        setBatchProgress({ current: i + 1, total: selectedFiles.length });
        const item = await processOneFile(selectedFiles[i]);
        results.push(item);
      }

      setProcessedItems(results);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while processing images');
    } finally {
      setIsProcessing(false);
      setBatchProgress(null);
    }
  };

  const handleReset = () => {
    if (processedItems) {
      processedItems.forEach((item) => URL.revokeObjectURL(item.dataUrl));
    }
    setSelectedFiles([]);
    setProcessedItems(null);
    setErrorMessage(null);
    setBatchProgress(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Header Navigation */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold">
            <span>✨ 100% In-Browser In-Memory Engine ($0 Compute)</span>
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
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 p-1"
            >
              <X className="w-4 h-4" />
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
                      : `تم اختيار ${selectedFiles.length} صور للمعالجة الجماعية`}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB إجمالي • {originalWidth} × {originalHeight} px
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 font-semibold"
              >
                تغيير الصور
              </button>
            </div>

            {/* Batch Progress Bar if running */}
            {isProcessing && batchProgress && (
              <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-2">
                <div className="flex justify-between text-xs font-bold text-cyan-300">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>جاري معالجة الصور محلياً داخل المتصفح...</span>
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
          <AdBanner slotType="in-feed" />
        </div>

        {/* Programmatic SEO & Format Guide Section with FAQ */}
        <SeoSection t={t} />

      </main>

      {/* Sticky Bottom Ad Unit (Core Web Vitals Optimized) */}
      <div className="sticky bottom-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 p-2.5 text-center">
        <div className="max-w-4xl mx-auto">
          <AdBanner slotType="bottom-sticky" />
        </div>
      </div>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenModal={setActiveModal}
        t={t}
      />

      {/* Legal & Trust Info Modals */}
      <InfoModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />

    </div>
  );
}

export default App;
