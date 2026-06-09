"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '../app/actions/newsletter';
import { urlFor } from '../lib/strapi';
import { PostCover } from './PostCover';

const getPillarLabel = (pillar) => {
  if (pillar === 'tiny-systems') return 'TOOLS & TEMPLATES';
  if (pillar === 'glitchwork') return 'DIGITAL LIFE';
  if (pillar === 'unmasked-life') return 'UNMASKED LIFE';
  return pillar?.replace('-', ' ').toUpperCase() || '';
};

export default function HomeClient({ siteSettings, latestPosts }) {
  const router = useRouter();
  const moodSectionRef = React.useRef(null);
  
  // Scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Founder photo grain reveal
  const [photoLoaded, setPhotoLoaded] = useState(false);

  // Scroll progress handler
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Newsletter states
  const [email, setEmail] = useState('');
  const [honey, setHoney] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Standard fallback content
  const rawHeadline = siteSettings?.memoirTeaser?.headline || "I thought I was just bad at being a human.";
  const memoir = {
    headline: rawHeadline.replace(/\bperson\b/gi, 'human').replace(/\bpeople\b/gi, 'humans'),
    blurb: siteSettings?.memoirTeaser?.blurb || "A memoir in progress about late AuDHD diagnosis, unmasking, and figuring out how to human.",
    ctaLabel: siteSettings?.memoirTeaser?.ctaLabel || "Read the memoir",
    ctaHref: siteSettings?.memoirTeaser?.ctaHref || "/memoir"
  };

  const founder = {
    name: siteSettings?.founder?.name || "Ollie",
    role: siteSettings?.founder?.role || "Writer & Founder",
    bio: siteSettings?.founder?.bio || "I started neurodivers³ because I needed somewhere honest to put the messy middle of late-diagnosed AuDHD life; the stories, the tools, the burnout, the rebuilding.",
    photo: siteSettings?.founder?.photo || null,
    ctaLabel: siteSettings?.founder?.ctaLabel || "More about me",
    ctaHref: siteSettings?.founder?.ctaHref || "/about"
  };

  const featured = siteSettings?.featuredPosts || [];

  // Strip trailing period dynamically to prevent duplicate punctuation
  const blurbText = memoir.blurb?.endsWith('.') ? memoir.blurb.slice(0, -1) : memoir.blurb;

  // Resolve founder photo URL via Sanity image builder or string URL
  const photoUrl = founder.photo 
    ? (typeof founder.photo === 'string' ? founder.photo : urlFor(founder.photo).url())
    : "/ollie.jpg";

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (honey) {
      // Spam bot hit the honeypot
      setSubscribeStatus('success');
      return;
    }

    if (!email || !email.includes('@')) {
      setSubscribeStatus('validation_error');
      setErrorMessage("That doesn't look like an email — try again?");
      return;
    }

    setIsSubmitting(true);
    setSubscribeStatus(null);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('source', 'home_block');

    try {
      const response = await subscribeNewsletter(null, formData);
      if (response.success) {
        setSubscribeStatus('success');
        setEmail('');
      } else {
        setSubscribeStatus('server_error');
        setErrorMessage(response.error || "Something glitched. Try again in a sec, or email ollie@neurodivers3.co.uk if it keeps happening.");
      }
    } catch (err) {
      setSubscribeStatus('server_error');
      setErrorMessage("Something glitched. Try again in a sec, or email ollie@neurodivers3.co.uk if it keeps happening.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pillars default list
  const pillars = [
    {
      id: "unmasked-life",
      title: "Unmasked Life",
      desc: "Stories about identity, masking, burnout, belonging and late-diagnosed neurodivergent life.",
      archiveHref: "/blog?pillar=unmasked-life"
    },
    {
      id: "tiny-systems",
      title: "Tools & Templates",
      desc: "Templates, checklists and practical tools for neurodivergent life, work and everyday overwhelm.",
      archiveHref: "/blog?pillar=tiny-systems"
    },
    {
      id: "glitchwork",
      title: "Digital Life",
      desc: "Practical and personal writing about attention, technology, digital overwhelm and life online.",
      archiveHref: "/blog?pillar=glitchwork"
    }
  ];

  // Brain states rows definition
  const brainStates = [
    { id: "burned-out", label: "BURNED OUT", hint: "for when everything feels too much", num: "01" },
    { id: "hyperfocus", label: "HYPERFOCUSED", hint: "for when your brain wants the deep dive", num: "02" },
    { id: "masking", label: "MASKING", hint: "for when you’re tired of performing", num: "03" },
    { id: "spiraling", label: "SPIRALLING", hint: "for when you need one small next step", num: "04" },
    { id: "on-a-roll", label: "ON A ROLL", hint: "for when the momentum is finally there", num: "05" }
  ];

  return (
    <div className="bg-bg-primary text-fg-primary font-sans antialiased selection:bg-accent selection:text-bg-primary">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-border-rule z-[100]">
        <div 
          className="h-full bg-accent"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Hero Section */}
      <section className="relative min-h-[100svh] h-auto flex flex-col px-6 md:px-24 overflow-hidden border-b border-border-rule py-12 md:py-16">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col justify-center relative z-10 items-start text-left pt-[100px] md:pt-[120px] pb-12">
          <div
            className="inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-6 md:mb-12 select-none"
            style={{ opacity: 0, animation: 'fadeInUp 0.6s ease forwards' }}
          >
            NEURODIVERGENT LIFE, TOOLS & STORIES
          </div>

          <h1 className="text-5xl md:text-[8rem] font-black leading-[1.05] tracking-[-0.02em] uppercase mb-4 md:mb-8 select-none">
            <div 
              className="block"
              style={{ opacity: 0, animation: 'fadeInUp 0.6s ease forwards' }}
            >
              <span className="text-fg-primary">UNMASKED</span>
              <span className="inline-block text-accent ml-0.5">.</span>
            </div>
            <div 
              className="block italic home-hero-gradient"
              style={{ 
                opacity: 0, 
                animation: 'fadeInUp 0.6s ease 0.1s forwards'
              }}
            >
              <span>UNFILTERED</span>
              <span className="inline-block ml-0.5" style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <div 
              className="block"
              style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.2s forwards' }}
            >
              <span className="text-fg-primary">UNAPOLOGETIC</span>
              <span className="inline-block text-accent ml-0.5">.</span>
            </div>
          </h1>

          <p
            className="text-base md:text-2xl text-text-muted max-w-[48ch] leading-relaxed mb-6 md:mb-12 font-normal"
            style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.3s forwards' }}
          >
            Honest stories, useful tools and practical ideas for making everyday life work better with a neurodivergent brain.
          </p>

          <div
            style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.45s forwards' }}
          >
            <button
              onClick={() => {
                const element = document.getElementById('pillars');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-5 bg-accent text-[var(--accent-text,var(--bg))] border-2 border-fg-primary font-black rounded-none shadow-[4px_4px_0px_var(--fg)] flex items-center gap-3 uppercase tracking-wider text-base cursor-pointer hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 transition-all duration-200 focus-ring"
            >
              Start here <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Hero Footer: ghosted ³ glyph bottom-right */}
        <div 
          className="absolute bottom-24 right-24 text-[240px] sm:text-[360px] md:text-[480px] font-black leading-none text-accent select-none pointer-events-none z-0 hidden min-[480px]:block"
          style={{ opacity: 0.06 }}
          aria-hidden="true"
        >
          ³
        </div>
      </section>

      {/* 3. Mood Section — How's the brain today? */}
      <section ref={moodSectionRef} className="border-b border-border-rule bg-bg-primary">
        <div className="max-w-7xl mx-auto pt-16 md:pt-[64px] pb-8 md:pb-12 px-6 md:px-24">
          <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-6 select-none">
            PICK A MODE. READ WHAT FITS.
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-left">
            How's your brain today<span className="text-accent inline-block ml-3">?</span>
          </h2>
        </div>

        <div className="border-t border-border-rule">
          {brainStates.map((state, index) => (
            <div
              key={state.id}
              style={{ 
                opacity: 0, 
                animation: `fadeInRight 0.4s ease ${index * 0.08}s forwards`
              }}
            >
              <Link
                href={`/blog?state=${state.id}`}
                className="group block border-b border-border-rule relative overflow-hidden transition-all duration-300 hover:bg-[var(--accent-soft)] focus:bg-[var(--accent-soft)]"
                aria-label={`${state.label} — ${state.hint}`}
              >
                <div className="max-w-7xl w-full mx-auto px-6 md:px-24 py-0 min-h-[88px] md:min-h-[120px] flex flex-row items-center justify-between gap-6 relative z-10">
                  {/* Number & Label */}
                  <div className="flex items-center gap-10 md:gap-[40px]">
                    <span className="text-[48px] md:text-[72px] font-black text-text-muted group-hover:text-link transition-colors duration-300 font-mono tabular-nums" aria-hidden="true">
                      {state.num}
                    </span>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none text-fg-primary group-hover:text-link transition-colors duration-300 font-display">
                        {state.label}
                      </span>
                      <span className="text-xs md:text-sm text-text-muted mt-1 tracking-wide font-normal group-hover:text-fg-primary transition-colors duration-300">
                        {state.hint}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={32} className="text-text-muted group-hover:text-link group-hover:translate-x-1.5 transition-all duration-300 shrink-0" />
                </div>
                {/* Active left indicator rule */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Three Pillars */}
      <section id="pillars" className="py-16 md:py-20 lg:py-[120px] px-6 md:px-24 max-w-7xl mx-auto border-b border-border-rule">
        <div className="mb-16">
          <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-6 select-none">
            THE THREE TOPIC PILLARS
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 text-left">
            What you'll find here<span className="text-accent inline-block ml-0.5">.</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted max-w-[64ch] leading-relaxed mb-16 font-normal text-left">
            Everything written here is mapped to one of three core pillars. Choose a pillar below to filter the archive, or browse everything further down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <Link
              key={pillar.id}
              href={pillar.archiveHref}
              className="group border-2 border-border-rule hover:border-fg-primary bg-bg-primary p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 shadow-[6px_6px_0px_var(--rule)] hover:shadow-[10px_10px_0px_var(--accent)] rounded-none text-left min-h-[300px] cursor-pointer"
              style={{ 
                opacity: 0, 
                animation: `fadeInUp 0.5s ease ${0.2 + index * 0.1}s forwards`
              }}
            >
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-black uppercase tracking-tight text-fg-primary mb-4 group-hover:text-link transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-base text-text-muted leading-relaxed font-normal mb-8">{pillar.desc}</p>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-rule/40">
                <span className="text-[13px] font-black uppercase tracking-widest text-text-muted group-hover:text-link transition-colors flex items-center gap-2">
                  Explore category <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Reading */}
      {featured.length >= 3 && (
        <section className="py-16 md:py-20 lg:py-[120px] px-6 md:px-24 max-w-7xl mx-auto border-b border-border-rule">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-4 select-none">FEATURED READING</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mt-4">
                Read these first<span className="text-accent inline-block ml-0.5">.</span>
              </h2>
            </div>
            <Link href="/blog" className="text-[13px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-link transition-colors flex items-center gap-2">
              View all posts →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.slice(0, 3).map((post, idx) => {
              const slug = post.slug?.current || post.slug;
              const mapPillarKey = (p) => {
                const k = p?.toLowerCase() || '';
                if (k.includes('system') || k.includes('tool')) return 'tools';
                if (k.includes('glitch') || k.includes('digital')) return 'digital';
                return 'unmasked';
              };
              const postNumber = post.postNumber || (idx + 1);

              return (
                <div
                  key={post._id || idx}
                  className="group border-2 border-border-rule hover:border-fg-primary focus-within:border-fg-primary bg-bg-primary flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 focus-within:-translate-y-1.5 shadow-[6px_6px_0px_var(--rule)] hover:shadow-[10px_10px_0px_var(--accent)] focus-within:shadow-[10px_10px_0px_var(--accent)] rounded-none text-left overflow-hidden cursor-pointer"
                  data-pillar={mapPillarKey(post.pillar)}
                >
                  <Link 
                    href={`/blog/${slug}`}
                    className="border-b-2 border-border-rule group-hover:border-fg-primary transition-colors block"
                  >
                    <PostCover 
                      title={post.title} 
                      pillar={post.pillar} 
                      brainState={post.brainState || 'hyperfocus'}
                      accentWord={post.accentWord}
                      accentOverride={post.accentOverride}
                      aspect="4:3" 
                      readTime={post.readTime || '5 MIN'}
                      date={post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'RECENT'}
                      postNumber={postNumber}
                    />
                  </Link>

                  <div className="px-6 py-8 flex flex-col justify-between flex-grow">
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-link mb-4">
                        <span>{getPillarLabel(post.pillar)}</span>
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-text-muted leading-relaxed font-normal line-clamp-4 mb-6">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    
                    <Link 
                      href={`/blog/${slug}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 mt-auto bg-transparent text-fg-primary font-black text-xs uppercase tracking-widest border-2 border-fg-primary shadow-[4px_4px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all rounded-none w-fit"
                    >
                      READ POST <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Memoir Teaser */}
      <section className="bg-bg-primary border-b border-border-rule py-16 md:py-20 lg:py-[120px] px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-fg-primary p-8 md:p-14 bg-bg-primary relative shadow-[8px_8px_0px_var(--accent)] hover:shadow-[12px_12px_0px_var(--accent)] hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 transition-all duration-300 text-center rounded-none group">
            {/* Dotted noise texture overlay */}
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none rounded-none" />
            
            <span className="relative z-10 inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] border border-border-rule px-3 py-1 uppercase select-none">
              · SERIAL MEMOIR IN PROGRESS
            </span>
            <h2 className="relative z-10 text-4xl md:text-6xl font-black tracking-tighter uppercase mt-8 mb-6 text-fg-primary leading-none group-hover:text-link transition-colors duration-300">
              {memoir.headline.replace(/\.$/, '').toUpperCase()}<span className="text-accent inline-block ml-0.5">.</span>
            </h2>
            
            <p className="relative z-10 text-lg md:text-xl font-normal leading-relaxed text-text-muted mb-10 max-w-2xl mx-auto">
              {memoir.blurb || "A memoir in progress about late AuDHD diagnosis, unmasking, and figuring out how to human."}
            </p>

            <div className="relative z-10 flex justify-center pt-6 border-t border-border-rule/60 max-w-xl mx-auto">
              <Link
                href={memoir.ctaHref || '/memoir'}
                className="px-8 py-5 bg-accent text-[var(--accent-text,var(--bg))] border-2 border-fg-primary rounded-none shadow-[4px_4px_0px_var(--fg)] hover:shadow-[6px_6px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all duration-200 font-black uppercase tracking-wider text-sm"
              >
                Read the memoir
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Founder Block — Meet Ollie */}
      <section className="py-16 md:py-20 lg:py-[120px] px-6 md:px-24 max-w-7xl mx-auto border-b border-border-rule">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          {/* Photo container */}
          <div className="w-full aspect-square md:w-[480px] h-auto md:h-[480px] relative overflow-hidden shrink-0 border-4 border-fg-primary shadow-[10px_10px_0px_var(--rule)] hover:shadow-[12px_12px_0px_var(--accent)] hover:-translate-y-1 hover:translate-x-1 transition-all duration-300 bg-bg-primary">
            {photoUrl ? (
              <>
                <Image
                  src={photoUrl}
                  alt="Ollie, mid-30s, looking slightly off-camera, near-black background"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  onLoad={() => setPhotoLoaded(true)}
                  className="object-cover filter grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-500"
                  priority
                />
                {/* Grain overlay */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
              </>
            ) : (
              <div className="w-full h-full bg-bg-primary border border-dashed border-accent/30 flex flex-col items-center justify-center text-center p-8 gap-4">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                  [ PHOTO · ASSET PENDING ]
                </div>
                <p className="text-[11px] font-mono text-text-muted max-w-[24ch] leading-relaxed">
                  Real photo of Ollie. Direction: tight crop, dark background, grain treatment, non-corporate feel.
                </p>
              </div>
            )}
          </div>

          {/* Text Container */}
          <div className="flex-1 flex flex-col justify-center items-start">
            <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-4 select-none">
              Founder’s Note
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none text-fg-primary">
              HI, I'M {founder.name.replace(/\.$/, '').toUpperCase()}<span className="text-accent inline-block ml-0.5">.</span>
            </h2>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed font-normal mb-8">
              {founder.bio}
            </p>
            <Link
              href={founder.ctaHref}
              className="text-base font-black uppercase tracking-wider text-link hover:opacity-80 hover:underline underline-offset-8 transition-colors flex items-center gap-2 group"
            >
              {founder.ctaLabel?.replace('→', '').trim()} <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Block */}
      <section className="border-b border-border-rule py-16 md:py-20 lg:py-[120px] bg-bg-primary px-6 md:px-24">
        <div className="max-w-3xl mx-auto border-2 border-border-rule p-8 md:p-12 bg-bg-primary/35 shadow-[6px_6px_0px_var(--rule)] relative hover:border-fg-primary hover:shadow-[8px_8px_0px_var(--fg)] transition-all duration-300">
          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
          
          <div className="max-w-[560px] mx-auto text-center relative z-10">
            <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-6 select-none">
              Newsletter
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none font-display">
              GET IT BY EMAIL<span className="text-accent inline-block ml-0.5">.</span>
            </h2>
            <p className="text-base text-text-muted leading-relaxed font-normal mb-8">
              One honest email when there's something worth saying. No schedule. No funnel. No "hey friend".
            </p>

            {subscribeStatus !== 'success' ? (
              <form
                onSubmit={handleNewsletterSubmit}
                className="space-y-4"
                aria-live="polite"
              >
                {/* Honeypot field */}
                <input
                  type="text"
                  name="company"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <label htmlFor="email-input" className="sr-only">Email address</label>
                    <input
                      id="email-input"
                      type="email"
                      required
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 bg-bg-primary border-2 border-fg-primary focus:border-accent focus:ring-2 focus:ring-accent/20 px-6 py-4 outline-none text-fg-primary text-sm font-bold shadow-[3px_3px_0px_var(--rule)] transition-all duration-200 rounded-none placeholder:text-text-muted"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 px-8 bg-accent hover:bg-accent/90 text-[var(--accent-text,var(--bg))] font-black border-2 border-fg-primary rounded-none shadow-[4px_4px_0px_var(--fg)] hover:shadow-[3px_3px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Subscribe →"
                    )}
                  </button>
                </div>

                <p className="text-xs text-text-muted text-center leading-relaxed font-normal">
                  New chapters land with subscribers first, then arrive on the site 7 days later.
                </p>
                <p className="text-[11px] text-text-muted/80 text-center leading-relaxed font-normal font-mono uppercase mt-1">
                  No spam. Unsubscribe in one click.
                </p>

                {subscribeStatus === 'validation_error' && (
                  <p className="text-accent text-xs font-black tracking-wider uppercase text-left mt-2 pl-1">
                    ⚠️ {errorMessage}
                  </p>
                )}
                {subscribeStatus === 'server_error' && (
                  <p className="text-accent text-xs font-black tracking-wider uppercase text-left mt-2 pl-1">
                    ⚠️ {errorMessage}
                  </p>
                )}
              </form>
            ) : (
              <div
                className="p-8 border-2 border-accent bg-[var(--accent-soft)] text-center shadow-[4px_4px_0px_var(--accent)] animate-in fade-in zoom-in-95 duration-200"
              >
                <CheckCircle2 size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase text-fg-primary mb-2">In.</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Check your inbox for a confirmation — subject line: <span className="text-accent italic font-semibold">"yes that was me"</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Latest Writing */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="py-16 md:py-20 lg:py-[120px] px-6 md:px-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-4 select-none">Latest Writing</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mt-4">
                FRESH OFF THE KEYBOARD<span className="text-accent inline-block ml-0.5">.</span>
              </h2>
            </div>
            <Link href="/blog" className="text-[13px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-link transition-colors flex items-center gap-2">
              All posts →
            </Link>
          </div>

          <div className={`grid gap-8 ${
            latestPosts.length === 1 ? 'grid-cols-1 max-w-[400px]' :
            latestPosts.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-[850px]' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {latestPosts.slice(0, 3).map((post, idx) => {
              const slug = post.slug?.current || post.slug;
              const formattedDate = post.date || (post._createdAt ? new Date(post._createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'RECENT');
              const mapPillarKey = (p) => {
                const k = p?.toLowerCase() || '';
                if (k.includes('system') || k.includes('tool')) return 'tools';
                if (k.includes('glitch') || k.includes('digital')) return 'digital';
                return 'unmasked';
              };
              const postNumber = post.postNumber || (idx + 1);

              return (
                <div
                  key={post._id || idx}
                  className="group border-2 border-border-rule hover:border-fg-primary focus-within:border-fg-primary bg-bg-primary flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 focus-within:-translate-y-1.5 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--fg)] focus-within:shadow-[6px_6px_0px_var(--fg)] rounded-none text-left overflow-hidden cursor-pointer"
                  data-pillar={mapPillarKey(post.pillar)}
                >
                  <Link 
                    href={`/blog/${slug}`}
                    className="border-b-2 border-border-rule group-hover:border-fg-primary transition-colors block cursor-pointer"
                  >
                    <PostCover 
                      title={post.title} 
                      pillar={post.pillar} 
                      brainState={post.brainState || 'hyperfocus'}
                      accentWord={post.accentWord}
                      accentOverride={post.accentOverride}
                      aspect="4:3" 
                      readTime={post.readTime || '5 MIN'}
                      date={formattedDate}
                      postNumber={postNumber}
                    />
                  </Link>

                  <div className="px-6 py-8 flex flex-col justify-between flex-grow">
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-link mb-4">
                        <span>{getPillarLabel(post.pillar)}</span>
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-text-muted leading-relaxed font-normal line-clamp-4 mb-6">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-[11px] font-black tracking-widest text-text-muted uppercase font-mono group-hover:text-link transition-colors mt-6 pt-4 border-t border-border-rule/40 flex items-center justify-between w-full">
                      <time dateTime={post.date || post._createdAt}>
                        {formattedDate}
                      </time>
                      <Link 
                        href={`/blog/${slug}`}
                        className="text-[11px] font-black tracking-widest text-link hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-all duration-300"
                      >
                        READ POST →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
