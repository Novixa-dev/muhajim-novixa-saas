import React, { useState, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, ShieldAlert, Command, Layers } from 'lucide-react';
import { TranslationKeys } from '../i18n/translations';
import { INPUT_ACCEPT, SUPPORTED_INPUT_MIME } from '../lib/formats';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  t: TranslationKeys;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, t }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const type = (fileList[i].type || '').toLowerCase();
        const name = fileList[i].name.toLowerCase();
        const isSupported =
          type.startsWith('image/') && SUPPORTED_INPUT_MIME.includes(type) ||
          /\.(jpe?g|png|webp|gif|bmp|avif|svg)$/.test(name);
        if (isSupported) {
          validFiles.push(fileList[i]);
        }
      }
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }
      if (pastedFiles.length > 0) {
        onFilesSelected(pastedFiles);
      }
    }
  }, [onFilesSelected]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative group cursor-pointer overflow-hidden rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01] shadow-2xl shadow-cyan-500/10'
            : 'border-slate-700/80 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/70 shadow-xl'
        }`}
      >
        <input
          type="file"
          multiple
          accept={INPUT_ACCEPT}
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          
          {/* Animated Upload Icon Container */}
          <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
            <UploadCloud className="w-10 h-10 text-cyan-400 group-hover:animate-bounce" />
          </div>

          <div className="space-y-1 max-w-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
              {t.dragDropTitle}
            </h3>
            <p className="text-sm text-slate-400">
              {t.dragDropSubtitle}
            </p>
          </div>

          {/* Action Button & Supported Formats Badge */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button className="gradient-button px-6 py-3 rounded-xl text-slate-950 font-bold text-sm flex items-center gap-2 pointer-events-none shadow-lg">
              <ImageIcon className="w-4 h-4" />
              <span>{t.selectFilesBtn}</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] font-mono text-slate-400">
              <Command className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.pasteClipboardHint}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-[11px] font-mono text-cyan-300">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.batchDropHint}</span>
            </div>
          </div>

          {/* Supported Formats & Feature Pills */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 text-[11px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">PNG</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">JPG</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50 text-cyan-400 font-bold">WEBP</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">SVG</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">AVIF</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">ICO</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">PDF</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">BMP</span>
            <span className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-700/60 text-violet-300 font-bold">
              {t.clarityStudioPill}
            </span>
          </div>

        </div>
      </div>

      {/* Sub-banner: 100% Client-side Processing Guarantee */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-900/40 border border-slate-800/80 rounded-2xl py-2.5 px-4">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>{t.privacySubtitle}</span>
      </div>
    </div>
  );
};
