"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

const Instagram = ({ size = 24, className = "" }) => (
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

const Youtube = ({ size = 24, className = "" }) => (
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

const Twitter = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function LinksPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      subtitle: "Tactile, low-friction ADHD and autistic planners built for energy, not urgency.",
      href: "/store",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: "Memoir in Progress",
      subtitle: "Figuring out how to human after a late-in-life AuDHD diagnosis.",
      href: "/memoir",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "Interactive Labs",
      subtitle: "Free focus loops, visual snow shields, and drag-and-drop spoon trackers.",
      href: "/labs",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      title: "The Honest Blog",
      subtitle: "Deep, unmasked dives on autistic burnout, masking, and systems that work.",
      href: "/blog",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const socialLinks = [
    {
      name: "TikTok",
      label: "Follow on TikTok",
      href: "https://tiktok.com/@neurodivers3",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.41-.47-.59-.73v7.02c0 3.74-2.07 6.97-5.46 8.22-3.39 1.25-7.39.4-9.87-2.12-2.48-2.52-3.13-6.52-1.61-9.76 1.52-3.24 5.05-5.18 8.62-4.77v4.07c-2-.31-4.04.57-5.01 2.37-.97 1.8-.6 4.09.91 5.46 1.52 1.37 3.86 1.34 5.35-.07.97-.96 1.44-2.34 1.37-3.7V0h.03z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      label: "Follow on Instagram",
      href: "https://instagram.com/neurodivers3",
      icon: <Instagram className="w-6 h-6" />,
    },
    {
      name: "YouTube",
      label: "Subscribe on YouTube",
      href: "https://youtube.com/@neurodivers3",
      icon: <Youtube className="w-6 h-6" />,
    },
    {
      name: "Facebook",
      label: "Follow on Facebook",
      href: "https://facebook.com/neurodivers3",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "X",
      label: "Follow on X (formerly Twitter)",
      href: "https://x.com/neurodivers3",
      icon: <Twitter className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-fg-primary flex flex-col justify-between pt-[96px] md:pt-[120px] pb-12 px-6 select-none">
      <div className="w-full max-w-md mx-auto flex flex-col justify-start gap-8 pt-4 pb-12">
        {/* Profile Card Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-fg-primary shadow-[4px_4px_0px_var(--accent)] relative overflow-hidden bg-bg-primary flex items-center justify-center mb-5">
            {!imageError ? (
              <Image
                src="/ollie-profile-v2.jpg"
                alt="Ollie Clews"
                fill
                sizes="96px"
                priority
                className="object-cover transition-all duration-500 filter grayscale-0 hover:grayscale contrast-125"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="font-mono font-bold text-3xl uppercase tracking-tighter select-none text-fg-primary">
                n³
              </div>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-fg-primary leading-none">
            Ollie Clews
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent-label,var(--accent))] mt-3">
            neurodivers³ · founder
          </p>
          
          <p className="text-sm text-text-muted leading-relaxed font-sans max-w-[32ch] mt-4">
            AuDHD founder writing honestly about the parts of neurodivergent life that don't usually make the manual.
          </p>
        </div>

        {/* Action Bar (Download Contact & QR Code Sharing) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadVCard}
            className="flex items-center justify-center gap-2 border-2 border-fg-primary bg-bg-primary hover:bg-[var(--accent)] hover:text-[var(--accent-btn-text,var(--bg))] p-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-[4px_4px_0px_var(--fg-primary)] hover:shadow-[6px_6px_0px_var(--fg-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 cursor-pointer rounded-none focus-ring whitespace-nowrap"
          >
            <Download size={14} className="shrink-0" /> Contact Card
          </button>
          
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center justify-center gap-2 border-2 border-fg-primary bg-bg-primary hover:bg-[var(--accent)] hover:text-[var(--accent-btn-text,var(--bg))] p-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-[4px_4px_0px_var(--fg-primary)] hover:shadow-[6px_6px_0px_var(--fg-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 cursor-pointer rounded-none focus-ring whitespace-nowrap"
          >
            <QrCode size={14} className="shrink-0" /> Share Page
          </button>
        </div>

        {/* Social Icons - Centered horizontal axis with even spacing */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 border-2 border-fg-primary flex flex-col items-center justify-center bg-[var(--accent-soft)] text-fg-primary hover:bg-accent hover:text-[var(--accent-btn-text,var(--bg))] transition-all duration-200 shadow-[3px_3px_0px_var(--fg-primary)] hover:shadow-[5px_5px_0px_var(--fg-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 group focus-ring"
              title={social.name}
              aria-label={social.label}
            >
              <div className="transition-transform group-hover:scale-105 flex items-center justify-center">
                {social.icon}
              </div>
            </a>
          ))}
        </div>

        {/* Links & Inquiries List - Spacious padding and uniform vertical spacing */}
        <div className="space-y-4">
          <span className="text-[11px] font-mono font-bold text-text-muted uppercase tracking-[0.25em] block text-center select-none mb-4">
            explore neurodivers³
          </span>

          {mainLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="flex items-center justify-between border-2 border-fg-primary p-4 bg-bg-primary hover:bg-bg-primary/80 transition-all duration-150 shadow-[4px_4px_0px_var(--fg-primary)] hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 group focus-ring"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-11 h-11 border-2 border-fg-primary flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-btn-text,var(--bg))] transition-colors shrink-0">
                  {link.icon}
                </div>
                <div className="space-y-1">
                  <h2 className="font-display font-black text-xs md:text-sm uppercase tracking-wider text-fg-primary leading-tight">
                    {link.title}
                  </h2>
                  <p className="text-xs text-text-muted leading-relaxed font-sans">
                    {link.subtitle}
                  </p>
                </div>
              </div>
              <ExternalLink size={14} className="text-text-muted group-hover:text-fg-primary transition-colors shrink-0 ml-2" />
            </Link>
          ))}

          {/* Email Card - Integrated into the same stack for uniform spacing */}
          <button
            onClick={copyEmail}
            className="w-full flex items-center justify-between border-2 border-fg-primary p-4 bg-bg-primary hover:bg-bg-primary/80 transition-all duration-150 shadow-[4px_4px_0px_var(--fg-primary)] hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 group cursor-pointer focus-ring"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-11 h-11 border-2 border-fg-primary flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-btn-text,var(--bg))] transition-colors shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display font-black text-xs md:text-sm uppercase tracking-wider text-fg-primary leading-tight">
                  Support & Inquiries
                </h2>
                <p className="text-xs text-text-muted leading-relaxed font-sans">
                  {copied ? "Copied to clipboard!" : "hello@neurodivers3.co.uk"}
                </p>
              </div>
            </div>
            
            <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 border border-fg-primary transition-all shrink-0 ml-2 ${
              copied 
                ? 'bg-green-500/20 text-green-500 border-green-500/40 shadow-[1px_1px_0px_green]' 
                : 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30 group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-btn-text,var(--bg))] group-hover:border-fg-primary shadow-[2px_2px_0px_var(--accent)] group-hover:shadow-none'
            }`}>
              {copied ? "COPIED ✓" : "COPY"}
            </span>
          </button>
        </div>
      </div>

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
              <div className="border-4 border-black p-4 bg-white inline-block mb-6 shadow-md animate-fade-in">
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
    </div>
  );
}
