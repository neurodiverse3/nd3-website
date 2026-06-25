import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, AlertCircle } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, urlFor, getPosts, getSeriesPosts } from '../../../lib/strapi';
import RichTextRenderer from '../../../components/RichTextRenderer';
import AudioNarration from '../../../components/AudioNarration';
import { SharePost } from '../../../components/SharePost';
import { PostNewsletter } from '../../../components/PostNewsletter';
import { RelatedPosts } from '../../../components/RelatedPosts';
import { TableOfContents } from '../../../components/TableOfContents';
import { StickyBlogHeader } from '../../../components/StickyBlogHeader';
import { calculateReadTime } from '../../../lib/readTime';
import { notFound } from 'next/navigation';
import CommentSection from '../../../components/CommentSection';
import { getComments } from '../../actions/comments';
import AuthorCard from '../../../components/AuthorCard';
import { toSmartQuotes } from '../../../lib/typography';
import ReadingProgress from '../../../components/ReadingProgress';

export const revalidate = 86400; // Cache for 24 hours, revalidated on-demand

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = await getPostBySlug(slug);
  const allPosts = await getPosts();

  if (!post) {
    return {
      title: 'Post not found - neurodivers3',
      description: 'The requested unmasked story could not be found.'
    };
  }

  // Format title and excerpt with typographic curly quotes
  post = {
    ...post,
    title: toSmartQuotes(post.title),
    excerpt: toSmartQuotes(post.excerpt),
  };

  const sortedAll = [...allPosts].sort((a, b) => {
    const dA = new Date(a.date || a._createdAt || 0);
    const dB = new Date(b.date || b._createdAt || 0);
    return dA - dB; // chronological older -> newer
  });
  
  const curIdx = sortedAll.findIndex(p => (p.slug?.current || p.slug) === slug);
  const postNumberVal = post.postNumber || (curIdx !== -1 ? curIdx + 1 : 1);
  const readTimeVal = post.readTime || calculateReadTime(post.body) || '5 min';

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : post._createdAt
      ? new Date(post._createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '24 MAY 2026';

  const ogUrl = `https://neurodivers3.co.uk/api/og?title=${encodeURIComponent(post.title)}&pillar=${encodeURIComponent(post.pillar || '')}&brainState=${encodeURIComponent(post.brainState || '')}&accentWord=${encodeURIComponent(post.accentWord || '')}&accentOverride=${encodeURIComponent(post.accentOverride || '')}&readTime=${encodeURIComponent(readTimeVal)}&date=${encodeURIComponent(formattedDate)}&postNumber=${postNumberVal}`;

  const resolvedTitle = post.seoTitle || post.title;

  return {
    title: `${resolvedTitle} - neurodivers3`,
    description: (post.excerpt || 'Accessibility tools and memoirs for brains that don\'t fit the standard manual.').slice(0, 155),
    alternates: {
      canonical: `https://neurodivers3.co.uk/blog/${slug}`,
    },
    openGraph: {
      title: `${resolvedTitle} - neurodivers3`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date || post._createdAt,
      images: [ogUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${resolvedTitle} - neurodivers3`,
      description: post.excerpt,
      images: [ogUrl],
    }
  };
}

// Helpers for structural parsing (H2s for Table of Contents)
const extractH2s = (blocks) => {
  const headings = [];
  if (!Array.isArray(blocks)) return headings;
  blocks.forEach(block => {
    // Handle Sanity block H2s
    if (block._type === 'block' && block.style === 'h2') {
      const text = block.children?.map(c => c.text).join('') || '';
      if (text.trim()) {
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ id, text: toSmartQuotes(text) });
      }
    }
    // Handle Strapi block H2s
    else if (block.type === 'heading' && block.level === 2) {
      const text = block.children?.map(c => c.text).join('') || '';
      if (text.trim()) {
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ id, text: toSmartQuotes(text) });
      }
    }
  });
  return headings;
};

// Helper for extracting footnotes (Sanity-style check only as footnotes are a custom PortableText mark)
const extractFootnotes = (blocks) => {
  const fns = [];
  let counter = 1;
  if (!Array.isArray(blocks)) return fns;
  blocks.forEach(block => {
    if (block._type === 'block' && block.markDefs) {
      block.markDefs.forEach(def => {
        if (def._type === 'footnote') {
          fns.push({
            id: def._key,
            number: counter++,
            text: def.text || 'Footnote description'
          });
        }
      });
    }
  });
  return fns;
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

const getPillarTagClass = (pillar) => {
  const p = pillar?.toLowerCase() || '';
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates' || p === 'tools') {
    return 'text-[var(--pillar-label-tools,var(--pillar-tools))] bg-[var(--pillar-tools)]/8 border border-[var(--pillar-label-tools,var(--pillar-tools))]/20 hover:border-[var(--pillar-label-tools,var(--pillar-tools))]';
  }
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life' || p === 'digital') {
    return 'text-[var(--pillar-label-digital,var(--pillar-digital))] bg-[var(--pillar-digital)]/8 border border-[var(--pillar-label-digital,var(--pillar-digital))]/20 hover:border-[var(--pillar-label-digital,var(--pillar-digital))]';
  }
  return 'text-[var(--pillar-label-unmasked,var(--pillar-unmasked))] bg-[var(--pillar-unmasked)]/8 border border-[var(--pillar-label-unmasked,var(--pillar-unmasked))]/20 hover:border-[var(--pillar-label-unmasked,var(--pillar-unmasked))]';
};

const getBrainStateTagClass = (state) => {
  const s = state?.toLowerCase().replace('_', '-').replace('spiraling', 'spiralling') || '';
  if (s === 'burned-out') return 'badge-state-burned-out';
  if (s === 'hyperfocus') return 'badge-state-hyperfocus';
  if (s === 'masking') return 'badge-state-masking';
  if (s === 'spiralling') return 'badge-state-spiralling';
  if (s === 'on-a-roll') return 'badge-state-on-a-roll';
  return 'text-accent bg-[var(--accent-soft)] border border-border-rule hover:border-accent'; // fallback
};

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const comments = await getComments(slug);
  let post = await getPostBySlug(slug);
  const allPosts = await getPosts();

  if (!post) {
    notFound();
  }

  // Format title and excerpt with typographic curly quotes
  post = {
    ...post,
    title: toSmartQuotes(post.title),
    excerpt: toSmartQuotes(post.excerpt),
  };

  if (!post.pillar) {
    post.pillar = 'unmasked-life';
  }
  if (!post.brainState && !post.state) {
    post.brainState = 'hyperfocus';
  }

  const readTimeVal = post.readTime || calculateReadTime(post.body) || '5 min';
  const readTimeInt = parseInt(readTimeVal) || 5;

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : post._createdAt
      ? new Date(post._createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

  const formattedUpdateDate = post.lastUpdated
    ? new Date(post.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  if (!post.body) {
    throw new Error(`Post "${slug}" is missing body content in CMS.`);
  }

  const headings = extractH2s(post.body);
  const footnotes = extractFootnotes(post.body);

  const showToC = headings.length >= 3;

  const bodyBlocks = Array.isArray(post.body) ? post.body : [];
  const midpoint = Math.floor(bodyBlocks.length / 2);
  let splitIndex = -1;

  const getBlockText = (block) => {
    if (!block) return '';
    if (Array.isArray(block.children)) {
      return block.children.map(c => c.text || '').join('');
    }
    return '';
  };

  const isH2 = (block) => {
    if (!block) return false;
    return (block._type === 'block' && block.style === 'h2') || 
           (block.type === 'heading' && block.level === 2);
  };

  // 1. Specific slug split override
  if (slug === '47-tabs-hyperfocus') {
    const targetIdx = bodyBlocks.findIndex(block => {
      if (isH2(block)) {
        const txt = getBlockText(block).toLowerCase();
        return txt.includes('kinder tab discipline');
      }
      return false;
    });
    if (targetIdx !== -1) {
      splitIndex = targetIdx;
    }
  }

  // 2. Search for any H2 heading in the middle third of the post
  if (splitIndex === -1 && bodyBlocks.length > 0) {
    const minRange = Math.floor(bodyBlocks.length / 3);
    const maxRange = Math.floor((bodyBlocks.length * 2) / 3);
    let bestH2Index = -1;
    let minDistance = Infinity;

    for (let i = minRange; i <= maxRange; i++) {
      const block = bodyBlocks[i];
      if (isH2(block)) {
        const distance = Math.abs(i - midpoint);
        if (distance < minDistance) {
          minDistance = distance;
          bestH2Index = i;
        }
      }
    }
    if (bestH2Index !== -1) {
      splitIndex = bestH2Index;
    }
  }

  // 3. Fallback to paragraph boundaries near the midpoint
  if (splitIndex === -1 && bodyBlocks.length > 0) {
    splitIndex = midpoint;
    for (let i = midpoint; i > 0; i--) {
      const b = bodyBlocks[i];
      if (b && (
        (b._type === 'block' && b.style === 'normal') ||
        (b.type === 'paragraph') ||
        b._type === 'block' || 
        b.type === 'heading' || 
        b.style === 'normal'
      )) {
        splitIndex = i;
        break;
      }
    }
  }

  // If we still didn't find a split index, default to midpoint or length
  if (splitIndex === -1) {
    splitIndex = midpoint > 0 ? midpoint : bodyBlocks.length;
  }

  const firstHalf = bodyBlocks.slice(0, splitIndex);
  const secondHalf = bodyBlocks.slice(splitIndex);

  let seriesPosts = [];
  let currentSeriesIndex = -1;
  let prevSeriesPost = null;
  let nextSeriesPost = null;

  if (post.series?.name) {
    seriesPosts = await getSeriesPosts(post.series.name);
    currentSeriesIndex = seriesPosts.findIndex(s => s._id === post._id);
    if (currentSeriesIndex !== -1) {
      prevSeriesPost = currentSeriesIndex > 0 ? seriesPosts[currentSeriesIndex - 1] : null;
      nextSeriesPost = currentSeriesIndex < seriesPosts.length - 1 ? seriesPosts[currentSeriesIndex + 1] : null;
    }
  }

  const sortedAll = [...allPosts].sort((a, b) => {
    const dA = new Date(a.date || a._createdAt || 0);
    const dB = new Date(b.date || b._createdAt || 0);
    return dA - dB;
  });
  
  const curIdx = sortedAll.findIndex(p => (p.slug?.current || p.slug) === slug);
  const postNumberVal = post.postNumber || (curIdx !== -1 ? curIdx + 1 : 1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: (post.excerpt || '').slice(0, 155),
    datePublished: post.date || post._createdAt || '',
    ...(post.lastUpdated ? { dateModified: post.lastUpdated } : {}),
    author: {
      '@type': 'Person',
      name: 'Ollie Clews',
      url: 'https://neurodivers3.co.uk/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'neurodivers³',
      url: 'https://neurodivers3.co.uk',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://neurodivers3.co.uk/blog/${slug}`,
    },
    image: `https://neurodivers3.co.uk/api/og?title=${encodeURIComponent(post.title)}&pillar=${encodeURIComponent(post.pillar || '')}&brainState=${encodeURIComponent(post.brainState || '')}&accentWord=${encodeURIComponent(post.accentWord || '')}&accentOverride=${encodeURIComponent(post.accentOverride || '')}&readTime=${encodeURIComponent(readTimeVal)}&date=${encodeURIComponent(formattedDate)}&postNumber=${postNumberVal}`
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://neurodivers3.co.uk'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://neurodivers3.co.uk/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://neurodivers3.co.uk/blog/${slug}`
      }
    ]
  };

  const getFootnoteNumber = (key) => {
    const fn = footnotes.find(f => f.id === key);
    return fn ? fn.number : '*';
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />

      <article className="relative min-h-screen bg-bg text-fg pb-24">
        <ReadingProgress />
        {/* Reading progress header + auto hide Navbar */}
        <StickyBlogHeader title={post.title} />

        {/* TITLE & EXCERPT CONTAINER (stretched full-width above the content grid on desktop) */}
        <div className="mx-auto px-6 md:px-24 xl:px-16 2xl:px-32 pt-32 pb-4 max-w-[1360px] xl:max-w-[1560px] 2xl:max-w-[1760px] w-full text-left">
          <div className="w-full">
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-black uppercase tracking-wide leading-[1.0] mb-6 text-fg-primary font-display">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg md:text-xl text-text-muted italic font-light leading-relaxed border-l-4 border-accent pl-6 font-sans">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto px-6 md:px-24 xl:px-16 2xl:px-32 pt-4 xl:pt-8 max-w-[1360px] xl:max-w-[1560px] 2xl:max-w-[1760px] relative flex flex-col xl:flex-row gap-8 xl:gap-12 2xl:gap-16 items-start">
          
          {/* 1. LEFT COLUMN: OUTLINE / TOC (LIKE IT WAS BEFORE, STICKY ON DESKTOP) */}
          {showToC && (
            <div className="hidden xl:block w-60 shrink-0 sticky top-32 select-none">
              <TableOfContents headings={headings} isMobile={false} pillar={post.pillar} />
            </div>
          )}

          {/* 2. CENTER: MAIN READING COLUMN */}
          <div className="flex-grow w-full max-w-[820px] mx-auto xl:mx-0">
            
            {/* MOBILE & TABLET ONLY METADATA & UTILITIES FALLBACK */}
            <div className="xl:hidden w-full mb-8 text-left">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors uppercase font-black text-xs md:text-sm tracking-widest mb-6 focus-ring"
              >
                ← Back to blog
              </Link>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-xs font-mono font-bold uppercase tracking-[0.15em] text-text-muted mb-4">
                <span className="whitespace-nowrap">{formattedDate}</span>
                <Link href={`/blog?pillar=${post.pillar}`} className="text-accent hover:underline font-black focus-ring whitespace-nowrap flex items-center before:content-['·'] before:opacity-40 before:mr-4">
                  {getPillarLabel(post.pillar)}
                </Link>
                <Link href={`/blog?state=${post.brainState || post.state}`} className="text-accent hover:underline font-black focus-ring whitespace-nowrap flex items-center before:content-['·'] before:opacity-40 before:mr-4">
                  {getBrainStateLabel(post.brainState || post.state)}
                </Link>
              </div>

              <div className="text-xs text-text-muted italic border-l-2 border-border-rule/80 pl-3 py-0.5">
                By Ollie
              </div>

              {formattedUpdateDate && (
                <div className="flex items-center gap-1.5 text-xs md:text-sm font-mono tracking-wider uppercase text-accent bg-[var(--accent-soft)] px-3.5 py-1 border border-border-rule mt-4 w-fit">
                  <AlertCircle size={10} /> Updated {formattedUpdateDate}
                </div>
              )}

              {!post.hideNarration && (
                <div className="mt-8">
                  <AudioNarration />
                </div>
              )}
            </div>



            {/* MOBILE/TABLET SIDEBAR CAROUSEL - pops sidebar widgets below title */}
            <div className="xl:hidden mb-10">
              <div className="blog-sidebar-carousel max-w-[760px] mx-auto">
                {/* Back to Blog */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-accent bg-[var(--accent-soft)] text-accent hover:bg-accent hover:text-bg-primary font-mono text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-200 shadow-[2px_2px_0px_var(--accent)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 focus-ring whitespace-nowrap"
                >
                  ← All posts
                </Link>

                {/* Date pill */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-rule bg-surface/40 text-fg-primary font-mono text-xs md:text-sm font-bold uppercase tracking-widest whitespace-nowrap">
                  {formattedDate}
                </span>

                {/* Pillar tag */}
                <Link
                  href={`/blog?pillar=${post.pillar}`}
                  className={`inline-flex items-center px-2.5 py-1.5 text-xs md:text-sm font-mono font-black uppercase transition-all focus-ring whitespace-nowrap ${getPillarTagClass(post.pillar)}`}
                >
                  {getPillarLabel(post.pillar)}
                </Link>

                {/* Brain State tag */}
                <Link
                  href={`/blog?state=${post.brainState || post.state}`}
                  className={`inline-flex items-center px-2.5 py-1.5 text-xs md:text-sm font-mono font-black uppercase transition-all focus-ring whitespace-nowrap ${getBrainStateTagClass(post.brainState || post.state)}`}
                >
                  {getBrainStateLabel(post.brainState || post.state)}
                </Link>

                {/* Audio Narration */}
                {!post.hideNarration && (
                  <span className="inline-flex shrink-0">
                    <AudioNarration compact={true} />
                  </span>
                )}

                {/* Share buttons */}
                <span className="inline-flex shrink-0">
                  <SharePost title={post.title} slug={slug} dek={post.excerpt} vertical={false} />
                </span>
              </div>
            </div>

            {/* ORDERED SERIES COMPACT NAVIGATION CARD */}
            {post.series?.name && seriesPosts.length > 0 && (
              <div className="max-w-[760px] mx-auto mb-10 text-left no-print select-none">
                <div className="p-4 border border-accent bg-[var(--accent-soft)] text-xs font-mono tracking-wide text-fg-primary/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span>
                    Part <span className="font-bold text-accent">{post.series.index}</span> of {seriesPosts.length} in <span className="italic font-bold">'{post.series.name}'</span>
                  </span>
                  <div className="flex gap-4 uppercase tracking-widest text-[10px] md:text-sm font-bold shrink-0">
                    {prevSeriesPost ? (
                      <Link href={`/blog/${prevSeriesPost.slug}`} className="hover:text-accent focus-ring text-right">
                        ← Part {post.series.index - 1}
                      </Link>
                    ) : (
                      <span className="opacity-40 select-none text-right">← Prev</span>
                    )}
                    {nextSeriesPost ? (
                      <Link href={`/blog/${nextSeriesPost.slug}`} className="hover:text-accent focus-ring text-left">
                        Part {post.series.index + 1} →
                      </Link>
                    ) : (
                      <span className="opacity-40 select-none text-left">Next →</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE ONLY TABLE OF CONTENTS / OUTLINE DROPDOWN */}
            {showToC && (
              <div className="xl:hidden max-w-[760px] mx-auto">
                <TableOfContents headings={headings} isMobile={true} pillar={post.pillar} />
              </div>
            )}

            {/* IMMERSIVE BRUTALIST BODY TEXT RENDERER */}
            <div id="blog-content" className="w-full">

              {firstHalf.length > 0 ? (
                <>
                  <RichTextRenderer 
                    content={firstHalf} 
                    footnotes={footnotes} 
                    headings={headings}
                  />
                  
                  {/* CENTRAL NEWSLETTER SIGNUP BLOCK (Mid-post) */}
                  <div id="subscribe-block" className="max-w-[820px] mx-auto my-12 no-print">
                    <PostNewsletter />
                  </div>

                  <RichTextRenderer 
                    content={secondHalf} 
                    footnotes={footnotes} 
                    headings={headings}
                  />
                </>
              ) : (
                <RichTextRenderer 
                  content={bodyBlocks} 
                  footnotes={footnotes} 
                  headings={headings}
                />
              )}
            </div>

            {/* FOOTNOTES BLOCK */}
            {footnotes.length > 0 && (
              <div className="max-w-[760px] mx-auto border-t border-border-rule/65 mt-16 pt-8 text-left font-sans">
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#8A8A93] uppercase mb-6">FOOTNOTES</h4>
                <ol className="space-y-4 text-sm text-text-muted">
                  {footnotes.map(fn => (
                    <li key={fn.id} id={`fn-${fn.id}`} className="flex items-start gap-2.5">
                      <span className="font-mono text-accent font-bold shrink-0">{fn.number}.</span>
                      <div className="flex-grow text-fg-primary/80 font-normal leading-relaxed">
                        {fn.text}{' '}
                        <a 
                          href={`#fnref-${fn.id}`} 
                          className="text-accent hover:underline font-black ml-1 select-none focus-ring"
                          title="Jump back to reference"
                        >
                          ↩
                        </a>
            </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* SERIES SEQUENTIAL END-OF-POST NAVIGATION BLOCK */}
            {post.series?.name && seriesPosts.length > 0 && (
              <div className="max-w-[760px] mx-auto flex flex-col md:flex-row gap-6 mt-16 pt-10 border-t border-border-rule/60 mb-16 no-print">
                {prevSeriesPost ? (
                  <Link
                    href={`/blog/${prevSeriesPost.slug}`}
                    className="group border border-border-rule hover:border-fg-primary p-5 flex flex-col justify-between text-left bg-surface/40 hover:-translate-y-0.5 transition-all duration-200 flex-1"
                  >
                    <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-text-muted mb-2 block">PREVIOUS IN SERIES</span>
                    <h4 className="text-sm font-black uppercase text-fg-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                      {prevSeriesPost.title}
                    </h4>
                    <span className="text-xs md:text-sm font-mono text-accent uppercase tracking-wider block mt-4 font-bold">
                      Part {post.series.index - 1} of {seriesPosts.length}
                    </span>
                  </Link>
                ) : (
                  <div className="border border-dashed border-border-rule/40 p-5 flex items-center justify-center text-center text-text-muted/40 font-mono text-xs md:text-sm uppercase select-none flex-1">
                    Start of Series
                  </div>
                )}

                {nextSeriesPost ? (
                  <Link
                    href={`/blog/${nextSeriesPost.slug}`}
                    className="group border border-border-rule hover:border-fg-primary p-5 flex flex-col justify-between text-left md:text-right bg-surface/40 hover:-translate-y-0.5 transition-all duration-200 flex-1"
                  >
                    <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-text-muted mb-2 block md:text-right text-left">NEXT IN SERIES</span>
                    <h4 className="text-sm font-black uppercase text-fg-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug md:text-right text-left">
                      {nextSeriesPost.title}
                    </h4>
                    <span className="text-xs md:text-sm font-mono text-accent uppercase tracking-wider block mt-4 font-bold md:text-right text-left">
                      Part {post.series.index + 1} of {seriesPosts.length}
                    </span>
                  </Link>
                ) : (
                  <div className="border border-dashed border-border-rule/40 p-5 flex items-center justify-center text-center text-text-muted/40 font-mono text-xs md:text-sm uppercase select-none flex-1">
                    End of Series
                  </div>
                )}
              </div>
            )}

            {/* MOBILE ONLY BOTTOM INLINE SHARE BAR */}
            <div className="xl:hidden max-w-[760px] mx-auto my-8">
              <SharePost title={post.title} slug={slug} dek={post.excerpt} />
            </div>

            {/* REUSABLE PREMIUM AUTHOR PROFILE CARD (Bottom of post before comments) */}
            <div className="max-w-[760px] mx-auto mt-16 mb-6 no-print">
              <AuthorCard author={post.author || {}} socials={post.socials || {}} />
            </div>

            {/* REPLIES TIMELINE SECTION */}
            <div id="comments" className="max-w-[760px] mx-auto mt-16">
              {post.allowComments !== false ? (
                <CommentSection postSlug={slug} postTitle={post.title} initialComments={comments} />
              ) : (
                <div className="text-left">
                  <div className="p-4 bg-surface border border-border-rule/80 text-xs font-mono tracking-wide text-text-muted text-left">
                    Comments have been paused for this post.{' '}
                    <a
                      href={`mailto:hello@neurodivers3.co.uk?subject=${encodeURIComponent(`Reply: ${post.title}`)}`}
                      className="text-accent hover:underline font-bold focus-ring ml-1"
                    >
                      Reply by email instead →
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* 3. RIGHT COLUMN: BEAUTIFUL FLOATING UTILITY BOX IN THE FREE SPACE */}
          <aside className="hidden xl:flex flex-col gap-6 w-64 shrink-0 sticky top-32 select-none">
            
            <div className="w-full sidebar-card p-3.5 flex flex-col gap-3 text-left relative overflow-hidden">
              
              {/* Gradient accent bar at the top */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-grad-meta" />

              {/* Return to Blog Button */}
              <Link
                href="/blog"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-accent bg-[var(--accent-soft)] text-accent hover:bg-accent hover:text-bg-primary font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 text-center shadow-[2px_2px_0px_var(--accent)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 focus-ring mt-1"
              >
                RETURN TO BLOG
              </Link>

              {/* Section 1: Meta Details */}
              <div className="space-y-3 border-t border-border-rule/80 pt-3 text-left">
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-text-muted uppercase block mb-1">
                    PUBLISHED
                  </span>
                  <span className="text-sm font-sans font-bold text-fg-primary block">
                    {formattedDate}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-text-muted uppercase block mb-2">
                    CATEGORIES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <Link 
                       href={`/blog?pillar=${post.pillar}`} 
                      className={`text-xs font-mono font-black uppercase px-2 py-0.5 transition-all focus-ring ${getPillarTagClass(post.pillar)}`}
                    >
                      {getPillarLabel(post.pillar)}
                    </Link>
                    <Link 
                       href={`/blog?state=${post.brainState || post.state}`} 
                      className={`text-xs font-mono font-black uppercase px-2 py-0.5 transition-all focus-ring ${getBrainStateTagClass(post.brainState || post.state)}`}
                    >
                      {getBrainStateLabel(post.brainState || post.state)}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-border-rule/40 pt-2.5">
                  <span className="text-xs font-mono font-bold tracking-widest text-text-muted uppercase">
                    BY
                  </span>
                  <span className="text-sm font-sans font-bold text-fg-primary uppercase">
                    OLLIE
                  </span>
                </div>
              </div>

              {/* Section 2: Jump to Comments */}
              {post.allowComments !== false && (
                <div className="border-t border-border-rule/80 pt-3">
                  <a
                    href="#comments"
                    className="w-full inline-flex items-center justify-between px-3 py-2 border border-border-rule bg-bg-primary/45 hover:bg-surface hover:text-accent hover:border-accent font-mono text-xs font-black uppercase tracking-widest transition-all duration-200 focus-ring text-center"
                  >
                    <span>💬 REPLIES</span>
                    <span className="px-2 py-0.5 text-xs bg-accent/10 border border-accent/20 text-accent font-bold font-mono">
                      {comments.length}
                    </span>
                  </a>
                </div>
              )}

              {/* Section 3: Audio Narration */}
              {!post.hideNarration && (
                <div className="pt-4 border-t border-border-rule/80">
                  <span className="text-[10px] font-mono tracking-widest text-text-muted block mb-2 uppercase">
                    AUDIO NARRATION
                  </span>
                  <AudioNarration compact={true} />
                </div>
              )}

              {/* Section 4: Share */}
              <div className="border-t border-border-rule/80 pt-3">
                <span className="text-xs font-mono font-bold tracking-widest text-text-muted uppercase block mb-2">
                  SHARE
                </span>
                <SharePost title={post.title} slug={slug} dek={post.excerpt} vertical={true} />
              </div>

            </div>
            
          </aside>

        </div>

        {/* RELATED READING SECTION (outside the columns to span full-width) */}
        <div className="mx-auto px-6 md:px-24 xl:px-16 2xl:px-32 mt-20 max-w-[1360px] xl:max-w-[1560px] 2xl:max-w-[1760px] w-full text-left">
          <RelatedPosts 
            posts={allPosts} 
            currentPost={post} 
            manualPinSlug={post.manualPinSlug || null}
          />
        </div>

      </article>
    </>
  );
}
