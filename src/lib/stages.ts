export type StageSlug = 'first-pen' | 'curious' | 'collector' | 'savant';

export interface Stage {
  slug: StageSlug;
  label: string;
  romanNumeral: string;
  description: string;
}

export const STAGES: Stage[] = [
  {
    slug: 'first-pen',
    label: 'First Pen',
    romanNumeral: 'I',
    description:
      'The pen that started it. Chosen on instinct, loved despite knowing almost nothing.',
  },
  {
    slug: 'curious',
    label: 'Curious',
    romanNumeral: 'II',
    description:
      "You've written a few thousand words. Now you want to know why some pens feel different.",
  },
  {
    slug: 'collector',
    label: 'Collector',
    romanNumeral: 'III',
    description: "The pen drawer has grown. You're choosing ink for paper, paper for nib.",
  },
  {
    slug: 'savant',
    label: 'Savant',
    romanNumeral: 'IV',
    description: 'You grind your own nibs. You know what 52 gsm feels like at 3 AM.',
  },
];

export function stageFromSlug(slug: string): Stage | undefined {
  return STAGES.find((s) => s.slug === slug);
}

export function stageLabel(slug: string): string {
  return stageFromSlug(slug)?.label ?? slug;
}

export function romanNumeral(slug: string): string {
  return stageFromSlug(slug)?.romanNumeral ?? '';
}
