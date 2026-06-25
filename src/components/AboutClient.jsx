"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Zap, 
  VolumeX, 
  RotateCcw
} from 'lucide-react';
import PageHeader from './PageHeader';

export default function AboutClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full text-left"
      >
        {/* Section 1: Hero */}
        <motion.section variants={itemVariants} className="mb-16">
          <PageHeader
            variant="section"
            eyebrow="The Founder"
            titleLabel="About"
            titleAccent="Born out of survival"
            subtitle="Meet Ollie - late-diagnosed AuDHD founder of neurodivers³. Stories, tools, and systems for the wired-different brain."
          />
          <blockquote className="border-l-4 border-accent pl-6 py-2 mt-8">
            <p className="text-2xl md:text-3xl font-light text-fg leading-relaxed max-w-4xl font-sans">
              Ollie is a late-diagnosed AuDHD adult, a recovering "weird kid", and the brain behind <span className="font-semibold text-accent">neurodivers³</span>.
            </p>
          </blockquote>
        </motion.section>

        {/* Section 2: Founder note */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-24">
          <div className="md:col-span-2 space-y-6 max-w-2xl text-[16px] md:text-[18px] leading-relaxed text-fg/90 font-sans">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">
              "neurodivers³ was born out of survival."
            </h2>
            <p className="font-semibold text-accent text-lg">Welcome. I'm so glad you stumbled in.</p>
            <p>
              For thirty-odd years, I was just "weird Ollie." I never quite fit. I had the quiet, nagging suspicion that everyone else had been handed an instruction manual to life, and I was left winging it, trying too hard, getting it wrong, and never understanding why.
            </p>
            <p>
              I spent decades wondering why the simple things never felt simple. Why existing seemed to take so much effort. Why fluorescent lights felt like physical attacks. Why my brain could latch onto a topic with burning intensity and then drop it without warning. Why replying to a basic email could feel like climbing a mountain.
            </p>
            <p>
              For all those years, I didn't have the right words for any of it. So I reached for the explanation that seemed most obvious at the time:
            </p>
            <p className="italic border-l-2 border-border-rule pl-4 text-muted my-6 font-mono text-sm md:text-base">
              I thought I was just bad at being a human.
            </p>
            <p>
              Then, in my thirties, the noise finally shifted into language. I was diagnosed with AuDHD (Autism and ADHD), and the story I had been telling myself began to change.
            </p>
            <p>
              It turns out I wasn't broken, or difficult, or not trying hard enough. I was just running a completely different operating system, and following the wrong instruction manual.
            </p>
            <p>
              I built <strong className="text-accent font-semibold font-sans">neurodivers³</strong>{" "}because I needed a place to share my journey to and through that diagnosis. It's a space about masking, burnout, BPD, depression, grief, loss, relationships, physical health, and the long, uneven process of looking back at a life I finally had new language for.
            </p>
            <p>
              It's about what happens <em>after</em> the labels arrive. The messy, beautiful, sometimes hilarious, and often grieving work of unlearning who I thought I had to be, and figuring out how to human on my own terms.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-6 w-full max-w-[260px] mx-auto md:mx-0">
            <div className="w-full">
              <div className="relative w-full aspect-square border border-border-rule bg-bg-primary/40 p-2 shadow-sm rounded-lg overflow-hidden group">
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <Image 
                    src="/ollie-profile-v2.jpg" 
                    alt="Ollie, mid-30s, looking slightly off-camera" 
                    fill 
                    sizes="260px"
                    priority
                    className="object-cover filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
              <div className="mt-3 text-center md:text-left">
                <span className="text-xs md:text-sm font-mono text-muted tracking-widest uppercase">
                  Ollie · Founder of neurodivers³
                </span>
              </div>
            </div>

            {/* Quiet, understated sidebar card */}
            <div className="w-full border-t border-border-rule pt-6 mt-2 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
                What I'm building here
              </h4>
              <ul className="space-y-3 text-xs md:text-sm text-muted font-sans leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-accent select-none mt-0.5">•</span>
                  <span>Stories for the things we didn't have words for</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent select-none mt-0.5">•</span>
                  <span>Tools that don't punish restarting</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent select-none mt-0.5">•</span>
                  <span>Small experiments for calmer digital life</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Section 3: The messy middle */}
        <motion.section variants={itemVariants} className="mb-24 bg-bg-primary/40 border border-border-rule p-8 md:p-12 shadow-[4px_4px_0px_var(--rule)] rounded-lg">
          <div className="max-w-3xl">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">
              The messy middle
            </h3>
            <p className="text-lg text-fg/90 mb-8 font-sans">
              <strong className="text-accent font-semibold">neurodivers³</strong> is for the part no one ever puts in the neat before-and-after story.
            </p>
            
            <ul className="space-y-4 mb-8 pl-2 font-mono text-sm md:text-base text-muted">
              {[
                "The abandoned planners.",
                "The unread messages.",
                "The sensory hangovers.",
                "The graveyard of browser tabs you swear is a system.",
                "The sudden grief of realising how long you spent blaming yourself."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-accent select-none mt-1.5">&#9642;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="space-y-4 text-[16px] md:text-[18px] leading-relaxed text-fg/90 font-sans border-t border-border-rule/50 pt-6">
              <p>
                Around here, we don't treat capacity as character. We don't pretend "just start" is useful advice when the starting line keeps moving. And we don't measure a brain's worth by how neatly it performs being fine.
              </p>
              <p className="font-semibold text-accent">
                If any of that lands, you're in the exact right place. None of it is a character flaw.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 4: The pattern underneath */}
        <motion.section variants={itemVariants} className="mb-24 py-12 border-y border-border-rule text-center max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl font-light leading-relaxed italic text-fg/90 font-sans">
            "Some things that look like contradictions from the outside are actually just the same brain showing up in different conditions."
          </p>
          <p className="mt-6 text-sm md:text-base font-mono text-muted uppercase tracking-[0.05em]">
            This is exactly why <span className="font-semibold text-accent font-sans normal-case">neurodivers³</span> is built around gentler systems, clearer language, and digital tools that are fully allowed to be restarted.
          </p>
        </motion.section>

        {/* Section 5: What that means in practice */}
        <motion.section variants={itemVariants} className="mb-24">
          <h3 className="text-lg font-mono tracking-widest text-accent uppercase mb-8 text-center md:text-left">
            What that means in practice
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-primary/40 border border-border-rule hover:border-accent/40 p-8 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[4px_4px_0px_var(--accent-soft)] transition-all duration-300 rounded-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-accent mb-6">
                  <Zap size={22} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-3">
                  Energy matters
                </h4>
                <p className="text-sm md:text-base text-muted font-sans leading-relaxed">
                  Capacity is biological, not moral. The tools need to work with the energy you actually have today, not the energy you wish you had.
                </p>
              </div>
            </div>
            
            <div className="bg-bg-primary/40 border border-border-rule hover:border-accent/40 p-8 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[4px_4px_0px_var(--accent-soft)] transition-all duration-300 rounded-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-accent mb-6">
                  <RotateCcw size={22} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-3">
                  Restarting counts
                </h4>
                <p className="text-sm md:text-base text-muted font-sans leading-relaxed">
                  Losing the thread is part of the design brief. Nothing here should punish you for coming back after a bad week, a busy month, or a total system collapse.
                </p>
              </div>
            </div>
            
            <div className="bg-bg-primary/40 border border-border-rule hover:border-accent/40 p-8 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[4px_4px_0px_var(--accent-soft)] transition-all duration-300 rounded-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-accent mb-6">
                  <VolumeX size={22} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-3">
                  Less noise helps
                </h4>
                <p className="text-sm md:text-base text-muted font-sans leading-relaxed">
                  High contrast, clear structure, low cognitive load, and sensory-aware design are not aesthetic extras. They are accessibility needs.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 6: What lives here */}
        <motion.section variants={itemVariants} className="mb-24">
          <h3 className="text-lg font-mono tracking-widest text-accent uppercase mb-8 text-center md:text-left">
            What lives here
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-bg-primary/40 border border-border-rule p-8 flex flex-col justify-between rounded-lg shadow-[4px_4px_0px_var(--rule)] hover:border-accent/40 transition-colors">
              <div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-3">Stories</h4>
                <p className="text-xs md:text-sm text-muted font-sans leading-relaxed mb-6">
                  Writing about masking, burnout, late diagnosis, grief, attention, sensory overwhelm, and the strange relief of finally having language for yourself.
                </p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:text-fg font-black">
                Read the stories <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-bg-primary/40 border border-border-rule p-8 flex flex-col justify-between rounded-lg shadow-[4px_4px_0px_var(--rule)] hover:border-accent/40 transition-colors">
              <div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-3">Tools &amp; templates</h4>
                <p className="text-xs md:text-sm text-muted font-sans leading-relaxed mb-6">
                  Notion systems, PDFs, checklists, and small digital supports built for low-spoon, restartable use.
                </p>
              </div>
              <Link href="/store" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:text-fg font-black">
                Browse tools &amp; templates <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-bg-primary/40 border border-border-rule p-8 flex flex-col justify-between rounded-lg shadow-[4px_4px_0px_var(--rule)] hover:border-accent/40 transition-colors">
              <div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-3">Labs</h4>
                <p className="text-xs md:text-sm text-muted font-sans leading-relaxed mb-6">
                  Free experiments in calm tech, sensory-friendly design, and tiny tools for moments when a full system is too much.
                </p>
              </div>
              <Link href="/labs" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:text-fg font-black">
                Explore the Labs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-bg-primary/40 border border-border-rule p-8 flex flex-col justify-between rounded-lg shadow-[4px_4px_0px_var(--rule)] hover:border-accent/40 transition-colors">
              <div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-3">Memoir</h4>
                <p className="text-xs md:text-sm text-muted font-sans leading-relaxed mb-6">
                  The longer story, written in public and in pieces.
                </p>
              </div>
              <Link href="/memoir" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:text-fg font-black">
                Visit the memoir page <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Section 7: The short version */}
        <motion.section variants={itemVariants} className="mb-24">
          <h3 className="text-lg font-mono tracking-widest text-accent uppercase mb-3 text-center md:text-left">
            The short version
          </h3>
          <p className="text-muted font-sans text-sm md:text-base mb-12 text-center md:text-left">
            The longer version lives in the memoir, but the shape of the timeline is this:
          </p>
          
          <div className="relative border-l border-border-rule ml-4 md:ml-6 space-y-12">
            {[
              {
                step: "1",
                title: "Before the language",
                desc: "Years of being \"weird Ollie\", trying harder, masking better, and assuming everyone else had somehow been given the instructions."
              },
              {
                step: "2",
                title: "The crash",
                desc: "The point where pushing through stopped working and survival started asking for more than just coping."
              },
              {
                step: "3",
                title: "The wrong labels",
                desc: "Years of trying to understand myself through clinical explanations that helped a bit, missed a lot, or didn't quite fit."
              },
              {
                step: "4",
                title: "The diagnosis",
                desc: "AuDHD gave me language. It didn't magically fix everything, but it entirely changed the map."
              },
              {
                step: "5",
                title: "The rebuild",
                desc: "Learning to design my environment around the brain I actually have, not the one I kept trying to perform."
              },
              {
                step: "6",
                title: "neurodivers³",
                desc: "Turning that messy, unfinished process into writing, tools, and experiments that might help someone else feel a little less alone."
              }
            ].map((item, index) => (
              <div key={index} className="relative pl-8 md:pl-10">
                <div className="absolute -left-3.5 top-1.5 w-7 h-7 rounded-full bg-bg-primary border border-border-rule hover:border-accent flex items-center justify-center text-xs font-mono font-black text-accent shadow-sm transition-colors">
                  {item.step}
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                  {item.title}
                </h4>
                <p className="text-sm md:text-base text-muted font-sans max-w-2xl leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 8: The memoir */}
        <motion.section variants={itemVariants} className="mb-24 p-8 bg-bg-primary/20 border border-border-rule rounded-lg max-w-3xl shadow-[4px_4px_0px_var(--rule)]">
          <p className="text-xs md:text-sm font-mono tracking-[0.2em] text-accent uppercase mb-4">THE MEMOIR</p>
          <div className="space-y-4 text-[16px] leading-relaxed text-fg/90 font-sans mb-8">
            <p>
              Some parts of the story simply need more room than an About page can give them.
            </p>
            <p>
              I'm writing the longer version as a serial memoir titled: <em className="text-accent font-medium font-serif not-italic">"I Thought I Was Just Bad at Being a Human."</em>
            </p>
            <p>
              It's about late diagnosis, masking, burnout, grief, family, mental health, relationships, recovery, and the incredibly strange work of looking back at a life with new language.
            </p>
            <p className="text-sm text-muted font-mono pt-2">
              This page is the doorway. The memoir is the long version.
            </p>
          </div>
          <Link href="/memoir" className="inline-flex items-center gap-2 px-5 py-3 border border-accent text-accent hover:bg-accent hover:text-bg-primary font-mono text-xs uppercase tracking-widest font-black transition-all">
            Visit the memoir page &rarr;
          </Link>
        </motion.section>

        {/* Section 9: Start here */}
        <motion.section variants={itemVariants} className="mb-12 border-t border-border-rule pt-16 max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8">
            Start here
          </h3>
          
          <div className="space-y-6 text-[16px] md:text-[18px] leading-relaxed text-fg/90 font-sans">
            <p>
              If you want to feel less alone: <Link href="/blog" className="text-accent underline font-medium">read a story</Link> and find the one that finally names something you've never had words for.
            </p>
            <p>
              If you want the longer story: <Link href="/memoir" className="text-accent underline font-medium">visit the memoir page</Link> to join the newsletter and receive release updates.
            </p>
            <p>
              If you want something practical: grab a free template, <Link href="/store" className="text-accent underline font-medium">browse the tools</Link>, or try something on a bad day rather than waiting for a perfect one.
            </p>
            <p>
              If you want a small free thing: <Link href="/labs" className="text-accent underline font-medium">explore the Labs</Link>.
            </p>
            
            <div className="pt-8 space-y-4 border-t border-border-rule/50 mt-12">
              <p className="font-semibold text-accent">
                There is no urgency here. No countdown timers. No toxic messaging telling you "you should be further along by now."
              </p>
              <p className="italic">
                It'll still be here when you're ready.
              </p>
              
              <div className="pt-4">
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-1">Warmly,</p>
                <p className="text-2xl font-black italic tracking-tighter text-fg">Ollie</p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
