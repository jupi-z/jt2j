import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { APIError, type CollectionBeforeOperationHook } from 'payload';

const fileProperties = [
  '_objectKey',
  'filename',
  'url',
  'prefix',
  'sizes',
  'thumbnailURL',
  'mimeType',
  'filesize',
  'width',
  'height',
  'focalX',
  'focalY',
];
const immutable = () =>
  new APIError(
    'Media files are immutable. Upload a new media record for a replacement; existing files cannot be deleted or reprocessed.',
    400,
  );

/** Runs before generateFileData, deleteAssociatedFiles, and storage adapter hooks.
 * One media identity owns one binary for its entire history. Uploading a new
 * identity and switching a content relationship is the replacement workflow.
 * This also applies to trusted Local API calls: overrideAccess cannot make a
 * non-transactional filesystem/object-store mutation safe to roll back.
 */
export const immutableMedia: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if (operation === 'delete' || operation === 'restoreVersion')
    throw immutable();
  if (operation !== 'create' && operation !== 'update') return args;

  const data = args.data && typeof args.data === 'object' ? args.data : {};
  if (
    fileProperties.some((key) => Object.hasOwn(data, key)) ||
    req.query?.uploadEdits ||
    args.overwriteExistingFiles
  )
    throw immutable();
  if (operation === 'update') {
    if (req.file) throw immutable();
    return args;
  }
  // Do not import another record's filename/URL, duplicate its file, or accept
  // client-selected object keys. All bytes enter via a fresh server upload.
  if (!req.file || args.duplicateFromID != null || req.file.clientUploadContext)
    throw immutable();
  req.file.name = `${randomUUID()}${path.extname(path.basename(req.file.name)).toLowerCase()}`;
  return args;
};
