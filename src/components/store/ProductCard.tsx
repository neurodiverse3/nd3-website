import Link from "next/link";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
};

/**
 * Store landing card. Module 5.4: the entire card surface is the link target.
 * The "View details →" label is purely visual.
 */
export function ProductCard({ product }: Props) {
  const isBundle = product.isBundle;

  const pillarColors: Record<string, string> = {
    "Unmasked Life": "text-[var(--pillar-label-unmasked)] bg-[var(--pillar-label-unmasked)]/10 border-[var(--pillar-label-unmasked)]/30",
    "Tools & Templates": "text-[var(--pillar-label-tools)] bg-[var(--pillar-label-tools)]/10 border-[var(--pillar-label-tools)]/30",
    "Digital Products": "text-[var(--pillar-label-digital)] bg-[var(--pillar-label-digital)]/10 border-[var(--pillar-label-digital)]/30",
  };
  const pillarClass = pillarColors[product.pillar] || "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/30";

  return (
    <article
      className={`group relative flex ${
        isBundle ? "flex-col md:flex-row md:col-span-2" : "flex-col"
      } border-2 border-[var(--fg)] bg-[var(--surface,var(--bg))] text-[var(--fg)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--fg)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-within:-translate-x-1 focus-within:-translate-y-1 focus-within:shadow-[6px_6px_0px_var(--fg)]`}
    >
      {/* Module 5.4: Universal clickable link overlay */}
      <Link
        href={`/store/${product.slug}`}
        className="absolute inset-0 z-10 focus-visible:outline-none focus-ring rounded-none"
        aria-label={`View details for ${product.title}`}
      >
        <span className="sr-only">View {product.title} details</span>
      </Link>

      <div className={`relative ${
        isBundle ? "w-full aspect-[4/3] md:w-[320px] shrink-0 border-b-2 md:border-b-0 md:border-r-2" : "w-full aspect-square border-b-2"
      } border-[var(--fg)] overflow-hidden bg-[var(--bg)]`}>
        <img
          src={`/store/covers/${product.coverImage}`}
          alt={`${product.title} · product cover`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 justify-between">
        <div className="space-y-3">
          {/* Eyebrow & Pillar tag */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`px-2 py-0.5 text-xs font-mono border ${pillarClass}`}>
              {product.pillar}
            </span>
            <span className="font-mono text-xs text-[var(--muted)]">
              {product.format}
            </span>
          </div>

          <h3 className="text-xl font-display font-bold uppercase leading-tight tracking-tight text-[var(--fg)]">
             {product.title}
          </h3>
          <p className="text-sm font-sans leading-relaxed text-[var(--fg)]/80">
            {product.cardBlurb}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-[var(--fg)]/10">
          <span className="font-mono text-lg font-bold text-[var(--link)]">
            {product.priceLabel}
          </span>
          <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--link)] group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </article>
  );
}
