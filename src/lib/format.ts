const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const DATE_SHORT_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function toDate(value: string | Date): Date {
  return typeof value === 'string' ? new Date(value) : value;
}

export function formatDate(value: string | Date): string {
  return DATE_FORMAT.format(toDate(value));
}

export function formatDateShort(value: string | Date): string {
  return DATE_SHORT_FORMAT.format(toDate(value));
}

const WORDS_PER_MINUTE = 200;

export function estimateReadingTime(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  const words = trimmed.split(/\s+/).length;
  return Math.ceil(words / WORDS_PER_MINUTE);
}
