"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

function DownloadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    async function verifySession() {
      if (!sessionId) {
        setLoading(false);
        setError("No active session detected. If you just purchased a resource, check your inbox.");
        return;
      }

      try {
        const res = await fetch(`/api/checkout/session?session_id=${sessionId}`);
        const data = await res.json();
        
        if (res.ok && data.success) {
          setPurchasedItems(data.items || []);
          setCustomerEmail(data.customer_email || "");
        } else {
          setError(data.error || "Could not verify your checkout session.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Network connection issue. Please contact support.");
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [sessionId]);

  const handleDownload = (item) => {
    const itemId = item.id || item._id;
    setDownloadingId(itemId);
    
    // Simulate a compilation assembly delay (satisfying dopamine hit!)
    setTimeout(() => {
      const content = `neurodivers³ — ${item.title.toUpperCase()}\n\n` +
        `Thank you for securing this resource.\n` +
        `Order verified under customer email: ${customerEmail || 'N/A'}\n\n` +
        `This file contains your verified license and digital download assets.\n` +
        `Keep building tiny, restartable systems that fit your actual energy levels.\n\n` +
        `— Ollie • neurodivers³\n` +
        `https://neurodivers3.co.uk\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title.toLowerCase().replaceAll(' ', '-')}-toolkit.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloadingId(null);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] animate-pulse">ASSEMBLING SECURE DOWNLOAD LINKS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-primary border-4 border-fg-primary p-8 md:p-12 rounded-none text-center shadow-[10px_10px_0px_var(--rule)] w-full text-left max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500 rounded-none flex items-center justify-center mx-auto mb-6 text-red-500 shadow-[3px_3px_0px_red]">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-fg-primary text-center">ACCESS PENDING</h2>
        <p className="text-text-muted mb-8 text-center font-sans text-sm leading-relaxed">{error}</p>
        
        <button 
          onClick={() => router.push('/store')}
          className="w-full py-4 border border-[var(--rule)] hover:border-[var(--accent)] text-xs font-black uppercase tracking-widest transition-all cursor-pointer font-mono flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} /> Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary border-4 border-fg-primary p-8 md:p-12 rounded-none text-center shadow-[10px_10px_0px_var(--rule)] w-full text-left">
      {/* Success block indicator */}
      <div className="w-20 h-20 bg-accent-pink border-4 border-fg-primary rounded-none flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_var(--fg)] text-bg-primary">
        <CheckCircle2 size={40} strokeWidth={3} />
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter text-fg-primary text-center">ACCESS GRANTED</h2>
      <p className="text-text-muted mb-8 text-center font-sans text-sm">
        Your digital tools have been compiled and verified for <strong className="text-[var(--fg)]">{customerEmail}</strong>.
      </p>
      
      <div className="space-y-6">
        {purchasedItems.map((item) => {
          const itemId = item.id || item._id;
          const isThisDownloading = downloadingId === itemId;
          return (
            <div 
              key={itemId} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-bg-primary rounded-none border-2 border-border-rule hover:border-fg-primary transition-all shadow-[4px_4px_0px_var(--rule)] hover:shadow-none hover:translate-x-0.5 hover:-translate-y-0.5 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-none bg-gradient-to-br ${item.color || 'from-pink-600 to-rose-700'} flex items-center justify-center font-black text-xs text-white border border-border-rule shrink-0 shadow-sm`}>
                  PDF
                </div>
                <div className="text-left">
                  <h4 className="font-black text-fg-primary text-lg uppercase tracking-tight leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1 font-mono">Verified Purchase • Asset v1.3</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleDownload(item)}
                disabled={downloadingId !== null}
                className="flex items-center justify-center gap-2 bg-accent-pink text-bg-primary px-5 py-3 border-2 border-fg-primary rounded-none font-black text-sm uppercase tracking-wider hover:-translate-y-0.5 hover:translate-x-0.5 shadow-[2px_2px_0px_var(--fg)] hover:shadow-none transition-all cursor-pointer sm:shrink-0 disabled:opacity-50"
              >
                {isThisDownloading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Compiling...
                  </>
                ) : (
                  <>
                    <Download size={16} strokeWidth={2.5} /> Compile & Download
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={() => router.push('/')}
        className="mt-12 text-text-muted hover:text-accent-pink transition-colors flex items-center gap-2 mx-auto uppercase text-xs font-black tracking-widest cursor-pointer font-mono"
      >
        <ArrowLeft size={14} /> Return Home
      </button>
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <section className="py-20 px-6 max-w-3xl mx-auto animate-in zoom-in-95 duration-500 min-h-[80vh] flex items-center justify-center">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] animate-pulse">INITIALIZING SECURE LAYER...</p>
        </div>
      }>
        <DownloadsContent />
      </Suspense>
    </section>
  );
}
