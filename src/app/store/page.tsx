import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";
import { REFUND_LINE, LAUNCH_NOTE } from "@/lib/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Store · neurodivers³",
  description:
    "Small Notion templates and PDFs for specific neurodivergent moments. Not a productivity system. Buy the one tool you need for the moment you're in.",
};

export default function StorePage() {
  const fivePounds = PRODUCTS.filter((p) => p.tier === "5");
  const sevenPounds = PRODUCTS.filter((p) => p.tier === "7");
  const bundle = PRODUCTS.filter((p) => p.tier === "19");
  const free = PRODUCTS.filter((p) => p.tier === "free");

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-[96px] md:pt-[120px] text-[var(--fg)]">
      <PageHeader
        variant="section"
        eyebrow="ND3 Resource Hub"
        titleLabel="Store"
        titleAccent="Digital Products"
        subtitle="Focused tools for specific neurodivergent moments."
      />

      {/* ---- Intro copy ---- */}
      <section className="mt-12 max-w-2xl space-y-4 text-[var(--fg)]/80">
        <p className="font-sans leading-relaxed">
          Every product in the store is a focused tool for one situation. Not a
          productivity system. Not a methodology. Not a course. Each one is
          something I built for myself, used long enough to know it worked, then
          cleaned up so other people could use it too.
        </p>
        <p className="font-sans leading-relaxed">
          There is one bundle, because some people already know they want the
          whole set. There is no ladder, no pressure, no fake scarcity. Buy the
          one tool you need for the moment you're in.
        </p>
        <p className="font-mono text-sm text-[var(--link)]">
          {LAUNCH_NOTE}
        </p>
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

        {/* The Bundle Section */}
        <section className="space-y-8">
          <div className="border-b-4 border-[var(--fg)] pb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
              The Launch Bundle
            </h2>
            <p className="text-sm text-[var(--muted)] font-mono mt-1">
              Get the entire launch suite of six tools in a single download. Save £15.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {bundle.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* Free Resources Section */}
        <section className="space-y-8">
          <div className="border-b-4 border-[var(--fg)] pb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
              Free Resources
            </h2>
            <p className="text-sm text-[var(--muted)] font-mono mt-1">
              Zero-friction templates to try out the formats and concepts.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {free.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      </div>

      {/* ---- How the store works ---- */}
      <section className="mt-20 max-w-2xl space-y-4 border-t border-[var(--fg)]/10 pt-10 text-[var(--fg)]/80">
        <h2 className="text-xl font-display font-bold uppercase tracking-tight text-[var(--fg)]">
          How the store works
        </h2>
        <p className="font-sans leading-relaxed">
          Products are digital downloads: Notion templates, PDFs, editable
          files, or a ZIP containing more than one thing. Notion templates
          duplicate to your workspace in one click. PDFs can be printed or used
          on screen.
        </p>
        <p className="font-sans leading-relaxed">
          Pay once, no subscription. The product is yours. I update templates
          occasionally based on what I learn; past buyers get the updates free
          where the platform supports it.
        </p>
        <p className="font-semibold text-[var(--fg)] font-sans">{REFUND_LINE}</p>
      </section>
    </main>
  );
}
