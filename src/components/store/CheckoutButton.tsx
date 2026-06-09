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
        "rounded-sm px-6 py-4",
        "bg-[var(--nd3-pink)] text-black",
        "text-sm font-semibold uppercase tracking-[0.12em]",
        "transition-opacity hover:opacity-90",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nd3-pink)]",
        className,
      ].join(" ")}
    >
      <span aria-hidden="true">🛒</span>
      <span>{product.ctaLabel}</span>
    </a>
  );
}
