"use client";

import React, { useEffect, useState } from "react";

const DeliveryType = ({ onDeliveryTypeChange }) => {
  const [deliveryType, setDeliveryType] = useState("home");
  const [pickupPoints, setPickupPoints] = useState([]);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState("");

  // useEffect(() => {
  //   // Load saved delivery type from localStorage on mount
  //   const savedDeliveryType = localStorage.getItem('deliveryType');
  //   const savedPickupPoint = localStorage.getItem('selectedPickupPoint');
    
  //   if (savedDeliveryType) {
  //     setDeliveryType(savedDeliveryType === 'home_delivery' ? 'home' : 'pickup');
  //   }
    
  //   if (savedPickupPoint) {
  //     setSelectedPickupPoint(savedPickupPoint);
  //   }
  // }, []);
  useEffect(() => {
  const savedDeliveryType = localStorage.getItem("deliveryType") || "home_delivery";
  const savedPickupPoint = localStorage.getItem("selectedPickupPoint");

  setDeliveryType(savedDeliveryType === "home_delivery" ? "home" : "pickup");

  if (savedPickupPoint) {
    setSelectedPickupPoint(savedPickupPoint);
  }
}, []);

  useEffect(() => {
    if (deliveryType === "pickup") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/pickup-list`)
        .then((res) => res.json())
        .then((data) => {
          setPickupPoints(data.data || []);
        })
        .catch((err) => console.error('Error fetching pickup points:', err));
    }
  }, [deliveryType]);

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
    const deliveryTypeValue = type === 'home' ? 'home_delivery' : 'pickup_point';
    
    // Store in localStorage
    localStorage.setItem('deliveryType', deliveryTypeValue);
    
    // If switching to home, clear pickup point
    if (type === 'home') {
      setSelectedPickupPoint('');
      localStorage.removeItem('selectedPickupPoint');
    }
    
    // Notify parent component if callback exists
    if (onDeliveryTypeChange) {
      onDeliveryTypeChange(deliveryTypeValue, type === 'home' ? null : selectedPickupPoint);
    }
  };

  const handlePickupPointChange = (e) => {
    const value = e.target.value;
    setSelectedPickupPoint(value);
    
    // Store in localStorage
    if (value) {
      localStorage.setItem('selectedPickupPoint', value);
    } else {
      localStorage.removeItem('selectedPickupPoint');
    }
    
    // Notify parent component if callback exists
    if (onDeliveryTypeChange) {
      onDeliveryTypeChange('pickup_point', value);
    }
  };

  return (
    <div className="grid grid-cols-12 mt-6">
      <div className="col-span-12 lg:col-span-8">

        {/* Label */}
        <label className="text-gray-500 text-sm">
          Select Delivery Type
        </label>

        {/* Buttons */}
        <div className="flex gap-4 mt-3">

          {/* Home Delivery */}
          <button
            type="button"
            onClick={() => handleDeliveryTypeChange("home")}
            className={`px-5 py-2 rounded-lg text-sm border transition
            ${
              deliveryType === "home"
                ? "bg-main text-white border-main"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Home Delivery
          </button>

          {/* Local Pickup */}
          <button
            type="button"
            onClick={() => handleDeliveryTypeChange("pickup")}
            className={`px-5 py-2 rounded-lg text-sm border transition
            ${
              deliveryType === "pickup"
                ? "bg-main text-white border-main"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Local Pickup
          </button>
        </div>

        {/* Pickup Dropdown */}
        {deliveryType === "pickup" && (
          <div className="mt-4">
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-main"
              value={selectedPickupPoint}
              onChange={handlePickupPointChange}
            >
              <option value="">Select Pickup Address</option>
              {pickupPoints.map((pickup) => (
                <option key={pickup.id} value={pickup.id}>
                  {pickup.name} - {pickup.address}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>
    </div>
  );
};

export default DeliveryType;