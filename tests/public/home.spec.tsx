// @vitest-environment jsdom
import './setup';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { HomePage } from '../../src/components/home/HomePage';
import { createPublicContentQueries } from '../../src/queries/publicContent';
import { divisions } from '../../src/content/seed/divisions';
import { services } from '../../src/content/seed/services';
import { publicDivisions, publicPage, publicServices } from './fixtures';

let container: HTMLDivElement | undefined;

afterEach(() => {
  container?.remove();
  container = undefined;
});

function render(element: React.ReactElement) {
  container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(element));
  return container;
}

describe('public home page', () => {
  it('renders the bilingual public information architecture and contextual links', () => {
    const element = render(
      <HomePage
        locale="fr"
        page={publicPage}
        divisions={publicDivisions}
        services={publicServices}
        labels={{
          divisions: 'Nos pôles',
          services: 'Nos services',
          discover: 'Découvrir',
          contact: 'Parler à JT2J',
        }}
        contactHref="/fr/contact"
      />,
    );

    expect(element.querySelector('h1')?.textContent).toContain(
      publicPage.title,
    );
    expect(element.querySelectorAll('[data-division-card]')).toHaveLength(5);
    expect(element.querySelectorAll('[data-service-card]')).toHaveLength(7);
    expect(element.querySelectorAll('a[href="/fr/contact"]')).not.toHaveLength(
      0,
    );
    expect(element.textContent).not.toMatch(
      /editorialNotes|publicationApproved|claims/i,
    );
  });

  it('returns only published records and strips internal fields at the query boundary', () => {
    const queries = createPublicContentQueries({
      pages: [],
      divisions: [
        {
          ...divisions[2],
          status: 'published',
          publicationApproved: true,
        },
        { ...divisions[1], status: 'published', publicationApproved: false },
      ],
      services: [
        {
          ...services[0],
          status: 'published',
          publicationApproved: true,
        },
        services[1],
      ],
      faq: [],
    });

    const result = queries.getDivisions('fr');
    expect(result).toHaveLength(1);
    expect(result[0]).not.toHaveProperty('claims');
    expect(result[0]).not.toHaveProperty('publicationApproved');
    expect(result[0]).not.toHaveProperty('editorialNotes');
    expect(queries.getServices('fr')).toHaveLength(1);
  });
});
