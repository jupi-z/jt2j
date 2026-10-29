import {
  APIError,
  type Access,
  type CollectionBeforeOperationHook,
  type GlobalBeforeReadHook,
} from 'payload';
import { isEditorial, editorial, publishers } from './roles';

// Always apply BOTH gates. Local API consumers must explicitly set overrideAccess:false.
export const publishedOnly: Access = ({ req }) =>
  isEditorial(req.user) || {
    _status: { equals: 'published' },
    publicationApproved: { equals: true },
  };
export const contentAccess = {
  read: publishedOnly,
  create: editorial,
  update: editorial,
  delete: publishers,
  readVersions: editorial,
};
export const publishedServiceOnly: Access = ({ req }) =>
  isEditorial(req.user) || {
    _status: { equals: 'published' },
    publicationApproved: { equals: true },
    'division._status': { equals: 'published' },
    'division.publicationApproved': { equals: true },
  };

export const globalPublishedOnly =
  (slug: 'site-settings' | 'navigation'): Access =>
  async ({ req }) => {
    if (isEditorial(req.user)) return true;
    const doc = await req.payload.db.findGlobal({
      slug,
      locale: req.locale,
      req,
      where: {
        _status: { equals: 'published' },
        publicationApproved: { equals: true },
      },
    });
    return doc?._status === 'published' && doc.publicationApproved === true;
  };

export const protectDraftQueries: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if (
    (operation === 'find' ||
      operation === 'findByID' ||
      operation === 'read') &&
    !args.overrideAccess &&
    !isEditorial(req.user) &&
    'draft' in args &&
    args.draft
  ) {
    // Collections return published records when callers request drafts anonymously.
    args.draft = false;
  }
  return args;
};

// Globals also need a document guard: never let a select, absent record, or draft
// replacement turn a global boolean access check into a disclosure.
export const protectGlobalRead: GlobalBeforeReadHook = ({
  doc,
  req,
  overrideAccess,
}) => {
  if (
    !overrideAccess &&
    !isEditorial(req.user) &&
    (doc._status !== 'published' || doc.publicationApproved !== true)
  ) {
    throw new APIError('Published content is not available', 404);
  }
  return doc;
};

export function stripPrivateContent({
  doc,
  req,
  overrideAccess,
}: {
  doc: Record<string, unknown>;
  req: Parameters<GlobalBeforeReadHook>[0]['req'];
  overrideAccess?: boolean;
}) {
  if (!overrideAccess && !isEditorial(req.user)) {
    for (const name of [
      'claims',
      'translationIssues',
      'publicationApproved',
      'editorialNotes',
      'rightsEvidence',
    ])
      delete doc[name];
  }
  return doc;
}
