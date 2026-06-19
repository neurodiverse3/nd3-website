"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ChevronRight, X, Search } from 'lucide-react';
import { PostCover } from './PostCover';

const getPillarLabel = (pillar) => {
  if (!pillar) return '';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates') return 'TOOLS & TEMPLATES';
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life') return 'DIGITAL LIFE';
  if (p === 'unmasked-life' || p === 'unmasked life') return 'UNMASKED LIFE';
  return pillar.replace('-', ' ').toUpperCase();
};

const getPillarTheme = (pillar) => {
  const p = pillar?.toLowerCase() || '';
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates') {
    return { bg: '#F0E8D8', text: '#000000' };
  }
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life') {
    return { bg: '#0E5A6B', text: '#FFFFFF' };
  }
  return { bg: '#9E0048', text: '#FFFFFF' };
};

const mapPillarKey = (pillar) => {
  if (!pillar) return 'unmasked';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates' || p === 'tools') return 'tools';
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life' || p === 'digital') return 'digital';
  return 'unmasked';
};


const getBrainStateLabel = (state) => {
  if (!state) return '';
  const s = state.toLowerCase().replace('_', '-');
  if (s === 'burned-out') return 'BURNED OUT';
  if (s === 'hyperfocus') return 'HYPERFOCUS';
  if (s === 'masking') return 'MASKING';
  if (s === 'spiraling' || s === 'spiralling') return 'SPIRALLING';
  if (s === 'on-a-roll') return 'ON A ROLL';
  return state.toUpperCase();
};

const formatDateUK = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const normalizePillar = (p) => {
  if (!p) return p;
  const lower = p.toLowerCase();
  if (lower === 'glitchwork') return 'digital-life';
  if (lower === 'tiny-systems') return 'tools-templates';
  return lower;
};

