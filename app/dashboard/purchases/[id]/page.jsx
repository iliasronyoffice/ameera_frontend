'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import OrderStatusBadge from '@/app/components/dashboard/OrderStatusBadge';

export default function PurchaseDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
   const [downloading, setDownloading] = useState(false); // Added missing state

  useEffect(() => {
    fetchOrderDetails();
    fetchOrderItems();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchase-history-details/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setOrder(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchOrderItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchase-history-items/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    } finally {
      setLoading(false);
    }
  };

//   const downloadInvoice = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       window.open(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoice/download/${id}`,
//         '_blank'
//       );
//     } catch (error) {
//       console.error('Error downloading invoice:', error);
//     }
//   };

const downloadInvoice = async () => {
  if (downloading) return;
  
  setDownloading(true);
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/invoice/download/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
          'Currency-Code': 'BDT',
          'App-Language': 'en'
        },
      }
    );
    
    // Log response details for debugging
    // console.log('Response status:', response.status);
    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    // console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/pdf')) {
      const text = await response.text();
      console.error('Unexpected content type. Response:', text);
      throw new Error('Invalid response format. Expected PDF.');
    }
    
    const blob = await response.blob();
    // console.log('Blob size:', blob.size, 'bytes');
    
    if (blob.size === 0) {
      throw new Error('PDF file is empty');
    }
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${order?.code || id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error downloading invoice:', error);
    alert(`Failed to download invoice: ${error.message}`);
  } finally {
    setDownloading(false);
  }
};

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Link href="/dashboard/purchases" className="mt-4 inline-block text-indigo-600">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/purchases"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Order #{order.code}
            </h1>
            <p className="text-gray-600">Placed on {order.date}</p>
          </div>
          <button
            onClick={downloadInvoice}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <DocumentArrowDownIcon className="mr-2 h-5 w-5" />
            Download Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white shadow">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500">Size: {item.variation}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{item.price}</p>
                      <OrderStatusBadge status={item.delivery_status} type="delivery" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white shadow">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping Cost</span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.shipping_cost}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Coupon Discount</span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.coupon_discount}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-base font-medium text-gray-900">Grand Total</span>
                  <span className="text-base font-bold text-gray-900">
                    {order.grand_total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-900">{order.shipping_address.name}</p>
              <p className="text-sm text-gray-600">{order.shipping_address.email}</p>
              <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>
              <p className="text-sm text-gray-600">{order.shipping_address.address}</p>
              <p className="text-sm text-gray-600">
                {order.shipping_address.city}, {order.shipping_address.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}