import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { routing, localePath } from '@/i18n/config';
import { divisionRoutes, pageRoutes, findRoute } from './catalog';
import { requireLocale } from './seo';
import { getPublicContent } from '@/queries/loadPublicContent';
import { PublicRouteContent } from '@/components/public/PublicRouteContent';

export async function renderRoute(value: string, path: string) {
  const locale = requireLocale(value);
  const route = findRoute(path);
  if (!route) notFound();
  const t = await getTranslations({ locale });
  const fr = locale === 'fr';
  const home = { href: localePath(locale), label: fr ? 'JT2J Company — Accueil' : 'JT2J Company — Home' };
  const links = pageRoutes
    .filter((item) => !['', '/contact', '/faq'].includes(item.path))
    .map((item) => ({
      href: localePath(locale, item.path),
      label: item.path === '/entreprise'
        ? (fr ? "L'entreprise" : 'Company')
        : item.path === '/poles'
          ? (fr ? 'Nos pôles' : 'Our divisions')
          : item.path === '/approche'
            ? (fr ? 'Notre approche' : 'Our approach')
            : t(item.message),
      current: path === item.path || path.startsWith(`${item.path}/`),
    }));
  const localeLinks = routing.locales.map((language) => ({
    locale: language,
    href: localePath(language, path),
    label: t(`languages.${language}`),
  }));
  const divisions = divisionRoutes.map((item) => ({
    href: localePath(locale, item.path),
    label: t(item.message),
    current: path === item.path,
  }));
  const contact = {
    href: localePath(locale, '/contact'),
    label: fr ? 'Contact' : 'Contact',
    current: path === '/contact',
  };
  const queries = await getPublicContent();
  return (
    <>
      <Header
        home={home}
        brandLabel={fr ? 'COMPANY\nGROUPE MULTISERVICES' : 'COMPANY\nMULTISERVICE GROUP'}
        links={links}
        locale={locale}
        localeLinks={localeLinks}
        labels={{
          navigation: t('navigation'),
          languages: t('languageLabel'),
          openMenu: t('openMenu'),
          closeMenu: t('closeMenu'),
          skip: t('skip'),
        }}
        mega={{ label: t('browseDivisions'), links: divisions }}
        cta={contact}
        theme={path === '' ? 'dark' : 'light'}
      />
      <main id="main" tabIndex={-1}>
        <PublicRouteContent locale={locale} path={path} queries={queries} />
      </main>
      <Footer
        home={home}
        brandLabel={fr ? 'COMPANY\nGROUPE MULTISERVICES' : 'COMPANY\nMULTISERVICE GROUP'}
        description={fr ? 'Des services pour les particuliers et les entreprises, à Lubumbashi et Kolwezi.' : 'Services for individuals and businesses in Lubumbashi and Kolwezi.'}
        tagline={fr ? "L'innovation pour tous vos besoins." : 'Innovation for all your needs.'}
        groups={[
          { label: t('navigation'), links: [...links, contact] },
          { label: t('pages.EXPERTISE'), links: divisions },
        ]}
        copyright="JT2J"
        contact={<><h2>{fr ? 'Coordonnées' : 'Contact details'}</h2><a href="mailto:info@jt2j.com">info@jt2j.com</a><a href="tel:+243974004510">+243 974 004 510</a><span className="foot-text">@jt2jcompany</span><span className="foot-text">Lubumbashi et Kolwezi<br />{fr ? 'République démocratique du Congo' : 'Democratic Republic of the Congo'}</span></>}
        localeSwitch={{ label: t('languageLabel'), locale, links: localeLinks }}
      />
    </>
  );
}
