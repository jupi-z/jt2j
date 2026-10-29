// @vitest-environment jsdom
import './setup';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { ServicesPage } from '../../src/components/services/ServicesPage';
import { publicDivisions, publicServices } from './fixtures';

let container: HTMLDivElement | undefined;
let root: ReturnType<typeof createRoot> | undefined;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
});

function render(element: React.ReactElement) {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root!.render(element));
  return container;
}

describe('public service catalogue', () => {
  it('renders seven services and filters by text and division', () => {
    const element = render(
      <ServicesPage
        locale="fr"
        title="Services"
        lead="Explorez les services JT2J."
        services={publicServices}
        divisions={publicDivisions}
        labels={{
          search: 'Rechercher un service',
          all: 'Tous les pôles',
          empty: 'Aucun service trouvé',
        }}
        contactLabel="Parler de votre besoin"
        contactHref="/fr/contact"
      />,
    );

    expect(element.querySelectorAll('[data-service-card]')).toHaveLength(7);
    const search = element.querySelector<HTMLInputElement>(
      'input[type="search"]',
    )!;
    act(() => {
      search.value = 'nettoyage';
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(element.querySelectorAll('[data-service-card]')).toHaveLength(1);

    const select = element.querySelector<HTMLSelectElement>('select')!;
    act(() => {
      select.value = 'travel-escapes';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(element.querySelectorAll('[data-service-card]')).toHaveLength(0);
    expect(element.textContent).toContain('Aucun service');
  });

  it('uses accessible labels and locale-aware detail/contact links', () => {
    const element = render(
      <ServicesPage
        locale="en"
        title="Services"
        lead="Explore the catalogue."
        services={publicServices}
        divisions={publicDivisions}
        labels={{
          search: 'Search services',
          all: 'All divisions',
          empty: 'No service found',
        }}
        contactLabel="Contact JT2J"
        contactHref="/en/contact"
      />,
    );

    expect(element.querySelector('label[for]')?.textContent).toContain(
      'Search',
    );
    expect(element.querySelector('input')?.getAttribute('aria-label')).toBe(
      'Search services',
    );
    expect(
      element.querySelector('a[href="/en/services/cleaning"]'),
    ).not.toBeNull();
    expect(element.querySelector('a[href="/en/contact"]')).not.toBeNull();
  });
});
