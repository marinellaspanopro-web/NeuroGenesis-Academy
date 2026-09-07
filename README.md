# NeuroGenesis Academy — Site web

Site Next.js 14 (App Router, TypeScript, Tailwind) pour NeuroGenesis Academy,
école de formation en hypnose &amp; neurosciences à Namur, fondée par Marinella
Spano. Voir `docs/SEO-STRATEGY.md` pour le cadrage SEO complet.

## 1. Installer Node.js (obligatoire — absent de cette machine)

Ce projet nécessite Node.js 18.18+ (recommandé : 20 LTS). Sur macOS, la façon
la plus simple :

```bash
brew install node@20
```

Ou via [nvm](https://github.com/nvm-sh/nvm) :

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 20
nvm use 20
```

Vérifier ensuite :

```bash
node -v && npm -v
```

## 2. Installer les dépendances

```bash
cd "Site NeuroGenesis"
npm install
```

## 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Puis remplir `.env.local` :

- `RESEND_API_KEY` : créez un compte sur [resend.com](https://resend.com)
  (gratuit jusqu'à 3 000 emails/mois), générez une clé API dans Settings → API
  Keys, et collez-la ici. **Sans cette clé, le formulaire de contact répond
  une erreur claire à l'utilisateur plutôt que d'échouer silencieusement.**
- `CONTACT_TO_EMAIL` : adresse qui reçoit les messages (par défaut
  `info@neurogenesis.academy`).
- `CONTACT_FROM_EMAIL` : adresse d'expédition. Tant que le domaine
  `neurogenesis.academy` n'est pas vérifié sur Resend, gardez
  `onboarding@resend.dev` (limité aux tests). Une fois le domaine vérifié
  (Resend → Domains → Add Domain, puis ajout des enregistrements DNS fournis),
  passez à une adresse `@neurogenesis.academy`.

## 4. Lancer en local

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## 5. Logo & photo de la fondatrice

Le logo (`components/ui/Logo.tsx` + `public/logo/*.svg`) a été retracé
vectoriellement à partir du vrai logo de la marque (icône réseau neuronal en
forme de cerveau + wordmark script "Neuro"/"GENESIS") dans les 3 variantes :

1. Logo crème/or pâle sur fond blanc → `public/logo/logo-gold-on-white.svg`
2. Logo vert forêt sur fond blanc/crème → `public/logo/logo-forest.svg`
3. Logo crème/or sur fond vert forêt → `public/logo/logo-gold-on-forest.svg`

C'est une reconstruction fidèle (tracée à la main depuis le logo officiel),
pas le fichier vectoriel source exact. Si un fichier AI/EPS/SVG source existe,
il peut remplacer ces 3 SVG directement (mêmes noms de fichiers) pour une
précision parfaite. Le favicon (`app/icon.svg`) reprend l'icône seule.

La photo de Marinella Spano (`public/images/marinella-spano.webp` + `.jpg`,
recadrée depuis la bannière de marque fournie) est utilisée sur la page
[/fondatrice](http://localhost:3000/fondatrice) (portrait) et en avatar rond
sur la section fondatrice de la home.

## 6. Brochure PDF

Le bouton "Télécharger la brochure" du hero pointe actuellement vers un
`mailto:` pré-rempli (aucun PDF n'a été fourni). Pour proposer un vrai
téléchargement : déposez le PDF dans `public/brochure-neurogenesis.pdf` et
changez le `href` du bouton dans `components/home/Hero.tsx` vers
`/brochure-neurogenesis.pdf`.

## 7. Déploiement sur Vercel

```bash
npm install -g vercel
vercel
```

Ou via l'interface [vercel.com](https://vercel.com) : importer le dépôt Git,
puis renseigner les 3 variables d'environnement de l'étape 3 dans
Project Settings → Environment Variables avant le premier déploiement.

Après déploiement, mettre à jour `siteConfig.url` dans `lib/site-config.ts`
avec le domaine définitif si différent de `neurogenesis.academy`.

## 8. Avant mise en production — checklist SEO technique

- [ ] Vérifier `npm run build` sans erreur
- [ ] Confirmer `siteConfig.url` = domaine final (impacte sitemap, robots, schema)
- [ ] Domaine Resend vérifié + `CONTACT_FROM_EMAIL` mis à jour
- [ ] Tester l'envoi réel du formulaire de contact
- [ ] Remplacer les 3 logos SVG par les fichiers vectoriels source si disponibles (reconstruction fidèle déjà en place sinon)
- [ ] Ajouter le PDF de brochure (étape 6) si souhaité
- [ ] Auditer avec PageSpeed Insights (cibles : LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Valider le JSON-LD avec le [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Soumettre `sitemap.xml` à Google Search Console

## Structure du projet

```
app/                    Pages (App Router) : /, /formation-technicien,
                        /formation-praticien, /fondatrice, /faq, /contact,
                        /mentions-legales, /api/contact, sitemap.ts, robots.ts
components/
  layout/               Header, Footer, StickyMobileCTA, SmoothScrollProvider
  home/                 Sections de la page d'accueil
  shared/               ContactForm, FAQAccordion, Countdown, JsonLd, RevealOnScroll
  ui/                   Button, Logo
lib/                    site-config (NAP), schema.ts (JSON-LD), fonts, gsap,
                        contact-schema (validation Zod), données FAQ/cursus
docs/SEO-STRATEGY.md    Stratégie SEO complète
```
