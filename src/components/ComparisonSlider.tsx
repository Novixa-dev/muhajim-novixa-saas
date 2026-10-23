import React, { useState, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { TranslationKeys } from '../i18n/translations';

interface ComparisonSliderProps {
  originalUrl: string;
  processedUrl: string;
  t: TranslationKeys;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  processedUrl,
  t,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((p) => Math.max(0, p - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((p) => Math.min(100, p + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
        <span className="flex items-center gap-1 text-slate-300">
          <span>{t.originalLabel}</span>
        </span>
        <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{t.dragCompareHint}</span>
        </span>
        <span className="text-cyan-400 font-bold">{t.processedLabel}</span>
      </div>

      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 select-none cursor-ew-resize shadow-2xl"
      >
        {/* Background Layer: Processed Resized Image */}
        <img
          src={processedUrl}
          alt={t.processedImageAlt}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Foreground Layer (Clipped): Original Image */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalUrl}
            alt={t.originalImageAlt}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              maxWidth: 'none',
            }}
          />
        </div>

        {/* Draggable Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Drag Handle (keyboard focusable) */}
          <div
            role="slider"
            tabIndex={0}
            aria-label={t.compareSliderAria}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuetext={`${Math.round(sliderPosition)}%`}
            onKeyDown={handleKeyDown}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-xl pointer-events-auto cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-cyan-400 rounded-full" />
              <div className="w-0.5 h-3 bg-cyan-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
