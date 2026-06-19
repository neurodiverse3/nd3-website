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

const PILLARS = [
  { text: 'Neurodivergent Life', theme: 'unmasked', path: '/memoir' },
  { text: 'Tools & Templates', theme: 'tools', path: '/store' },
  { text: 'Honest Stories', theme: 'unmasked', path: '/blog' },
  { text: 'Digital Life', theme: 'digital', path: '/labs' },
  { text: 'Unmasked & Unfiltered', theme: 'unmasked', path: '/about' }
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

  // Fetch socials dynamically from CMS site settings.
  useEffect(() => {
    let active = true;
    client.fetch('*[_type == "siteSettings"][0].socials')
      .then(res => {
        if (res && active) {
          setSocialHandles(prev => ({
            instagram: res.instagram || prev.instagram,
            tiktok: res.tiktok || prev.tiktok,
            facebook: res.facebook || prev.facebook,
            youtube: res.youtube || prev.youtube,
            twitter: res.twitter || prev.twitter,
            email: res.email || prev.email,
          }));
        }
      })
      .catch(err => {
        console.warn('⚠️ [Footer] Failed to fetch socials from CMS, using default values:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  if (pathname && pathname.endsWith('/embed')) {
    return null;
  }

  return (
    <footer className="relative bg-bg-primary border-t border-border-rule pt-24 md:pt-28 pb-12 overflow-hidden">
      {/* Static Utility Badge Bar */}
      <div className="absolute top-0 left-0 w-full bg-bg-primary border-b border-border-rule z-10 py-3.5 px-6 flex flex-wrap items-center justify-center gap-3 select-none">
        {PILLARS.map((pillar, idx) => (
          <Link
            key={idx}
            href={pillar.path}
            className={`badge-pillar-link px-3.5 py-1 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider border badge-pillar-${pillar.theme} focus-ring`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-pillar-${pillar.theme}`} />
            {pillar.text}
          </Link>
        ))}
      </div>

      {/* Main 4-Column Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mt-8 relative z-10 text-left">
        {/* Column 1: Brand & Wordmark */}
        <div className="flex flex-col gap-5 justify-start items-start col-span-2 md:col-span-1">
          <LogoPrimaryFlat className="text-fg-primary" />
          <p className="text-[14px] font-light text-text-muted leading-relaxed max-w-[28ch]">
            Neurodivergent life, tools and stories.
          </p>
        </div>

        {/* Column 2: Read */}
        <div className="flex flex-col gap-4 col-span-1 items-start">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-label,var(--accent))]">Read</h3>
          <ul className="flex flex-col gap-3 text-[14px] font-medium text-text-muted w-full items-start">
            <li>
              <Link href="/blog" className="hover:text-fg-primary transition-colors focus-ring">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/memoir" className="hover:text-fg-primary transition-colors focus-ring">
                Memoir
              </Link>
            </li>
            <li>
              <Link href="/labs" className="hover:text-fg-primary transition-colors focus-ring">
                Labs
              </Link>
            </li>
            <li>
              <Link href="/store" className="hover:text-fg-primary transition-colors focus-ring">
                Store
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-fg-primary transition-colors focus-ring">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Pillars */}
        <div className="flex flex-col gap-4 col-span-1 items-start">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-label,var(--accent))]">Pillars</h3>
          <ul className="flex flex-col gap-3 text-[14px] font-medium text-text-muted w-full items-start">
            <li>
              <Link href="/blog?pillar=unmasked-life" className="hover:text-fg-primary transition-colors focus-ring">
                Unmasked Life
              </Link>
            </li>
            <li>
              <Link href="/blog?pillar=tiny-systems" className="hover:text-fg-primary transition-colors focus-ring">
                Tools & Templates
              </Link>
            </li>
            <li>
              <Link href="/blog?pillar=glitchwork" className="hover:text-fg-primary transition-colors focus-ring">
                Digital Life
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div className="flex flex-col gap-4 col-span-2 md:col-span-1 items-start">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-label,var(--accent))]">Legal</h3>
          <ul className="grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-3 text-[14px] font-medium text-text-muted w-full items-start">
            <li>
              <Link href="/privacy" className="hover:text-fg-primary transition-colors focus-ring">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-fg-primary transition-colors focus-ring">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-fg-primary transition-colors focus-ring">
                Accessibility
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-fg-primary transition-colors focus-ring">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar with copyright & reactive social buttons */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-border-rule flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="text-[14px] font-bold tracking-[0.05em] text-text-muted uppercase select-none">
          © 2026 NEURODIVERS³
        </div>
        
        {/* Sleek, neobrutalist theme-reactive social icon buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a 
            href={`https://x.com/${socialHandles.twitter}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 border border-border-rule hover:border-fg-primary bg-bg-primary hover:bg-accent text-text-muted hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group"
            aria-label="X / Twitter"
          >
            <XIcon size={16} className="group-hover:text-inherit" />
          </a>
          <a 
            href={`https://instagram.com/${socialHandles.instagram}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 border border-border-rule hover:border-fg-primary bg-bg-primary hover:bg-accent text-text-muted hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group"
            aria-label="Instagram"
          >
            <InstagramIcon size={16} className="group-hover:text-inherit" />
          </a>
          <a 
            href={`https://tiktok.com/@${socialHandles.tiktok}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 border border-border-rule hover:border-fg-primary bg-bg-primary hover:bg-accent text-text-muted hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group"
            aria-label="TikTok"
          >
            <TikTokIcon size={16} className="group-hover:text-inherit" />
          </a>
          <a 
            href={`https://youtube.com/@${socialHandles.youtube}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 border border-border-rule hover:border-fg-primary bg-bg-primary hover:bg-accent text-text-muted hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group"
            aria-label="YouTube"
          >
            <YoutubeIcon size={16} className="group-hover:text-inherit" />
          </a>
          <a 
            href={`https://facebook.com/${socialHandles.facebook}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 border border-border-rule hover:border-fg-primary bg-bg-primary hover:bg-accent text-text-muted hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group"
            aria-label="Facebook"
          >
            <FacebookIcon size={16} className="group-hover:text-inherit" />
          </a>
          <a 
            href={`mailto:${socialHandles.email}`} 
            className="w-10 h-10 border border-border-rule hover:border-fg-primary bg-bg-primary hover:bg-accent text-text-muted hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group"
            aria-label="Email"
          >
            <Mail size={16} className="group-hover:text-inherit" />
          </a>
          <a 
            href="/feed.xml" 
            target="_blank" 
            className="w-10 h-10 border border-border-rule hover:border-fg-primary bg-bg-primary hover:bg-accent text-text-muted hover:text-[var(--accent-text,var(--bg))] flex items-center justify-center transition-all duration-200 focus-ring group"
            aria-label="RSS Feed"
          >
            <Rss size={16} className="group-hover:text-inherit" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
