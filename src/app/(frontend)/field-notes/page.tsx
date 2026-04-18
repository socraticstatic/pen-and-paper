import type { Metadata } from 'next';
import { getPayload } from '@/lib/getPayload';
import { FieldNoteCard } from '@/components/field-notes/FieldNoteCard';

export const metadata: Metadata = { title: 'Field Notes' };
export const revalidate = false;

export default async function FieldNotesPage() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'field-notes',
    where: { draft: { equals: false } },
    sort: '-published',
    limit: 100,
    depth: 0,
  });

  return (
    <div style={{ padding: 'var(--space-xl) var(--pad-x) var(--space-lg)' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(48px, 7vw, 88px)',
          lineHeight: 1,
          letterSpacing: '-0.018em',
          marginBottom: 'var(--space-lg)',
        }}
      >
        Field Notes
      </h1>
      <hr className="rule-heavy" />
      {result.docs.length === 0 ? (
        <p
          style={{
            padding: 'var(--space-md) 0',
            fontFamily: 'var(--font-numeral)',
            fontStyle: 'italic',
            color: 'var(--ink-whisper)',
          }}
        >
          No field notes yet.
        </p>
      ) : (
        <ul>
          {result.docs.map((note) => (
            <li key={note.id}>
              <FieldNoteCard note={note} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
