import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Specimen } from '@/payload-types';

type PairingRationale = NonNullable<Specimen['pairingRationale']>;

interface PairingFooterProps {
  pairingRationale?: PairingRationale | null;
  affiliateOverrides?: Specimen['affiliateOverrides'];
  pen?: { make: string; model: string } | null;
  paper?: { mill: string; line: string } | null;
}

function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

export function PairingFooter({
  pairingRationale,
  affiliateOverrides,
  pen,
  paper,
}: PairingFooterProps) {
  const penUrl = safeUrl(affiliateOverrides?.penUrl);
  const paperUrl = safeUrl(affiliateOverrides?.paperUrl);

  return (
    <footer
      style={{
        marginTop: 'var(--space-lg)',
        borderTop: '1px solid var(--ink-rule-heavy)',
        paddingTop: 'var(--space-md)',
      }}
    >
      {pairingRationale && (
        <div style={{ marginBottom: 'var(--space-md)', maxWidth: '52ch' }}>
          <p className="lbl" style={{ marginBottom: '1rem' }}>
            Why these three
          </p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <RichText data={pairingRationale as any} />
        </div>
      )}
      {(penUrl ?? paperUrl) && (
        <div style={{ display: 'flex', gap: '2rem', marginTop: 'var(--space-sm)' }}>
          {pen && penUrl && (
            <a
              href={penUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="lbl lbl-accent"
            >
              Get the {pen.make} {pen.model} &rarr;
            </a>
          )}
          {paper && paperUrl && (
            <a
              href={paperUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="lbl lbl-accent"
            >
              Get the {paper.mill} {paper.line} &rarr;
            </a>
          )}
        </div>
      )}
    </footer>
  );
}
