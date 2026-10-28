import 'server-only';
import { cache } from 'react';
import { createPublicContentQueries } from './publicContent';
import { readPublicContent } from './payloadPublicContent';
export const getPublicContent = cache(async () => {
  // Allows an unconfigured local build to show only neutral publication states.
  // A configured CMS failure propagates; never mask outages with draft content.
  if (!process.env.DATABASE_URL && !process.env.PAYLOAD_SECRET)
    return createPublicContentQueries({
      pages: [],
      divisions: [],
      services: [],
      faq: [],
    });
  const { getPayload } = await import('payload');
  const { createPayloadConfig } = await import('../payload/config');
  return readPublicContent(await getPayload({ config: createPayloadConfig() }));
});
