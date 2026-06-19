"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Terminal, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPosts, getLabs, getMemoirChapters } from '../lib/strapi';
import { PRODUCTS } from '../data/products';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // 1. Fetch and index all searchable content on mount
  useEffect(() => {
    if (!isOpen) return;
    
    const indexContent = async () => {
      setLoading(true);
      setIndexError('');
      try {
        const [sanityPosts, sanityLabs, sanityChapters] = await Promise.allSettled([
          getPosts(),
          getLabs(),
          getMemoirChapters()
        ]);

        const allItems = [];

        // --- BLOG POSTS ---
        if (sanityPosts.status === 'fulfilled') {
          const postsList = sanityPosts.value || [];
          postsList.forEach(post => {
            allItems.push({
              id: `post-${post._id || post.id}`,
              title: post.title,
              excerpt: post.excerpt || '',
              url: `/blog/${post.slug?.current || post.slug}`,
              type: 'post',
              badge: 'Post',
              meta: post.pillar === 'tiny-systems' ? 'TOOLS & TEMPLATES' : post.pillar === 'glitchwork' ? 'DIGITAL LIFE' : 'UNMASKED LIFE'
            });
          });
        } else {
          console.warn('⚠️ Search indexing: Failed to fetch posts from Strapi:', sanityPosts.reason);
        }

        // --- MEMOIR CHAPTERS ---
        if (sanityChapters.status === 'fulfilled' && sanityChapters.value?.length > 0) {
          sanityChapters.value.forEach(chapter => {
            allItems.push({
              id: `memoir-${chapter._id || chapter.id}`,
              title: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
              excerpt: chapter.excerpt || 'Read this chapter of the unmasked memoir.',
              url: `/memoir/${chapter.slug?.current || chapter.slug}`,
              type: 'memoir',
              badge: 'Memoir',
              meta: `Chapter ${chapter.chapterNumber}`
            });
          });
        } else if (sanityChapters.status === 'rejected') {
          console.warn('⚠️ Search indexing: Failed to fetch memoir chapters:', sanityChapters.reason);
        }

        // --- LAB TOOLS ---
        if (sanityLabs.status === 'fulfilled') {
          const labsList = sanityLabs.value || [];
          labsList.forEach(lab => {
            allItems.push({
              id: `lab-${lab._id || lab.id}`,
              title: lab.title,
              excerpt: lab.excerpt || '',
              url: lab.isExternal ? lab.externalUrl : `/labs/${lab.slug?.current || lab.slug}`,
              type: 'lab',
              badge: 'Lab',
              meta: lab.tag || 'Interactive'
            });
          });
        } else {
          console.warn('⚠️ Search indexing: Failed to fetch labs from Strapi:', sanityLabs.reason);
        }

        // --- STORE PRODUCTS ---
        PRODUCTS.forEach(product => {
          allItems.push({
            id: `product-${product.slug}`,
            title: product.title,
            excerpt: product.cardBlurb || product.tagline || '',
            url: `/store/${product.slug}`,
            type: 'product',
            badge: 'Product',
            meta: `${product.priceLabel} · Resource`
          });
        });

        // --- CORE STATIC PAGES ---
        const staticPages = [
          {
            id: 'page-about',
            title: 'About Ollie & neurodivers³',
            excerpt: 'Meet Ollie, the late-diagnosed AuDHD founder of neurodivers³. Read the story behind the project.',
            url: '/about',
            type: 'page',
            badge: 'Page',
            meta: 'ABOUT US'
          },
          {
            id: 'page-accessibility',
            title: 'Accessibility Statement & Design Principles',
            excerpt: 'How neurodivers³ is designed for ADHD, autistic, dyslexic, and sensory-sensitive users. WCAG 2.1 AA conforming.',
            url: '/accessibility',
            type: 'page',
            badge: 'Page',
            meta: 'A11Y STATEMENT'
          },
          {
            id: 'page-contact',
            title: 'Contact Ollie Clews',
            excerpt: 'Get in touch for collaboration, inquiries, feedback, or general support.',
            url: '/contact',
            type: 'page',
            badge: 'Page',
            meta: 'GET IN TOUCH'
          },
          {
            id: 'page-store',
            title: 'Digital Resource Store',
            excerpt: 'Tactile, low-friction planners, recovery packs, and workbooks built around fluctuating executive capacity.',
            url: '/store',
            type: 'page',
            badge: 'Page',
            meta: 'STORE HUB'
          },
          {
            id: 'page-memoir',
            title: 'Serial Memoir Hub',
            excerpt: 'A serial memoir in progress about late-diagnosed AuDHD, masking, burnout, and figuring out how to human.',
            url: '/memoir',
            type: 'page',
            badge: 'Page',
            meta: 'MEMOIR'
          }
        ];
        staticPages.forEach(p => allItems.push(p));

        setItems(allItems);
      } catch (err) {
        setItems([]);
        setIndexError('Search indexing failed. CMS content is unavailable.');
        console.error('Error indexing search items:', err);
      } finally {
        setLoading(false);
      }
    };

    indexContent();
  }, [isOpen]);

  // 2. Auto-focus search input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 3. Filter items dynamically based on search query
  const filteredItems = items.filter(item => {
    if (!query.trim()) return false;
    const cleanQuery = query.toLowerCase();
    return (
      item.title?.toLowerCase().includes(cleanQuery) ||
      item.excerpt?.toLowerCase().includes(cleanQuery) ||
      item.meta?.toLowerCase().includes(cleanQuery) ||
      item.badge?.toLowerCase().includes(cleanQuery)
    );
  });

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // 4. Keyboard Navigation Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems.length > 0 && filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Scroll active item into view inside results panel
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item) => {
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.url);
    }
    onClose();
  };

  // Helper to render type icons in search cards
  const renderIcon = (type) => {
    switch (type) {
      case 'memoir':
        return <BookOpen size={16} className="text-amber-500" />;
      case 'lab':
        return <Terminal size={16} className="text-teal-400" />;
      case 'product':
        return <ShoppingBag size={16} className="text-indigo-400" />;
      default:
        return <Search size={16} className="text-accent" />;
    }
  };

  // Helper to highlight matching text in title/excerpts
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const escaped = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const testRegex = new RegExp(`^${escaped}$`, 'i');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          testRegex.test(part) ? (
            <mark key={i} className="bg-[var(--accent)]/30 text-accent font-black px-0.5 select-none rounded-sm">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex flex-col bg-bg-primary/95 backdrop-blur-xl px-6 md:px-24 pt-8 md:pt-16 pb-8"
        >
          {/* Close Trigger Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-12 md:right-12 p-3 text-text-muted hover:text-accent bg-transparent hover:bg-[var(--accent-soft)] border border-transparent hover:border-border-rule transition-all cursor-pointer focus-ring rounded-none z-[10000]"
            aria-label="Close search overlay"
          >
            <X size={24} />
          </button>
 
          <div className="max-w-4xl w-full mx-auto flex flex-col h-full justify-start mt-12 md:mt-20">
            {/* BIG SEARCH BAR */}
            <div className="relative border-b-4 border-fg-primary pb-4 mb-8">
              <Search className="absolute left-0 top-3 text-text-muted" size={28} />
              <input
                ref={inputRef}
                type="text"
                placeholder="SEARCH THE UNMASKED ARCHIVES..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-2 bg-transparent text-fg-primary text-2xl md:text-4xl font-black uppercase tracking-tight outline-none placeholder:text-text-muted/40 font-display"
                aria-label="Search site content"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-0 top-3 p-1 text-text-muted hover:text-accent cursor-pointer bg-transparent border-none"
                  aria-label="Clear query"
                >
                  <X size={20} />
                </button>
              )}
            </div>
 
            {/* QUICK KEYBOARD HINT */}
            <div className="flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-widest mb-6">
              <span>{loading ? 'indexing files...' : `system ready: ${items.length} items loaded`}</span>
              <div className="hidden md:flex gap-4">
                <span>[↑↓] navigate</span>
                <span>[enter] select</span>
                <span>[esc] close</span>
              </div>
            </div>
 
            {/* RESULTS CONTAINER */}
            <div 
              ref={resultsContainerRef}
              className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 text-left"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-8 h-8 border-4 border-[var(--accent)]/20 border-t-accent rounded-full animate-spin"></div>
                  <span className="font-mono text-xs text-text-muted uppercase tracking-widest">indexing site logs...</span>
                </div>
              ) : indexError ? (
                <div className="py-20 text-center border-2 border-dashed border-border-rule">
                  <span className="text-text-muted text-sm font-black uppercase tracking-[0.2em] block mb-2">INDEXING FAILURE</span>
                  <span className="text-xs text-text-muted font-mono uppercase">{indexError}</span>
                </div>
              ) : query.trim() === '' ? (
                /* Empty state / search prompts */
                <div className="py-12 border border-dashed border-border-rule p-8 flex flex-col gap-6">
                  <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">RECENT SEARCH SUGGESTIONS</span>
                  <div className="flex flex-wrap gap-3">
                    {['unmasking', 'tabs', 'burnout', 'habit', 'menu', 'audit'].map(term => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 font-mono text-xs font-black uppercase tracking-wider border border-border-rule hover:border-accent text-text-muted hover:text-accent bg-bg-primary transition-all cursor-pointer rounded-none"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <p className="text-text-muted/60 text-sm mt-4 font-normal">
                    Type keywords to query all posts, memoir chapters, accessibility tools, and digital system logs dynamically.
                  </p>
                </div>
              ) : filteredItems.length === 0 ? (
                /* No matches */
                <div className="py-20 text-center border-2 border-dashed border-border-rule">
                  <span className="text-text-muted text-sm font-black uppercase tracking-[0.2em] block mb-2">NO RECORDS FOUND FOR "{query}"</span>
                  <span className="text-xs text-text-muted font-mono uppercase">[Try searching for 'systems', 'burnout', or 'menu']</span>
                </div>
              ) : (
                /* Matches found */
                <div className="space-y-3">
                  {filteredItems.map((item, idx) => {
                    const isActive = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        data-active={isActive}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group p-5 border-2 flex items-center justify-between gap-6 transition-all duration-150 cursor-pointer rounded-none text-left ${
                          isActive
                            ? 'bg-[var(--accent-soft)] border-accent shadow-[4px_4px_0px_var(--accent)]'
                            : 'bg-bg-primary/20 border-border-rule hover:border-fg-primary'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          {/* Top Row: Type and Metadata */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-widest border rounded-none ${
                              isActive 
                                ? 'bg-[var(--accent-soft)] border-accent text-accent' 
                                : 'bg-bg-primary border-border-rule text-text-muted'
                            }`}>
                              {item.badge}
                            </span>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider truncate">
                              {item.meta}
                            </span>
                          </div>
 
                          {/* Middle Row: Title */}
                          <h4 className={`text-lg md:text-xl font-black uppercase tracking-tight mb-2 leading-tight transition-colors ${
                            isActive ? 'text-accent' : 'text-fg-primary'
                          }`}>
                            {highlightText(item.title, query)}
                          </h4>
 
                          {/* Bottom Row: Excerpt */}
                          <p className="text-xs md:text-sm text-text-muted line-clamp-2 leading-relaxed font-normal">
                            {highlightText(item.excerpt, query)}
                          </p>
                        </div>
 
                        {/* Visual Icon indicator */}
                        <div className={`p-3 border shrink-0 transition-all ${
                          isActive 
                            ? 'bg-bg-primary border-accent text-accent scale-110' 
                            : 'bg-bg-primary/50 border-border-rule text-text-muted group-hover:border-fg-primary group-hover:text-fg-primary'
                        }`}>
                          {isActive ? <ArrowRight size={16} /> : renderIcon(item.type)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
