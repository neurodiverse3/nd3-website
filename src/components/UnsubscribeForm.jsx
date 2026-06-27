"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  UserMinus,
} from "lucide-react";
import { unsubscribeNewsletter } from "../app/actions/newsletter";
import Link from "next/link";

export function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    setErrorMessage("");

    try {
      const res = await unsubscribeNewsletter(email);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] border-2 border-border-rule p-8 md:p-12 bg-bg-primary/35 relative shadow-[6px_6px_0px_var(--rule)] rounded-none text-center">
      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <span className="inline-block text-xs font-mono tracking-[0.25em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-3 py-1 uppercase border border-border-rule mb-6 select-none">
          Unsubscribe
        </span>

        {status === "success" ? (
          <div className="space-y-6 w-full py-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-[var(--accent)]" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-fg-primary leading-none font-display">
              YOU'RE UNSUBSCRIBED<span className="text-accent">.</span>
            </h2>
            <p className="text-base text-text-muted leading-relaxed font-normal">
              We've removed{" "}
              <span className="text-fg-primary font-semibold">{email}</span>{" "}
              from our newsletter. You won't receive any more writing, tools, or
              updates from us.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-[var(--accent-btn-text)] font-bold tracking-tight transition-colors duration-200 flex items-center justify-center gap-2 select-none w-full border border-transparent"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-3xl font-black uppercase tracking-tight text-fg-primary mb-4 leading-none font-display">
              LEAVING US?
            </h2>
            <p className="text-base text-text-muted leading-relaxed font-normal mb-8">
              Confirm your email address below to unsubscribe from the
              neurodivers³ newsletter.
            </p>

            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <div className="relative">
                <label htmlFor="unsubscribe-email" className="sr-only">
                  Email Address
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted/60" />
                </div>
                <input
                  id="unsubscribe-email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-bg-primary/50 border border-border-rule focus:border-fg-primary focus:outline-none text-fg-primary placeholder-text-muted/50 rounded-none text-base transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>

              {status === "error" && (
                <div className="flex items-start gap-2 text-left bg-red-950/20 border border-red-500/30 p-4 text-sm text-red-400">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                  <div>{errorMessage}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-[var(--accent-btn-text)] font-bold tracking-tight transition-colors duration-200 flex items-center justify-center gap-2 select-none w-full disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserMinus className="h-5 w-5" />
                    Yes, Unsubscribe
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <Link
                href="/"
                className="text-sm text-text-muted hover:text-fg-primary underline transition-colors"
              >
                Never mind, take me home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
