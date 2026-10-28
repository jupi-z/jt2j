import type { Locale } from '@/i18n/config';

export function NotFoundContent({
  locale,
  title,
  home,
}: {
  locale: Locale;
  title: string;
  home: string;
}) {
  return (
    <main id="main" tabIndex={-1} className="section wrap">
      <h1>{title}</h1>
      <a href={`/${locale}`}>{home}</a>
    </main>
  );
}
