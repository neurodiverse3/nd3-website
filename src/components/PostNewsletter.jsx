"use client";
import React, { useState } from 'react';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import { subscribeNewsletter } from '../app/actions/newsletter';

export function PostNewsletter() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [honey, setHoney] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot - silent success for bots
    if (honey) {
      setStatus('success');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage("That doesn't look like an email - got an address?");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('email', email);
    formData.append('source', 'blog_post_cta');

    try {
      const res = await subscribeNewsletter(null, formData);
      if (res.success) {
        setStatus('success');
        setEmail('');
        setFirstName('');
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Something glitched. Try again in a sec?');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something glitched. Try again in a sec?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      className="my-16 border-2 border-border-rule hover:border-fg-primary p-8 md:p-12 bg-bg-primary/35 relative shadow-[6px_6px_0px_var(--rule)] hover:shadow-[8px_8px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all duration-300 rounded-none w-full text-center"
      aria-label="Subscribe to the newsletter"
    >
      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

      <div className="max-w-[560px] mx-auto text-center relative z-10 flex flex-col items-center">
        <span className="inline-block text-xs md:text-sm font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-6 select-none">
          Newsletter
        </span>

        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-fg-primary mb-4 leading-none font-display">
          GET IT BY EMAIL<span className="text-accent inline-block ml-0.5">.</span>
        </h2>
        
        <p className="text-base md:text-lg text-text-muted leading-relaxed font-normal mb-6 max-w-[480px]">
          New writing, tools, templates, and site updates, sent straight to your inbox.
        </p>

        <div className="w-full">
          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="space-y-4 w-full" aria-live="polite">
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                value={honey}
                onChange={e => setHoney(e.target.value)}
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
              />

              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1 relative">
                    <label htmlFor="post-newsletter-firstname" className="sr-only">
                      First name (optional)
                    </label>
                    <input
                      id="post-newsletter-firstname"
                      type="text"
                      placeholder="First name (optional)"
                      disabled={isSubmitting}
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full h-12 bg-bg-primary border-2 border-fg-primary focus:border-accent px-4 outline-none text-fg-primary text-sm font-bold shadow-[2px_2px_0px_var(--rule)] transition-all duration-150 rounded-none placeholder:text-text-muted/60"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <label htmlFor="post-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="post-newsletter-email"
                      type="email"
                      required
                      placeholder="Email address"
                      disabled={isSubmitting}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full h-12 bg-bg-primary border-2 border-fg-primary focus:border-accent px-4 outline-none text-fg-primary text-sm font-bold shadow-[2px_2px_0px_var(--rule)] transition-all duration-150 rounded-none placeholder:text-text-muted/60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-6 bg-accent text-[var(--accent-text,var(--bg))] hover:bg-accent/90 font-black border-2 border-fg-primary rounded-none shadow-[3px_3px_0px_var(--fg)] hover:shadow-[2px_2px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all cursor-pointer disabled:opacity-50 text-xs uppercase tracking-widest whitespace-nowrap shrink-0"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Subscribe →'}
                  </button>
                </div>

                <div className="flex items-start gap-2.5 text-left justify-center max-w-[480px] mx-auto">
                  <input
                    id="post-newsletter-consent"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 rounded-none border-2 border-fg-primary bg-bg-primary text-accent focus:ring-accent accent-accent cursor-pointer"
                  />
                  <label htmlFor="post-newsletter-consent" className="text-xs text-text-muted select-none cursor-pointer leading-tight">
                    I’m happy to subscribe to neurodivers³ and receive updates.
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <p className="text-xs md:text-sm text-text-muted leading-relaxed font-normal">
                  Get early access to new tools, templates, and writing before they land on the site.
                </p>
                <p className="text-xs text-text-muted leading-relaxed font-mono uppercase font-bold tracking-wider">
                  No spam. Unsubscribe in one click.
                </p>
              </div>

              {status === 'error' && (
                <p className="text-accent text-xs font-black tracking-wider uppercase mt-2">
                  ⚠️ {errorMessage}
                </p>
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center p-6 border border-accent bg-[var(--accent-soft)] animate-in fade-in duration-300 w-full">
              <CheckCircle2 size={32} className="text-accent mb-3 shrink-0" />
              <div>
                <p className="text-sm font-black text-fg-primary uppercase">You’re in.</p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  The welcome email is on its way. If it does not appear soon, check spam or promotions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
