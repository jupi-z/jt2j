// @vitest-environment jsdom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from '../../src/components/layout/Header';
import { Footer } from '../../src/components/layout/Footer';
import { Button } from '../../src/components/ui/Button';
import { LinkArrow } from '../../src/components/ui/LinkArrow';
import { Breadcrumbs } from '../../src/components/ui/Breadcrumbs';
import { AbstractArtwork } from '../../src/components/art/AbstractArtwork';
import { SectionHeading } from '../../src/components/ui/SectionHeading';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root;
function render(node: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(node));
  return container;
}
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = '';
});
const home = { href: '/fr', label: 'JT2J Company' };
const links = [{ href: '/fr/company', label: 'Entreprise', current: true }];
const locales = [
  { href: '/en/company', label: 'English', locale: 'en' as const },
];
const header = () => (
  <Header
    home={home}
    links={links}
    locale="fr"
    localeLinks={locales}
    labels={{
      skip: 'Aller au contenu',
      navigation: 'Navigation principale',
      languages: 'Langues',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    }}
    mega={{
      label: 'Pôles',
      links: [
        {
          href: '/fr/poles/security',
          label: 'Sécurité',
          description: 'Description fournie',
        },
      ],
    }}
  />
);

describe('shared shell', () => {
  it('preserves native disabled and explicit submit behavior', () => {
    const click = vi.fn();
    const el = render(
      <>
        <Button disabled onClick={click}>
          Indisponible
        </Button>
        <Button type="submit">Envoyer</Button>
      </>,
    );
    el.querySelector('button')!.click();
    expect(click).not.toHaveBeenCalled();
    expect(el.querySelectorAll('button')[1].type).toBe('submit');
  });
  it('uses the supplied heading level and optional supporting content', () => {
    const el = render(
      <SectionHeading
        level={1}
        id="heading"
        title="Titre fourni"
        eyebrow="Repère fourni"
        description="Description fournie"
      />,
    );
    expect(el.querySelector('h1')?.id).toBe('heading');
    expect(el.querySelector('.eyebrow')?.textContent).toBe('Repère fourni');
    expect(el.querySelector('.section-heading-description')?.textContent).toBe(
      'Description fournie',
    );
  });
  it('keeps actions as buttons and destinations as links', () => {
    const el = render(
      <>
        <Button>Envoyer</Button>
        <Button href="/fr/contact">Contact</Button>
        <LinkArrow href="/fr/company">Entreprise</LinkArrow>
      </>,
    );
    expect(el.querySelector('button')?.type).toBe('button');
    expect(el.querySelectorAll('a')).toHaveLength(2);
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/fr/contact');
    expect(el.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
  it('provides a skip link, current page and explicit locale destination', () => {
    const el = render(header());
    expect(el.querySelector('.skip-link')?.getAttribute('href')).toBe('#main');
    expect(el.querySelector('[aria-current="page"]')?.textContent).toBe(
      'Entreprise',
    );
    expect(
      el.querySelector('[hreflang="en"]')?.getAttribute('aria-label'),
    ).toBe('English');
    expect(el.querySelector('[hreflang="en"]')?.getAttribute('href')).toBe(
      '/en/company',
    );
  });
  it('closes mega navigation with Escape and restores its trigger focus', () => {
    const el = render(header());
    const button = el.querySelector<HTMLButtonElement>('.mega-toggle')!;
    act(() => button.click());
    expect(button.getAttribute('aria-expanded')).toBe('true');
    el.querySelector<HTMLAnchorElement>('.mega a')!.focus();
    act(() =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      ),
    );
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });
  it('closes mega navigation on outside click and when focus leaves', () => {
    const el = render(header());
    const button = el.querySelector<HTMLButtonElement>('.mega-toggle')!;
    act(() => button.click());
    act(() =>
      document.body.dispatchEvent(
        new MouseEvent('pointerdown', { bubbles: true }),
      ),
    );
    expect(button.getAttribute('aria-expanded')).toBe('false');
    act(() => button.click());
    act(() => button.focus());
    const outside = document.createElement('button');
    document.body.append(outside);
    act(() => outside.focus());
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
  it('renders mobile destinations and an accessible dialog trigger', () => {
    const el = render(header());
    expect(
      el.querySelector('.menu-button')?.getAttribute('aria-haspopup'),
    ).toBe('dialog');
    expect(el.querySelector('dialog')?.getAttribute('aria-label')).toBe(
      'Navigation principale',
    );
    expect(el.querySelector('dialog nav a')?.getAttribute('href')).toBe(
      '/fr/company',
    );
  });
  it('renders only supplied footer navigation and copyright', () => {
    const el = render(
      <Footer
        home={home}
        groups={[{ label: 'Explorer', links }]}
        copyright="© fourni"
      />,
    );
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Explorer',
    );
    expect(el.querySelectorAll('a')).toHaveLength(2);
    expect(el.textContent).toContain('© fourni');
    expect(el.textContent).not.toMatch(/prototype|studio|privacy|cookies/i);
  });
  it('marks the final breadcrumb without inventing a destination', () => {
    const el = render(
      <Breadcrumbs label="Fil d’Ariane" items={[home, { label: 'Page' }]} />,
    );
    expect(el.querySelector('[aria-current="page"]')?.tagName).toBe('SPAN');
  });
  it('hides artwork by default and labels it only when a description is supplied', () => {
    const el = render(
      <>
        <AbstractArtwork />
        <AbstractArtwork description="Description approuvée" />
      </>,
    );
    const svg = el.querySelectorAll('svg');
    expect(svg[0].getAttribute('aria-hidden')).toBe('true');
    expect(svg[1].getAttribute('role')).toBe('img');
    expect(svg[1].querySelector('title')?.textContent).toBe(
      'Description approuvée',
    );
    const ids = [...el.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
