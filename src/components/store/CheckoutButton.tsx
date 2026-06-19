import type { Product } from "@/data/products";

type Props = {
  product: Product;
  className?: string;
};

/**
 * Primary store CTA. Renders "Launch special · £X" for paid products and
 * "Get it free" for the lead magnet. Never use hype labels such as
 * "Secure this resource" — see lib/site.ts voice rules.
 *
 * Links straight to the Polar checkout. Polar is the Merchant of Record, so no
 * custom cart is needed.
 */
export function CheckoutButton({ product, className = "" }: Props) {
  return (
    <a
      href={product.checkoutUrl}
      data-product={product.slug}
      className={[
        "inline-flex w-full items-center justify-center gap-2",
        "rounded-none px-6 py-4",
        "bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-2 border-[var(--fg)]",
        "text-sm font-bold uppercase tracking-[0.12em]",
        "transition-all duration-150",
        "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--fg)]",
        "active:translate-x-0 active:translate-y-0 active:shadow-none",
        "focus-visible:outline-none focus-ring",
        className,
      ].join(" ")}
    >
      <span aria-hidden="true">🛒</span>
      <span>{product.ctaLabel}</span>
    </a>
  );
}
