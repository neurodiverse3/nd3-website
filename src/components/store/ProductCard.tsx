import Link from "next/link";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
};

/**
 * Store landing card. Links to the product page (not straight to checkout) so
 * the buyer can read the full listing first. Price label uses "// £X" — never
 * "INVESTMENT RATE". Pillar tag sits top-left; no "BEST SELLER" hype chips.
 */
export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/store/${product.slug}`}
      className="group flex flex-col border border-white/10 bg-[var(--nd3-card)] transition-colors hover:border-[var(--nd3-pink)]/60"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--nd3-void)]">
        {/* Swap for next/image once cover assets are in /public/store. */}
        <img
          src={`/store/covers/${product.coverImage}`}
          alt={`${product.title} — product cover`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nd3-pink)]">
          {product.pillar}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold uppercase leading-tight tracking-tight">
            {product.title}
          </h3>
          <span className="shrink-0 font-mono text-sm text-[var(--nd3-pink)]">
            {`// ${product.priceLabel}`}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-white/70">
          {product.cardBlurb}
        </p>
        <span className="mt-auto pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--nd3-pink)]">
          View →
        </span>
      </div>
    </Link>
  );
}
