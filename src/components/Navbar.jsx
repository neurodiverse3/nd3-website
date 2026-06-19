"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowRight, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LogoWordmark } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchOverlay } from './SearchOverlay';
import AccessibilityPanel from './labs/AccessibilityPanel';

export const Navbar = () => {
  const { cart, setIsCartOpen } = useCart();
  const [glitch, setGlitch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Global keyboard shortcut to open search on "/" key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !isSearchOpen) {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
          return;
        }
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);



  const [hideNavbar, setHideNavbar] = useState(false);

  const isSingleBlogPost = pathname && pathname.startsWith('/blog/') && pathname !== '/blog';

  // Handle transparent to solid transition on scroll, and auto-hide on single blog post pages
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (isSingleBlogPost && window.scrollY > 400) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
    };
    
    handleScroll(); // Check initial scroll position on mount
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSingleBlogPost]);

  // Periodic logo glitch animation (once every 4s)
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { id: '/', label: 'Home' },
    { id: '/blog', label: 'Blog' },
    { id: '/memoir', label: 'Memoir' },
    { id: '/labs', label: 'Labs' },
    { id: '/store', label: 'Store' },
    { id: '/about', label: 'About' },
    { id: '/contact', label: 'Contact' }
  ];

  if (pathname && pathname.endsWith('/embed')) {
    return null;
  }

  return (
    <>
      {/* A11y: Skip-to-content link */}
      <a 
        href="#main" 
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-[9999] bg-bg-primary text-accent border border-accent px-6 py-4 text-sm font-black uppercase tracking-wider shadow-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        Skip to content
      </a>

      <header className={`fixed top-0 left-0 right-0 z-50 w-full flex flex-col transition-transform duration-300 ease-in-out ${hideNavbar ? '-translate-y-full' : 'translate-y-0'}`}>
        <nav 
          className={`w-full transition-all duration-300 flex items-center justify-between px-6 lg:px-12 xl:px-24 h-[72px] md:h-[96px] ${
            scrolled 
              ? 'bg-bg-primary/95 backdrop-blur-md border-b border-border-rule' 
              : 'bg-transparent border-b border-transparent'
          }`}
        >
          <div className="max-w-7xl w-full mx-auto flex justify-between items-center h-full">
            {/* Logo Left */}
            <Link 
              href="/"
              className={`cursor-pointer transition-all duration-75 focus-ring select-none ${
                glitch ? 'translate-x-0.5 skew-x-6' : ''
              }`}
            >
              <LogoWordmark className="text-fg-primary" />
            </Link>
            
            {/* Nav Links Center (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center gap-4 xl:gap-6 items-center">
              {navItems.map(item => (
                <Link 
                  key={item.id}
                  href={item.id}
                  className={`relative text-[12px] xl:text-[13px] font-black uppercase tracking-[0.12em] xl:tracking-[0.2em] transition-all cursor-pointer focus-ring px-2 py-2 shrink-0 ${
                    pathname === item.id || (item.id !== '/' && pathname?.startsWith(item.id))
                      ? 'text-link' 
                      : 'text-text-muted hover:text-fg-primary'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {(pathname === item.id || (item.id !== '/' && pathname?.startsWith(item.id))) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Primary CTA and Basket Far Right (Desktop) */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 shrink-0">

              {/* Search Trigger (Desktop) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-fg-primary hover:text-accent bg-transparent transition-all group cursor-pointer focus-ring rounded-none shrink-0"
                aria-label="Open Site Search"
              >
                <Search size={20} className="group-hover:scale-105 transition-transform" />
              </button>

              {/* Shopping Bag Trigger */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-2.5 text-fg-primary hover:text-accent bg-transparent transition-all group cursor-pointer focus-ring rounded-none shrink-0"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag size={20} className="group-hover:scale-105 transition-transform" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-bg-primary text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-bg-primary animate-in zoom-in duration-200">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Accessibility Controls */}
              <AccessibilityPanel />
            </div>

            {/* Hamburger Mobile Trigger */}
            <div className="flex items-center gap-1.5 md:hidden">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="relative p-2 text-fg-primary hover:text-accent cursor-pointer"
                aria-label="Open Site Search"
              >
                <Search size={22} />
              </button>

              {/* Mobile Accessibility Controls */}
              <AccessibilityPanel mobile />

              {/* Mobile Shopping Bag */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-2 text-fg-primary hover:text-accent cursor-pointer"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag size={22} />
                {cart.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-accent w-2.5 h-2.5 rounded-full border border-bg-primary"></span>
                )}
              </button>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-fg-primary hover:text-accent p-1 cursor-pointer"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-drawer"
                aria-label="Toggle Navigation Menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Full-Height Slide-In Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 md:hidden"
            />

            {/* Drawer Container */}
            <motion.div
              id="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-[360px] h-full bg-bg-primary border-l border-border-rule p-8 z-50 md:hidden flex flex-col justify-between shadow-2xl"
            >
              {/* Drawer Top */}
              <div className="flex justify-between items-center">
                <Link href="/" className="text-xl font-black uppercase tracking-tighter text-fg-primary focus-ring">
                  <LogoWordmark className="h-7 text-fg-primary" />
                </Link>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-text-muted hover:text-link p-1"
                  aria-label="Close menu"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Links Stacked */}
              <div className="flex flex-col gap-8 my-auto">
                {navItems.map(item => (
                  <Link 
                    key={item.id}
                    href={item.id}
                    className={`text-3xl font-black uppercase tracking-tighter flex items-center justify-between group ${
                      pathname === item.id ? 'text-link' : 'text-fg-primary'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all text-link" />
                  </Link>
                ))}
              </div>

              {/* Primary CTA and Meta Bottom */}
              <div className="space-y-6">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    const element = document.getElementById('email-input');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      element.focus();
                    } else {
                      router.push('/#email-input');
                    }
                  }}
                  className="w-full py-4 border border-accent text-accent hover:bg-accent hover:text-bg-primary text-center font-black uppercase tracking-widest text-xs transition-colors"
                >
                  Join the list →
                </button>
                <div className="text-[10px] text-text-muted tracking-widest uppercase text-center font-mono">
                  For the unmasked.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
