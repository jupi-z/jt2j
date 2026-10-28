import type { Locale } from '../../i18n/config';
import type { PublicSection } from '../../queries/publicContent';
import { AbstractArtwork, type ArtworkVariant } from '../art/AbstractArtwork';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Button } from '../ui/Button';

export function PageHero({
  title,
  lead,
  variant = 'home',
}: {
  title: string;
  lead: string;
  variant?: ArtworkVariant;
}) {
  return (
    <section className="public-hero">
      <div className="wrap public-hero-grid">
        <div>
          <p className="eyebrow">JT2J Company</p>
          <h1>{title}</h1>
          <p className="big-lead">{lead}</p>
        </div>
        <AbstractArtwork variant={variant} />
      </div>
    </section>
  );
}
export function PageBreadcrumbs({
  locale,
  title,
  parent,
}: {
  locale: Locale;
  title: string;
  parent?: { label: string; href: string };
}) {
  return (
    <div className="wrap">
      <Breadcrumbs
        label={locale === 'fr' ? 'Fil d’Ariane' : 'Breadcrumbs'}
        items={[
          { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
          ...(parent ? [parent] : []),
          { label: title },
        ]}
      />
    </div>
  );
}
export function ContentSections({ sections }: { sections: PublicSection[] }) {
  return (
    <div className="wrap public-sections">
      {sections.map((section, index) => (
        <section className="public-section" key={index}>
          {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </div>
  );
}
export function ContactCallout({
  label,
  href,
  title,
  body,
}: {
  label: string;
  href: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="wrap section public-contact">
      {title && <h2>{title}</h2>}
      {body && <p>{body}</p>}
      <Button href={href}>{label}</Button>
    </section>
  );
}