export const BlogArchiveClient = ({ initialPosts, activePillar: urlPillar, activeState: urlState }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePillar, setActivePillar] = useState(normalizePillar(urlPillar));
  const [activeState, setActiveState] = useState(urlState);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync with URL query parameters if they change
  useEffect(() => {
    if (urlPillar) setActivePillar(normalizePillar(urlPillar));
    if (urlState) setActiveState(urlState);
  }, [urlPillar, urlState]);

  // Fallbacks if data doesn't have required tags
  const processedPosts = initialPosts.map(post => {
    const newPost = { ...post };
    if (!newPost.pillar) {
      newPost.pillar = 'unmasked-life';
    } else {
      newPost.pillar = normalizePillar(newPost.pillar);
    }
    if (!newPost.brainState && !newPost.state) {
      newPost.brainState = 'hyperfocus';
    }
    return newPost;
  });

  // Newest first sorting
  const sortedPosts = [...processedPosts].sort((a, b) => {
    const dateA = new Date(a.date || a._createdAt || 0);
    const dateB = new Date(b.date || b._createdAt || 0);
    return dateB - dateA;
  });

  // Filter posts
  const filteredPosts = sortedPosts.filter(post => {
    // 1. Topic Filter
    if (activePillar && post.pillar !== activePillar) return false;
    
    // 2. State Filter
    const stateVal = post.brainState || post.state;
    if (activeState && stateVal !== activeState) return false;
    
    // 3. Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(query);
      const matchExcerpt = post.excerpt?.toLowerCase().includes(query);
      return matchTitle || matchExcerpt;
    }
    
    return true;
  });

  const pillarsList = [
    { id: 'unmasked-life', name: 'Unmasked Life' },
    { id: 'tools-templates', name: 'Tools & Templates' },
    { id: 'digital-life', name: 'Digital Life' }
  ];

  const statesList = [
    { id: 'burned-out', name: 'Burned out' },
    { id: 'hyperfocus', name: 'Hyperfocus' },
    { id: 'masking', name: 'Masking' },
    { id: 'spiraling', name: 'Spiralling' },
    { id: 'on-a-roll', name: 'On a roll' }
  ];

  const handleClearFilters = () => {
    setActivePillar(null);
    setActiveState(null);
    setSearchQuery('');
    setVisibleCount(12);
  };

  const handlePillarClick = (e, pillar) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePillar(pillar);
    setVisibleCount(12);
  };

  const handleStateClick = (e, state) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveState(state);
    setVisibleCount(12);
  };

  const interleavePosts = (postsList) => {
    const normalize = (p) => {
      const k = p?.toLowerCase() || '';
      if (k.includes('system') || k.includes('tool') || k.includes('templates')) return 'tools';
      if (k.includes('glitch') || k.includes('digital')) return 'digital';
      return 'unmasked';
    };

    const buckets = { unmasked: [], tools: [], digital: [] };
    postsList.forEach(post => {
      const key = normalize(post.pillar);
      if (buckets[key]) buckets[key].push(post);
    });

    const result = [];
    const keys = ['unmasked', 'tools', 'digital'];
    let index = 0;
    
    while (buckets.unmasked.length > 0 || buckets.tools.length > 0 || buckets.digital.length > 0) {
      let added = false;
      for (let offset = 0; offset < 3; offset++) {
        const key = keys[(index + offset) % 3];
        if (buckets[key] && buckets[key].length > 0) {
          result.push(buckets[key].shift());
          index = (index + offset + 1) % 3;
          added = true;
          break;
        }
      }
      if (!added) {
        const remainingKey = keys.find(k => buckets[k] && buckets[k].length > 0);
        if (remainingKey) {
          result.push(buckets[remainingKey].shift());
        } else {
          break;
        }
      }
    }
    return result;
  };

  const displayedPosts = activePillar ? filteredPosts : interleavePosts(filteredPosts);
  const paginatedPosts = displayedPosts.slice(0, visibleCount);

  return (
    <>
      {/* Filter and Search System Panel */}
      <div className="mb-12 flex flex-col gap-6 p-6 border-2 border-border-rule bg-bg-primary/50 backdrop-blur-sm shadow-[4px_4px_0px_var(--rule)]">
        
        {/* Search Bar Input */}
        <div className="relative w-full">
          <label htmlFor="blog-search" className="sr-only">Search archives</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
            <Search size={18} />
          </div>
          <input
            id="blog-search"
            type="text"
            placeholder="Search by keyword (e.g. masking, systems, burnout)…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full h-12 bg-bg-primary border border-zinc-600 focus:border-accent pl-12 pr-10 py-3 outline-none text-fg-primary text-sm font-bold shadow-[2px_2px_0px_var(--rule)] transition-all duration-200 rounded-none placeholder:text-text-muted font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-accent cursor-pointer bg-transparent border-none"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Topics / Pillars */}
        <div className="space-y-3 text-left">
          <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block font-bold">BY TOPIC:</span>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                setActivePillar(null);
                setVisibleCount(12);
              }}
              className={`inline-flex items-center justify-center h-9 px-4 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer rounded-none leading-none ${
                activePillar === null 
                  ? 'bg-accent border-fg-primary text-[var(--accent-btn-text)] shadow-[2px_2px_0px_var(--fg)]' 
                  : 'border-border-rule text-[var(--muted)] hover:text-fg-primary hover:border-fg-primary'
              }`}
            >
              All
            </button>
            {pillarsList.map(p => {
              const isActive = activePillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePillar(p.id);
                    setVisibleCount(12);
                  }}
                  className={`inline-flex items-center justify-center h-9 px-4 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer rounded-none leading-none ${
                    isActive 
                      ? 'bg-accent border-fg-primary text-[var(--accent-btn-text)] shadow-[2px_2px_0px_var(--fg)]' 
                      : 'border-border-rule text-[var(--muted)] hover:text-fg-primary hover:border-fg-primary'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* States of Mind */}
        <div className="space-y-3 text-left">
          <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block font-bold">BY BRAIN STATE:</span>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                setActiveState(null);
                setVisibleCount(12);
              }}
              className={`inline-flex items-center justify-center h-9 px-4 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer rounded-none leading-none ${
                activeState === null 
                  ? 'bg-accent border-fg-primary text-[var(--accent-btn-text)] shadow-[2px_2px_0px_var(--fg)]' 
                  : 'border-border-rule text-[var(--muted)] hover:text-fg-primary hover:border-fg-primary'
              }`}
            >
              All
            </button>
            {statesList.map(s => {
              const isActive = activeState === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveState(s.id);
                    setVisibleCount(12);
                  }}
                  className={`inline-flex items-center justify-center h-9 px-4 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer rounded-none leading-none ${
                    isActive 
                      ? 'bg-accent border-fg-primary text-[var(--accent-btn-text)] shadow-[2px_2px_0px_var(--fg)]' 
                      : 'border-border-rule text-[var(--muted)] hover:text-fg-primary hover:border-fg-primary'
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Clear Button & Reset Panel */}
        <div className="pt-4 border-t border-border-rule/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <span className="font-mono text-text-muted uppercase tracking-wider text-left">
            {activePillar === null && activeState === null && searchQuery.trim() === ''
              ? `Showing all ${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`
              : `Found ${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''} matching combo`}
          </span>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-border-rule hover:border-accent text-text-muted hover:text-accent font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer rounded-none bg-bg-primary/50"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-border-rule">
          <p className="text-text-muted text-base max-w-xl mx-auto font-bold">
            No posts match that combo yet. Try a different brain state, or{" "}
            <button 
              onClick={handleClearFilters} 
              className="text-accent font-black hover:underline cursor-pointer bg-transparent border-none p-0 inline"
            >
              read everything →
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paginatedPosts.map((post, idx) => {
            const slug = post.slug?.current || post.slug;
            const formattedDate = formatDateUK(post.date || post._createdAt);
            const stateValue = post.brainState || post.state;
            
            const globalIdx = initialPosts.findIndex(p => p._id === post._id || p.id === post.id);
            const postNumber = post.postNumber || (globalIdx !== -1 ? (initialPosts.length - globalIdx) : 1);
            const btnTheme = getPillarTheme(post.pillar);
            
            // Check if this is the last orphaned item in an odd list
            const isOrphaned = idx === paginatedPosts.length - 1 && paginatedPosts.length % 2 !== 0;
            
            return (
              <div 
                key={post._id || post.id} 
                className={`group border-2 border-border-rule hover:border-fg-primary focus-within:border-fg-primary bg-bg-primary flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 focus-within:-translate-y-1.5 shadow-[6px_6px_0px_var(--rule)] hover:shadow-[10px_10px_0px_var(--accent)] focus-within:shadow-[10px_10px_0px_var(--accent)] rounded-none text-left overflow-hidden ${isOrphaned ? 'md:col-span-2' : ''}`}
                data-pillar={mapPillarKey(post.pillar)}
              >
                {/* 4:3 Typographic Cover Header Crop */}
                <Link 
                  href={`/blog/${slug}`}
                  className="border-b-2 border-border-rule group-hover:border-fg-primary transition-colors block cursor-pointer"
                >
                  <PostCover 
                    title={post.title} 
                    pillar={post.pillar} 
                    brainState={stateValue}
                    accentWord={post.accentWord}
                    accentOverride={post.accentOverride}
                    aspect="16:9" 
                    readTime={post.readTime || '5 MIN'}
                    date={formattedDate}
                    postNumber={postNumber}
                  />
                </Link>

                <div className="px-6 md:px-10 pt-8 pb-8 flex flex-col justify-between flex-grow">
                  <div className="flex flex-col flex-grow">
                    {/* Meta Row: Pillar + State + Read time + Date */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] mb-5 text-text-muted font-bold leading-none">
                      <button 
                        onClick={(e) => handlePillarClick(e, post.pillar)}
                        className="pillar-eyebrow text-accent hover:underline font-black cursor-pointer bg-transparent border-none p-0 inline-block align-baseline leading-none"
                      >
                        {getPillarLabel(post.pillar)}
                      </button>
                      <span className="opacity-40">/</span>
                      <button 
                        onClick={(e) => handleStateClick(e, stateValue)}
                        className="text-text-muted hover:text-fg-primary hover:underline font-black cursor-pointer bg-transparent border-none p-0 inline-block align-baseline leading-none"
                      >
                        {getBrainStateLabel(stateValue)}
                      </button>
                      <span className="opacity-40">/</span>
                      <span className="inline-flex items-center gap-1 font-mono align-baseline leading-none"><Clock size={11} className="inline align-middle"/> {post.readTime || '5 MIN'}</span>
                      <span className="opacity-40">/</span>
                      <span className="inline-block align-baseline leading-none">{formattedDate}</span>
                    </div>
                    
                    {/* Dedicated Text Wrapper with min-height and line clamping to ensure vertical alignment */}
                    <div className="min-h-[100px] sm:min-h-[120px] flex flex-col justify-start">
                      <p className="text-sm md:text-base text-text-muted leading-relaxed mb-6 font-normal line-clamp-5">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 mt-auto bg-transparent text-fg-primary font-black text-xs uppercase tracking-widest border-2 border-fg-primary shadow-[4px_4px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all rounded-none w-fit group"
                  >
                    READ POST <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredPosts.length > visibleCount && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-8 py-4.5 bg-accent text-[var(--accent-text,var(--bg))] font-black uppercase tracking-widest text-xs border-2 border-fg-primary shadow-[4px_4px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer rounded-none"
          >
            LOAD MORE POSTS
          </button>
        </div>
      )}
    </>
  );
};
