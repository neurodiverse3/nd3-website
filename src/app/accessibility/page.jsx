import React from 'react';
import PageHeader from '../../components/PageHeader';

export const metadata = {
  title: 'Accessibility - neurodivers³',
  description: 'Accessibility statement and commitment to building a deeply neuroinclusive and accessible website for all brains.',
  alternates: {
    canonical: 'https://neurodivers3.co.uk/accessibility',
  },
  openGraph: {
    title: 'Accessibility - neurodivers³',
    description: 'Accessibility statement and commitment to building a deeply neuroinclusive and accessible website for all brains.',
  },
  twitter: {
    title: 'Accessibility - neurodivers³',
    description: 'Accessibility statement and commitment to building a deeply neuroinclusive and accessible website for all brains.',
  }
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
      <PageHeader
        variant="section"
        eyebrow="Legal"
        titleLabel="Accessibility"
        titleAccent="Statement"
        subtitle="Accessibility status: Built toward WCAG 2.1 AA and informed by W3C Cognitive Accessibility guidance"
      />

      <div className="max-w-[720px] prose prose-invert prose-lg text-left">
        <p className="text-text-muted text-lg leading-relaxed font-normal">
          neurodivers³ is designed and built from the ground up for neurodivergent individuals, especially those with ADHD, autism, dyslexia, and sensory processing differences. We believe accessibility isn’t a passive compliance checkbox · it is a foundational pillar of design.
        </p>

        <h2 className="text-2xl font-black uppercase tracking-tight text-fg-primary mt-12 mb-4">What We've Built</h2>
        <ul className="text-text-muted text-lg leading-relaxed space-y-4 list-disc pl-6 font-normal">
          <li>
            <strong className="text-fg-primary">Sensory Controls Panel</strong> · A persistent floating toolbar (accessible via the sliding panel on mobile or the preferences menu in the header on desktop) that lets you customise your reading environment on the fly. You can adjust:
            <ul className="list-circle pl-6 mt-2 space-y-2 text-base">
              <li><strong className="text-fg-primary">Global Text Size:</strong> Scale text sizes up to 137% (XXL) for low-effort scanning.</li>
              <li><strong className="text-fg-primary">Dyslexic Friendly:</strong> Boost word and letter spacing, and line heights for maximum reading comfort.</li>
              <li><strong className="text-fg-primary">Focus Reading Ruler:</strong> Engage a horizontal tracker overlay that follows your cursor to help maintain visual focus.</li>
              <li><strong className="text-fg-primary">Force Reduced Motion:</strong> Instantly disable tickers, glitches, and all site transitions.</li>
              <li><strong className="text-fg-primary">High Contrast Text:</strong> Toggle high-contrast text and border overrides for clear visual distinction.</li>
            </ul>
          </li>
          <li>
            <strong className="text-fg-primary">Three Visual Themes</strong> · Switch at any time from the navbar header to match your active energy and sensory thresholds:
            <ul className="list-circle pl-6 mt-2 space-y-1 text-base">
              <li><strong className="text-fg-primary">Void:</strong> Deep dark mode (pure space).</li>
              <li><strong className="text-fg-primary">Parchment:</strong> Softer, warm cream light mode.</li>
              <li><strong className="text-fg-primary">Incubation:</strong> Low-stimulus, low-wavelength green mode.</li>
            </ul>
          </li>
          <li>
            <strong className="text-fg-primary">Brain-State Content Filtering</strong> · Since cognitive focus fluctuates, every post is classified by brain-state (e.g. Burned Out, Hyperfocus, Masking, Spiralling, On a Roll) allowing you to browse content that fits your current mental capacity.
          </li>
          <li>
            <strong className="text-fg-primary">Full Keyboard Navigation</strong> with robust, high-visibility focus indicators on every interactive element.
          </li>
          <li>
            <strong className="text-fg-primary">Respect for Motion Settings</strong> · All marquees, text glitch effects, and animations respect your OS-level <code className="text-accent-pink bg-bg-primary border border-border-rule px-2 py-0.5 font-mono text-sm">prefers-reduced-motion</code> preference out of the box.
          </li>
          <li>
            <strong className="text-fg-primary">No Autoplay Media</strong> · Articles include high-quality voice narrations, but they are strictly opt-in and will never autoplay.
          </li>
          <li>
            <strong className="text-fg-primary">Skip-to-Content link</strong> enabled on every single page.
          </li>
        </ul>

        <h2 className="text-2xl font-black uppercase tracking-tight text-fg-primary mt-12 mb-4">Known Limitations</h2>
        <p className="text-text-muted text-lg leading-relaxed font-normal">
          While we strive for deep neuroinclusion, some of our experimental interactive labs (such as visual snow filters, audio noise generators, or drag-and-drop elements) may have limitations when accessed with screen readers or purely keyboard-based flows. We are actively working to improve the accessibility of these experimental spaces. If you experience any issues or barriers, please let us know.
        </p>

        <h2 className="text-2xl font-black uppercase tracking-tight text-fg-primary mt-12 mb-4">Feedback & Continuous Improvement</h2>
        <p className="text-text-muted text-lg leading-relaxed font-normal">
          We are committed to continually expanding our neuroinclusive standards. If you encounter any bugs, find specific copy confusing, or have suggestions for new sensory options, we want to know.
        </p>
        <p className="text-text-muted text-lg leading-relaxed font-normal mt-4">
          Please reach out directly by email: <a href="mailto:hello@neurodivers3.co.uk" className="text-accent-pink hover:underline font-semibold">hello@neurodivers3.co.uk</a>.
        </p>

        <p className="text-text-muted text-sm mt-12 font-mono">
          Last updated: June 2026
        </p>
      </div>
    </div>
  );
}
