"use client";

import React, { useState } from "react";
import { useCart } from "../lib/CartContext";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-zinc-300 rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            −
          </button>
          <div className="w-12 h-10 flex items-center justify-center text-sm tabular-nums">
            {quantity}
          </div>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-zinc-900 transition-all active:scale-[0.98]"
          >
            Add to cart
          </button>
        </div>
      </div>
      <button
        type="button"
        className="w-full py-3 border border-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-widest rounded-sm hover:border-zinc-700 transition-all"
      >
        Buy it now
      </button>
    </div>
  );
}
