const words = [
  "Hypnose",
  "Neurosciences",
  "Transmission",
  "Excellence",
  "Bienveillance",
  "Pratique supervisée",
] as const;

/**
 * Bandeau de mots-clés défilant en boucle horizontale, en clôture du hero.
 * Animation CSS pure (pas de JS) : le contenu est dupliqué une fois pour
 * boucler sans à-coup, et l'animation est désactivée si l'utilisateur
 * préfère un mouvement réduit (voir .marquee-track dans globals.css).
 */
export default function ScrollingBanner() {
  const items = [...words, ...words];

  return (
    <div className="dark-section overflow-hidden border-t border-gold/15 py-6" aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {items.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center shrink-0">
            <span className="font-serif italic text-xl sm:text-2xl text-gold px-6 whitespace-nowrap">
              {word}
            </span>
            <span className="text-gold-deep text-sm" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
