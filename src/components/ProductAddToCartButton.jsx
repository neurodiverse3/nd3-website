"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductAddToCartButton({ product }) {
  const { cart, addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [particles, setParticles] = useState([]);

  const itemId = product._id || product.id;
  const inCart = cart.some(c => c.id === itemId);

  useEffect(() => {
    setIsAdded(inCart);
  }, [inCart]);

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

  const triggerDopamineSparkles = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const colors = ['#FF2E88', '#00F0FF', '#E1A624', '#39FF14', '#FF5F1F', '#FF007F'];
    const newParticles = [];
    
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      const size = 10 + Math.random() * 16;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (2 + Math.random() * 2), // upward bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        opacity: 1,
        rotation: Math.random() * 360,
        spin: Math.random() * 14 - 7
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleAction = (e) => {
    if (isAdded) return;
    
    const normalisedItem = {
      id: itemId,
      title: product.title,
      price: product.price,
      tag: product.tag,
      color: product.color || "from-pink-600 to-rose-700",
      desc: product.excerpt || product.desc || "",
      slug: product.slug || product.slug?.current || "",
      gumroadUrl: product.gumroadUrl || ""
    };
    
    addToCart(normalisedItem);
    triggerDopamineSparkles(e);
    setIsAdded(true);
  };

  return (
    <div className="relative w-full">
      {/* Sparkles floating overlay */}
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

      <button
        onClick={handleAction}
        disabled={isAdded}
        className={`w-full py-5 border font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
          isAdded
            ? 'bg-transparent text-green-400 border-green-600/50 cursor-default'
            : 'bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-[var(--accent)] hover:bg-transparent hover:text-[var(--accent)] hover:shadow-[4px_4px_0px_var(--accent)] active:scale-[0.98]'
        }`}
      >
        {isAdded ? (
          <>
            <CheckCircle2 size={18} /> ADDED TO YOUR TOOLKIT
          </>
        ) : (
          <>
            <ShoppingBag size={18} /> SECURE THIS RESOURCE
          </>
        )}
      </button>
    </div>
  );
}
