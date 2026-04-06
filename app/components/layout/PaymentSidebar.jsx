// "use client";

// import ButtonArrowIcon from "../icons/ButtonArrowIcon";
// import { useAppSelector } from "@/store/hooks";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import useCities from "@/app/hooks/useCities";

// export default function PaymentSidebar({
//   selectedAddressId,
//   addresses = [],
//   guestFormData = null,
//   isGuest = false,
// }) {
//   const router = useRouter();
//   const { cities } = useCities();
//   const { cartData, summary, loading } = useAppSelector((state) => state.cart);
//   const [selectedPayment, setSelectedPayment] = useState("cash_on_delivery");
//   const [voucherCode, setVoucherCode] = useState("");
//   const [appliedVoucher, setAppliedVoucher] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [shippingCost, setShippingCost] = useState(0);
//   const [shippingDetails, setShippingDetails] = useState(null);
//   const [isCashOnDeliveryEnabled, setIsCashOnDeliveryEnabled] = useState(true);
//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

//    // Fetch payment methods on component mount
//   useEffect(() => {
//     fetchPaymentMethods();
//   }, []);


//   const fetchPaymentMethods = async () => {
//     try {
//       setIsLoadingPaymentMethods(true);
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/active-payment-methods`
//       );

//       if (!response.ok) throw new Error("Failed to fetch payment methods");

//       const data = await response.json();

//       if (data.success) {
//         // Set cash on delivery status
//         setIsCashOnDeliveryEnabled(data.cash_on_delivery === "1");
        
//         // Process payment methods from API
//         const methods = data.data
//           .filter(method => method.active === 1)
//           .map(method => ({
//             value: method.name,
//             label: getPaymentMethodLabel(method.name),
//             id: method.id
//           }));
        
//         setPaymentMethods(methods);
        
//         // Set default payment method
//         if (methods.length > 0 && data.cash_on_delivery !== "1") {
//           setSelectedPayment(methods[0].value);
//         } else if (data.cash_on_delivery === "1") {
//           setSelectedPayment("cash_on_delivery");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching payment methods:", error);
//       toast.error("Failed to load payment methods");
//     } finally {
//       setIsLoadingPaymentMethods(false);
//     }
//   };

//   // Get display label for payment methods
//   const getPaymentMethodLabel = (methodName) => {
//     const labels = {
//       'sslcommerz': 'Pay with SSL Commerz (Card/Mobile Banking)',
//       'bkash': 'Pay with bKash',
//       'nagad': 'Pay with Nagad',
//       'rocket': 'Pay with Rocket',
//       'cod': 'Cash on Delivery'
//     };
//     return labels[methodName] || methodName.charAt(0).toUpperCase() + methodName.slice(1);
//   };

//   // Extract numeric value from price string (e.g., "৳5,000" -> 5000)
//   const extractNumber = (priceString) => {
//     if (!priceString) return 0;
//     const match = priceString.match(/[\d,]+/);
//     return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
//   };

//   // Format price with currency
//   const formatPrice = (price) => {
//     return `৳${price.toFixed(2)}`;
//   };

//   // Calculate subtotal from cart data
//   const calculateSubtotal = () => {
//     if (!cartData?.data) return 0;

//     let subtotal = 0;
//     cartData.data.forEach((shop) => {
//       subtotal += extractNumber(shop.sub_total);
//     });
//     return subtotal;
//   };

//   const subtotal = calculateSubtotal();

//   // Find the selected address (for auth users)
//   const getSelectedAddress = () => {
//     if (!selectedAddressId || !addresses.length) return null;
//     return addresses.find((addr) => addr.id === selectedAddressId);
//   };

//   // Get city name from ID for guest users
//   const getCityName = (cityId) => {
//     const city = cities?.find((c) => c.id === parseInt(cityId));
//     return city?.name || "";
//   };

//   // Calculate shipping cost when address/city changes
//   useEffect(() => {
//     if (isGuest) {
//       if (guestFormData?.city_id && cartData?.data) {
//         calculateGuestShippingCost();
//       }
//     } else {
//       if (selectedAddressId && cartData?.data) {
//         calculateShippingCost();
//       }
//     }
//   }, [selectedAddressId, guestFormData?.city_id, cartData, isGuest]);

//   // Calculate shipping for auth users
//   const calculateShippingCost = async () => {
//     if (!cartData?.data || !selectedAddressId) return;

//     setIsCalculatingShipping(true);
//     try {
//       const selectedAddress = getSelectedAddress();

//       if (!selectedAddress) {
//         console.error("Selected address not found:", selectedAddressId);
//         toast.error(
//           "Selected address not found. Please select another address.",
//         );
//         return;
//       }

//       const sellerList = cartData.data.map((shop) => ({
//         seller_id: shop.owner_id,
//         shipping_type: "home_delivery",
//         shipping_id: null,
//       }));

//       const userStr = localStorage.getItem("user");
//       const userId = userStr ? JSON.parse(userStr).id : null;
//       const tempUserId = localStorage.getItem("guest_id");

//       const requestBody = {
//         user_id: userId,
//         temp_user_id: tempUserId,
//         seller_list: sellerList,
//         address_id: selectedAddressId,
//         country_id: selectedAddress.country_id,
//         city_id: selectedAddress.city_id,
//       };

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/shipping_cost`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             ...(localStorage.getItem("token") && {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             }),
//           },
//           body: JSON.stringify(requestBody),
//         },
//       );

