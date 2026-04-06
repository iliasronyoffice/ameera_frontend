// app/track-order/page.js
"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import TrackOrderForm from "./components/TrackOrderForm";
import OrderDetails from "./components/OrderDetails";

export default function TrackOrder() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleOrderFound = (foundOrder) => {
    setOrder(foundOrder);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const handleSearchStart = () => {
    setSearched(true);
  };

  const handleNewSearch = () => {
    setOrder(null);
    setSearched(false);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
      <Breadcrumb 
        items={[
          { name: "Home", href: "/" },
          { name: "Track Order", href: "/track-order" }
        ]}
      />

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        {order ? "Order Details" : "Track Your Order"}
      </h1>

      <TrackOrderForm 
        onOrderFound={handleOrderFound}
        onLoading={handleLoading}
        onSearchStart={handleSearchStart}
      />

      {loading && (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-purple-600" />
        </div>
      )}

      {!loading && searched && !order && (
        <div className="text-center py-20">
          <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-sm text-gray-500 mb-6">
            No order found. Please check and try again.
          </p>
          <button
            onClick={handleNewSearch}
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Try Another Order
          </button>
        </div>
      )}

      {!loading && !searched && !order && (
        <div className="text-center py-20">
          <div className="bg-purple-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 12H4M12 4v16"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Your Order Code</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Enter your order code above to track your order status and delivery information.
          </p>
        </div>
      )}

      {!loading && order && (
        <OrderDetails order={order} onNewSearch={handleNewSearch} />
      )}
    </div>
  );
}