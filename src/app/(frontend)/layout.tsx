import type { Metadata } from 'next';
import '@/app/globals.css';
import { SiteNav } from '@/components/nav/SiteNav';

export const metadata: Metadata = {
  title: { template: '%s — Pen & Paper', default: 'Pen & Paper' },
  description: 'A catalogue of one reader\u2019s journey through fountain pens and paired papers.',
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/EditorialNew-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/EditorialNew-Italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Supreme-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteNav />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
