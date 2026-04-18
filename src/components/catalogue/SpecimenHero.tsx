import Link from 'next/link';
import Image from 'next/image';
import type { Specimen } from '@/payload-types';
import { formatDate } from '@/lib/format';
import { stageLabel, romanNumeral } from '@/lib/stages';

interface SpecimenHeroProps {
  specimen: Specimen;
}

export function SpecimenHero({ specimen }: SpecimenHeroProps) {
  const pen = typeof specimen.pen === 'object' && specimen.pen !== null ? specimen.pen : null;
  const paper =
    typeof specimen.paper === 'object' && specimen.paper !== null ? specimen.paper : null;
  const heroFigure = specimen.figures?.[0];
  const heroMedia = heroFigure && typeof heroFigure.src === 'object' ? heroFigure.src : null;

  return (
    <section aria-labelledby="hero-title">
      <div className="section-intro lbl">
        <span>Current specimen</span>
        <span />
        <span className="folio numeral-italic">{stageLabel(specimen.stage)}</span>
      </div>
      <hr className="rule" />
      <div className="hero">
        <div className="hero-type">
          <div
            className="hero-eyebrow"
            style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}
          >
            <span className="lbl lbl-accent">Specimen</span>
            <span
              className="numeral-italic"
              style={{ fontSize: '14px', color: 'var(--ink-whisper)' }}
            >
              {romanNumeral(specimen.stage)}
            </span>
          </div>
          <div className="hero-number">{String(specimen.specimenNumber).padStart(3, '0')}</div>
          <h1 className="hero-title" id="hero-title">
            {specimen.title}
          </h1>
          {specimen.subtitle && <p className="hero-lede">{specimen.subtitle}</p>}
          <div className="hero-meta">
            {pen && (
              <div className="meta-cell">
                <span className="k">Pen</span>
                <span className="v">
                  {pen.make} {pen.model}
                </span>
              </div>
            )}
            {paper && (
              <div className="meta-cell">
                <span className="k">Paper</span>
                <span className="v">
                  {paper.mill} {paper.line}
                </span>
              </div>
            )}
            {specimen.ink?.maker && (
              <div className="meta-cell">
                <span className="k">Ink</span>
                <span className="v">
                  {specimen.ink.maker} {specimen.ink.color}
                </span>
              </div>
            )}
            {specimen.acquired && (
              <div className="meta-cell">
                <span className="k">Acquired</span>
                <span className="v">{formatDate(specimen.acquired)}</span>
              </div>
            )}
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <Link href={`/catalogue/${specimen.slug}`} className="lbl lbl-accent">
              Read the entry →
            </Link>
          </div>
        </div>
        <div className="hero-figure">
          {heroMedia && typeof heroMedia === 'object' && heroMedia.url ? (
            <Image
              src={heroMedia.url}
              alt={heroFigure?.alt ?? specimen.title}
              width={heroMedia.width ?? 600}
              height={heroMedia.height ?? 800}
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          ) : (
            <div className="hero-figure-placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
      <p
        style={{
          padding: '0 var(--space-lg) var(--space-md)',
          fontFamily: 'var(--font-numeral)',
          fontStyle: 'italic',
          fontSize: '14px',
          color: 'var(--ink-whisper)',
        }}
      >
        New to pens?{' '}
        <a href="/quiz" style={{ color: 'var(--ink-accent)' }}>
          Begin with the quiz.
        </a>
      </p>
    </section>
  );
}
