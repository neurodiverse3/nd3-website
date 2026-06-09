import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Sparkles, Shield, RefreshCw } from 'lucide-react';
import { getProductBySlug } from '../../../lib/strapi';
import { DocumentPreview } from '../../../components/DocumentPreview';
import RichTextRenderer from '../../../components/RichTextRenderer';
import ProductAddToCartButton from '../../../components/ProductAddToCartButton';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getProductBySlug(slug);
  } catch (err) {}

  if (!product && fallbackProducts[slug]) {
    product = fallbackProducts[slug];
  }

  if (!product) {
    return {
      title: 'Product not found · neurodivers³',
    };
  }

  const pageTitle = product.seoTitle || product.title;

  return {
    title: `${pageTitle} · neurodivers³`,
    description: product.excerpt || product.desc,
    openGraph: {
      title: `${pageTitle} · neurodivers³`,
      description: product.excerpt || product.desc,
    },
    twitter: {
      title: `${pageTitle} · neurodivers³`,
      description: product.excerpt || product.desc,
    }
  };
}

const fallbackProducts = {
  'dopamine-menu': {
    id: "default-1",
    _id: "default-1",
    title: "Dopamine Menu Template",
    price: 7,
    tag: "Best Seller",
    color: "from-pink-600 to-rose-700",
    excerpt: "A curated strategy to break through ADHD paralysis.",
    descriptionText: "ADHD executive dysfunction often leaves us locked in a state of paralysis, staring at a massive list of tasks unable to initiate. The Dopamine Menu is a physical-spatial workflow designed to categorize tasks by stimulation levels. Dividing tasks into 'Starters', 'Mains', 'Sides', and 'Desserts', this template helps you select exactly what your brain has the capacity to execute right now, reducing friction and ending productivity guilt."
  },
  'exec-dashboard': {
    id: "default-2",
    _id: "default-2",
    title: "Exec-Function Dashboard",
    price: 12,
    tag: "ADHD Resource",
    color: "from-teal-600 to-emerald-700",
    excerpt: "Planner system that prioritizes energy over urgency.",
    descriptionText: "Standard planners assume a steady, logical flow of daily focus and motivation. AuDHD planners must assume the opposite: that energy fluctuates wildly, streaks will be broken, and systems will be abandoned. The Exec-Function Dashboard is a visually-oriented planner that organizes your work by active mental energy demands. It assumes you will drop the tool and makes returning/restarting 100% guilt-free."
  },
  'sensory-audit': {
    id: "default-3",
    _id: "default-3",
    title: "Sensory Audit Workbook",
    price: 15,
    tag: "Autism Toolkit",
    color: "from-purple-600 to-indigo-700",
    excerpt: "Identify glimmers and triggers in your daily environment.",
    descriptionText: "Fluorescent lights, background murmurs, unexpected friction—these are the silent drainers of neurodivergent energy. The Sensory Audit Workbook is a tactical, self-paced diagnostic tool to map out your glimmers (safe, comforting environmental factors) and triggers (overstimulating, draining factors). Build a custom personal checklist to re-engineer your workspace and domestic layout for sensory safety."
  }
};

export default async function ProductPage(props) {
  const params = await props.params;
  const slug = params.slug;

  let product = null;

  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch product by slug: ", err);
  }

  // Fallback to static mock products if not found in Sanity
  if (!product && fallbackProducts[slug]) {
    product = fallbackProducts[slug];
  }

  if (!product) {
    notFound();
  }

  const features = [
    "Secure Instant Digital PDF download",
    "Interactive clickable tablet/IPad integration",
    "High-contrast, sensory-friendly dark mode print sheets",
    "Fully restartable structure (zero guilt when streaks break)",
    "Lifetime free updates as the system is refined"
  ];

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-6xl mx-auto flex flex-col justify-start text-left font-sans">
      {/* Back button */}
      <Link 
        href="/store" 
        className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 self-start cursor-pointer font-mono"
      >
        <ArrowLeft size={14} /> BACK TO THE TOOLKIT
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
        {/* Left 7 Columns: Product Showcase & Description */}
        <div className="lg:col-span-7 space-y-10">
          {/* Aesthetic preview banner */}
          <div className={`h-80 w-full bg-gradient-to-br ${product.color || "from-pink-600 to-rose-700"} relative overflow-hidden flex items-center justify-center p-12 border-4 border-fg-primary shadow-[6px_6px_0px_var(--rule)]`}>
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
              }} 
            />
            <DocumentPreview title={product.title} color={product.color || "from-pink-600 to-rose-700"} />
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--rule)] font-bold">
              {product.tag || "DIGITAL SYSTEM"}
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[var(--fg)] mt-4 font-display">
              {product.title}
            </h1>
            <p className="text-lg text-[var(--muted)] italic border-l-2 border-[var(--accent)] pl-4 py-1 leading-relaxed mt-2 font-sans">
              {product.excerpt || product.desc}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-[var(--fg)] border-b border-[var(--rule)] pb-3">
              THE METHODOLOGY
            </h2>
            <div className="prose prose-invert max-w-none text-[15px] text-[var(--muted)] leading-relaxed space-y-4 font-sans">
              {product.description ? (
                <RichTextRenderer content={product.description} />
              ) : (
                <p>{product.descriptionText || "A highly tactile, sensory-friendly resource designed dynamically for brain types that resist rigid corporate templates."}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Add to Cart and Features checklist */}
        <div className="lg:col-span-5 space-y-8 bg-bg-primary border-4 border-fg-primary p-8 shadow-[8px_8px_0px_var(--rule)]">
          <div className="flex justify-between items-baseline border-b border-[var(--rule)] pb-4">
            <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider font-bold">INVESTMENT RATE</span>
            <span className="text-4xl font-black text-[var(--fg)] font-display">£{product.price}</span>
          </div>

          {/* Add to cart client module */}
          <ProductAddToCartButton product={product} />

          {/* Guarantee Badges */}
          <div className="space-y-4 pt-4 border-t border-[var(--rule)] text-xs text-[var(--muted)] font-sans">
            <div className="flex items-start gap-2.5">
              <Shield size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
              <span><strong>Guaranteed sensory compatibility.</strong> If this framework does not align with your focus needs, reply to your receipt for a prompt refund.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <RefreshCw size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
              <span><strong>Instant Delivery.</strong> Compiled files are generated and stream immediately to your device after checkout completing.</span>
            </div>
          </div>

          {/* What's included checklist */}
          <div className="space-y-4 pt-6 border-t border-[var(--rule)]">
            <h4 className="text-xs font-mono font-bold uppercase text-[var(--fg)] tracking-wider text-left">SYSTEM FEATURES</h4>
            <ul className="space-y-2.5 text-xs text-[var(--muted)]">
              {features.map((feature, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-left font-sans">
                  <Check size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