//       if (!response.ok) throw new Error("Failed to calculate shipping");

//       const data = await response.json();

//       if (data.result) {
//         setShippingCost(extractNumber(data.value_string));
//         setShippingDetails(data);
//       }
//     } catch (error) {
//       console.error("Shipping cost error:", error);
//       toast.error("Failed to calculate shipping cost");
//     } finally {
//       setIsCalculatingShipping(false);
//     }
//   };

//   // Calculate shipping for guest users
//   const calculateGuestShippingCost = async () => {
//     if (!cartData?.data || !guestFormData?.city_id) return;

//     setIsCalculatingShipping(true);
//     try {
//       const sellerList = cartData.data.map((shop) => ({
//         seller_id: shop.owner_id,
//         shipping_type: "home_delivery",
//         shipping_id: null,
//       }));

//       const tempUserId = localStorage.getItem("guest_id");

//       const requestBody = {
//         temp_user_id: tempUserId,
//         seller_list: sellerList,
//         country_id: 18, // Default country ID for Bangladesh
//         city_id: guestFormData.city_id,
//       };

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/shipping_cost`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         },
//       );

//       if (!response.ok) throw new Error("Failed to calculate shipping");

//       const data = await response.json();

//       if (data.result) {
//         setShippingCost(extractNumber(data.value_string));
//         setShippingDetails(data);
//       }
//     } catch (error) {
//       console.error("Shipping cost error:", error);
//       toast.error("Failed to calculate shipping cost");
//     } finally {
//       setIsCalculatingShipping(false);
//     }
//   };

//   const handleApplyVoucher = async () => {
//     if (!voucherCode.trim()) {
//       toast.error("Please enter a voucher code");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const total = subtotal + shippingCost;

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/check-voucher`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             ...(localStorage.getItem("token") && {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             }),
//           },
//           body: JSON.stringify({
//             code: voucherCode,
//             total: total,
//           }),
//         },
//       );

//       const data = await response.json();

//       if (data.valid) {
//         setAppliedVoucher(data);
//         toast.success("Voucher applied successfully!");
//       } else {
//         toast.error(data.message || "Invalid voucher code");
//       }
//     } catch (error) {
//       console.error("Voucher error:", error);
//       toast.error("Failed to apply voucher");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleConfirmOrder = async () => {
//     if (!isGuest) {
//       const token = localStorage.getItem("token");
//       // console.log("Token exists:", !!token);
//       // console.log(
//       //   "Token value:",
//       //   token ? token.substring(0, 20) + "..." : "No token",
//       // );

//       // Try to decode token to see if it's valid (if it's a JWT)
//       try {
//         const base64Url = token.split(".")[1];
//         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//         const payload = JSON.parse(window.atob(base64));
//         // console.log("Token payload:", payload);
//       } catch (e) {
//         console.log("Token is not a valid JWT or cannot be decoded");
//       }
//     }

//     // Validate cart
//     if (!cartData?.data || cartData.data.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     // Validate based on user type
//     if (isGuest) {
//       if (
//         !guestFormData?.name ||
//         !guestFormData?.phone ||
//         !guestFormData?.city_id ||
//         !guestFormData?.address
//       ) {
//         toast.error("Please fill in all required fields");
//         return;
//       }
//     } else {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to continue");
//         router.push("/login");
//         return;
//       }

