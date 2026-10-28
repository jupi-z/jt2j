import type { ReactNode } from 'react';
import { Brand } from './Brand';
import { LocaleSwitch } from './LocaleSwitch';
import type {
  Locale,
  LocaleLink,
  NavigationGroup,
  NavigationLink,
} from './navigation';

export interface FooterProps {
  home: NavigationLink;
  brandLabel?: string;
  description?: string;
  tagline?: string;
  groups: readonly NavigationGroup[];
  copyright: string;
  contact?: ReactNode;
  localeSwitch?: {
    label: string;
    locale: Locale;
    links: readonly LocaleLink[];
  };
}

export function Footer({
  home,
  brandLabel,
  description,
  tagline,
  groups,
  copyright,
  contact,
  localeSwitch,
}: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand home={home} label={brandLabel} />
            {description && <p>{description}</p>}
            {tagline && <div className="footer-tagline">{tagline}</div>}
          </div>
          {groups.map((group) => (
            <nav
              className="footer-col"
              key={group.label}
              aria-label={group.label}
            >
              <h2>{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={link.current ? 'page' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          {contact && <div className="footer-col">{contact}</div>}
        </div>
        <div className="footer-bottom">
          <p>{copyright}</p>
          {localeSwitch && <LocaleSwitch {...localeSwitch} />}
        </div>
      </div>
    </footer>
  );
}
