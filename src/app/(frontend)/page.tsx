import { getPayload } from '@/lib/getPayload';
import { SpecimenHero } from '@/components/catalogue/SpecimenHero';
import { StageIndex } from '@/components/catalogue/StageIndex';
import { Chronology } from '@/components/catalogue/Chronology';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pen & Paper',
};

export const revalidate = false;

export default async function HomePage() {
  const payload = await getPayload();

  const [heroResult, chronoResult] = await Promise.all([
    payload.find({
      collection: 'specimens',
      where: { draft: { equals: false } },
      sort: '-specimenNumber',
      limit: 1,
      depth: 2,
    }),
    payload.find({
      collection: 'specimens',
      where: { draft: { equals: false } },
      sort: '-specimenNumber',
      limit: 5,
      depth: 2,
    }),
  ]);

  const heroSpecimen = heroResult.docs[0];
  const recentSpecimens = chronoResult.docs;

  const stageCounts = await Promise.all(
    ['first-pen', 'curious', 'collector', 'savant'].map(async (slug) => {
      const r = await payload.find({
        collection: 'specimens',
        where: { and: [{ draft: { equals: false } }, { stage: { equals: slug } }] },
        limit: 0,
      });
      return { slug, count: r.totalDocs };
    }),
  );

  return (
    <>
      {heroSpecimen ? (
        <SpecimenHero specimen={heroSpecimen} />
      ) : (
        <div style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
          <p
            style={{
              fontFamily: 'var(--font-numeral)',
              fontStyle: 'italic',
              color: 'var(--ink-whisper)',
            }}
          >
            Forthcoming.
          </p>
        </div>
      )}
      <StageIndex counts={stageCounts} />
      <Chronology specimens={recentSpecimens} />
    </>
  );
}