//       if (!selectedAddressId) {
//         toast.error("Please select a delivery address");
//         return;
//       }
//     }

//     setIsProcessing(true);
    

//     try {
//       // Choose the correct endpoint based on user type
//       const endpoint = isGuest
//         ? `${process.env.NEXT_PUBLIC_API_URL}/guest/order/store`
//         : `${process.env.NEXT_PUBLIC_API_URL}/order/store`;

//       // Get delivery type from localStorage or state
//       const deliveryType =
//         localStorage.getItem("deliveryType") || "home_delivery";
//       const pickupPointId = localStorage.getItem("selectedPickupPoint") || null;

//       // Validate pickup point selection
//       if (deliveryType === "pickup_point" && !pickupPointId) {
//         toast.error("Please select a pickup point");
//         setIsProcessing(false);
//         return;
//       }

//       // Prepare request body
//       const requestBody = {
//         payment_type: selectedPayment,
//         delivery_type: deliveryType,
//         pickup_point_id: pickupPointId,
//       };

//       // Add guest-specific data if needed
//       if (isGuest) {
//         requestBody.temp_user_id = localStorage.getItem("guest_id");
//         requestBody.guest_info = {
//           name: guestFormData.name,
//           email: guestFormData.email || "",
//           phone: guestFormData.phone,
//           city_id: guestFormData.city_id,
//           city_name: getCityName(guestFormData.city_id),
//           address: guestFormData.address,
//           order_note: guestFormData.order_note || "",
//         };
//       } else {
//         // For auth users, add shipping address (only for home delivery)
//         const selectedAddress = getSelectedAddress();
//         // console.log('Selected address data:', selectedAddress);

//         if (selectedAddress) {
//           requestBody.shipping_address = {
//             name: selectedAddress.name || "",
//             email: selectedAddress.email || "",
//             phone: selectedAddress.phone || "",
//             address: selectedAddress.address || "",
//             order_note: selectedAddress.order_note || "",
//             city: selectedAddress.city_name || "",
//             country: "Bangladesh",
//             postal_code: selectedAddress.postal_code || "",
//           };
//         }
//       }

//       // Prepare headers
//       const headers = {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       };

//       // Add auth header only for authenticated users
//       if (!isGuest) {
//         const token = localStorage.getItem("token");
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//       }

//       // console.log('Placing order with data:', requestBody);
//       // console.log('Using endpoint:', endpoint);

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(requestBody),
//       });

//       const data = await response.json();
//       // console.log('Order response:', data);

//       if (data.result) {
//         toast.success("Order placed successfully!");

//         if (data.combined_order_id) {
//           const detailsUrl = isGuest
//             ? `/confirm-order/${data.combined_order_id}?guest=true`
//             : `/confirm-order/${data.combined_order_id}`;

//           router.push(detailsUrl);
//         } else {
//           router.push("/orders");
//         }
//       } else {
//         toast.error(data.message || "Failed to place order");
//       }
//     } catch (error) {
//       console.error("Order error:", error);
//       toast.error("Failed to place order");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const finalTotal = subtotal + shippingCost - (appliedVoucher?.discount || 0);

//   // Check if form is valid for guest users
//   const isGuestFormValid = isGuest
//     ? guestFormData?.name &&
//       guestFormData?.phone &&
//       guestFormData?.city_id &&
//       guestFormData?.address
//     : true;

//   if (loading) {
//     return (
//       <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 h-fit">
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 h-fit">
//         <h3 className="font-semibold mb-4">Payment Information</h3>

//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>{formatPrice(subtotal)}</span>
//           </div>

//           <div className="flex justify-between">
//             <span>Shipping Fee</span>
//             {isCalculatingShipping ? (
//               <span className="animate-pulse">Calculating...</span>
//             ) : (
//               <span>{formatPrice(shippingCost)}</span>
//             )}
//           </div>

//           {appliedVoucher && (
//             <div className="flex justify-between text-green-600">
//               <span>Voucher Discount</span>
//               <span>-{formatPrice(appliedVoucher.discount)}</span>
//             </div>
//           )}
//         </div>

