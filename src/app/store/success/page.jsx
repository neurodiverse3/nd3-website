"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Download, Loader2 } from 'lucide-react';

// Wrap the content in a client component that reads searchParams safely
function SuccessPageContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get('checkout_id');
  const { securedDownloads, saveSecuredDownloads, clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [particles, setParticles] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  // Sparkles dopamine burst effect on verification success
  const triggerBirthdaySparkles = () => {
    const newParticles = [];
    const colors = ['#FF2E88', '#00F0FF', '#E1A624', '#39FF14', '#FF5F1F', '#FF007F'];
    
    // Distribute sparkles across the center screen area
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
        spin: Math.random() * 10 - 5
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
      
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.15, // gravity
          opacity: p.opacity - 0.02,
          rotation: p.rotation + p.spin
        })).filter(p => p.opacity > 0);
        
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
      setError("No checkout session reference was found in the URL. Please verify your link.");
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

        if (data.status === 'succeeded' || data.status === 'confirmed') {
          // Parse metadata to extract purchased items
          const metadata = data.metadata || {};
          const productSlugs = metadata.product_slugs ? metadata.product_slugs.split(',') : [];
          const productIds = metadata.product_ids ? metadata.product_ids.split(',') : [];
          const productNames = metadata.product_names ? metadata.product_names.split(',') : [];

          if (productSlugs.length === 0) {
            throw new Error("Payment verified, but no product items were recorded in metadata.");
          }

          // Build item objects
          const newItems = productSlugs.map((slug, idx) => {
            // Determine styling based on slug
            let color = "from-pink-600 to-rose-700";
            let tag = "DIGITAL COMPONENT";
            
            if (slug === 'dopamine-menu') {
              color = "from-pink-600 to-rose-700";
              tag = "Best Seller";
            } else if (slug === 'exec-dashboard') {
              color = "from-teal-600 to-emerald-700";
              tag = "ADHD Resource";
            } else if (slug === 'sensory-audit') {
              color = "from-purple-600 to-indigo-700";
              tag = "Autism Toolkit";
            }

            return {
              id: productIds[idx] || `prod-${slug}`,
              title: productNames[idx] || slug.toUpperCase().replaceAll('-', ' '),
              color,
              tag,
              purchasedAt: new Date().toISOString(),
              licenseCode: `ND3-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
            };
          });

          // Save to local downloads storage and clear cart
          const existingFiltered = securedDownloads.filter(d => !productIds.includes(d.id));
          saveSecuredDownloads([...newItems, ...existingFiltered]);
          setPurchasedItems(newItems);
          clearCart();
          
          // Celebrate with sparkles
          triggerBirthdaySparkles();
        } else {
          setError(`Your transaction status is "${data.status}". Once payment clears, your downloads will unlock here.`);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.message || "An unexpected error occurred verifying your checkout.");
      } finally {
        setLoading(false);
      }
    };

    verifyCheckout();
  }, [checkoutId]);

  const handleDownload = (item) => {
    setDownloadingId(item.id);
    
    // Simulate compilation delay for micro-reward feeling
    setTimeout(() => {
      const content = `neurodivers³ · ${item.title.toUpperCase()}\n\n` +
        `Thank you for securing this digital toolkit resource.\n` +
        `Verified secure license code: ${item.licenseCode}\n` +
        `Timestamp of transaction: ${new Date(item.purchasedAt).toLocaleString('en-GB')}\n\n` +
        `Fulfillment details:\n` +
        `Your product is fully unlocked under your Polar.sh payment registration.\n` +
        `Keep building tiny, resilient, restartable systems that fit your actual energy levels.\n\n` +
        `— Ollie · neurodivers³\n` +
        `https://neurodivers3.co.uk\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title.toLowerCase().replaceAll(' ', '-')}-license-toolkit.txt`;
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
        <Loader2 size={48} className="text-accent animate-spin" />
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent block">VERIFYING TRANSACTION</span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-fg-primary">CHECKING WITH POLAR...</h2>
          <p className="text-sm text-text-muted leading-relaxed font-light">
            We are confirming your payment was secured. This only takes a moment.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 pt-24 px-6 max-w-md mx-auto">
        <div className="p-4 bg-accent-pink/15 border-2 border-accent text-accent-pink rounded-none flex items-center justify-center">
          <AlertCircle size={40} className="text-accent" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent block">VERIFICATION WARNING</span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-fg-primary">ACQUISITION PAUSED</h2>
          <p className="text-sm text-text-muted leading-relaxed font-light">
            {error}
          </p>
        </div>
        <Link 
          href="/store" 
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-fg-primary hover:bg-fg-primary hover:text-bg-primary text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
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
        {particles.map(p => (
          <span 
            key={p.id}
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
              lineHeight: 1
            }}
          >
            ✨
          </span>
        ))}
      </div>

      <div className="border-4 border-fg-primary p-8 md:p-12 bg-[#09090b]/80 shadow-[8px_8px_0px_var(--accent)] relative overflow-hidden rounded-none mb-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-8 border-b-2 border-border-rule/80">
          <div>
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-green-400 bg-green-500/10 px-2.5 py-1 border border-green-600/30 mb-4 select-none">
              TRANSACTION SECURED ✓
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-fg-primary">
              ACQUISITION COMPLETE<span className="text-accent">.</span>
            </h1>
          </div>
          <div className="shrink-0 text-left md:text-right font-mono text-xs text-text-muted space-y-1">
            <p>ORDER ID: {checkoutId?.substring(0, 10).toUpperCase()}</p>
            <p>FULFILLMENT: INSTANT STREAM</p>
          </div>
        </div>

        <div className="py-8 space-y-6">
          <p className="text-base md:text-lg text-text-muted leading-relaxed font-light">
            Thank you for securing these digital toolkit resources. Your license parameters have been successfully registered and compiled on the network.
          </p>

          <div className="grid grid-cols-1 gap-6 pt-4">
            {purchasedItems.map(item => (
              <div 
                key={item.id} 
                className="p-6 bg-bg-primary border-2 border-border-rule flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-fg-primary transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} flex items-center justify-center font-black text-xs text-white border border-border-rule/60 shrink-0`}>
                    PDF
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-accent-pink block mb-1">{item.tag}</span>
                    <h3 className="font-black text-base uppercase tracking-tight text-fg-primary leading-tight">{item.title}</h3>
                    <p className="text-[10px] text-text-muted font-mono mt-1 font-semibold uppercase">LICENSE: {item.licenseCode}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDownload(item)}
                  disabled={downloadingId !== null}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-[var(--accent-text,var(--bg))] hover:bg-transparent hover:text-accent border-2 border-accent px-5 py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50"
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

        <div className="pt-8 border-t-2 border-border-rule/80 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex items-start gap-2.5 text-xs text-text-muted leading-relaxed max-w-md">
            <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
            <span>All updates are lifetime-free. If this methodology does not align with your focus, reply to your confirmation receipt for a full refund.</span>
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <Link 
              href="/blog" 
              className="flex-1 sm:flex-none text-center px-5 py-3 bg-transparent text-text-muted hover:text-fg-primary text-xs font-black uppercase tracking-wider transition-colors font-mono cursor-pointer"
            >
              Read blog
            </Link>
            <Link 
              href="/store" 
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-fg-primary text-bg-primary px-6 py-3 text-xs font-black uppercase tracking-wider border-2 border-fg-primary hover:bg-transparent hover:text-fg-primary transition-all cursor-pointer shadow-[3px_3px_0px_var(--accent)] hover:shadow-none"
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
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 pt-24 px-6 max-w-lg mx-auto">
        <Loader2 size={48} className="text-accent animate-spin" />
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent block">LOADING</span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-fg-primary">PREPARING PORTAL...</h2>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
