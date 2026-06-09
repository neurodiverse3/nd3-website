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
    tag: "SYNTH",
    excerpt: "Brownian focus hum to mask ambient office noises and calm auditory nodes.",
    toolComponentKey: "acoustic-shield",
    setupTime: "30 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-2",
    title: "Dopamine Snacks",
    slug: "dopamine-snacks",
    category: { title: "DOPAMINE RESETS", slug: "dopamine" },
    tag: "DOPAMINE",
    excerpt: "Roll for a sensory reset. Simple physical tasks that interrupt digital loops.",
    toolComponentKey: "dopamine-menu",
    setupTime: "10 sec",
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
    excerpt: "Fine-grain fractal textures across your viewport to soften screen spikes and focus timebox.",
    toolComponentKey: "visual-snow-shield",
    setupTime: "15 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-4",
    title: "Brown Noise Loop",
    slug: "brown-noise-loop",
    category: { title: "ACOUSTIC SHIELDS", slug: "acoustic" },
    tag: "FOCUS",
    excerpt: "A client-side synthesized deep Brownian rumble with a warm, tactile timebox to lock in attention.",
    toolComponentKey: "brown-noise-loop",
    setupTime: "5 sec",
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
    excerpt: "Tap to flip. Two custom labels. Useful for the decisions your brain refuses to make on its own.",
    toolComponentKey: "decision-coin",
    setupTime: "5 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-6",
    title: "Spoon Tracker",
    slug: "spoon-tracker",
    category: { title: "VISUAL & SPACE", slug: "visual" },
    tag: "ENERGY",
    excerpt: "Drag spoons in and out across the day. A visible energy budget for brains that need to see the maths.",
    toolComponentKey: "spoon-tracker",
    setupTime: "15 sec",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-7",
    title: "Sensory Audit",
    slug: "sensory-audit",
    category: { title: "VISUAL & SPACE", slug: "visual" },
    tag: "SENSORY",
    excerpt: "A guided 7-question environmental self-audit. Outputs likely sensory drains and one targeted change.",
    toolComponentKey: "sensory-audit",
    setupTime: "2 min",
    accessibility: "Full keyboard",
    mobileReady: true,
    noTracking: true,
  },
  {
    _id: "default-8",
    title: "Banner Designs",
    slug: "banner-showcase",
    category: { title: "VISUAL & SPACE", slug: "visual" },
    tag: "SANDBOX",
    excerpt: "Interactive prototyping for four new premium neurodiverse post header banner designs.",
    toolComponentKey: "banner-showcase",
    setupTime: "10 sec",
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
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-[var(--rule)] pb-6 text-left">
        {categories.map((cat) => {
          const categoryId = cat.slug || cat.slug?.current || cat._id;
          const isActive = activeCategory === categoryId;
          return (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(categoryId)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border rounded-none ${
                isActive
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] shadow-[2px_2px_0px_var(--fg)]'
                  : 'bg-transparent text-[var(--muted)] border-[var(--rule)] hover:border-[var(--muted)]/50 hover:text-[var(--fg)]'
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Search + Metadata Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-[var(--muted)] uppercase tracking-[0.12em] pb-4 border-b border-dashed border-[var(--rule)]/60 select-none">
        <span>
          FOUND {filteredLabs.length} PROTOTYPE{filteredLabs.length !== 1 && 'S'} MATCHING COMBO
        </span>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {activeCategory !== "all" && (
            <button
              onClick={() => setActiveCategory("all")}
              className="text-[var(--accent)] hover:underline font-black cursor-pointer bg-transparent border-none text-[10px] uppercase font-mono tracking-wider"
            >
              RESET FILTER
            </button>
          )}
          <div className="relative flex-1 sm:w-56">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs..."
              className="w-full bg-black/40 border border-[var(--rule)] pl-8 pr-3 py-1.5 text-[10px] font-mono text-[var(--fg)] placeholder:text-[var(--muted)]/50 outline-none focus:border-[var(--accent)] transition-colors rounded-none uppercase tracking-wider"
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
                className={`group border transition-all duration-300 flex flex-col shadow-[4px_4px_0px_var(--rule)] bg-bg-primary/40 break-inside-avoid h-[380px] relative overflow-hidden ${
                  isHovered
                    ? 'border-[var(--accent)] shadow-[6px_6px_0px_var(--accent)] -translate-y-1'
                    : 'hover:border-[var(--accent)]/50 hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-y-0.5'
                }`}
              >
                {/* Preview Area */}
                <div className="h-[160px] border-b border-[var(--rule)] bg-black/60 relative overflow-hidden">
                  <LabPreview slug={getToolKey(lab)} isActive={isHovered} />
                  {/* Tag Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--accent)] bg-black/70 border border-[var(--rule)] px-2 py-0.5">
                      {lab.tag || "EXPERIMENT"}
                    </span>
                  </div>
                  {/* Hover Indicator */}
                  <div className={`absolute bottom-2 right-2 z-10 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-[8px] font-mono text-[var(--accent)] uppercase tracking-wider animate-pulse">
                      PREVIEW ACTIVE
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h2 className="text-lg font-black uppercase text-[var(--fg)] tracking-tight leading-none group-hover:text-[var(--accent)] transition-colors">
                      {lab.title}
                    </h2>
                    <p className="text-xs text-[var(--muted)] font-sans leading-relaxed line-clamp-2">
                      {lab.excerpt}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--rule)]/40 mt-3">
                    {lab.setupTime && (
                      <span className="text-[8px] font-mono text-[var(--muted)] uppercase tracking-wider">
                        {lab.setupTime} setup
                      </span>
                    )}
                    {lab.noTracking && (
                      <span className="text-[8px] font-mono text-green-500/70 uppercase tracking-wider">
                        No tracking
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/labs/${labSlug}`}
                    className="w-full mt-4 py-3 bg-transparent text-[var(--fg)] border border-[var(--rule)] group-hover:border-[var(--accent)] font-black uppercase text-[10px] tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer rounded-none hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)]"
                  >
                    OPEN LAB <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredLabs.length === 0 && (
        <div className="border border-[var(--rule)] bg-black/20 p-12 text-center space-y-4">
          <Sparkles size={24} className="text-[var(--muted)] mx-auto" />
          <p className="text-sm font-mono text-[var(--muted)] uppercase tracking-wider">
            NO PROTOTYPES MATCH YOUR CURRENT COMBINATION
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="px-6 py-2 bg-[var(--accent)] text-[var(--bg)] border border-[var(--accent)] font-black uppercase text-xs tracking-wider cursor-pointer hover:bg-transparent hover:text-[var(--accent)] transition-all rounded-none"
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
