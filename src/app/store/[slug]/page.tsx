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
      title: "Product Not Found - neurodivers³",
    };
  }

  return {
    title: `${product.title} - neurodivers³`,
    description: product.cardBlurb,
    alternates: {
      canonical: `https://neurodivers3.co.uk/store/${slug}`,
    },
    openGraph: {
      title: `${product.title} - neurodivers³`,
      description: product.cardBlurb,
      images: [`/store/covers/${product.coverImage}`],
    },
  };
}

interface FAQItem {
  q: string;
  a: string;
}

function getFAQsForProduct(slug: string, isFree: boolean): FAQItem[] {
  const faqs: FAQItem[] = [];

  // 1. Delivery FAQ
  if (isFree) {
    faqs.push({
      q: "How do I receive my free download?",
      a: "Immediately after entering your email, Polar will direct you to a download page, and you will receive an automated email with the direct link. No payment or card details are required."
    });
  } else {
    faqs.push({
      q: "How do I receive my downloads?",
      a: "Immediately after payment completes, Polar will direct you to a download page, and you will receive an automated email receipt containing your direct download links. Notion links are provided inside a README text file."
    });
  }

  // 2. Refund FAQ (Only for paid)
  if (!isFree) {
    faqs.push({
      q: "What is your refund policy?",
      a: "neurodivers³ offers a voluntary 14-day refund window on all digital products, no questions asked. If this tool does not fit your focus needs, just email us at hello@neurodivers3.co.uk within 14 days of purchase for a full refund."
    });
  }

  // 3. Product type specific FAQs
  if (slug === "the-toolkit") {
    faqs.push(
      {
        q: "How are the six tools delivered?",
        a: "You will receive a single ZIP file containing all PDF workbooks, plain text files, and a master README containing the duplication links for all four Notion workspaces. You can duplicate them all or just the ones you need."
      },
      {
        q: "Can I share these templates with my household?",
        a: "Yes. The personal license covers your single household. Anyone living under your roof is welcome to use these tools to build a collaborative sensory or planning routine."
      },
      {
        q: "What if I already bought one of the individual tools?",
        a: "If you want to upgrade to the Toolkit but already bought an individual tool, just buy the Toolkit and email hello@neurodivers3.co.uk with both receipts. We will happily refund the individual item price."
      }
    );
  } else if (slug === "1-page-dopamine-menu") {
    faqs.push(
      {
        q: "Is this a physical or digital product?",
        a: "This is a digital download. You will receive a high-resolution, print-friendly PDF file that you can print at home or use on a tablet/screen."
      },
      {
        q: "Why is this resource free?",
        a: "The 1-Page Dopamine Menu is the smallest version of our menu format. It is offered free so you can try out the structure and see if it works for your brain before deciding if you want the fully editable Notion template."
      },
      {
        q: "Will you spam my inbox if I sign up?",
        a: "Never. We send a maximum of two emails a month: honest, lived-experience essays on neurodivergence, plus notice of new templates or updates. You can unsubscribe with a single click at any time."
      }
    );
  } else if (slug === "sensory-audit-workbook" || slug === "communication-templates-bundle") {
    faqs.push(
      {
        q: "Is this a physical workbook or digital?",
        a: slug === "sensory-audit-workbook"
          ? "This is a digital download. You will receive a high-resolution, print-ready PDF that you can print at home or fill out digitally on your tablet, phone, or computer."
          : "This is a digital download. You will receive a ZIP containing the print-ready PDF, plus plain text (.txt), Markdown (.md), and Word (.docx) files so you can copy and customize the templates in any app."
      },
      {
        q: "How do I fill out the PDF on screen?",
        a: "The PDF is fully interactive and contains fillable form fields. You can open it in any modern web browser or PDF reader (such as Adobe Acrobat or Apple Books) and type your responses directly into the fields."
      },
      {
        q: "What document sizes are provided?",
        a: "We provide both A4 and US Letter sizes of the PDF to ensure perfect margins when printing, no matter where you are located."
      }
    );
  } else if (slug === "masking-recovery-pack") {
    faqs.push(
      {
        q: "What files are included in the recovery pack?",
        a: "You get a ZIP containing a 12-page PDF (for acute, low-energy recovery protocols) and a README text file containing the direct duplication link for the Notion-based tracking database."
      },
      {
        q: "Do I need to use both the PDF and Notion parts?",
        a: "No. The PDF is designed for the acute, low-energy recovery days when you need something offline, simple, and tactile. The Notion tracker is for when your energy returns and you want to notice patterns. Use whichever fits your capacity."
      },
      {
        q: "Do I need a paid Notion plan?",
        a: "No. The Notion tracker is fully compatible with the free personal Notion plan. You can duplicate it in one click."
      }
    );
  } else {
    faqs.push(
      {
        q: "Do I need a paid Notion plan?",
        a: "No. All Notion templates in the store are fully compatible with the free personal Notion plan. You can duplicate them to your workspace with a single click."
      },
      {
        q: "Can I customize the database and layout?",
        a: "Yes, 100%. Once duplicated to your workspace, you own the template. You can add databases, rename properties, change icons, or integrate it into your existing setups."
      },
      {
        q: "What if I am completely new to Notion?",
        a: "We build our templates to be as low-friction as possible. The workspace includes simple, inline 'Start Here' guides and is stripped of complex, fragile multi-database relationships. It is designed to be easy to use, even on high-fog days."
      }
    );
  }

  // 4. Update FAQ (For all paid)
  if (!isFree) {
    faqs.push({
      q: "Do I get updates when templates change?",
      a: "Yes. When we refine our templates or workbooks based on what we learn, past buyers receive automatic updates and fresh download links for free where the platform supports it."
    });
  }

  return faqs;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const paidProducts = PRODUCTS.filter((p) => !p.isFree && !p.isBundle);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": `https://neurodivers3.co.uk/store/covers/${product.coverImage}`,
    "description": product.cardBlurb,
    "offers": {
      "@type": "Offer",
      "url": `https://neurodivers3.co.uk/store/${product.slug}`,
      "priceCurrency": "GBP",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://neurodivers3.co.uk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Store",
        "item": "https://neurodivers3.co.uk/store"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://neurodivers3.co.uk/store/${product.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-[96px] text-[var(--fg)] md:pt-[120px]">
      {/* ---- Back button ---- */}
      <nav aria-label="Back" className="mb-6">
        <Link href="/store" className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.1em] text-[var(--fg)] transition-all hover:-translate-x-1 hover:text-[var(--accent)]">
          ← Back to Store
        </Link>
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
            <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/5 p-6 shadow-[4px_4px_0px_var(--accent)] space-y-4">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--fg)]">
                This is for you if:
              </h3>
              <ul className="space-y-3">
                {product.forYou.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--fg)] leading-relaxed font-sans">
                    <span aria-hidden="true" className="text-[var(--accent)] shrink-0 font-mono font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not This */}
            <div className="border-2 border-dashed border-[var(--fg)]/50 bg-[var(--fg)]/5 p-6 space-y-4">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--fg)]/80">
                This is not:
              </h3>
              <ul className="space-y-3">
                {product.notThis.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--fg)]/80 leading-relaxed font-sans">
                    <span aria-hidden="true" className="text-[var(--fg)]/50 shrink-0 font-mono font-bold">✕</span>
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
                className="inline-flex w-full items-center justify-center border-2 border-[var(--fg)] bg-[var(--accent)] text-[var(--accent-text,var(--bg))] font-bold text-xs py-3 tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--fg)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
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
              {getFAQsForProduct(product.slug, product.isFree || false).map((faq, idx) => (
                <details key={idx} className="group border-b border-[var(--fg)]/10 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none select-none font-bold text-base text-[var(--fg)] outline-none focus-visible:text-[var(--accent)]">
                    <span>{faq.q}</span>
                    <span className="text-xl transition-transform duration-200 group-open:rotate-45 text-[var(--accent)] font-mono" aria-hidden="true">+</span>
                  </summary>
                  <div className="mt-3 text-sm text-[var(--fg)]/85 leading-relaxed font-sans">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Sticky on desktop, hidden on mobile) */}
        <aside className="hidden min-[920px]:block sticky top-[120px] w-[360px] shrink-0">
          <BuyPanel product={product} />
        </aside>
      </div>

      {/* Module 5.2: Mobile sticky checkout bar — fixed to viewport bottom */}
      <div className="min-[920px]:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[var(--fg)] bg-[var(--surface,var(--bg))] p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]">
        <BuyPanel product={product} compact />
      </div>
      {/* Spacer so content doesn't hide behind the fixed bar */}
      <div className="min-[920px]:hidden h-28" aria-hidden="true" />
    </div>
    </>
  );
}

function BuyPanel({ product, compact = false }: { product: Product; compact?: boolean }) {
  const isFree = product.isFree;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col flex-shrink-0">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)]">Price</span>
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
      <div className="flex flex-col gap-3 border-b border-[var(--fg)]/10 pb-6">
        <span className="font-mono text-sm font-bold text-[var(--muted)] uppercase tracking-widest">PRICE</span>
        <div className="flex items-center justify-between gap-2">
          <span className="text-4xl font-black text-[var(--accent)] font-display">{product.priceLabel}</span>
          {!isFree && (
            <span className="bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border border-[var(--fg)]/30 text-xs font-bold px-3 py-1 uppercase tracking-wider">
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
