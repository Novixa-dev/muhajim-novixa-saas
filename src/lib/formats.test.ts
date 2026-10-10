import { describe, it, expect } from 'vitest';
import {
  defaultFormatForFile,
  formatExtension,
  isSvgFile,
  SUPPORTED_INPUT_MIME,
} from './formats';

describe('Format Utility Functions', () => {
  it('correctly maps all output formats to file extensions', () => {
    expect(formatExtension('image/webp')).toBe('webp');
    expect(formatExtension('image/jpeg')).toBe('jpg');
    expect(formatExtension('image/png')).toBe('png');
    expect(formatExtension('image/svg+xml')).toBe('svg');
    expect(formatExtension('image/avif')).toBe('avif');
    expect(formatExtension('image/x-icon')).toBe('ico');
    expect(formatExtension('application/pdf')).toBe('pdf');
    expect(formatExtension('image/bmp')).toBe('bmp');
  });

  it('detects SVG files by mime and extension', () => {
    const svgFileMime = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' });
    const svgFileName = new File(['<svg></svg>'], 'logo.SVG');
    const pngFile = new File(['123'], 'photo.png', { type: 'image/png' });

    expect(isSvgFile(svgFileMime)).toBe(true);
    expect(isSvgFile(svgFileName)).toBe(true);
    expect(isSvgFile(pngFile)).toBe(false);
  });

  it('picks appropriate default format matching the file', () => {
    const png = new File([''], 'test.png', { type: 'image/png' });
    const jpg = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    const webp = new File([''], 'asset.webp', { type: 'image/webp' });
    const svg = new File([''], 'vector.svg', { type: 'image/svg+xml' });
    const avif = new File([''], 'modern.avif', { type: 'image/avif' });
    const ico = new File([''], 'icon.ico', { type: 'image/x-icon' });

    expect(defaultFormatForFile(png)).toBe('image/png');
    expect(defaultFormatForFile(jpg)).toBe('image/jpeg');
    expect(defaultFormatForFile(webp)).toBe('image/webp');
    expect(defaultFormatForFile(svg)).toBe('image/svg+xml');
    expect(defaultFormatForFile(avif)).toBe('image/avif');
    expect(defaultFormatForFile(ico)).toBe('image/x-icon');
  });

  it('includes all necessary input formats in SUPPORTED_INPUT_MIME', () => {
    expect(SUPPORTED_INPUT_MIME).toContain('image/jpeg');
    expect(SUPPORTED_INPUT_MIME).toContain('image/png');
    expect(SUPPORTED_INPUT_MIME).toContain('image/webp');
    expect(SUPPORTED_INPUT_MIME).toContain('image/svg+xml');
    expect(SUPPORTED_INPUT_MIME).toContain('image/avif');
  });
});
