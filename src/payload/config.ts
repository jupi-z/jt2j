import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import sharp from 'sharp';
import { Users } from '../collections/Users';
import { Pages } from '../collections/Pages';
import { Divisions } from '../collections/Divisions';
import { Services } from '../collections/Services';
import { FAQs } from '../collections/FAQs';
import { Media } from '../collections/Media';
import { Leads } from '../collections/Leads';
import { LegalDocuments } from '../collections/LegalDocuments';
import { SiteSettings } from '../globals/SiteSettings';
import { Navigation } from '../globals/Navigation';
import { locales } from '../content/types';
import { assertProductionEnvironment } from '../lib/security/environment';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
export function createPayloadConfig(
  env: Record<string, string | undefined> = process.env,
) {
  assertProductionEnvironment(env);
  if (
    !env.DATABASE_URL ||
    !env.PAYLOAD_SECRET ||
    env.PAYLOAD_SECRET.length < 32
  )
    throw new Error(
      'CMS requires DATABASE_URL and PAYLOAD_SECRET (at least 32 characters)',
    );
  const s3 = env.MEDIA_STORAGE === 's3';
  if (
    s3 &&
    (!env.S3_BUCKET ||
      !env.S3_REGION ||
      !env.S3_ACCESS_KEY_ID ||
      !env.S3_SECRET_ACCESS_KEY)
  )
    throw new Error(
      'S3 media requires S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY',
    );
  if (env.NODE_ENV === 'production' && !s3 && env.MEDIA_STORAGE !== 'local')
    throw new Error(
      'Production requires explicit MEDIA_STORAGE=s3 or persistent local storage',
    );
  return buildConfig({
    secret: env.PAYLOAD_SECRET,
    sharp,
    admin: {
      user: 'users',
      meta: { titleSuffix: ' — JT2J Editorial' },
    },
    localization: {
      locales: [...locales],
      defaultLocale: 'fr',
      fallback: false,
    },
    db: postgresAdapter({
      pool: { connectionString: env.DATABASE_URL },
      push: false,
      migrationDir: path.join(root, 'src/migrations'),
    }),
    collections: [
      Users,
      Pages,
      Divisions,
      Services,
      FAQs,
      Media,
      Leads,
      LegalDocuments,
    ],
    globals: [SiteSettings, Navigation],
    typescript: { outputFile: path.join(root, 'src/payload-types.ts') },
    graphQL: { disable: true },
    upload: { limits: { fileSize: 10 * 1024 * 1024 } },
    plugins: [
      s3Storage({
        enabled: s3,
        alwaysInsertFields: true,
        bucket: env.S3_BUCKET || 'jt2j-media',
        collections: { media: true },
        // Keep the bucket private and retain the default Payload download proxy.
        config: {
          region: env.S3_REGION || 'auto',
          endpoint: env.S3_ENDPOINT,
          forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true',
          ...(s3
            ? {
                credentials: {
                  accessKeyId: env.S3_ACCESS_KEY_ID!,
                  secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
                },
              }
            : {}),
        },
      }),
    ],
  });
}
