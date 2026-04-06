import Image from "next/image";
import React, { useState } from "react";

export default function SellerBanner({ shopData }) {
  const [imageError, setImageError] = useState(false);
  
  // console.log('image data is ', shopData.top_banner);

  // Fallback if image fails to load
  if (imageError || !shopData.top_banner) {
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">{shopData.name}</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full h-64 md:h-80 lg:h-96">
        <Image
          src={shopData.top_banner}
          alt={shopData.name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
}