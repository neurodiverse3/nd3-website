import React from 'react';
import { Sparkles, Flame, Layers, Volume2, History } from 'lucide-react';
import MemoirNewsletter from '../../components/MemoirNewsletter';
import PageHeader from '../../components/PageHeader';

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: 'The Memoir — neurodivers3',
  description: 'A serial memoir in progress about late-diagnosed AuDHD, masking, burnout, and figuring out how to human.',
  alternates: {
    canonical: 'https://neurodivers3.co.uk/memoir',
  },
  openGraph: {
    title: 'The Memoir — neurodivers3',
    description: 'A serial memoir in progress about late-diagnosed AuDHD, masking, burnout, and figuring out how to human.',
    url: 'https://neurodivers3.co.uk/memoir',
    type: 'book',
    images: ['https://neurodivers3.co.uk/api/og?title=I%20thought%20I%20was%20just%20bad%20at%20being%20a%20human.&pillar=unmasked-life'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Memoir — neurodivers3',
    description: 'A serial memoir in progress about late-diagnosed AuDHD, masking, burnout, and figuring out how to human.',
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
      desc: "Years of forcing an organic, hyper-reactive nervous system into rigid corporate shapes. Burnout isn't \"tired\" · it's systemic biological failure."
    },
    {
      icon: <Layers size={20} className="text-[var(--accent-label,var(--accent))] shrink-0" />,
      title: "LAYERS OF MASKING",
      desc: "Deconstructing the thousands of micro-decisions made every single day to appear \"normal\" · and the extreme cognitive cost of holding that mask in place."
    },
    {
      icon: <Volume2 size={20} className="text-[var(--accent-label,var(--accent))] shrink-0" />,
      title: "SENSORY REALITIES",
      desc: "What it actually feels like to live in a loud, bright, over-stimulating world when you have no built-in filters to tone down the inputs."
    },
    {
      icon: <History size={20} className="text-[var(--accent-label,var(--accent))] shrink-0" />,
      title: "THE UNDIAGNOSED YEARS",
      desc: "Decades of being told it was depression, anxiety, BPD, or just \"sensitivity\". The grief of not knowing sooner · and the slow, complicated relief when the right language finally arrives."
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
          eyebrow="Serial Memoir In Progress"
          titleLabel="Memoir"
          titleAccent="I thought I was just bad at being a human"
          subtitle="A serial memoir in progress about late-diagnosed AuDHD, masking, burnout, and figuring out how to human · published one chapter at a time."
        />

        {/* Desktop 2-column layout & Mobile single column stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start relative w-full mt-6">
          
          {/* Main Column (~65% equivalent) */}
          <div className="flex flex-col gap-12 text-left">
            
            {/* 3. Lead-in callout */}
            <div className="border border-[var(--accent-label,var(--accent))] bg-accent-pink-soft p-6 md:p-8 shadow-[4px_4px_0px_rgba(255,46,136,0.15)]">
              <p className="text-lg md:text-xl font-bold text-[var(--accent-label,var(--accent))] leading-relaxed">
                A serial memoir about wondering why I never quite fit, getting diagnosed with both autism and ADHD during a combined assessment in 2023, and the messy, beautiful work of figuring out how to human.
              </p>
            </div>

            {/* 4. Welcome + long-form intro */}
            <div className="prose prose-invert max-w-none text-fg-primary leading-relaxed space-y-6 font-sans text-base md:text-lg">
              <p className="text-lg md:text-xl font-black text-fg-primary">
                Welcome. I'm so glad you stumbled in.
              </p>
              <p className="text-text-muted">
                For as long as I can remember, I had the quiet, nagging suspicion that everyone else had been handed an instruction manual at birth, and my copy had been lost in the mail.
              </p>
              <p className="text-text-muted">
                I spent decades wondering why the simple things never felt simple. Why existing seemed to take so much effort. Why fluorescent lights felt like physical attacks. Why my brain could latch onto something with burning intensity and then drop it without warning. Why replying to an email could feel like climbing a mountain.
              </p>
              <p className="text-text-muted">
                For thirty-something years, I didn't have the right words for any of it. So I reached for the explanation that seemed most obvious at the time:
              </p>
            </div>

            {/* 5. Mid-page pink callout */}
            <div className="py-6 text-center select-none">
              <h2 className="text-3xl md:text-5xl font-black uppercase text-[var(--accent-label,var(--accent))] font-display tracking-tighter leading-none">
                I THOUGHT I WAS JUST BAD AT BEING A HUMAN.
              </h2>
            </div>

            {/* 6. Body continuation */}
            <div className="prose prose-invert max-w-none text-fg-primary leading-relaxed space-y-6 font-sans text-base md:text-lg">
              <p className="text-text-muted">
                Then, in my thirties, the pieces of the puzzle started to land. I was diagnosed with both autism and ADHD during a combined assessment in 2023.
              </p>
              <p className="text-text-muted">
                This serial memoir is about the journey to and through that diagnosis. It's about masking, burnout, BPD, depression, grief, loss, relationships, physical health, and the long, uneven process of looking back at a life I finally had new language for.
              </p>
              <p className="text-text-muted">
                It's about what happens after the labels arrive: the messy, beautiful, sometimes hilarious, and often grieving work of unlearning who I thought I had to be, and figuring out how to human on my own terms.
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
                  This is not a self-help book written by someone who has it all figured out. It's an episodic, lived-in chronicle from the middle of the transition: part memory, part pattern-spotting, and part unmasking in public.
                </p>
                <div className="space-y-4 pt-2">
                  <p className="font-bold text-fg-primary">Here, you'll find chapters about:</p>
                  <ul className="list-none pl-0 space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[var(--accent-label,var(--accent))] font-bold text-lg leading-none select-none mt-0.5">•</span>
                      <span>
                        <strong className="text-fg-primary font-bold">The reality of AuDHD:</strong> honest writing on executive dysfunction, masking, and the burnout cycle.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[var(--accent-label,var(--accent))] font-bold text-lg leading-none select-none mt-0.5">•</span>
                      <span>
                        <strong className="text-fg-primary font-bold">The sensory load:</strong> what it actually feels like to live without built-in filters for light, sound and stimulation.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[var(--accent-label,var(--accent))] font-bold text-lg leading-none select-none mt-0.5">•</span>
                      <span>
                        <strong className="text-fg-primary font-bold">The undiagnosed years:</strong> poor mental health, misdiagnosis, BPD, depression, and the grief of not knowing sooner.
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
                  className="bg-bg-primary border border-border-rule p-6 hover:border-[var(--accent-label,var(--accent))]/40 transition-colors shadow-[4px_4px_0px_var(--rule)] text-left flex gap-4 items-start"
                >
                  <div className="p-2 border border-border-rule bg-black shadow-[2px_2px_0px_var(--rule)] shrink-0">
                    {theme.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-mono tracking-wider font-bold text-[var(--accent-label,var(--accent))] uppercase mb-2">
                      {theme.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed font-sans font-normal">
                      {theme.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 9. Bottom pink callout */}
            <div className="border border-[var(--accent-label,var(--accent))] bg-bg-primary p-6 md:p-8 shadow-[4px_4px_0px_rgba(255,46,136,0.15)] text-center select-none">
              <p className="text-base font-sans font-medium text-fg-primary italic leading-relaxed">
                Most of all, you'll find the strange, sweet relief of finally realising:
              </p>
              <p className="text-2xl md:text-3xl font-black font-display text-[var(--accent-label,var(--accent))] tracking-widest uppercase mt-3">
                OH. IT WASN'T JUST ME.
              </p>
            </div>

            {/* 10. Closing line */}
            <div className="text-xl md:text-3xl font-black italic font-display text-[var(--accent-label,var(--accent))] text-center py-12 my-6 tracking-tight uppercase select-none">
              If you've ever felt like you missed the memo on how to exist, you belong here.
            </div>

          </div>

          {/* Desktop Right Rail Column (~30% equivalent) */}
          <aside className="lg:sticky lg:top-32 h-fit hidden lg:block shrink-0">
            <MemoirNewsletter />
          </aside>
        </div>

        {/* 12. Mobile Stacked Early Transmissions Card */}
        <div className="block lg:hidden w-full mt-16 animate-in fade-in duration-300">
          <MemoirNewsletter />
        </div>
      </div>
    </>
  );
}
