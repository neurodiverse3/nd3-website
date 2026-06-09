"use client";
import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ShieldCheck } from 'lucide-react';
import { DocumentPreview } from './DocumentPreview';

export default function ProductCard({ 
  title, 
  price, 
  excerpt, 
  slug, 
  color = "from-pink-600 to-rose-700",
  reassurance = "Guaranteed sensory compatibility. If this framework does not fit your focus needs, reply for a full refund."
}) {
  // Gracefully format price
  const formattedPrice = price !== undefined && price !== null 
    ? price === 0 ? "FREE / PAY-WHAT-YOU-WANT" : `£${price}`
    : "FREE / PAY-WHAT-YOU-WANT";

  return (
    <div className="max-w-[760px] mx-auto my-12 bg-[#09090b]/80 border-4 border-fg-primary p-6 md:p-8 shadow-[6px_6px_0px_var(--rule)] hover:shadow-[8px_8px_0px_var(--accent-soft)] hover:border-accent transition-all duration-300 relative text-left group">
      
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Left Side: Defined Dimension Real Asset Cover Preview */}
        <div className="shrink-0 mx-auto md:mx-0 w-28 h-36 flex items-center justify-center relative overflow-hidden select-none">
          <DocumentPreview title={title} color={color} />
        </div>

        {/* Right Side: Product Details & CTA */}
        <div className="flex-grow space-y-4 w-full">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-rule/80 pb-2">
              <span className="text-[10px] font-mono tracking-widest text-accent uppercase font-bold">
                TOOLKIT COMPONENT
              </span>
              <span className="text-lg font-mono font-black text-fg-primary uppercase">
                {formattedPrice}
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-black uppercase text-fg-primary tracking-tight font-display mt-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
          </div>

          <p className="text-sm text-text-muted leading-relaxed font-sans font-light">
            {excerpt || "A sensory-compatible, highly tactical spatial workflow designed to align with fluctuating ADHD/AuDHD executive energies."}
          </p>

          {/* Reassurance line */}
          <div className="flex items-start gap-2 text-xs text-text-muted/80 italic font-sans font-light">
            <ShieldCheck size={14} className="text-accent shrink-0 mt-0.5" />
            <span>{reassurance}</span>
          </div>

          {/* Action Row */}
          <div className="pt-2">
            <Link
              href={`/store/${slug}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-accent text-[var(--accent-text,var(--bg))] text-xs font-black uppercase tracking-widest border-2 border-fg-primary rounded-none shadow-[3px_3px_0px_var(--fg)] hover:shadow-[1px_1px_0px_var(--fg)] hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 active:translate-x-0 transition-all focus-ring cursor-pointer"
            >
              <ShoppingCart size={13} strokeWidth={2.5} /> GET THE FRAMEWORK →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
