"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

const getSlugFromUrl = (url) => {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1].split('?')[0];
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);
  const [purchasedSlugs, setPurchasedSlugs] = useState([]);
  const [securedDownloads, setSecuredDownloads] = useState([]);
  const [checkoutStatus, setCheckoutStatus] = useState('idle'); // idle, processing, completed
  const [checkoutError, setCheckoutError] = useState(null);

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
  const saveSecuredDownloads = (newDownloads) => {
    setSecuredDownloads(newDownloads);
    try {
      localStorage.setItem('nd3_secured_downloads', JSON.stringify(newDownloads));
    } catch (e) {
      console.warn("Failed to write to localStorage: ", e);
    }
  };

  const addToCart = (product) => {
    setCheckoutError(null);
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id) => {
    setCheckoutError(null);
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Start the Polar.sh checkout flow
  const startCheckoutQueue = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    setCheckoutStatus('processing');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session.');
      }

      if (data.url) {
        console.log(`[Polar] Redirecting to checkout: ${data.url}`);
        window.location.href = data.url;
      } else {
        throw new Error('Polar checkout URL was not returned.');
      }
    } catch (err) {
      console.error('[Polar Checkout Error]', err);
      setCheckoutError(err.message || 'Friction encountered initiating secure checkout. Please try again.');
      setCheckoutStatus('idle');
      setIsCheckingOut(false);
    }
  };

  const cancelCheckoutQueue = () => {
    setIsCheckingOut(false);
    setCheckoutStatus('idle');
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      isCheckingOut,
      activeQueueIndex,
      purchasedSlugs,
      securedDownloads,
      checkoutStatus,
      checkoutError,
      setCheckoutError,
      addToCart,
      removeFromCart,
      clearCart,
      startCheckoutQueue,
      cancelCheckoutQueue,
      saveSecuredDownloads
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
