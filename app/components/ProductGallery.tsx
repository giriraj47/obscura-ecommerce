"use client";

import React, { useRef } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // We only have one image in data.ts currently, but we'll duplicate it for the carousel effect as in the user's setup
  const galleryImages = [images[0], images[0]];

  return (
    <div className="relative h-full group/gallery">
      <div 
        ref={scrollRef}
        className="flex h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {galleryImages.map((img, idx) => (
          <div 
            key={idx}
            className="relative flex-shrink-0 w-[85%] lg:w-[80%] h-full min-h-[600px] snap-center overflow-hidden bg-zinc-100 border border-zinc-200 rounded-lg"
          >
            <Image
              src={img}
              alt={`${productName} view ${idx + 1}`}
              fill
              sizes="(max-width: 1024px) 85vw, 40vw"
              className="object-cover"
              priority={idx === 0}
            />
            
            {/* Navigation removed as per request */}
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
