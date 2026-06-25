"use client";
import React, { useState, useEffect } from 'react';
import { Link2, Check, Share2, Plus, Minus, Printer, Mail } from 'lucide-react';

const XIcon = ({ size = 11, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ size = 11, color = "#1877F2" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = ({ size = 11, color = "#0A66C2" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const RedditIcon = ({ size = 11, color = "#FF4500" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72l1.27-5.95 4.15.88c.08 1.14 1.05 2.05 2.22 2.05 1.24 0 2.25-1.01 2.25-2.25S21.39 1.5 20.15 1.5c-1 0-1.85.64-2.14 1.55l-4.63-.98c-.24-.05-.48.1-.55.33l-1.43 6.69c-2.38.08-4.56.73-6.26 1.76-.56-.78-1.48-1.27-2.46-1.27-1.65 0-3 1.35-3 3 0 1.24.76 2.3 1.84 2.76-.04.28-.06.57-.06.86 0 4.14 5.37 7.5 12 7.5s12-3.36 12-7.5c0-.29-.02-.58-.06-.86 1.08-.46 1.84-1.52 1.84-2.76zm-17.5 1.5c0-1.1.9-2 2-2s2 .9 2 2c0 1.09-.89 1.99-2 1.99s-2-.9-2-1.99zm10.74 5.48c-1.37 1.37-4.46 1.43-5.24 1.43s-3.87-.06-5.24-1.43c-.23-.23-.23-.6 0-.82.23-.23.6-.23.83 0 1.04 1.04 3.32 1.14 4.41 1.14s3.37-.1 4.41-1.14c.23-.23.6-.23.83 0 .23.23.23.6 0 .82zm.26-3.49c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 11, color = "#25D366" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M12.031 0C5.405 0 .015 5.39.015 12.016c0 2.115.553 4.183 1.603 6.002L.014 24l6.143-1.612a11.97 11.97 0 005.874 1.535h.005c6.623 0 12.013-5.39 12.013-12.016S18.654 0 12.031 0zm0 21.91h-.004a9.96 9.96 0 01-5.068-1.385l-.363-.215-3.766.987.999-3.674-.236-.375a9.98 9.98 0 01-1.525-5.334C2.064 6.42 6.574 1.91 12.034 1.91 14.67 1.91 17.15 2.936 19.015 4.803a9.95 9.95 0 012.923 7.086c0 5.495-4.51 10.021-9.907 10.021zM17.47 14.502c-.298-.15-1.764-.87-2.037-.97-.272-.1-.472-.15-.67.15-.198.301-.767.97-.941 1.171-.174.202-.348.226-.646.076-1.558-.787-2.613-1.465-3.623-3.155-.262-.437.26-.412.783-1.458.125-.25.063-.475-.012-.625-.075-.15-.67-1.615-.918-2.21-.242-.581-.487-.502-.67-.512-.174-.01-.373-.01-.573-.01-.198 0-.522.075-.796.375-.272.3-1.042 1.018-1.042 2.484 0 1.465 1.067 2.88 1.216 3.08.149.2 2.102 3.208 5.093 4.498 1.921.828 2.684.879 3.535.736.963-.162 2.723-1.112 3.109-2.187.385-1.076.385-2.001.272-2.188-.113-.187-.411-.287-.709-.437z"/>
  </svg>
);

const TelegramIcon = ({ size = 11, color = "#24A1DE" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const MastodonIcon = ({ size = 11, color = "#6364FF" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M23.268 5.313c-.35-2.228-2.618-3.616-5.3-3.924C16.536 1.23 14.28 1.05 12 1.05c-2.28 0-4.536.18-5.968.339-2.682.308-4.95 1.696-5.3 3.924C.3 7.551 0 11.236 0 11.236c0 3.849.208 7.378 1.488 9.539 1.42 2.428 4.298 3.125 6.782 3.125 3.01 0 5.48-.962 6.545-1.442l-.213-2.523c-1.378.508-3.242.753-4.92.57-2.25-.246-2.528-1.758-2.613-2.148-.05-.23-.058-.458-.058-.458 1.838.455 3.738.711 5.688.75 1.706.035 3.398-.198 5.068-.696 2.05-.615 3.69-2.254 4.336-4.321.492-1.572.766-3.874.766-3.874.15-2.906-.11-5.617-.6-7.397zM17.473 14.5h-2.513v-5.28c0-1.287-.492-1.93-1.477-1.93-1.077 0-1.615.717-1.615 2.152v3.313H9.426V9.442c0-1.435-.538-2.152-1.615-2.152-.985 0-1.477.643-1.477 1.93v5.28H3.82V8.905c0-1.32.327-2.348.98-3.084.665-.75 1.543-1.127 2.633-1.127 1.252 0 2.18.527 2.784 1.583l.833 1.52.833-1.52c.604-1.056 1.532-1.583 2.784-1.583 1.09 0 1.968.377 2.633 1.127.653.736.98 1.764.98 3.084v5.595z"/>
  </svg>
);

const ThreadsIcon = ({ size = 11, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M12 24C5.372 24 0 18.627 0 12S5.372 0 12 0c2.812 0 5.485.955 7.625 2.753.111.094.135.257.054.379L18.498 4.9a.286.286 0 0 1-.39.066A9.395 9.395 0 0 0 12 2.833c-5.056 0-9.167 4.111-9.167 9.167S6.944 21.167 12 21.167c4.618 0 8.441-3.418 9.078-7.893h-4.341c-.482 1.344-1.776 2.316-3.321 2.316-1.93 0-3.5-1.57-3.5-3.5V11.5c0-1.93 1.57-3.5 3.5-3.5 1.588 0 2.913 1.037 3.364 2.45h2.898c-.524-2.825-2.986-5-5.962-5-3.308 0-6 2.692-6 6v.584c0 3.308 2.692 6 6 6 2.312 0 4.316-1.31 5.35-3.235l.088-.16c.38-1.503.585-3.08.595-4.698A11.964 11.964 0 0 0 12 24zM13.416 11.5v.584c0 1.103-.897 2-2 2s-2-.897-2-2V11.5c0-1.103.897-2 2-2s2 .897 2 2z"/>
  </svg>
);

const baseChipClass = "flex items-center gap-1.5 px-3 py-1.5 border border-border-rule bg-[#09090b] text-xs md:text-sm font-black uppercase tracking-widest text-fg-primary hover:bg-accent-pink hover:border-accent-pink hover:text-[#09090b] transition-all duration-200 rounded-none cursor-pointer select-none group";

export function SharePost({ title, slug, dek = '', vertical = false }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [mastodonInstance, setMastodonInstance] = useState('mastodon.social');
  const [showMastodonInput, setShowMastodonInput] = useState(false);

  const [url, setUrl] = useState(`https://neurodivers3.co.uk/blog/${slug}`);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if web native sharing is supported
    if (typeof navigator !== 'undefined' && navigator.share) {
      setCanShare(true);
    }
    // Load Mastodon instance from localStorage if available
    if (typeof window !== 'undefined') {
      const savedInstance = localStorage.getItem('nd3_mastodon_instance');
      if (savedInstance) {
        setMastodonInstance(savedInstance);
      }
      setUrl(`${window.location.origin}/blog/${slug}`);
    }
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: dek || title,
        url: url,
      });
    } catch (err) {
      console.warn('Native share failed:', err);
    }
  };

  const shareText = `"${title}"${dek ? ` - ${dek}` : ''}`;
  const encodedText = encodeURIComponent(shareText);
  const currentUrl = mounted ? url : `https://neurodivers3.co.uk/blog/${slug}`;
  const encodedUrl = encodeURIComponent(currentUrl);

  // Intent share anchors
  const xShare = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const emailShare = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this post: "${title}"\n\n"${dek}"\n\nRead more here: ${currentUrl}`)}`;
  
  // More items
  const threadsShare = `https://www.threads.net/intent/post?text=${encodeURIComponent(`"${title}"${dek ? ` - ${dek}` : ''}\n\n${currentUrl}`)}`;
  const linkedinShare = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(dek || '')}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(shareText)}`;
  const redditShare = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(title)}`;
  const whatsappShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(`"${title}"\n\n${currentUrl}`)}`;
  const telegramShare = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  const triggerMastodonShare = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('nd3_mastodon_instance', mastodonInstance);
    }
    const cleanInstance = mastodonInstance.trim().replace(/^https?:\/\//, '');
    const mastodonUrl = `https://${cleanInstance}/share?text=${encodeURIComponent(`"${title}"${dek ? ` - ${dek}` : ''} ${currentUrl}`)}`;
    window.open(mastodonUrl, '_blank', 'noopener,noreferrer');
    setShowMastodonInput(false);
  };

  const handlePrint = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (vertical) {
    const gridBtnClass = "w-[38px] h-[38px] border border-border-rule/70 bg-bg-primary/40 flex items-center justify-center text-text-muted hover:bg-accent-pink/10 hover:border-accent-pink hover:text-accent-pink transition-all duration-200 rounded-none cursor-pointer focus-ring mx-auto";

    return (
      <div className="w-full no-print select-none">
        <div className="grid grid-cols-4 gap-1.5 justify-items-center">
          {/* Copy Link */}
          <button
            onClick={copyLink}
            className={`${gridBtnClass} ${copied ? '!border-green-500 !text-green-400 !bg-green-500/10' : ''}`}
            title="Copy Link"
            aria-label="Copy post link"
          >
            {copied ? <Check size={16} /> : <Link2 size={16} />}
          </button>

          {/* X */}
          <a href={xShare} target="_blank" rel="noopener noreferrer" className={gridBtnClass} title="Share on X" aria-label="Share on X">
            <XIcon size={16} />
          </a>

          {/* Email */}
          <a href={emailShare} className={gridBtnClass} title="Share via Email" aria-label="Share via Email">
            <Mail size={16} />
          </a>

          {/* LinkedIn */}
          <a href={linkedinShare} target="_blank" rel="noopener noreferrer" className={gridBtnClass} title="Share on LinkedIn" aria-label="Share on LinkedIn">
            <LinkedInIcon size={16} />
          </a>

          {/* Facebook */}
          <a href={facebookShare} target="_blank" rel="noopener noreferrer" className={gridBtnClass} title="Share on Facebook" aria-label="Share on Facebook">
            <FacebookIcon size={16} />
          </a>

          {/* Reddit */}
          <a href={redditShare} target="_blank" rel="noopener noreferrer" className={gridBtnClass} title="Share on Reddit" aria-label="Share on Reddit">
            <RedditIcon size={16} />
          </a>

          {/* WhatsApp */}
          <a href={whatsappShare} target="_blank" rel="noopener noreferrer" className={gridBtnClass} title="Share on WhatsApp" aria-label="Share on WhatsApp">
            <WhatsAppIcon size={16} />
          </a>

          {/* Telegram */}
          <a href={telegramShare} target="_blank" rel="noopener noreferrer" className={gridBtnClass} title="Share on Telegram" aria-label="Share on Telegram">
            <TelegramIcon size={16} />
          </a>

          {/* Threads */}
          <a href={threadsShare} target="_blank" rel="noopener noreferrer" className={gridBtnClass} title="Share on Threads" aria-label="Share on Threads">
            <ThreadsIcon size={16} />
          </a>

          {/* Mastodon */}
          <button onClick={() => setShowMastodonInput(!showMastodonInput)} className={gridBtnClass} title="Share on Mastodon" aria-label="Share on Mastodon">
            <MastodonIcon size={16} />
          </button>

          {/* Print */}
          <button onClick={handlePrint} className={gridBtnClass} title="Print" aria-label="Print post">
            <Printer size={16} />
          </button>
        </div>

        {/* Mastodon Instance Picker */}
        {showMastodonInput && (
          <form onSubmit={triggerMastodonShare} className="w-full p-3 border border-border-rule/70 bg-bg-primary/95 flex flex-col gap-2 items-center animate-in slide-in-from-top-2 duration-200 text-left mt-3">
            <label htmlFor="mastodon-server-vertical" className="block text-xs md:text-sm font-mono tracking-widest text-text-muted uppercase font-bold w-full">
              MASTODON SERVER:
            </label>
            <input id="mastodon-server-vertical" type="text" placeholder="mastodon.social" value={mastodonInstance} onChange={(e) => setMastodonInstance(e.target.value)} required className="w-full h-8 bg-bg-primary border border-border-rule/80 focus:border-accent-pink px-2 py-1 font-mono text-xs md:text-sm text-fg-primary outline-none rounded-none" />
            <button type="submit" className="w-full h-8 bg-accent-pink text-bg-primary text-xs md:text-sm font-black uppercase tracking-widest border border-fg-primary hover:opacity-90 transition-opacity cursor-pointer rounded-none">
              SHARE
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-6 border-y border-border-rule/60 my-6 select-none w-full no-print">
      {/* Primary share row */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <span className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-text-muted mr-1">
          SHARE:
        </span>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          className={`${baseChipClass} ${copied ? '!border-green-500 !text-green-400 !bg-green-500/10' : ''}`}
          aria-label="Copy post link"
        >
          {copied ? <Check size={11} className="group-hover:text-[#09090b]" /> : <Link2 size={11} className="group-hover:text-[#09090b]" />}
          {copied ? 'COPIED!' : 'COPY LINK'}
        </button>

        {/* X */}
        <a href={xShare} target="_blank" rel="noopener noreferrer" className={baseChipClass}>
          <XIcon size={11} /> POST
        </a>

        {/* Email */}
        <a href={emailShare} className={baseChipClass}>
          <Mail size={11} className="group-hover:text-[#09090b]" /> EMAIL
        </a>

        {/* Native Share (Mobile Only) */}
        {canShare && (
          <button onClick={handleNativeShare} className={`${baseChipClass} md:hidden`}>
            <Share2 size={11} className="group-hover:text-[#09090b]" /> SHARE
          </button>
        )}

        {/* More/Less toggle */}
        <button onClick={() => setShowMore(!showMore)} className={baseChipClass}>
          {showMore ? <Minus size={11} className="group-hover:text-[#09090b]" /> : <Plus size={11} className="group-hover:text-[#09090b]" />}
          {showMore ? 'LESS' : 'MORE'}
        </button>
      </div>

      {/* Expandable "More" sharing tools grid */}
      {showMore && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 pt-3 border-t border-dashed border-border-rule/50 animate-in fade-in duration-300">
          
          <a href={linkedinShare} target="_blank" rel="noopener noreferrer" className={baseChipClass}>
            <LinkedInIcon size={11} /> LINKEDIN
          </a>
          
          <a href={facebookShare} target="_blank" rel="noopener noreferrer" className={baseChipClass}>
            <FacebookIcon size={11} /> FACEBOOK
          </a>
          
          <a href={redditShare} target="_blank" rel="noopener noreferrer" className={baseChipClass}>
            <RedditIcon size={11} /> REDDIT
          </a>

          <a href={whatsappShare} target="_blank" rel="noopener noreferrer" className={baseChipClass}>
            <WhatsAppIcon size={11} /> WHATSAPP
          </a>

          <a href={telegramShare} target="_blank" rel="noopener noreferrer" className={baseChipClass}>
            <TelegramIcon size={11} /> TELEGRAM
          </a>

          <a href={threadsShare} target="_blank" rel="noopener noreferrer" className={baseChipClass}>
            <ThreadsIcon size={11} /> THREADS
          </a>

          <button onClick={() => setShowMastodonInput(!showMastodonInput)} className={baseChipClass}>
            <MastodonIcon size={11} /> MASTODON
          </button>

          <button onClick={handlePrint} className={baseChipClass}>
            <Printer size={11} className="group-hover:text-[#09090b]" /> PRINT
          </button>
        </div>
      )}

      {/* Mastodon Instance Picker popover overlay */}
      {showMastodonInput && (
        <form 
          onSubmit={triggerMastodonShare}
          className="p-4 border border-border-rule bg-[#09090b] flex flex-col sm:flex-row gap-3 items-center animate-in slide-in-from-top-2 duration-200 w-full max-w-md self-start text-left mt-1"
        >
          <div className="flex-grow w-full">
            <label htmlFor="mastodon-server" className="block text-xs md:text-sm font-mono tracking-widest text-text-muted uppercase mb-1 font-bold">
              MASTODON SERVER URL:
            </label>
            <input
              id="mastodon-server"
              type="text"
              placeholder="e.g. mastodon.social"
              value={mastodonInstance}
              onChange={(e) => setMastodonInstance(e.target.value)}
              required
              className="w-full h-9 bg-black border border-border-rule focus:border-accent-pink px-3 py-1 font-mono text-xs text-white outline-none rounded-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto h-9 px-4 bg-accent-pink text-bg-primary text-xs font-black uppercase tracking-widest border border-fg-primary hover:opacity-90 transition-opacity cursor-pointer rounded-none mt-4 sm:mt-4 self-end"
          >
            SHARE
          </button>
        </form>
      )}
    </div>
  );
}
