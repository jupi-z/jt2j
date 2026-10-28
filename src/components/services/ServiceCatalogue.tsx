'use client';
import { useId, useState } from 'react';
import type { Locale } from '../../i18n/config';
import type {
  PublicService,
  PublicDivision,
} from '../../queries/publicContent';
import { ServiceCards } from './ServiceCards';
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
export function ServiceCatalogue({
  locale,
  services,
  divisions,
  labels,
}: {
  locale: Locale;
  services: PublicService[];
  divisions: PublicDivision[];
  labels: { search: string; all: string; empty: string };
}) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [division, setDivision] = useState('');
  const filtered = services.filter(
    (service) =>
      (!division || service.division === division) &&
      normalize(
        `${service.title} ${service.lead} ${service.summary} ${service.catalogue}`,
      ).includes(normalize(query)),
  );
  return (
    <>
      <div
        className="catalogue-controls"
        role="search"
        aria-label={labels.search}
      >
        <div>
          <label htmlFor={`${id}-search`}>{labels.search}</label>
          <input
            id={`${id}-search`}
            type="search"
            aria-label={labels.search}
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor={`${id}-division`}>
            {locale === 'fr' ? 'Pôle' : 'Division'}
          </label>
          <select
            id={`${id}-division`}
            value={division}
            onChange={(event) => setDivision(event.currentTarget.value)}
          >
            <option value="">{labels.all}</option>
            {divisions.map((item) => (
              <option value={item.slug} key={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true">
        {filtered.length === 0
          ? labels.empty
          : `${filtered.length} ${locale === 'fr' ? 'services trouvés' : 'services found'}`}
      </p>
      <ServiceCards locale={locale} services={filtered} />
    </>
  );
}
