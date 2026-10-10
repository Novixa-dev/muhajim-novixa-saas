// Web Worker for 100% In-Browser Image Scaling, Clarity Enhancement & Compression
import type { OutputFormat } from '../lib/formats';

export type { OutputFormat };

export interface WorkerInputMessage {
  id: string;
  file: File;
  targetWidth: number;
  targetHeight: number;
  format: OutputFormat;
  quality: number; // 0.1 to 1.0
  fitMode?: 'stretch' | 'contain' | 'cover';
  backgroundColor?: string;
  maxSizeKB?: number; // Target max file size (e.g. 100 for < 100KB passport documents)
  enhance?: boolean;
  enhanceStrength?: number; // 0.1 to 1.0
  enhanceMode?: 'smart' | 'document' | 'photo' | 'custom';
  contrastBoost?: number; // 0 to 1
  brightnessAdjust?: number; // -0.5 to 0.5
  denoise?: boolean;
}

export interface WorkerOutputMessage {
  id: string;
  success: boolean;
  blob?: Blob;
  dataUrl?: string;
  originalSize: number;
  newSize: number;
  width: number;
  height: number;
  error?: string;
}

/**
 * High-performance 3x3 unsharp-mask style sharpening applied in-place on canvas pixels.
 * Boosts center pixel and subtracts orthogonal neighbors to crispen edges and text.
 */
function applySharpen(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  strength: number
) {
  if (strength <= 0) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const w = canvas.width;
  const h = canvas.height;
  const src = new Uint8ClampedArray(data);

  const k = Math.min(1.5, strength);
  const center = 1 + 4 * k;
  const edge = -k;

  for (let y = 1; y < h - 1; y++) {
    const rowOffset = y * w;
    const upOffset = (y - 1) * w;
    const downOffset = (y + 1) * w;

    for (let x = 1; x < w - 1; x++) {
      const i = (rowOffset + x) * 4;
      const up = (upOffset + x) * 4;
      const down = (downOffset + x) * 4;
      const left = i - 4;
      const right = i + 4;

      for (let c = 0; c < 3; c++) {
        const v =
          src[i + c] * center +
          src[up + c] * edge +
          src[down + c] * edge +
          src[left + c] * edge +
          src[right + c] * edge;
        data[i + c] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Dynamic Range / Auto-Contrast Normalization (Histogram Stretch).
 * Finds dark and light percentile limits and remaps luminance so washed-out or dim images pop.
 */
function applyAutoLevels(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  strength: number
) {
  if (strength <= 0) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const totalPixels = canvas.width * canvas.height;

  // Build brightness histogram
  const hist = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    const luma = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    hist[Math.round(luma)]++;
  }

  // Clip 1% outliers at the bottom and top
  const clip = Math.floor(totalPixels * 0.01);
  let minLum = 0;
  let count = 0;
  for (let i = 0; i < 256; i++) {
    count += hist[i];
    if (count > clip) {
      minLum = i;
      break;
    }
  }

  let maxLum = 255;
  count = 0;
  for (let i = 255; i >= 0; i--) {
    count += hist[i];
    if (count > clip) {
      maxLum = i;
      break;
    }
  }

  if (maxLum <= minLum) return;

  const range = maxLum - minLum;
  const factor = 255 / range;
  const blend = Math.min(1, strength);

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const orig = data[i + c];
      const stretched = Math.min(255, Math.max(0, (orig - minLum) * factor));
      data[i + c] = Math.round(orig + (stretched - orig) * blend);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Document & Text Clarity Booster:
 * Specifically tuned for IDs, passport scans, receipts, certificates, and handwritten notes.
 * Sharpens dark text while whitening gray backgrounds and boosting contrast.
 */
function applyDocumentClarity(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  strength: number
) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const s = Math.min(1, Math.max(0.2, strength));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = (r * 299 + g * 587 + b * 114) / 1000;

    let newLuma: number;
    if (luma < 128) {
      // Dark text / lines: push darker
      newLuma = Math.max(0, luma - (128 - luma) * s * 0.75);
    } else {
      // Paper background: push whiter and cleaner
      newLuma = Math.min(255, luma + (luma - 128) * s * 0.6);
    }

    const ratio = luma > 0 ? newLuma / luma : 1;
    data[i] = Math.min(255, Math.max(0, Math.round(r * ratio)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round(g * ratio)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round(b * ratio)));
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Edge-preserving 3x3 Denoise Filter:
 * Removes digital grain, compression artifacts, and dust from blurry scans.
 */
function applyDenoise(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas
) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const w = canvas.width;
  const h = canvas.height;
  const src = new Uint8ClampedArray(data);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      for (let c = 0; c < 3; c++) {
        // Collect 3x3 window values
        const vals = [
          src[((y - 1) * w + (x - 1)) * 4 + c],
          src[((y - 1) * w + x) * 4 + c],
          src[((y - 1) * w + (x + 1)) * 4 + c],
          src[(y * w + (x - 1)) * 4 + c],
          src[idx + c],
          src[(y * w + (x + 1)) * 4 + c],
          src[((y + 1) * w + (x - 1)) * 4 + c],
          src[((y + 1) * w + x) * 4 + c],
          src[((y + 1) * w + (x + 1)) * 4 + c],
        ].sort((a, b) => a - b);

        // Median value
        data[idx + c] = vals[4];
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Comprehensive Multi-Mode Clarity Engine.
 * Combines denoising, adaptive contrast, text boosting, and unsharp masking.
 */
function applyClarityPipeline(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  options: {
    strength: number;
    mode?: 'smart' | 'document' | 'photo' | 'custom';
    contrastBoost?: number;
    brightnessAdjust?: number;
    denoise?: boolean;
  }
) {
  const {
    strength,
    mode = 'smart',
    contrastBoost = 0,
    brightnessAdjust = 0,
    denoise = false,
  } = options;

  if (denoise || mode === 'photo') {
    applyDenoise(ctx, canvas);
  }

  if (mode === 'document') {
    applyDocumentClarity(ctx, canvas, strength);
    applySharpen(ctx, canvas, strength * 1.2);
  } else if (mode === 'photo') {
    applyAutoLevels(ctx, canvas, strength * 0.4);
    applySharpen(ctx, canvas, strength * 0.7);
  } else if (mode === 'custom') {
    if (contrastBoost > 0) applyAutoLevels(ctx, canvas, contrastBoost);
    if (strength > 0) applySharpen(ctx, canvas, strength);
  } else {
    // 'smart' mode: balanced auto-contrast + unsharp mask
    applyAutoLevels(ctx, canvas, Math.min(0.6, strength * 0.75));
    applySharpen(ctx, canvas, strength);
  }

  // Apply custom brightness adjust if set
  if (brightnessAdjust !== 0) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const add = brightnessAdjust * 255;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + add));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + add));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + add));
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

