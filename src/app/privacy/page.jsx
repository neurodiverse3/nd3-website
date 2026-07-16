import React from 'react';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import ConsentToggle from '../../components/ConsentToggle';

export const metadata = {
  title: 'Privacy Policy - neurodivers³',
  description: 'UK GDPR compliant privacy statement explaining how we handle your data, newsletters, cookies, and Polar payments.',
  alternates: {
    canonical: 'https://neurodivers3.co.uk/privacy',
  },
  openGraph: {
    title: 'Privacy Policy - neurodivers³',
    description: 'UK GDPR compliant privacy statement explaining how we handle your data, newsletters, cookies, and Polar payments.',
  },
  twitter: {
    title: 'Privacy Policy - neurodivers³',
    description: 'UK GDPR compliant privacy statement explaining how we handle your data, newsletters, cookies, and Polar payments.',
  }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
      <PageHeader
        variant="section"
        eyebrow="Legal"
        titleLabel="Privacy"
        titleAccent="Policy"
        subtitle="Last updated: May 2026 · UK GDPR & Companies Act Compliant"
      />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Policy Content (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-12">
            
            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">1. Overview</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  This policy outlines how <span className="font-semibold text-[var(--fg)]">neurodivers³</span> ("we", "our", "us") handles personal data in connection with our website, products, and services. Under the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018, we act as the data controller for the information you share with us.
                </p>
                <p>
                  As a neurodivergent-led project, we value clarity, honesty, and minimizing unnecessary tracking. We collect only what is strictly necessary to run this platform and send you requested resources.
                </p>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">2. What Data We Collect & Why</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  We only collect data under legitimate business interests, performance of a contract, or explicit consent:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-[var(--fg)]">Email Address:</strong> Collected when you sign up for our newsletter, receive email updates, or purchase a digital product. Used to deliver drafts, product links, and system updates. Processed via <span className="font-semibold text-[var(--fg)]">Resend</span>.
                  </li>
                  <li>
                    <strong className="text-[var(--fg)]">Transaction & Billing Data:</strong> Collected when you purchase digital products. We do <strong>not</strong> store or see your raw card details. Billing, checkout, and digital delivery are securely handled through Polar and its payment processors.
                  </li>
                  <li>
                    <strong className="text-[var(--fg)]">Technical, Cookie & Storage Data:</strong> We do not set any tracking cookies. We only use browser storage to run this site:
                    <div className="mt-4 space-y-4 font-sans font-medium text-sm">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs font-mono text-[var(--muted)] border border-[var(--rule)]">
                          <thead>
                            <tr className="border-b border-[var(--rule)] bg-bg-primary text-[var(--fg)]">
                              <th className="p-2 text-left">Key / Storage</th>
                              <th className="p-2 text-left">Type / Classification</th>
                              <th className="p-2 text-left">Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[var(--rule)]">
                              <td className="p-2 font-semibold text-[var(--fg)]">nd3_theme_preference</td>
                              <td className="p-2">Local Storage (Functional)</td>
                              <td className="p-2">Remembers your preferred reading theme (Void, Parchment, Incubation).</td>
                            </tr>
                            <tr className="border-b border-[var(--rule)]">
                              <td className="p-2 font-semibold text-[var(--fg)]">nd3-a11y-*</td>
                              <td className="p-2">Local Storage (Functional)</td>
                              <td className="p-2">Accessibility overrides (font scale, dyslexic spacing, ruler, motion, contrast).</td>
                            </tr>
                            <tr className="border-b border-[var(--rule)]">
                              <td className="p-2 font-semibold text-[var(--fg)]">nd3_telemetry_acknowledged</td>
                              <td className="p-2">Local Storage (Functional)</td>
                              <td className="p-2">Remembers whether you have acknowledged the privacy banner.</td>
                            </tr>
                            <tr className="border-b border-[var(--rule)]">
                              <td className="p-2 font-semibold text-[var(--fg)]">nd3_consent_analytics</td>
                              <td className="p-2">Local Storage (Functional)</td>
                              <td className="p-2">Saves your choice to opt-in or opt-out of anonymous page view statistics.</td>
                            </tr>
                            <tr className="border-b border-[var(--rule)]">
                              <td className="p-2 font-semibold text-[var(--fg)]">nd3_secured_downloads</td>
                              <td className="p-2">Local Storage (Functional)</td>
                              <td className="p-2">Stores secure links for your digital product purchases.</td>
                            </tr>
                            <tr className="border-b border-[var(--rule)]">
                              <td className="p-2 font-semibold text-[var(--fg)]">nd3_mastodon_instance</td>
                              <td className="p-2">Local Storage (Functional)</td>
                              <td className="p-2">Remembers your Mastodon instance for sharing posts.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="border border-[var(--rule)] p-4 bg-bg-primary">
                        <strong className="text-[var(--fg)] block mb-1 text-sm uppercase font-black">Anonymous Web Analytics</strong>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          We use Vercel Web Analytics to count page views and general visitor stats. It is entirely <strong>cookieless</strong> and privacy-focused—it doesn't track you across the web, and only hashes a daily reset of your IP address and User Agent to estimate unique visits. 
                        </p>
                        <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
                          By default, Vercel Analytics is <strong>disabled</strong> until you explicitly opt-in using our banner or the toggle below. You can change your choice at any time:
                        </p>
                        <div className="mt-4">
                          <ConsentToggle />
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">3. Data Sharing & Third-Party Processors</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  We never sell, rent, or trade your personal data. We only share data with verified third-party processors who perform essential functions on our behalf:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Resend:</strong> Secure email infrastructure.</li>
                  <li><strong>Polar:</strong> Secure, PCI-compliant checkout, billing, and digital delivery processor.</li>
                  <li><strong>Sanity CMS:</strong> Back-end database for writing logs and static configurations.</li>
                  <li><strong>Vercel:</strong> Standard hosting, request routing, server logs, and privacy-focused web analytics (only active if you opt-in).</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-8 shadow-[4px_4px_0px_var(--rule)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mb-4">4. Your Rights Under UK GDPR</h2>
              <div className="text-[var(--muted)] text-base leading-relaxed space-y-4 font-normal">
                <p>
                  You hold full legal rights over your information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to be informed about how your data is used.</li>
                  <li>The right to access the personal data we hold about you.</li>
                  <li>The right to request rectification of inaccurate data.</li>
                  <li>The right to erasure ("right to be forgotten") - we will delete your record in full upon request.</li>
                  <li>The right to withdraw consent at any time (e.g., unsubscribing from emails).</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, contact us at <a href="mailto:ollie@neurodivers3.co.uk" className="text-[var(--accent)] hover:underline font-semibold">ollie@neurodivers3.co.uk</a>.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar / Quick Info (Spans 1 column) - Module 6.2 sticky on desktop */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-bg-primary border-2 border-[var(--rule)] p-6 shadow-[4px_4px_0px_var(--rule)]">
              <h3 className="text-lg font-black uppercase tracking-tight text-[var(--fg)] mb-4">Summary Checklist</h3>
              <ul className="text-sm text-[var(--muted)] space-y-3 font-normal leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Zero behavioural ad cookies or cross-site tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>SSL encryption throughout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>Polar checkout security for payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span>UK GDPR Compliant</span>
                </li>
              </ul>
            </div>

            <div className="bg-bg-primary border border-[var(--rule)] p-6 shadow-[4px_4px_0px_var(--rule)] text-sm">
              <h3 className="font-bold uppercase text-[var(--fg)] mb-2">Queries & Subject Access Requests</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                If you have questions about how your personal details are processed, or would like to request a copy of your files, email the founder directly.
              </p>
              <a 
                href="mailto:ollie@neurodivers3.co.uk" 
                className="w-full inline-block py-3 bg-[var(--accent)] text-bg-primary font-black uppercase tracking-wider text-xs border border-[var(--fg)] text-center shadow-[3px_3px_0px_var(--fg)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
              >
                Contact Data Protection
              </a>
            </div>
          </div>
        </div>
    </div>
  );
}
