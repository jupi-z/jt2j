import { createPublicContentQueries } from './publicContent';

const localized = (fr: string, en: string) => ({ fr, en });
const section = (fr: string, en: string) => ({
  title: localized(fr, en),
  body: localized(fr, en),
});
const publication = {
  status: 'published',
  _status: 'published',
  publicationApproved: true,
  claims: [
    {
      category: 'legal',
      source: 'QA fixture source record',
      status: 'approved',
      approvedBy: 'qa-reviewer',
      evidence: 'QA fixture approval record',
    },
  ],
};

/**
 * Explicit browser-only fixture data. It is enabled solely by the Playwright
 * web server flag and is never used by normal local, staging, or production
 * content loading. Records mirror the published bilingual CMS projection.
 */
export function createE2EPublicContentQueries() {
  const divisions = [
    {
      ...publication,
      slug: 'hygiene-pest-control',
      order: 1,
      code: 'HYG',
      title: localized('Hygiène & Extermination', 'Hygiene & Pest Control'),
      lead: localized('Des espaces sains et bien entretenus.', 'Healthy, well-maintained spaces.'),
      sections: [section('Une expertise concrète.', 'Practical expertise.')],
      meta: {
        title: localized('Hygiène & Extermination | JT2J', 'Hygiene & Pest Control | JT2J'),
        description: localized('Services de nettoyage et d hygiène.', 'Cleaning and hygiene services.'),
      },
      heading: localized('Des services pour vos espaces.', 'Services for your spaces.'),
      summary: localized('Nettoyage, hygiène et entretien.', 'Cleaning, hygiene and upkeep.'),
      cta: localized('Découvrir le pôle', 'Explore the division'),
      bottom: {
        title: localized('Un besoin d entretien ?', 'Need maintenance support?'),
        body: localized('Parlons de votre projet.', 'Let us discuss your project.'),
      },
    },
    {
      ...publication,
      slug: 'travel-escapes',
      order: 2,
      code: 'TRV',
      title: localized('Voyages & Évasion', 'Travel & Escapes'),
      lead: localized('Un accompagnement pour vos déplacements.', 'Support for your travel plans.'),
      sections: [section('Un projet à préparer.', 'A project to prepare.')],
      meta: {
        title: localized('Voyages & Évasion | JT2J', 'Travel & Escapes | JT2J'),
        description: localized('Services de voyage et tourisme.', 'Travel and tourism services.'),
      },
      heading: localized('Votre projet commence par un échange.', 'Your project starts with a conversation.'),
      summary: localized('Voyages, tourisme et assistance.', 'Travel, tourism and assistance.'),
      cta: localized('Explorer le pôle', 'Explore the division'),
      bottom: {
        title: localized('Préparez un déplacement.', 'Planning a trip?'),
        body: localized('Présentez-nous votre besoin.', 'Tell us what you need.'),
      },
    },
  ];
  const services = [
    {
      ...publication,
      slug: 'cleaning',
      order: 1,
      division: 'hygiene-pest-control',
      title: localized('Nettoyage & entretien', 'Cleaning Services'),
      lead: localized('Nettoyage des espaces professionnels.', 'Cleaning for professional spaces.'),
      sections: [section('Une réponse adaptée.', 'A tailored response.')],
      meta: {
        title: localized('Nettoyage & entretien | JT2J', 'Cleaning Services | JT2J'),
        description: localized('Nettoyage et entretien des espaces.', 'Cleaning and upkeep services.'),
      },
      catalogue: localized('Nettoyage & entretien', 'Cleaning Services'),
      heading: localized('Des espaces entretenus.', 'Well-maintained spaces.'),
      summary: localized('Nettoyage et entretien des bâtiments.', 'Cleaning and upkeep for buildings.'),
      eyebrow: localized('HYGIÈNE', 'HYGIENE'),
      cta: localized('Demander des informations', 'Request information'),
    },
    {
      ...publication,
      slug: 'pest-control',
      order: 2,
      division: 'hygiene-pest-control',
      title: localized('Lutte contre les nuisibles', 'Pest Control'),
      lead: localized('Prévention et traitement des nuisibles.', 'Pest prevention and treatment.'),
      sections: [section('Un environnement maîtrisé.', 'A controlled environment.')],
      meta: {
        title: localized('Lutte contre les nuisibles | JT2J', 'Pest Control | JT2J'),
        description: localized('Prévention et traitement des nuisibles.', 'Pest prevention and treatment.'),
      },
      catalogue: localized('Lutte contre les nuisibles', 'Pest Control'),
      heading: localized('Protéger vos espaces.', 'Protect your spaces.'),
      summary: localized('Solutions de lutte contre les nuisibles.', 'Pest control solutions.'),
      eyebrow: localized('EXTERMINATION', 'PEST CONTROL'),
      cta: localized('Parler à JT2J', 'Talk to JT2J'),
    },
    {
      ...publication,
      slug: 'travel-tourism',
      order: 3,
      division: 'travel-escapes',
      title: localized('Voyages & tourisme', 'Travel & Tourism'),
      lead: localized('Organisation et assistance aux voyageurs.', 'Travel planning and assistance.'),
      sections: [section('Un itinéraire clair.', 'A clear itinerary.')],
      meta: {
        title: localized('Voyages & tourisme | JT2J', 'Travel & Tourism | JT2J'),
        description: localized('Organisation de voyages et tourisme.', 'Travel planning and tourism.'),
      },
      catalogue: localized('Voyages & tourisme', 'Travel & Tourism'),
      heading: localized('Préparer votre déplacement.', 'Plan your journey.'),
      summary: localized('Voyages et assistance touristique.', 'Travel and tourism assistance.'),
      eyebrow: localized('VOYAGES', 'TRAVEL'),
      cta: localized('Préparer un projet', 'Plan a project'),
    },
  ];
  const faq = [
    {
      ...publication,
      slug: 'contact',
      order: 1,
      title: localized('Comment contacter JT2J ?', 'How can I contact JT2J?'),
      lead: localized('Utilisez le formulaire de contact pour nous écrire.', 'Use the contact form to write to us.'),
    },
    {
      ...publication,
      slug: 'response',
      order: 2,
      title: localized('Quels services sont proposés ?', 'What services are available?'),
      lead: localized('Les services publiés sont présentés dans le catalogue.', 'Published services appear in the catalogue.'),
    },
  ];
  return createPublicContentQueries({ pages: [], divisions, services, faq });
}
