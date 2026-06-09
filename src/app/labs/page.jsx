import React from 'react';
import { Cpu } from 'lucide-react';
import { getLabs, getLabCategories } from '../../lib/strapi';
import { LabsClient } from '../../components/LabsClient';

export const metadata = {
  title: 'Labs · neurodivers³',
  description: 'Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths · acoustic shields, and dopamine resets.',
  openGraph: {
    title: 'Labs · neurodivers³',
    description: 'Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths · acoustic shields, and dopamine resets.',
  },
  twitter: {
    title: 'Labs · neurodivers³',
    description: 'Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths · acoustic shields, and dopamine resets.',
  }
};

export const revalidate = 60; // Revalidate every minute

export default async function LabsPage() {
  let sanityLabs = [];
  let sanityCategories = [];

  try {
    sanityLabs = await getLabs();
    sanityCategories = await getLabCategories();
  } catch (err) {
    console.error("Failed to fetch labs from CMS: ", err);
  }

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
      {/* Header Block */}
      <div className="mb-16 border-b-4 border-fg-primary pb-10 text-left w-full mt-4">
        <div>
          <div className="inline-block text-[11px] font-mono tracking-[0.25em] text-accent-pink bg-accent-pink-soft px-3 py-1 uppercase border border-border-rule mb-8 select-none">
            EXPERIMENTAL PLAYGROUND
          </div>
          <h1 className="text-5xl md:text-8xl font-black mt-4 uppercase tracking-tighter text-fg-primary leading-none font-display">
            LABS · <span className="italic font-light text-accent-pink">PROTOTYPES</span><span className="text-accent-pink inline-block ml-0.5">.</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl font-normal mt-4 max-w-2xl leading-relaxed">
            Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths · acoustic shields, and dopamine resets.
          </p>
        </div>
      </div>

      {/* Main Listing & Filtering Client Interface */}
      <LabsClient 
        initialCategories={sanityCategories} 
        initialLabs={sanityLabs} 
      />
    </div>
  );
}
