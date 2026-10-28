// @vitest-environment jsdom
import './setup';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { FaqPage } from '../../src/components/faq/FaqPage';
import { publicFaq } from './fixtures';

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

describe('public FAQ page', () => {
  it('uses native disclosure semantics and keeps answers hidden until opened', () => {
    const element = render(
      <FaqPage
        locale="fr"
        title="Questions fréquentes"
        lead="Les réponses aux questions courantes."
        items={publicFaq}
        contactLabel="Une autre question ? Contactez-nous"
        contactHref="/fr/contact?source=faq"
      />,
    );
    const details = element.querySelectorAll('details');
    expect(details).toHaveLength(6);
    expect(element.querySelectorAll('summary')).toHaveLength(6);
    expect(details[0].open).toBe(false);
    act(() => (details[0].querySelector('summary') as HTMLElement).click());
    expect(details[0].open).toBe(true);
    expect(
      element.querySelector('a[href="/fr/contact?source=faq"]'),
    ).not.toBeNull();
  });

  it('renders the selected locale and does not expose editorial fields', () => {
    const element = render(
      <FaqPage
        locale="en"
        title="Frequently asked questions"
        lead="Answers to common questions."
        items={publicFaq.map((item) => ({
          ...item,
          question: `EN: ${item.question}`,
        }))}
        contactLabel="Still have a question?"
        contactHref="/en/contact?source=faq"
      />,
    );
    expect(element.querySelector('h1')?.textContent).toBe(
      'Frequently asked questions',
    );
    expect(element.querySelector('summary')?.textContent).toContain('EN:');
    expect(element.textContent).not.toMatch(
      /claims|editorialNotes|publicationApproved|draft/i,
    );
  });
});
