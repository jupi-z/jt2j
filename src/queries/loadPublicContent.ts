import 'server-only';
import { cache } from 'react';
import { createPublicContentQueries } from './publicContent';
import { readPublicContent } from './payloadPublicContent';
import { createE2EPublicContentQueries } from './e2ePublicContent';
export const getPublicContent = cache(async () => {
  if (process.env.JT2J_E2E_FIXTURES === '1')
    return createE2EPublicContentQueries();
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
