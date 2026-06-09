import React from 'react';
import { notFound } from 'next/navigation';
import { getLabBySlug, getLabs } from '../../../../lib/strapi';
import LabEmbedder from '../../../../components/labs/LabEmbedder';

export async function generateStaticParams() {
  const labs = await getLabs();
  return labs.map((l) => ({ slug: l.slug }));
}

export default async function LabEmbedPage(props) {
  const params = await props.params;
  const slug = params.slug;

  const lab = await getLabBySlug(slug);

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
