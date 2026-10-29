import { useId } from 'react';

export type ArtworkVariant =
  | 'home'
  | 'hygiene'
  | 'security'
  | 'logistics'
  | 'business'
  | 'travel'
  | 'commitment';

/** Original prototype compositions only; never an official logo or claim. */
export function AbstractArtwork({
  variant = 'home',
  light = false,
  description,
  className = '',
}: {
  variant?: ArtworkVariant;
  light?: boolean;
  description?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      className={`abstract-artwork ${className}`.trim()}
      viewBox="0 0 650 660"
      aria-hidden={description ? undefined : true}
      role={description ? 'img' : undefined}
      aria-labelledby={description ? id : undefined}
      focusable="false"
    >
      {description && <title id={id}>{description}</title>}
      <image
        href={`/assets/abstract-${variant}${light ? '-light' : ''}.svg`}
        width="650"
        height="660"
      />
    </svg>
  );
}
