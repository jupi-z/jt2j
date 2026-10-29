export type RateLimitOptions = { max: number; windowMs: number };
export const publicMutationRateLimit: RateLimitOptions = {
  max: 5,
  windowMs: 15 * 60 * 1000,
};

type Entry = { timestamps: number[]; lastSeen: number };

export function createMemoryRateLimiter(
  options: RateLimitOptions,
  maxEntries = 10_000,
) {
  const entries = new Map<string, Entry>();
  return {
    consume(key: string, now = Date.now()) {
      for (const [entryKey, entry] of entries) {
        entry.timestamps = entry.timestamps.filter(
          (timestamp) => timestamp > now - options.windowMs,
        );
        if (!entry.timestamps.length) entries.delete(entryKey);
      }
      const entry = entries.get(key) || { timestamps: [], lastSeen: now };
      const limited = entry.timestamps.length >= options.max;
      if (!limited) entry.timestamps.push(now);
      entry.lastSeen = now;
      entries.set(key, entry);
      while (entries.size > maxEntries) {
        const oldest = [...entries.entries()].sort(
          (a, b) => a[1].lastSeen - b[1].lastSeen,
        )[0];
        if (!oldest) break;
        entries.delete(oldest[0]);
      }
      return limited;
    },
    size: () => entries.size,
  };
}
