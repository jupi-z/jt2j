# JT2J — Mission Codex : conformité Figma V2, développement Next.js et 43 images

> **Consigne impérative : l'identité visuelle validée est le Figma JT2J du 7 novembre 2026, PAS le prototype HTML historique.** Ce document est opérationnel pour Codex, mais ne prétend pas que l'implémentation ou les images sont déjà terminées.

## Sources à lire avant toute modification

1. `AGENTS.md`, puis les guides **installés localement** dans `node_modules/next/dist/docs/` pour Next.js 16.4.3. Ne pas recopier d'API obsolète.
2. `docs/figma/JT2J_Figma_NextJS_Handoff.md` et `docs/figma/JT2J_Figma_NextJS_Mapping.json` ; Figma : `https://www.figma.com/design/qeBdozIvoJhps8JGj7ItsS`.
3. Les frames Figma de contrat `87:3075`, de matrice `88:3075`, d'éditorial `73:3075`, d'interactions `26:1058` à `26:1267`.
4. `docs/figma/JT2J_43_prompts_universels.md` (**43 prompts complets et autonomes**) et `docs/figma/image-generation-manifest.json`.
5. `src/routing/catalog.ts`, `src/content/seed/`, `src/queries/publicContent.ts`, `src/styles/`, `src/components/`, `tests/`, `docs/content/editorial-guide.md`, `docs/operations/handover.md`.

La branche technique `feat/jt2j-production` est déjà un chantier avancé : Next.js 16, React 19, contenu Payload, formulaires sécurisés, CI et tests. **Ne rien écraser ou reconstruire inutilement.** Le rapport `docs/qa/prototype-parity-report.md` est une référence historique datée du 30 octobre ; sa validation n'est pas une validation du Figma V2.

## Séquence d'exécution

### 0 — Inventaire et sauvegarde des preuves

- Vérifier le HEAD de la branche et les modifications concurrentes, les 38 routes, les composants et les tests existants.
- Conserver le modèle Payload, ses migrations, le contrôle des accès, les flux de leads et ses protections : CSRF, validation Zod, anti-abus, idempotence, consentement, notifications et sauvegarde.
- Établir une checklist de tous les écrans/états depuis le JSON de mapping. Ne pas partir de captures d'écran réassemblées ni d'un unique template générique.

### 1 — Fondations exactes du nouveau design

- Établir les variables CSS et références de typographie à partir de Figma, pas du prototype : Navy `#05122C`, Deep `#0B2D58`, Blue `#1686BB`, Blue Action `#0B6D9B`, Gold `#C59A45`, White `#FFFFFF`, Mist `#F3F6F9`, Ink `#111827`, Sub `#566374`, Soft `#DCE5EF`, Line `#CCD6E0`.
- Titres : Barlow Condensed Bold ; corps : Barlow Regular ; conserver la casse, le tracking, les interlignes et les tailles par viewport relevés dans Figma. Vérifier les licences et charger les vraies polices dans Next.js (sans simuler par Georgia/Arial).
- Remplacer progressivement le style ancien sur des composants adaptés, sans casser les comportements. Préserver les SVG éditables, les courbes vectorielles, dégradés, séparateurs et compositions validées.
- Composants React réutilisables : header desktop/mobile, footer, navigation, button, editorial hero, tuiles de pôles, catalogue de services, détail pôle/service, FAQ accessible, formulaire, messages d'état.
- Ne jamais aplatir la page en PNG, Canvas ou élément unique. Utiliser HTML sémantique, CSS Grid/Flex, SVG et `next/image` lorsque pertinent.

### 2 — Les 38 routes / 76 maquettes

- Construire les pages dans l'ordre : accueil FR/EN, pages institutionnelles, cinq pôles, sept services. Ne changer aucun slug existant : `/fr/entreprise`, `/en/entreprise`, `/fr/poles`, `/fr/approche`, et correspondants anglais ; détails `/poles/{slug}` et `/services/{slug}`.
- Conserver exactement les 19 identités × 2 langues présentes dans `JT2J_Figma_NextJS_Mapping.json`, et choisir les deux frames (1440 et 390 px) pour chaque URL.
- Conserver le FR/EN intentionnel, titres, métadonnées et textes approuvés. Les seeds et notes sont `draft`/non approuvés tant qu'un responsable ne publie pas via Payload : ne jamais contourner cette protection pour rendre une capture esthétique.
- Traiter 320, 360, 430, 768 et 1024 px par interpolation responsive avec vérification de l'absence de débordement, non par maquettes imaginaires.
- Corriger toutes divergences entre la géométrie Figma et le rendu, y compris hero asymétrique, panneaux décalés, bandeaux, boutons, alignements, marges et types de sections. Une seule page identique ne vaut pas validation du site entier.

### 3 — Images : exécution par Codex, pas par ChatGPT

