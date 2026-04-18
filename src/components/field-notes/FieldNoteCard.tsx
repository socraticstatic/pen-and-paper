import Link from 'next/link';
import type { FieldNote } from '@/payload-types';
import { formatDate } from '@/lib/format';

interface FieldNoteCardProps {
  note: FieldNote;
}

export function FieldNoteCard({ note }: FieldNoteCardProps) {
  return (
    <Link href={`/field-notes/${note.slug}`} className="fn-card">
      <span className="fn-date">{formatDate(note.published)}</span>
      <div>
        <h2 className="fn-title">{note.title}</h2>
        <p className="fn-excerpt">{note.excerpt}</p>
      </div>
    </Link>
  );
}
