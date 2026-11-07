# JT2J Company — Contrat de conversion Figma → Next.js

**Figma :** https://www.figma.com/design/qeBdozIvoJhps8JGj7ItsS  
**Dépôt cible :** https://github.com/jupi-z/jt2j/tree/feat/jt2j-production  
**Date :** 7 novembre 2026  

## Références dans Figma

- Contrat de conversion : nœud `87:3075`.
- Matrice de routes : nœud `88:3075`.
- Référentiel de contenus bilingue : nœud `73:3075`.
- États d’interaction : nœuds `26:1058` à `26:1267`.

## Contrat de fidélité

Le design validé se trouve dans Figma. Les seules vues précisément dessinées sont les baselines 1440 px (desktop) et 390 px (mobile). La fidélité pixel à pixel ne peut être constatée qu’après implémentation du HTML, du CSS, des assets et tests de captures dans le navigateur. Ne pas rasteriser les écrans entiers.

Next.js doit reprendre les composants réutilisables Header, Footer, Buttons, Hero, Division, Service, FAQ, Contact et conserver les formes vectorielles SVG.

## Routes (FR / EN)

| Page | URL FR | Desktop FR | Mobile FR | URL EN | Desktop EN | Mobile EN |
|---|---|---|---|---|---|---|
| home | `/fr` | `1:2` | `22:694` | `/en` | `19:470` | `22:788` |
| company | `/fr/entreprise` | `13:2` | `23:698` | `/en/entreprise` | `17:392` | `23:954` |
| divisions | `/fr/poles` | `13:64` | `23:745` | `/en/poles` | `17:451` | `23:1001` |
| services | `/fr/services` | `13:120` | `23:785` | `/en/services` | `17:506` | `23:1041` |
| approach | `/fr/approche` | `13:193` | `23:835` | `/en/approche` | `17:577` | `23:1091` |
| contact | `/fr/contact` | `13:238` | `23:871` | `/en/contact` | `17:621` | `23:1127` |
| faq | `/fr/faq` | `13:306` | `23:915` | `/en/faq` | `17:688` | `23:1171` |
| SEC | `/fr/poles/security-biometrics` | `14:80` | `24:818` | `/en/poles/security-biometrics` | `14:301` | `24:1250` |
| LOG | `/fr/poles/logistics-tracking` | `14:121` | `24:854` | `/en/poles/logistics-tracking` | `14:342` | `24:1286` |
| HYG | `/fr/poles/hygiene-pest-control` | `14:163` | `24:890` | `/en/poles/hygiene-pest-control` | `14:384` | `24:1322` |
| BIZ | `/fr/poles/business-marketing` | `14:217` | `24:926` | `/en/poles/business-marketing` | `14:438` | `24:1358` |
| TRV | `/fr/poles/travel-escapes` | `14:259` | `24:962` | `/en/poles/travel-escapes` | `14:480` | `24:1394` |
| pest-control | `/fr/services/pest-control` | `16:210` | `24:998` | `/en/services/pest-control` | `16:483` | `24:1430` |
| cleaning | `/fr/services/cleaning` | `16:249` | `24:1034` | `/en/services/cleaning` | `16:522` | `24:1466` |
| travel-tourism | `/fr/services/travel-tourism` | `16:288` | `24:1070` | `/en/services/travel-tourism` | `16:561` | `24:1502` |
| disinfection-sanitation | `/fr/services/disinfection-sanitation` | `16:327` | `24:1106` | `/en/services/disinfection-sanitation` | `16:600` | `24:1538` |
| facility-management | `/fr/services/facility-management` | `16:366` | `24:1142` | `/en/services/facility-management` | `16:639` | `24:1574` |
| transport-logistics | `/fr/services/transport-logistics` | `16:405` | `24:1178` | `/en/services/transport-logistics` | `16:678` | `24:1610` |
| trading-supply | `/fr/services/trading-supply` | `16:444` | `24:1214` | `/en/services/trading-supply` | `16:717` | `24:1646` |

## Palette CSS

```css
:root {
  --jt2j-navy: #05122C;
  --jt2j-deep: #0B2D58;
  --jt2j-blue: #1686BB;
  --jt2j-gold: #C59A45;
  --jt2j-white: #FFFFFF;
  --jt2j-mist: #F3F6F9;
  --jt2j-ink: #111827;
  --jt2j-sub: #566374;
  --jt2j-soft: #DCE5EF;
  --jt2j-line: #CCD6E0;
  --jt2j-error: #A32D35;
  --jt2j-positive: #126649;
  --jt2j-blue-action: #0B6D9B;
}
```

## Typographies

- Titres : **Barlow Condensed Bold**. H1 56 px / 108 %, H2 42 px / 108 %, H3 27 px / 108 %.
- Corps : **Barlow Regular**, 18 px / 145 %. Légendes 14 px / 145 %.
- Respecter les valeurs mesurées sur les maquettes mobiles plutôt que d’appliquer ces tailles desktop uniformément.

## Responsive et accessibilité

- Maquettes de référence : 390 et 1440 px.
- Tests impératifs à 320, 360, 390, 430, 768, 1024 et 1440 px.
- Approche fluide et réactive entre deux baselines ; tablette non approuvée par une maquette spécifique.
- Réduction des animations, focus clavier, labels de formulaire, messages `aria-live`, menu Escape et états FAQ accessibles.

## États d’interaction

| État | Figma |
|---|---|
| desktop-menu | `26:1058` |
| mobile-menu | `26:1077` |
| language | `26:1096` |
| filter | `26:1109` |
| filter-empty | `26:1126` |
| faq-expanded | `26:1137` |
| contact-initial | `26:1149` |
| contact-invalid | `26:1166` |
| contact-loading | `26:1186` |
| contact-error | `26:1203` |
| contact-server-success | `26:1220` |
| contact-disabled | `26:1237` |
| cookie-preferences | `26:1253` |
| accessibility | `26:1267` |

## Priorités d’implémentation

1. Charger les fonts et tokens sans substitution.
2. Construire l’en-tête, le pied de page, les boutons et les sections réutilisables.
3. Reproduire l’accueil à 1440 et 390 px, vérifier par superposition visuelle.
4. Décliner les sept pages génériques, les cinq pôles et les sept fiches services dans les deux langues.
5. Implémenter les quatorze états et les interactions sans inventer d’opérations backend.
6. Comparer les 76 captures de référence (38 routes × 2 largeurs), puis tester les largeurs intermédiaires.
7. Bloquer la publication tant que contenus, droit des images, logo officiel, politique de confidentialité et essais de soumission réelle ne sont pas approuvés.

## Limites et statut

- **Prêt comme spécification de démarrage Next.js** : oui, les références et identités ont été cartographiées.
- **Ready-to-publish / équivalence visuelle prouvée** : non, ces validations exigent du code rendu et des tests réels.
- Le README de la branche actuelle décrit un chantier et n’atteste pas un déploiement en production.
- Les anciens slugs Figma `/company`, `/expertise`, `/approach` ont été harmonisés avec les slugs canoniques `/entreprise`, `/poles`, `/approche`.

---
Source : fichier Figma JT2J (références de nœuds ci-dessus) et dépôt connecté `jupi-z/jt2j` : `src/routing/catalog.ts`, `src/content/seed/pages.ts`, `README.md`.