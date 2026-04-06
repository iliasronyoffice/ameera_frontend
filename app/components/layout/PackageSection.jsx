"use client";

import DeleteIcon from "../icons/DeleteIcon";
import { useCart } from '@/store/hooks/useCart';
import { useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function PackageSection() {
  const { 
    cartData, 
    loading, 
    removeItem, 
    updateQuantity,
    loadCart,
    isEmpty,
    grandTotal,
    totalItems
  } = useCart();

  // Load cart data when component mounts
  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-main shadow-lg rounded-xl p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white border border-main shadow-lg rounded-xl p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  const handleRemoveItem = async (cartId) => {
    await removeItem(cartId);
  };

  // const handleQuantityChange = async (cartId, currentQty, newQty, upperLimit) => {
  //   if (newQty === currentQty) return;
  //   await updateQuantity(cartId, newQty, upperLimit);
  // };
  const handleQuantityChange = async (cartId, currentQty, newQty, upperLimit) => {
  if (newQty === currentQty) return;
  
  // Pass the cart ID (from your database) not product ID
  await updateQuantity(cartId, newQty, upperLimit);
};

  return (
    <>
      <div className="mb-4 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-gray-600">Total Items: <span className="font-semibold">{totalItems}</span></p>
      </div>

      {cartData?.data?.map((shop, shopIndex) => (
        <div key={shop.owner_id} className="bg-white border-gray-200 shadow-lg rounded-xl p-6 mb-4">
          <h3 className="font-semibold mb-4">
            Package {shopIndex + 1} of {cartData.data.length} - {shop.name}
          </h3>

          {/* Delivery Options */}
         {/* Delivery Options */}
<div className="flex gap-4 mb-6 hidden">
  
  {/* Standard Delivery */}
  <label className="relative cursor-pointer">
    <input
      type="radio"
      name="delivery"
      className="peer hidden"
      defaultChecked
    />

    <div className="w-48 p-4 rounded-lg border border-main shadow-sm 
    peer-checked:bg-purple-50 peer-checked:border-main transition">

      {/* check icon */}
      <div className="absolute top-3 left-3 w-5 h-5 rounded-md border 
      border-main flex items-center justify-center
      peer-checked:bg-purple-500 peer-checked:text-white text-xs">
        ✓
      </div>

      <div className="pl-7">
        <p className="font-semibold text-gray-800">140tk</p>
        <p className="text-sm text-gray-600">Standard Delivery</p>
        <p className="text-xs text-gray-400">Get by 4-8 Sep</p>
      </div>

    </div>
  </label>

  {/* Express Delivery */}
  <label className="relative cursor-pointer">
    <input
      type="radio"
      name="delivery"
      className="peer hidden"
    />

    <div className="w-48 p-4 rounded-lg border border-gray-200 shadow-sm 
    peer-checked:bg-purple-50 peer-checked:border-main transition">

      {/* check icon */}
      <div className="absolute top-3 left-3 w-5 h-5 rounded-md border 
      border-gray-400 flex items-center justify-center
      peer-checked:bg-purple-500 peer-checked:text-white text-xs">
        ✓
      </div>

      <div className="pl-7">
        <p className="font-semibold text-gray-800">200tk</p>
        <p className="text-sm text-gray-600">Express Delivery</p>
        <p className="text-xs text-gray-400">Get by 1 Sep</p>
      </div>

    </div>
  </label>

</div>

          {/* Products */}
          {shop.cart_items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={item.product_thumbnail_image}
                  alt={item.product_name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm text-gray-500">Sold by {shop.name}</p>
                {item.variation && (
                  <p className="text-xs text-gray-400">Variation: {item.variation}</p>
                )}
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => handleQuantityChange(
                      item.id, 
                      item.quantity, 
                      item.quantity - 1, 
                      item.upper_limit
                    )}
                    className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= item.lower_limit}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(
                      item.id, 
                      item.quantity, 
                      item.quantity + 1, 
                      item.upper_limit
                    )}
                    className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity >= item.upper_limit}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">{item.price}</p>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="mt-2 hover:text-red-600 transition-colors"
                >
                  <DeleteIcon width={15} height={15} />
                </button>
              </div>
            </div>
          ))}

          {/* <div className="flex justify-end mt-4 pt-4 border-t border-main">
            <div className="text-right">
              <p className="text-sm text-gray-600">Shop Subtotal:</p>
              <p className="font-semibold text-lg">{shop.sub_total}</p>
            </div>
          </div> */}
        </div>
      ))}

      {/* Grand Total */}
      {/* <div className="bg-white border border-main shadow-lg rounded-xl p-6 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Grand Total</h3>
          <p className="font-bold text-xl text-purple-600">{grandTotal}</p>
        </div>
      </div> */}
    </>
  );
}