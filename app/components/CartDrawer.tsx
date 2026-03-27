"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../lib/CartContext";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems: items, updateQuantity, removeItem, subtotal } = useCart();
  const router = useRouter();
  
  // Use internal state for the transition to work
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else {
      // Delay unrendering to let animation finish (if needed)
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!shouldRender && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? "visible" : "invisible delay-500"}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`absolute top-0 right-0 h-full w-full sm:w-[500px] bg-white text-black shadow-2xl flex flex-col transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-zinc-100">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-900 serif">
            Shopping Basket
          </h2>
          <button 
            onClick={onClose}
            className="group p-2 -mr-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
          >
            Close
            <div className="w-5 h-5 flex items-center justify-center border border-zinc-200 group-hover:border-black rounded-full transition-colors">
              <span className="mb-[1px] text-[10px]">✕</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
              <p className="text-xs uppercase tracking-widest">Your basket is empty</p>
              <button 
                onClick={onClose}
                className="text-[10px] font-bold underline underline-offset-4 hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="relative w-28 aspect-3/4 bg-zinc-100 vintage-border overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    sizes="112px"
                    className="object-cover opacity-95 transition-opacity duration-500 group-hover:opacity-100" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium leading-relaxed max-w-[180px] serif group-hover:text-zinc-600 transition-colors uppercase tracking-wide">
                        {item.name}
                      </h3>
                      <p className="text-sm font-semibold tracking-widest text-[#c4a484]">
                        {item.price}
                      </p>
                    </div>
                    
                    <div className="flex items-center border border-zinc-200 w-fit rounded-sm overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-black transition-all"
                      >
                        -
                      </button>
                      <span className="px-4 text-[12px] font-semibold tabular-nums">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-black transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black w-fit transition-colors underline-offset-8 hover:underline decoration-zinc-200"
                  >
                    Remove item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-10 border-t border-zinc-100 bg-zinc-50/20">
          <div className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">Total</span>
              <span className="text-lg font-medium serif tracking-tight text-[#c4a484]">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400 italic">
              Shipping and taxes calculated at secure checkout.
            </p>
          </div>
          
          <button 
            onClick={() => {
              onClose();
              router.push("/checkout");
            }}
            disabled={items.length === 0}
            className="w-full py-4 bg-black text-white text-[11px] font-semibold uppercase tracking-[0.3em] rounded-sm transition-all hover:bg-zinc-800 shadow-lg active:scale-[0.99] disabled:bg-zinc-400 disabled:cursor-not-allowed"
          >
            Complete Order
          </button>
          
          <button 
            onClick={onClose}
            className="w-full mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-colors"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
