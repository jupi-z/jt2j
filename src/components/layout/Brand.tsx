import type { NavigationLink } from './navigation';

/** Temporary typographic signature from the prototype; not an official logo. */
export function Brand({
  home,
  label,
}: {
  home: NavigationLink;
  label?: string;
}) {
  return (
    <a className="brand" href={home.href} aria-label={home.label}>
      <span className="wordmark">JT2J</span>
      {label && <span className="brand-label">{label}</span>}
    </a>
  );
}
