import React from 'react';
import { getSiteSettings, getPosts } from '../lib/strapi';
import HomeClient from '../components/HomeClient';

export const metadata = {
  title: 'neurodivers³ — Neurodivergent life, tools & stories',
  description: 'An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.',
  openGraph: {
    title: 'neurodivers³ — Neurodivergent life, tools & stories',
    description: 'An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.',
  },
  twitter: {
    title: 'neurodivers³ — Neurodivergent life, tools & stories',
    description: 'An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.',
  }
};

export const revalidate = 60; // Revalidate home page cache every minute

export default async function Page() {
  const siteSettings = await getSiteSettings();
  const allPosts = await getPosts();

  const featuredIds = Array.isArray(siteSettings.featuredPosts)
    ? siteSettings.featuredPosts.map((p) => p._id).filter(Boolean)
    : [];

  const latestPosts = (allPosts || [])
    .filter((p) => !featuredIds.includes(p._id))
    .sort((a, b) => new Date(b.date || b._createdAt || 0) - new Date(a.date || a._createdAt || 0))
    .slice(0, 6);

  return (
    <HomeClient
      siteSettings={siteSettings}
      latestPosts={latestPosts}
    />
  );
}
