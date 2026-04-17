// Next.js 15 ships *.module.css declarations but not bare *.css.
// This ambient declaration lets us import `globals.css` for its side effects
// without a TS2882 type error. See docs/superpowers/plans/2026-04-17-phase-0-scaffold.md Task 2.
declare module '*.css';