/**
 * Helper to convert Blob to Base64 data URL in Web Worker safely.
 */
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 0x8000;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, Math.min(i + chunkSize, len)))
    );
  }
  return btoa(binary);
}

/**
 * Export canvas to clean, valid, scalable SVG container with exact dimensions and viewBox.
 */
async function encodeSvg(
  canvas: OffscreenCanvas,
  width: number,
  height: number
): Promise<Blob> {
  const pngBlob = await canvas.convertToBlob({ type: 'image/png' });
  const b64 = await blobToBase64(pngBlob);
  const dataUri = `data:image/png;base64,${b64}`;

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Converted & Processed by Muhajim | 100% In-Browser In-Memory Engine -->
  <image width="${width}" height="${height}" xlink:href="${dataUri}" href="${dataUri}" preserveAspectRatio="none"/>
</svg>`;

  return new Blob([svgContent], { type: 'image/svg+xml' });
}

/**
 * Export canvas to standard Windows / Web Icon (.ico) format.
 * Encodes standard ICONDIR header + ICONDIRENTRY + PNG image resource.
 */
async function encodeIco(
  canvas: OffscreenCanvas,
  width: number,
  height: number
): Promise<Blob> {
  const pngBlob = await canvas.convertToBlob({ type: 'image/png' });
  const pngBuffer = await pngBlob.arrayBuffer();
  const pngBytes = new Uint8Array(pngBuffer);

  const icoHeaderSize = 6;
  const icoEntrySize = 16;
  const totalSize = icoHeaderSize + icoEntrySize + pngBytes.length;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICONDIR header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type: 1 = ICO
  view.setUint16(4, 1, true); // Count: 1 image

  // ICONDIRENTRY
  const iconW = width >= 256 ? 0 : width;
  const iconH = height >= 256 ? 0 : height;
  view.setUint8(6, iconW);
  view.setUint8(7, iconH);
  view.setUint8(8, 0); // Palette
  view.setUint8(9, 0); // Reserved
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true); // 32 bits per pixel
  view.setUint32(14, pngBytes.length, true); // Resource size
  view.setUint32(18, icoHeaderSize + icoEntrySize, true); // Offset 22

  new Uint8Array(buffer, 22).set(pngBytes);
  return new Blob([buffer], { type: 'image/x-icon' });
}

/**
 * Export canvas to standard PDF-1.4 single-page document.
 * Wraps JPEG stream into standard PDF objects for official printing and government upload.
 */
async function encodePdf(
  canvas: OffscreenCanvas,
  width: number,
  height: number,
  quality: number
): Promise<Blob> {
  const jpegBlob = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality: Math.max(0.85, quality),
  });
  const jpegBuffer = await jpegBlob.arrayBuffer();
  const jpegBytes = new Uint8Array(jpegBuffer);

  // Page dimensions in PDF points (72 points per inch, ~96 dpi default screen)
  const ptW = Math.max(1, Math.round((width / 96) * 72));
  const ptH = Math.max(1, Math.round((height / 96) * 72));

  const header = `%PDF-1.4\n%muhajim\n`;
  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptW} ${ptH}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`;
  const streamContent = `q\n${ptW} 0 0 ${ptH} 0 0 cm\n/Im1 Do\nQ\n`;
  const obj4 = `4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\nendobj\n`;
  const obj5Prefix = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
  const obj5Suffix = `\nendstream\nendobj\n`;

  const enc = new TextEncoder();
  const part1 = enc.encode(header + obj1 + obj2 + obj3 + obj4 + obj5Prefix);
  const partSuffix = enc.encode(obj5Suffix);

  const off1 = header.length;
  const off2 = off1 + obj1.length;
  const off3 = off2 + obj2.length;
  const off4 = off3 + obj3.length;
  const off5 = off4 + obj4.length;
  const offXref = part1.length + jpegBytes.length + partSuffix.length;

  const xref = `xref\n0 6\n0000000000 65535 f \n${String(off1).padStart(10, '0')} 00000 n \n${String(off2).padStart(10, '0')} 00000 n \n${String(off3).padStart(10, '0')} 00000 n \n${String(off4).padStart(10, '0')} 00000 n \n${String(off5).padStart(10, '0')} 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${offXref}\n%%EOF\n`;
  const partXref = enc.encode(xref);

  return new Blob([part1, jpegBytes, partSuffix, partXref], {
    type: 'application/pdf',
  });
}

