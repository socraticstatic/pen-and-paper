import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPayload } from '@/lib/getPayload';
import { stageFromSlug, STAGES } from '@/lib/stages';
import { formatDate } from '@/lib/format';

type Props = { params: Promise<{ stage: string }> };

export const revalidate = false;

export async function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stage } = await params;
  const s = stageFromSlug(stage);
  if (!s) return { title: 'Not found' };
  return {
    title: `Stage ${s.romanNumeral} — ${s.label}`,
    description: s.description,
  };
}

export default async function StagePage({ params }: Props) {
  const { stage } = await params;
  const stageData = stageFromSlug(stage);
  if (!stageData) notFound();

  const payload = await getPayload();
  const result = await payload.find({
    collection: 'specimens',
    where: { and: [{ stage: { equals: stage } }, { draft: { equals: false } }] },
    sort: '-specimenNumber',
    limit: 100,
    depth: 2,
  });

  const specimens = result.docs;

  return (
    <div style={{ padding: 'var(--space-xl) var(--space-lg) var(--space-lg)' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p className="lbl lbl-accent">Stage {stageData.romanNumeral}</p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(48px, 7vw, 96px)',
            lineHeight: 1,
            letterSpacing: '-0.018em',
            margin: '0.25rem 0 1.5rem',
          }}
        >
          {stageData.label}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-numeral)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 1.5vw, 22px)',
            color: 'var(--ink-whisper)',
            maxWidth: '38ch',
            lineHeight: 1.45,
          }}
        >
          {stageData.description}
        </p>
      </div>
      <hr className="rule-heavy" />
      {specimens.length === 0 ? (
        <p
          style={{
            padding: 'var(--space-md) 0',
            fontFamily: 'var(--font-numeral)',
            fontStyle: 'italic',
            color: 'var(--ink-whisper)',
          }}
        >
          No specimens catalogued in this stage yet.
        </p>
      ) : (
        <ul>
          {specimens.map((specimen) => {
            const pen =
              typeof specimen.pen === 'object' && specimen.pen !== null ? specimen.pen : null;
            const paper =
              typeof specimen.paper === 'object' && specimen.paper !== null ? specimen.paper : null;
            return (
              <li key={specimen.id}>
                <Link href={`/catalogue/${specimen.slug}`} className="chron-row">
                  <span className="c-num">{String(specimen.specimenNumber).padStart(3, '0')}</span>
                  <span className="c-title">{specimen.title}</span>
                  <span className="c-pair">
                    {pen ? `${pen.make} ${pen.model}` : '—'}
                    {paper ? ` on ${paper.mill} ${paper.line}` : ''}
                  </span>
                  <span className="c-meta">
                    {specimen.acquired && formatDate(specimen.acquired)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
