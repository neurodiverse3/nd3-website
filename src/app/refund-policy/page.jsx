import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy · neurodivers³',
  description: 'Our digital download refund guidelines aligned with the UK Consumer Rights Act 2015 and statutory requirements.',
  openGraph: {
    title: 'Refund Policy · neurodivers³',
    description: 'Our digital download refund guidelines aligned with the UK Consumer Rights Act 2015 and statutory requirements.',
  },
  twitter: {
    title: 'Refund Policy · neurodivers³',
    description: 'Our digital download refund guidelines aligned with the UK Consumer Rights Act 2015 and statutory requirements.',
  }
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
        <div className="mb-16 border-b-2 border-fg-primary pb-8 text-left w-full mt-4">
          <span className="text-[12px] font-black uppercase tracking-[0.25em] text-accent-pink">
            LEGAL COMPLIANCE
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-fg-primary mt-2">
            Refund Policy
          </h1>
          <p className="text-xs text-text-muted font-mono leading-relaxed mt-3">
            Last updated: May 2026 · Compliant with the UK Consumer Rights Act 2015
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Refund Content (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-12 text-left">
            
            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">1. Digital Downloads Policy</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  Because our products are digital downloads available for immediate access and consumption, <span className="font-semibold text-[var(--fg)]">all sales are final.</span> Once a purchase is processed and download links are generated, we cannot offer refunds, returns, or exchanges.
                </p>
                <p>
                  By finalizing your transaction, you explicitly acknowledge that your statutory 14-day cooling-off/cancellation period (as provided under UK Consumer Contracts Regulations) is waived immediately upon commencing the download or accessing the file details.
                </p>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">2. Statutory Rights & Defective Files</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  We fully align our services with the <strong className="text-[var(--fg)]">UK Consumer Rights Act 2015</strong>. If a digital download is proven to be corrupted, defective, or incorrectly described, you have a statutory right to request a repair or replacement.
                </p>
                <p>
                  If we cannot repair or replace the file within a reasonable timeframe, you will be entitled to a full or partial refund. If you encounter any technical issues opening, importing, or printing your downloaded assets, please email us immediately so we can compile a fresh copy for you.
                </p>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">3. Compatibility Assurance</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  Traditional organization systems assume neurotypical focus capacity. Our tools are designed specifically for brain types that resist rigid scheduling. 
                </p>
                <p>
                  If you purchase a tool and find that the visual layout or organizational structure triggers sensory friction or severe ADHD executive block, please contact us. While digital sales are legally non-refundable under immediate download waivers, we prioritize neurodivergent accessibility and would love to exchange the item for a different format or find a setup that suits your sensory profile.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar / Quick Info (Spans 1 column) */}
          <div className="space-y-6">
            <div className="bg-bg-primary border-2 border-[var(--rule)] p-6 shadow-[4px_4px_0px_var(--rule)]">
              <h3 className="text-lg font-black uppercase tracking-tight text-[var(--fg)] mb-4">Quick Summary</h3>
              <ul className="text-sm text-[var(--muted)] space-y-3 font-normal leading-relaxed text-left">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Digital purchases are final and non-refundable once accessed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Waived 14-day cancellation cooling-off period upon download.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Statutory replacements provided for corrupted or defective files.</span>
                </li>
              </ul>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-6 shadow-[4px_4px_0px_var(--rule)] text-sm text-left">
              <h3 className="font-bold uppercase text-[var(--fg)] mb-2">Need File Support?</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                If your Gumroad transmission fails, or if a PDF gets corrupted on your device, get in touch. We will manually verify your receipt and send a replacement.
              </p>
              <a 
                href="mailto:ollie@neurodivers3.co.uk" 
                className="w-full inline-block py-3 bg-[var(--accent)] text-bg-primary font-black uppercase tracking-wider text-xs border border-[var(--fg)] text-center shadow-[3px_3px_0px_var(--fg)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all animate-pulse-slow"
              >
                Get Support Email
              </a>
            </div>
          </div>
        </div>
    </div>
  );
}
