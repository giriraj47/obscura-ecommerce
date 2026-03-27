"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../lib/CartContext";
import { useUser } from "@clerk/nextjs";
import Footer from "../components/Footer";

export default function CheckoutPage() {
  const { cartItems, subtotal, setIsOpen, clearCart } = useCart();
  const { user, isLoaded, isSignedIn } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const getPrice = (price: string | number) => {
    if (typeof price === "number") return price;
    return parseFloat(price.replace("$", "")) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      if (isSignedIn) {
        // Log the order to the database
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: getPrice(item.price),
            })),
            totalAmount: subtotal,
          }),
        });
        if (!res.ok) throw new Error("Failed to secure order to DB");
      }
      
      // Simulate fake payment delay just for UI effect
      setTimeout(() => {
        setOrderComplete(true);
        clearCart();
        setIsProcessing(false);
      }, 1000);
      
    } catch (err) {
      console.error(err);
      alert("An error occurred during checkout processing.");
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-8 text-center">
        <div className="max-w-md space-y-8 animate-fade-in">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-800">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h1 className="text-4xl font-light serif tracking-tight">Order Confirmed</h1>
          <p className="text-zinc-500 font-light leading-relaxed">
            Your items from the Obscura collection have been reserved. 
            A confirmation email will be sent to your inbox shortly.
          </p>
          <Link 
            href="/products" 
            className="inline-block mt-8 px-12 py-4 bg-black text-white text-[11px] font-semibold uppercase tracking-[0.3em] rounded-sm transition-all hover:bg-zinc-800"
          >
            Continue Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Contact & Shipping Form */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <Link href="/products" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors mb-12 inline-block">
                ← Return to Archive
              </Link>
              <h1 className="text-3xl font-light serif tracking-tight mb-2">Checkout</h1>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Secure Order Process</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Contact Information */}
              <section className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-900 border-b border-zinc-100 pb-4">Contact Information</h2>
                <div className="space-y-4">
                  <input 
                    required 
                    type="email" 
                    placeholder="Email Address" 
                    defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                    className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" 
                  />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="newsletter" className="accent-black" />
                    <label htmlFor="newsletter" className="text-xs text-zinc-500">Keep me updated on new archival releases</label>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-900 border-b border-zinc-100 pb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="First Name" defaultValue={user?.firstName || ""} className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                  <input required placeholder="Last Name" defaultValue={user?.lastName || ""} className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                  <div className="md:col-span-2">
                    <input required placeholder="Address" className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                  </div>
                  <input placeholder="Apartment, suite, etc. (optional)" className="md:col-span-2 w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                  <input required placeholder="City" className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                  <input required placeholder="Country" className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                  <input required placeholder="Postal Code" className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                  <input required placeholder="Phone" className="w-full px-5 py-4 border border-zinc-200 rounded-sm text-sm focus:border-black outline-none transition-colors placeholder:text-zinc-400" />
                </div>
              </section>

              {/* Payment (Placeholder) */}
              <section className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-900 border-b border-zinc-100 pb-4">Payment</h2>
                <div className="p-10 border border-zinc-200 rounded-sm bg-zinc-50/50 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="text-zinc-400 text-xs">
                    Payments are securely handled by our encrypted gateway.
                  </div>
                  <div className="flex gap-4 opacity-30 grayscale">
                    <div className="w-10 h-6 bg-zinc-300 rounded" />
                    <div className="w-10 h-6 bg-zinc-300 rounded" />
                    <div className="w-10 h-6 bg-zinc-300 rounded" />
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-5 bg-black text-white text-[11px] font-semibold uppercase tracking-[0.4em] rounded-sm transition-all hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed shadow-xl active:scale-[0.99]"
              >
                {isProcessing ? "Processing..." : "Complete Order"}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 border-l border-zinc-100 lg:pl-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-900 mb-10">Order Summary</h2>
            
            <div className="space-y-8 mb-12 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <div className="relative w-20 aspect-3/4 bg-zinc-100 vintage-border overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    <div className="absolute top-[-8px] right-[-8px] w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center rounded-full z-10 border-2 border-white tabular-nums">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider serif">{item.name}</h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{item.price}</p>
                  </div>
                  <div className="text-xs font-medium tabular-nums">
                    ${(getPrice(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-zinc-100 pt-8">
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between text-lg font-medium serif border-t border-zinc-100 pt-6 mt-4">
                <span>Total</span>
                <span className="text-[#c4a484]">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-12 p-6 bg-zinc-50 border border-dotted border-zinc-200 rounded-sm">
              <p className="text-[10px] leading-relaxed text-zinc-500 italic">
                “Quality is remembered long after the price is forgotten.” — Our items are handled with archival care.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
