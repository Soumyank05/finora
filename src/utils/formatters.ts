/**
 * Utility functions for Indian currency (INR) and financial formatting.
 * Follows the Indian numbering system: Crores, Lakhs, Thousands.
 */

export function formatINR(value: number, options: { compact?: boolean; showSymbol?: boolean } = {}): string {
  const { compact = false, showSymbol = true } = options;
  if (value === undefined || value === null || isNaN(value)) {
    return showSymbol ? '₹0' : '0';
  }

  const prefix = showSymbol ? '₹' : '';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (compact) {
    if (absValue >= 10000000) {
      const cr = (absValue / 10000000).toFixed(2);
      return `${sign}${prefix}${cr} Cr`;
    }
    if (absValue >= 100000) {
      const l = (absValue / 100000).toFixed(2);
      return `${sign}${prefix}${l} L`;
    }
    if (absValue >= 1000) {
      const k = (absValue / 1000).toFixed(1);
      return `${sign}${prefix}${k}k`;
    }
    return `${sign}${prefix}${absValue.toLocaleString('en-IN')}`;
  }

  return `${sign}${prefix}${Math.round(absValue).toLocaleString('en-IN')}`;
}

export function formatPercentage(value: number, includeSign: boolean = true): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatNumberIndian(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toLocaleString('en-IN');
}
