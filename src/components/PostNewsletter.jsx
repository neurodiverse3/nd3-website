"use client";
import React, { useState } from 'react';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import { subscribeNewsletter } from '../app/actions/newsletter';

export function PostNewsletter() {
  const [email, setEmail] = useState('');
  const [honey, setHoney] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot — silent success for bots
    if (honey) {
      setStatus('success');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage("That doesn't look like an email — got an address?");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('source', 'blog_post_cta');

    try {
      const res = await subscribeNewsletter(null, formData);
      if (res.success) {
        setStatus('success');
        setEmail('');
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
      className="my-16 border-2 border-fg-primary p-8 md:p-10 bg-bg-primary relative shadow-[6px_6px_0px_var(--accent)] hover:shadow-[8px_8px_0px_var(--accent)] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all duration-300"
      aria-label="Subscribe to the newsletter"
    >
      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

      <div className="relative z-10">
        <span className="inline-block text-[10px] font-mono tracking-[0.25em] text-[var(--link,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-4 select-none animate-pulse-slow">
          NEWSLETTER
        </span>

        <div className="flex flex-col md:flex-row md:items-end gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-fg-primary mb-2 leading-tight">
              Enjoyed this? Get the next one by email.
            </h2>
            <p className="text-sm text-text-muted font-normal leading-relaxed">
              One honest email when there's something worth saying. No schedule, no funnel, no "hey friend".
            </p>
          </div>

          <div className="flex-1 min-w-0">
            {status !== 'success' ? (
              <form onSubmit={handleSubmit} className="space-y-3" aria-live="polite">
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

                <div className="flex gap-3">
                  <label htmlFor="post-newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="post-newsletter-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 h-11 min-w-0 bg-bg-primary border-2 border-fg-primary focus:border-accent focus:ring-2 focus:ring-accent/20 px-4 outline-none text-fg-primary text-sm font-bold shadow-[2px_2px_0px_var(--rule)] transition-all duration-200 rounded-none placeholder:text-text-muted"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-5 bg-accent text-[var(--accent-text,var(--bg))] font-black border-2 border-fg-primary rounded-none shadow-[3px_3px_0px_var(--fg)] hover:shadow-[1px_1px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all cursor-pointer disabled:opacity-50 text-xs uppercase tracking-widest whitespace-nowrap"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Subscribe →'}
                  </button>
                </div>

                {status === 'error' && (
                  <p className="text-accent text-xs font-black tracking-wider uppercase">
                    ⚠️ {errorMessage}
                  </p>
                )}
              </form>
            ) : (
              <div className="flex items-start gap-3 p-4 border border-accent bg-[var(--accent-soft)] animate-in fade-in duration-300">
                <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-fg-primary">You're in.</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Look out for subject line:{' '}
                    <span className="text-accent italic font-semibold">"yes that was me"</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