//         <div className="flex gap-2 mt-4">
//           <input
//             className="border border-gray-200 rounded-lg p-2 flex-1 text-sm"
//             placeholder="Voucher Code"
//             value={voucherCode}
//             onChange={(e) => setVoucherCode(e.target.value)}
//             disabled={!!appliedVoucher}
//           />
//           {!appliedVoucher ? (
//             <button
//               onClick={handleApplyVoucher}
//               disabled={isProcessing || !voucherCode.trim()}
//               className="bg-main cursor-pointer text-white px-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isProcessing ? "..." : "Apply"}
//             </button>
//           ) : (
//             <button
//               onClick={() => setAppliedVoucher(null)}
//               className="bg-red-500 text-white px-3 rounded-lg text-sm"
//             >
//               Remove
//             </button>
//           )}
//         </div>

//         <div className="flex justify-between mt-4 font-semibold">
//           <span>Total</span>
//           <span className="text-lg">{formatPrice(finalTotal)}</span>
//         </div>

        
//         {/* <div className="mt-6 space-y-3 text-sm">
//           {[
//             { label: "Cash On Delivery", value: "cash_on_delivery" },
//             { label: "Pay by Bkash", value: "bkash" },
//             { label: "Pay by Card", value: "card" },
//           ].map((item) => (
//             <label
//               key={item.value}
//               className="flex items-center gap-3 cursor-pointer"
//             >
//               <input
//                 type="radio"
//                 name="payment"
//                 value={item.value}
//                 checked={selectedPayment === item.value}
//                 onChange={(e) => setSelectedPayment(e.target.value)}
//                 className="peer hidden"
//               />

//               <div
//                 className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center
//                peer-checked:bg-main peer-checked:border-main transition"
//               >
//                 <svg
//                   className="w-3 h-3 text-white hidden peer-checked:block"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>

//               <span>{item.label}</span>
//             </label>
//           ))}
//         </div> */}

//           {/* Dynamic Payment Methods */}
//         <div className="mt-6 space-y-3 text-sm">
//           {/* Cash on Delivery - if enabled */}
//           {isCashOnDeliveryEnabled && (
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="cash_on_delivery"
//                 checked={selectedPayment === "cash_on_delivery"}
//                 onChange={(e) => setSelectedPayment(e.target.value)}
//                 className="peer hidden"
//               />
//               <div
//                 className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center
//                peer-checked:bg-main peer-checked:border-main transition"
//               >
//                 <svg
//                   className="w-3 h-3 text-white hidden peer-checked:block"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>
//               <span>Cash on Delivery</span>
//             </label>
//           )}

//           {/* Dynamic payment methods from API */}
//           {paymentMethods.map((method) => (
//             <label
//               key={method.id}
//               className="flex items-center gap-3 cursor-pointer"
//             >
//               <input
//                 type="radio"
//                 name="payment"
//                 value={method.value}
//                 checked={selectedPayment === method.value}
//                 onChange={(e) => setSelectedPayment(e.target.value)}
//                 className="peer hidden"
//               />
//               <div
//                 className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center
//                peer-checked:bg-main peer-checked:border-main transition"
//               >
//                 <svg
//                   className="w-3 h-3 text-white hidden peer-checked:block"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>
//               <span>{method.label}</span>
//             </label>
//           ))}

//           {/* Show message if no payment methods available */}
//           {paymentMethods.length === 0 && !isCashOnDeliveryEnabled && (
//             <div className="text-red-500 text-center py-2">
//               No payment methods available. Please contact support.
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleConfirmOrder}
//           disabled={
//             isProcessing ||
//             !cartData?.data ||
//             cartData.data.length === 0 ||
//             (isGuest ? !isGuestFormValid : !selectedAddressId) ||
//             isCalculatingShipping
//           }
//           className="bg-main cursor-pointer text-white px-4 py-2 mt-3 rounded-xl font-medium uppercase flex items-center justify-between gap-2 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <span className="font-bold">
//             {isProcessing ? "PROCESSING..." : "CONFIRM ORDER"}
//           </span>
//           {!isProcessing && (
//             <span className="bg-white text-black p-1.5 rounded-md">
//               <ButtonArrowIcon width={15} height={15} />
//             </span>
//           )}
//         </button>

//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <p className="text-xs text-gray-500">
//             By confirming your order, you agree to our{" "}
//             <a href="/terms" className="text-main hover:underline">
//               Terms of Service
//             </a>{" "}
//             and{" "}
//             <a href="/privacy" className="text-main hover:underline">
//               Privacy Policy
//             </a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";

