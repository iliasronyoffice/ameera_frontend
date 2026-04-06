"use client";
import React, { useState, useEffect } from "react";

import ProductCard1 from "../layout/ProductCard1";

export default function SellerTopSellingProducts({ shopId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      if (!shopId) return;
      
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shops/products/top/${shopId}`
        );
        const response = await res.json();
        
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, [shopId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-6">Top Selling Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product,index) => (
          <ProductCard1 key={product.id} item={product} priority={index < 6}/>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No top selling products found.
        </div>
      )}
    </div>
  );
}