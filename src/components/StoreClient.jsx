"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { DocumentPreview } from './DocumentPreview';
import { useCart } from '../context/CartContext';

const fallbackProducts = [
  { id: "default-1", _id: "default-1", title: "Dopamine Menu Template", price: 7, tag: "Best Seller", color: "from-pink-600 to-rose-700", desc: "A curated strategy to break through ADHD paralysis.", slug: "dopamine-menu", gumroadUrl: "https://neurodivers3.gumroad.com/l/dopamine-menu" },
  { id: "default-2", _id: "default-2", title: "Exec-Function Dashboard", price: 12, tag: "ADHD Resource", color: "from-teal-600 to-emerald-700", desc: "Planner system that prioritizes energy over urgency.", slug: "exec-dashboard", gumroadUrl: "https://neurodivers3.gumroad.com/l/exec-dashboard" },
  { id: "default-3", _id: "default-3", title: "Sensory Audit Workbook", price: 15, tag: "Autism Toolkit", color: "from-purple-600 to-indigo-700", desc: "Identify glimmers and triggers in your daily environment.", slug: "sensory-audit", gumroadUrl: "https://neurodivers3.gumroad.com/l/sensory-audit" }
];

export function StoreClient({ initialProducts = [] }) {
  const { cart, addToCart } = useCart();
  const [particles, setParticles] = useState([]);
  
  // Use Sanity products if present, otherwise default products
  const products = initialProducts.length > 0 ? initialProducts : fallbackProducts;

  // Dopamine Sparkles Particle Explosion Generator
  const triggerDopamineSparkles = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const colors = ['#FF2E88', '#00F0FF', '#E1A624', '#3A5A40', '#39FF14', '#FF5F1F', '#FF007F'];
    const newParticles = [];
    
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      const size = 8 + Math.random() * 14;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 2), // upward bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        opacity: 1,
        rotation: Math.random() * 360,
        spin: Math.random() * 12 - 6
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Particles animation tick loop
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
          vy: p.vy + 0.18, // simulated gravity
          opacity: p.opacity - 0.025,
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

  const handleAddToCart = (e, item) => {
    // Normalise fields to ensure they match cart expectations
    const normalisedItem = {
      id: item._id || item.id,
      title: item.title,
      price: item.price,
      tag: item.tag,
      color: item.color || "from-pink-600 to-rose-700",
      desc: item.excerpt || item.desc || "",
      slug: item.slug || item.slug?.current || "",
      gumroadUrl: item.gumroadUrl || ""
    };
    
    addToCart(normalisedItem);
    triggerDopamineSparkles(e);
  };

  return (
    <div>
      {/* Absolute floating particles container */}
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
              textShadow: `0 0 10px ${p.color}`,
              fontSize: `${p.size}px`,
              lineHeight: 1
            }}
          >
            ✨
          </span>
        ))}
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(item => {
          const itemId = item._id || item.id;
          const isAdded = cart.some(c => c.id === itemId);
          const slugVal = item.slug || item.slug?.current || "";
          
          return (
            <div 
              key={itemId} 
              className="group bg-bg-primary/40 border border-[var(--rule)] hover:border-[var(--accent)]/50 transition-all duration-300 flex flex-col justify-between shadow-[4px_4px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 relative overflow-hidden"
            >
              {/* Product Visual Container (Click to view Details Landing Page) */}
              <Link href={`/store/${slugVal}`} className="cursor-pointer block relative overflow-hidden">
                <div className={`h-64 w-full bg-gradient-to-br ${item.color || "from-pink-600 to-rose-700"} relative overflow-hidden flex items-center justify-center p-8 border-b border-[var(--rule)]`}>
                  <div 
                    className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                    }} 
                  />
                  <DocumentPreview title={item.title} color={item.color || "from-pink-600 to-rose-700"} />
                  
                  {/* Premium Hover Overlay indicator */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <span className="text-xs font-black tracking-widest text-[var(--link)] border border-[var(--link)] px-4 py-2 uppercase bg-bg-primary/80">
                      VIEW PRODUCT LANDING PAGE
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs md:text-sm font-mono font-bold uppercase tracking-widest px-2 py-1 bg-[var(--accent-soft)] text-[var(--link,var(--accent))]">
                      {item.tag}
                    </span>
                    <span className="text-xl font-black text-[var(--fg)] font-display">
                      £{item.price}
                    </span>
                  </div>

                  <h2 className="text-xl font-black mb-3 uppercase tracking-tight text-[var(--fg)] leading-tight">
                    {item.title}
                  </h2>
                  
                  <p className="text-xs text-[var(--muted)] mb-8 font-mono leading-relaxed">
                    {item.excerpt || item.desc || ""}
                  </p>
                </div>

                {/* Add to Toolkit Button */}
                <button 
                  onClick={(e) => handleAddToCart(e, item)}
                  disabled={isAdded}
                  className={`w-full py-4 font-black uppercase text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border ${
                    isAdded 
                      ? 'bg-transparent text-green-400 border-green-600/50 cursor-default' 
                      : 'bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-[var(--accent)] hover:bg-transparent hover:text-[var(--link)] hover:border-[var(--accent)] active:scale-[0.98]'
                  }`}
                  aria-label={isAdded ? `${item.title} is added to your toolkit` : `Add ${item.title} to toolkit`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 size={16} /> ADDED TO TOOLKIT
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> ADD TO TOOLKIT
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
