"use client";

import Breadcrumb2 from "@/app/components/layout/Breadcrumb2";
import Image from "next/image";
import samsung from "@/public/products/samsung.png";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OrderConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const orderId = params.id;
  const isGuest = searchParams.get('guest') === 'true';

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

//   const fetchOrderDetails = async () => {
//     try {
//       setLoading(true);
      
//       // Build URL with query parameters
//       let url = `${process.env.NEXT_PUBLIC_API_URL}/order/details/${orderId}`;
//       const params = new URLSearchParams();
      
//       if (isGuest) {
//         params.append('guest', 'true');
//         const tempUserId = localStorage.getItem('guest_id');
//         if (tempUserId) {
//           params.append('temp_user_id', tempUserId);
//         }
//       }
      
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       console.log('Fetching order details from:', url);

//       const headers = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       };
      
//       // Add auth header if user is logged in
//       if (!isGuest) {
//         const token = localStorage.getItem('token');
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//       }

//       const response = await fetch(url, { headers });

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error('Order not found');
//         }
//         throw new Error('Failed to load order details');
//       }

//       const data = await response.json();
//       console.log('Order details:', data);

//       if (data.result) {
//         setOrderDetails(data.order);
//       } else {
//         setError(data.message || 'Failed to load order details');
//         toast.error('Failed to load order details');
//       }
//     } catch (error) {
//       console.error('Error fetching order:', error);
//       setError(error.message || 'Failed to load order details');
//       toast.error('Failed to load order details');
//     } finally {
//       setLoading(false);
//     }
//   };

  // Format date
  
//   const fetchOrderDetails = async () => {
//   try {
//     setLoading(true);
    
