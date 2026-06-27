import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowDown, ExternalLink, Clock, Keyboard, Shield, Smartphone, Eye, Maximize2, ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { getLabBySlug, getLabs } from '../../../lib/strapi';
import { fallbackLabs } from '../../../data/fallbackLabs';
import RichTextRenderer from '../../../components/RichTextRenderer';
import LabEmbedder from '../../../components/labs/LabEmbedder';
import DataPersistencePanel from '../../../components/labs/DataPersistencePanel';
import LabFullscreenWrapper from '../../../components/labs/LabFullscreenWrapper';
import KeyboardShortcutsOverlay from '../../../components/labs/KeyboardShortcutsOverlay';

export const revalidate = 60; // Cache for 1 minute, revalidated on-demand

const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-black text-[var(--fg)]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic text-[var(--fg)]">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="font-mono bg-black/40 px-1.5 py-0.5 border border-[var(--rule)] text-xs text-[var(--accent)]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const renderFallbackDescription = (text) => {
  if (!text) return <p>This experimental lab provides alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.</p>;
  
  const blocks = text.split('\n\n');
  return blocks.map((block, bIdx) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={bIdx} className="text-lg font-black uppercase tracking-wider text-[var(--fg)] mt-8 mb-3 border-b border-[var(--rule)] pb-1.5 font-display select-none">
          {parseInlineMarkdown(trimmed.replace('### ', ''))}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={bIdx} className="text-xl font-black uppercase tracking-wider text-[var(--fg)] mt-8 mb-4 font-display select-none">
          {parseInlineMarkdown(trimmed.replace('## ', ''))}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={bIdx} className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-8 mb-4 font-display select-none">
          {parseInlineMarkdown(trimmed.replace('# ', ''))}
        </h1>
      );
    }
    if (trimmed.includes('\n- ') || trimmed.startsWith('- ') || trimmed.includes('\n* ') || trimmed.startsWith('* ')) {
      const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
      const firstItem = items[0].replace(/^[-*]\s+/, '');
      const listItems = [firstItem, ...items.slice(1)];
      return (
        <ul key={bIdx} className="list-disc pl-5 space-y-2 text-[16px] text-[var(--muted)] my-4 leading-relaxed font-sans">
          {listItems.map((item, iIdx) => (
            <li key={iIdx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
    }
    if (trimmed.includes('\n1. ') || trimmed.startsWith('1. ')) {
      const items = trimmed.split(/\n\d+\.\s+/).filter(Boolean);
      const firstItem = items[0].replace(/^\d+\.\s+/, '');
      const listItems = [firstItem, ...items.slice(1)];
      return (
        <ol key={bIdx} className="list-decimal pl-5 space-y-2 text-[16px] text-[var(--muted)] my-4 leading-relaxed font-sans">
          {listItems.map((item, iIdx) => (
            <li key={iIdx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={bIdx} className="text-[16px] leading-relaxed text-[var(--muted)] font-sans">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
};

const LAB_METADATA = {
  'acoustic-shield': {
    setupTime: '30 sec',
    complexity: 'DEEP DIVE',
    useCases: [
      'You\'re in a noisy open-plan office and can\'t focus',
      'Your coworker is loud-typing or talking nearby',
      'You need to read or write for 30+ minutes without auditory distraction',
      'You\'re transitioning between tasks and need a stable audio floor',
    ],
    shortcuts: { 'Space': 'Play/Pause', 'B': 'Toggle Binaural', 'T': 'Toggle Timer' },
  },
  'dopamine-snacks': {
    setupTime: '10 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'You\'re stuck scrolling and can\'t break the loop',
      'Your brain is in executive paralysis and needs a physical reset',
      'You\'ve been at your desk for 2+ hours without moving',
      'You feel restless but can\'t articulate why',
    ],
    shortcuts: { 'Space': 'Roll Snack', 'R': 'Reset' },
  },
  'visual-snow-shield': {
    setupTime: '15 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'Screen brightness is causing eye strain or headaches',
      'You\'re working late and need to reduce blue light exposure',
      'Visual snow or light sensitivity is making screens uncomfortable',
      'You want a consistent visual filter across all tabs',
    ],
    shortcuts: { 'Space': 'Toggle Shield', 'G': 'Toggle Grain', 'W': 'Toggle Wash' },
  },
  'brown-noise-loop': {
    setupTime: '5 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'You need a simple, no-fuss focus sound that just works',
      'You\'re studying or reading and need background audio masking',
      'You want a timer-based focus session with audio',
      'Late evening when your brain won\'t wind down',
    ],
    shortcuts: { 'Space': 'Play/Pause', 'T': 'Toggle Timer', 'V': 'Toggle Visuals' },
  },
  'decision-coin': {
    setupTime: '5 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'Deciding between two restaurants and starving while you think',
      'Choosing which task to start when both feel equally impossible',
      'Deciding whether to go to a thing or stay in',
      'Any "either is fine, but I can\'t pick" loop',
    ],
    shortcuts: { 'Space': 'Flip Coin', 'R': 'Reset Labels' },
  },
  'spoon-tracker': {
    setupTime: '15 sec',
    complexity: 'DEEP DIVE',
    useCases: [
      'Mornings when you\'re not sure what kind of day this is going to be',
      'After a heavy day, to see what you spent energy on',
      'During recovery from burnout, rebuilding a sense of your capacity',
      'You keep overcommitting and crashing at 3pm',
    ],
    shortcuts: { 'Space': 'Add Task', 'R': 'Reset Day' },
  },
  'sensory-audit': {
    setupTime: '2 min',
    complexity: 'DEEP DIVE',
    useCases: [
      'You feel "off" but can\'t pinpoint what\'s wrong',
      'You\'re in a new environment and want to assess sensory load',
      'Before starting a long work session in an unfamiliar space',
      'You suspect sensory overload but aren\'t sure which domain is the culprit',
    ],
    shortcuts: { 'Enter': 'Select Rating', 'Backspace': 'Go Back', 'R': 'Restart Audit' },
  },
};
// Fallback labs data has been moved to src/data/fallbackLabs.js to comply with Next.js page conventions.


export async function generateStaticParams() {
  let labs = [];
  try {
    labs = await getLabs();
  } catch (err) {
    console.warn('⚠️ [generateStaticParams] Failed to fetch lab slugs from Strapi:', err);
  }

  const sanitySlugs = labs.map(l => ({ slug: l.slug }));
  const mockSlugs = Object.keys(fallbackLabs).map(slug => ({ slug }));
  
  const allSlugs = [...sanitySlugs, ...mockSlugs];
  const uniqueSlugs = Array.from(new Set(allSlugs.map(s => s.slug))).map(slug => ({ slug }));
  return uniqueSlugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let lab = null;

  try {
    lab = await getLabBySlug(slug);
  } catch (err) {}

  if (!lab && fallbackLabs[slug]) {
    lab = fallbackLabs[slug];
  }

  if (!lab) {
    return {
      title: 'Lab not found - neurodivers3',
    };
  }

  const pageTitle = lab.seoTitle || lab.title;

  return {
    title: `${pageTitle} - neurodivers3`,
    description: lab.excerpt || "Alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.",
    openGraph: {
      title: `${pageTitle} - neurodivers3`,
      description: lab.excerpt || "Alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.",
    },
    twitter: {
      title: `${pageTitle} - neurodivers3`,
      description: lab.excerpt || "Alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.",
    }
  };
}

export default async function LabSlugPage(props) {
  const params = await props.params;
  const slug = params.slug;

  let lab = null;

  try {
    lab = await getLabBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch lab by slug: ", err);
  }

  if (!lab && fallbackLabs[slug]) {
    lab = fallbackLabs[slug];
  }

  if (!lab) {
    notFound();
  }

  const componentKey = lab.toolComponentKey || slug;
  const metadata = LAB_METADATA[slug] || {
    setupTime: '1 min',
    complexity: 'QUICK HIT',
    useCases: ['You need a quick sensory-friendly tool'],
    shortcuts: { 'Space': 'Activate' },
  };

  let allLabs = [];
  try {
    allLabs = await getLabs();
  } catch (err) {
    allLabs = Object.values(fallbackLabs).map(l => ({ ...l, slug: l.slug || '' }));
  }

  const currentIndex = allLabs.findIndex(l => (l.slug || '') === slug);
  const prevLab = currentIndex > 0 ? allLabs[currentIndex - 1] : null;
  const nextLab = currentIndex < allLabs.length - 1 ? allLabs[currentIndex + 1] : null;

  const relatedLabs = allLabs
    .filter(l => (l.slug || '') !== slug && l.category?.title === lab.category?.title)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-[112px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-start text-left">

      {/* Back button */}
      <Link 
        href="/labs" 
        className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8 self-start cursor-pointer font-mono"
      >
        <ArrowLeft size={12} /> BACK TO EXPERIMENTAL PLAYGROUND
      </Link>

      {/* Header */}
      <div className="border-b-4 border-fg-primary pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--fg)] leading-none mt-2 font-display">
            {lab.title}
          </h1>
          <p className="text-[16px] text-[var(--muted)] font-sans mt-4 leading-relaxed max-w-3xl">
            {parseInlineMarkdown(lab.excerpt)}
          </p>
        </div>
      </div>

      {/* Mobile-only Jump to Experiment Button */}
      <div className="block lg:hidden mb-6 no-print">
        <a
          href="#interactive-workspace"
          className="w-full py-4 bg-accent text-[var(--accent-text,var(--bg))] border-2 border-fg-primary font-black uppercase text-xs tracking-widest transition-all shadow-[4px_4px_0px_var(--fg)] active:translate-y-0.5 active:translate-x-0.5 flex items-center justify-center gap-2.5 cursor-pointer focus-ring text-center"
        >
          Jump to Interactive Experiment <ArrowDown size={26} className="stroke-[3.8px] animate-bounce ml-2" />
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-3.5 py-3 px-4 border border-[var(--rule)] bg-black/20 mb-8 text-xs md:text-sm font-mono uppercase tracking-wider text-[var(--muted)] w-full">
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock size={13} className="text-[var(--accent)]" />
          <span>{metadata.setupTime} setup</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Keyboard size={13} className="text-[var(--accent)]" />
          <span>Full keyboard</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Smartphone size={13} className="text-[var(--accent)]" />
          <span>Mobile ready</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Shield size={13} className="text-green-500" />
          <span className="text-green-500">No tracking</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Eye size={13} className="text-[var(--accent)]" />
          <span>Data stays local</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
        {/* Left Side: Discussion & Showcase Narrative */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)]">
            BACKGROUND & FUNCTION
          </h2>
          <div className="prose prose-invert max-w-none text-[15px] text-[var(--muted)] leading-relaxed space-y-4 font-sans">
            {lab.description ? (
              <RichTextRenderer content={lab.description} />
            ) : (
              renderFallbackDescription(lab.descriptionText)
            )}
          </div>

          {/* Try This When Section */}
          <div className="border border-[var(--rule)] bg-black/20 p-5 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <Zap size={14} className="text-[var(--accent)]" />
              TRY THIS WHEN...
            </h3>
            <ul className="space-y-2">
              {metadata.useCases.map((useCase, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)] leading-relaxed">
                  <span className="text-[var(--accent)] mt-0.5 shrink-0">→</span>
                  {parseInlineMarkdown(useCase)}
                </li>
              ))}
            </ul>
          </div>

          {/* External Link */}
          {lab.isExternal && lab.externalUrl && (
            <div className="pt-4">
              <a 
                href={lab.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] border border-[var(--accent)] hover:bg-transparent hover:text-[var(--accent)] transition-all font-black uppercase text-sm tracking-wider cursor-pointer"
              >
                LAUNCH EXTERNAL APPLICATION <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Prev/Next Navigation (Desktop Only) */}
          {(prevLab || nextLab) && (
            <div className="hidden lg:block border border-[var(--rule)] bg-black/20 p-4 space-y-3">
              <span className="text-sm font-mono text-[var(--muted)] uppercase tracking-widest block font-bold">
                NAVIGATE LABS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prevLab ? (
                  <Link
                    href={`/labs/${prevLab.slug}`}
                    className="flex items-center gap-2 p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer"
                  >
                    <ChevronLeft size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0" />
                    <div className="overflow-hidden text-left">
                      <span className="text-sm font-mono text-[var(--muted)] uppercase block">PREVIOUS</span>
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase truncate block">{prevLab.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="p-3 border border-[var(--rule)]/30 opacity-30 text-left">
                    <span className="text-sm font-mono text-[var(--muted)] uppercase block">PREVIOUS</span>
                    <span className="text-sm font-black text-[var(--muted)] uppercase">-</span>
                  </div>
                )}
                {nextLab ? (
                  <Link
                    href={`/labs/${nextLab.slug}`}
                    className="flex items-center gap-2 p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer justify-end text-right"
                  >
                    <div className="overflow-hidden">
                      <span className="text-sm font-mono text-[var(--muted)] uppercase block">NEXT</span>
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase truncate block">{nextLab.title}</span>
                    </div>
                    <ChevronRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0" />
                  </Link>
                ) : (
                  <div className="p-3 border border-[var(--rule)]/30 opacity-30 text-right">
                    <span className="text-sm font-mono text-[var(--muted)] uppercase block">NEXT</span>
                    <span className="text-sm font-black text-[var(--muted)] uppercase">-</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Labs (Desktop Only) */}
          {relatedLabs.length > 0 && (
            <div className="hidden lg:block border border-[var(--rule)] bg-black/20 p-5 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                YOU MIGHT ALSO LIKE
              </h3>
              <div className="space-y-2">
                {relatedLabs.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/labs/${related.slug}`}
                    className="flex items-center justify-between p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase block">{related.title}</span>
                      <span className="text-sm font-mono text-[var(--muted)] uppercase tracking-wider">{related.tag}</span>
                    </div>
                    <ArrowLeft size={12} className="text-[var(--muted)] group-hover:text-[var(--accent)] rotate-180 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Dynamic Interactive Tool Workspace */}
        <div id="interactive-workspace" className="lg:col-span-7 flex flex-col gap-6 w-full scroll-mt-24">
          {/* Fullscreen Toggle */}
          <LabFullscreenWrapper slug={componentKey} />

          {/* Data Persistence Panel */}
          <DataPersistencePanel />

          {/* Prev/Next Navigation (Mobile Only - Under the lab workspace) */}
          {(prevLab || nextLab) && (
            <div className="block lg:hidden border border-[var(--rule)] bg-black/20 p-4 space-y-3 mt-4">
              <span className="text-sm font-mono text-[var(--muted)] uppercase tracking-widest block font-bold">
                NAVIGATE LABS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prevLab ? (
                  <Link
                    href={`/labs/${prevLab.slug}`}
                    className="flex items-center gap-2 p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer"
                  >
                    <ChevronLeft size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0" />
                    <div className="overflow-hidden text-left">
                      <span className="text-sm font-mono text-[var(--muted)] uppercase block">PREVIOUS</span>
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase truncate block">{prevLab.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="p-3 border border-[var(--rule)]/30 opacity-30 text-left">
                    <span className="text-sm font-mono text-[var(--muted)] uppercase block">PREVIOUS</span>
                    <span className="text-sm font-black text-[var(--muted)] uppercase">-</span>
                  </div>
                )}
                {nextLab ? (
                  <Link
                    href={`/labs/${nextLab.slug}`}
                    className="flex items-center gap-2 p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer justify-end text-right"
                  >
                    <div className="overflow-hidden">
                      <span className="text-sm font-mono text-[var(--muted)] uppercase block">NEXT</span>
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase truncate block">{nextLab.title}</span>
                    </div>
                    <ChevronRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0" />
                  </Link>
                ) : (
                  <div className="p-3 border border-[var(--rule)]/30 opacity-30 text-right">
                    <span className="text-sm font-mono text-[var(--muted)] uppercase block">NEXT</span>
                    <span className="text-sm font-black text-[var(--muted)] uppercase">-</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Labs (Mobile Only - Under the lab workspace) */}
          {relatedLabs.length > 0 && (
            <div className="block lg:hidden border border-[var(--rule)] bg-black/20 p-5 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                YOU MIGHT ALSO LIKE
              </h3>
              <div className="space-y-2">
                {relatedLabs.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/labs/${related.slug}`}
                    className="flex items-center justify-between p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase block">{related.title}</span>
                      <span className="text-sm font-mono text-[var(--muted)] uppercase tracking-wider">{related.tag}</span>
                    </div>
                    <ArrowLeft size={12} className="text-[var(--muted)] group-hover:text-[var(--accent)] rotate-180 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay shortcuts={metadata.shortcuts} />
    </div>
  );
}
