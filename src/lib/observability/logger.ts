const sensitiveKey =
  /(password|secret|token|authorization|cookie|api[-_]?key|email|phone|name|message|address|ip)/i;

export function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitive);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        sensitiveKey.test(key) ? '[REDACTED]' : redactSensitive(child),
      ]),
    );
  }
  return value;
}

export function createLogger(
  sink: (line: string) => void = (line) => console.log(line),
) {
  const write = (
    level: string,
    event: string,
    data: Record<string, unknown> = {},
  ) => {
    sink(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        event,
        ...(redactSensitive(data) as Record<string, unknown>),
      }),
    );
  };
  return {
    info: (event: string, data?: Record<string, unknown>) =>
      write('info', event, data),
    warn: (event: string, data?: Record<string, unknown>) =>
      write('warn', event, data),
    error: (event: string, data?: Record<string, unknown>) =>
      write('error', event, data),
  };
}
