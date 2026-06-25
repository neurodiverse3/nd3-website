import React from 'react';
import { Rss, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { getPosts, getSiteSettings } from '../../lib/strapi';
import { BlogArchiveClient } from '../../components/BlogArchiveClient';
import { PostCover } from '../../components/PostCover';
import PageHeader from '../../components/PageHeader';

export const metadata = {
  title: 'Blog - neurodivers3',
  description: 'Honest writing on late diagnosis, burnout, masking, attention, and everyday life with a neurodivergent brain.',
  openGraph: {
    title: 'Blog - neurodivers3',
    description: 'Honest writing on late diagnosis, burnout, masking, attention, and everyday life with a neurodivergent brain.',
  },
  twitter: {
    title: 'Blog - neurodivers3',
    description: 'Honest writing on late diagnosis, burnout, masking, attention, and everyday life with a neurodivergent brain.',
  }
};

export const revalidate = 86400; // Cache for 24 hours, revalidated on-demand

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

const mapPillarKey = (pillar) => {
  if (!pillar) return 'unmasked';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates' || p === 'tools') return 'tools';
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life' || p === 'digital') return 'digital';
  return 'unmasked';
};


export default async function BlogPage(props) {
  const searchParams = await props.searchParams;
  const activePillar = searchParams?.pillar || null;
  const activeState = searchParams?.state || null;

  const posts = await getPosts();
  const siteSettings = await getSiteSettings();
  let featuredPost = siteSettings?.featuredPosts?.[0] || null;

  if (!featuredPost && posts.length > 0) {
    featuredPost = posts[0];
  }

  const featuredDate = featuredPost ? formatDateUK(featuredPost.date || featuredPost._createdAt) : '';
  const featuredIndex = featuredPost ? posts.findIndex(p => p._id === featuredPost._id || p.id === featuredPost.id) : -1;
  const featuredNumber = featuredPost?.postNumber || (featuredIndex !== -1 ? (posts.length - featuredIndex) : posts.length);

  // Deduplicate featured post from the grid
  const gridPosts = featuredPost 
    ? posts.filter(p => {
        const pId = p._id || p.id;
        const fId = featuredPost._id || featuredPost.id;
        if (pId && fId && pId === fId) return false;
        
        const pSlug = p.slug?.current || p.slug;
        const fSlug = featuredPost.slug?.current || featuredPost.slug;
        if (pSlug && fSlug && pSlug === fSlug) return false;
        
        return true;
      })
    : posts;

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* RSS Link - Top Right of Hero Area */}
      <div className="absolute top-[108px] right-[24px] md:right-[96px] z-20">
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 border border-border-rule hover:border-accent text-text-muted hover:text-accent font-mono text-xs uppercase tracking-wider transition-all duration-200 focus-ring"
          title="Subscribe to RSS Feed"
        >
          <Rss size={14} />
          <span className="hidden sm:inline">RSS Feed</span>
        </a>
      </div>

      <PageHeader
        variant="section"
        eyebrow="The Blog"
        titleLabel="Blog"
        titleAccent="Stories, Tools & Ideas"
        subtitle="Honest writing on late diagnosis, burnout, masking, attention, and everyday life with a neurodivergent brain."
      />

      {/* Featured Post Card */}
      {featuredPost && (
        <div className="mb-16">
          <span className="inline-block text-xs md:text-sm font-mono tracking-[0.25em] text-accent bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-6 select-none">
            FEATURED POST
          </span>
          <div
            className="group grid grid-cols-1 lg:grid-cols-12 border-2 border-border-rule bg-bg-primary shadow-[8px_8px_0px_var(--rule)] rounded-none overflow-hidden text-left"
            data-pillar={mapPillarKey(featuredPost.pillar)}
          >
            {/* Cover Typographic Image (Left side) */}
            <Link 
              href={`/blog/${featuredPost.slug?.current || featuredPost.slug}`}
              className="lg:col-span-7 relative bg-bg-primary border-b-2 lg:border-b-0 lg:border-r-2 border-border-rule overflow-hidden block cursor-pointer group/cover h-full flex flex-col"
            >
              <PostCover 
                title={featuredPost.title} 
                pillar={featuredPost.pillar} 
                brainState={featuredPost.brainState}
                accentWord={featuredPost.accentWord}
                accentOverride={featuredPost.accentOverride}
                aspect="featured"
                readTime={featuredPost.readTime || '5 MIN'}
                date={featuredDate}
                postNumber={featuredNumber}
              />
            </Link>

            {/* Content (Right side) */}
            <div className="lg:col-span-5 p-10 md:p-14 lg:p-16 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm uppercase tracking-[0.15em] mb-6 text-text-muted font-bold leading-none">
                  <Link 
                    href={`/blog?state=${featuredPost.brainState}`}
                    className="pillar-eyebrow text-accent hover:underline font-black"
                  >
                    {getBrainStateLabel(featuredPost.brainState)}
                  </Link>
                  <span className="opacity-40">/</span>
                  <span className="inline-block">{featuredDate}</span>
                </div>

                <p className="text-base md:text-lg text-text-muted leading-relaxed font-normal mb-8 line-clamp-6">
                  {featuredPost.excerpt}
                </p>
              </div>

              <Link 
                href={`/blog/${featuredPost.slug?.current || featuredPost.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 mt-auto bg-accent text-bg-primary font-black text-sm uppercase tracking-widest border-2 border-fg-primary shadow-[4px_4px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all rounded-none w-fit group"
              >
                READ POST <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Blog Archive Panel */}
      <BlogArchiveClient 
        initialPosts={gridPosts} 
        activePillar={activePillar} 
        activeState={activeState} 
      />
    </div>
  );
}
