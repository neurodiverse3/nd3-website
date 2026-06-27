"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

type Props = {
  coverImage: string;
  title: string;
  priceLabel: string;
  demoVideo?: string;
};

export default function ProductMediaShowcase({
  coverImage,
  title,
  priceLabel,
  demoVideo,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (demoVideo && isPlaying) {
    return (
      <div className="relative aspect-square w-full border-2 border-[var(--fg)] bg-[var(--bg)]">
        <video
          src={`/store/videos/${demoVideo}`}
          controls
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />

        {/* Top bar controls when video is playing */}
        <div className="absolute inset-x-3 top-3 flex justify-between pointer-events-none">
          <button
            onClick={() => setIsPlaying(false)}
            className="pointer-events-auto flex items-center gap-1.5 bg-[var(--surface)] border-2 border-[var(--fg)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--fg)] hover:text-[var(--accent)] transition-colors shadow-[2px_2px_0px_var(--fg)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0"
            title="Show static cover image"
          >
            <ImageIcon size={12} />
            <span>Show Cover</span>
          </button>

          <div className="bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-2 border-[var(--fg)] px-4 py-2 font-mono text-sm font-bold uppercase tracking-[0.18em]">
            {priceLabel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-square w-full border-2 border-[var(--fg)] bg-[var(--bg)] ${
        demoVideo ? "cursor-pointer group/media overflow-hidden" : ""
      }`}
      onClick={demoVideo ? () => setIsPlaying(true) : undefined}
    >
      <Image
        src={`/store/covers/${coverImage}`}
        alt={`${title} cover image`}
        fill
        sizes="(max-width: 920px) 100vw, 560px"
        className={`object-cover transition-transform duration-500 ${
          demoVideo ? "group-hover/media:scale-102" : ""
        }`}
      />

      {/* Module 5.1: Cover-up over the baked-in "Launch Special" button on the
          cover art. Real purchase happens via the live Checkout button below. */}
      {demoVideo && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none z-[2]"
          aria-hidden="true"
        />
      )}

      {/* Module 5.3: Sleek, minimalist SVG Play icon — pure triangle, no frame,
          scales up on hover, faint backdrop ensures contrast over any image. */}
      {demoVideo && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3]"
          aria-hidden="true"
        >
          <div className="transition-all duration-300 ease-out group-hover/media:scale-125 group-hover/media:drop-shadow-[0_0_12px_var(--accent)]">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
            >
              <circle
                cx="28"
                cy="28"
                r="27"
                fill="rgba(0,0,0,0.45)"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[var(--fg)]"
              />
              <path
                d="M 22 18 L 22 38 L 40 28 Z"
                fill="currentColor"
                className="text-[var(--fg)]"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Price label always visible in static mode */}
      <div className="absolute right-3 top-3 z-[4] bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-2 border-[var(--fg)] px-4 py-2 font-mono text-sm font-bold uppercase tracking-[0.18em]">
        {priceLabel}
      </div>
    </div>
  );
}
