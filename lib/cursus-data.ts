export const technicienModules = [
  {
    n: "M1",
    title: "Introduction à l'hypnose & aux neurosciences",
    points: [
      "Histoire et fondements de l'hypnose",
      "États modifiés de conscience et ondes cérébrales",
      "Inductions de base et détection de la transe",
    ],
  },
  {
    n: "M2",
    title: "Approfondissement des techniques",
    points: ["Fractionnement", "Confusion", "Catalepsie", "Suggestions hypnotiques"],
  },
  {
    n: "M3",
    title: "Hypnose & neurosciences appliquées",
    points: [
      "Bases neurophysiologiques",
      "Gestion du stress, de l'anxiété et de la douleur",
      "Optimisation des performances (sport, études, travail)",
    ],
  },
  {
    n: "M4",
    title: "Hypnose & changement comportemental",
    points: [
      "Croyances limitantes et restructuration cognitive",
      "Protocoles phobies, addictions, troubles du sommeil",
      "Études de cas et jeux de rôle supervisés",
    ],
  },
  {
    n: "M5",
    title: "Auto-hypnose & évaluation finale",
    points: [
      "Auto-hypnose pour le développement personnel",
      "Éthique et déontologie",
      "Présentation du TFE et validation des compétences",
    ],
  },
] as const;

export const technicienBenefits = [
  {
    title: "Accompagnement personnalisé",
    text: "Un suivi individuel tout au long du cursus, adapté à votre rythme d'apprentissage.",
  },
  {
    title: "Supports pédagogiques inclus",
    text: "Syllabus complets, vidéothèque pédagogique privée et carnets pratiques imprimables.",
  },
  {
    title: "Certification",
    text: "Un accès direct au niveau Praticien à l'issue du cursus, sans démarche supplémentaire.",
  },
  {
    title: "Flexibilité totale",
    text: "Paiement en plusieurs fois sans frais, pour un investissement serein.",
  },
] as const;

// Contenu tracé depuis les syllabus officiels du cursus Praticien
// (8 modules confirmés par la fondatrice, 14h chacun = 112h présentiel).
export const praticienModules = [
  {
    n: "M1",
    title: "Protocoles de gestion de la douleur",
    text: "Neuromatrice de la douleur, sensibilisation centrale et protocoles avancés d'hypno-analgésie — restaurer le sentiment de contrôle et l'autorégulation.",
  },
  {
    n: "M2",
    title: "Traumatismes complexes & EMDR",
    text: "Compréhension neurobiologique du trauma, fenêtre de tolérance et intégration sécurisée de l'EMDR au sein d'une pratique hypnotique clinique.",
  },
  {
    n: "M3",
    title: "Régressions thérapeutiques & approche transgénérationnelle",
    text: "Utiliser l'hypnose comme outil d'exploration pour aller rechercher les éléments utiles dans le transgénérationnel, les régressions ou les croyances limitantes — dans la continuité du M2, en intégrant l'EMDR à la régression sécurisée. Une matière dense, pour poser des bases solides, qui peuvent encore être approfondies via un module optionnel sur le transgénérationnel.",
  },
  {
    n: "M4",
    title: "Approches intégratives en accompagnement thérapeutique",
    text: "Élargir la palette du praticien en articulant les outils du cursus au sein d'un accompagnement thérapeutique cohérent et personnalisé.",
  },
  {
    n: "M5",
    title: "Méta-modèle, langage thérapeutique & métaphores",
    text: "Méta-modèle et Milton modèle, métaphores thérapeutiques avancées, métaprogrammes — l'art du langage qui structure le changement.",
  },
  {
    n: "M6",
    title: "Psycho-morphologie",
    text: "Affiner son regard thérapeutique : lire les grandes lignes du visage avec bienveillance, sans jugement ni catégorisation figée.",
  },
  {
    n: "M7",
    title: "Supervision, intégration professionnelle & posture du praticien",
    text: "Consolider sa posture professionnelle, superviser sa pratique et préparer une intégration sereine dans l'exercice du métier.",
  },
  {
    n: "M8",
    title: "Psychopathologie & hypnose",
    text: "Nosologies DSM-5/CIM-11, troubles abordables en hypnose et contre-indications, signes d'alerte et procédures d'orientation — en session avec un médecin.",
  },
] as const;

// Modules optionnels — pour aller plus loin au-delà des bases incluses dans
// le cursus Praticien (le M6 Psycho-morphologie couvre l'initiation ; ces
// modules approfondissent). Non inclus dans le tarif du cursus.
export const optionalModules = [
  {
    title: "Transgénérationnel — Approfondissement",
    duration: "2 jours",
    price: 300,
    text: "Aller plus loin dans l'analyse transgénérationnelle au-delà des bases posées au M3 du cursus Praticien.",
  },
  {
    title: "Psychomorphologie — Module 1",
    duration: "5 jours",
    price: 700,
    text: "Approfondir la lecture corporelle et le potentiel de la personne, au-delà de l'initiation vue dans le cursus Praticien.",
  },
  {
    title: "Psychomorphologie — Module 2",
    duration: "5 jours",
    price: 700,
    text: "Poursuivre l'approfondissement amorcé au Module 1 : profils complexes, lectures fines.",
  },
  {
    title: "Pack complet Psychomorphologie",
    duration: "10 jours",
    price: 1200,
    text: "Les deux modules réunis, à tarif préférentiel.",
    highlight: true,
  },
  {
    title: "Libération Quantique",
    duration: "6 demi-journées, en partie à distance",
    price: 450,
    text: "Une méthode enseignée par Marinella Spano elle-même — non incluse dans le cursus.",
  },
  {
    title: "Gestion du poids & arrêt du tabac",
    duration: "1 jour (ou 3 soirées)",
    price: 150,
    text: "Atelier ciblé, applicable immédiatement en séance.",
  },
  {
    title: "Femmes enceintes & hypnose périnatale",
    duration: "1 jour (ou 3 soirées)",
    price: 150,
    text: "Atelier ciblé sur l'accompagnement hypnotique de la grossesse.",
  },
] as const;
