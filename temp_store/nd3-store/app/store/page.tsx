import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";
import { REFUND_LINE, LAUNCH_NOTE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Store · The Toolkit — neurodivers\u00B3",
  description:
    "Small Notion templates and PDFs for specific neurodivergent moments. Not a productivity system. Buy the one tool you need for the moment you're in.",
};

export default function StorePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-16 text-white">
      {/* ---- Hero (Type 2 section header) ---- */}
      <header className="border-b border-white/10 pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--nd3-pink)]">
          ND3 Resource Hub
        </p>
        <h1 className="mt-4 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">
          Store <span className="text-white/40">·</span>{" "}
          <span className="italic text-[var(--nd3-pink)]">The Toolkit.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
          Accessibility resources and digital planners designed specifically for
          brain types that resist rigid corporate organisation models.
        </p>
      </header>

      {/* ---- Intro copy ---- */}
      <section className="mt-12 max-w-2xl space-y-4 text-white/80">
        <p className="text-lg italic text-white/60">
          Small Notion templates for specific neurodivergent moments.
        </p>
        <p>
          Every product in the store is a focused tool for one situation. Not a
          productivity system. Not a methodology. Not a course. Each one is
          something I built for myself, used long enough to know it worked, then
          cleaned up so other people could use it too.
        </p>
        <p>
          There is one bundle, because some people already know they want the
          whole set. There is no ladder, no pressure, no fake scarcity. Buy the
          one tool you need for the moment you're in.
        </p>
        <p className="font-mono text-sm text-[var(--nd3-pink)]">
          {LAUNCH_NOTE}
        </p>
      </section>

      {/* ---- Product grid ---- */}
      <section className="mt-14">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* ---- How the store works ---- */}
      <section className="mt-16 max-w-2xl space-y-4 border-t border-white/10 pt-10 text-white/80">
        <h2 className="text-xl font-bold uppercase tracking-tight">
          How the store works
        </h2>
        <p>
          Products are digital downloads: Notion templates, PDFs, editable
          files, or a ZIP containing more than one thing. Notion templates
          duplicate to your workspace in one click. PDFs can be printed or used
          on screen.
        </p>
        <p>
          Pay once, no subscription. The product is yours. I update templates
          occasionally based on what I learn; past buyers get the updates free
          where the platform supports it.
        </p>
        <p className="font-semibold text-white">{REFUND_LINE}</p>
      </section>
    </main>
  );
}
