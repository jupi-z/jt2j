import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pages } from '../../src/content/seed/pages';
import { divisions } from '../../src/content/seed/divisions';
import { services } from '../../src/content/seed/services';
import { faq } from '../../src/content/seed/faq';
import { siteSettings } from '../../src/content/seed/site-settings';
import {
  extractPrototypeContent,
  serializeSeeds,
} from '../../scripts/extract-prototype-content';
import { validateContent } from '../../scripts/validate-content';

const seeds = { pages, divisions, services, faq, siteSettings };
const reference = readFileSync(
  new URL('../../docs/reference/JT2J_Prestige_Prototype.html', import.meta.url),
  'utf8',
);

describe('canonical content contract', () => {
  it('contains exactly five divisions and seven services', () => {
    expect(divisions).toHaveLength(5);
    expect(services).toHaveLength(7);
    expect(pages).toHaveLength(7);
    expect(faq).toHaveLength(6);
    expect(validateContent(seeds)).toEqual([]);
  });

  it('preserves source identities, ordering and editorial relations', () => {
    expect(divisions.map((d) => d.code)).toEqual([
      'SEC',
      'LOG',
      'HYG',
      'BIZ',
      'TRV',
    ]);
    expect(services.map((s) => s.division)).toEqual([
      'hygiene-pest-control',
      'hygiene-pest-control',
      'travel-escapes',
      'hygiene-pest-control',
      'hygiene-pest-control',
      'logistics-tracking',
      'business-marketing',
    ]);
  });

  it('has nonempty FR/EN titles and leads, unique collection slugs and explicit draft flags', () => {
    for (const collection of [pages, divisions, services, faq]) {
      expect(new Set(collection.map((item) => item.slug)).size).toBe(
        collection.length,
      );
      for (const item of collection) {
        expect(item.status).toBe('draft');
        expect(item.publicationApproved).toBe(false);
        for (const locale of ['fr', 'en'] as const) {
          expect(item.title[locale].trim()).not.toBe('');
          expect(item.lead[locale].trim()).not.toBe('');
        }
      }
    }
    expect(siteSettings.publicationApproved).toBe(false);
    expect(
      Object.values(siteSettings.features).every((value) => value === false),
    ).toBe(true);
  });

  it.each([
    ['wrong division count', (s: typeof seeds) => s.divisions.pop()],
    ['wrong service count', (s: typeof seeds) => s.services.pop()],
    [
      'duplicate slug',
      (s: typeof seeds) => {
        s.services[1].slug = s.services[0].slug;
      },
    ],
    [
      'duplicate division code',
      (s: typeof seeds) => {
        s.divisions[1].code = s.divisions[0].code;
      },
    ],
    [
      'invalid relation',
      (s: typeof seeds) => {
        s.services[0].division = 'unknown';
      },
    ],
    [
      'missing title translation',
      (s: typeof seeds) => {
        Reflect.deleteProperty(s.pages[0].title, 'en');
      },
    ],
    [
      'empty lead',
      (s: typeof seeds) => {
        s.services[0].lead.fr = '  ';
      },
    ],
    [
      'missing section translation',
      (s: typeof seeds) => {
        Reflect.deleteProperty(s.divisions[0].sections[0].body, 'en');
      },
    ],
    [
      'empty section body',
      (s: typeof seeds) => {
        s.pages[0].sections[0].body.fr = '';
      },
    ],
    [
      'empty FAQ answer',
      (s: typeof seeds) => {
        s.faq[0].lead.en = '';
      },
    ],
    [
      'missing publication flag',
      (s: typeof seeds) => {
        Reflect.deleteProperty(s.divisions[0], 'publicationApproved');
      },
    ],
    [
      'unapproved publication',
      (s: typeof seeds) => {
        s.services[0].status = 'published';
      },
    ],
    [
      'unapproved claims',
      (s: typeof seeds) => {
        s.services[0].status = 'published';
        s.services[0].publicationApproved = true;
      },
    ],
    [
      'deleted claim inventory',
      (s: typeof seeds) => {
        s.services[0].claims = [];
      },
    ],
    [
      'approved claim without evidence',
      (s: typeof seeds) => {
        s.services[0].claims[0].status = 'approved';
      },
    ],
    [
      'unapproved feature',
      (s: typeof seeds) => {
        s.siteSettings.features.leadership = true;
      },
    ],
    [
      'empty contact',
      (s: typeof seeds) => {
        s.siteSettings.email = '';
      },
    ],
  ])('rejects %s', (_name, mutate) => {
    const invalid = structuredClone(seeds);
    mutate(invalid);
    expect(validateContent(invalid).length).toBeGreaterThan(0);
  });

  it('returns paths for invalid fields and handles malformed input without throwing', () => {
    const invalid = structuredClone(seeds);
    invalid.services[0].lead.en = '';
    expect(
      validateContent(invalid).some(
        (issue) => issue.path === 'services.0.lead.en',
      ),
    ).toBe(true);
    expect(validateContent(null).length).toBeGreaterThan(0);
  });

  it('accepts a publication with explicit approval and evidenced claims', () => {
    const approved = structuredClone(seeds);
    const service = approved.services[0];
    const division = approved.divisions.find(
      (d) => d.slug === service.division,
    )!;
    for (const item of [service, division]) {
      item.status = 'published';
      item.publicationApproved = true;
      item.claims.forEach((claim) => {
        claim.status = 'approved';
        claim.approvedBy = 'JT2J publisher';
        claim.evidence = 'Editorial approval record 2026-10-28';
      });
    }
    expect(validateContent(approved)).toEqual([]);
    division.status = 'draft';
    expect(validateContent(approved)).toContainEqual({
      path: 'services.0.division',
      message: 'Published service requires a published division',
    });
  });
});

