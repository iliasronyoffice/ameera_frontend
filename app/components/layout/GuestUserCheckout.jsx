"use client";

import useCities from "@/app/hooks/useCities";
import DeliveryType from "./DeliveryType";
import PackageSection from "./PackageSection";
import PaymentSidebar from "./PaymentSidebar";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function GuestUserCheckout() {
  const { cities, loadingCities } = useCities();
  const [deliveryInfo, setDeliveryInfo] = useState({
  deliveryType: 'home_delivery',
  pickupPointId: null
});

const handleDeliveryTypeChange = (deliveryType, pickupPointId) => {
  setDeliveryInfo({
    deliveryType,
    pickupPointId
  });
  
  // Also store in localStorage for PaymentSidebar to access
  localStorage.setItem('deliveryType', deliveryType);
  if (pickupPointId) {
    localStorage.setItem('selectedPickupPoint', pickupPointId);
  } else {
    localStorage.removeItem('selectedPickupPoint');
  }
};
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city_id: "",
    address: "",
    order_note: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-2">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>

            <div className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-200 shadow-sm rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Full Name *"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-200 shadow-sm rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Email"
                  type="email"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-200 shadow-sm rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Phone Number *"
                />

                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select City</option>
                  {loadingCities ? (
                    <option disabled>Loading cities...</option>
                  ) : (
                    cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} (Tk {city.cost})
                      </option>
                    ))
                  )}
                </select>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-200 shadow-sm rounded-lg p-3 text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Full Address (House #, Road #, Area) *"
                  rows="3"
                />

                <textarea
                  name="order_note"
                  value={formData.order_note}
                  onChange={handleChange}
                  className="border border-gray-200 shadow-sm rounded-lg p-3 text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Order Notes (Optional)"
                  rows="2"
                />
              </div>

              <DeliveryType onDeliveryTypeChange={handleDeliveryTypeChange} />
            </div>
          </div>

          <PackageSection />
        </div>

        {/* RIGHT PAYMENT SIDEBAR */}
        <PaymentSidebar 
          guestFormData={formData}
          isGuest={true}
        />
      </div>
    </div>
  );
}