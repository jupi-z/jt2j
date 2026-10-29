import type { Locale, LocaleLink } from './navigation';

export function LocaleSwitch({
  label,
  locale,
  links,
}: {
  label: string;
  locale: Locale;
  links: readonly LocaleLink[];
}) {
  return (
    <nav className="locale" aria-label={label}>
      {links.map((link) => (
        <a
          key={link.locale}
          href={link.href}
          hrefLang={link.locale}
          lang={link.locale}
          aria-label={link.label}
          aria-current={locale === link.locale ? 'true' : undefined}
        >
          {link.locale.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
