import Link from 'next/link';
import type { Specimen } from '@/payload-types';
import { formatDate } from '@/lib/format';
import { stageLabel, romanNumeral } from '@/lib/stages';

interface ChronologyProps {
  specimens: Specimen[];
}

export function Chronology({ specimens }: ChronologyProps) {
  return (
    <section aria-labelledby="chronology-heading" className="chronology">
      <div className="chron-head">
        <h2 id="chronology-heading">Recent entries</h2>
        <hr className="rule" style={{ alignSelf: 'center' }} />
        <span className="note">Numbered in order of acquisition.</span>
      </div>
      {specimens.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-numeral)',
            fontStyle: 'italic',
            color: 'var(--ink-whisper)',
          }}
        >
          No specimens catalogued yet.
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
                    <span className="stage-tag">
                      {romanNumeral(specimen.stage)} {stageLabel(specimen.stage)}
                    </span>
                    {specimen.acquired && formatDate(specimen.acquired)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
