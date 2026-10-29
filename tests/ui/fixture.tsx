import { createRoot } from 'react-dom/client';
import { Header } from '../../src/components/layout/Header';
import { Footer } from '../../src/components/layout/Footer';
import { AbstractArtwork } from '../../src/components/art/AbstractArtwork';
import { SectionHeading } from '../../src/components/ui/SectionHeading';
import { Button } from '../../src/components/ui/Button';
import { LinkArrow } from '../../src/components/ui/LinkArrow';
import { Breadcrumbs } from '../../src/components/ui/Breadcrumbs';
import '../../src/styles/tokens.css';
import '../../src/styles/typography.css';
import '../../src/styles/globals.css';

// Test-only content. No production route, editorial seed, or CMS dependency.
const home = { href: '#main', label: 'JT2J Company' };
const links = [
  { href: '#company', label: 'Entreprise', current: true },
  { href: '#services', label: 'Services' },
  { href: '#approach', label: 'Approche' },
];
const localeLinks = [
  { href: '#fr', label: 'Français', locale: 'fr' as const },
  { href: '#en', label: 'English', locale: 'en' as const },
];
const mega = {
  label: 'Pôles',
  links: Array.from({ length: 5 }, (_, i) => ({
    href: `#pole-${i}`,
    label: `Pôle ${i + 1}`,
    description: 'Description de démonstration du composant.',
  })),
};

createRoot(document.getElementById('root')!).render(
  <>
    <Header
      home={home}
      brandLabel={'COMPANY\nGROUPE MULTISERVICES'}
      links={links}
      mega={mega}
      locale="fr"
      localeLinks={localeLinks}
      labels={{
        skip: 'Aller au contenu',
        navigation: 'Navigation principale',
        languages: 'Langues',
        openMenu: 'Ouvrir le menu',
        closeMenu: 'Fermer le menu',
      }}
      cta={{ href: '#contact', label: 'Demander un devis' }}
    />
    <main id="main" tabIndex={-1}>
      <div className="wrap">
        <Breadcrumbs
          label="Fil d’Ariane"
          items={[{ label: 'Accueil', href: '#home' }, { label: 'Fondations' }]}
        />
      </div>
      <section className="section wrap" aria-labelledby="sample-title">
        <SectionHeading
          level={1}
          id="sample-title"
          eyebrow="Fondations visuelles"
          title="L’innovation pour tous vos besoins."
          description="Aperçu des composants partagés du site JT2J."
        />
        <div className="fixture-grid">
          <div>
            <p>
              Une typographie éditoriale et des compositions abstraites issues
              du prototype.
            </p>
            <div className="actions">
              <Button href="#contact">Demander un devis</Button>
              <LinkArrow href="#company">Découvrir l’entreprise</LinkArrow>
              <Button variant="outline">Action</Button>
            </div>
          </div>
          <AbstractArtwork />
        </div>
      </section>
    </main>
    <Footer
      home={home}
      brandLabel="COMPANY"
      description="Description de démonstration."
      tagline="Signature de démonstration"
      groups={[
        { label: 'Navigation', links },
        { label: 'Pôles', links: mega.links },
      ]}
      copyright="© JT2J — aperçu de test"
      localeSwitch={{
        label: 'Langues du pied de page',
        locale: 'fr',
        links: localeLinks,
      }}
    />
  </>,
);
