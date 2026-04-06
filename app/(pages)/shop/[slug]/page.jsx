"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import HeaderCard from "@/app/components/seller/HeaderCard"; // Make sure this path is correct
import SellerFeaturedProducts from "@/app/components/seller/SellerFeaturedProducts";
import SellerBanner from "@/app/components/seller/SellerBanner";
import CouponList from "@/app/components/seller/CouponList";
import SellerNewestProducts from "@/app/components/seller/SellerNewestProducts";
import SellerTopSellingProducts from "@/app/components/seller/SellerTopSellingProducts";
import SellerAllProducts from "@/app/components/seller/SellerAllProducts";

export default function SellerPage({ params }) {
  const unwrappedParams = React.use(params);
  const [shopId, setShopId] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("STORE HOME");

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shops/details/${unwrappedParams.slug}`
        );

        if (!res.ok) throw new Error("Failed to fetch shop info");

        const response = await res.json();

        if (response.success && response.data) {
          setShopId(response.data.id);
          setShopData(response.data);
        } else {
          throw new Error("Shop not found or invalid response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopId();
  }, [unwrappedParams.slug]);

  const renderContent = () => {
    if (!shopId) {
      return <div className="text-center py-10 text-gray-600">Shop not found.</div>;
    }

    switch (activeTab) {
      case "STORE HOME":
        return (
          <>
            <SellerFeaturedProducts shopId={shopId} />
            <SellerBanner shopData={shopData} />
            <CouponList shopId={shopId} />
            <SellerNewestProducts shopId={shopId} />
          </>
        );
      
      case "TOP SELLING":
        return <SellerTopSellingProducts shopId={shopId} />;
      
      case "COUPONS":
        return <CouponList shopId={shopId} />;
      
      case "ALL PRODUCTS":
        return <SellerAllProducts shopId={shopId} />;
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="p-6 container mx-auto">
      <Breadcrumb />
      <HeaderCard 
        shopData={shopData} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {renderContent()}
    </section>
  );
}