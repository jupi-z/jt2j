import type { AnchorHTMLAttributes } from 'react';

export function ArrowIcon() {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}

export function LinkArrow({
  children,
  className = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a {...props} className={`line-link ${className}`.trim()}>
      {children}
      <ArrowIcon />
    </a>
  );
}
