"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
// @ts-ignore
import { useSearchParams } from "next/navigation";

import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Download,
  Loader2,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";

// Define a type for a particle
type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  rotation: number;
  spin: number;
};

// Define a type for a verified purchased item
type PurchasedItem = {
  id: string;
  title: string;
  color: string;
  tag: string;
  purchasedAt: string;
  licenseCode: string;
};

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const [securedDownloads, setSecuredDownloads] = useState<any[]>([]);

  // Load secured downloads from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nd3_secured_downloads');
      if (stored) {
        setSecuredDownloads(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("localStorage is not available: ", e);
    }
  }, []);

  // Save secured downloads to localStorage when changed
  const saveSecuredDownloads = (newDownloads: any[]) => {
    setSecuredDownloads(newDownloads);
    try {
      localStorage.setItem('nd3_secured_downloads', JSON.stringify(newDownloads));
    } catch (e) {
      console.warn("Failed to write to localStorage: ", e);
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Sparkles dopamine burst effect on verification success
  const triggerBirthdaySparkles = () => {
    const newParticles: Particle[] = [];
    const colors = ["#FF2E88", "#00F0FF", "#E1A624", "#39FF14", "#FF5F1F", "#FF007F"];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      const size = 12 + Math.random() * 18;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 2),
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        opacity: 1,
        rotation: Math.random() * 360,
        spin: Math.random() * 10 - 5,
      });
    }
    setParticles(newParticles);
  };

  // Sparkles animation ticker
  useEffect(() => {
    if (particles.length === 0) return;

    let active = true;
    const update = () => {
      if (!active) return;

      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            opacity: p.opacity - 0.02,
            rotation: p.rotation + p.spin,
          }))
          .filter((p) => p.opacity > 0);

        if (updated.length > 0) {
          requestAnimationFrame(update);
        }
        return updated;
      });
    };

    const frameId = requestAnimationFrame(update);
    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, [particles.length]);

  // Verify Checkout status on mount
  useEffect(() => {
    if (!checkoutId) {
      setError(
        "No checkout session reference was found in the URL. Please verify your link."
      );
      setLoading(false);
      return;
    }

    const verifyCheckout = async () => {
      try {
        const response = await fetch(`/api/checkout?checkout_id=${checkoutId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify payment with Polar.");
        }

        if (data.status === "succeeded" || data.status === "confirmed") {
          const metadata = data.metadata || {};
          let productSlugs: string[] = [];
          let productIds: string[] = [];
          let productNames: string[] = [];

          if (metadata.product_slugs) {
            // Cart checkout (multi-product metadata workaround)
            productSlugs = (metadata.product_slugs as string).split(",");
            productIds = metadata.product_ids ? (metadata.product_ids as string).split(",") : [];
            productNames = metadata.product_names ? (metadata.product_names as string).split(",") : [];
          } else {
            // Direct checkout (Option B - single product native Polar link)
            const targetProductId = data.product_id || data.product?.id;
            if (targetProductId) {
              const matchedProduct = PRODUCTS.find(p => p.id === targetProductId);
              if (matchedProduct) {
                productSlugs = [matchedProduct.slug];
                productIds = [matchedProduct.id];
                productNames = [matchedProduct.title];
              } else {
                // Try to find by name from Polar if available
                const pName = data.product?.name || "Digital Product";
                productSlugs = ["digital-product"];
                productIds = [targetProductId];
                productNames = [pName];
              }
            }
          }

          if (productIds.length === 0) {
            throw new Error(
              "Payment verified, but no product items could be resolved from the transaction."
            );
          }

          // Build item objects using rich static data as lookup
          const newItems = productIds.map((id, idx) => {
            const matchedProduct = PRODUCTS.find((p) => p.id === id);
            const title = matchedProduct?.title || productNames[idx] || "Digital Product";
            const color = matchedProduct?.pillar === "Unmasked Life" 
              ? "from-pink-600 to-rose-700" 
              : "from-teal-600 to-emerald-700";
            const tag = matchedProduct?.format || "DIGITAL DOWNLOAD";

            return {
              id: id,
              title,
              color,
              tag,
              purchasedAt: new Date().toISOString(),
              licenseCode: `ND3-${Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()}-${Math.random()
                .toString(36)
                .substring(2, 6)
                .toUpperCase()}`,
            };
          });

          // Save to local downloads storage - read directly from localStorage to prevent stale closures
          let currentDownloads: any[] = [];
          try {
            const stored = localStorage.getItem('nd3_secured_downloads');
            if (stored) {
              currentDownloads = JSON.parse(stored);
            }
          } catch (e) {
            console.warn("Failed to read from localStorage inside verifyCheckout: ", e);
          }
          const existingFiltered = currentDownloads.filter(
            (d: any) => !productIds.includes(d.id)
          );
          saveSecuredDownloads([...newItems, ...existingFiltered]);
          setPurchasedItems(newItems);
          


          // Celebrate with sparkles
          triggerBirthdaySparkles();
        } else {
          setError(
            `Your transaction status is "${data.status}". Once payment clears, your downloads will unlock here.`
          );
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(
          err.message || "An unexpected error occurred verifying your checkout."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyCheckout();
  }, [checkoutId]);

  const handleDownload = (item: PurchasedItem) => {
    setDownloadingId(item.id);

    // Simulate compilation delay for micro-reward feeling
    setTimeout(() => {
      const content =
        `neurodivers\u00B3 \u00B7 ${item.title.toUpperCase()}\n\n` +
        `Thank you for securing this digital toolkit resource.\n` +
        `Verified secure license code: ${item.licenseCode}\n` +
        `Timestamp of transaction: ${new Date(
          item.purchasedAt
        ).toLocaleString("en-GB")}\n\n` +
        `Fulfillment details:\n` +
        `Your product is fully unlocked under your Polar.sh payment registration.\n` +
        `Keep building tiny, resilient, restartable systems that fit your actual energy levels.\n\n` +
        `\u2014 Ollie \u00B7 neurodivers\u00B3\n` +
        `https://neurodivers3.co.uk\n`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.title
        .toLowerCase()
        .replaceAll(" ", "-")}-license-toolkit.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 pt-24 px-6 max-w-lg mx-auto">
        <Loader2 size={48} className="text-[var(--accent)] animate-spin" />
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent)] block">
            Verifying Transaction
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Checking with Polar...
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-light font-sans">
            We are confirming your payment was secured. This only takes a moment.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 pt-24 px-6 max-w-md mx-auto">
        <div className="p-4 bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] rounded-none flex items-center justify-center">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent)] block">
            Verification Warning
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Acquisition Paused
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-light font-sans">
            {error}
          </p>
        </div>
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3FB07C] text-[#0B130F] border-2 border-[var(--fg)] font-black uppercase tracking-wider transition-colors cursor-pointer font-mono shadow-[3px_3px_0px_var(--fg)] hover:shadow-[2px_2px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 focus-ring"
        >
          Return to toolkit
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-24 px-6 text-left relative">
      {/* Particles canvas-free burst overlays */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {particles.map((p) => (
          <span
            key={p.id}
            aria-hidden="true"
            className="absolute inline-block select-none pointer-events-none font-sans"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              opacity: p.opacity,
              color: p.color,
              textShadow: `0 0 12px ${p.color}`,
              fontSize: `${p.size}px`,
              lineHeight: 1,
            }}
          >
            ✨
          </span>
        ))}
      </div>

      <div className="border border-white/10 p-8 md:p-12 bg-[var(--nd3-card)] shadow-[8px_8px_0px_var(--accent-soft)] relative overflow-hidden rounded-none mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-8 border-b border-white/10">
          <div>
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-green-400 bg-green-500/10 px-2.5 py-1 border border-green-600/30 mb-4 select-none">
              Transaction Secured ✓
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none text-white">
              Acquisition Complete<span className="text-[var(--accent)]">.</span>
            </h1>
          </div>
          <div className="shrink-0 text-left md:text-right font-mono text-xs text-[var(--muted)] space-y-1">
            <p>ORDER ID: {checkoutId?.substring(0, 10).toUpperCase()}</p>
            <p>FULFILLMENT: INSTANT STREAM</p>
          </div>
        </div>

        <div className="py-8 space-y-6">
          <p className="text-base md:text-lg text-white/70 leading-relaxed font-light font-sans">
            Thank you for securing these digital toolkit resources. Your license parameters have been successfully registered and compiled on the network.
          </p>

          <div className="grid grid-cols-1 gap-6 pt-4">
            {purchasedItems.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-[var(--nd3-void)] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[var(--accent)]/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${item.color} flex items-center justify-center font-black text-xs text-white border border-white/10 shrink-0`}
                  >
                    PDF
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--accent)] block mb-1">
                      {item.tag}
                    </span>
                    <h3 className="font-black text-base uppercase tracking-tight text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-[var(--muted)] font-mono mt-1 font-semibold uppercase">
                      LICENSE: {item.licenseCode}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(item)}
                  disabled={downloadingId !== null}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-text,var(--bg))] hover:bg-transparent hover:text-[var(--accent)] border border-[var(--accent)] px-5 py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 font-mono"
                >
                  {downloadingId === item.id ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Compiling...
                    </>
                  ) : (
                    <>
                      <Download size={13} /> Compile Download
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex items-start gap-2.5 text-xs text-[var(--muted)] leading-relaxed max-w-md font-sans">
            <CheckCircle2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
            <span>
              All updates are lifetime-free. If this methodology does not align with your focus, reply to your confirmation receipt for a full refund.
            </span>
          </div>

          <div className="flex gap-4 w-full sm:w-auto font-mono">
            <Link
              href="/blog"
              className="flex-1 sm:flex-none text-center px-5 py-3 bg-transparent text-[var(--muted)] hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Read blog
            </Link>
            <Link
              href="/store"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-transparent hover:text-white border border-white px-6 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Browse store <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 pt-24 px-6 max-w-lg mx-auto">
          <Loader2 size={48} className="text-[var(--accent)] animate-spin" />
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent)] block">
              Loading
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Preparing Portal...
            </h2>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
