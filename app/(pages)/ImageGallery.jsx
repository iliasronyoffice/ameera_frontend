"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ImageGallery({ galleryImages }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const swiperRef = useRef(null);
  const dragStartX = useRef(0);
  const dragging = useRef(false);

  const selectedImage = galleryImages[selectedIndex];

  const scrollUp = () =>
    swiperRef.current?.scrollBy({ top: -150, behavior: "smooth" });
  const scrollDown = () =>
    swiperRef.current?.scrollBy({ top: 150, behavior: "smooth" });

  const handleMouseDown = (e) => {
    dragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!dragging.current) return;

    const diff = e.clientX - dragStartX.current;

    if (diff > 50 && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (diff < -50 && selectedIndex < galleryImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }

    dragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!zoom) return;

    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({ x, y });
  };

  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - dragStartX.current;

    if (diff > 50 && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (diff < -50 && selectedIndex < galleryImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (!galleryImages || galleryImages.length === 0) {
    return <div className="lg:col-span-5">No images available</div>;
  }

  return (
    <div className="lg:col-span-5 relative">
      <div className="flex gap-4">
        {/* Thumbnail Gallery - Left Side (Y-axis) */}
        <div className="relative w-24 md:w-28">
          <div
            ref={swiperRef}
            className="flex flex-col gap-3 overflow-y-auto scrollbar-hide scroll-smooth max-h-[370px] md:max-h-[500px] 2xl:max-h-[600px]"
          >
            {galleryImages.map((img, index) => (
              <div
                key={img.id}
                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border-2 cursor-pointer overflow-hidden transition-all duration-300 ${
                  index === selectedIndex
                    ? "border-main shadow-md"
                    : "border-gray-200 hover:border-main"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Scroll buttons for vertical navigation */}
          {galleryImages.length > 4 && (
            <>
              <button
                onClick={scrollUp}
                className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white border border-gray-300 hover:border-main hover:bg-purple-50 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>

              <button
                onClick={scrollDown}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-gray-300 hover:border-main hover:bg-purple-50 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Main Image */}
        <div
          className="border relative border-gray-100 overflow-hidden shadow-sm group flex-1 w-full h-[370px] md:h-[500px] 2xl:h-[600px]"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            className="object-cover transition-all duration-300"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            unoptimized
          />

          {zoom && (
            <div
              className="absolute inset-0 pointer-events-none bg-no-repeat bg-contain"
              style={{
                backgroundImage: `url(${selectedImage.src})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "200%",
              }}
            ></div>
          )}
        </div>
      </div>

      {/* Share Link */}
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          // Implement share functionality
          if (navigator.share) {
            navigator.share({
              title: selectedImage.alt,
              url: window.location.href,
            });
          }
        }}
        className="flex justify-center py-4 text-main items-center gap-2 text-main font-medium hover:underline"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.2 4H7.2C6.35131 4 5.53737 4.33714 4.93726 4.93726C4.33714 5.53737 4 6.35131 4 7.2V16.8C4 17.6487 4.33714 18.4626 4.93726 19.0627C5.53737 19.6629 6.35131 20 7.2 20H16.8C17.6487 20 18.4626 19.6629 19.0627 19.0627C19.6629 18.4626 20 17.6487 20 16.8V12.8C20 12.5878 19.9157 12.3843 19.7657 12.2343C19.6157 12.0843 19.4122 12 19.2 12C18.9878 12 18.7843 12.0843 18.6343 12.2343C18.4843 12.3843 18.4 12.5878 18.4 12.8V16.8C18.4 17.2243 18.2314 17.6313 17.9314 17.9314C17.6313 18.2314 17.2243 18.4 16.8 18.4H7.2C6.77565 18.4 6.36869 18.2314 6.06863 17.9314C5.76857 17.6313 5.6 17.2243 5.6 16.8V7.2C5.6 6.77565 5.76857 6.36869 6.06863 6.06863C6.36869 5.76857 6.77565 5.6 7.2 5.6H11.2C11.4122 5.6 11.6157 5.51571 11.7657 5.36569C11.9157 5.21566 12 5.01217 12 4.8C12 4.58783 11.9157 4.38434 11.7657 4.23431C11.6157 4.08429 11.4122 4 11.2 4ZM17.2688 5.6H14.4C14.1878 5.6 13.9843 5.51571 13.8343 5.36569C13.6843 5.21566 13.6 5.01217 13.6 4.8C13.6 4.58783 13.6843 4.38434 13.8343 4.23431C13.9843 4.08429 14.1878 4 14.4 4H19.2C19.4122 4 19.6157 4.08429 19.7657 4.23431C19.9157 4.38434 20 4.58783 20 4.8V9.6C20 9.81217 19.9157 10.0157 19.7657 10.1657C19.6157 10.3157 19.4122 10.4 19.2 10.4C18.9878 10.4 18.7843 10.3157 18.6343 10.1657C18.4843 10.0157 18.4 9.81217 18.4 9.6V6.7312L12.5656 12.5656C12.4147 12.7113 12.2126 12.792 12.0029 12.7901C11.7931 12.7883 11.5925 12.7042 11.4441 12.5559C11.2958 12.4075 11.2117 12.2069 11.2099 11.9971C11.208 11.7874 11.2887 11.5853 11.4344 11.4344L17.2688 5.6Z"
            fill="#19073B"
          />
        </svg>
        <span>Share This Product</span>
      </Link>
    </div>
  );
}