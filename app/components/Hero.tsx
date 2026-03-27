import Link from 'next/link';
import React from 'react';

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-4xl text-center px-8 animate-fade-in">
        <span className="text-accent uppercase tracking-[0.3em] text-xs mb-6 block font-medium">Est. 1894 — Obscura Archive</span>
        <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-8 leading-[1.1] text-white">
          Elegance in the <br /> 
          <span className="italic">Shadows</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-12 font-light leading-relaxed">
          Curated Victorian & Gothic apparel for the modern soul. 
          Step into a world of timeless mystery and refined darkness.
        </p>
        <Link href="/products">
        <button className="primary">
          Explore Archive
        </button>
        </Link>
      </div>
    </section>
  );
}

