"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { addComment } from '../app/actions/comments';

// Helper to generate initials from name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper to generate a unique HSL gradient based on name string
const generateAvatarStyle = (name) => {
  if (!name) return { background: 'linear-gradient(135deg, #FF2E88, #00F0FF)' };
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Custom curated HSL colors for sensory-friendly contrast
  const h1 = Math.abs(hash % 360);
  const h2 = Math.abs((hash * 13) % 360);
  const s = 70 + Math.abs((hash * 7) % 20); // 70-90% saturation
  const l1 = 45 + Math.abs((hash * 3) % 10); // 45-55% lightness
  const l2 = 20 + Math.abs((hash * 5) % 15); // 20-35% lightness for dark background gradient
  
  return {
    background: `linear-gradient(135deg, HSL(${h1}, ${s}%, ${l1}%), HSL(${h2}, ${s}%, ${l2}%))`,
    color: '#ffffff',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'
  };
};

// Helper to format timestamps nicely
const formatCommentDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function CommentSection({ postSlug, postTitle = "Transmission", initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [honey, setHoney] = useState(''); // Spam honeypot
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [particles, setParticles] = useState([]);
  const submitButtonRef = useRef(null);

  // Synchronise comments if initialComments update (on route/post slug navigation)
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Particles animation tick loop (dopamine hit on successful submit!)
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

  const triggerSubmitSparkles = () => {
    if (!submitButtonRef.current) return;
    const rect = submitButtonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const colors = ['#FF2E88', '#00F0FF', '#E1A624', '#39FF14', '#FF5F1F', '#FF007F'];
    const newParticles = [];
    
    for (let i = 0; i < 35; i++) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Frontend validation checks
    if (!name || name.trim().length < 2) {
      setSubmitError('Name must be at least 2 characters.');
      return;
    }
    if (!email || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!content || content.trim().length < 3) {
      setSubmitError('Comments must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);

    // Compile standard HTML FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('content', content);
    formData.append('company', honey); // Honeypot field

    try {
      const response = await addComment(postSlug, null, formData);

      if (response.success) {
        setSubmitSuccess(true);
        triggerSubmitSparkles();
        
        // Reset form inputs (excluding honey)
        setName('');
        setEmail('');
        setContent('');
        
        // We no longer append the comment immediately since it requires moderation
        if (response.comment) {
          // Fallback if local dev simulated comment is returned
          setComments(prev => [...prev, response.comment]);
        }
      } else {
        setSubmitError(response.error || 'Failed to submit comment. Please try again.');
      }
    } catch (err) {
      console.error('Comment action failed:', err);
      setSubmitError('Something glitched on the server. Please try again in a second.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[680px] mx-auto mt-16 pt-12 border-t border-border-rule/65 text-left font-sans">
      
      {/* Dopamine sparkles container */}
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

      {/* Timeline comments header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <MessageSquare size={22} className="text-accent" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-fg-primary">
            Replies ({comments.length})
          </h3>
        </div>
      </div>

      {/* Timeline Comments List */}
      <div className="space-y-8 mb-16">
        {comments.length === 0 ? (
          <div className="p-8 border border-dashed border-border-rule/50 text-center text-text-muted/65 italic text-sm select-none">
            No replies yet — be the first.
          </div>
        ) : (
          <div className="relative border-l border-border-rule/60 pl-6 sm:pl-8 ml-4 space-y-8">
            {comments.map((c) => (
              <div key={c.id} className="relative group text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Timeline node avatar */}
                <div 
                  className="absolute left-[-42px] sm:left-[-50px] w-9 h-9 rounded-none flex items-center justify-center font-black text-xs border border-border-rule/80 select-none shadow-sm"
                  style={generateAvatarStyle(c.name)}
                >
                  {getInitials(c.name)}
                </div>

                {/* Comment Body */}
                <div className="bg-[#09090b]/40 border border-border-rule/80 p-5 shadow-[3px_3px_0px_var(--rule)] hover:border-accent/40 hover:shadow-[4px_4px_0px_var(--accent-soft)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <span className="font-black text-sm uppercase tracking-tight text-fg-primary">
                      {c.name}
                    </span>
                    <time className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                      {formatCommentDate(c.createdAt)}
                    </time>
                  </div>
                  
                  <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap font-sans font-light">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Input Form Box */}
      <div className="border-4 border-fg-primary p-6 md:p-8 bg-bg-primary/50 shadow-[6px_6px_0px_var(--rule)] relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <span className="text-[9px] font-mono tracking-widest uppercase text-accent block font-bold">
            LEAVE A REPLY
          </span>
          <a 
            href={`mailto:hello@neurodivers3.co.uk?subject=${encodeURIComponent(`Reply: ${postTitle}`)}`} 
            className="text-[9px] font-mono tracking-widest text-text-muted hover:text-accent transition-colors font-bold uppercase underline focus-ring"
          >
            Reply by email →
          </a>
        </div>
        
        {submitSuccess && (
          <div className="p-4 bg-green-500/10 border-2 border-green-600/50 text-green-400 text-xs font-mono font-bold flex items-start gap-2.5 mb-6 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="uppercase block mb-1">✓ Reply Sent for Review</span>
              <span>Thank you for contributing. Your reply will appear here once approved.</span>
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-[var(--accent-soft)] border-2 border-accent/50 text-accent text-xs font-mono font-bold flex items-start gap-2.5 mb-6 animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="uppercase block mb-1">⚠️ Submission Fault</span>
              <span>{submitError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" aria-live="polite">
          {/* Bot Honeypot field (hidden) */}
          <input
            type="text"
            name="company"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name-input" className="text-[10px] font-mono uppercase text-text-muted tracking-wider block font-bold">
                Name (Public)
              </label>
              <input
                id="name-input"
                type="text"
                required
                disabled={isSubmitting}
                placeholder="Ollie Clews"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 bg-[#09090b] border-2 border-text-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/15 px-4 outline-none text-fg-primary text-sm font-bold shadow-[2px_2px_0px_var(--rule)] transition-all duration-200 rounded-none placeholder:text-text-muted/65"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-[10px] font-mono uppercase text-text-muted tracking-wider block font-bold">
                Email (Private)
              </label>
              <input
                id="email-input"
                type="email"
                required
                disabled={isSubmitting}
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-[#09090b] border-2 border-text-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/15 px-4 outline-none text-fg-primary text-sm font-bold shadow-[2px_2px_0px_var(--rule)] transition-all duration-200 rounded-none placeholder:text-text-muted/65"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="content-input" className="text-[10px] font-mono uppercase text-text-muted tracking-wider block font-bold">
              Reply
            </label>
            <textarea
              id="content-input"
              required
              disabled={isSubmitting}
              rows={4}
              placeholder="What did this trigger in your own brain? Keep it thoughtful, sensory-friendly, and constructive."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#09090b] border-2 border-text-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/15 px-4 py-3 outline-none text-fg-primary text-sm font-light leading-relaxed shadow-[2px_2px_0px_var(--rule)] transition-all duration-200 rounded-none placeholder:text-text-muted/65 resize-y min-h-[100px]"
            />
          </div>

          <button
            ref={submitButtonRef}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4.5 bg-accent hover:bg-accent/90 text-bg-primary font-black border-2 border-fg-primary rounded-none shadow-[3px_3px_0px_var(--fg)] hover:shadow-[2px_2px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin"></div> SENDING...
              </>
            ) : (
              <>
                <Send size={14} /> Send Reply
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
