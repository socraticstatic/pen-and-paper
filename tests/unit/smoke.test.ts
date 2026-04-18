import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('runs a trivial assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('has jsdom globals', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });
});
