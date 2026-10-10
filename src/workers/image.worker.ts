// Web Worker for 100% In-Browser Image Scaling & Compression

export interface WorkerInputMessage {
  id: string;
  file: File;
  targetWidth: number;
  targetHeight: number;
  format: 'image/webp' | 'image/jpeg' | 'image/png';
  quality: number; // 0.1 to 1.0
  fitMode?: 'stretch' | 'contain' | 'cover';
  backgroundColor?: string;
  maxSizeKB?: number; // Target max file size (e.g. 100 for < 100KB passport documents)
  enhance?: boolean;
  enhanceStrength?: number;
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
    enhanceStrength,
  } = e.data;

  try {
    const originalSize = file.size;
    let imageBitmap: ImageBitmap;

    // Use EXIF orientation if supported by browser
    try {
      imageBitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      imageBitmap = await createImageBitmap(file);
    }

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d', { alpha: format !== 'image/jpeg' });

    if (!ctx) {
      throw new Error('Failed to obtain 2D rendering context for OffscreenCanvas');
    }

    // High quality scaling settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (format === 'image/jpeg' || (fitMode === 'contain' && backgroundColor)) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    const srcW = imageBitmap.width;
    const srcH = imageBitmap.height;

    if (fitMode === 'cover') {
      // Scale and center crop
      const scale = Math.max(targetWidth / srcW, targetHeight / srcH);
      const renderW = srcW * scale;
      const renderH = srcH * scale;
      const offsetX = (targetWidth - renderW) / 2;
      const offsetY = (targetHeight - renderH) / 2;
          ctx.drawImage(imageBitmap, offsetX, offsetY, renderW, renderH);
    // Apply light enhancement if requested
    if (enhance && (enhanceStrength ?? 0.3) > 0) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const strength = enhanceStrength ?? 0.3;
      const w = canvas.width, h = canvas.height;
      // Simple unsharp mask: 3x3
      const kernel = [0, -strength/4, 0, -strength/4, 1+strength, -strength/4, 0, -strength/4, 0];
      const weights = kernel;
      const side = 3;
      const half = Math.floor(side/2);
      const src = new Uint8ClampedArray(data);
      for (let y=half; y<h-half; y++) {
        for (let x=half; x<w-half; x++) {
          let r=0,g=0,b=0,a=data[(y*w+x)*4+3];
          for (let ky=0; ky<side; ky++) {
            for (let kx=0; kx<side; kx++) {
              const idx = ((y+ky-half)*w + (x+kx-half))*4;
              const wgt = weights[ky*side+kx];
              r += src[idx]*wgt; g += src[idx+1]*wgt; b += src[idx+2]*wgt;
            }
          }
          const didx = (y*w+x)*4;
          data[didx]=Math.min(255,Math.max(0,r)); data[didx+1]=Math.min(255,Math.max(0,g)); data[didx+2]=Math.min(255,Math.max(0,b)); data[didx+3]=a;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    } else if (fitMode === 'contain') {
      // Scale and letterbox inside canvas
      const scale = Math.min(targetWidth / srcW, targetHeight / srcH);
      const renderW = srcW * scale;
      const renderH = srcH * scale;
      const offsetX = (targetWidth - renderW) / 2;
      const offsetY = (targetHeight - renderH) / 2;
          ctx.drawImage(imageBitmap, offsetX, offsetY, renderW, renderH);
    // Apply light enhancement if requested
    if (enhance && (enhanceStrength ?? 0.3) > 0) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const strength = enhanceStrength ?? 0.3;
      const w = canvas.width, h = canvas.height;
      // Simple unsharp mask: 3x3
      const kernel = [0, -strength/4, 0, -strength/4, 1+strength, -strength/4, 0, -strength/4, 0];
      const weights = kernel;
      const side = 3;
      const half = Math.floor(side/2);
      const src = new Uint8ClampedArray(data);
      for (let y=half; y<h-half; y++) {
        for (let x=half; x<w-half; x++) {
          let r=0,g=0,b=0,a=data[(y*w+x)*4+3];
          for (let ky=0; ky<side; ky++) {
            for (let kx=0; kx<side; kx++) {
              const idx = ((y+ky-half)*w + (x+kx-half))*4;
              const wgt = weights[ky*side+kx];
              r += src[idx]*wgt; g += src[idx+1]*wgt; b += src[idx+2]*wgt;
            }
          }
          const didx = (y*w+x)*4;
          data[didx]=Math.min(255,Math.max(0,r)); data[didx+1]=Math.min(255,Math.max(0,g)); data[didx+2]=Math.min(255,Math.max(0,b)); data[didx+3]=a;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    } else {
      // Direct stretch
      ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    }

    imageBitmap.close();

    let currentQuality = quality;
    let blob = await canvas.convertToBlob({
      type: format,
      quality: currentQuality,
    });

    // Intelligent iterative compression if target max file size is set
    if (maxSizeKB && blob.size > maxSizeKB * 1024 && format !== 'image/png') {
      let low = 0.1;
      let high = currentQuality;
      for (let step = 0; step < 4 && blob.size > maxSizeKB * 1024; step++) {
        currentQuality = Math.max(0.1, (low + high) / 2);
        const candidateBlob = await canvas.convertToBlob({
          type: format,
          quality: currentQuality,
        });
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
