import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

export const metadata = {
  title: 'Contact - neurodivers³',
  description: 'Get in touch with Ollie - founder of neurodivers3. Collaboration, press, or just saying hi.',
  alternates: {
    canonical: 'https://neurodivers3.co.uk/contact',
  },
  openGraph: {
    title: 'Contact - neurodivers³',
    description: 'Get in touch with Ollie - founder of neurodivers3. Collaboration, press, or just saying hi.',
  },
  twitter: {
    title: 'Contact - neurodivers³',
    description: 'Get in touch with Ollie - founder of neurodivers3. Collaboration, press, or just saying hi.',
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
      ariaLabel: 'Send email to Ollie at ollie@neurodivers3.co.uk',
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
      ariaLabel: "Visit Ollie's Instagram profile @neurodivers3",
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      value: '@neurodivers3',
      href: 'https://tiktok.com/@neurodivers3',
      icon: <TikTokIcon size={18} />,
      note: 'Short-form video. Brain states in real time.',
      ariaLabel: "Visit Ollie's TikTok profile @neurodivers3",
    },
    {
      id: 'x',
      label: 'X / Twitter',
      value: '@neurodivers3',
      href: 'https://x.com/neurodivers3',
      icon: <XIcon size={16} />,
      note: 'Microblog thoughts and link drops.',
      ariaLabel: "Visit Ollie's X profile @neurodivers3",
    },
    {
      id: 'facebook',
      label: 'Facebook',
      value: '@neurodivers3',
      href: 'https://facebook.com/neurodivers3',
      icon: (
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
      note: 'Community updates and platform resources.',
      ariaLabel: "Visit Ollie's Facebook page @neurodivers3",
    },
  ];

  const faqs = [
    {
      q: 'Can I pitch a collaboration or sponsored post?',
      a: "I'm happy to hear from people, guests, collab invites, etc.",
    },
    {
      q: 'Can I share or quote your writing?',
      a: 'Absolutely. You are welcome to quote excerpts with clear attribution and a link back to neurodivers3.co.uk. For syndication or republishing full essays, please email us first to discuss.',
    },
    {
      q: 'I\'m a journalist / researcher. Can I interview you?',
      a: 'Yes. I am happy to speak on late-diagnosed AuDHD lived experience, unmasked digital design, and building calmer digital spaces. Please email with your publication details, deadline, and specific questions.',
    },
    {
      q: 'How long do replies take?',
      a: 'Variable. This is a slow-launch project run by a single brain. I protect my focus and recovery time, which means email replies can take up to a week. If you have a file delivery emergency or a time-sensitive press query, please mark the subject line clearly and I will do my best to triage it sooner.',
    },
  ];

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto">
      <PageHeader
        variant="section"
        eyebrow="Get In Touch"
        titleLabel="Contact"
        titleAccent="Say Hello"
        subtitle="One inbox, one person, slow but reliable replies."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact channels */}
        <div
          style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.1s forwards' }}
        >
          <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-text-muted block mb-8">
            WHERE TO FIND ME
          </span>

          <div className="flex flex-col gap-4">
            {channels.map((ch, idx) => (
              <a
                key={ch.id}
                href={ch.href}
                target={ch.id !== 'email' ? '_blank' : undefined}
                rel={ch.id !== 'email' ? 'noopener noreferrer' : undefined}
                aria-label={ch.ariaLabel}
                className="group border-2 border-border-rule hover:border-fg-primary p-6 flex items-start gap-5 bg-bg-primary/40 hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all duration-200 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--fg)] cursor-pointer rounded-none text-left"
                style={{ opacity: 0, animation: `fadeInUp 0.5s ease ${0.15 + idx * 0.08}s forwards` }}
              >
                <div className="w-10 h-10 border-2 border-border-rule group-hover:border-accent-pink bg-bg-primary flex items-center justify-center shrink-0 text-text-muted group-hover:text-accent-pink transition-all">
                  {ch.icon}
                </div>
                  <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest text-text-muted">
                      {ch.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-text-muted group-hover:text-accent-pink shrink-0 arrow-hover"
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
          <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-text-muted block mb-8">
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
            <span className="text-xs md:text-sm font-black uppercase tracking-widest text-accent-pink block mb-2">
              NEWSLETTER
            </span>
            <p className="text-sm text-text-muted font-normal leading-relaxed mb-4">
              For updates, new writing, and first fragments of the memoir · the newsletter is the best place to be.
            </p>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-accent-pink hover:opacity-80 transition-opacity"
            >
              Subscribe → <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
