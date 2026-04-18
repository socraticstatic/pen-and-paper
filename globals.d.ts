// Next.js 15 ships *.module.css declarations but not bare *.css.
// These ambient declarations cover CSS side-effect imports that TS would otherwise reject.
declare module '*.css';
// Payload 3 ships its admin CSS as a package subpath export (not a file path).
declare module '@payloadcms/next/css';
