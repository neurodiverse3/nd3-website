import React from 'react';
import AboutClient from '../../components/AboutClient';

export const metadata = {
  title: 'About · neurodivers³',
  description: 'Meet Ollie — late-diagnosed AuDHD founder of neurodivers³. Stories, tools, and systems for the wired-different brain.',
  openGraph: {
    title: 'About · neurodivers³',
    description: 'Meet Ollie — late-diagnosed AuDHD founder of neurodivers³. Stories, tools, and systems for the wired-different brain.',
  },
  twitter: {
    title: 'About · neurodivers³',
    description: 'Meet Ollie — late-diagnosed AuDHD founder of neurodivers³. Stories, tools, and systems for the wired-different brain.',
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
