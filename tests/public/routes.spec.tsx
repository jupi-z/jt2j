// @vitest-environment jsdom
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createPublicContentQueries } from '../../src/queries/publicContent';
import { PublicRouteContent } from '../../src/components/public/PublicRouteContent';
import { pages } from '../../src/content/seed/pages';
import { divisions } from '../../src/content/seed/divisions';
import { services } from '../../src/content/seed/services';
import { faq } from '../../src/content/seed/faq';

const published = <T extends object>(records: T[]) =>
  records.map((record) => ({
    ...record,
    status: 'published',
    publicationApproved: true,
  }));
const queries = createPublicContentQueries({
  pages: published(pages),
  divisions: published(divisions),
  services: published(services),
  faq: published(faq),
});

describe('public route composition', () => {
  for (const locale of ['fr', 'en'] as const) {
    for (const path of [
      '',
      '/entreprise',
      '/poles',
      '/services',
      '/approche',
      '/faq',
      '/contact',
      ...divisions.map((d) => `/poles/${d.slug}`),
      ...services.map((s) => `/services/${s.slug}`),
    ]) {
      it(`renders published content at /${locale}${path}`, () => {
        const html = renderToStaticMarkup(
          <PublicRouteContent locale={locale} path={path} queries={queries} />,
        );
        const doc = new DOMParser().parseFromString(html, 'text/html');
        expect(doc.querySelectorAll('h1')).toHaveLength(1);
        const expected = [...pages, ...divisions, ...services].find(
          (record) =>
            path ===
            ('key' in record && record.key === 'HOME'
              ? ''
              : ('code' in record
                  ? '/poles/'
                  : 'catalogue' in record
                    ? '/services/'
                    : '/') + record.slug),
        );
        const expectedHeading = 'heading' in expected!
          ? expected!.heading[locale]
          : expected!.title[locale];
        expect(doc.querySelector('h1')?.textContent).toBe(expectedHeading);
        expect(html).not.toMatch(
          /editorialNotes|publicationApproved|translationIssues|claims/,
        );
        if (path.startsWith('/services/')) {
          expect(
            doc.querySelector(
              `a[href="/${locale}/contact?service=${path.split('/')[2]}&division=${services.find((s) => path.endsWith(s.slug))!.division}"]`,
            ),
          ).not.toBeNull();
          expect(doc.querySelector('[aria-current="page"]')).not.toBeNull();
        }
        if (path === '')
          expect(doc.querySelectorAll('[data-division-card]')).toHaveLength(5);
      });
    }
  }
  it('uses the requested translation and never falls back to French', () => {
    expect(queries.getDivisions('en')[0].title).toBe(divisions[0].title.en);
    const incomplete = createPublicContentQueries({
      pages: [],
      services: [],
      faq: [],
      divisions: [
        {
          ...divisions[0],
          status: 'published',
          publicationApproved: true,
          title: { fr: 'Confidentiel', en: '' },
        },
      ],
    });
    expect(incomplete.getDivisions('en')).toEqual([]);
  });
  it('excludes orphan services and unapproved publications', () => {
    const unsafe = createPublicContentQueries({
      pages: [],
      faq: [],
      divisions: [],
      services: published(services),
    });
    expect(unsafe.getServices('fr')).toEqual([]);
  });
  it('does not render draft content even if all canonical seeds are available', () => {
    const drafts = createPublicContentQueries({
      pages,
      divisions,
      services,
      faq,
    });
    const html = renderToStaticMarkup(
      <PublicRouteContent locale="fr" path="" queries={drafts} />,
    );
    expect(html).not.toContain(pages[0].lead.fr);
    expect(html).not.toContain(divisions[0].lead.fr);
    expect(html).toMatch(/publication/i);
  });
});
