import Link from 'next/link';
import { STAGES } from '@/lib/stages';

interface StageCount {
  slug: string;
  count: number;
}

interface StageIndexProps {
  counts?: StageCount[];
  activeStage?: string;
}

export function StageIndex({ counts = [], activeStage }: StageIndexProps) {
  const getCount = (slug: string) => counts.find((c) => c.slug === slug)?.count ?? 0;

  return (
    <section aria-labelledby="stages-heading" className="stages">
      <h2 id="stages-heading" className="lbl" style={{ margin: 0 }}>
        Stages
      </h2>
      <ul className="stage-list">
        {STAGES.map((stage) => (
          <li key={stage.slug}>
            <Link
              href={`/stages/${stage.slug}`}
              className="stage-card"
              data-active={activeStage === stage.slug ? 'true' : undefined}
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div className="s-num">{stage.romanNumeral}</div>
              <div className="s-name">{stage.label}</div>
              <p className="s-desc">{stage.description}</p>
              <div className="s-count">
                {getCount(stage.slug)} specimen{getCount(stage.slug) !== 1 ? 's' : ''}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
