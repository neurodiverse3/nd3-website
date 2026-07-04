import '../index.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PageTransition } from '../components/PageTransition';
import { BackToTop } from '../components/BackToTop';
import { ThemeProvider } from '../context/ThemeContext';
import { BrainStateProvider } from '../context/BrainStateContext';
import { Inter, Outfit } from 'next/font/google';
import { PWARegister } from '../components/PWARegister';
import { ZeroTelemetryBanner } from '../components/ZeroTelemetryBanner';
import { Analytics } from '@vercel/analytics/react';
import GlobalVisualSnow from '../components/labs/GlobalVisualSnow';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});


export const metadata = {
  title: 'neurodivers³ - Neurodivergent life, tools and stories',
  description: 'An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.',
  metadataBase: new URL('https://neurodivers3.co.uk'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg?v=4', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg?v=4',
  },

  openGraph: {
    title: 'neurodivers³ - Neurodivergent life, tools and stories',
    description: 'An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.',
    url: 'https://neurodivers3.co.uk/',
    siteName: 'neurodivers³',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/ollie-profile-v2.jpg',
        width: 1200,
        height: 630,
        alt: 'neurodivers³ - Neurodivergent life, tools and stories',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'neurodivers³ - Neurodivergent life, tools and stories',
    description: 'An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.',
    images: ['/ollie-profile-v2.jpg'],
  },
};

export const viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://neurodivers3.co.uk/#website",
        "url": "https://neurodivers3.co.uk/",
        "name": "neurodivers³",
        "alternateName": "neurodivers3",
        "inLanguage": "en-GB"
      },
      {
        "@type": "Organization",
        "@id": "https://neurodivers3.co.uk/#org",
        "name": "neurodivers³",
        "alternateName": "neurodivers3",
        "url": "https://neurodivers3.co.uk/",
        "logo": "https://neurodivers3.co.uk/logo-primary-flat.svg"
      },
      {
        "@type": "Person",
        "@id": "https://neurodivers3.co.uk/#ollie",
        "name": "Ollie",
        "url": "https://neurodivers3.co.uk/about",
        "jobTitle": "Writer & Founder",
        "worksFor": { "@id": "https://neurodivers3.co.uk/#org" }
      }
    ]
  };

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-bg text-fg selection:bg-accent selection:text-bg overflow-x-clip`}>
        <ThemeProvider>
          <GlobalVisualSnow />
          <BrainStateProvider>
            <PWARegister />
            <ZeroTelemetryBanner />
            <Navbar />
            <BackToTop />
            <main id="main" className="min-h-screen">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
            <Analytics />
          </BrainStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
