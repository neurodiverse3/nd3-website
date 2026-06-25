"use client";
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { LabPreview } from './labs/LabPreviews';

const defaultCategories = [
  { _id: "all", title: "ALL PROTOTYPES", slug: "all" },
  { _id: "acoustic-shield", title: "ACOUSTIC SHIELDS", slug: "acoustic" },
  { _id: "dopamine-reset", title: "DOPAMINE RESETS", slug: "dopamine" },
  { _id: "visual-space", title: "VISUAL & SPACE", slug: "visual" }
];

const defaultLabs = [
  {
    _id: "default-1",
    title: "Acoustic Shield",
    slug: "acoustic-shield",
    category: { title: "ACOUSTIC SHIELDS", slug: "acoustic" },
    tag: "AUDIO",
    excerpt: "An interactive client-side sound generator producing customized pink, white, and brown noise to mask distracting ambient sounds and quieten an overactive nervous system.",
    toolComponentKey: "acoustic-shield",
    setupTime: "30 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-2",
    title: "Sensory Audit",
    slug: "sensory-audit",
    category: { title: "VISUAL & SPACE", slug: "visual" },
    tag: "SENSORY",
    excerpt: "A guided 7-question environmental self-audit designed to identify hidden sensory drains in your workspace and output a single, high-impact adjustment to make today.",
    toolComponentKey: "sensory-audit",
    setupTime: "2 min",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-3",
    title: "Visual Snow Shield",
    slug: "visual-snow-shield",
    category: { title: "VISUAL & SPACE", slug: "visual" },
    tag: "VISUAL",
    excerpt: "Overlay fine-grain, customizable fractal noise on your screen to reduce harsh light spikes, ease visual static, and soothe screen-induced sensory overload.",
    toolComponentKey: "visual-snow-shield",
    setupTime: "15 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-4",
    title: "Spoon Tracker",
    slug: "spoon-tracker",
    category: { title: "VISUAL & SPACE", slug: "visual" },
    tag: "EXECUTIVE DYSFUNCTION",
    excerpt: "A tactile, visual energy budget tool based on Spoon Theory. Drag and drop spoons throughout your day to visualize and manage your fluctuating cognitive capacity.",
    toolComponentKey: "spoon-tracker",
    setupTime: "15 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-5",
    title: "Decision Coin",
    slug: "decision-coin",
    category: { title: "DOPAMINE RESETS", slug: "dopamine" },
    tag: "DECISIONS",
    excerpt: "A simple, low-friction tool to break executive paralysis. Input two options and let the coin make the micro-choices your brain is currently too tired to process.",
    toolComponentKey: "decision-coin",
    setupTime: "5 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-6",
    title: "Brown Noise Loop",
    slug: "brown-noise-loop",
    category: { title: "ACOUSTIC SHIELDS", slug: "acoustic" },
    tag: "AUDIO",
    excerpt: "A deep, client-side synthesized Brownian rumble paired with a highly visible focus timebox to help lock in attention and maintain focus during deep work sessions.",
    toolComponentKey: "brown-noise-loop",
    setupTime: "5 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  }
];

function LabsClientInner({ initialCategories, initialLabs }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = initialCategories.length > 0
    ? [{ _id: "all", title: "ALL PROTOTYPES", slug: "all" }, ...initialCategories]
    : defaultCategories;

  const labs = initialLabs.length > 0 ? initialLabs : defaultLabs;

  const initialCategory = searchParams?.get('category') || 'all';
  const initialSearch = searchParams?.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    if (activeCategory !== 'all') {
      params.set('category', activeCategory);
    } else {
      params.delete('category');
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    const queryString = params.toString();
    const currentQueryString = searchParams.toString();
    
    // Strict guard to prevent infinite Next.js re-fetching/re-routing loop
    if (queryString !== currentQueryString) {
      const newUrl = queryString ? `/labs?${queryString}` : '/labs';
      router.replace(newUrl, { scroll: false });
    }
  }, [activeCategory, searchQuery, router, searchParams]);

  const filteredLabs = labs.filter(lab => {
    const catMatch = activeCategory === 'all' ||
      (lab.category?.slug === activeCategory) ||
      (lab.category?.title?.toLowerCase().includes(activeCategory.toLowerCase()));
    const searchMatch = !searchQuery ||
      lab.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tag?.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const getToolKey = (lab) => lab.toolComponentKey || lab.slug || '';

  return (
    <div className="space-y-8">
      {/* Reassurance Strip */}
      <div className="border border-dashed border-accent/40 bg-bg-primary p-4 text-center text-xs md:text-sm font-mono tracking-wider text-accent select-none">
        FREE EXPERIMENTS · NO ACCOUNTS · NO TRACKING · DATA STAYS LOCAL WHERE POSSIBLE
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-border-rule pb-6 text-left">
        {categories.map((cat) => {
          const categoryId = cat.slug || cat.slug?.current || cat._id;
          const isActive = activeCategory === categoryId;
          return (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(categoryId)}
              className={`px-4 py-2 text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border rounded-none ${
                isActive
                  ? 'bg-accent text-bg-primary border-accent shadow-[2px_2px_0px_var(--fg)]'
                  : 'bg-transparent text-text-muted border-border-rule hover:border-text-muted/50 hover:text-fg-primary'
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Search + Metadata Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm font-mono text-text-muted uppercase tracking-[0.12em] pb-4 border-b border-dashed border-border-rule/60 select-none">
        <span>
          {activeCategory === 'all' && !searchQuery
            ? `SHOWING ${filteredLabs.length} PROTOTYPE${filteredLabs.length !== 1 ? 'S' : ''}`
            : `FOUND ${filteredLabs.length} PROTOTYPE${filteredLabs.length !== 1 ? 'S' : ''} MATCHING COMBO`
          }
        </span>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {(activeCategory !== "all" || searchQuery) && (
            <button
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="text-accent hover:underline font-black cursor-pointer bg-transparent border-none text-sm uppercase font-mono tracking-wider"
            >
              RESET FILTER
            </button>
          )}
          <div className="relative flex-1 sm:w-56">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs..."
              className="w-full bg-bg-primary/40 border border-border-rule pl-8 pr-3 py-1.5 text-sm font-mono text-fg-primary placeholder:text-text-muted/50 outline-none focus:border-accent transition-colors rounded-none uppercase tracking-wider"
            />
          </div>
        </div>
      </div>

      {/* Uniform Card Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left"
      >
        <AnimatePresence mode="popLayout">
          {filteredLabs.map((lab) => {
            const labSlug = lab.slug || lab.slug?.current || "";
            const isHovered = hoveredCard === lab._id;
            return (
              <motion.div
                key={lab._id}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onMouseEnter={() => setHoveredCard(lab._id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`lab-card-premium sidebar-card flex flex-col h-[400px] relative overflow-hidden ${
                  isHovered ? '' : ''
                }`}
              >
                {/* Module 4.7: Premium oscilloscope corner brackets (GPU-accelerated) */}
                <span className="corner-bracket tl" aria-hidden="true" />
                <span className="corner-bracket tr" aria-hidden="true" />
                <span className="corner-bracket bl" aria-hidden="true" />
                <span className="corner-bracket br" aria-hidden="true" />

                {/* Module 4.7: Oscilloscope SVG line that animates on hover */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    className="oscilloscope-line"
                    d="M 0 50 Q 12.5 20, 25 50 T 50 50 T 75 50 T 100 50"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Entire card surface is the link - Module 4.2 */}
                <Link
                  href={`/labs/${labSlug}`}
                  className="absolute inset-0 z-20 cursor-pointer"
                  aria-label={`Open ${lab.title} lab`}
                />

                {/* Preview Area */}
                <div className="h-[180px] border-b border-border-rule bg-black/60 relative overflow-hidden">
                  <LabPreview slug={getToolKey(lab)} isActive={isHovered} />
                  {/* Tag Badge - Module 4.5: functional categories replace generic EXPERIMENT */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-sm font-mono font-bold uppercase tracking-widest text-accent bg-black/70 border border-border-rule px-2 py-0.5">
                      {lab.tag || "TOOL"}
                    </span>
                  </div>
                  {/* Hover Indicator */}
                  <div className={`absolute bottom-2 right-2 z-10 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-sm font-mono text-accent uppercase tracking-wider animate-pulse">
                      PREVIEW ACTIVE
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 flex flex-col justify-between pointer-events-none">
                  <div className="space-y-3">
                    <h2 className="text-lg font-black uppercase text-fg-primary tracking-tight leading-none group-hover:text-accent transition-colors">
                      {lab.title}
                    </h2>
                    {/* Module 4.6: Always show 1-2 sentence cognitive-friendly description */}
                    <p
                      className="text-base text-text-muted font-sans leading-relaxed min-h-[2.5rem]"
                      title={lab.excerpt}
                    >
                      {lab.excerpt || `A ${lab.tag?.toLowerCase() || 'free'} lab prototype to help neurodivergent brains.`}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-border-rule/40 mt-3">
                    {lab.setupTime && (
                      <span className="text-sm font-mono text-text-muted uppercase tracking-wider">
                        {lab.setupTime} setup
                      </span>
                    )}
                    {lab.noTracking && (
                      <span className="text-sm font-mono text-green-500/70 uppercase tracking-wider">
                        No tracking
                      </span>
                    )}
                  </div>

                  {/* CTA - purely visual now, real link is the absolute overlay */}
                  <div className="w-full mt-4 py-3 bg-transparent text-fg-primary border border-border-rule group-hover:border-accent font-black uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2 rounded-none group-hover:bg-accent group-hover:text-[var(--accent-btn-text)] group-hover:border-accent">
                    OPEN LAB <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredLabs.length === 0 && (
        <div className="border border-border-rule bg-surface/20 p-12 text-center space-y-4 shadow-[4px_4px_0px_var(--rule)]">
          <Sparkles size={24} className="text-text-muted mx-auto" />
          <p className="text-sm font-mono text-text-muted uppercase tracking-wider">
            NO PROTOTYPES MATCH YOUR CURRENT COMBINATION
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="px-6 py-2 bg-accent text-bg-primary border border-accent font-black uppercase text-sm tracking-wider cursor-pointer hover:bg-transparent hover:text-accent transition-all rounded-none shadow-[2px_2px_0px_var(--fg)]"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}
    </div>
  );
}

export function LabsClient({ initialCategories = [], initialLabs = [] }) {
  return (
    <Suspense fallback={
      <div className="space-y-10">
        <div className="flex flex-wrap gap-3 border-b border-[var(--rule)] pb-6">
          {defaultCategories.map((cat) => (
            <div key={cat._id} className="px-4 py-2 w-32 h-9 bg-black/20 border border-[var(--rule)] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[380px] border border-[var(--rule)] bg-black/20 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <LabsClientInner initialCategories={initialCategories} initialLabs={initialLabs} />
    </Suspense>
  );
}
