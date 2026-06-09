import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, X, Shield, Zap, Sparkles } from "lucide-react";
import { PRODUCTS, getProduct } from "@/data/products";
import ProductAddToCartButton from "@/components/ProductAddToCartButton";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all products to enable instant static rendering
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found · neurodivers\u00B3",
    };
  }

  return {
    title: `${product.title} · The Toolkit \u2014 neurodivers\u00B3`,
    description: product.cardBlurb,
    openGraph: {
      title: `${product.title} · The Toolkit \u2014 neurodivers\u00B3`,
      description: product.cardBlurb,
      images: [`/store/covers/${product.coverImage}`],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-[96px] text-white md:pt-[120px]">
      {/* ---- Breadcrumb / Back button ---- */}
      <Link
        href="/store"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)] transition-colors hover:text-[var(--nd3-pink)]"
      >
        <ArrowLeft size={12} /> Back to the Toolkit
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* ---- Left: Detailed Listing (7 Columns) ---- */}
        <div className="space-y-12 lg:col-span-7">
          {/* Header metadata */}
          <div>
            <div className="inline-flex items-center gap-2 border border-white/10 bg-[var(--nd3-card)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--nd3-pink)]">
              <span>{product.icon}</span>
              <span>{product.format}</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
              {product.title}
            </h1>
            <p className="mt-4 text-lg italic leading-relaxed text-white/60">
              {product.tagline}
            </p>
          </div>

          {/* Long Intro */}
          <section className="border-t border-white/10 pt-8">
            <p className="text-base leading-relaxed text-white/80">
              {product.longIntro}
            </p>
          </section>

          {/* What You Get Checklist */}
          <section className="space-y-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--nd3-pink)]">
              What's Included
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product.whatYouGet.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-white/80 leading-relaxed">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-[var(--nd3-pink)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* For You / Not This Side-by-Side */}
          <section className="grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
            {/* For You */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-green-400">
                Is this for you?
              </h3>
              <ul className="space-y-3">
                {product.forYou.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
                    <Check size={14} className="mt-0.5 shrink-0 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not This */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-400">
                Not for you if...
              </h3>
              <ul className="space-y-3">
                {product.notThis.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
                    <X size={14} className="mt-0.5 shrink-0 text-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Pairs With Partner Post */}
          {product.partnerPostSlug && (
            <section className="border-t border-white/10 pt-8">
              <div className="rounded-none border border-white/10 bg-[var(--nd3-card)] p-5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--nd3-pink)]">
                  Pairs With Articles
                </span>
                <h3 className="mt-2 text-sm font-bold uppercase tracking-tight">
                  {product.partnerPostTitle}
                </h3>
                <p className="mt-2 text-xs text-white/60">
                  Read the background methodology and how to use this tool in practice.
                </p>
                <Link
                  href={`/blog/${product.partnerPostSlug}`}
                  className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--nd3-pink)] hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* ---- Right: Checkout Actions Card (5 Columns) ---- */}
        <div className="space-y-6 lg:col-span-5">
          {/* Large image showcase */}
          <div className="relative aspect-square w-full border border-white/10 bg-[var(--nd3-void)]">
            <img
              src={`/store/covers/${product.coverImage}`}
              alt={`${product.title} cover image`}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-3 top-3 bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nd3-pink)]">
              {product.priceLabel}
            </div>
          </div>

          {/* Action details card */}
          <div className="border border-white/10 bg-[var(--nd3-card)] p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Rate</span>
              <span className="text-3xl font-black text-[var(--nd3-pink)]">{`// ${product.priceLabel}`}</span>
            </div>

            {/* Add to Cart button */}
            <ProductAddToCartButton product={{
              id: `prod-${product.slug}`,
              _id: `prod-${product.slug}`,
              title: product.title,
              price: product.price,
              tag: product.format,
              color: product.pillar === "Unmasked Life" ? "from-pink-600 to-rose-700" : "from-teal-600 to-emerald-700",
              excerpt: product.cardBlurb,
              slug: product.slug,
              gumroadUrl: ""
            }} />

            {/* Delivery notes */}
            <div className="text-xs leading-relaxed text-white/60 font-sans">
              <p>
                <strong>Delivery:</strong> {product.delivery}
              </p>
            </div>

            {/* Guarantees */}
            <div className="space-y-4 border-t border-white/10 pt-6 text-xs text-[var(--muted)] font-sans">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-[var(--nd3-pink)] shrink-0 mt-0.5" />
                <span>
                  <strong>Sensory Guarantee.</strong> If this format does not align with your focus needs, reply to your receipt email for a prompt refund.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Zap size={16} className="text-[var(--nd3-pink)] shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Streaming.</strong> Downloads and template links are compiled and generated immediately after checkout completes.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
