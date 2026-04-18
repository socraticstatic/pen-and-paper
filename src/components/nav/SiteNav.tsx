'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'The Catalogue' },
    { href: '/register', label: 'The Register' },
    { href: '/field-notes', label: 'Field Notes' },
  ];

  return (
    <div className="site-nav-wrap">
      <nav className="site-nav" aria-label="Site navigation">
        <Link href="/" className="wordmark">
          Pen <span>&amp;</span> Paper
        </Link>
        <span className="center">a catalogue of specimens</span>
        <ul className="links">
          {links.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} className={isActive ? 'current' : undefined}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
