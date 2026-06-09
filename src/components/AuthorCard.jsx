"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Compass, Send } from 'lucide-react';

export default function AuthorCard({ author = {}, socials = {} }) {
  // Central defaults if data is missing or empty
  const name = author.name || "Ollie Clews";
  const bio = author.bio || "AuDHD, late-diagnosed, still figuring it out in public. Designing tiny systems and sharing honest writings for brains that don't fit the standard manual.";
  const photoUrl = "/ollie.jpg"; // Premium local asset

  // Dynamic social link formatting
  const instagram = socials.instagram || "neurodivers3";
  const bluesky = socials.bluesky || "neurodivers3";

  return (
    <div className="w-full sidebar-card p-6 md:p-8 relative text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Round Avatar Container */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 border-2 border-accent-pink select-none overflow-hidden bg-zinc-900 rounded-full">
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
        <div className="flex-grow space-y-3">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-accent-pink uppercase block font-bold">
              TRANSMISSION SOURCE
            </span>
            <h4 className="text-xl font-black uppercase text-fg-primary tracking-tight font-display mt-0.5">
              Written by {name}
            </h4>
          </div>
          
          <p className="text-sm text-text-muted leading-relaxed font-sans font-light">
            {bio}
          </p>

          {/* Social and Navigation Links Stack */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-rule/70 bg-bg-primary/40 text-[10px] font-black uppercase tracking-widest text-fg-primary hover:text-accent-pink hover:border-accent-pink transition-all duration-200 focus-ring"
            >
              <Compass size={11} className="text-accent-pink" /> ABOUT OLLIE
            </Link>

            <Link
              href="#subscribe-block"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-rule/70 bg-bg-primary/40 text-[10px] font-black uppercase tracking-widest text-fg-primary hover:text-accent-pink hover:border-accent-pink transition-all duration-200 focus-ring"
            >
              <Send size={11} className="text-accent-pink" /> NEWSLETTER
            </Link>

            <a
              href={`https://bsky.app/profile/${bluesky}.bsky.social`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-rule/70 bg-bg-primary/40 text-[10px] font-black uppercase tracking-widest text-fg-primary hover:text-accent-pink hover:border-accent-pink transition-all duration-200 focus-ring"
            >
              BLUESKY
            </a>

            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-rule/70 bg-bg-primary/40 text-[10px] font-black uppercase tracking-widest text-fg-primary hover:text-accent-pink hover:border-accent-pink transition-all duration-200 focus-ring"
            >
              INSTAGRAM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
