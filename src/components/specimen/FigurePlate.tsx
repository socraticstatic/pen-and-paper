import Image from 'next/image';
import type { Media } from '@/payload-types';

interface FigurePlateProps {
  src: Media;
  alt: string;
  caption?: string | null;
  figureNumber?: number;
  layout?: 'square' | 'wide' | 'portrait';
}

export function FigurePlate({
  src,
  alt,
  caption,
  figureNumber,
  layout = 'square',
}: FigurePlateProps) {
  const aspectMap = { square: '1 / 1', wide: '16 / 9', portrait: '2 / 3' };

  return (
    <figure>
      {src.url ? (
        <Image
          src={src.url}
          alt={alt}
          width={src.width ?? 800}
          height={src.height ?? 800}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: aspectMap[layout],
            objectFit: 'cover',
          }}
        />
      ) : (
        <div className={`fig-placeholder ${layout}`} aria-label={alt} role="img" />
      )}
      {(caption != null || figureNumber != null) && (
        <figcaption className="fig-caption">
          {figureNumber != null && `Fig. ${figureNumber} — `}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
