# Stratégie SEO — NeuroGenesis Academy

_Cadrage réalisé selon la méthode de la skill `seo-plan` (non installée dans cette
session — appliquée manuellement à partir de sa documentation)._

## 1. Positionnement & mots-clés prioritaires

| Priorité | Mot-clé | Intention | Page cible |
|---|---|---|---|
| 1 | formation hypnose Belgique | Commercial | `/` (home) + `/formation-technicien` |
| 2 | hypnothérapeute Namur | Local / navigational | `/fondatrice`, `/contact` |
| 3 | formation certifiante hypnose et neurosciences | Commercial | `/formation-technicien` |
| 4 | cursus praticien hypnose | Commercial | `/formation-praticien` |

Mots-clés secondaires : "école hypnose Namur", "hypnose ericksonienne formation",
"formation neurosciences appliquées", "praticien hypnose certifié Belgique",
"formation hypnothérapeute Jambes".

## 2. Architecture de pages (URLs propres)

```
/                         → hub éditorial : hero, piliers, teasers cursus, campagne, FAQ courte
/formation-technicien     → page pilier Technicien (contenu long, schema Course)
/formation-praticien      → page pilier Praticien (contenu long, schema Course)
/fondatrice               → page E-E-A-T (schema Person)
/faq                      → FAQ complète (schema FAQPage — utile pour les utilisateurs et
                             l'IA générative, même sans rich snippet Google depuis mai 2026)
/contact                  → formulaire réel + NAP (schema LocalBusiness/EducationalOrganization)
```

Maillage interne : le hub `/` fait office de hub, chaque section renvoie vers sa page
pilier ("En savoir plus →"). Chaque page pilier relie vers `/contact` (CTA) et
`/fondatrice` (crédibilité). Toutes les pages sont à ≤2 clics de la home.

## 3. Schema.org (voir `/seo-schema`)

- `EducationalOrganization` + `LocalBusiness` (types combinés) sur `/` et le layout racine
- `Course` × 2 (Technicien, Praticien) sur leurs pages respectives
- `Person` (Marinella Spano) sur `/fondatrice`
- `FAQPage` sur `/faq` — conservé pour l'IA générative et les utilisateurs, sans
  attente de rich snippet Google (retiré pour tous les sites le 7 mai 2026)
- `BreadcrumbList` sur les pages profondes

## 4. E-E-A-T

- **Who** : bio complète de Marinella Spano avec parcours vérifiable (ULB, ACHE,
  spécialisation transgénérationnelle, Libération Quantique) sur `/fondatrice`
- **How** : transparence sur la pédagogie (115h, supervision, méthode) et sur le
  statut d'accréditation (démarche en cours, formulée positivement)
- **Why** : positionnement pédagogique clair — rigueur + bienveillance, jamais un
  argumentaire de vente agressif
- **Trust** : NAP visible partout (footer, `/contact`), formulaire fonctionnel,
  mentions légales, HTTPS (Vercel), pas de faux avis ni statistiques inventées

## 5. SEO local (Namur/Jambes)

- NAP unique centralisé dans `lib/site-config.ts`, répercuté partout (footer,
  `/contact`, schema `LocalBusiness`)
- `geo` (latitude/longitude Jambes) dans le schema
- Ville + service dans les title/H1 des pages pilier
- `tel:` cliquable, adresse visible sans nécessiter de clic

## 6. Technique (voir `/seo-technical` en clôture)

- Rendu SSR/SSG via Next.js App Router → contenu et JSON-LD dans le HTML initial
  (pas d'injection JS tardive, conforme à la doc Google JS SEO déc. 2025)
- `sitemap.xml` et `robots.xml` générés (`app/sitemap.ts`, `app/robots.ts`)
- Balises canonical auto-générées par page
- Core Web Vitals : `next/font`, `next/image`, pas de layout shift (dimensions
  fixes), animation limitée à `transform`/`opacity` (GSAP)
- Headers de sécurité de base dans `next.config.mjs`

## 7. Contenu — planchers de couverture (indicatifs, pas des cibles rigides)

| Page | Plancher |
|---|---|
| Home | 500+ mots |
| `/formation-technicien`, `/formation-praticien` | 800+ mots |
| `/fondatrice` | 600+ mots |
| `/faq` | couverture complète des intentions utilisateures |

## 8. Roadmap

1. Fondation (ce build) : pages piliers, schema, sitemap, formulaire réel
2. Expansion : blog/ressources (articles E-E-A-T : neurosciences, études de cas
   anonymisées, actualité de l'accréditation)
3. Autorité : mentions presse, partenariats professionnels, avis vérifiés (une
   fois les premières promotions diplômées)
