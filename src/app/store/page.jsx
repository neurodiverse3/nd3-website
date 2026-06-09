import React from 'react';
import { getProducts } from '../../lib/strapi';
import { StoreClient } from '../../components/StoreClient';

export const metadata = {
  title: 'Store · neurodivers³',
  description: 'Accessibility resources and digital planners designed specifically for brain types that resist rigid corporate organization models.',
  openGraph: {
    title: 'Store · neurodivers³',
    description: 'Accessibility resources and digital planners designed specifically for brain types that resist rigid corporate organization models.',
  },
  twitter: {
    title: 'Store · neurodivers³',
    description: 'Accessibility resources and digital planners designed specifically for brain types that resist rigid corporate organization models.',
  }
};

export const revalidate = 60; // Revalidate every minute

export default async function StorePage() {
  let products = [];
  try {
    products = await getProducts();
  } catch (err) {
    console.error("Failed to fetch products from CMS: ", err);
  }

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
      {/* Header section */}
      <div className="mb-16 border-b-4 border-fg-primary pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left w-full mt-4">
        <div>
          <span className="text-[13px] font-black uppercase tracking-[0.25em] text-accent-pink">
            ND3 RESOURCE HUB
          </span>
          <h1 className="text-5xl md:text-8xl font-black mt-4 uppercase tracking-tighter text-fg-primary leading-none">
            THE · <span className="italic font-light text-accent-pink">TOOLKIT</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl font-normal mt-4 max-w-2xl leading-relaxed">
            Accessibility resources and digital planners designed specifically for brain types that resist rigid corporate organization models.
          </p>
        </div>
      </div>

      {/* Interactive dynamic Store listing client view */}
      <StoreClient initialProducts={products} />
    </div>
  );
}
