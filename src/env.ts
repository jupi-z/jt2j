import { z } from 'zod';

const envSchema = z.object({
  SITE_URL: z.url({ protocol: /^https?$/ }).default('http://localhost:3000'),
});

export function parseEnv(input: Record<string, string | undefined>) {
  const result = envSchema.safeParse(input);
  if (!result.success) {
    // Report field names only; environment values may contain secrets.
    const fields = result.error.issues.map((issue) => issue.path.join('.'));
    throw new Error(`Invalid environment variables: ${fields.join(', ')}`);
  }
  return result.data;
}

export const env = parseEnv(process.env);
