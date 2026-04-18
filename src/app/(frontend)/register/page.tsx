import type { Metadata } from 'next';
import { getPayload } from '@/lib/getPayload';
import type { Pen, Paper } from '@/payload-types';

export const metadata: Metadata = { title: 'The Register — Pen & Paper' };
export const revalidate = false;

export default async function RegisterPage() {
  const payload = await getPayload();

  const [pensResult, papersResult] = await Promise.all([
    payload.find({
      collection: 'pens',
      where: { draft: { equals: false } },
      sort: 'make',
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'papers',
      where: { draft: { equals: false } },
      sort: 'mill',
      limit: 500,
      depth: 0,
    }),
  ]);

  const pens = pensResult.docs as Pen[];
  const papers = papersResult.docs as Paper[];

  // Group pens by make
  const pensByMake = pens.reduce<Record<string, Pen[]>>((acc, pen) => {
    const key = pen.make;
    if (!acc[key]) acc[key] = [];
    acc[key].push(pen);
    return acc;
  }, {});

  // Group papers by mill
  const papersByMill = papers.reduce<Record<string, Paper[]>>((acc, paper) => {
    const key = paper.mill;
    if (!acc[key]) acc[key] = [];
    acc[key].push(paper);
    return acc;
  }, {});

  const makesSorted = Object.keys(pensByMake).sort();
  const millsSorted = Object.keys(papersByMill).sort();

  return (
    <div style={{ padding: 'var(--space-xl) var(--pad-x) var(--space-lg)' }}>
      <header style={{ marginBottom: 'var(--space-lg)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(48px, 7vw, 88px)',
            lineHeight: 1,
            letterSpacing: '-0.018em',
            marginBottom: '0.5rem',
          }}
        >
          The Register
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-numeral)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.2vw, 19px)',
            color: 'var(--ink-whisper)',
            maxWidth: '52ch',
            lineHeight: 1.5,
          }}
        >
          A complete index of every instrument and paper that has appeared in the catalogue.
        </p>
      </header>

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--ink-rule-heavy)',
          margin: '0 0 var(--space-lg)',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 'var(--space-lg)',
          alignItems: 'start',
        }}
      >
        {/* Pens */}
        <section>
          <h2
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '9.5px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--ink-whisper)',
              marginBottom: '1.5rem',
            }}
          >
            Pens{' '}
            <span
              style={{
                fontFamily: 'var(--font-numeral)',
                fontStyle: 'italic',
                letterSpacing: 0,
                fontSize: '13px',
              }}
            >
              {pens.length}
            </span>
          </h2>

          {pens.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-numeral)',
                fontStyle: 'italic',
                color: 'var(--ink-whisper)',
              }}
            >
              None recorded yet.
            </p>
          ) : (
            makesSorted.map((make) => (
              <div key={make} style={{ marginBottom: '2.5rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '9.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-faint)',
                    paddingBottom: '0.6rem',
                    borderBottom: '1px solid var(--ink-rule-heavy)',
                    marginBottom: '0.1rem',
                  }}
                >
                  {make}
                </div>
                {pensByMake[make]!.map((pen) => (
                  <div
                    key={pen.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '1rem',
                      padding: '0.85rem 0',
                      borderBottom: '1px solid var(--ink-rule)',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: 1.2,
                      }}
                    >
                      {pen.model}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '9px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-faint)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Fountain pen
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </section>

        {/* Papers */}
        <section>
          <h2
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '9.5px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--ink-whisper)',
              marginBottom: '1.5rem',
            }}
          >
            Papers{' '}
            <span
              style={{
                fontFamily: 'var(--font-numeral)',
                fontStyle: 'italic',
                letterSpacing: 0,
                fontSize: '13px',
              }}
            >
              {papers.length}
            </span>
          </h2>

          {papers.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-numeral)',
                fontStyle: 'italic',
                color: 'var(--ink-whisper)',
              }}
            >
              None recorded yet.
            </p>
          ) : (
            millsSorted.map((mill) => (
              <div key={mill} style={{ marginBottom: '2.5rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '9.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-faint)',
                    paddingBottom: '0.6rem',
                    borderBottom: '1px solid var(--ink-rule-heavy)',
                    marginBottom: '0.1rem',
                  }}
                >
                  {mill}
                </div>
                {papersByMill[mill]!.map((paper) => (
                  <div
                    key={paper.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '1rem',
                      padding: '0.85rem 0',
                      borderBottom: '1px solid var(--ink-rule)',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: 1.2,
                      }}
                    >
                      {paper.line}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '9px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-faint)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Writing paper
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
