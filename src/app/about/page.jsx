import React from 'react';
import AboutClient from '../../components/AboutClient';

export const metadata = {
  title: 'About - neurodivers³',
  description: 'Meet Ollie - late-diagnosed AuDHD founder of neurodivers3. Stories, tools, and systems for the wired-different brain.',
  alternates: {
    canonical: 'https://neurodivers3.co.uk/about',
  },
  openGraph: {
    title: 'About - neurodivers³',
    description: 'Meet Ollie - late-diagnosed AuDHD founder of neurodivers3. Stories, tools, and systems for the wired-different brain.',
  },
  twitter: {
    title: 'About - neurodivers³',
    description: 'Meet Ollie - late-diagnosed AuDHD founder of neurodivers3. Stories, tools, and systems for the wired-different brain.',
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
