"use client";

import { useState, useEffect } from 'react';
import { FiX, FiMapPin, FiPhone, FiMail, FiHome } from 'react-icons/fi';
import { FaCity } from 'react-icons/fa';
import { BiNote } from 'react-icons/bi';
import useCities from '@/app/hooks/useCities';

export default function AddressModal({ isOpen, onClose, onSave, address }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city_id: '',
    order_note: ''
  });

 const { cities, loadingCities } = useCities();


  // Populate form if editing existing address
  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city_id: '',
        order_note: ''
      });
    }
  }, [address]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-main bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {address ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiHome className="w-4 h-4" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiMail className="w-4 h-4" />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiPhone className="w-4 h-4" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="+880 1XXX-XXXXXX"
                required
              />
            </div>

            {/* Shipping Area / City */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FaCity className="w-4 h-4" />
                Select Shipping Area <span className="text-red-500">*</span>
              </label>

              <select
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                >
                <option value="">Select City</option>

                {loadingCities ? (
                    <option>Loading...</option>
                ) : (
                    cities.map((city) => (
                    <option key={city.id} value={city.id}>
                        {city.name} (Tk {city.cost})
                    </option>
                    ))
                )}
                </select>
            </div>

            {/* Full Address */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiHome className="w-4 h-4" />
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="House #, Road #, Area"
                rows="3"
                required
              />
            </div>

            {/* Order Note */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <BiNote className="w-4 h-4" />
                Order Notes (Optional)
              </label>
              <textarea
                name="order_note"
                value={formData.order_note}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Special instructions for delivery"
                rows="2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-main rounded-lg transition-colors flex items-center gap-2"
            >
              <FiMapPin className="w-4 h-4" />
              {address ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}