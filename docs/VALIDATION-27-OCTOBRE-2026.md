# Complément de validation — 27 octobre 2026

La PR #2 est complétée pour appliquer la bascule du 31 octobre à 09:00
Europe/Brussels à tous les points d'entrée de réservation. La date officielle,
les tarifs et la brochure de la PR sont conservés.

## Comportement

- Avant l'échéance : les liens et sélections habituels sont conservés.
- À partir de l'échéance : les boutons génériques et Technicien ouvrent la liste
  prioritaire du prochain cycle. Cela comprend le menu mobile, la barre mobile,
  le haut de page, le pied de page, le bandeau et la page Technicien.
- Le bouton Pack conserve le choix Pack et affiche « Pack du prochain cycle ».
  Le formulaire précise que la demande concerne le prochain cycle Technicien.
- Le Praticien reste accessible séparément, avec son prérequis Technicien acquis.
- Les anciens liens directs Technicien et Pack restent utilisables et sont
  interprétés comme des demandes pour le prochain cycle après l'échéance.
- Le serveur détermine le cycle au moment de l'envoi, y compris si le formulaire
  a été ouvert avant 09:00. Il ajoute cette précision à la notification interne
  et à la confirmation du demandeur, en conservant le parcours choisi.
- La page Technicien indique le cycle en cours après l'échéance ; son calendrier
  est explicitement intitulé « Calendrier du cycle 2026–2027 ».
- Les dates du futur cycle ne sont pas inventées. Elles seront précisées lors
  de l'échange individuel.

## Vérifications locales réalisées

- `node tests/regression.mjs` : validation des formulaires, erreurs d'envoi,
  pièce jointe, anti-spam, liens et formulaires rendus avant/à/après l'échéance,
  distinction Pack/Praticien et rattachement du cycle dans les e-mails simulés.
- `npm run build` : compilation et validation TypeScript réussies.
- `node tests/pages.mjs` : neuf pages HTTP 200, métadonnées et tarifs structurés,
  présélections des quatre parcours et disponibilité du PDF.
- `node tests/cycle-pages.mjs` : vérification de l'application compilée à
  08:59:59.999, à 09:00 le 31 octobre et le lendemain, heure belge. Les liens
  réellement rendus, le compteur, le calendrier et les sélections sont contrôlés.
  L'horloge est simulée uniquement dans les processus de test locaux.
- `git diff --check` : aucune erreur d'espacement.

Ces tests n'envoient aucun e-mail réel et ne modifient aucun déploiement.

## Validation distante et publication

La prévisualisation Vercel doit être vérifiée au commit complété : parcours
mobile et ordinateur, onglet restant ouvert à la bascule, réception réelle des
trois types de demandes, notifications internes, confirmations et bon PDF.
Vérifier les variables RESEND_API_KEY, CONTACT_FROM_EMAIL et CONTACT_TO_EMAIL
dans les environnements Preview et Production sans afficher les secrets.

Les vérifications du 27 octobre ont confirmé le domaine Resend validé et des
livraisons réelles du circuit de brochure existant. Elles ne valident pas les
nouveaux envois de la PR.

La mention concernant la TVA reste à préciser avec Marinella ; aucun changement
fiscal ou tarifaire n'est introduit par ce complément.

La fusion dans main et toute modification de production nécessitent l'accord
explicite de Marinella sur la version finale présentée.
