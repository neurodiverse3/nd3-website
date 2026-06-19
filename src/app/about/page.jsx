import React from 'react';
import AboutClient from '../../components/AboutClient';

export const metadata = {
  title: 'About - neurodivers3',
  description: 'Meet Ollie - late-diagnosed AuDHD founder of neurodivers3. Stories, tools, and systems for the wired-different brain.',
  openGraph: {
    title: 'About - neurodivers3',
    description: 'Meet Ollie - late-diagnosed AuDHD founder of neurodivers3. Stories, tools, and systems for the wired-different brain.',
  },
  twitter: {
    title: 'About - neurodivers3',
    description: 'Meet Ollie - late-diagnosed AuDHD founder of neurodivers3. Stories, tools, and systems for the wired-different brain.',
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
