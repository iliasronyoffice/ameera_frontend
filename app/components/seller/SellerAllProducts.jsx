"use client";
import React, { useState, useEffect } from "react";
import ProductCard1 from "../layout/ProductCard1";

export default function SellerAllProducts({ shopId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!shopId) return;
      
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shops/products/all/${shopId}?page=${page}`
        );
        const response = await res.json();
        
        if (response.success) {
          if (page === 1) {
            setProducts(response.data);
          } else {
            setProducts(prev => [...prev, ...response.data]);
          }
          // Assuming if we get less than 10 products, there are no more
          setHasMore(response.data.length === 6);
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [shopId, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product, index) => (
          <ProductCard1 key={product.id} item={product} priority={index < 6}/>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No products found.
        </div>
      )}
      
      {hasMore && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-main text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}