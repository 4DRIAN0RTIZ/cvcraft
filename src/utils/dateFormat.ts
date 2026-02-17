import type { DateFormat } from '../types/cv';

const MONTHS_SHORT: Record<string, string[]> = {
  es: ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

const MONTHS_LONG: Record<string, string[]> = {
  es: ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  en: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const PRESENT: Record<string, string> = {
  es: 'Actualidad',
  en: 'Present',
};

// Format a single date point
export function formatDate(
  format: DateFormat,
  month?: number,
  year?: number,
  fallback?: string,
  lang: string = 'es',
): string {
  if (format === 'raw' || (!month && !year)) return fallback || '';

  const l = lang.startsWith('en') ? 'en' : 'es';
  const y = year ? String(year) : '';

  if (!month) return y;

  switch (format) {
    case 'short':
      return `${MONTHS_SHORT[l][month]} ${y}`.trim();
    case 'long':
      return `${MONTHS_LONG[l][month]} ${y}`.trim();
    case 'numeric':
      return `${String(month).padStart(2, '0')}/${y}`;
    default:
      return fallback || '';
  }
}

// Format a date range (start - end)
export function formatDateRange(
  format: DateFormat,
  start: { month?: number; year?: number },
  end: { month?: number; year?: number },
  isCurrent?: boolean,
  fallback?: string,
  lang: string = 'es',
): string {
  if (format === 'raw') return fallback || '';

  const l = lang.startsWith('en') ? 'en' : 'es';
  const startStr = formatDate(format, start.month, start.year, '', lang);
  const endStr = isCurrent ? PRESENT[l] : formatDate(format, end.month, end.year, '', lang);

  if (!startStr && !endStr) return fallback || '';
  if (!endStr) return startStr;
  if (!startStr) return endStr;

  return `${startStr} - ${endStr}`;
}