- **Générer toi-même exactement les 43 images** à partir des 43 prompts NUMÉROTÉS et COMPLETS de `JT2J_43_prompts_universels.md`. Chaque prompt décrit toute la scène, n'ajoute aucun préambule de contexte et ne doit pas être raccourci.
- `image-generation-manifest.json` indique l'ID, le ratio, les dimensions conseillées, la route, la frame Figma et le chemin WebP. Utiliser ces chemins canoniques dans `public/images/editorial/`.
- Travailler en lots : 01–17 accueil, 18–24 institutionnel, 25–29 pôles, 30–43 services. Générer **une image distincte par ID**, examiner anatomie, mains, perspectives, nombre exact de personnages/objets, absence d'inscriptions et cohérence des couleurs. Corriger toute imperfection par nouvelle génération documentée.
- Compresser avec soin, conserver un master et des variantes si les compositions desktop/mobile l'exigent ; respecter les ratios et `object-position` selon les frames. Ne pas ajouter d'eau, d'effets, de texte ou de logo dans les images.
- Ces scènes sont **fictives** : ne les décrire ni comme photographies réelles des équipes JT2J ni comme chantiers ou clients documentés. Elles ne prouvent aucune prestation.
- Vérifier l'adéquation réelle avec le design : lorsqu'une frame utilise une illustration SVG et ne possède pas de slot photographique correspondant, préserver le SVG. Mettre l'image dans la médiathèque pour examen, sans imposer une modification de layout non validée.
- Compléter le manifeste après génération : `status: generated` UNIQUEMENT si le WebP existe et a été contrôlé ; renseigner les alternatives FR/EN pertinentes ou, si elle est purement décorative, définir `decorative: true`, `alt_fr: ""` et `alt_en: ""`. **Laisser `publicationApproved: false` tant qu'un humain n'a pas confirmé droits, représentations et publication.**
- Si l'environnement Codex ne permet pas de générer les images : déclarer le blocage précis. Ne PAS remplacer par des photos aléatoires, un lien externe, un SVG peint ou des placeholders faussement finalisés.

### 4 — UX, états, accessibilité

- Implémenter et contrôler les quatorze états Figma : menus, locale conservant la route, filtres, résultat vide, FAQ, formulaire initial/invalide/envoi/échec/succès vérifié/indisponible, préférences de cookies conditionnelles et navigation clavier.
- Le formulaire enregistre exclusivement les identifiants canoniques des cinq pôles et sept services ; la pré-sélection depuis `?division=` ou `?service=` doit être valide et sans entrée arbitraire.
- Ne pas prétendre qu'une demande est enregistrée avant réponse de l'API. Rester prudent sur les messages de confidentialité et sur les opérations commerciales non validées.
- Travailler sans animations inutiles, soutenir `prefers-reduced-motion`, aria-expanded, labels, focus, validation serveur, retour erreur et navigation tactile.

### 5 — Tests et preuves

- Vérifier le contrat des prompts et routes : `pnpm qa:figma`.
- Après génération des 43 fichiers, exécuter `pnpm qa:figma-images` (doit échouer tant que les images ne sont pas effectivement présentes et marquées générées).
- Après validation humaine des médias, `pnpm qa:figma-publication` (doit échouer tant que les alternatives FR/EN et les preuves d'autorisation manquent).
- Exécuter `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm e2e` dans l'environnement du dépôt, sans supprimer/ignorer les tests existants.
- Vérifier réellement, avec Playwright ou équivalent, les **76 comparaisons** (38 URL × 2 largeurs) aux frames Figma. Produire un rapport d'écarts reproductible, des captures et une correction des écarts avant toute déclaration « pixel-perfect ».
- Tester tous les breakpoints 320 / 360 / 390 / 430 / 768 / 1024 / 1440, focus/clavier, navigation FR/EN, bonnes URLs, consentement, backend mock vs réel clairement distingués.
- Le déploiement reste exclu tant que l'approbation juridique, les contenus, les images, les accès, les sauvegardes et la recette métier réelle ne sont pas documentés.

## Définition de done

- 38 routes exactes, 76 références Figma traitées, 14 interactions fonctionnelles ; styles strictement conformes au Figma validé sur baselines 390/1440 ;
- 43 images générées et vérifiées dans les chemins du manifeste, ou blocage de génération explicitement documenté ; publication bloquée si approbations manquantes ;
- Code Next.js propre, modulaire, performant, accessible et testé, sans régression de sécurité Payload ;
- Tests locaux/CI réellement exécutés avec résultats et captures datés. **Ne pas déclarer la fidélité absolue avant validation visuelle complète.**

Pour démarrer dans Codex, lire ce document, réaliser l'inventaire, puis **exécuter les étapes sans redemander les décisions déjà prises**. Ne pas fusionner et ne pas déployer sans preuve des critères concernés.
