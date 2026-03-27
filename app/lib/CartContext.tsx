"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

export type CartItem = {
  id: string;
  name: string;
  price: string | number;
  image: string;
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: any, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from DB if authed, otherwise localStorage
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      fetch("/api/cart")
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.items)) {
            const mapped = data.items.map((i: any) => ({
              id: i.productId || i.id,
              name: i.name,
              price: i.price,
              image: i.image,
              quantity: i.quantity,
            }));
            setCartItems(mapped);
          } else {
            // merge local storage to new login fallback if db empty
            const savedCart = localStorage.getItem("cart");
            if (savedCart) setCartItems(JSON.parse(savedCart));
          }
          setIsInitialized(true);
        })
        .catch((e) => {
          console.error(e);
          setIsInitialized(true);
        });
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }
      setIsInitialized(true);
    }
  }, [isLoaded, isSignedIn]);

  // Sync to db when changed
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("cart", JSON.stringify(cartItems));

    if (isSignedIn) {
      // Sync to database
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      }).catch(err => console.error("Failed to sync cart to DB", err));
    }
  }, [cartItems, isInitialized, isSignedIn]);

  const addItem = (product: any, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce((acc, item) => {
    let priceNum = 0;
    if (typeof item.price === "string") {
      priceNum = parseFloat(item.price.replace("$", ""));
    } else if (typeof item.price === "number") {
      priceNum = item.price;
    }
    if (isNaN(priceNum)) priceNum = 0;
    
    return acc + priceNum * item.quantity;
  }, 0);

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        subtotal,
        isOpen,
        setIsOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
