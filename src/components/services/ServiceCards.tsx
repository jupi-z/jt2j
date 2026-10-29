import type { Locale } from '../../i18n/config';
import type { PublicService } from '../../queries/publicContent';
import { LinkArrow } from '../ui/LinkArrow';
export function ServiceCards({
  locale,
  services,
}: {
  locale: Locale;
  services: PublicService[];
}) {
  return (
    <div className="public-cards">
      {services.map((service) => (
        <article data-service-card key={service.slug}>
          <p className="eyebrow">{service.eyebrow}</p>
          <h3>
            <a href={`/${locale}/services/${service.slug}`}>{service.title}</a>
          </h3>
          <p>{service.summary}</p>
          <LinkArrow href={`/${locale}/services/${service.slug}`}>
            {service.cta}
          </LinkArrow>
        </article>
      ))}
    </div>
  );
}
