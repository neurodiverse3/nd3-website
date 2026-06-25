import React from 'react';
import { Sparkles, Flame, Layers, Volume2, History } from 'lucide-react';
import MemoirNewsletter from '../../components/MemoirNewsletter';
import PageHeader from '../../components/PageHeader';

export const revalidate = 86400; // Cache for 24 hours, revalidated on-demand

export const metadata = {
  title: 'Memoir in Progress | I Thought I Was Just Bad at Being a Human | neurodivers³',
  description: 'A memoir in progress about late-diagnosed AuDHD, masking, burnout, and learning how to human. Join the newsletter for first fragments and release updates.',
  alternates: {
    canonical: 'https://neurodivers3.co.uk/memoir',
  },
  openGraph: {
    title: 'Memoir in Progress | I Thought I Was Just Bad at Being a Human | neurodivers³',
    description: 'A memoir in progress about late-diagnosed AuDHD, masking, burnout, and learning how to human. Join the newsletter for first fragments and release updates.',
    url: 'https://neurodivers3.co.uk/memoir',
    type: 'book',
    images: ['https://neurodivers3.co.uk/api/og?title=I%20thought%20I%20was%20just%20bad%20at%20being%20a%20human.&pillar=unmasked-life'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memoir in Progress | I Thought I Was Just Bad at Being a Human | neurodivers³',
    description: 'A memoir in progress about late-diagnosed AuDHD, masking, burnout, and learning how to human. Join the newsletter for first fragments and release updates.',
    images: ['https://neurodivers3.co.uk/api/og?title=I%20thought%20I%20was%20just%20bad%20at%20being%20a%20human.&pillar=unmasked-life'],
  }
};

export default async function MemoirPage() {

  // Structured schemas
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'I Thought I Was Just Bad at Being a Human',
    author: {
      '@type': 'Person',
      name: 'Ollie Clews',
      url: 'https://neurodivers3.co.uk/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'neurodivers³',
      url: 'https://neurodivers3.co.uk'
    },
    bookFormat: 'https://schema.org/EBook',
    workExample: {
      '@type': 'Book',
      name: 'I Thought I Was Just Bad at Being a Human',
      bookFormat: 'https://schema.org/EBook',
      creativeWorkStatus: 'InProgress'
    }
  };

  const breadcrumbSchema = {
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
        name: 'Memoir',
        item: 'https://neurodivers3.co.uk/memoir'
      }
    ]
  };

  const themes = [
    {
      icon: <Flame size={20} className="text-[var(--accent-label,var(--accent))] shrink-0" />,
      title: "THE BURNOUT CYCLE",
      desc: "Years of forcing an organic, hyper-reactive nervous system into rigid shapes. Burnout is not being tired. It is what happens when the system has been running past capacity for too long."
    },
    {
      icon: <Layers size={20} className="text-[var(--accent-label,var(--accent))] shrink-0" />,
      title: "LAYERS OF MASKING",
      desc: "The thousands of micro-decisions made every day to appear “normal”, and the extreme cognitive cost of holding that mask in place."
    },
    {
      icon: <Volume2 size={20} className="text-[var(--accent-label,var(--accent))] shrink-0" />,
      title: "SENSORY REALITIES",
      desc: "What it actually feels like to live in a loud, bright, over-stimulating world when you have no built-in filters to tone down the inputs."
    },
    {
      icon: <History size={20} className="text-[var(--accent-label,var(--accent))] shrink-0" />,
      title: "THE UNDIAGNOSED YEARS",
      desc: "Decades of being told it was depression, anxiety, BPD, or sensitivity — and the slow, complicated relief when the right language finally arrives."
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
        <PageHeader
          variant="section"
          eyebrow="A SLOW MEMOIR IN PROGRESS"
          titleLabel="Memoir"
          titleAccent="I Thought I Was Just Bad at Being a Human"
          subtitle="A memoir in progress about late-diagnosed AuDHD, masking, burnout, and the slow work of learning how to human. First fragments will go to newsletter subscribers."
          className="mb-16 md:mb-20"
        />

        {/* Desktop 2-column layout & Mobile single column stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start relative w-full mt-6">
          
          {/* Main Column (~65% equivalent) */}
          <div className="flex flex-col gap-12 text-left">
            
            {/* 3. Lead-in callout */}
            <div className="border border-[var(--accent-label,var(--accent))] bg-accent-pink-soft p-6 shadow-[4px_4px_0px_rgba(255,46,136,0.15)] text-left">
              <span className="block text-xs font-mono tracking-widest text-[var(--accent-label,var(--accent))] uppercase mb-2 select-none">
                WHAT THIS WILL BECOME
              </span>
              <p className="text-lg md:text-xl font-bold text-[var(--accent-label,var(--accent))] leading-relaxed">
                A memoir-in-progress about wondering why I never quite fit, being diagnosed with autism and ADHD in adulthood, and slowly realising I was not broken — I was exhausted, masked, and missing the right language.
              </p>
            </div>

            {/* 4. Welcome + long-form intro */}
            <div className="prose prose-invert max-w-none text-fg-primary leading-relaxed space-y-6 font-sans text-base md:text-lg">
              <p className="text-lg md:text-xl font-black text-fg-primary">
                Welcome. You’re early.
              </p>
              <p className="text-text-muted">
                The memoir is still being built. Slowly, messily, and very much in public.
              </p>
              <p className="text-text-muted">
                For as long as I can remember, I had the quiet, nagging suspicion that everyone else had been handed an instruction manual at birth, and my copy had been lost in the mail.
              </p>
              <p className="text-text-muted">
                I spent decades wondering why the simple things never felt simple. Why fluorescent lights felt like physical attacks. Why my brain could latch onto something with burning intensity and then drop it without warning.
              </p>
              <p className="text-text-muted">
                For thirty-something years, I didn’t have the right words for any of it.
              </p>
              <p className="text-text-muted">
                So I reached for the explanation that seemed most obvious at the time:
              </p>
            </div>

            {/* 5. Mid-page pink callout */}
            <div className="py-8 text-center select-none">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[var(--accent-label,var(--accent))] font-display tracking-tighter leading-[1.1] pb-2">
                I THOUGHT I WAS JUST BAD AT BEING A HUMAN.
              </h2>
            </div>

            {/* 6. Body continuation */}
            <div className="prose prose-invert max-w-none text-fg-primary leading-relaxed space-y-6 font-sans text-base md:text-lg">
              <p className="text-text-muted">
                This memoir will explore what happens when the labels finally arrive in adulthood. It is a record of late diagnosis, masking, burnout, grief, relationships, and the slow, uneven work of rebuilding a life from the ground up once you finally have the right language.
              </p>
            </div>

            {/* 7. What to expect here */}
            <div className="border border-border-rule p-8 md:p-10 shadow-[6px_6px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-fg-primary mb-6 flex items-center gap-3 font-display border-b border-border-rule pb-3 select-none">
                <Sparkles className="text-[var(--accent-label,var(--accent))] shrink-0 animate-pulse-slow" size={22} />
                <span>WHAT TO EXPECT HERE</span>
              </h2>
              
              <div className="space-y-6 text-base md:text-lg text-text-muted font-sans leading-relaxed">
                <p>
                  This is not a self-help book written by someone who has it all figured out. It is a memoir in progress: part diagnosis story, part burnout record, part pattern-spotting, and part unmasking in public.
                </p>
                <div className="space-y-4 pt-2">
                  <p className="font-bold text-fg-primary">The memoir will move through:</p>
                  <ul className="list-none pl-0 space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[var(--accent-label,var(--accent))] font-bold text-lg leading-none select-none mt-0.5">•</span>
                      <span>
                        <strong className="text-fg-primary font-bold">The reality of AuDHD:</strong> executive dysfunction, masking, sensory overload, and the burnout cycle.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[var(--accent-label,var(--accent))] font-bold text-lg leading-none select-none mt-0.5">•</span>
                      <span>
                        <strong className="text-fg-primary font-bold">The sensory load:</strong> what it feels like to live without built-in filters for light, sound, people, and expectation.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[var(--accent-label,var(--accent))] font-bold text-lg leading-none select-none mt-0.5">•</span>
                      <span>
                        <strong className="text-fg-primary font-bold">The undiagnosed years:</strong> poor mental health, misdiagnosis, BPD, depression, grief, and the relief of finally having language.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[var(--accent-label,var(--accent))] font-bold text-lg leading-none select-none mt-0.5">•</span>
                      <span>
                        <strong className="text-fg-primary font-bold">The relational shift:</strong> rebuilding boundaries, navigating relationships, living with loss, and finding self-forgiveness.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 8. Theme cards (themes of the memoir) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme, idx) => (
                <div 
                  key={idx}
                  className="bg-bg-primary border border-border-rule p-6 hover:border-[var(--accent-label,var(--accent))]/40 transition-colors shadow-[4px_4px_0px_var(--rule)] text-left flex gap-4 items-start h-full"
                >
                  <div className="p-2 border border-border-rule bg-black shadow-[2px_2px_0px_var(--rule)] shrink-0">
                    {theme.icon}
                  </div>
                  <div className="flex flex-col justify-start">
                    <h3 className="text-sm font-mono tracking-wider font-bold text-[var(--accent-label,var(--accent))] uppercase mb-2">
                      {theme.title}
                    </h3>
                    <p className="text-sm md:text-base text-text-muted leading-relaxed font-sans font-normal">
                      {theme.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 9. Bottom pink callout */}
            <div className="border border-[var(--accent-label,var(--accent))] bg-bg-primary p-6 md:p-8 shadow-[4px_4px_0px_rgba(255,46,136,0.15)] text-center select-none">
              <p className="text-base font-sans font-medium text-fg-primary italic leading-relaxed">
                Most of all, you’ll find the strange, sweet relief of finally realising:
              </p>
              <p className="text-2xl md:text-3xl font-black font-display text-[var(--accent-label,var(--accent))] tracking-widest uppercase mt-3">
                OH. IT WASN’T JUST ME.
              </p>
            </div>

            {/* 10. Closing line */}
            <div className="text-xl md:text-3xl font-black italic font-display text-[var(--accent-label,var(--accent))] text-center py-12 my-6 tracking-tight uppercase select-none">
              IF YOU’VE EVER FELT LIKE YOU MISSED THE MEMO ON HOW TO EXIST, YOU BELONG HERE.
            </div>

          </div>

          {/* Desktop Right Rail Column (~30% equivalent) */}
          <aside className="lg:sticky lg:top-32 h-fit hidden lg:block shrink-0">
            <MemoirNewsletter variant="sidebar" />
          </aside>
        </div>

        {/* 12. Mobile Stacked Early Chapters Card */}
        <div className="block lg:hidden w-full mt-12 animate-in fade-in duration-300">
          <MemoirNewsletter variant="sidebar" />
        </div>


      </div>
    </>
  );
}

