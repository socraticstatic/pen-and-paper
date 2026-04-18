import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPayload } from '@/lib/getPayload';
import { Tombstone } from '@/components/specimen/Tombstone';
import { SpecimenEssay } from '@/components/specimen/SpecimenEssay';
import { FigureGrid } from '@/components/specimen/FigureGrid';
import { PairingFooter } from '@/components/specimen/PairingFooter';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = false;

export async function generateStaticParams() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'specimens',
    where: { draft: { equals: false } },
    limit: 1000,
    depth: 0,
  });
  return result.docs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'specimens',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const specimen = result.docs[0];
  if (!specimen) return { title: 'Not found' };
  return {
    title: `Specimen ${String(specimen.specimenNumber).padStart(3, '0')} — ${specimen.title}`,
    description: specimen.subtitle ?? undefined,
  };
}

export default async function SpecimenPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'specimens',
    where: { and: [{ slug: { equals: slug } }, { draft: { equals: false } }] },
    limit: 1,
    depth: 2,
  });
  const specimen = result.docs[0];
  if (!specimen) notFound();

  const pen = typeof specimen.pen === 'object' && specimen.pen !== null ? specimen.pen : null;
  const paper =
    typeof specimen.paper === 'object' && specimen.paper !== null ? specimen.paper : null;

  return (
    <div className="specimen-wrap">
      <Tombstone specimen={specimen} />
      <div>
        <SpecimenEssay title={specimen.title} subtitle={specimen.subtitle} essay={specimen.essay} />
        <FigureGrid figures={specimen.figures ?? []} />
        <PairingFooter
          pairingRationale={specimen.pairingRationale ?? null}
          affiliateOverrides={specimen.affiliateOverrides}
          pen={pen}
          paper={paper}
        />
      </div>
    </div>
  );
}
