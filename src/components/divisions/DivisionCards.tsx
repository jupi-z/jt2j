import type { Locale } from '../../i18n/config';
import type { PublicDivision } from '../../queries/publicContent';
import { LinkArrow } from '../ui/LinkArrow';

export function DivisionCards({
  locale,
  divisions,
}: {
  locale: Locale;
  divisions: PublicDivision[];
}) {
  return (
    <div className="public-cards">
      {divisions.map((division) => (
        <article data-division-card key={division.slug}>
          <p className="eyebrow">{division.code}</p>
          <h2>
            <a href={`/${locale}/poles/${division.slug}`}>{division.title}</a>
          </h2>
          <p>{division.summary}</p>
          <LinkArrow href={`/${locale}/poles/${division.slug}`}>
            {division.cta}
          </LinkArrow>
        </article>
      ))}
    </div>
  );
}
