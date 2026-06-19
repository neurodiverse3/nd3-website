import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct, type Product } from "@/data/products";
import { CheckoutButton } from "@/components/store/CheckoutButton";
import ProductMediaShowcase from "@/components/store/ProductMediaShowcase";

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
      title: "Product Not Found · neurodivers³",
    };
  }

  return {
    title: `${product.title} · neurodivers³`,
    description: product.cardBlurb,
    openGraph: {
      title: `${product.title} · neurodivers³`,
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

  const paidProducts = PRODUCTS.filter((p) => !p.isFree && !p.isBundle);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-[96px] text-[var(--fg)] md:pt-[120px]">
      {/* ---- Breadcrumb / Back button ---- */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        <Link href="/store" className="transition-colors hover:text-[var(--accent)]">
          Store
        </Link>
        <span>·</span>
        <span className="text-[var(--fg)]">{product.title}</span>
      </nav>

      {/* ---- Main Title & Tagline ---- */}
      <header className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-[var(--fg)]/25 bg-[var(--surface)]">
            {product.pillar}
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
            {product.format}
          </span>
        </div>
        <h1 className="text-4xl font-display font-black uppercase leading-[0.95] tracking-tight sm:text-6xl text-[var(--fg)]">
          {product.title}
        </h1>
        <p className="text-xl italic font-serif leading-relaxed text-[var(--accent)]">
          {product.tagline}
        </p>
      </header>

      {/* ---- Layout wrapper ---- */}
      <div className="mt-10 flex flex-col min-[920px]:flex-row gap-12 items-start">
        {/* Left Column (fluid) */}
        <div className="flex-1 space-y-12 w-full">
          <ProductMediaShowcase
            coverImage={product.coverImage}
            title={product.title}
            priceLabel={product.priceLabel}
            demoVideo={product.demoVideo}
          />

          {/* Intro paragraph */}
          <section className="text-base leading-relaxed text-[var(--fg)]/95 font-sans space-y-4">
            <p className="text-lg font-bold leading-relaxed">{product.longIntro}</p>
          </section>

          {/* If it is a bundle, show the grid of included products below the intro */}
          {product.isBundle && (
            <div className="space-y-4 w-full">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)] block">
                INCLUDED PRODUCTS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-2 border-[var(--fg)] p-4 bg-[var(--surface)] shadow-[6px_6px_0px_var(--fg)]">
                {paidProducts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/store/${p.slug}`}
                    className="group/item relative aspect-square overflow-hidden border border-[var(--fg)]/20 hover:border-[var(--accent)] transition-all"
                  >
                    <img
                      src={`/store/covers/${p.coverImage}`}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-102"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center p-3 text-center transition-opacity">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                        {p.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Shifting Buy Panel (Visible only <920px) */}
          <div className="block min-[920px]:hidden w-full">
            <BuyPanel product={product} />
          </div>

          {/* What you get checklist */}
          <section className="space-y-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
              What you get
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.whatYouGet.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[var(--fg)] leading-relaxed font-sans">
                  <span aria-hidden="true" className="text-[var(--accent)] font-black shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* For You / Not This Panels */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* For You */}
            <div className="border-2 border-[var(--fg)] bg-[var(--surface)] p-6 shadow-[4px_4px_0px_var(--fg)] space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                This is for you if:
              </h3>
              <ul className="space-y-3">
                {product.forYou.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--fg)]/80 leading-relaxed font-sans">
                    <span aria-hidden="true" className="text-[var(--fg)] shrink-0 font-mono">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not This */}
            <div className="border-2 border-dashed border-[var(--fg)]/70 p-6 space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]/70">
                This is not:
              </h3>
              <ul className="space-y-3">
                {product.notThis.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--fg)]/70 leading-relaxed font-sans">
                    <span aria-hidden="true" className="text-[var(--fg)]/50 shrink-0 font-mono">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Free product Upsell card */}
          {product.slug === "1-page-dopamine-menu" && (
            <div className="border-2 border-[var(--fg)] bg-[var(--surface)] p-6 shadow-[6px_6px_0px_var(--fg)] space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">UPGRADE AVAILABLE</span>
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
                Need the full editable template?
              </h3>
              <p className="text-sm font-sans leading-relaxed text-[var(--fg)]/80">
                The full Dopamine Menu Notion Template includes custom intensity categories, low/med/high energy triage, pre-filled worked examples, and a duplicable Notion setup.
              </p>
              <Link
                href="/store/dopamine-menu-template"
                className="inline-flex w-full items-center justify-center border-2 border-[var(--fg)] bg-[var(--accent)] text-[var(--accent-text,var(--bg))] font-bold text-xs uppercase py-3 tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--fg)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                View Full Template (£5) →
              </Link>
            </div>
          )}

          {/* Pairs With Partner Post (Omit for bundle) */}
          {!product.isBundle && product.partnerPostSlug && product.partnerPostTitle && (
            <section className="border-t border-[var(--fg)]/10 pt-8">
              <div className="border-2 border-[var(--fg)] bg-[var(--surface)] p-6 shadow-[4px_4px_0px_var(--fg)]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                  Pairs with article
                </span>
                <h3 className="mt-2 text-lg font-display font-bold uppercase tracking-tight text-[var(--fg)]">
                  {product.partnerPostTitle}
                </h3>
                <p className="mt-2 text-sm text-[var(--fg)]/70 font-sans leading-relaxed">
                  Read the background methodology and how to use this tool in practice.
                </p>
                <Link
                  href={`/blog/${product.partnerPostSlug}`}
                  className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            </section>
          )}

          {/* Accordion FAQ */}
          <section className="border-t border-[var(--fg)]/10 pt-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)] mb-4">
              Frequently Asked Questions
            </h2>
            <div className="border-t border-[var(--fg)]/10">
              <details className="group border-b border-[var(--fg)]/10 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none select-none font-bold text-base text-[var(--fg)] outline-none focus-visible:text-[var(--accent)]">
                  <span>How do I receive my downloads?</span>
                  <span className="text-xl transition-transform duration-200 group-open:rotate-45 text-[var(--accent)] font-mono" aria-hidden="true">+</span>
                </summary>
                <div className="mt-3 text-sm text-[var(--fg)]/85 leading-relaxed font-sans">
                  Immediately after payment completes, Polar will direct you to a download page, and you will receive an automated email receipt containing the direct signed download link. For Notion templates, the link is provided inside a README file.
                </div>
              </details>

              <details className="group border-b border-[var(--fg)]/10 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none select-none font-bold text-base text-[var(--fg)] outline-none focus-visible:text-[var(--accent)]">
                  <span>What is your refund policy?</span>
                  <span className="text-xl transition-transform duration-200 group-open:rotate-45 text-[var(--accent)] font-mono" aria-hidden="true">+</span>
                </summary>
                <div className="mt-3 text-sm text-[var(--fg)]/85 leading-relaxed font-sans">
                  Every paid product is refundable for 14 days, no questions asked. Just email us at hello@neurodivers3.co.uk within 14 days of your purchase.
                </div>
              </details>

              <details className="group border-b border-[var(--fg)]/10 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none select-none font-bold text-base text-[var(--fg)] outline-none focus-visible:text-[var(--accent)]">
                  <span>Do I need a paid Notion plan?</span>
                  <span className="text-xl transition-transform duration-200 group-open:rotate-45 text-[var(--accent)] font-mono" aria-hidden="true">+</span>
                </summary>
                <div className="mt-3 text-sm text-[var(--fg)]/85 leading-relaxed font-sans">
                  No. All Notion templates in the store are compatible with the free personal Notion plan. You can duplicate them in one click.
                </div>
              </details>

              <details className="group border-b border-[var(--fg)]/10 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none select-none font-bold text-base text-[var(--fg)] outline-none focus-visible:text-[var(--accent)]">
                  <span>Do I get updates when templates change?</span>
                  <span className="text-xl transition-transform duration-200 group-open:rotate-45 text-[var(--accent)] font-mono" aria-hidden="true">+</span>
                </summary>
                <div className="mt-3 text-sm text-[var(--fg)]/85 leading-relaxed font-sans">
                  Yes. When we make updates to templates or workbooks, past buyers receive automatic updates for free where the delivery platform allows.
                </div>
              </details>
            </div>
          </section>
        </div>

        {/* Right Column (Sticky on desktop, hidden on mobile) */}
        <aside className="hidden min-[920px]:block sticky top-[88px] w-[360px] shrink-0">
          <BuyPanel product={product} />
        </aside>
      </div>

      {/* Module 5.2: Mobile sticky checkout bar — fixed to viewport bottom */}
      <div className="min-[920px]:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[var(--fg)] bg-[var(--surface,var(--bg))] p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]">
        <BuyPanel product={product} compact />
      </div>
      {/* Spacer so content doesn't hide behind the fixed bar */}
      <div className="min-[920px]:hidden h-24" aria-hidden="true" />
    </main>
  );
}

function BuyPanel({ product, compact = false }: { product: Product; compact?: boolean }) {
  const isFree = product.isFree;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col flex-shrink-0">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)]">Rate</span>
          <span className="text-xl font-black text-[var(--accent)] font-display leading-none">
            {product.priceLabel}
          </span>
        </div>
        <div className="flex-1">
          <CheckoutButton product={product} />
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-[var(--fg)] bg-[var(--surface,var(--bg))] p-6 md:p-8 space-y-6 shadow-[6px_6px_0px_var(--fg)]">
      {/* Price tag */}
      <div className="flex justify-between items-baseline border-b border-[var(--fg)]/10 pb-4">
        <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest">RATE</span>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-[var(--accent)] font-display">{product.priceLabel}</span>
          {!isFree && (
            <span className="bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border border-[var(--fg)]/30 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Launch special
            </span>
          )}
        </div>
      </div>

      {/* Checkout button */}
      <CheckoutButton product={product} />

      {/* Guarantee / Refund line */}
      <div className="text-xs text-[var(--muted)] font-mono">
        {isFree ? (
          <p>Free instant download via email. No payment info required.</p>
        ) : (
          <p>Refundable for 14 days, no questions.</p>
        )}
      </div>

      {/* Delivery details */}
      <div className="text-xs leading-relaxed text-[var(--fg)]/80 font-sans border-t border-[var(--fg)]/10 pt-4 space-y-2">
        <p>
          <strong>Format:</strong> {product.format}
        </p>
        <p>
          <strong>Delivery:</strong> {product.delivery}
        </p>
      </div>

      {/* Guarantees */}
      <div className="space-y-4 border-t border-[var(--fg)]/10 pt-6 text-xs text-[var(--muted)] font-sans">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-[var(--accent)] font-black shrink-0">✓</span>
          <span>
            <strong>Sensory Check.</strong> Designed for clarity and low cognitive load. Print-friendly and screen-reader compliant.
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-[var(--accent)] font-black shrink-0">✓</span>
          <span>
            <strong>Instant Access.</strong> Downloads are compiled and generated immediately after checkout.
          </span>
        </div>
      </div>
    </div>
  );
}
