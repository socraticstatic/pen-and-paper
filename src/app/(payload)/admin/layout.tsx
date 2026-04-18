import type { Metadata } from 'next';
import '@payloadcms/next/css';

export const metadata: Metadata = {
  title: 'Pen & Paper Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
