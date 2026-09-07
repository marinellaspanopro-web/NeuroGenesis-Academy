import RevealOnScroll from "@/components/shared/RevealOnScroll";

const pillars = [
  {
    n: "01",
    title: "L'Excellence scientifique",
    text: "Une pédagogie ancrée dans les neurosciences, des protocoles structurés, des grilles de guidance précises et une évaluation rigoureuse de chaque séance.",
  },
  {
    n: "02",
    title: "La Bienveillance fondamentale",
    text: "Un cadre d'apprentissage sécurisant où chacun avance à son rythme, accompagné avec respect, écoute et éthique à chaque étape.",
  },
  {
    n: "03",
    title: "La Transformation profonde",
    text: "115 heures pour passer de la théorie à la pratique : chaque technique est supervisée jusqu'à sa pleine maîtrise.",
  },
];

export default function Pillars() {
  return (
    <section id="manifeste" className="py-section bg-cream">
      <div className="container-editorial">
        <RevealOnScroll className="max-w-2xl mb-16 lg:mb-24">
          <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Notre manifeste</p>
          <h2 className="reveal-item font-serif text-h1 text-forest text-balance">
            Trois piliers, une seule exigence :{" "}
            <em>l&apos;excellence humaine.</em>
          </h2>
        </RevealOnScroll>

        <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
          {pillars.map((p, i) => (
            <RevealOnScroll
              key={p.n}
              as="div"
              className={
                i === 0
                  ? "lg:col-span-7 lg:col-start-1"
                  : i === 1
                    ? "lg:col-span-6 lg:col-start-7 lg:mt-24"
                    : "lg:col-span-8 lg:col-start-3 lg:mt-16"
              }
            >
              <div className="reveal-item flex items-start gap-6">
                <span className="font-serif italic text-h2 text-gold-deep leading-none shrink-0">
                  {p.n}
                </span>
                <div className="pt-2">
                  <h3 className="font-serif text-h3 text-forest mb-3">{p.title}</h3>
                  <p className="text-body text-ink/75 leading-relaxed max-w-md">{p.text}</p>
                  <span className="rule-gold mt-6 block" aria-hidden="true" />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
