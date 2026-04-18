import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-wrap">
      <h1>A page that does not appear in the catalogue.</h1>
      <hr className="rule" style={{ marginBottom: '1.5rem' }} />
      <Link href="/" className="lbl lbl-accent">
        Return to the catalogue →
      </Link>
    </div>
  );
}
