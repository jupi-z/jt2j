// @vitest-environment jsdom
import './setup';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { HomePage } from '../../src/components/home/HomePage';
import { publicDivisions, publicPage, publicServices } from './fixtures';

let container: HTMLDivElement | undefined;

afterEach(() => {
  container?.remove();
  container = undefined;
});

function renderHome() {
  container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  act(() =>
    root.render(
      <HomePage
        locale="fr"
        page={publicPage}
        divisions={publicDivisions}
        services={publicServices}
        labels={{
          divisions: 'Nos pôles',
          services: 'Nos services',
          discover: 'Découvrir',
          contact: 'Contact',
        }}
        contactHref="/fr/contact"
      />,
    ),
  );
  return container;
}

describe('prototype parity contract', () => {
  it('keeps the validated home composition landmarks', () => {
    const page = renderHome();

    expect(page.querySelector('.home-hero')).not.toBeNull();
    expect(page.querySelector('.home-hero .hero-bottom')).not.toBeNull();
    expect(page.querySelector('.home-hero .hero-bottom')?.children).toHaveLength(5);
    expect(page.querySelector('.home-hero .hero-cta-primary')).not.toBeNull();
    expect(page.querySelector('.home-hero .hero-cta-secondary')).not.toBeNull();
    expect(page.textContent).toContain('UN GROUPE, UNE AMBITION');
    expect(page.textContent).toContain('Lubumbashi');
    expect(page.querySelector('.division-section .division-visual')).not.toBeNull();
    expect(page.querySelector('.commitment .commit-art')).not.toBeNull();
    expect(page.querySelector('.contact-cta')).not.toBeNull();
  });
});
