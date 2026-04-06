"use client";
import React, { useState } from "react";
import ButtonArrowIcon from "../icons/ButtonArrowIcon";
import { useAppSelector } from "@/store/hooks";
import { useCart } from "@/store/hooks/useCart";
import { useRouter } from "next/navigation";

// Helper function to parse price string to number
const parsePrice = (priceString) => {
  if (!priceString) return 0;
  const numericValue = priceString.replace(/[^\d.-]/g, '');
  return parseFloat(numericValue) || 0;
};

// Helper function to format price with currency
const formatPrice = (price, currency = '৳') => {
  return `${currency}${price.toLocaleString()}`;
};

export default function OrderSummary() {
  const router = useRouter();
  const { cartData } = useAppSelector((state) => state.cart);
  const { applyVoucher } = useCart(); // You'll need to add this to your cart hooks
  
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Calculate totals from cart data
  const calculateTotals = () => {
    if (!cartData?.data) {
      return {
        totalItems: 0,
        subtotal: 0,
        shippingFee: 0,
        total: 0
      };
    }

    let totalItems = 0;
    let subtotal = 0;
    let shippingFee = 0;

    cartData.data.forEach(shop => {
      // Count total items
      totalItems += shop.cart_items.length;

      // Calculate subtotal from shop subtotals
      subtotal += parsePrice(shop.sub_total);

      // Sum up shipping costs
      shop.cart_items.forEach(item => {
        shippingFee += item.shipping_cost || 0;
      });
    });

    // Apply voucher discount if any
    let discount = 0;
    if (appliedVoucher) {
      // Example voucher logic - you can customize this based on your voucher types
      if (appliedVoucher.type === 'percentage') {
        discount = (subtotal * appliedVoucher.value) / 100;
      } else if (appliedVoucher.type === 'fixed') {
        discount = appliedVoucher.value;
      }
    }

    const total = subtotal + shippingFee - discount;

    return {
      totalItems,
      subtotal,
      shippingFee,
      discount,
      total
    };
  };

  const { totalItems, subtotal, shippingFee, discount, total } = calculateTotals();

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError('Please enter a voucher code');
      return;
    }

    setIsApplying(true);
    setVoucherError('');

    try {
      // Call your API to validate and apply voucher
      // This is a placeholder - implement based on your backend
      const response = await fetch('/api/validate-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: voucherCode,
          subtotal: subtotal 
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setAppliedVoucher({
          code: voucherCode,
          type: data.type, // 'percentage' or 'fixed'
          value: data.value,
          discount: data.discount
        });
        setVoucherCode('');
      } else {
        setVoucherError(data.message || 'Invalid voucher code');
      }
    } catch (error) {
      setVoucherError('Failed to apply voucher. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };

  const handleProceedToCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout-page');
  };

  // Get currency symbol from first item or default
  const currencySymbol = cartData?.data?.[0]?.cart_items?.[0]?.currency_symbol || '৳';

  return (
    <div className="border border-main shadow-lg rounded-2xl p-4 bg-white">
      {/* Header */}
      <h3 className="text-base font-semibold border-b border-gray-200 pb-2 mb-4">
        Order Summary
      </h3>

      {/* Summary Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Products Selected</span>
          <span className="text-red-500 font-medium">
            {totalItems.toString().padStart(2, '0')}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, currencySymbol)}</span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Shipping Fee</span>
          <span>{formatPrice(shippingFee, currencySymbol)}</span>
        </div>

        {/* Discount (if voucher applied) */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({appliedVoucher?.code})</span>
            <span>-{formatPrice(discount, currencySymbol)}</span>
          </div>
        )}

        {/* Voucher */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              disabled={!!appliedVoucher || isApplying}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {!appliedVoucher ? (
              <button 
                onClick={handleApplyVoucher}
                disabled={isApplying || !voucherCode.trim()}
                className="bg-main cursor-pointer text-white text-sm px-5 py-2 rounded-xl hover:bg-purple-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            ) : (
              <button 
                onClick={handleRemoveVoucher}
                className="bg-red-500 text-white text-sm px-5 py-2 rounded-xl hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                Remove
              </button>
            )}
          </div>
          
          {/* Voucher Error */}
          {voucherError && (
            <p className="text-red-500 text-xs mt-1">{voucherError}</p>
          )}

          {/* Applied Voucher Info */}
          {appliedVoucher && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
              <p className="text-green-700 text-xs font-medium">
                ✓ Voucher {appliedVoucher.code} applied successfully!
              </p>
              {appliedVoucher.type === 'percentage' ? (
                <p className="text-green-600 text-xs">
                  {appliedVoucher.value}% discount on subtotal
                </p>
              ) : (
                <p className="text-green-600 text-xs">
                  {formatPrice(appliedVoucher.value, currencySymbol)} discount applied
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="my-5 border-gray-300" />

      {/* Total */}
      <div className="flex justify-between text-base font-semibold text-gray-800 mb-6">
        <span>Total</span>
        <span>{formatPrice(total, currencySymbol)}</span>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={handleProceedToCheckout}
        disabled={totalItems === 0}
        className="w-full cursor-pointer bg-main text-white px-2 py-2 my-3 rounded-xl font-medium uppercase flex items-center justify-between gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-bold">Proceed to Checkout</span>
        <span className="bg-white text-black p-1.5 rounded-md">
          <ButtonArrowIcon width={15} height={15} />
        </span>
      </button>

      {/* Empty cart message */}
      {totalItems === 0 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Your cart is empty. Add items to proceed to checkout.
        </p>
      )}
    </div>
  );
}