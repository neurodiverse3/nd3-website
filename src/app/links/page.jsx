"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { 
  Download, 
  QrCode, 
  ExternalLink, 
  Mail, 
  BookOpen, 
  ShoppingBag, 
  Layers, 
  FileText
} from "lucide-react";

const Instagram = ({ size = 20, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Youtube = ({ size = 20, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Twitter = ({ size = 20, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function LinksPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code for the current URL
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://neurodivers3.co.uk/links";
    QRCode.toDataURL(
      currentUrl,
      {
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        width: 300,
      },
      (err, url) => {
        if (!err) setQrCodeUrl(url);
      }
    );
  }, []);

  const downloadVCard = () => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
N:Clews;Ollie;;;
FN:Ollie Clews
ORG:neurodivers³
TITLE:Founder
EMAIL;TYPE=PREF,INTERNET:hello@neurodivers3.co.uk
URL:https://neurodivers3.co.uk
NOTE:neurodivers³ · Neurodivergent life, tools and stories.
END:VCARD`;

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ollie-clews-neurodivers3.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyEmail = async () => {
    const email = "hello@neurodivers3.co.uk";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers or non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard write failed:", err);
    }
  };

  const mainLinks = [
    {
      title: "Digital Store",
      subtitle: "Tactile, low-friction ADHD & autistic planners",
      href: "/store",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: "Serial Memoir",
      subtitle: "Figuring out how to human after a late diagnosis",
      href: "/memoir",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "Interactive Labs",
      subtitle: "Focus tools, visual snow filters & spoon trackers",
      href: "/labs",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      title: "The Blog Archive",
      subtitle: "Deep dives on masking, burnout & neurodivergence",
      href: "/blog",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const socialLinks = [
    {
      name: "TikTok",
      href: "https://tiktok.com/@neurodivers3",
      icon: (
        <span className="font-mono font-bold text-sm tracking-tighter">TT</span>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/neurodivers3",
      icon: <Instagram className="w-5 h-5" />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@neurodivers3",
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/neurodivers3",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "X / Twitter",
      href: "https://x.com/neurodivers3",
      icon: <Twitter className="w-5 h-5" />,
    },
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-fg-primary flex flex-col justify-between pt-[96px] md:pt-[120px] pb-12 px-6">
      <div className="w-full max-w-md mx-auto space-y-8 flex-1 flex flex-col justify-center">
        {/* Profile Card Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto border-4 border-fg-primary shadow-[4px_4px_0px_var(--accent)] relative overflow-hidden bg-bg-primary">
            <img
              src="/ollie.jpg"
              alt="Ollie Clews"
              className="w-full h-full object-cover filter grayscale contrast-125"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-bg-primary text-fg-primary font-mono font-bold text-3xl uppercase tracking-tighter select-none">
              n³
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-black uppercase tracking-tight">
              Ollie Clews
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent-label,var(--accent))]">
              neurodivers³ · founder
            </p>
          </div>
          
          <p className="text-sm text-text-muted leading-relaxed font-sans max-w-[32ch] mx-auto">
            Building tiny, resilient, restartable systems for the wired-different brain.
          </p>
        </div>

        {/* Action Bar (Download Contact & QR Code Sharing) */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={downloadVCard}
            className="flex items-center justify-center gap-2 border-2 border-fg-primary bg-bg-primary hover:bg-[var(--accent)] hover:text-[var(--accent-text,var(--bg))] p-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_var(--fg)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            <Download size={14} /> Contact Card
          </button>
          
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center justify-center gap-2 border-2 border-fg-primary bg-bg-primary hover:bg-[var(--accent)] hover:text-[var(--accent-text,var(--bg))] p-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_var(--fg)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            <QrCode size={14} /> Share Page
          </button>
        </div>

        {/* Links List */}
        <div className="space-y-4 pt-4">
          <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] block text-center">
            explore neurodivers³
          </span>

          {mainLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="flex items-center justify-between border-2 border-fg-primary p-4 bg-bg-primary hover:bg-bg-primary/80 transition-all duration-150 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 group"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 border border-fg-primary flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text,var(--bg))] transition-colors shrink-0">
                  {link.icon}
                </div>
                <div>
                  <h2 className="font-bold text-sm uppercase tracking-tight text-fg-primary leading-tight">
                    {link.title}
                  </h2>
                  <p className="text-xs text-text-muted mt-1 leading-tight font-sans">
                    {link.subtitle}
                  </p>
                </div>
              </div>
              <ExternalLink size={16} className="text-text-muted group-hover:text-fg-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>

        {/* Email Accordion Card */}
        <button
          onClick={copyEmail}
          className="w-full flex items-center justify-between border-2 border-fg-primary p-4 bg-bg-primary hover:bg-bg-primary/80 transition-all duration-150 shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 group cursor-pointer"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 border border-fg-primary flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text,var(--bg))] transition-colors shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm uppercase tracking-tight text-fg-primary leading-tight">
                Support & Inquiries
              </h2>
              <p className="text-xs text-text-muted mt-1 leading-tight font-sans">
                {copied ? "Copied to clipboard!" : "hello@neurodivers3.co.uk"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-[var(--accent-label,var(--accent))] tracking-wider shrink-0">
            {copied ? "COPIED ✓" : "COPY"}
          </span>
        </button>

        {/* Social Grid */}
        <div className="space-y-4 pt-4">
          <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] block text-center">
            social channels
          </span>
          <div className="grid grid-cols-4 gap-3">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square border-2 border-fg-primary flex flex-col items-center justify-center gap-1.5 bg-bg-primary hover:bg-[var(--accent)] hover:text-[var(--accent-text,var(--bg))] transition-colors shadow-[3px_3px_0px_var(--rule)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 group"
                title={social.name}
              >
                <div className="text-fg-primary group-hover:text-[var(--accent-text,var(--bg))] transition-colors">
                  {social.icon}
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider hidden sm:block">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="w-full text-center mt-12 pt-6 border-t border-border-rule max-w-md mx-auto">
        <Link href="/" className="font-display font-black text-sm uppercase tracking-wider hover:text-[var(--accent)] transition-colors">
          neurodivers³
        </Link>
      </footer>

      {/* QR Code Share Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowQrModal(false)}
          />
          
          <div className="relative w-full max-w-sm border-4 border-fg-primary bg-bg-primary p-8 shadow-[8px_8px_0px_var(--accent)] animate-in zoom-in-95 duration-200 text-center">
            <h3 className="text-xl font-display font-black uppercase tracking-tight mb-2">
              Share neurodivers³
            </h3>
            <p className="text-xs text-text-muted mb-6 max-w-[28ch] mx-auto leading-relaxed">
              Scan this code to load this link directory on another mobile device.
            </p>
            
            {qrCodeUrl ? (
              <div className="border-4 border-black p-4 bg-white inline-block mb-6 shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="QR Code to links directory"
                  className="w-48 h-48 mx-auto"
                />
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto bg-black/10 border border-border-rule flex items-center justify-center mb-6">
                <span className="text-xs font-mono">Generating...</span>
              </div>
            )}

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-fg-primary text-bg-primary font-black uppercase tracking-wider text-xs border-2 border-fg-primary hover:bg-transparent hover:text-fg-primary transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
