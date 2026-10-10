export type OutputFormat =
  | 'image/webp'
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/avif'
  | 'image/x-icon'
  | 'application/pdf'
  | 'image/bmp';

export const SUPPORTED_INPUT_MIME = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/avif',
  'image/svg+xml',
];

export const INPUT_ACCEPT =
  'image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif,.svg';

/** Default output format that mirrors the uploaded image's own format. */
export function defaultFormatForFile(file: File): OutputFormat {
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();

  if (type === 'image/png' || name.endsWith('.png')) return 'image/png';
  if (type === 'image/jpeg' || type === 'image/jpg' || /\.jpe?g$/.test(name))
    return 'image/jpeg';
  if (type === 'image/webp' || name.endsWith('.webp')) return 'image/webp';
  if (type === 'image/svg+xml' || name.endsWith('.svg')) return 'image/svg+xml';
  if (type === 'image/avif' || name.endsWith('.avif')) return 'image/avif';
  if (type === 'image/x-icon' || name.endsWith('.ico')) return 'image/x-icon';
  if (type === 'image/bmp' || name.endsWith('.bmp')) return 'image/bmp';
  return 'image/webp';
}

export const FORMAT_EXTENSION: Record<OutputFormat, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
  'image/x-icon': 'ico',
  'application/pdf': 'pdf',
  'image/bmp': 'bmp',
};

export function formatExtension(format: OutputFormat): string {
  return FORMAT_EXTENSION[format] || 'webp';
}

export function isSvgFile(file: File): boolean {
  return (
    (file.type || '').toLowerCase() === 'image/svg+xml' ||
    file.name.toLowerCase().endsWith('.svg')
  );
}

