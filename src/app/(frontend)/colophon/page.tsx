import type { Metadata } from 'next';
import { TypeSet } from '@/components/TypeSet';

export const metadata: Metadata = { title: 'Colophon' };

export default function ColophonPage() {
  return (
    <div className="colophon-wrap">
      <h1>Colophon</h1>
      <TypeSet>
        <p>
          <em>Pen &amp; Paper</em> is written by Micah Boswell. A catalogue of one reader&apos;s
          journey through fountain pens and paired papers, from first pen to savant.
        </p>
        <p>
          Each entry is a numbered specimen. The essays are honest accounts of the pen, the paper,
          and what happened when they met. The photographs are made with available light. The
          opinions are entirely the author&apos;s.
        </p>
        <p>
          Set in <em>Editorial New</em> (Pangram Pangram) and <em>Supreme</em> (Fontshare). Built
          with Next.js 15 and Payload CMS 3. Hosted on Vercel. Database on Neon.
        </p>
        <p>
          Source code is MIT licensed. All writing, photography, and editorial content is All Rights
          Reserved.
        </p>
      </TypeSet>
    </div>
  );
}
