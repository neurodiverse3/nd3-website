"use client";
import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '../app/actions/newsletter';

export default function MemoirNewsletter() {
  const [email, setEmail] = useState('');
  const [honey, setHoney] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'success', 'validation_error', 'server_error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (honey) {
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
    formData.append('source', 'memoir_page');

    try {
      const response = await subscribeNewsletter(null, formData);
      if (response.success) {
        setSubscribeStatus('success');
        setEmail('');
      } else {
        setSubscribeStatus('server_error');
        setErrorMessage(response.error || "Something glitched. Try again in a sec.");
      }
    } catch (err) {
      setSubscribeStatus('server_error');
      setErrorMessage("Something glitched. Try again in a sec.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-accent bg-black p-8 shadow-[6px_6px_0px_var(--accent-soft)] flex flex-col justify-between h-full select-none text-left">
      <div>
        {/* Eyebrow chip */}
        <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-accent bg-[var(--accent-soft)] px-3 py-1 uppercase border border-accent/30 mb-6 font-bold">
          EARLY DRAFTS
        </span>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-4 leading-none text-white font-display">
          READ CHAPTERS EARLY.
        </h2>

        {/* Sub */}
        <p className="text-base text-[#8A8A93] leading-relaxed mb-6 font-sans">
          The memoir is currently incubating in the workshop. Subscribe to the draft list to get early chapters sent straight to your inbox.
        </p>

        {subscribeStatus !== 'success' ? (
          <form onSubmit={handleNewsletterSubmit} className="space-y-4 text-left">
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

            <div className="flex flex-col gap-3">
              <label htmlFor="memoir-email" className="sr-only">Email address</label>
              <input
                id="memoir-email"
                type="email"
                required
                placeholder="your@email.com"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-black border border-[#1F1F22] focus:border-accent px-4 py-3 outline-none text-white text-sm font-bold shadow-[2px_2px_0px_#1F1F22] transition-all duration-200 rounded-none placeholder:text-[#5C6F84] font-mono focus-ring"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-accent text-[var(--accent-text,var(--bg))] font-black border border-white rounded-none shadow-[4px_4px_0px_#ffffff] hover:shadow-none hover:-translate-y-0.5 hover:translate-x-0.5 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Subscribe for Early Access"
                )}
              </button>
            </div>

            {/* Trust line */}
            <p className="text-xs text-[#8A8A93] leading-relaxed mt-4 font-sans">
              No tracking pixels. No sales funnels. Unsubscribe in one click.
            </p>

            {subscribeStatus === 'validation_error' && (
              <p className="text-accent text-xs font-black tracking-wider uppercase mt-2">
                ⚠️ {errorMessage}
              </p>
            )}
            {subscribeStatus === 'server_error' && (
              <p className="text-accent text-xs font-black tracking-wider uppercase mt-2">
                ⚠️ {errorMessage}
              </p>
            )}
          </form>
        ) : (
          <div className="p-6 border border-accent bg-[var(--accent-soft)] text-center animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 size={32} className="text-accent mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase text-white mb-1">Unmasked.</h3>
            <p className="text-sm text-[#8A8A93] leading-relaxed font-sans">
              You are on the draft list. Check your inbox for the welcome email soon.
            </p>
          </div>
        )}
      </div>

      {/* Status chip */}
      <div className="mt-8 pt-6 border-t border-[#1F1F22] text-[10px] text-[#8A8A93] font-mono uppercase tracking-widest font-bold">
        STATUS: ACTIVE INCUBATION
      </div>
    </div>
  );
}
