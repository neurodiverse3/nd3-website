"use client";
import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Zap, CheckCircle2, Loader2, Download, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    isCheckingOut, 
    activeQueueIndex, 
    purchasedSlugs, 
    securedDownloads, 
    startCheckoutQueue, 
    cancelCheckoutQueue, 
    checkoutStatus, 
    checkoutError, 
    setCheckoutError 
  } = useCart();

  const [downloadingId, setDownloadingId] = useState(null);
  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  const getSlugFromUrl = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0].toLowerCase();
  };

  const handleCompileDownload = (item) => {
    setDownloadingId(item.id);
    
    // Assembling compiler delay (satisfying neural reward spacing)
    setTimeout(() => {
      const content = `neurodivers³ · ${item.title.toUpperCase()}\n\n` +
        `Thank you for securing this digital toolkit resource.\n` +
        `Verified secure license code: ${item.licenseCode || 'ND3-XXXXXX'}\n` +
        `Timestamp of transaction: ${new Date(item.purchasedAt).toLocaleString('en-GB')}\n\n` +
        `Fulfillment details:\n` +
        `Your product is fully unlocked under your Gumroad payment registration.\n` +
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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
      
      <div className="relative w-full max-w-md bg-bg-primary h-full border-l border-border-rule p-8 md:p-10 shadow-[0_0_120px_rgba(0,0,0,1)] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        
        {/* Header Block */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-pink block">ND3 HUB</span>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-fg-primary mt-1">
              {isCheckingOut ? 'ACQUISITION' : 'THE TOOLKIT'}
            </h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="text-text-muted hover:text-fg-primary p-2 cursor-pointer transition-colors"><X size={28}/></button>
        </div>

        {/* Dynamic Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          
          {/* Active Checkout Progress Queue */}
          {isCheckingOut ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
              <Loader2 size={48} className="text-accent animate-spin" />
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent block">SECURE CONNECTION</span>
                <h3 className="text-xl font-black uppercase tracking-tight text-fg-primary">CONNECTING TO POLAR...</h3>
                <p className="text-xs text-text-muted max-w-[24ch] mx-auto leading-relaxed">
                  We are opening your secure checkout portal. You will be redirected shortly.
                </p>
              </div>
              <button 
                onClick={cancelCheckoutQueue}
                className="px-4 py-2 mt-4 bg-transparent text-text-muted hover:text-accent border border-border-rule hover:border-accent text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* Standard Cart Listing */}
              {cart.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-widest block">SELECTED ITEMS</span>
                  {cart.map(item => (
                    <div key={item.id} className="p-4 bg-bg-primary border border-border-rule flex justify-between items-center group shadow-md relative">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} shrink-0 border border-border-rule`}></div>
                        <div className="text-left">
                          <h4 className="font-bold text-xs uppercase tracking-tight text-fg-primary leading-snug">{item.title}</h4>
                          <p className="text-[9px] text-text-muted font-black tracking-widest mt-1.5 uppercase font-mono">DIGITAL DOWNLOAD</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-xs text-fg-primary">£{item.price}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-text-muted hover:text-accent-pink transition-colors p-1.5 cursor-pointer"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {cart.length === 0 && securedDownloads.length === 0 && (
                <div className="text-center py-28 opacity-30 text-text-muted">
                  <ShoppingBag size={56} className="mx-auto mb-5" />
                  <p className="font-black uppercase text-[10px] tracking-[0.25em]">YOUR TOOLKIT IS EMPTY</p>
                </div>
              )}

              {/* Secured Downloads Tab (Local Storage persistence!) */}
              {securedDownloads.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-border-rule/50">
                  <span className="text-[9px] font-mono font-bold text-green-400 uppercase tracking-widest block">SECURED RESOURCES ({securedDownloads.length})</span>
                  <div className="space-y-3">
                    {securedDownloads.map(item => {
                      const isThisDownloading = downloadingId === item.id;
                      return (
                        <div key={item.id} className="p-4 bg-green-500/5 border border-green-600/30 flex justify-between items-center shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-none bg-gradient-to-br ${item.color} flex items-center justify-center font-black text-[9px] text-white shrink-0 border border-green-600/20`}>
                              PDF
                            </div>
                            <div className="text-left">
                              <h4 className="font-black text-xs uppercase tracking-tight text-fg-primary leading-tight">{item.title}</h4>
                              <p className="text-[8px] text-text-muted font-bold mt-1 uppercase font-mono">License Verified ✓</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCompileDownload(item)}
                            disabled={downloadingId !== null}
                            className="flex items-center justify-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider cursor-pointer disabled:opacity-50 transition-all"
                          >
                            {isThisDownloading ? (
                              <>
                                <Loader2 size={10} className="animate-spin" /> Compiling...
                              </>
                            ) : (
                              <>
                                <Download size={10} /> Download
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Checkout Controls */}
        {cart.length > 0 && !isCheckingOut && (
          <div className="mt-6 pt-6 border-t border-border-rule space-y-5">
            {checkoutError && (
              <div className="bg-bg-primary border-2 border-accent-pink p-3 shadow-[2px_2px_0px_var(--accent)] text-left flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[9px] font-black uppercase text-accent-pink tracking-widest">⚠️ CHECKOUT WARNING</span>
                  <button onClick={() => setCheckoutError(null)} className="text-text-muted hover:text-fg-primary text-[8px] uppercase font-bold tracking-widest font-mono cursor-pointer">[DISMISS]</button>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed font-mono">
                  {checkoutError}
                </p>
              </div>
            )}

            <div className="flex justify-between items-end">
              <span className="text-text-muted uppercase text-[9px] font-black tracking-[0.2em]">Investment Total</span>
              <span className="text-3xl font-black text-fg-primary font-display">£{cartTotal}</span>
            </div>
            
            <button 
              onClick={startCheckoutQueue}
              className="w-full py-4.5 bg-accent-pink text-bg-primary font-black rounded-none border-2 border-fg-primary hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 transition-all shadow-[4px_4px_0px_var(--fg)] flex items-center justify-center gap-3 uppercase tracking-wider text-xs cursor-pointer"
            >
              <Zap size={16} /> COMPLETE ORDER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