describe('prototype extraction', () => {
  it('reproduces checked-in seeds deterministically from the inert JSON reference', async () => {
    const first = extractPrototypeContent(reference);
    expect(first).toEqual(seeds);
    expect(await serializeSeeds(first)).toEqual(
      await serializeSeeds(extractPrototypeContent(reference)),
    );
    for (const [file, source] of Object.entries(await serializeSeeds(first))) {
      expect(
        readFileSync(
          new URL(`../../src/content/seed/${file}`, import.meta.url),
          'utf8',
        ),
      ).toBe(source);
    }
  });

  it('never evaluates prototype scripts', () => {
    const hostile = reference.replace(
      '</body>',
      '<script>throw new Error("executed")</script></body>',
    );
    expect(extractPrototypeContent(hostile)).toEqual(seeds);
  });

  it('uses existing localized FAQ descriptions for the prototype empty leads', () => {
    const page = pages.find((p) => p.slug === 'faq')!;
    expect(page.lead).toEqual(page.meta.description);
  });

  it('keeps service notes as internal editorial data and excludes demo content', () => {
    expect(
      services.every((s) => s.editorialNotes.fr && s.editorialNotes.en),
    ).toBe(true);
    expect(JSON.stringify(seeds)).not.toMatch(
      /Presentation prototype|Prototype de présentation|studio-tab|data-save-edit/,
    );
  });

  it.each([
    ['missing data', '<html></html>'],
    [
      'invalid JSON',
      '<script id="site-data" type="application/json">{broken}</script>',
    ],
    [
      'wrong data shape',
      '<script id="site-data" type="application/json">{}</script>',
    ],
  ])('rejects %s', (_name, html) => {
    expect(() => extractPrototypeContent(html)).toThrow();
  });

  it('rejects a missing English service translation rather than falling back to French', () => {
    const changed = reference.replace(
      '"en": "Pest Control & Extermination"',
      '"xx": "Pest Control & Extermination"',
    );
    expect(changed).not.toBe(reference);
    expect(() => extractPrototypeContent(changed)).toThrow();
  });
});
