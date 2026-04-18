import { RichText } from '@payloadcms/richtext-lexical/react';
import { TypeSet } from '@/components/TypeSet';
import type { Specimen } from '@/payload-types';

interface SpecimenEssayProps {
  title: string;
  subtitle?: string | null;
  essay: Specimen['essay'];
}

export function SpecimenEssay({ title, subtitle, essay }: SpecimenEssayProps) {
  return (
    <article className="specimen-essay">
      <h1 className="essay-title">{title}</h1>
      {subtitle && <p className="essay-subtitle">{subtitle}</p>}
      <TypeSet>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <RichText data={essay as any} />
      </TypeSet>
    </article>
  );
}
