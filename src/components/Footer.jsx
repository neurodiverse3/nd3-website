"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoPrimaryFlat } from './Logo';
import { client } from '../lib/strapi';
import { usePathname } from 'next/navigation';
import { 
  Mail, 
  BookOpen, 
  Feather, 
  Flame, 
  ShoppingBag, 
  User, 
  Shield, 
  FileText, 
  Eye, 
  Rss,
  Cpu
} from 'lucide-react';

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
    className={`shrink-0 group-hover:text-accent-pink transition-colors ${className}`}
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
    className={`shrink-0 group-hover:text-accent-pink transition-colors ${className}`}
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
    className={`shrink-0 group-hover:text-accent-pink transition-colors ${className}`}
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
    className={`shrink-0 group-hover:text-accent-pink transition-colors ${className}`}
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
    className={`shrink-0 group-hover:text-accent-pink transition-colors ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BRAIN_STATES = [
  { text: 'Burned out', path: '/blog?state=burned-out', rgb: '255, 46, 136' },
  { text: 'Hyperfocused', path: '/blog?state=hyperfocus', rgb: '0, 240, 255' },
  { text: 'Masking', path: '/blog?state=masking', rgb: '225, 80, 240' },
  { text: 'Spiralling', path: '/blog?state=spiraling', rgb: '255, 172, 28' },
  { text: 'On a roll', path: '/blog?state=on-a-roll', rgb: '45, 212, 191' }
];

export const Footer = () => {
  const pathname = usePathname();
  const [socialHandles, setSocialHandles] = useState({
    instagram: 'neurodivers3',
    tiktok: 'neurodivers3',
    facebook: 'neurodivers3',
    youtube: 'neurodivers3',
    twitter: 'neurodivers3',
    email: 'ollie@neurodivers3.co.uk'
  });

  if (pathname && pathname.endsWith('/embed')) {
    return null;
  }

  return (
    <footer className="relative bg-bg-primary border-t border-border-rule pb-16 md:pb-8 overflow-hidden">
      {/* Prominent Top Social Bar (hidden on the links page to prevent content duplication) */}
      {pathname !== '/links' && (
        <div className="w-full bg-bg-primary border-b border-border-rule z-10 py-6 px-6 select-none no-print">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <span className="text-sm md:text-base font-mono font-bold tracking-[0.2em] text-text-muted uppercase text-center md:text-left shrink-0">
              FOLLOW ME:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-[260px] md:max-w-none">
              <a 
                href={`https://x.com/${socialHandles.twitter}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 border-2 border-fg-primary bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)]"
                aria-label="Follow on X (formerly Twitter)"
              >
                <XIcon size={18} className="group-hover:text-inherit" />
              </a>
              <a 
                href={`https://instagram.com/${socialHandles.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 border-2 border-fg-primary bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)]"
                aria-label="Follow on Instagram"
              >
                <InstagramIcon size={18} className="group-hover:text-inherit" />
              </a>
              <a 
                href={`https://tiktok.com/@${socialHandles.tiktok}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 border-2 border-fg-primary bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)]"
                aria-label="Follow on TikTok"
              >
                <TikTokIcon size={18} className="group-hover:text-inherit" />
              </a>
              <a 
                href={`https://youtube.com/@${socialHandles.youtube}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 border-2 border-fg-primary bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)]"
                aria-label="Subscribe on YouTube"
              >
                <YoutubeIcon size={18} className="group-hover:text-inherit" />
              </a>
              <a 
                href={`https://facebook.com/${socialHandles.facebook}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 border-2 border-fg-primary bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)]"
                aria-label="Follow on Facebook"
              >
                <FacebookIcon size={18} className="group-hover:text-inherit" />
              </a>
              <a 
                href={`mailto:${socialHandles.email}`} 
                className="w-12 h-12 border-2 border-fg-primary bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)]"
                aria-label="Send Email"
              >
                <Mail size={18} className="group-hover:text-inherit" />
              </a>
              <a 
                href="/feed.xml" 
                target="_blank" 
                className="w-12 h-12 border-2 border-fg-primary bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)]"
                aria-label="Subscribe to RSS Feed"
              >
                <Rss size={18} className="group-hover:text-inherit" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main 5-Column Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-[minmax(180px,1.4fr)_repeat(4,minmax(120px,1fr))] gap-x-8 gap-y-10 lg:gap-y-12 mt-8 lg:mt-16 relative z-10 text-center lg:text-left justify-items-center lg:justify-items-start">
        {/* Column 1: Brand & Wordmark */}
        <div className="flex flex-col gap-4 justify-start items-center lg:items-start col-span-2 lg:col-span-1 text-center lg:text-left mb-4 lg:mb-0">
          <LogoPrimaryFlat className="text-fg-primary" />
          <p className="text-sm lg:text-base font-medium text-text-muted leading-relaxed max-w-[22ch]">
            Neurodivergent life, tools and stories.
          </p>
        </div>

        {/* Column 2: Pillars */}
        <div className="flex flex-col gap-2.5 col-span-1 items-center lg:items-start text-center lg:text-left">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-label,var(--accent))] mb-1 lg:mb-3">Pillars</h3>
          <ul className="flex flex-col gap-1.5 lg:gap-3 text-[14px] font-medium text-text-muted w-full items-center lg:items-start">
            <li>
              <Link href="/blog?pillar=unmasked-life" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Unmasked Life
              </Link>
            </li>
            <li>
              <Link href="/blog?pillar=digital-life" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Digital Life
              </Link>
            </li>
            <li>
              <Link href="/blog?pillar=tools-templates" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Tools & Templates
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Explore */}
        <div className="flex flex-col gap-2.5 col-span-1 items-center lg:items-start text-center lg:text-left">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-label,var(--accent))] mb-1 lg:mb-3">Explore</h3>
          <ul className="flex flex-col gap-1.5 lg:gap-3 text-[14px] font-medium text-text-muted w-full items-center lg:items-start">
            <li>
              <Link href="/blog" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/labs" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Labs
              </Link>
            </li>
            <li>
              <Link href="/store" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Store
              </Link>
            </li>
            <li>
              <Link href="/memoir" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Memoir
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Connect */}
        <div className="flex flex-col gap-2.5 col-span-1 items-center lg:items-start text-center lg:text-left">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-label,var(--accent))] mb-1 lg:mb-3">Connect</h3>
          <ul className="flex flex-col gap-1.5 lg:gap-3 text-[14px] font-medium text-text-muted w-full items-center lg:items-start">
            <li>
              <Link href="/about" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/links" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Links + socials
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Legal */}
        <div className="flex flex-col gap-2.5 col-span-1 items-center lg:items-start text-center lg:text-left">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-label,var(--accent))] mb-1 lg:mb-3">Legal</h3>
          <ul className="flex flex-col gap-1.5 lg:gap-3 text-[14px] font-medium text-text-muted w-full items-center lg:items-start">
            <li>
              <Link href="/privacy" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="block py-1.5 lg:py-0 hover:text-fg-primary transition-colors focus-ring">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Softer "Entry Point" Chips Section */}
      <div className="max-w-7xl mx-auto px-6 mt-10 pt-8 pb-6 border-t border-border-rule text-center relative z-10 no-print">
        <div className="flex flex-col items-center gap-6">
          <span className="text-xs md:text-sm font-mono font-bold tracking-[0.2em] text-text-muted uppercase">
            Start where your brain’s at:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BRAIN_STATES.map((state, idx) => (
              <Link
                key={idx}
                href={state.path}
                className="px-4 py-1.5 rounded-full text-[11px] md:text-xs font-bold font-mono uppercase tracking-wider border transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 focus-ring flex items-center justify-center min-h-[36px] md:min-h-0"
                style={{
                  backgroundColor: `rgba(${state.rgb}, 0.08)`,
                  borderColor: `rgba(${state.rgb}, 0.35)`,
                  color: `rgb(${state.rgb})`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `rgba(${state.rgb}, 0.18)`;
                  e.currentTarget.style.borderColor = `rgba(${state.rgb}, 0.65)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `rgba(${state.rgb}, 0.08)`;
                  e.currentTarget.style.borderColor = `rgba(${state.rgb}, 0.35)`;
                }}
              >
                {state.text}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar with copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-6 py-4 border-t border-border-rule flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 text-center select-none">
        <div className="text-[12px] font-bold tracking-[0.05em] text-text-muted w-full text-center">
          © 2026 neurodivers³ · All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
