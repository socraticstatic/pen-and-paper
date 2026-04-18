import { describe, expect, it } from 'vitest';
import { STAGES, stageLabel, romanNumeral, stageFromSlug } from '@/lib/stages';

describe('STAGES', () => {
  it('has exactly 4 stages', () => {
    expect(STAGES).toHaveLength(4);
  });

  it('has slug, label, romanNumeral, description on each', () => {
    for (const s of STAGES) {
      expect(typeof s.slug).toBe('string');
      expect(typeof s.label).toBe('string');
      expect(typeof s.romanNumeral).toBe('string');
      expect(typeof s.description).toBe('string');
    }
  });
});

describe('stageLabel', () => {
  it('returns the label for a valid slug', () => {
    expect(stageLabel('first-pen')).toBe('First Pen');
    expect(stageLabel('curious')).toBe('Curious');
    expect(stageLabel('collector')).toBe('Collector');
    expect(stageLabel('savant')).toBe('Savant');
  });

  it('returns the slug itself when not found', () => {
    expect(stageLabel('unknown')).toBe('unknown');
  });
});

describe('romanNumeral', () => {
  it('returns I II III IV for the four stages', () => {
    expect(romanNumeral('first-pen')).toBe('I');
    expect(romanNumeral('curious')).toBe('II');
    expect(romanNumeral('collector')).toBe('III');
    expect(romanNumeral('savant')).toBe('IV');
  });
});

describe('stageFromSlug', () => {
  it('returns the stage object for a valid slug', () => {
    const s = stageFromSlug('collector');
    expect(s?.slug).toBe('collector');
    expect(s?.romanNumeral).toBe('III');
  });

  it('returns undefined for an unknown slug', () => {
    expect(stageFromSlug('unknown')).toBeUndefined();
  });
});
