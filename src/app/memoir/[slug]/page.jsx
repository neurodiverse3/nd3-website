import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { getMemoirChapterBySlug, getMemoirChapters } from '../../../lib/strapi';
import RichTextRenderer from '../../../components/RichTextRenderer';
import ReadingProgress from '../../../components/ReadingProgress';
import { toSmartQuotes } from '../../../lib/typography';

export const revalidate = 60; // Cache for 1 minute, revalidated on-demand

export async function generateStaticParams() {
  try {
    const chapters = await getMemoirChapters();
    if (!chapters || !Array.isArray(chapters)) return [];
    return chapters.map((c) => {
      const slugStr = typeof c.slug === 'object' && c.slug !== null
        ? c.slug.current || c.slug.slug || ''
        : c.slug;
      return { slug: slugStr };
    }).filter(item => item.slug);
  } catch (err) {
    console.warn('⚠️ [generateStaticParams Memoir] Failed to fetch memoir chapters from Strapi:', err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let chapter = null;

  try {
    chapter = await getMemoirChapterBySlug(slug);
  } catch (err) {}

  if (!chapter) {
    return {
      title: 'Chapter not found - neurodivers³',
    };
  }

  const pageTitle = chapter.seoTitle || chapter.title;

  return {
    title: `${pageTitle} - neurodivers³`,
    description: chapter.excerpt || "A serial memoir chapter from neurodivers3.",
    alternates: {
      canonical: `https://neurodivers3.co.uk/memoir/${slug}`,
    },
    openGraph: {
      title: `${pageTitle} - neurodivers³`,
      description: chapter.excerpt || "A serial memoir chapter from neurodivers3.",
    },
    twitter: {
      title: `${pageTitle} - neurodivers³`,
      description: chapter.excerpt || "A serial memoir chapter from neurodivers3.",
    }
  };
}

export default async function MemoirChapterPage(props) {
  const params = await props.params;
  const slug = params.slug;

  let chapter = null;
  try {
    chapter = await getMemoirChapterBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch memoir chapter: ", err);
  }

  if (!chapter) {
    notFound();
  }

  // Format title and excerpt with typographic curly quotes
  chapter = {
    ...chapter,
    title: toSmartQuotes(chapter.title),
    excerpt: toSmartQuotes(chapter.excerpt),
  };

  // Format date
  const dateFormatted = new Date(chapter.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-3xl mx-auto flex flex-col justify-start text-left font-sans">
        {/* Back to Memoir home */}
        <Link 
          href="/memoir" 
          className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 self-start cursor-pointer font-mono"
        >
          <ArrowLeft size={14} /> BACK TO THE MEMOIR HOME
        </Link>

        {/* Chapter Metadata */}
        <article className="space-y-8">
          <header className="space-y-4 border-b border-[var(--rule)] pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--accent)] font-bold uppercase tracking-wider">
              <span>CHAPTER {chapter.chapterNumber}</span>
              <span className="text-[var(--rule)]">|</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {dateFormatted}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--fg)] leading-none font-display">
              {chapter.title}
            </h1>

            {chapter.excerpt && (
              <p className="text-lg text-[var(--muted)] italic border-l-2 border-[var(--accent)] pl-4 py-1 leading-relaxed">
                "{chapter.excerpt}"
              </p>
            )}
          </header>

          {/* Chapter Body Content (Portable Text) */}
          <section className="prose prose-invert max-w-none text-[17px] text-[var(--fg)] leading-relaxed space-y-6 font-sans">
            <RichTextRenderer content={chapter.content} />
          </section>
        </article>

        {/* Footer sign off */}
        <footer className="mt-16 pt-8 border-t border-[var(--rule)] flex flex-col items-center justify-center text-center gap-4">
          <BookOpen size={24} className="text-[var(--accent)] animate-pulse" />
          <p className="text-sm font-mono text-[var(--muted)] uppercase tracking-widest font-bold">
            End of Chapter {chapter.chapterNumber} · Thank you for reading.
          </p>
          <Link 
            href="/memoir"
            className="text-sm font-black uppercase tracking-wider text-[var(--accent)] hover:underline mt-4 cursor-pointer font-mono"
          >
            &larr; View all chapters
          </Link>
        </footer>
      </div>
    </>
  );
}
