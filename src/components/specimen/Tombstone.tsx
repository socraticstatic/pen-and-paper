import type { Specimen } from '@/payload-types';
import { formatDate } from '@/lib/format';
import { stageLabel, romanNumeral } from '@/lib/stages';

interface TombstoneProps {
  specimen: Specimen;
}

export function Tombstone({ specimen }: TombstoneProps) {
  const pen = typeof specimen.pen === 'object' && specimen.pen !== null ? specimen.pen : null;
  const paper =
    typeof specimen.paper === 'object' && specimen.paper !== null ? specimen.paper : null;

  const rows = [
    pen ? { key: 'Pen', value: `${pen.make} ${pen.model}` } : null,
    paper ? { key: 'Paper', value: `${paper.mill} ${paper.line}` } : null,
    specimen.ink?.maker
      ? {
          key: 'Ink',
          value: `${specimen.ink.maker} ${specimen.ink.color ?? ''}`.trim(),
        }
      : null,
    specimen.acquired ? { key: 'Acquired', value: formatDate(specimen.acquired) } : null,
    { key: 'Stage', value: `${romanNumeral(specimen.stage)} — ${stageLabel(specimen.stage)}` },
    specimen.readingTime ? { key: 'Read', value: `${specimen.readingTime} min` } : null,
  ].filter(Boolean) as { key: string; value: string }[];

  return (
    <aside aria-label="Specimen details" className="tombstone">
      <div className="spec-num">{String(specimen.specimenNumber).padStart(3, '0')}</div>
      {rows.map(({ key, value }) => (
        <dl key={key} className="tcell">
          <dt className="t-key">{key}</dt>
          <dd className="t-val">{value}</dd>
        </dl>
      ))}
    </aside>
  );
}