import ButtonArrowIcon from "../icons/ButtonArrowIcon";
import { useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useCities from "@/app/hooks/useCities";

export default function PaymentSidebar({
  selectedAddressId,
  addresses = [],
  guestFormData = null,
  isGuest = false,
}) {
  const router = useRouter();
  const { cities } = useCities();
  const { cartData, summary, loading } = useAppSelector((state) => state.cart);
  const [selectedPayment, setSelectedPayment] = useState("cash_on_delivery");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingDetails, setShippingDetails] = useState(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isCashOnDeliveryEnabled, setIsCashOnDeliveryEnabled] = useState(true);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);

  // Fetch payment methods on component mount
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoadingPaymentMethods(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/active-payment-methods`
      );

      if (!response.ok) throw new Error("Failed to fetch payment methods");

      const data = await response.json();

      if (data.success) {
        // Set cash on delivery status
        setIsCashOnDeliveryEnabled(data.cash_on_delivery === "1");
        
        // Process payment methods from API
        const methods = data.data
          .filter(method => method.active === 1)
          .map(method => ({
            value: method.name,
            label: getPaymentMethodLabel(method.name),
            id: method.id
          }));
        
        setPaymentMethods(methods);
        
        // Set default payment method
        if (methods.length > 0 && data.cash_on_delivery !== "1") {
          setSelectedPayment(methods[0].value);
        } else if (data.cash_on_delivery === "1") {
          setSelectedPayment("cash_on_delivery");
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };

  // Get display label for payment methods
  const getPaymentMethodLabel = (methodName) => {
    const labels = {
      'sslcommerz': 'Pay with SSL Commerz (Card/Mobile Banking)',
      'bkash': 'Pay with bKash',
      'nagad': 'Pay with Nagad',
      'rocket': 'Pay with Rocket',
      'cod': 'Cash on Delivery'
    };
    return labels[methodName] || methodName.charAt(0).toUpperCase() + methodName.slice(1);
  };

  // Extract numeric value from price string (e.g., "৳5,000" -> 5000)
  const extractNumber = (priceString) => {
    if (!priceString) return 0;
    const match = priceString.match(/[\d,]+/);
    return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  };

  // Format price with currency
  const formatPrice = (price) => {
    return `৳${price.toFixed(2)}`;
  };

  // Calculate subtotal from cart data
  const calculateSubtotal = () => {
    if (!cartData?.data) return 0;

    let subtotal = 0;
    cartData.data.forEach((shop) => {
      subtotal += extractNumber(shop.sub_total);
    });
    return subtotal;
  };

  const subtotal = calculateSubtotal();

  // Find the selected address (for auth users)
  const getSelectedAddress = () => {
    if (!selectedAddressId || !addresses.length) return null;
    return addresses.find((addr) => addr.id === selectedAddressId);
  };

  // Get city name from ID for guest users
  const getCityName = (cityId) => {
    const city = cities?.find((c) => c.id === parseInt(cityId));
    return city?.name || "";
  };

  // Calculate shipping cost when address/city changes
  useEffect(() => {
    if (isGuest) {
      if (guestFormData?.city_id && cartData?.data) {
        calculateGuestShippingCost();
      }
    } else {
      if (selectedAddressId && cartData?.data) {
        calculateShippingCost();
      }
    }
  }, [selectedAddressId, guestFormData?.city_id, cartData, isGuest]);

  // Calculate shipping for auth users
  const calculateShippingCost = async () => {
    if (!cartData?.data || !selectedAddressId) return;

    setIsCalculatingShipping(true);
    try {
      const selectedAddress = getSelectedAddress();

      if (!selectedAddress) {
        console.error("Selected address not found:", selectedAddressId);
        toast.error(
          "Selected address not found. Please select another address.",
        );
        return;
      }

      const sellerList = cartData.data.map((shop) => ({
        seller_id: shop.owner_id,
        shipping_type: "home_delivery",
        shipping_id: null,
      }));

      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : null;
      const tempUserId = localStorage.getItem("guest_id");

      const requestBody = {
        user_id: userId,
        temp_user_id: tempUserId,
        seller_list: sellerList,
        address_id: selectedAddressId,
        country_id: selectedAddress.country_id,
        city_id: selectedAddress.city_id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping_cost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) throw new Error("Failed to calculate shipping");

      const data = await response.json();

      if (data.result) {
        setShippingCost(extractNumber(data.value_string));
        setShippingDetails(data);
      }
    } catch (error) {
      console.error("Shipping cost error:", error);
      toast.error("Failed to calculate shipping cost");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Calculate shipping for guest users
  const calculateGuestShippingCost = async () => {
    if (!cartData?.data || !guestFormData?.city_id) return;

    setIsCalculatingShipping(true);
    try {
      const sellerList = cartData.data.map((shop) => ({
        seller_id: shop.owner_id,
        shipping_type: "home_delivery",
        shipping_id: null,
      }));

      const tempUserId = localStorage.getItem("guest_id");

      const requestBody = {
        temp_user_id: tempUserId,
        seller_list: sellerList,
        country_id: 18, // Default country ID for Bangladesh
        city_id: guestFormData.city_id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping_cost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) throw new Error("Failed to calculate shipping");

      const data = await response.json();

      if (data.result) {
        setShippingCost(extractNumber(data.value_string));
        setShippingDetails(data);
      }
    } catch (error) {
      console.error("Shipping cost error:", error);
      toast.error("Failed to calculate shipping cost");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    setIsProcessing(true);
    try {
      const total = subtotal + shippingCost;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/check-voucher`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify({
            code: voucherCode,
            total: total,
          }),
        },
      );

      const data = await response.json();

      if (data.valid) {
        setAppliedVoucher(data);
        toast.success("Voucher applied successfully!");
      } else {
        toast.error(data.message || "Invalid voucher code");
      }
    } catch (error) {
      console.error("Voucher error:", error);
      toast.error("Failed to apply voucher");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!isGuest) {
      const token = localStorage.getItem("token");
      // console.log("Token exists:", !!token);
      // console.log(
      //   "Token value:",
      //   token ? token.substring(0, 20) + "..." : "No token",
      // );

      // Try to decode token to see if it's valid (if it's a JWT)
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        // console.log("Token payload:", payload);
      } catch (e) {
        console.log("Token is not a valid JWT or cannot be decoded");
      }
    }

    // Validate cart
    if (!cartData?.data || cartData.data.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate based on user type
    if (isGuest) {
      if (
        !guestFormData?.name ||
        !guestFormData?.phone ||
        !guestFormData?.city_id ||
        !guestFormData?.address
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        router.push("/login");
        return;
      }

      if (!selectedAddressId) {
        toast.error("Please select a delivery address");
        return;
      }
    }

    setIsProcessing(true);
    

    try {
      // Choose the correct endpoint based on user type
      const endpoint = isGuest
        ? `${process.env.NEXT_PUBLIC_API_URL}/guest/order/store`
        : `${process.env.NEXT_PUBLIC_API_URL}/order/store`;

      // Get delivery type from localStorage or state
      const deliveryType =
        localStorage.getItem("deliveryType") || "home_delivery";
      const pickupPointId = localStorage.getItem("selectedPickupPoint") || null;

      // Validate pickup point selection
      if (deliveryType === "pickup_point" && !pickupPointId) {
        toast.error("Please select a pickup point");
        setIsProcessing(false);
        return;
      }

      // Prepare request body
      const requestBody = {
        payment_type: selectedPayment,
        delivery_type: deliveryType,
        pickup_point_id: pickupPointId,
      };

      // Add guest-specific data if needed
      if (isGuest) {
        requestBody.temp_user_id = localStorage.getItem("guest_id");
        requestBody.guest_info = {
          name: guestFormData.name,
          email: guestFormData.email || "",
          phone: guestFormData.phone,
          city_id: guestFormData.city_id,
          city_name: getCityName(guestFormData.city_id),
          address: guestFormData.address,
          order_note: guestFormData.order_note || "",
        };
      } else {
        // For auth users, add shipping address (only for home delivery)
        const selectedAddress = getSelectedAddress();
        // console.log('Selected address data:', selectedAddress);

        if (selectedAddress) {
          requestBody.shipping_address = {
            name: selectedAddress.name || "",
            email: selectedAddress.email || "",
            phone: selectedAddress.phone || "",
            address: selectedAddress.address || "",
            order_note: selectedAddress.order_note || "",
            city: selectedAddress.city_name || "",
            country: "Bangladesh",
            postal_code: selectedAddress.postal_code || "",
          };
        }
      }

      // Prepare headers
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // Add auth header only for authenticated users
      if (!isGuest) {
        const token = localStorage.getItem("token");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      // console.log('Placing order with data:', requestBody);
      // console.log('Using endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      // console.log('Order response:', data);

      if (data.result) {
        toast.success("Order placed successfully!");

        if (data.combined_order_id) {
          const detailsUrl = isGuest
            ? `/confirm-order/${data.combined_order_id}?guest=true`
            : `/confirm-order/${data.combined_order_id}`;

          router.push(detailsUrl);
        } else {
          router.push("/orders");
        }
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const finalTotal = subtotal + shippingCost - (appliedVoucher?.discount || 0);

  // Check if form is valid for guest users
  const isGuestFormValid = isGuest
    ? guestFormData?.name &&
      guestFormData?.phone &&
      guestFormData?.city_id &&
      guestFormData?.address
    : true;

  if (loading || isLoadingPaymentMethods) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 h-fit">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 h-fit">
        <h3 className="font-semibold mb-4">Payment Information</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee</span>
            {isCalculatingShipping ? (
              <span className="animate-pulse">Calculating...</span>
            ) : (
              <span>{formatPrice(shippingCost)}</span>
            )}
          </div>

          {appliedVoucher && (
            <div className="flex justify-between text-green-600">
              <span>Voucher Discount</span>
              <span>-{formatPrice(appliedVoucher.discount)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            className="border border-gray-200 rounded-lg p-2 flex-1 text-sm"
            placeholder="Voucher Code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            disabled={!!appliedVoucher}
          />
          {!appliedVoucher ? (
            <button
              onClick={handleApplyVoucher}
              disabled={isProcessing || !voucherCode.trim()}
              className="bg-main cursor-pointer text-white px-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "..." : "Apply"}
            </button>
          ) : (
            <button
              onClick={() => setAppliedVoucher(null)}
              className="bg-red-500 text-white px-3 rounded-lg text-sm"
            >
              Remove
            </button>
          )}
        </div>

        <div className="flex justify-between mt-4 font-semibold">
          <span>Total</span>
          <span className="text-lg">{formatPrice(finalTotal)}</span>
        </div>

        {/* Dynamic Payment Methods */}
        <div className="mt-6 space-y-3 text-sm">
          {/* Cash on Delivery - if enabled */}
          {isCashOnDeliveryEnabled && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash_on_delivery"
                checked={selectedPayment === "cash_on_delivery"}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="peer hidden"
              />
              <div
                className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center
               peer-checked:bg-main peer-checked:border-main transition"
              >
                <svg
                  className="w-3 h-3 text-white hidden peer-checked:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Cash on Delivery</span>
            </label>
          )}

          {/* Dynamic payment methods from API */}
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={selectedPayment === method.value}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="peer hidden"
              />
              <div
                className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center
               peer-checked:bg-main peer-checked:border-main transition"
              >
                <svg
                  className="w-3 h-3 text-white hidden peer-checked:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>{method.label}</span>
            </label>
          ))}

          {/* Show message if no payment methods available */}
          {paymentMethods.length === 0 && !isCashOnDeliveryEnabled && (
            <div className="text-red-500 text-center py-2">
              No payment methods available. Please contact support.
            </div>
          )}
        </div>

        <button
          onClick={handleConfirmOrder}
          disabled={
            isProcessing ||
            !cartData?.data ||
            cartData.data.length === 0 ||
            (isGuest ? !isGuestFormValid : !selectedAddressId) ||
            isCalculatingShipping ||
            (paymentMethods.length === 0 && !isCashOnDeliveryEnabled)
          }
          className="bg-main cursor-pointer text-white px-4 py-2 mt-3 rounded-xl font-medium uppercase flex items-center justify-between gap-2 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-bold">
            {isProcessing ? "PROCESSING..." : "CONFIRM ORDER"}
          </span>
          {!isProcessing && (
            <span className="bg-white text-black p-1.5 rounded-md">
              <ButtonArrowIcon width={15} height={15} />
            </span>
          )}
        </button>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            By confirming your order, you agree to our{" "}
            <a href="/terms" className="text-main hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-main hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
