"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass } from 'lucide-react';

// Custom brand-perfect SVG icon for Facebook
const FacebookIcon = ({ size = 14, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`shrink-0 transition-colors ${className}`}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// Custom brand-perfect SVG icon for TikTok
const TikTokIcon = ({ size = 14, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor"
    className={`shrink-0 transition-colors ${className}`}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.41-.47-.59-.73v7.02c0 3.74-2.07 6.97-5.46 8.22-3.39 1.25-7.39.4-9.87-2.12-2.48-2.52-3.13-6.52-1.61-9.76 1.52-3.24 5.05-5.18 8.62-4.77v4.07c-2-.31-4.04.57-5.01 2.37-.97 1.8-.6 4.09.91 5.46 1.52 1.37 3.86 1.34 5.35-.07.97-.96 1.44-2.34 1.37-3.7V0h.03z"/>
  </svg>
);

// Custom brand-perfect SVG icon for Instagram
const InstagramIcon = ({ size = 14, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`shrink-0 transition-colors ${className}`}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Custom brand-perfect SVG icon for YouTube
const YoutubeIcon = ({ size = 14, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`shrink-0 transition-colors ${className}`}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

// Custom brand-perfect SVG icon for X / Twitter
const XIcon = ({ size = 14, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor"
    className={`shrink-0 transition-colors ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function AuthorCard({ author = {}, socials = {} }) {
  const name = "Ollie";
  const photoUrl = "/ollie-profile-v2.jpg"; // Premium local asset

  // Social handles - single source of truth, mirrors the homepage.
  const instagram = socials.instagram || "neurodivers3";
  const tiktok    = socials.tiktok    || "neurodivers3";
  const youtube   = socials.youtube   || "neurodivers3";
  const facebook  = socials.facebook  || "neurodivers3";
  const twitter   = socials.twitter   || "neurodivers3";

  return (
    <div className="w-full sidebar-card p-6 md:p-8 relative text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
        {/* Round Avatar Container */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 border-2 border-accent-pink select-none overflow-hidden bg-zinc-900 rounded-full mx-auto sm:mx-0">
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 64px, 80px"
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
            unoptimized
          />
        </div>

        {/* Content Area */}
        <div className="flex-grow space-y-3 flex flex-col items-center sm:items-start">
          <div>
            <h3 className="text-sm md:text-base font-mono tracking-widest text-accent-pink uppercase font-black whitespace-nowrap">
              WRITTEN BY OLLIE
            </h3>
          </div>

          <div className="text-base text-text-muted leading-relaxed font-sans font-normal space-y-2">
            <p>I’m a late-diagnosed AuDHD adult and the person behind neurodivers³. I write about burnout, masking, attention, identity, and the everyday reality of living with a neurodivergent brain.</p>
          </div>

          {/* Social and Navigation Links Stack */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-border-rule/70 bg-bg-primary/40 text-xs md:text-sm font-black uppercase tracking-widest text-fg-primary hover:text-accent-pink hover:border-accent-pink transition-all duration-200 focus-ring"
            >
              <Compass size={11} className="text-accent-pink" /> ABOUT ME
            </Link>

            <div className="flex items-center gap-3">
              <a
                href={`https://tiktok.com/@${tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-border-rule/70 bg-bg-primary/40 text-fg-primary hover:text-accent-pink hover:border-accent-pink flex items-center justify-center transition-all duration-200 focus-ring"
                title="TikTok"
              >
                <TikTokIcon size={14} />
              </a>

              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-border-rule/70 bg-bg-primary/40 text-fg-primary hover:text-accent-pink hover:border-accent-pink flex items-center justify-center transition-all duration-200 focus-ring"
                title="Instagram"
              >
                <InstagramIcon size={14} />
              </a>

              <a
                href={`https://youtube.com/@${youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-border-rule/70 bg-bg-primary/40 text-fg-primary hover:text-accent-pink hover:border-accent-pink flex items-center justify-center transition-all duration-200 focus-ring"
                title="YouTube"
              >
                <YoutubeIcon size={14} />
              </a>

              <a
                href={`https://facebook.com/${facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-border-rule/70 bg-bg-primary/40 text-fg-primary hover:text-accent-pink hover:border-accent-pink flex items-center justify-center transition-all duration-200 focus-ring"
                title="Facebook"
              >
                <FacebookIcon size={14} />
              </a>

              <a
                href={`https://x.com/${twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-border-rule/70 bg-bg-primary/40 text-fg-primary hover:text-accent-pink hover:border-accent-pink flex items-center justify-center transition-all duration-200 focus-ring"
                title="X (Twitter)"
              >
                <XIcon size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
