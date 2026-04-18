import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPayload } from '@/lib/getPayload';
import { TypeSet } from '@/components/TypeSet';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { formatDate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = false;

export async function generateStaticParams() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'field-notes',
    where: { draft: { equals: false } },
    limit: 1000,
    depth: 0,
  });
  return result.docs.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'field-notes',
    where: { and: [{ slug: { equals: slug } }, { draft: { equals: false } }] },
    limit: 1,
    depth: 0,
  });
  const note = result.docs[0];
  if (!note) return { title: 'Not found' };
  return { title: note.title, description: note.excerpt };
}

export default async function FieldNotePage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'field-notes',
    where: { and: [{ slug: { equals: slug } }, { draft: { equals: false } }] },
    limit: 1,
    depth: 1,
  });
  const note = result.docs[0];
  if (!note) notFound();

  return (
    <article
      style={{ padding: 'var(--space-xl) var(--space-lg) var(--space-lg)', maxWidth: '72ch' }}
    >
      <p className="lbl" style={{ marginBottom: '1.5rem' }}>
        {note.topic}
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(36px, 5vw, 64px)',
          lineHeight: 1.04,
          letterSpacing: '-0.015em',
          marginBottom: '0.5rem',
        }}
      >
        {note.title}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-numeral)',
          fontStyle: 'italic',
          color: 'var(--ink-whisper)',
          fontSize: '14px',
          marginBottom: 'var(--space-md)',
        }}
      >
        {formatDate(note.published)}
        {note.readingTime ? ` — ${note.readingTime} min read` : ''}
      </p>
      <hr className="rule-heavy" style={{ marginBottom: 'var(--space-md)' }} />
      <TypeSet>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <RichText data={note.body as any} />
      </TypeSet>
    </article>
  );
}
