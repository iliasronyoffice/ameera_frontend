"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import useCachedFetch from "@/app/utils/useCachedFetch";

export default function ThirdBanner() {
  const { 
    data: banners, 
    loading, 
    error 
  } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/banners-three`,
    "banners-three-data",
    30 * 60 * 1000
  );

  // Track which images are loaded
  const [loadedImages, setLoadedImages] = useState({});

  if (loading) {
    return (
      <div className="px-0 mt-8 mb-14">
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="rounded-xl overflow-hidden h-[100px] md:h-[250px] bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && (!banners || banners.length === 0)) {
    console.warn("Error fetching banners:", error);
    return (
      <div className="mx-auto px-0 mt-8 mb-14">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-center">
          <p>Unable to load banners. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  // Single banner layout
  if (banners.length === 1) {
    return (
      <div className="mx-auto px-0 mt-8 mb-2 md:mb-8">
        <a 
          href={banners[0].url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block overflow-hidden h-[150px] md:h-[600px] group"
        >
          <div className="relative w-full h-full bg-gray-100">
            {/* Blur placeholder while loading */}
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            <Image
              src={banners[0].photo || banners[0].image}
              alt={banners[0].title || "Banner"}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={true}
              quality={75} // Reduced from 90 to 75
              loading="eager"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABR3dHB0AAABoAAAABRyVFJDAAABtAAAAChnVFJDAAABtAAAAChiVFJDAAABtAAAAChjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAEcAbwBvAGcAbABlAC8AUwBrAGkAYQAvADAARQA5ADgAMwBFADEAQwA2AEEANQA5ADMANgA2ADMARgA2ADcARgA2ADcARAAyAEUAMAA5ADYARAA0ADgARgA2ADcARQAgAFMAUgBHAuocmcAAAAMARWFyZwAAACkAAAAyAAAAAgAAABQAAAAEAAAAFAAAAAMAAABQAAAAGAAAAAQAAAB8AAAABAAAAAgAAAAJAAAACQAAAAoAAAAFAAAA/v///0V4aWYAAABNTSc6RAAAAR0BAAgAAAABAAgAAABIAAAAAQAAAEgAAAABAAAACgAAAAUAAAAgAAAAAElQAAAABQAAAAgAAAAkAAAAAAAAAEgAAAABAAAASAAAAAEAAAD6AAAAAQAAAAMAAAABAAEAAAAAAABkZXNjAAAAAAAAAAIAAAACbnRydAAAAAAAABAAAAAQABAAAAAQAAAAAAAAAAAAAQAAAAEAAAAgAAAAAAAAAAAAAAEAAAAkAAAAQAAAAAAAAAAAAAABAAAABAAAAGQAAAAAAAAAAAABAAAAZAAAAGQAAAAA"
            />
          </div>
        </a>
      </div>
    );
  }

  // Multiple banners layout
  const gridClass = banners.length === 2 ? "grid-cols-2" : "grid-cols-3";
  
  return (
    <div className={`container mx-auto px-4 mt-8 mb-2 md:mb-8`}>
      <div className={`grid ${gridClass} gap-5`}>
        {banners.map((banner, index) => (
          <a 
            key={banner.id || index} 
            href={banner.url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`banner${index + 1} overflow-hidden h-[100px] md:h-[250px] group`}
          >
            <div className="relative w-full h-full bg-gray-100">
              {/* Show placeholder until image loads */}
              {!loadedImages[index] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <Image
                src={banner.photo || banner.image}
                alt={banner.title || `Banner ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={index === 0} // Only first image is priority
                loading={index === 0 ? "eager" : "lazy"} // Lazy load non-first images
                quality={75} // Reduced from 85 to 75
                onLoadingComplete={() => {
                  setLoadedImages(prev => ({ ...prev, [index]: true }));
                }}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}