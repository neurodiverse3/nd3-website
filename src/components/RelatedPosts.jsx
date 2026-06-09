"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const getPillarLabel = (pillar) => {
  if (!pillar) return '';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools & templates' || p === 'tools-and-templates') return 'TOOLS & TEMPLATES';
  if (p === 'glitchwork' || p === 'digital life') return 'DIGITAL LIFE';
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
  if (!currentPost || posts.length === 0) return null;

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

  const tryAddPost = (post, selectionReason) => {
    if (!post) return false;
    const slug = post.slug?.current || post.slug;
    if (!addedSlugs.has(slug)) {
      selectedPosts.push({ post, selectionReason });
      addedSlugs.add(slug);
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

  // Step B: Prefer same pillar
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

  // Step D: Top up with most recent overall
  if (selectedPosts.length < 3) {
    const recentPosts = sortByDate(eligiblePosts);
    for (const post of recentPosts) {
      if (selectedPosts.length >= 3) break;
      tryAddPost(post, "recent");
    }
  }

  // Retain exactly 3 cards maximum
  const finalCards = selectedPosts.slice(0, 3);
  if (finalCards.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 mt-20 pt-12 border-t-4 border-fg-primary w-full text-left font-sans select-none no-print">
      
      {/* Discovery Block Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-accent-pink uppercase block font-bold">
            CURATED DISCOVERY
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-fg-primary mt-1.5 leading-none font-display">
            Keep reading.
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-[10px] font-mono tracking-widest text-text-muted hover:text-accent-pink transition-colors flex items-center gap-1.5 uppercase font-bold focus-ring"
        >
          All transmissions <ArrowRight size={12} className="ml-0.5" />
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

          if (selectionReason === "brainState") {
            eyebrow = "YOU MIGHT ALSO LIKE";
            isPinkLabel = false;
          } else if (selectionReason === "pinned") {
            eyebrow = "PINNED FEATURED";
            isPinkLabel = true;
          }

          return (
            <Link
              key={post._id || post.id}
              href={`/blog/${slug}`}
              className="group border-2 border-border-rule hover:border-fg-primary p-6 flex flex-col justify-between min-h-[280px] bg-[#09090b]/40 hover:-translate-y-1 hover:translate-x-1 transition-all duration-300 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--fg)] cursor-pointer rounded-none text-left"
            >
              <div className="space-y-3">
                {/* Category / Relationship Eyebrow */}
                <div className="text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5 flex-wrap font-bold leading-none">
                  {isPinkLabel ? (
                    <span className="text-accent-pink">{eyebrow}</span>
                  ) : (
                    <span className="text-text-muted italic">{eyebrow}</span>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-fg-primary group-hover:text-accent-pink transition-colors leading-snug line-clamp-3 font-display">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3 font-normal font-sans">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Card Footer tags */}
              <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-border-rule/40 text-[9px] font-bold uppercase tracking-widest text-text-muted font-mono gap-2 leading-none">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-accent-pink">{getPillarLabel(post.pillar)}</span>
                  <span>/</span>
                  <span>{getBrainStateLabel(stateValue)}</span>
                </div>
                <span>{formattedDate}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedPosts;
