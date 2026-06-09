import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Instagram } from 'lucide-react';

export const metadata = {
  title: 'Contact · neurodivers³',
  description: 'Get in touch with Ollie — founder of neurodivers³. Collaboration, press, or just saying hi.',
  openGraph: {
    title: 'Contact · neurodivers³',
    description: 'Get in touch with Ollie — founder of neurodivers³. Collaboration, press, or just saying hi.',
  },
  twitter: {
    title: 'Contact · neurodivers³',
    description: 'Get in touch with Ollie — founder of neurodivers³. Collaboration, press, or just saying hi.',
  }
};

const XIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.41-.47-.59-.73v7.02c0 3.74-2.07 6.97-5.46 8.22-3.39 1.25-7.39.4-9.87-2.12-2.48-2.52-3.13-6.52-1.61-9.76 1.52-3.24 5.05-5.18 8.62-4.77v4.07c-2-.31-4.04.57-5.01 2.37-.97 1.8-.6 4.09.91 5.46 1.52 1.37 3.86 1.34 5.35-.07.97-.96 1.44-2.34 1.37-3.7V0h.03z"/>
  </svg>
);

export default function ContactPage() {
  const channels = [
    {
      id: 'email',
      label: 'Email',
      value: 'ollie@neurodivers3.co.uk',
      href: 'mailto:ollie@neurodivers3.co.uk',
      icon: <Mail size={18} className="shrink-0" />,
      note: 'Best for collabs, press, and thoughtful questions.',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      value: '@neurodivers3',
      href: 'https://instagram.com/neurodivers3',
      icon: (
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
      note: 'Photos, reels, day-to-day unmasking.',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      value: '@neurodivers3',
      href: 'https://tiktok.com/@neurodivers3',
      icon: <TikTokIcon size={18} />,
      note: 'Short-form video. Brain states in real time.',
    },
    {
      id: 'x',
      label: 'X / Twitter',
      value: '@neurodivers3',
      href: 'https://x.com/neurodivers3',
      icon: <XIcon size={16} />,
      note: 'Microblog thoughts and link drops.',
    },
  ];

  const faqs = [
    {
      q: 'Can I pitch a collaboration or sponsored post?',
      a: 'Yes — email is the best route. Be upfront about what you\'re proposing. I only partner with things I\'d genuinely use.',
    },
    {
      q: 'Can I share or quote your writing?',
      a: 'Yes, with attribution and a link back. For anything beyond excerpts, drop an email first.',
    },
    {
      q: 'I\'m a journalist / researcher. Can I interview you?',
      a: 'Probably yes. Email me with your publication and topic. AuDHD diagnosis journeys, neurodivergent productivity, and digital accessibility are all fair game.',
    },
    {
      q: 'How long do replies take?',
      a: 'Honest answer: variable. Executive function is real. I aim for within a week on emails, sooner if it\'s urgent — just say so.',
    },
  ];

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className="mb-16 border-b-4 border-fg-primary pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left w-full mt-4"
        style={{ opacity: 0, animation: 'fadeInUp 0.6s ease forwards' }}
      >
        <div>
          <div className="inline-block text-[11px] font-mono tracking-[0.25em] text-accent-pink bg-accent-pink-soft px-3 py-1 uppercase border border-border-rule mb-8 select-none">
            GET IN TOUCH
          </div>
          <h1 className="text-5xl md:text-8xl font-black mt-4 uppercase tracking-tighter text-fg-primary leading-none">
            CONTACT · <span className="italic font-light text-accent-pink">ME</span><span className="text-accent-pink inline-block ml-0.5">.</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl font-normal mt-4 max-w-2xl leading-relaxed">
            Collaborations, press enquiries, accessibility feedback, or just a "this piece helped me" — 
            all of it is welcome. Pick the channel that feels least overwhelming.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact channels */}
        <div
          style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.1s forwards' }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted block mb-8">
            WHERE TO FIND ME
          </span>

          <div className="flex flex-col gap-4">
            {channels.map((ch, idx) => (
              <a
                key={ch.id}
                href={ch.href}
                target={ch.id !== 'email' ? '_blank' : undefined}
                rel={ch.id !== 'email' ? 'noopener noreferrer' : undefined}
                className="group border-2 border-border-rule hover:border-fg-primary p-6 flex items-start gap-5 bg-bg-primary/40 hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all duration-200 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--fg)] cursor-pointer rounded-none text-left"
                style={{ opacity: 0, animation: `fadeInUp 0.5s ease ${0.15 + idx * 0.08}s forwards` }}
              >
                <div className="w-10 h-10 border-2 border-border-rule group-hover:border-accent-pink bg-bg-primary flex items-center justify-center shrink-0 text-text-muted group-hover:text-accent-pink transition-all">
                  {ch.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">
                      {ch.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-text-muted group-hover:text-accent-pink group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </div>
                  <p className="text-lg font-black text-fg-primary group-hover:text-accent-pink transition-colors mt-0.5">
                    {ch.value}
                  </p>
                  <p className="text-xs text-text-muted mt-1 font-normal leading-relaxed">
                    {ch.note}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div
          style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.2s forwards' }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted block mb-8">
            COMMON QUESTIONS
          </span>

          <div className="flex flex-col gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border-l-2 border-accent-pink pl-6 py-1"
                style={{ opacity: 0, animation: `fadeInUp 0.5s ease ${0.25 + idx * 0.1}s forwards` }}
              >
                <h3 className="text-sm font-black uppercase tracking-tight text-fg-primary mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-text-muted font-normal leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Newsletter nudge */}
          <div
            className="mt-12 p-6 border-2 border-border-rule bg-bg-primary/40 shadow-[4px_4px_0px_var(--rule)]"
            style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.6s forwards' }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-pink block mb-2">
              NEWSLETTER
            </span>
            <p className="text-sm text-text-muted font-normal leading-relaxed mb-4">
              For updates, new writing, and early access to memoir chapters — the newsletter is the best place to be.
            </p>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-accent-pink hover:opacity-80 transition-opacity"
            >
              Subscribe → <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
