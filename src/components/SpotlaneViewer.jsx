"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, RotateCcw, Sparkles, ExternalLink } from "lucide-react";

/**
 * SpotlaneViewer
 * A premium interactive demo viewer that loads Spotlane JSON files
 * and renders them as clickable, hotspot-driven walkthroughs.
 *
 * Full-screen mode: locks the viewport, hides standard site header/footer,
 * and handles sizing of portrait/landscape PDFs flawlessly.
 *
 * Image protection: disables right-click/dragging, adds an invisible click shield,
 * overlays a subtle SVG watermark, overrides keyboard shortcuts (print/save),
 * and injects styles to prevent printing.
 */

const BRAND_PINK = "#ff007f";

export default function SpotlaneViewer({ slug, className = "" }) {
  const [demo, setDemo] = useState(null);
  const [currentScreenId, setCurrentScreenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Cache of calculated aspect ratios for each screen: { [screenId]: ratio }
  const [aspectRatios, setAspectRatios] = useState({});
  // Navigation history to support the Back button
  const [history, setHistory] = useState([]);
  // Back to store URL
  const [backLink, setBackLink] = useState("/store");

  // Track the referrer page to send user back to product page on completion
  useEffect(() => {
    if (typeof window !== "undefined" && document.referrer && document.referrer.includes("/store/")) {
      setBackLink(document.referrer);
    }
  }, []);

  // Hide site chrome, lock scroll, and inject print-prevention styles on mount
  useEffect(() => {
    const toHide = document.querySelectorAll(
      "nav, header, footer, #navbar, #footer, .sidebar, [role='banner'], [role='contentinfo']"
    );
    const originalDisplays = [];
    toHide.forEach((el) => {
      originalDisplays.push(el.style.display);
      el.style.display = "none";
    });

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000";
    document.body.style.minHeight = "100vh";
    document.documentElement.style.backgroundColor = "#000";

    // Inject print-prevention CSS stylesheet
    const style = document.createElement("style");
    style.id = "spotlane-print-prevention";
    style.innerHTML = `
      @media print {
        body, html, #main, #__next, .fixed, div, section, header, footer {
          display: none !important;
          height: 0 !important;
          overflow: hidden !important;
          opacity: 0 !important;
        }
        body::before {
          content: "Printing is disabled in demo mode. Please purchase the resource to get the printable high-resolution PDF.";
          display: block !important;
          padding: 3rem;
          font-family: sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          color: #ff007f;
          text-align: center;
          background-color: #000 !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      toHide.forEach((el, i) => {
        el.style.display = originalDisplays[i];
      });
      document.body.style.overflow = originalOverflow;
      document.body.style.backgroundColor = "";
      document.body.style.minHeight = "";
      document.documentElement.style.backgroundColor = "";

      const el = document.getElementById("spotlane-print-prevention");
      if (el) el.remove();
    };
  }, []);

  // Load demo JSON
  useEffect(() => {
    async function loadDemo() {
      try {
        const res = await fetch(`/spotlane-demos/${slug}/demo.json`);
        if (!res.ok) throw new Error(`Failed to load demo: ${res.status}`);
        const data = await res.json();
        setDemo(data);
        setCurrentScreenId(data.startScreenId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDemo();
  }, [slug]);

  const currentScreen = demo?.screens.find((s) => s.id === currentScreenId);
  const primaryHotspot = currentScreen?.hotspots?.[0];

  const handleHotspotClick = useCallback(
    (hotspot) => {
      if (hotspot.targetScreenId) {
        setHistory((prev) => [...prev, currentScreenId]);
        setCurrentScreenId(hotspot.targetScreenId);
      } else {
        setCompleted(true);
      }
    },
    [currentScreenId]
  );

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      const prevScreenId = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentScreenId(prevScreenId);
    }
  }, [history]);

  const handleNext = useCallback(() => {
    if (primaryHotspot) {
      handleHotspotClick(primaryHotspot);
    } else if (demo) {
      // Fallback: go to the next screen in order if no hotspots are configured
      const currentIndex = demo.screens.findIndex((s) => s.id === currentScreenId);
      if (currentIndex < demo.screens.length - 1) {
        const nextScreen = demo.screens[currentIndex + 1];
        setHistory((prev) => [...prev, currentScreenId]);
        setCurrentScreenId(nextScreen.id);
      } else {
        setCompleted(true);
      }
    }
  }, [primaryHotspot, currentScreenId, demo, handleHotspotClick]);

  const handleRestart = () => {
    setCompleted(false);
    setHistory([]);
    setCurrentScreenId(demo.startScreenId);
  };

  const handleClose = () => {
    window.location.href = backLink;
  };

  const handleImageLoad = useCallback((e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight && currentScreen) {
      const screenId = currentScreen.id;
      setAspectRatios((prev) => {
        const ratio = naturalWidth / naturalHeight;
        if (prev[screenId] === ratio) return prev;
        return {
          ...prev,
          [screenId]: ratio,
        };
      });
    }
  }, [currentScreen]);

  // Keyboard navigation and shortcut blockers
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Block save (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return;
      }

      // 2. Block print (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        alert("Printing is disabled in demo mode. Please purchase the resource to get the printable high-resolution PDF.");
        return;
      }

      // 3. Block F12 and Ctrl+Shift+I (inspect element)
      if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I")) {
        e.preventDefault();
        return;
      }

      if (completed) return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completed, handleNext, handleBack]);

  const currentAspectRatio = currentScreen ? aspectRatios[currentScreen.id] : null;

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${className}`}
      >
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#ff007f] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black text-red-400 p-6 text-center ${className}`}
      >
        <div className="space-y-4">
          <p className="text-lg font-bold">Failed to load interactive demo</p>
          <p className="text-sm opacity-80">{error}</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors text-xs font-semibold cursor-pointer"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  if (!demo || !currentScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black text-white/60 ${className}`}
      >
        <p>No demo configuration found</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div
        className={`fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center p-6 text-white ${className}`}
      >
        <div className="max-w-md w-full text-center space-y-8 p-8 bg-neutral-900 border-4 border-white/5 shadow-[8px_8px_0px_rgba(255,46,136,0.3)] rounded-lg">
          <div className="mx-auto w-16 h-16 bg-[#ff007f]/10 border-2 border-[#ff007f] rounded-full flex items-center justify-center text-[#ff007f]">
            <Sparkles size={32} />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white font-display">
              Demo Completed!
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              You&apos;ve completed the walkthrough for this digital system. Ready to implement these workflows in your own life?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors font-medium text-sm cursor-pointer border border-white/5"
            >
              <RotateCcw size={16} />
              Restart Demo
            </button>
            <a
              href={backLink}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#ff007f] hover:bg-[#ff007f]/90 text-white rounded-md transition-colors font-bold text-sm cursor-pointer shadow-md"
            >
              Get This Product
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-neutral-950 flex flex-col overflow-hidden text-white ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-white/5 z-30">
        <div className="flex items-center gap-3">
          <h2 className="text-sm md:text-base font-black uppercase tracking-tight text-white font-display">
            {demo.meta?.title || "Product Walkthrough"}
          </h2>
          <span className="text-xs md:text-sm font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/20 rounded-sm">
            Interactive Demo
          </span>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors text-xs font-semibold cursor-pointer border border-white/5"
          title="Exit Demo"
        >
          <X size={14} />
          Exit Demo
        </button>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full flex gap-1 px-6 py-2 bg-neutral-900/40 border-b border-white/5 z-30">
        {demo.screens.map((screen, idx) => {
          const isActive = screen.id === currentScreenId;
          const isPast =
            idx < demo.screens.findIndex((s) => s.id === currentScreenId);
          return (
            <button
              key={screen.id}
              onClick={() => {
                // Allow jumping to previously viewed screens or the next screen directly
                if (isPast) {
                  const targetIndex = demo.screens.findIndex((s) => s.id === screen.id);
                  const newHistory = demo.screens.slice(0, targetIndex).map((s) => s.id);
                  setHistory(newHistory);
                  setCurrentScreenId(screen.id);
                } else if (idx === demo.screens.findIndex((s) => s.id === currentScreenId) + 1) {
                  handleNext();
                }
              }}
              className={`h-1 flex-1 rounded-full transition-all duration-300 cursor-pointer border-none outline-none ${
                isActive
                  ? "bg-[#ff007f] shadow-[0_0_8px_#ff007f]"
                  : isPast
                  ? "bg-white/50 hover:bg-white/70"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              title={`Go to ${screen.title}`}
            />
          );
        })}
      </div>

      {/* Main image view with letterboxing and aspect-ratio locked hotspot alignment */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center bg-neutral-950 overflow-hidden p-4 md:p-8">
        <div
          className="relative max-w-full max-h-full flex items-center justify-center"
          style={currentAspectRatio ? { aspectRatio: `${currentAspectRatio}` } : { width: "100%", height: "100%" }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentScreen.id}
              src={currentScreen.image}
              alt={currentScreen.title}
              className="max-w-full max-h-full object-contain select-none"
              onLoad={handleImageLoad}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </AnimatePresence>

          {/* Interaction Shield - intercepts right clicks and dragging */}
          <div
            className="absolute inset-0 z-10 select-none cursor-default"
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Watermark Overlay */}
          <div
            className="absolute inset-0 z-15 pointer-events-none select-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' fill='%23ff007f' opacity='0.07' font-size='12' font-family='sans-serif' font-weight='900' letter-spacing='0.15em' text-anchor='middle' transform='rotate(-35 150 150)'%3ENEURODIVERS³ • DEMO ONLY%3C/text%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />

          {/* Hotspots Container */}
          {currentAspectRatio && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {currentScreen.hotspots?.map((hotspot) => (
                <Hotspot
                  key={hotspot.id}
                  hotspot={hotspot}
                  onClick={() => handleHotspotClick(hotspot)}
                  defaultColor={BRAND_PINK}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-t border-white/5 z-30">
        {/* Left: screen counter */}
        <div className="text-xs text-white/50 font-medium tracking-wide">
          Screen {demo.screens.findIndex((s) => s.id === currentScreenId) + 1} of {demo.screens.length}
        </div>

        {/* Center: Back & Next accessible buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            disabled={history.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-white/10 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-md bg-[#ff007f] hover:bg-[#ff007f]/90 text-white cursor-pointer transition-colors shadow-md shadow-[#ff007f]/10"
          >
            {primaryHotspot?.targetScreenId === null || (!primaryHotspot && demo.screens.findIndex((s) => s.id === currentScreenId) === demo.screens.length - 1) ? (
              <>Finish</>
            ) : (
              <>Next <ChevronRight size={14} /></>
            )}
          </button>
        </div>

        {/* Right: Restart */}
        <button
          onClick={handleRestart}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          Restart
        </button>
      </div>
    </div>
  );
}

/**
 * Individual hotspot component.
 * - Fits pixel-perfectly relative to the image aspect ratio wrapper
 * - Soft pulsing outer ring + glowing brand center
 * - Accessible and clickable
 */
function Hotspot({ hotspot, onClick, defaultColor }) {
  const { x, y, label } = hotspot;
  const color = hotspot.color || defaultColor;

  return (
    <div
      className="absolute cursor-pointer group pointer-events-auto"
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
    >
      {/* Outer ring / pulse */}
      <div
        className="absolute inset-0 rounded-full animate-ping pointer-events-none"
        style={{
          backgroundColor: color,
          opacity: 0.25,
          width: 40,
          height: 40,
          margin: -8,
        }}
      />

      {/* Main dot */}
      <div
        className="relative rounded-full pointer-events-none transition-transform duration-200 group-hover:scale-110"
        style={{
          width: 24,
          height: 24,
          backgroundColor: color,
          boxShadow: `0 0 16px ${color}80, 0 0 4px ${color}`,
        }}
      />

      {/* Tooltip label */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-1.5 bg-neutral-950/95 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10 shadow-lg">
        {label}
      </div>
    </div>
  );
}


