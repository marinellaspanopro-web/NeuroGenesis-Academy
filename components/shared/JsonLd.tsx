/**
 * Injecte un bloc JSON-LD dans le HTML initial (server component — pas de
 * hydratation JS nécessaire), conformément à la recommandation Google
 * (déc. 2025) : servir le structured data dans le HTML rendu côté serveur
 * plutôt que via injection JS différée.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
