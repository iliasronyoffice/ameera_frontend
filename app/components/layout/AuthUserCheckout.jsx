"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";
import ButtonArrowIcon from "@/app/components/icons/ButtonArrowIcon";
import PackageSection from "./PackageSection";
import PaymentSidebar from "./PaymentSidebar";
import DeliveryType from "./DeliveryType";
import AddressModal from "./AddressModal";
import { toast } from "react-hot-toast";
import AddressCard from "./AddressCard";

export default function AuthUserCheckout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryType: "home_delivery",
    pickupPointId: null,
  });

  const handleDeliveryTypeChange = (deliveryType, pickupPointId) => {
    setDeliveryInfo({
      deliveryType,
      pickupPointId,
    });

    // Also store in localStorage for PaymentSidebar to access
    localStorage.setItem("deliveryType", deliveryType);
    if (pickupPointId) {
      localStorage.setItem("selectedPickupPoint", pickupPointId);
    } else {
      localStorage.removeItem("selectedPickupPoint");
    }
  };

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/shipping/address`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    let addressList = [];

    // Handle different API response structures
    if (Array.isArray(data)) {
      addressList = data;
    } 
    else if (data?.data && Array.isArray(data.data)) {
      addressList = data.data;
    } 
    else if (data?.addresses && Array.isArray(data.addresses)) {
      addressList = data.addresses;
    } 
    else if (data?.result && data?.addresses) {
      addressList = data.addresses;
    } 
    else {
      console.error("Unexpected response structure:", data);
      setAddresses([]);
      return;
    }

    // Set addresses
    setAddresses(addressList);

    // Select default OR first address
    if (addressList.length > 0) {
      const defaultAddress = addressList.find(
        (addr) => addr.set_default === 1
      );

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(addressList[0].id);
      }
    }

  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Failed to fetch addresses");
  } finally {
    setLoading(false);
  }
};
  
  const handleAddAddress = async (addressData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/shipping/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(addressData),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Response data:", data);

      if (data.result) {
        toast.success("Address added successfully");
        setIsModalOpen(false);
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Full error:", error);
      toast.error("Failed to add address: " + error.message);
    }
  };

  const handleUpdateAddress = async (addressData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/shipping/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            id: editingAddress.id,
            ...addressData,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        toast.success(data.message);
        setIsModalOpen(false);
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to update address");
      }
    } catch (error) {
      toast.error("Failed to update address");
    }
  };

  const handleMakeDefault = async (addressId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/shipping/make_default`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id: addressId }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        toast.success(data.message);
        setSelectedAddressId(addressId);
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to update default address");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update default address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/shipping/delete/${addressId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      if (data.result) {
        toast.success(data.message);
        if (selectedAddressId === addressId) {
          // If deleted address was selected, select another default or first address
          const remainingAddresses = addresses.filter(
            (addr) => addr.id !== addressId,
          );
          const newDefault = remainingAddresses.find(
            (addr) => addr.set_default === 1,
          );
          setSelectedAddressId(
            newDefault?.id || remainingAddresses[0]?.id || null,
          );
        }
        fetchAddresses();
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    // You can optionally show a toast notification
    toast.success("Delivery address updated");
  };

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen p-0 md:p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Delivery Information</h2>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setIsModalOpen(true);
                }}
                className="text-sm text-white font-medium flex items-center gap-1 bg-main p-2 rounded-lg"
              >
                <FiPlus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {/* Address List */}
            {loading ? (
              <div className="text-center py-8">
                <FiLoader className="inline-block animate-spin h-8 w-8 text-red-500" />
              </div>
            ) : addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((address, index) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    index={index + 1}
                    isSelected={selectedAddressId === address.id}
                    onSelect={() => handleAddressSelect(address.id)}
                    onMakeDefault={() => handleMakeDefault(address.id)}
                    onEdit={() => handleEditAddress(address)}
                    onDelete={() => handleDeleteAddress(address.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No addresses found</p>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setIsModalOpen(true);
                  }}
                  className="mt-3 text-red-500 hover:text-red-600 font-medium"
                >
                  Add your first address
                </button>
              </div>
            )}

            <div className="mt-6 border-t pt-6">
              <div className="grid grid-cols-12 items-center mt-4">
                <div className="col-span-12 lg:col-span-8">
                  <DeliveryType
                    onDeliveryTypeChange={handleDeliveryTypeChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Package Section */}
          <PackageSection />
        </div>

        {/* RIGHT PAYMENT SIDEBAR */}
        {/* <PaymentSidebar selectedAddressId={selectedAddressId} /> */}
        <PaymentSidebar
          selectedAddressId={selectedAddressId}
          addresses={addresses}
          isGuest={false}
        />
      </div>

      {/* Address Modal for Add/Edit */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
        address={editingAddress}
      />
    </div>
  );
}
