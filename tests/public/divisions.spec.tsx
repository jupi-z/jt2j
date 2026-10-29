// @vitest-environment jsdom
import './setup';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { DivisionsPage } from '../../src/components/divisions/DivisionsPage';
import { DivisionDetail } from '../../src/components/divisions/DivisionDetail';
import { publicDivisions, publicServices } from './fixtures';

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

describe('public division pages', () => {
  it('renders all five divisions with locale-aware detail links', () => {
    const element = render(
      <DivisionsPage
        locale="en"
        title="Our divisions"
        lead="Five areas of activity."
        divisions={publicDivisions}
        contactLabel="Contact JT2J"
        contactHref="/en/contact"
      />,
    );

    expect(element.querySelectorAll('[data-division-card]')).toHaveLength(5);
    expect(
      element.querySelector('a[href="/en/poles/security-biometrics"]'),
    ).not.toBeNull();
    expect(element.querySelectorAll('h2')).toHaveLength(5);
  });

  it('renders breadcrumbs, related services and a contextual contact link', () => {
    const division = publicDivisions[2];
    const element = render(
      <DivisionDetail
        locale="fr"
        division={division}
        services={publicServices.filter(
          (service) => service.division === division.slug,
        )}
        breadcrumbs={{ home: 'Accueil', divisions: 'Pôles' }}
        contactLabel={division.cta}
        contactHref={`/fr/contact?division=${division.slug}`}
      />,
    );

    expect(
      element.querySelector('nav[aria-label="Fil d’Ariane"]'),
    ).not.toBeNull();
    expect(element.querySelector('a[href="/fr/poles"]')?.textContent).toBe(
      'Pôles',
    );
    expect(element.querySelectorAll('[data-service-card]')).toHaveLength(4);
    expect(
      element.querySelector(`a[href="/fr/contact?division=${division.slug}"]`),
    ).not.toBeNull();
  });
});
