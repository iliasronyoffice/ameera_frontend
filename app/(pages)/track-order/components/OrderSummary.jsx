"use client";
import { formatPrice } from "../utils/orderHelpers";

export default function OrderSummary({ subtotal, totalItems, couponDiscount, total }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="font-semibold mb-3">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({totalItems} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Coupon Discount</span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="text-purple-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}