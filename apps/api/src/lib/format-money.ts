/**
 * Backend currency formatter — mirrors the frontend helper.
 * Use this anywhere we render money server-side (PDF templates, emails, exports).
 */

export type CurrencyCode = 'INR' | 'USD' | 'SGD' | 'MYR';

interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  locale: string;
}

const META: Record<CurrencyCode, CurrencyMeta> = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  SGD: { code: 'SGD', symbol: 'S$', locale: 'en-SG' },
  MYR: { code: 'MYR', symbol: 'RM', locale: 'en-MY' },
};

export function getCurrencyMeta(code?: string | null): CurrencyMeta {
  if (code && (code as CurrencyCode) in META) return META[code as CurrencyCode];
  return META.INR;
}

export function formatMoney(n: number | null | undefined, currency: string = 'INR'): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0;
  const m = getCurrencyMeta(currency);
  return new Intl.NumberFormat(m.locale, {
    style: 'currency',
    currency: m.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getCurrencySymbol(currency?: string | null): string {
  return getCurrencyMeta(currency).symbol;
}
