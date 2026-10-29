import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

export interface SectionHeadingProps {
  title: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
  level?: 1 | 2 | 3;
}
export function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  id,
  level = 2,
}: SectionHeadingProps) {
  const Heading = `h${level}` as 'h1' | 'h2' | 'h3';
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading id={id}>{title}</Heading>
      </div>
      {description && (
        <div className="section-heading-description">{description}</div>
      )}
      {action}
    </div>
  );
}
