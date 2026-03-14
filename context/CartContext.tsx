'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('master-miller-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('master-miller-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Use id + unit as key so different variants are separate cart items
    const cartKey = `${product.id}_${product.unit}`;
    const existing = cart.find((item) => `${item.product.id}_${item.product.unit}` === cartKey);

    if (existing) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          `${item.product.id}_${item.product.unit}` === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success(`Updated ${product.name} (${product.unit}) quantity`);
    } else {
      setCart((prevCart) => [...prevCart, { product, quantity }]);
      toast.success(`Added ${product.name} (${product.unit}) to cart`);
    }
  };

  const removeFromCart = (cartKey: string) => {
    const item = cart.find((item) => `${item.product.id}_${item.product.unit}` === cartKey);
    setCart((prevCart) => prevCart.filter((item) => `${item.product.id}_${item.product.unit}` !== cartKey));
    if (item) {
      toast.success(`Removed ${item.product.name} (${item.product.unit}) from cart`);
    }
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        `${item.product.id}_${item.product.unit}` === cartKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
