"use client";
import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '../app/actions/newsletter';

export default function MemoirNewsletter({ variant = 'sidebar' }) {
  const [firstName, setFirstName] = useState('');
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
      setErrorMessage("That doesn't look like an email - try again?");
      return;
    }

    setIsSubmitting(true);
    setSubscribeStatus(null);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('email', email);
    formData.append('source', variant === 'horizontal' ? 'memoir_page_bottom' : 'memoir_page_sidebar');

    try {
      const response = await subscribeNewsletter(null, formData);
      if (response.success) {
        setSubscribeStatus('success');
        setEmail('');
        setFirstName('');
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

  const isHorizontal = variant === 'horizontal';

  if (isHorizontal) {
    return (
      <div className="border border-accent bg-black p-8 md:p-10 shadow-[6px_6px_0px_var(--accent-soft)] text-left w-full select-none mt-12 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            {/* Eyebrow chip */}
            <span className="inline-block text-xs md:text-sm font-mono tracking-[0.25em] text-accent bg-[var(--accent-soft)] px-3 py-1 uppercase border border-accent/30 mb-4 font-bold">
              MEMOIR UPDATES
            </span>

            {/* Headline */}
            <h2 className="text-2xl md:text-3xl font-black tracking-tight md:tracking-tighter uppercase mb-4 leading-none text-white font-display">
              HEAR ABOUT IT FIRST.
            </h2>

            {/* Sub */}
            <p className="text-base text-text-muted leading-relaxed font-sans max-w-xl">
              The memoir is not ready yet. But if you want to know when the first pieces arrive, join the newsletter and I’ll send them there first.
            </p>
          </div>

          <div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="memoir-firstname-horiz" className="sr-only">First name (optional)</label>
                      <input
                        id="memoir-firstname-horiz"
                        type="text"
                        placeholder="First name (optional)"
                        disabled={isSubmitting}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-12 bg-black border border-white/20 focus:border-accent px-4 py-3 outline-none text-white text-sm font-bold shadow-[2px_2px_0px_#1F1F22] transition-all duration-200 rounded-none placeholder:text-[#5C6F84] font-mono focus-ring"
                      />
                    </div>
                    <div>
                      <label htmlFor="memoir-email-horiz" className="sr-only">Email address</label>
                      <input
                        id="memoir-email-horiz"
                        type="email"
                        required
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 bg-black border border-white/20 focus:border-accent px-4 py-3 outline-none text-white text-sm font-bold shadow-[2px_2px_0px_#1F1F22] transition-all duration-200 rounded-none placeholder:text-[#5C6F84] font-mono focus-ring"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5 text-left mt-1">
                    <input
                      id="memoir-newsletter-consent-horiz"
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 shrink-0 rounded-none border border-white/20 bg-black text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                    <label htmlFor="memoir-newsletter-consent-horiz" className="text-xs md:text-sm text-text-muted select-none cursor-pointer leading-relaxed font-sans">
                      I’m happy to receive neurodivers³ emails about the memoir, new writing, and related updates.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-accent text-[var(--accent-text,var(--bg))] font-black border border-white rounded-none shadow-[4px_4px_0px_#ffffff] hover:shadow-none hover:-translate-y-0.5 hover:translate-x-0.5 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-2"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "GET MEMOIR UPDATES"
                    )}
                  </button>
                </div>

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
                <h3 className="text-lg font-black uppercase text-white mb-1">You’re in.</h3>
                <p className="text-sm text-text-muted leading-relaxed font-sans">
                  The welcome email is on its way. If it does not appear soon, check spam or promotions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default sidebar layout
  return (
    <div className="border border-accent bg-black p-8 shadow-[6px_6px_0px_var(--accent-soft)] flex flex-col justify-between h-full select-none text-left">
      <div>
        {/* Eyebrow chip */}
        <span className="inline-block text-xs md:text-sm font-mono tracking-[0.25em] text-accent bg-[var(--accent-soft)] px-3 py-1 uppercase border border-accent/30 mb-6 font-bold">
          MEMOIR UPDATES
        </span>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-black tracking-tight md:tracking-tighter uppercase mb-4 leading-none text-white font-display">
          HEAR ABOUT IT FIRST.
        </h2>

        {/* Sub */}
        <p className="text-base text-text-muted leading-relaxed mb-6 font-sans">
          The memoir is still in planning. Join the newsletter to get first notes, release updates, and early fragments when they’re ready.
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
              <label htmlFor="memoir-firstname" className="sr-only">First name (optional)</label>
              <input
                id="memoir-firstname"
                type="text"
                placeholder="First name (optional)"
                disabled={isSubmitting}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-12 bg-black border border-white/20 focus:border-accent px-4 py-3 outline-none text-white text-sm font-bold shadow-[2px_2px_0px_#1F1F22] transition-all duration-200 rounded-none placeholder:text-[#5C6F84] font-mono focus-ring"
              />
              <label htmlFor="memoir-email" className="sr-only">Email address</label>
              <input
                id="memoir-email"
                type="email"
                required
                placeholder="your@email.com"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-black border border-white/20 focus:border-accent px-4 py-3 outline-none text-white text-sm font-bold shadow-[2px_2px_0px_#1F1F22] transition-all duration-200 rounded-none placeholder:text-[#5C6F84] font-mono focus-ring"
              />
              
              <div className="flex items-start gap-2.5 text-left mt-1">
                <input
                  id="memoir-newsletter-consent"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded-none border border-white/20 bg-black text-accent focus:ring-accent accent-accent cursor-pointer"
                />
                <label htmlFor="memoir-newsletter-consent" className="text-xs md:text-sm text-text-muted select-none cursor-pointer leading-relaxed font-sans">
                  I’m happy to receive neurodivers³ emails about the memoir, new writing, and related updates.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-accent text-[var(--accent-text,var(--bg))] font-black border border-white rounded-none shadow-[4px_4px_0px_#ffffff] hover:shadow-none hover:-translate-y-0.5 hover:translate-x-0.5 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-2"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "GET MEMOIR UPDATES"
                )}
              </button>
            </div>

            {/* Trust line */}
            <p className="text-xs text-text-muted leading-relaxed mt-4 font-sans">
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
            <h3 className="text-lg font-black uppercase text-white mb-1">You’re in.</h3>
            <p className="text-sm text-text-muted leading-relaxed font-sans">
              The welcome email is on its way. If it does not appear soon, check spam or promotions.
            </p>
          </div>
        )}
      </div>

      {/* Status chip */}
      <div className="mt-8 pt-6 border-t border-[#1F1F22] text-xs md:text-sm text-text-muted font-mono uppercase tracking-widest font-bold">
        STATUS: BEING WRITTEN SLOWLY
      </div>
    </div>
  );
}