/**
 * AVIF encoder with graceful WebP fallback if environment does not support AVIF offscreen canvas encoding.
 */
async function encodeAvif(
  canvas: OffscreenCanvas,
  quality: number
): Promise<Blob> {
  try {
    const avifBlob = await canvas.convertToBlob({
      type: 'image/avif',
      quality,
    });
    if (avifBlob && avifBlob.type === 'image/avif') {
      return avifBlob;
    }
  } catch {
    /* fallback */
  }
  return canvas.convertToBlob({ type: 'image/webp', quality });
}

/**
 * Encode raw RGBA pixel data into an uncompressed 24-bit BMP file.
 */
function encodeBmp(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Blob {
  const rowSize = Math.floor((24 * width + 31) / 32) * 4; // padded to 4 bytes
  const pixelArraySize = rowSize * height;
  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const offset = fileHeaderSize + infoHeaderSize;
  const totalSize = offset + pixelArraySize;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // BITMAPFILEHEADER
  view.setUint8(0, 0x42); // 'B'
  view.setUint8(1, 0x4d); // 'M'
  view.setUint32(2, totalSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, offset, true);

  // BITMAPINFOHEADER
  view.setUint32(14, infoHeaderSize, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelArraySize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  const bytes = new Uint8Array(buffer, offset, pixelArraySize);
  for (let y = 0; y < height; y++) {
    const srcRow = y * width * 4;
    const dstRow = (height - 1 - y) * rowSize;
    for (let x = 0; x < width; x++) {
      const s = srcRow + x * 4;
      const d = dstRow + x * 3;
      bytes[d] = data[s + 2]; // B
      bytes[d + 1] = data[s + 1]; // G
      bytes[d + 2] = data[s]; // R
    }
  }

  return new Blob([buffer], { type: 'image/bmp' });
}

async function canvasToBlob(
  canvas: OffscreenCanvas,
  ctx: OffscreenCanvasRenderingContext2D,
  format: OutputFormat,
  quality: number,
  width: number,
  height: number
): Promise<Blob> {
  if (format === 'image/bmp') {
    const imgData = ctx.getImageData(0, 0, width, height);
    return encodeBmp(imgData.data, width, height);
  }
  if (format === 'image/svg+xml') {
    return encodeSvg(canvas, width, height);
  }
  if (format === 'image/x-icon') {
    return encodeIco(canvas, width, height);
  }
  if (format === 'application/pdf') {
    return encodePdf(canvas, width, height, quality);
  }
  if (format === 'image/avif') {
    return encodeAvif(canvas, quality);
  }
  return canvas.convertToBlob({ type: format, quality });
}

self.onmessage = async (e: MessageEvent<WorkerInputMessage>) => {
  const {
    id,
    file,
    targetWidth,
    targetHeight,
    format,
    quality,
    fitMode = 'stretch',
    backgroundColor = '#FFFFFF',
    maxSizeKB,
    enhance,
    enhanceStrength = 0.35,
    enhanceMode = 'smart',
    contrastBoost = 0,
    brightnessAdjust = 0,
    denoise = false,
  } = e.data;

  try {
    const originalSize = file.size;
    let imageBitmap: ImageBitmap;

    // Use EXIF orientation if supported by browser
    try {
      imageBitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      });
    } catch {
      imageBitmap = await createImageBitmap(file);
    }

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const hasAlpha =
      format === 'image/png' ||
      format === 'image/webp' ||
      format === 'image/svg+xml' ||
      format === 'image/x-icon';

    const ctx = canvas.getContext('2d', { alpha: hasAlpha });

    if (!ctx) {
      throw new Error(
        'Failed to obtain 2D rendering context for OffscreenCanvas'
      );
    }

    // High quality scaling settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const needsBackground =
      format === 'image/jpeg' ||
      format === 'application/pdf' ||
      fitMode === 'contain';

    if (needsBackground) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    const srcW = imageBitmap.width;
    const srcH = imageBitmap.height;

    if (fitMode === 'cover') {
      const scale = Math.max(targetWidth / srcW, targetHeight / srcH);
      const renderW = srcW * scale;
      const renderH = srcH * scale;
      const offsetX = (targetWidth - renderW) / 2;
      const offsetY = (targetHeight - renderH) / 2;
      ctx.drawImage(imageBitmap, offsetX, offsetY, renderW, renderH);
    } else if (fitMode === 'contain') {
      const scale = Math.min(targetWidth / srcW, targetHeight / srcH);
      const renderW = srcW * scale;
      const renderH = srcH * scale;
      const offsetX = (targetWidth - renderW) / 2;
      const offsetY = (targetHeight - renderH) / 2;
      ctx.drawImage(imageBitmap, offsetX, offsetY, renderW, renderH);
    } else {
      // Direct stretch
      ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    }

    imageBitmap.close();

    // Apply Clarity & Enhancement Pipeline if enabled
    if (enhance) {
      applyClarityPipeline(ctx, canvas, {
        strength: enhanceStrength,
        mode: enhanceMode,
        contrastBoost,
        brightnessAdjust,
        denoise,
      });
    }

    let currentQuality = quality;
    let blob = await canvasToBlob(
      canvas,
      ctx,
      format,
      currentQuality,
      targetWidth,
      targetHeight
    );

    // Intelligent iterative compression if target max file size is set
    const isLossy =
      format === 'image/jpeg' ||
      format === 'image/webp' ||
      format === 'image/avif' ||
      format === 'application/pdf';

    if (maxSizeKB && blob.size > maxSizeKB * 1024 && isLossy) {
      let low = 0.1;
      let high = currentQuality;
      for (let step = 0; step < 6 && blob.size > maxSizeKB * 1024; step++) {
        currentQuality = Math.max(0.1, (low + high) / 2);
        const candidateBlob = await canvasToBlob(
          canvas,
          ctx,
          format,
          currentQuality,
          targetWidth,
          targetHeight
        );
        blob = candidateBlob;
        if (candidateBlob.size > maxSizeKB * 1024) {
          high = currentQuality;
        } else {
          break;
        }
      }
    }

    const newSize = blob.size;

    self.postMessage({
      id,
      success: true,
      blob,
      originalSize,
      newSize,
      width: targetWidth,
      height: targetHeight,
    } as WorkerOutputMessage);
  } catch (err: any) {
    self.postMessage({
      id,
      success: false,
      originalSize: file.size,
      newSize: 0,
      width: 0,
      height: 0,
      error: err.message || 'Unknown processing error',
    } as WorkerOutputMessage);
  }
};
