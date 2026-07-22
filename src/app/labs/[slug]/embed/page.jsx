import React from 'react';
import { notFound } from 'next/navigation';
import { getLabBySlug, getLabs } from '../../../../lib/strapi';
import LabEmbedder from '../../../../components/labs/LabEmbedder';
import { fallbackLabs } from '../../../../data/fallbackLabs';

export async function generateStaticParams() {
  try {
    const labs = await getLabs();
    if (!labs || !Array.isArray(labs)) return [];
    return labs.map((l) => ({ slug: l.slug }));
  } catch (err) {
    console.warn('⚠️ [generateStaticParams Embed] Failed to fetch lab slugs from Strapi:', err);
    return [];
  }
}

export default async function LabEmbedPage(props) {
  const params = await props.params;
  const slug = params.slug;

  let lab = null;
  try {
    lab = await getLabBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch lab by slug for embed: ", err);
  }

  if (!lab && fallbackLabs[slug]) {
    lab = fallbackLabs[slug];
  }

  if (!lab) {
    notFound();
  }

  const componentKey = lab.toolComponentKey || slug;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F4F4F2] overflow-hidden flex flex-col justify-start">
      <LabEmbedder slug={componentKey} hideChrome={true} />
    </div>
  );
}
