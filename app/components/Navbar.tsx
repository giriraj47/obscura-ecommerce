"use client";

import Link from "next/link";
import React, { useState } from "react";
import CartDrawer from "./CartDrawer";

import { useCart } from "../lib/CartContext";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const { cartItems, isOpen, setIsOpen } = useCart();
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-[0.2em] cursor-pointer text-white serif uppercase hover:text-accent transition-colors"
        >
          Obscura
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link href="#" className="nav-link">
            Men
          </Link>
          <Link href="#" className="nav-link">
            Women
          </Link>
          <Link href="/products" className="nav-link">
            Archive
          </Link>
          <Link href="#" className="nav-link">
            Decor
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="#"
            className="nav-link underline underline-offset-8 decoration-white/30  hover:decoration-white transition-all uppercase text-white"
          >
            Search
          </Link>
          <button 
            onClick={() => setIsOpen(true)}
            className="nav-link hover:text-accent font-semibold transition-colors flex items-center gap-2 uppercase text-white"
          >
            Cart ({itemCount})
          </button>
          
          <div className="flex items-center border-l border-white/10 pl-6 space-x-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="nav-link hover:text-accent transition-colors uppercase text-sm tracking-widest text-white">
                  Login
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-full border border-white/20 hover:border-white transition-all",
                    userButtonPopoverCard: "bg-[#0a0a0a] border border-[#1a1a1a] text-white",
                    userButtonPopoverActionButtonText: "text-white hover:text-accent",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </Show>
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
