import React from "react";
import Image from "next/image";
import { getProducts } from "../lib/data";
import Link from "next/link";

export default async function ProductGrid() {
  const products = await getProducts();
  return (
    <section className="px-8 py-24 bg-[#0a0a0a]">
      <div className="flex justify-between items-end mb-12">
        <Link
          href="/products"
          className="text-xs font-medium uppercase tracking-widest hover:text-accent transition-colors border-b border-zinc-800 pb-1"
        >
          {" "}
          <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-300">
            The Collection
          </h2>
        </Link>

        <a
          href="#"
          className="text-xs font-medium uppercase tracking-widest hover:text-accent transition-colors border-b border-zinc-800 pb-1"
        >
          Archive
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group cursor-pointer product-card block"
          >
            <div className="relative aspect-3/4 overflow-hidden bg-zinc-900 mb-6 vintage-border rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-102"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-light tracking-wide text-zinc-300 serif">
                {product.name}
              </h3>
              <p className="text-xs text-accent/80 font-medium tracking-widest">
                {product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
