import type { Specimen, Media } from '@/payload-types';
import { FigurePlate } from './FigurePlate';

type SpecimenFigure = NonNullable<Specimen['figures']>[number];

interface FigureGridProps {
  figures: SpecimenFigure[];
}

export function FigureGrid({ figures }: FigureGridProps) {
  if (figures.length === 0) return null;

  return (
    <div className="figure-grid" aria-label="Specimen figures">
      {figures.map((fig, i) => {
        const media = typeof fig.src === 'object' ? (fig.src as Media) : null;
        if (!media) return null;
        return (
          <div key={fig.id ?? i} className={fig.layout === 'wide' ? 'fig-wide' : undefined}>
            <FigurePlate
              src={media}
              alt={fig.alt}
              caption={fig.caption}
              figureNumber={i + 1}
              layout={fig.layout ?? 'square'}
            />
          </div>
        );
      })}
    </div>
  );
}
