import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Got Lost in the Tabs · neurodivers³',
  description: 'The page you are looking for isn\'t here.',
};

export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="max-w-xl flex flex-col gap-8">
        {/* Pulsating eyebrow */}
        <div className="inline-block text-[11px] font-mono tracking-[0.25em] text-accent bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-2 select-none self-center w-fit">
          ERROR 404
        </div>

        {/* Headline Stack */}
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-left sm:text-center text-white">
          THIS ONE GOT<br className="hidden sm:inline" /> LOST IN THE TABS.
        </h1>

        {/* Sub */}
        <p className="text-base md:text-lg text-[#8A8A93] leading-relaxed font-normal text-left sm:text-center">
          The page you're looking for isn't here. Either it never existed or my brain forgot to publish it.
        </p>

        {/* Action items */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 font-mono text-xs uppercase tracking-widest font-bold">
          <Link
            href="/blog"
            className="px-4 py-2 border border-[#1F1F22] hover:border-accent hover:text-accent transition-all duration-200"
          >
            ← Back to the blog
          </Link>
          <Link
            href="/"
            className="px-4 py-2 border border-[#1F1F22] hover:border-white transition-all duration-200"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
