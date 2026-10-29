import { divisions as divisionSeeds } from '../content/seed/divisions';
import { faq as faqSeeds } from '../content/seed/faq';
import { pages as pageSeeds } from '../content/seed/pages';
import { services as serviceSeeds } from '../content/seed/services';
import { createPublicContentQueries } from './publicContent';

const approvedLegalClaim = {
  category: 'legal',
  source: 'JT2J QA fixture approval record',
  status: 'approved',
  approvedBy: 'qa-reviewer',
  evidence: 'QA fixture legal approval record',
} as const;

const published = <T extends object>(record: T) => ({
  ...record,
  status: 'published',
  _status: 'published',
  publicationApproved: true,
  claims: [approvedLegalClaim],
});

/**
 * Browser-only published projection. It reuses the canonical bilingual seed
 * copy so the fixture covers the complete five-division/seven-service catalog.
 * It is enabled only by scripts/e2e-server.mjs; normal content loading stays
 * CMS-backed and fail-closed.
 */
export function createE2EPublicContentQueries() {
  return createPublicContentQueries({
    pages: pageSeeds.map(published),
    divisions: divisionSeeds.map(published),
    services: serviceSeeds.map(published),
    faq: faqSeeds.map(published),
  });
}
