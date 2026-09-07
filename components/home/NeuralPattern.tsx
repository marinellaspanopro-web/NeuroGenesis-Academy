"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap } from "@/lib/gsap";

/**
 * Motif neuronal signature — reprend le réseau de points/lignes du logo.
 * Élément graphique animé en arrière-plan du hero : lignes qui pulsent
 * doucement façon influx nerveux, nœuds qui respirent. Décoratif (aria-hidden).
 */
const nodes = [
  { id: "n1", x: 120, y: 140 }, { id: "n2", x: 260, y: 90 }, { id: "n3", x: 380, y: 180 },
  { id: "n4", x: 520, y: 110 }, { id: "n5", x: 640, y: 200 }, { id: "n6", x: 760, y: 120 },
  { id: "n7", x: 880, y: 190 }, { id: "n8", x: 180, y: 300 }, { id: "n9", x: 340, y: 340 },
  { id: "n10", x: 480, y: 300 }, { id: "n11", x: 600, y: 360 }, { id: "n12", x: 740, y: 320 },
  { id: "n13", x: 860, y: 380 }, { id: "n14", x: 100, y: 480 }, { id: "n15", x: 260, y: 520 },
  { id: "n16", x: 420, y: 470 }, { id: "n17", x: 560, y: 540 }, { id: "n18", x: 700, y: 500 },
  { id: "n19", x: 840, y: 560 }, { id: "n20", x: 480, y: 620 },
] as const;

const edges: [string, string][] = [
  ["n1", "n2"], ["n2", "n3"], ["n3", "n4"], ["n4", "n5"], ["n5", "n6"], ["n6", "n7"],
  ["n1", "n8"], ["n3", "n9"], ["n4", "n10"], ["n5", "n11"], ["n6", "n12"], ["n7", "n13"],
  ["n8", "n9"], ["n9", "n10"], ["n10", "n11"], ["n11", "n12"], ["n12", "n13"],
  ["n8", "n14"], ["n9", "n15"], ["n10", "n16"], ["n11", "n17"], ["n12", "n18"], ["n13", "n19"],
  ["n14", "n15"], ["n15", "n16"], ["n16", "n17"], ["n17", "n18"], ["n18", "n19"],
  ["n15", "n20"], ["n16", "n20"], ["n17", "n20"],
  ["n3", "n8"], ["n5", "n10"], ["n7", "n12"], ["n10", "n15"], ["n12", "n17"],
];

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

export default function NeuralPattern({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!svgRef.current || prefersReduced) return;

      const { gsap } = ensureGsap();
      const lines = svgRef.current.querySelectorAll(".ng-edge");
      const dots = svgRef.current.querySelectorAll(".ng-node");

      // Flux le long des connexions — façon influx nerveux
      lines.forEach((line, i) => {
        gsap.to(line, {
          strokeDashoffset: -240,
          duration: 6 + (i % 5),
          ease: "none",
          repeat: -1,
          delay: (i % 7) * 0.4,
        });
      });

      // Respiration douce des nœuds
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          opacity: 0.9,
          scale: 1.35,
          transformOrigin: "center",
          duration: 2.2 + (i % 4) * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (i % 6) * 0.3,
        });
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 960 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="var(--color-gold)" strokeOpacity="0.28" strokeWidth="1.1">
        {edges.map(([a, b], i) => {
          const from = nodeMap[a];
          const to = nodeMap[b];
          return (
            <line
              key={i}
              className="ng-edge"
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              strokeDasharray="4 9"
            />
          );
        })}
      </g>
      <g fill="var(--color-gold)">
        {nodes.map((n, i) => (
          <circle
            key={n.id}
            className="ng-node"
            cx={n.x}
            cy={n.y}
            r={i % 3 === 0 ? 3.4 : 2.2}
            opacity="0.55"
          />
        ))}
      </g>
    </svg>
  );
}