//     // Build URL with query parameters
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/order/details/${orderId}`;
//     const params = new URLSearchParams();
    
//     if (isGuest) {
//       params.append('guest', 'true');
//       const tempUserId = localStorage.getItem('guest_id');
//       if (tempUserId) {
//         params.append('temp_user_id', tempUserId);
//       }
//     }
    
//     if (params.toString()) {
//       url += `?${params.toString()}`;
//     }

//     console.log('Fetching order details from:', url);

//     const headers = {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     };
    
//     // Add auth header if user is logged in
//     if (!isGuest) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers.Authorization = `Bearer ${token}`;
//         console.log('Using auth token:', token.substring(0, 20) + '...');
//       } else {
//         console.log('No token found for authenticated user');
//       }
//     }

//     console.log('Request headers:', headers);

//     const response = await fetch(url, { headers });
    
//     console.log('Response status:', response.status);
//     console.log('Response headers:', [...response.headers.entries()]);
    
//     // Try to get the response text first for debugging
//     const responseText = await response.text();
//     console.log('Raw response:', responseText);
    
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error('Failed to parse JSON:', responseText);
//       throw new Error('Invalid response from server');
//     }

//     console.log('Order details:', data);

//     if (response.ok && data.result) {
//       setOrderDetails(data.order);
//     } else {
//       setError(data.message || 'Failed to load order details');
//       toast.error('Failed to load order details');
//     }
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     setError(error.message || 'Failed to load order details');
//     toast.error('Failed to load order details');
//   } finally {
//     setLoading(false);
//   }
// };

const fetchOrderDetails = async () => {
  try {
    setLoading(true);
    
    // Choose the correct endpoint based on user type
    let url;
    if (isGuest) {
      // Use the guest endpoint
      url = `${process.env.NEXT_PUBLIC_API_URL}/order/guest-details/${orderId}`;
      // Add guest=true and temp_user_id as query parameters
      url += `?guest=true&temp_user_id=${localStorage.getItem('guest_id')}`;
    } else {
      // Use the auth endpoint
      url = `${process.env.NEXT_PUBLIC_API_URL}/order/details/${orderId}`;
    }

    // console.log('Fetching order details from:', url);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add auth header for authenticated users
    if (!isGuest) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, { headers });
    
    const responseText = await response.text();
    // console.log('Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', responseText);
      throw new Error('Invalid response from server');
    }

    // console.log('Order details:', data);

    if (response.ok && data.result) {
      setOrderDetails(data.order);
    } else {
      setError(data.message || 'Failed to load order details');
      toast.error('Failed to load order details');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    setError(error.message || 'Failed to load order details');
    toast.error('Failed to load order details');
  } finally {
    setLoading(false);
  }
};
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Extract shipping address from JSON
  const getShippingAddress = () => {
    return orderDetails?.shipping_address || null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <Breadcrumb2 />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <Breadcrumb2 />
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Failed to load order details</h3>
          <p className="mt-2 text-gray-500">{error || 'Please try again later'}</p>
          <Link href="/" className="mt-6 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const shippingAddress = getShippingAddress();
  
  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <Breadcrumb2 />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <svg
          width="48"
          height="51"
          viewBox="0 0 58 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-2 sm:mb-3"
        >
          <path
            d="M57.1381 36.5502C55.8798 34.5931 54.6222 32.7058 53.364 30.7493C53.085 30.3301 53.085 30.0504 53.364 29.6312C54.6222 27.7445 55.8101 25.8571 57.0683 23.9704C58.5358 21.7342 57.7672 19.5672 55.2507 18.659C53.1547 17.8904 51.0581 17.052 48.9614 16.2834C48.5422 16.1432 48.3323 15.8635 48.3323 15.3746C48.2626 13.0686 48.123 10.7621 47.9829 8.52592C47.8433 6.07984 45.9566 4.68208 43.5803 5.3112C41.3442 5.86992 39.108 6.49904 36.941 7.12816C36.452 7.26768 36.173 7.12816 35.8229 6.77872C34.4251 4.96112 32.9576 3.21456 31.5605 1.46736C30.0226 -0.48912 27.6462 -0.48912 26.0392 1.46736C24.6414 3.21456 23.1739 4.96176 21.8459 6.70896C21.4965 7.19792 21.147 7.26768 20.5883 7.12816C18.4219 6.49904 16.2555 5.94032 14.7176 5.52048C11.7128 4.8216 9.89583 6.01008 9.75567 8.52592C9.61615 10.8318 9.47663 13.1384 9.40623 15.5147C9.40623 16.0037 9.19695 16.213 8.77775 16.4229L2.27855 18.9387C0.0417519 19.8475 -0.657128 22.0139 0.670872 24.0402C1.92911 25.9973 3.18671 27.884 4.44495 29.8405C4.72399 30.2603 4.72399 30.5394 4.44495 31.029C3.12324 32.9824 1.8417 34.9628 0.601112 36.9688C-0.586728 38.8562 0.181911 41.0923 2.27791 41.9307C4.44495 42.7691 6.68111 43.6075 8.84751 44.4466C9.33647 44.5867 9.47663 44.8658 9.47663 45.3554C9.54639 47.5915 9.82607 49.7586 9.82607 51.9941C9.82607 54.2309 11.7826 56.2571 14.5083 55.4187C16.6747 54.7198 18.8411 54.2309 21.0075 53.6011C21.4267 53.4616 21.7064 53.532 21.9861 53.9512C23.4536 55.7682 24.8514 57.5154 26.3189 59.3323C27.9259 61.2888 30.2325 61.2888 31.7698 59.3323C33.2373 57.5147 34.635 55.7675 36.1026 53.9512C36.3822 53.6018 36.5915 53.4616 37.0811 53.6018C39.3173 54.2309 41.5534 54.7896 43.7902 55.4187C46.0962 56.0478 48.0526 54.6501 48.123 52.2738C48.2626 49.9678 48.4021 47.6613 48.4725 45.285C48.4725 44.7262 48.7515 44.517 49.1714 44.3768C51.3026 43.5919 53.4225 42.7765 55.5304 41.9307C57.7672 40.8126 58.4661 38.5771 57.1381 36.5502ZM40.4354 25.0878L26.4584 39.0654C26.109 39.4142 25.62 39.6939 25.1304 39.7637C24.9909 39.7637 24.781 39.8341 24.6414 39.8341C24.0123 39.8341 23.3134 39.5544 22.8245 39.0648L17.0939 33.3342C16.6238 32.8603 16.36 32.2197 16.36 31.5522C16.36 30.8846 16.6238 30.244 17.0939 29.7701C17.5679 29.3 18.2084 29.0362 18.876 29.0362C19.5436 29.0362 20.1841 29.3 20.6581 29.7701L24.5717 33.6837L36.7317 21.5237C37.2056 21.0536 37.8462 20.7898 38.5138 20.7898C39.1813 20.7898 39.8219 21.0536 40.2958 21.5237C41.4139 22.5022 41.4139 24.1086 40.4354 25.0878Z"
            fill="#3BB77E"
          />
        </svg>

        <h3 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">
          Your Order is Successfully Placed
        </h3>
        <p className="text-xs sm:text-sm px-2">
          A copy of your order summary has been sent to{" "}
          <span className="font-bold">{shippingAddress?.email || 'your email'}</span>
        </p>
      </div>

      {/* Order Details */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left Summary */}
        <div className="w-full lg:w-90 border border-main rounded-xl p-4 sm:p-5 shadow-md h-fit flex-shrink-0">
          <h4 className="font-semibold text-lg border-b border-gray-200 pb-2 mb-3 sm:mb-4">
            Order Summary
          </h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Full Name:</span>
              <span className="text-right">{shippingAddress?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span className="text-right">{shippingAddress?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span className="text-right">{shippingAddress?.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Shipping Address:</span>
              <span className="text-right text-xs max-w-[200px]">
                {shippingAddress?.address || 'N/A'}, {shippingAddress?.city || ''}, {shippingAddress?.country || ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order Status:</span>
              <span className="text-right text-xs text-red-500">
                {orderDetails?.delivery_status || 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order Date:</span>
              <span className="text-right">{formatDate(orderDetails?.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Shipping:</span>
              <span className="text-right text-xs">
                {orderDetails?.shipping_type === 'home_delivery' ? 'Home Delivery' : 'Pickup Delivery'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Method:</span>
              <span className="text-right">
                {orderDetails?.payment_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cash on Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 min-w-0 border border-main rounded-xl p-4 sm:p-5 shadow-sm">
          <h4 className="font-semibold text-lg border-b border-gray-200 pb-2 mb-3 sm:mb-4">
            Order Details
          </h4>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
            <span className="font-medium">Order Code:</span>
            <span className="text-red-600 text-sm sm:text-base font-medium">
              {orderDetails?.code || 'N/A'}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-sm text-left border-collapse border-gray-200 min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Product</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">Variation</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">Delivery</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orderDetails?.order_details?.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-200">
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span>{index + 1}</span>
                        <Image
                          src={item.product?.thumbnail_image || samsung}
                          alt={item.product?.name || 'Product'}
                          width={40}
                          height={40}
                          className="rounded-lg flex-shrink-0 border border-main"
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {item.product?.name || 'Product Name'}
                          </p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm">
                      {item.variation || 'N/A'}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm">
                      {item.shipping_type === 'home_delivery' ? 'Home Delivery' : 'Pickup Point Delivery'}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium">
                      ৳{item.price?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Summary */}
          <div className="flex justify-end mt-4 px-2 sm:px-0">
            <div className="text-sm space-y-2 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] min-w-[280px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{(orderDetails?.grand_total - (orderDetails?.shipping_cost || 0) - (orderDetails?.tax || 0) + (orderDetails?.coupon_discount || 0))?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>৳{orderDetails?.shipping_cost?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>৳{orderDetails?.tax?.toLocaleString() || '0'}</span>
              </div>
              {orderDetails?.coupon_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Voucher Discount</span>
                  <span>-৳{orderDetails.coupon_discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base sm:text-lg border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>৳{orderDetails?.grand_total?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping Button */}
      <div className="mt-6">
        <Link href="/">
          <button className="cursor-pointer bg-main text-white px-6 py-2 sm:py-2 rounded-md hover:bg-white hover:text-main hover:outline-main hover:outline-1 transition text-sm sm:text-base w-full sm:w-auto">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}