type LogoVariant = "forest" | "gold-on-forest" | "gold-on-white";

// Nœuds de l'icône — réseau neuronal en forme de cerveau, tracé fidèlement
// depuis le logo officiel fourni par la marque (bannière Marinella Spano).
const nodes = [
  { id: "n1", x: 31, y: 11 }, { id: "n2", x: 60, y: 9 }, { id: "n3", x: 79, y: 21 },
  { id: "n4", x: 12, y: 26 }, { id: "n5", x: 34, y: 30 }, { id: "n6", x: 54, y: 28 },
  { id: "n7", x: 72, y: 37 }, { id: "n8", x: 91, y: 41 }, { id: "n9", x: 10, y: 45 },
  { id: "n10", x: 27, y: 52 }, { id: "n11", x: 46, y: 47 }, { id: "n12", x: 66, y: 54 },
  { id: "n13", x: 30, y: 65 }, { id: "n14", x: 45, y: 66 }, { id: "n15", x: 61, y: 72 },
  { id: "n16", x: 82, y: 63 }, { id: "n17", x: 57, y: 86 },
] as const;

const edges: [string, string][] = [
  ["n1", "n2"], ["n1", "n5"], ["n1", "n4"],
  ["n2", "n3"], ["n2", "n6"], ["n2", "n5"],
  ["n3", "n7"], ["n3", "n8"],
  ["n4", "n5"], ["n4", "n9"],
  ["n5", "n6"], ["n5", "n9"], ["n5", "n10"], ["n5", "n11"],
  ["n6", "n7"], ["n6", "n11"], ["n6", "n12"],
  ["n7", "n8"], ["n7", "n12"],
  ["n8", "n16"], ["n8", "n12"],
  ["n9", "n10"],
  ["n10", "n11"], ["n10", "n13"],
  ["n11", "n13"], ["n11", "n14"], ["n11", "n12"],
  ["n12", "n14"], ["n12", "n15"], ["n12", "n16"],
  ["n13", "n14"],
  ["n14", "n15"], ["n14", "n17"],
  ["n15", "n16"], ["n15", "n17"],
];

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

/**
 * Logo officiel NeuroGenesis Academy — icône réseau neuronal en forme de
 * cerveau + wordmark script "Neuro" / caps tracées "GENESIS", tracé depuis
 * les fichiers de marque fournis. Trois variantes selon le fond :
 * - forest        : vert forêt sur fond clair (nav, sections claires)
 * - gold-on-forest: or/crème sur fond vert forêt (hero, footer, bandeaux sombres)
 * - gold-on-white : or pâle sur fond blanc (favicon, usages neutres)
 */
export default function Logo({
  variant = "forest",
  className = "",
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  const ink =
    variant === "forest"
      ? "var(--color-forest)"
      : variant === "gold-on-white"
        ? "var(--color-gold-deep)"
        : "var(--color-gold)";

  return (
    <svg
      viewBox="0 0 300 92"
      className={className}
      role="img"
      aria-label="NeuroGenesis Academy"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0, 3)">
        <g stroke={ink} strokeWidth="1.6" fill="none" opacity="0.95">
          {edges.map(([a, b], i) => {
            const from = nodeMap[a];
            const to = nodeMap[b];
            return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
          })}
        </g>
        <g fill={variant === "forest" || variant === "gold-on-white" ? "var(--color-cream)" : "var(--color-forest)"} stroke={ink} strokeWidth="1.6">
          {nodes.map((n) => (
            <circle key={n.id} cx={n.x} cy={n.y} r="3.4" />
          ))}
        </g>
      </g>

      <text
        x="112"
        y="46"
        fontFamily="var(--font-script), cursive"
        fontSize="38"
        fill={ink}
      >
        Neuro
      </text>
      <text
        x="114"
        y="66"
        fontFamily="var(--font-body), sans-serif"
        fontWeight="500"
        fontSize="13"
        letterSpacing="4.5"
        fill={ink}
        opacity="0.9"
      >
        GENESIS
      </text>
    </svg>
  );
}
