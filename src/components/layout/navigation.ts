import type { locales } from '../../content/types';

/** Destinations and localized labels are resolved by the route/content layer. */
export type Locale = (typeof locales)[number];
export interface NavigationLink {
  href: string;
  label: string;
  current?: boolean;
  description?: string;
}
export interface LocaleLink extends NavigationLink {
  locale: Locale;
}
export interface NavigationGroup {
  label: string;
  links: readonly NavigationLink[];
}
export interface NavigationLabels {
  navigation: string;
  languages: string;
  openMenu: string;
  closeMenu: string;
}
