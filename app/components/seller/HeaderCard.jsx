"use client";
import Image from "next/image";
import React from "react";
import seller_logo from "@/public/seller.png";

export default function HeaderCard({ shopData, activeTab = "STORE HOME", onTabChange }) {
  const tabs = ["STORE HOME", "TOP SELLING", "COUPONS", "ALL PRODUCTS"];
  
  // Safe default function if onTabChange is not provided
  const handleTabChange = (tab) => {
    if (onTabChange && typeof onTabChange === 'function') {
      onTabChange(tab);
    }
  };

  return (
    <div>
      {/* Header Card */}
      <div className="bg-main rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-4 md:pb-0">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-2">
            <Image
              src={seller_logo}
              alt="Seller"
              className="rounded-full w-30 h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {shopData?.name || "LOUIS VUITTON"}
            </h2>
            <span>
              <span className="text-yellow-400/70">★★★★★</span> 5.00 avg. rating
            </span>
            <p className="text-gray-500 text-sm">
              {shopData?.address || "Dhaka, Bangladesh"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 md:flex md:flex-row gap-8 text-center text-sm divide-x divide-gray-400">
          <div className="flex flex-col justify-center items-center border-r border-gray-400 pr-4">
            <p className="font-medium">Member Since</p>
            <p className="text-gray-500">12 Apr 2025</p>
          </div>
          <div className="flex flex-col justify-center items-center border-r border-gray-400 pr-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3169 9.4206C15.8396 9.4206 13.8236 11.4366 13.8236 13.9139C13.8236 16.3912 15.8396 18.4072 18.3166 18.4072C20.7937 18.4072 22.8099 16.3912 22.8099 13.9139C22.8099 11.4366 20.7941 9.4206 18.3169 9.4206ZM19.9851 14.997H19.3997V15.5824C19.3997 16.1788 18.9169 16.6655 18.3166 16.6655C17.7164 16.6655 17.2337 16.1824 17.2337 15.5824V14.9968H16.6481C16.0517 14.9968 15.5653 14.5139 15.5653 13.9139C15.5653 13.3139 16.0481 12.8308 16.6481 12.8308H17.2337V12.2452C17.2337 11.649 17.7166 11.1623 18.3166 11.1623C18.9166 11.1623 19.3997 11.6454 19.3997 12.2454V12.831H19.9853C20.5815 12.831 21.0682 13.3139 21.0682 13.9139C21.0682 14.5139 20.5853 14.997 19.9851 14.997ZM9.33414 12.5756C8.3475 12.5756 7.36062 12.1984 6.57438 11.4476C5.11206 10.048 3.75582 7.55964 4.02702 5.15772C4.09782 4.52892 4.2591 3.69924 4.8879 2.85804C5.9535 1.431 7.5651 0.605403 9.30654 0.601562C11.0835 0.601562 12.6913 1.41516 13.7801 2.8542C14.413 3.70332 14.5743 4.53276 14.6451 5.15772V5.1774C14.8769 7.61076 13.5325 10.0835 12.0977 11.4515C11.3115 12.2022 10.3246 12.5756 9.33798 12.5756H9.33414Z"
                fill="#19073B"
              />
              <path
                d="M12.5448 13.9112V13.9067C12.545 13.6537 12.3602 13.4367 12.108 13.4195C11.9781 13.4106 11.8479 13.4062 11.7177 13.4063H6.95014C5.80342 13.4046 4.68138 13.7392 3.72286 14.3687C2.13502 15.4115 1.1875 17.2556 1.1875 19.3007V20.0144C1.1875 21.8804 2.70598 23.3989 4.57582 23.3989H14.0995C15.9631 23.3989 17.4878 21.8742 17.4878 20.0106C17.4878 19.7891 17.3342 19.5954 17.1175 19.5493C14.5113 18.9937 12.5479 16.6794 12.5479 13.9076L12.5448 13.9112Z"
                fill="#19073B"
              />
            </svg>
            <p className="text-gray-500">Follow Seller</p>
          </div>

          <div className="flex flex-col justify-center items-center px-2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.6667 0H6.66667C4.89921 0.00211714 3.20474 0.705176 1.95496 1.95496C0.705176 3.20474 0.00211714 4.89921 0 6.66667V17.3333C0.00193937 18.8696 0.533454 20.3582 1.50496 21.5483C2.47646 22.7384 3.82855 23.5572 5.33333 23.8667V28C5.3333 28.2414 5.39879 28.4783 5.52283 28.6853C5.64687 28.8924 5.82481 29.062 6.03765 29.1758C6.25049 29.2897 6.49025 29.3437 6.73136 29.332C6.97246 29.3203 7.20587 29.2433 7.40667 29.1093L15.0667 24H22.6667C24.4341 23.9979 26.1286 23.2948 27.3784 22.045C28.6282 20.7953 29.3312 19.1008 29.3333 17.3333V6.66667C29.3312 4.89921 28.6282 3.20474 27.3784 1.95496C26.1286 0.705176 24.4341 0.00211714 22.6667 0ZM20 16H9.33333C8.97971 16 8.64057 15.8595 8.39052 15.6095C8.14048 15.3594 8 15.0203 8 14.6667C8 14.313 8.14048 13.9739 8.39052 13.7239C8.64057 13.4738 8.97971 13.3333 9.33333 13.3333H20C20.3536 13.3333 20.6928 13.4738 20.9428 13.7239C21.1929 13.9739 21.3333 14.313 21.3333 14.6667C21.3333 15.0203 21.1929 15.3594 20.9428 15.6095C20.6928 15.8595 20.3536 16 20 16ZM22.6667 10.6667H6.66667C6.31305 10.6667 5.97391 10.5262 5.72386 10.2761C5.47381 10.0261 5.33333 9.68696 5.33333 9.33333C5.33333 8.97971 5.47381 8.64057 5.72386 8.39052C5.97391 8.14048 6.31305 8 6.66667 8H22.6667C23.0203 8 23.3594 8.14048 23.6095 8.39052C23.8595 8.64057 24 8.97971 24 9.33333C24 9.68696 23.8595 10.0261 23.6095 10.2761C23.3594 10.5262 23.0203 10.6667 22.6667 10.6667Z"
                fill="#E04533"
              />
            </svg>
            <p className="font-medium">Chat Now</p>
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden lg:inline-flex gap-3 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabChange(tab)}
            className={`px-3 py-2 rounded-lg text-xs font-medium ${
              tab === activeTab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}