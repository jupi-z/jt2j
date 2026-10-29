import type { HTMLAttributes } from 'react';

export function Eyebrow({
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={`eyebrow ${className}`.trim()} />;
}
