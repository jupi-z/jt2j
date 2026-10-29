# JT2J — rapport de parité avec le prototype

Date de vérification : 2026-10-30

## Référence

La source canonique de l'interface publique est `docs/reference/JT2J_Prestige_Prototype.html`, également fournie par le fichier client mentionné dans la demande. Les textes, routes, états bilingues et structures visuelles ont été comparés aux fonctions de rendu du prototype (`home`, `company`, `expertise`, `division`, `services`, `service`, `approach`, `faq`, `contact`).

## État livré

- Accueil : hero sombre, localisation, titre éditorial, CTA, artwork, rail des cinq pôles, introduction, services, engagements et appel de contact.
- Pages institutionnelles : entreprise, pôles, approche, FAQ et contact avec gabarits dédiés et contenus bilingues.
- Pages métier : cinq pages de pôles et sept pages de services avec hero, artwork, sous-navigation, sections éditoriales, liens contextuels et CTA.
- Catalogue services : recherche, filtres par pôle, résultat accessible et CTA final.
- Contact : formulaire structuré comme le prototype (objet, pôle, service, identité, organisation, e-mail, téléphone, ville, message, consentement) tout en conservant la protection CSRF, le honeypot, la limitation de débit, la déduplication et la notification existantes.
- Persistance : migration `20261030_003000_lead_form_context` pour `intent` et `city` dans les leads.

## Vérifications exécutées

- `pnpm vitest run tests/public/prototype-parity.spec.tsx` : PASS.
- `pnpm vitest run tests/public/routes.spec.tsx tests/payload/access-control.test.ts -t "renders published content|restricts lead records"` : PASS, 39 tests passés, 11 ignorés.
- `pnpm test` : PASS, 21 fichiers, 183 tests.
- `pnpm typecheck` : PASS.
- `pnpm lint` : PASS avec `--max-warnings 0`.
- `pnpm build` : PASS, génération Next.js terminée et routes publiques produites.
- `pnpm audit --audit-level=high` : PASS au seuil high après l'override `graphql-scalars >=2.0.1` ; un avis low transitive reste signalé.
- Migration Payload de contexte lead : appliquée puis rollback/rejouée par la suite de tests Payload.

## Vérification visuelle manuelle

Routes observées dans le navigateur local :

- `/fr` : hero sombre, hiérarchie typographique et CTA conformes à la référence.
- `/fr/contact` : hero clair, coordonnées et formulaire responsive sans chevauchement.
- `/fr/poles/security-biometrics` : hero de pôle sombre, artwork et CTA contextuel.
- `/fr/services` : hero catalogue, recherche, filtres et sept services visibles.

Le badge Next.js visible sur les captures appartient uniquement au mode développement local et ne fait pas partie du rendu de production.

## CI GitHub

Le premier run du commit `bc9a65c` a validé PostgreSQL, l'installation verrouillée, les migrations, les 183 tests, le typecheck et le lint. Il s'est arrêté sur l'audit high à cause de `graphql-scalars@1.22.2` apporté par Payload. L'override workspace vers `>=2.0.1` est maintenant en place ; un nouveau run doit confirmer la correction distante.

## Limites restantes

- Le panneau Payload `/admin` est maintenant monté via l'intégration officielle `@payloadcms/next`, avec son import map, ses routes REST et ses composants éditoriaux. Sa vérification interactive exige une base PostgreSQL disponible et un compte utilisateur ; le poste local de contrôle n'en fournissait pas.
- `pnpm cms:types` nécessite les variables d'environnement CMS (`DATABASE_URL` et `PAYLOAD_SECRET`) ; le typecheck et les tests utilisent en revanche la configuration compilée et les migrations contrôlées.
- La validation éditoriale/business de JT2J et les secrets d'infrastructure restent des décisions externes au contrôle technique.
