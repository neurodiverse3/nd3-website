import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";
import { REFUND_LINE, LAUNCH_NOTE } from "@/lib/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Store - neurodivers³",
  description:
    "Small Notion templates and PDFs for specific neurodivergent moments. Not a productivity system. Buy the one tool you need for the moment you're in.",
  alternates: {
    canonical: 'https://neurodivers3.co.uk/store',
  },
};

export default function StorePage() {
  const fivePounds = PRODUCTS.filter((p) => p.tier === "5");
  const sevenPounds = PRODUCTS.filter((p) => p.tier === "7");
  const bundle = PRODUCTS.filter((p) => p.tier === "19");
  const free = PRODUCTS.filter((p) => p.tier === "free");

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-[96px] md:pt-[120px] text-[var(--fg)]">
      <PageHeader
        variant="section"
        eyebrow="ND3 Resource Hub"
        titleLabel="Store"
        titleAccent="Digital Products"
        subtitle="Focused tools for specific neurodivergent moments."
      />

      {/* ---- Intro copy ---- */}
      <section className="mt-12 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[var(--fg)]/80 text-base md:text-lg">
        <div>
          <p className="font-sans leading-relaxed">
            Every product in the store is a focused tool for one situation. Not a
            productivity system. Not a methodology. Not a course. Each one is
            something I built for myself, used long enough to know it worked, then
            cleaned up so other people could use it too.
          </p>
        </div>
        <div className="space-y-4">
          <p className="font-sans leading-relaxed">
            There is one bundle, because some people already know they want the
            whole set. There is no ladder, no pressure, no fake scarcity. Buy the
            one tool you need for the moment you're in.
          </p>
          <p className="font-mono text-sm text-[var(--link)]">
            {LAUNCH_NOTE}
          </p>
        </div>
      </section>

      {/* ---- Product Sections ---- */}
      <div className="mt-16 space-y-16">
        {/* £5 Section */}
        <section className="space-y-8">
          <div className="border-b-4 border-[var(--fg)] pb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
              The £5 Tools
            </h2>
            <p className="text-sm text-[var(--muted)] font-mono mt-1">
              Focused, single-purpose sheets and worksheets to unblock immediate problems.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fivePounds.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* £7 Section */}
        <section className="space-y-8">
          <div className="border-b-4 border-[var(--fg)] pb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
              The £7 Workspaces & Planners
            </h2>
            <p className="text-sm text-[var(--muted)] font-mono mt-1">
              Flexible Notion workspaces designed around fluctuating executive capacity.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sevenPounds.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* The Launch Bundle - Custom Editorial Showcase */}
        <section className="space-y-8">
          <div className="border-b-4 border-[var(--fg)] pb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
              The Launch Bundle
            </h2>
            <p className="text-sm text-[var(--muted)] font-mono mt-1">
              Get the entire launch suite of six tools in a single download. Save £15.
            </p>
          </div>
          
          {bundle.map((product) => (
            <div key={product.slug} className="group relative border-2 border-[var(--fg)] bg-[var(--surface)] p-6 md:p-10 shadow-[6px_6px_0px_var(--fg)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_var(--fg)]">
              {/* Universal clickable link overlay */}
              <Link
                href={`/store/${product.slug}`}
                className="absolute inset-0 z-10 focus-visible:outline-none focus-ring rounded-none"
                aria-label={`View details for ${product.title}`}
              >
                <span className="sr-only">View {product.title} details</span>
              </Link>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                {/* Left: Perfect Square Image */}
                <div className="lg:col-span-5 w-full max-w-[380px] aspect-square mx-auto border-2 border-[var(--fg)] overflow-hidden shadow-[4px_4px_0px_var(--fg)] bg-[var(--bg)] relative z-20">
                  <Link href={`/store/${product.slug}`} className="block w-full h-full">
                    <img
                      src={`/store/covers/${product.coverImage}`}
                      alt={`${product.title} · product cover`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                    />
                  </Link>
                </div>
                
                {/* Right: Details */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full text-left space-y-6 relative z-20">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--fg)]/10 pb-4">
                      <span className="px-2 py-0.5 text-xs font-mono border text-[var(--pillar-label-tools)] bg-[var(--pillar-label-tools)]/10 border-[var(--pillar-label-tools)]/30">
                        {product.pillar}
                      </span>
                      <span className="font-mono text-xs text-[var(--muted)]">
                        {product.format}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
                      {product.title}
                    </h3>
                    
                    <p className="text-base font-sans leading-relaxed text-[var(--fg)]/90">
                      {product.cardBlurb}
                    </p>

                    {/* What is included checklist */}
                    <div className="pt-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] block mb-3">INCLUDED RESOURCES:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[var(--fg)]/80">
                        {product.whatYouGet.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-[var(--accent)] font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between pt-6 border-t border-[var(--fg)]/10 gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-2xl font-black text-[var(--link)]">
                        {product.priceLabel}
                      </span>
                      <span className="bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border border-[var(--fg)]/25 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        Save £15
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/store/${product.slug}`}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-transparent text-[var(--fg)] border-2 border-[var(--fg)]/30 hover:border-[var(--fg)] font-bold text-xs uppercase tracking-[0.08em] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--fg)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-ring"
                      >
                        View details →
                      </Link>
                      <a
                        href={product.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-2 border-[var(--fg)] font-bold text-xs uppercase tracking-[0.08em] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--fg)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-ring"
                      >
                        Buy launch bundle
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Free Resources - Custom Editorial Showcase */}
        <section className="space-y-8">
          <div className="border-b-4 border-[var(--fg)] pb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
              Free Resources
            </h2>
            <p className="text-sm text-[var(--muted)] font-mono mt-1">
              Zero-friction templates to try out the formats and concepts.
            </p>
          </div>
          
          {free.map((product) => (
            <div key={product.slug} className="group relative border-2 border-[var(--fg)] bg-[var(--surface)] p-6 md:p-10 shadow-[6px_6px_0px_var(--fg)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_var(--fg)]">
              {/* Universal clickable link overlay */}
              <Link
                href={`/store/${product.slug}`}
                className="absolute inset-0 z-10 focus-visible:outline-none focus-ring rounded-none"
                aria-label={`View details for ${product.title}`}
              >
                <span className="sr-only">View {product.title} details</span>
              </Link>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                {/* Left: Perfect Square Image */}
                <div className="lg:col-span-5 w-full max-w-[380px] aspect-square mx-auto border-2 border-[var(--fg)] overflow-hidden shadow-[4px_4px_0px_var(--fg)] bg-[var(--bg)] relative z-20">
                  <Link href={`/store/${product.slug}`} className="block w-full h-full">
                    <img
                      src={`/store/covers/${product.coverImage}`}
                      alt={`${product.title} · product cover`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                    />
                  </Link>
                </div>
                
                {/* Right: Details */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full text-left space-y-6 relative z-20">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--fg)]/10 pb-4">
                      <span className="px-2 py-0.5 text-xs font-mono border text-[var(--pillar-label-tools)] bg-[var(--pillar-label-tools)]/10 border-[var(--pillar-label-tools)]/30">
                        {product.pillar}
                      </span>
                      <span className="font-mono text-xs text-[var(--muted)]">
                        {product.format}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
                      {product.title}
                    </h3>
                    
                    <p className="text-base font-sans leading-relaxed text-[var(--fg)]/90">
                      {product.cardBlurb}
                    </p>

                    {/* What is included checklist */}
                    <div className="pt-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] block mb-3">WHAT'S INCLUDED:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[var(--fg)]/80">
                        {product.whatYouGet.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-[var(--accent)] font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between pt-6 border-t border-[var(--fg)]/10 gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-2xl font-black text-[var(--link)]">
                        {product.priceLabel}
                      </span>
                      <span className="bg-[var(--accent-soft)] text-[var(--accent-label,var(--accent))] border border-[var(--accent)]/20 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        No Card Needed
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/store/${product.slug}`}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-transparent text-[var(--fg)] border-2 border-[var(--fg)]/30 hover:border-[var(--fg)] font-bold text-xs uppercase tracking-[0.08em] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--fg)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-ring"
                      >
                        View details →
                      </Link>
                      <a
                        href={product.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-2 border-[var(--fg)] font-bold text-xs uppercase tracking-[0.08em] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--fg)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-ring"
                      >
                        Get free download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ---- How the store works ---- */}
      <section className="mt-20 max-w-5xl border-t border-[var(--fg)]/10 pt-10 text-[var(--fg)]/80">
        <h2 className="text-xl font-display font-bold uppercase tracking-tight text-[var(--fg)] mb-6">
          How the store works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-base">
          <div>
            <p className="font-sans leading-relaxed">
              Products are digital downloads: Notion templates, PDFs, editable
              files, or a ZIP containing more than one thing. Notion templates
              duplicate to your workspace in one click. PDFs can be printed or used
              on screen.
            </p>
          </div>
          <div className="space-y-4">
            <p className="font-sans leading-relaxed">
              Pay once, no subscription. The product is yours. I update templates
              occasionally based on what I learn; past buyers get the updates free
              where the platform supports it.
            </p>
            <p className="font-semibold text-[var(--fg)] font-sans">{REFUND_LINE}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
