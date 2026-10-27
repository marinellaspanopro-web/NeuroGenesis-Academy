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

## Validation distante réalisée le 27 octobre 2026

Version applicative testée : `422d50fcd5fa4103ff20eb5ccd1cabbd0f5a0608`.
Déploiement Preview Vercel : `dpl_FwsPzBnM353QzCsp3Wv5tTkKSSeu`, état READY.
Les modifications ultérieures de ce rapport ne changent pas le code testé.

- Accueil, Technicien, Praticien, FAQ, contact et inscription : HTTP 200.
  Les anciens tarifs promotionnels sont absents des pages contrôlées.
  Prix affichés : Technicien 1 899 €, Praticien 2 750 €, Pack 4 149 €.
- Navigation réelle dans le navigateur : le bouton Pack présélectionne Pack ;
  le choix prochain cycle affiche sa précision ; la demande de renseignements
  conserve la question obligatoire pour le choix Technicien ; le téléphone
  devient obligatoire pour la préférence de contact téléphonique.
- RESEND_API_KEY, CONTACT_FROM_EMAIL et CONTACT_TO_EMAIL sont présentes pour
  Preview et Production. Seule leur présence a été vérifiée, sans lire ni
  afficher leurs valeurs sensibles.
- Trois soumissions réelles via les formulaires de la Preview, marquées TEST,
  ont été adressées à la boîte publique de l'Académie. Aucun prospect contacté.
  Renseignements à 21:17, inscription au prochain cycle avec brochure à 21:18,
  brochure autonome à 21:20, heure de Bruxelles : les trois écrans de succès
  ont été observés. Resend indique delivered pour les six messages attendus
  (trois notifications internes et trois confirmations).
- La notification et la confirmation de l'inscription précisent bien le
  prochain cycle. La pièce jointe de cette confirmation a été téléchargée et
  comparée à celle de la PR : identité SHA-256 confirmée,
  `6019f4b803745546e9e95b33000d43197b6689fc0e0ed2fd51ca8ddda24d04c2`,
  taille 1 756 396 octets. Le mail de brochure autonome comporte également une
  pièce jointe de ce nom et de cette taille ; le PDF public de la Preview répond 200.

Le statut delivered confirme l'acceptation par le serveur destinataire ; il ne
prouve pas le classement dans la boîte principale ni la lecture humaine.

## Contrôles restants et publication

- Contrôle visuel sur un véritable iPhone/Safari : menu, cartes tarifaires,
  barre fixe, accès aux formulaires et clavier. Le navigateur disponible pour
  cet audit est un navigateur de bureau ; aucun résultat de test Safari mobile
  n'est revendiqué. Les liens des composants mobiles sont couverts localement.
- La bascule avant/à/après 09:00 est testée localement dans l'application
  compilée. Le changement dans un onglet restant ouvert à l'échéance n'a pas été
  observé en navigateur avec une horloge simulée.
- Après publication autorisée : recontrôler le domaine public, les prix, le PDF
  et un envoi réel sur Production, dont la présence des variables ne garantit
  pas à elle seule la validité des valeurs.

Au contrôle Vercel du 27 octobre, le dernier déploiement Production reste celui
du 24 octobre, commit `2fee2c7bb398747f605b7966c030b6c1dc99d320`.
Les corrections ne sont donc pas encore publiées sur le domaine public.

La mention concernant la TVA reste à préciser avec Marinella ; aucun changement
fiscal ou tarifaire n'est introduit par ce complément.

La fusion dans main et toute modification de production nécessitent l'accord
explicite de Marinella sur la version finale présentée.
