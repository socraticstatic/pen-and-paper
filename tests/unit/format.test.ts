import { describe, expect, it } from 'vitest';
import { formatDate, formatDateShort, estimateReadingTime } from '@/lib/format';

describe('formatDate', () => {
  it('formats a date string as "Month D, YYYY"', () => {
    expect(formatDate('2024-03-15')).toBe('March 15, 2024');
  });

  it('formats a date string in various formats', () => {
    expect(formatDate('2025-01-07')).toBe('January 7, 2025');
  });
});

describe('formatDateShort', () => {
  it('formats a date as "Mon YYYY"', () => {
    expect(formatDateShort('2024-11-02')).toBe('Nov 2024');
  });
});

describe('estimateReadingTime', () => {
  it('returns 1 for fewer than 200 words', () => {
    const text = 'word '.repeat(100);
    expect(estimateReadingTime(text)).toBe(1);
  });

  it('returns 5 for ~1000 words', () => {
    const text = 'word '.repeat(1000);
    expect(estimateReadingTime(text)).toBe(5);
  });

  it('rounds up partial minutes', () => {
    // 250 words at 200wpm = 1.25 min → 2
    const text = 'word '.repeat(250);
    expect(estimateReadingTime(text)).toBe(2);
  });
});
