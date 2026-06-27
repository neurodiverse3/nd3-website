import React from 'react';
import { Cpu } from 'lucide-react';
import { getLabs, getLabCategories } from '../../lib/strapi';
import { LabsClient } from '../../components/LabsClient';
import PageHeader from '../../components/PageHeader';

export const metadata = {
  title: 'Labs - neurodivers³',
  description: 'Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths: acoustic shields, and dopamine resets.',
  openGraph: {
    title: 'Labs - neurodivers³',
    description: 'Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths: acoustic shields, and dopamine resets.',
  },
  twitter: {
    title: 'Labs - neurodivers³',
    description: 'Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths: acoustic shields, and dopamine resets.',
  }
};

export const revalidate = 60; // Cache for 1 minute, revalidated on-demand

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
      <PageHeader
        variant="section"
        eyebrow="Experimental Playground"
        titleLabel="Labs"
        titleAccent="Prototypes"
        subtitle="Free, highly tactile, sensory-friendly utilities built for brains that need alternative visual paths · acoustic shields, and dopamine resets."
        className="mb-12 md:mb-16"
      />

      {/* Main Listing & Filtering Client Interface */}
      <LabsClient 
        initialCategories={sanityCategories} 
        initialLabs={sanityLabs} 
      />
    </div>
  );
}
