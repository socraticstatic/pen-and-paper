import type { ReactNode } from 'react';

interface TypeSetProps {
  children: ReactNode;
  className?: string;
}

export function TypeSet({ children, className }: TypeSetProps) {
  return <div className={`prose${className ? ` ${className}` : ''}`}>{children}</div>;
}
