"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function TrackOrderForm({ onOrderFound, onLoading, onSearchStart }) {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchOrder = async (e) => {
    e.preventDefault();
    
    if (!orderCode.trim()) {
      toast.error("Please enter an order code");
      return;
    }

    setLoading(true);
    onLoading(true);
    onSearchStart();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/track-order/${orderCode}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data) {
        onOrderFound(data.data);
        toast.success("Order found!");
      } else {
        toast.error(data.message || "Order not found");
        onOrderFound(null);
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error("Failed to track order. Please try again.");
      onOrderFound(null);
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearchOrder} className="mb-6 md:mb-8 border border-main rounded-xl sm:rounded-2xl p-2 shadow-sm">
      <div className="relative flex items-center">
        <input
          type="text"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          placeholder="Enter Order Code (e.g., xxxxxxx)"
          className="w-full rounded-lg bg-main py-2 md:py-3 pl-9 pr-24 text-xs sm:text-sm focus:outline-none"
          disabled={loading}
        />
        <div className="absolute inset-y-0 left-3 flex items-center" suppressHydrationWarning>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
            />
          </svg>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 bg-main text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </div>
    </form>
  );
}