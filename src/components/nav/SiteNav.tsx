'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteNav() {
  const pathname = usePathname();

  const links: { href: string; label: string; implemented?: boolean }[] = [
    { href: '/', label: 'The Catalogue', implemented: true },
    { href: '/register', label: 'The Register', implemented: true },
    { href: '/field-notes', label: 'Field Notes', implemented: true },
  ];

  return (
    <div className="site-nav-wrap">
      <nav className="site-nav" aria-label="Site navigation">
        <Link href="/" className="wordmark">
          Pen <span>&amp;</span> Paper
        </Link>
        <span className="center">a catalogue of specimens</span>
        <ul className="links">
          {links.map(({ href, label, implemented }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                {implemented === false ? (
                  <a href={href} className={isActive ? 'current' : undefined}>
                    {label}
                  </a>
                ) : (
                  // Route is implemented — safe cast, typedRoutes verifies at build
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <Link href={href as any} className={isActive ? 'current' : undefined}>
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
