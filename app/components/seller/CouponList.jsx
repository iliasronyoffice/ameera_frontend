"use client";

import React, { useEffect, useState } from "react";
import CouponCard from "./CouponCard";

export default function CouponList({ shopId }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/coupon-list/${shopId}`
        );
        const data = await res.json();

        if (data.success) {
          setCoupons(data.data);
        }
      } catch (error) {
        console.error("Failed to load coupons:", error);
      }
      setLoading(false);
    };

    if (shopId) fetchCoupons();
  }, [shopId]);

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600">Loading coupons...</div>
    );

  if (coupons.length === 0)
    return (
      <div className="text-center py-8 text-gray-500">
        No coupons available.
      </div>
    );

  return (
    <div className="my-4">
      <h3 className="text-xl md:text-4xl font-bold">Coupons</h3>

      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-8">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  );
}
