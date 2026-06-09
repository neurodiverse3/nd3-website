import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, getProduct } from "@/data/products";
import { CheckoutButton } from "@/components/store/CheckoutButton";
import { REFUND_DETAIL, REFUND_LINE, SITE } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Store — neurodivers\u00B3" };
  return {
    title: `${product.title} — neurodivers\u00B3`,
    description: product.tagline,
  };
}

export default function ProductPage({ params }: { params: Params }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-10 text-white">
      <Link
        href="/store"
        className="font-mono text-xs uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-[var(--nd3-pink)]"
      >
        ← Back to the toolkit
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ---- Left: cover + body ---- */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden bg-[var(--nd3-void)]">
            <img
              src={`/store/covers/${product.coverImage}`}
              alt={`${product.title} — product cover`}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nd3-pink)]">
              {product.pillar}
            </span>
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--nd3-pink)]">
            {product.pillar} · {product.format}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            {product.title}
          </h1>
          <p className="mt-4 border-l-2 border-[var(--nd3-pink)] pl-4 text-lg italic text-white/70">
            {product.tagline}
          </p>

          <p className="mt-8 leading-relaxed text-white/80">
            {product.longIntro}
          </p>

          <Section title="What you get">
            <ul className="space-y-2">
              {product.whatYouGet.map((item) => (
                <li key={item} className="flex gap-3 text-white/80">
                  <span className="text-[var(--nd3-pink)]" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="This is for you if">
            <ul className="space-y-2">
              {product.forYou.map((item) => (
                <li key={item} className="flex gap-3 text-white/80">
                  <span className="text-[var(--nd3-pink)]" aria-hidden>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="This is not">
            <ul className="space-y-2">
              {product.notThis.map((item) => (
                <li key={item} className="flex gap-3 text-white/60">
                  <span className="text-white/40" aria-hidden>
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {product.partnerPostSlug && product.partnerPostTitle ? (
            <Section title="Pairs with">
              <Link
                href={`/blog/${product.partnerPostSlug}`}
                className="text-[var(--nd3-pink)] underline-offset-4 hover:underline"
              >
                {product.partnerPostTitle}
              </Link>
            </Section>
          ) : null}
        </div>

        {/* ---- Right: sticky buy panel ---- */}
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="border border-white/10 bg-[var(--nd3-card)] p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">
                // Price
              </span>
              <span className="text-3xl font-extrabold">
                {product.priceLabel}
              </span>
            </div>

            <div className="mt-5">
              <CheckoutButton product={product} />
            </div>

            <p className="mt-3 text-center text-xs text-white/60">
              {REFUND_LINE}
            </p>

            <dl className="mt-6 space-y-4 border-t border-white/10 pt-6 text-sm">
              <div>
                <dt className="font-semibold text-white">Delivery</dt>
                <dd className="mt-1 text-white/70">{product.delivery}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Refund</dt>
                <dd className="mt-1 text-white/70">{REFUND_DETAIL}</dd>
              </div>
            </dl>

            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              Secure checkout via Polar · {SITE.brand}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
