import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use · neurodivers³',
  description: 'Terms of service and digital download refund guidelines aligned with the UK Consumer Rights Act 2015.',
  openGraph: {
    title: 'Terms of Use · neurodivers³',
    description: 'Terms of service and digital download refund guidelines aligned with the UK Consumer Rights Act 2015.',
  },
  twitter: {
    title: 'Terms of Use · neurodivers³',
    description: 'Terms of service and digital download refund guidelines aligned with the UK Consumer Rights Act 2015.',
  }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
        <div className="mb-16 border-b-2 border-fg-primary pb-8 text-left w-full mt-4">
          <span className="text-[12px] font-black uppercase tracking-[0.25em] text-accent-pink">
            LEGAL TERMS
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-fg-primary mt-2">
            Terms of Use
          </h1>
          <p className="text-xs text-text-muted font-mono leading-relaxed mt-3">
            Last updated: May 2026 · Aligned with the UK Consumer Rights Act 2015
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Terms Content (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-12">
            
            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">1. Agreement to Terms</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  By accessing and navigating the website <span className="font-semibold text-[var(--fg)]">neurodivers³</span> ("we", "our", "us"), or by purchasing any of our digital tools, planners, or resources, you agree to comply with and be bound by these Terms of Use. If you disagree with any part of these terms, you must cease using this website immediately.
                </p>
                <p>
                  We reserve the right to modify these terms at any time. Your continued use of the website following any changes constitutes acceptance of those modified terms.
                </p>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">2. Digital Products & Refund Policy</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  Our toolkit contains instantly downloadable PDFs, templates, and digital planners.
                </p>
                <p>
                  <strong className="text-[var(--fg)]">UK Consumer Rights Act 2015 & Statutory Cancellation:</strong> Under UK consumer protection rules, you have a statutory right to cancel digital contracts within 14 days. However, because our digital assets are available for immediate download and consumption, <span className="font-semibold text-[var(--fg)]">you explicitly agree and acknowledge that by clicking "Purchase" and obtaining access to the download links, your 14-day cooling-off/cancellation period is waived.</span>
                </p>
                <p>
                  Consequently, all digital sales are final. Refunds will only be issued if the digital file is proven to be corrupted, defective, or misdescribed under statutory quality guarantees. If you encounter any technical issues with your file, contact us immediately.
                </p>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">3. Intellectual Property</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  All writing, custom designs, tools, SVG graphics, and software scripts on this platform are owned by Ollie (trading as neurodivers³). 
                </p>
                <p>
                  Purchasing a toolkit item grants you a <span className="font-semibold text-[var(--fg)]">single-user, personal, non-transferable license</span>. You may print and use the files for your own individual routines. You may <strong>not</strong> redistribute, share, resell, relicense, or modify our templates to sell or share as your own templates.
                </p>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">4. Acceptable Use & Conduct</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  You agree to use this site only for lawful purposes. You are strictly prohibited from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Attempting to bypass security mechanisms, database projections, or access-control schemes.</li>
                  <li>Scraping content or writing logs in bulk for the purpose of training machine learning systems or publishing duplicates.</li>
                  <li>Using our contact avenues to send unsolicited advertisements or junk email.</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">5. Governing Law</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  These Terms of Use, their subject matter, and their formation are governed by the laws of England and Wales. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar / Quick Info (Spans 1 column) */}
          <div className="space-y-6">
            <div className="bg-bg-primary border-2 border-[var(--rule)] p-6 shadow-[4px_4px_0px_var(--rule)]">
              <h3 className="text-lg font-black uppercase tracking-tight text-[var(--fg)] mb-4">Quick Read</h3>
              <ul className="text-sm text-[var(--muted)] space-y-3 font-normal leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Instant downloads, non-refundable once accessed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Personal, single-user license only.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Governed by English & Welsh law.</span>
                </li>
              </ul>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-6 shadow-[4px_4px_0px_var(--rule)] text-sm">
              <h3 className="font-bold uppercase text-[var(--fg)] mb-2">Help & File Support</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                Did your file fail to download? Don't worry. Contact us and we will manually verify the Gumroad receipt and email you a fresh copy.
              </p>
              <a 
                href="mailto:ollie@neurodivers3.co.uk" 
                className="w-full inline-block py-3 bg-[var(--accent)] text-bg-primary font-black uppercase tracking-wider text-xs border border-[var(--fg)] text-center shadow-[3px_3px_0px_var(--fg)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
              >
                Request Download Support
              </a>
            </div>
          </div>
        </div>
    </div>
  );
}
