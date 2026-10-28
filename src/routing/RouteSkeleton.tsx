import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { routing, localePath } from '@/i18n/config';
import {
  divisionRoutes,
  serviceRoutes,
  pageRoutes,
  findRoute,
} from './catalog';
import { requireLocale } from './seo';

export async function renderRoute(value: string, path: string) {
  const locale = requireLocale(value);
  const route = findRoute(path);
  if (!route) notFound();
  const t = await getTranslations({ locale });
  const home = { href: localePath(locale), label: t('pages.HOME') };
  const links = pageRoutes
    .filter((item) => item.path !== '' && item.path !== '/contact')
    .map((item) => ({
      href: localePath(locale, item.path),
      label: t(item.message),
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
    label: t('pages.CONTACT'),
    current: path === '/contact',
  };
  const children =
    path === '/poles'
      ? divisionRoutes
      : path === '/services'
        ? serviceRoutes
        : [];
  return (
    <>
      <Header
        home={home}
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
      />
      <main id="main" tabIndex={-1}>
        <section className="section wrap">
          <h1>{t(route.message)}</h1>
          <p>{t('placeholder')}</p>
          {children.length > 0 && (
            <ul>
              {children.map((item) => (
                <li key={item.path}>
                  <a href={localePath(locale, item.path)}>{t(item.message)}</a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer
        home={home}
        groups={[
          { label: t('navigation'), links: [...links, contact] },
          { label: t('pages.EXPERTISE'), links: divisions },
        ]}
        copyright="JT2J"
        localeSwitch={{ label: t('languageLabel'), locale, links: localeLinks }}
      />
    </>
  );
}
