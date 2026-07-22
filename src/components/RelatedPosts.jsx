"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PostCover } from './PostCover';

const getPillarLabel = (pillar) => {
  if (!pillar) return '';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates') return 'TOOLS & TEMPLATES';
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life') return 'DIGITAL LIFE';
  if (p === 'unmasked-life' || p === 'unmasked life') return 'UNMASKED LIFE';
  return pillar.replace('-', ' ').toUpperCase();
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

export function RelatedPosts({ posts = [], currentPost, manualPinSlug = null }) {
  const finalCards = useMemo(() => {
    if (!currentPost || posts.length === 0) return [];

    const currentSlug = currentPost.slug?.current || currentPost.slug;
    const currentPillar = currentPost.pillar;
    const currentState = currentPost.brainState || currentPost.state;

    // 1. Filter out the current post
    const eligiblePosts = posts.filter(p => {
      const slug = p.slug?.current || p.slug;
      return slug !== currentSlug;
    });

    const selectedPosts = [];
    const addedSlugs = new Set();
    const addedPillars = new Set();

    const normalizePillar = (p) => {
      const k = p?.toLowerCase() || '';
      if (k.includes('system') || k.includes('tool') || k.includes('templates')) return 'tools';
      if (k.includes('glitch') || k.includes('digital')) return 'digital';
      return 'unmasked';
    };

    const tryAddPost = (post, selectionReason) => {
      if (!post) return false;
      const slug = post.slug?.current || post.slug;
      const pKey = normalizePillar(post.pillar);
      if (!addedSlugs.has(slug) && !addedPillars.has(pKey)) {
        selectedPosts.push({ post, selectionReason });
        addedSlugs.add(slug);
        addedPillars.add(pKey);
        return true;
      }
      return false;
    };

    // Step A: Handle manual pin if present
    if (manualPinSlug) {
      const pinned = eligiblePosts.find(p => (p.slug?.current || p.slug) === manualPinSlug);
      if (pinned) {
        tryAddPost(pinned, "pinned");
      }
    }

    // Helper sorting function: chronological descending (newest first)
    const sortByDate = (arr) => {
      return [...arr].sort((a, b) => {
        const dA = new Date(a.date || a._createdAt || 0);
        const dB = new Date(b.date || b._createdAt || 0);
        return dB - dA;
      });
    };

    // Step B: Prefer same pillar (only adds at most 1 due to distinct pillar restriction)
    const samePillarPosts = sortByDate(eligiblePosts.filter(p => p.pillar === currentPillar));
    for (const post of samePillarPosts) {
      if (selectedPosts.length >= 3) break;
      tryAddPost(post, "pillar");
    }

    // Step C: Then same brain state (Mood Match / "You might also like")
    if (selectedPosts.length < 3) {
      const sameStatePosts = sortByDate(eligiblePosts.filter(p => (p.brainState || p.state) === currentState));
      for (const post of sameStatePosts) {
        if (selectedPosts.length >= 3) break;
        tryAddPost(post, "brainState");
      }
    }

    // Step D: Top up with most recent overall (strictly distinct pillars)
    if (selectedPosts.length < 3) {
      const recentPosts = sortByDate(eligiblePosts);
      for (const post of recentPosts) {
        if (selectedPosts.length >= 3) break;
        tryAddPost(post, "recent");
      }
    }

    // Step E: Fallback top up without distinct pillar constraint if still under 3
    if (selectedPosts.length < 3) {
      const tryAddPostNoPillarLimit = (post, selectionReason) => {
        if (!post) return false;
        const slug = post.slug?.current || post.slug;
        if (!addedSlugs.has(slug)) {
          selectedPosts.push({ post, selectionReason });
          addedSlugs.add(slug);
          return true;
        }
        return false;
      };
      const recentPosts = sortByDate(eligiblePosts);
      for (const post of recentPosts) {
        if (selectedPosts.length >= 3) break;
        tryAddPostNoPillarLimit(post, "recent-fallback");
      }
    }

    return selectedPosts.slice(0, 3);
  }, [posts, currentPost, manualPinSlug]);

  if (!currentPost || posts.length === 0 || finalCards.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 mt-20 pt-12 border-t-4 border-fg-primary w-full text-left font-sans select-none no-print">
      
      {/* Discovery Block Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-accent-pink uppercase block font-bold">
            RELATED READING
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-fg-primary mt-1.5 leading-none font-display">
            Keep reading.
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-xs md:text-sm font-mono tracking-widest text-text-muted hover:text-accent-pink transition-colors flex items-center gap-1.5 uppercase font-bold focus-ring"
        >
          All posts <ArrowRight size={12} className="ml-0.5" />
        </Link>
      </div>

      {/* Grid of exactly 3 Keep-Reading cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {finalCards.map(({ post, selectionReason }) => {
          const slug = post.slug?.current || post.slug;
          const formattedDate = formatDateUK(post.date || post._createdAt);
          const stateValue = post.brainState || post.state;

          // Compute Eyebrow Category and Tag color
          let eyebrow = getPillarLabel(post.pillar);
          let isPinkLabel = true;

          if (selectionReason === "pinned") {
            eyebrow = "PINNED FEATURED";
          }

          return (
            <div
              key={post._id || post.id}
              className="group border-2 border-border-rule hover:border-fg-primary focus-within:border-fg-primary bg-bg-primary flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 focus-within:-translate-y-1.5 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--fg)] focus-within:shadow-[6px_6px_0px_var(--fg)] rounded-none text-left overflow-hidden cursor-pointer"
            >
              <Link 
                href={`/blog/${slug}`}
                className="border-b-2 border-border-rule group-hover:border-fg-primary transition-colors block cursor-pointer"
              >
                <PostCover 
                  title={post.title} 
                  pillar={post.pillar} 
                  brainState={stateValue || 'hyperfocus'}
                  accentWord={post.accentWord}
                  accentOverride={post.accentOverride}
                  aspect="16:9" 
                  readTime={null}
                  date={formattedDate}
                  postNumber={post.postNumber || 1}
                />
              </Link>

              <div className="px-6 py-6 flex flex-col justify-between flex-grow gap-4">
                <div className="flex flex-col">
                  {/* Category / Relationship Eyebrow */}
                  <div className="text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 flex-wrap font-bold leading-none mb-3">
                    {isPinkLabel ? (
                      <span className="text-accent-pink">{eyebrow}</span>
                    ) : (
                      <span className="text-text-muted italic">{eyebrow}</span>
                    )}
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-text-muted leading-relaxed font-normal line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="text-xs font-black tracking-widest text-text-muted uppercase font-mono group-hover:text-accent-pink transition-colors pt-4 border-t border-border-rule/40 flex items-center justify-between w-full mt-2">
                  <span>{formattedDate}</span>
                  <Link 
                    href={`/blog/${slug}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] bg-accent text-[var(--accent-text,var(--bg))] font-black text-xs uppercase tracking-widest border-2 border-fg-primary shadow-[2px_2px_0px_var(--fg)] hover:shadow-[3px_3px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all rounded-none w-fit shrink-0 cursor-pointer"
                  >
                    READ POST →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedPosts;
