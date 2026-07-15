/**
 * Formats an ISO date as an Arabic long date with Latin digits.
 *
 * Angular's `ar` locale would render Arabic-Indic digits (٠١٢٣); we force `latn` so
 * dates read consistently alongside phone numbers and opening hours.
 */
export function formatArabicDate(iso: string | null): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: 'long',
    numberingSystem: 'latn',
  }).format(date);
}
