import { pages } from '../../src/content/seed/pages';
import { divisions } from '../../src/content/seed/divisions';
import { services } from '../../src/content/seed/services';
import { faq } from '../../src/content/seed/faq';
import type {
  PublicDivision,
  PublicFaq,
  PublicPage,
  PublicService,
} from '../../src/queries/publicContent';

const home = pages.find((page) => page.key === 'HOME')!;

export const publicPage: PublicPage = {
  key: home.key,
  slug: home.slug,
  title: home.title.fr,
  lead: home.lead.fr,
  sections: home.sections.map((section) => ({
    title: section.title.fr,
    body: section.body.fr,
    link: section.link?.fr,
    eyebrow: section.eyebrow?.fr,
  })),
  meta: {
    title: home.meta.title.fr,
    description: home.meta.description.fr,
  },
};

export const publicDivisions: PublicDivision[] = divisions.map((division) => ({
  code: division.code,
  slug: division.slug,
  order: division.order,
  title: division.title.fr,
  lead: division.lead.fr,
  heading: division.heading.fr,
  summary: division.summary.fr,
  cta: division.cta.fr,
  sections: division.sections.map((section) => ({
    title: section.title.fr,
    body: section.body.fr,
    link: section.link?.fr,
    eyebrow: section.eyebrow?.fr,
  })),
  bottom: {
    title: division.bottom.title.fr,
    body: division.bottom.body.fr,
  },
  meta: {
    title: division.meta.title.fr,
    description: division.meta.description.fr,
  },
}));

export const publicServices: PublicService[] = services.map((service) => ({
  slug: service.slug,
  order: service.order,
  division: service.division,
  catalogue: service.catalogue,
  title: service.title.fr,
  lead: service.lead.fr,
  heading: service.heading.fr,
  summary: service.summary.fr,
  eyebrow: service.eyebrow.fr,
  cta: service.cta.fr,
  sections: service.sections.map((section) => ({
    title: section.title.fr,
    body: section.body.fr,
    link: section.link?.fr,
    eyebrow: section.eyebrow?.fr,
  })),
  meta: {
    title: service.meta.title.fr,
    description: service.meta.description.fr,
  },
}));

export const publicFaq: PublicFaq[] = faq.map((item) => ({
  slug: item.slug,
  order: item.order,
  question: item.title.fr,
  answer: item.lead.fr,
}));
