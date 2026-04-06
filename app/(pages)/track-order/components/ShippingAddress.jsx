"use client";
import { parseShippingAddress } from "../utils/orderHelpers";

export default function ShippingAddress({ shippingAddress }) {
  const address = shippingAddress ? parseShippingAddress(shippingAddress) : null;
  
  if (!address) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="font-semibold mb-3">Shipping Address</h2>
      <div className="text-sm space-y-1">
        <p className="font-medium">{address.name}</p>
        <p className="text-gray-600">{address.phone}</p>
        <p className="text-gray-600">{address.address}</p>
        {address.email && <p className="text-gray-600">{address.email}</p>}
      </div>
    </div>
  );
}