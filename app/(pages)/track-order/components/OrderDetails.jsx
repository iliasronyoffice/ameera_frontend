"use client";
import Link from "next/link";
import OrderItems from "./OrderItems";
import ShippingAddress from "./ShippingAddress";
import TrackingInfo from "./TrackingInfo";
import OrderSummary from "./OrderSummary";
import { 
  formatDateFromTimestamp, 
  getDeliveryStatus, 
  getStatusColor, 
  getPaymentStatusBadge,
  formatPrice 
} from "../utils/orderHelpers";

export default function OrderDetails({ order, onNewSearch }) {
  const paymentStatus = getPaymentStatusBadge(order.payment_status);
  const statusColor = getStatusColor(order.delivery_status);
  const deliveryStatus = getDeliveryStatus(order);

  const orderDetails = order.order_details?.[0]?.data || [];
  const totalItems = orderDetails.length;
  const subtotal = orderDetails.reduce((sum, product) => 
    sum + (parseFloat(product.main_price?.replace(/[^0-9.-]+/g, '') || 0)), 0);
  const total = order.grand_total || subtotal;

  return (
    <div className="space-y-4">
      {/* Header with New Search Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={onNewSearch}
          className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Track Another Order
        </button>
      </div>

      {/* Order Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm text-gray-500">Order Code</h2>
            <p className="text-lg font-bold text-purple-600">{order.code}</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm text-gray-500">Order Date</h2>
            <p className="font-medium">{formatDateFromTimestamp(order.date)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div>
            <h3 className="text-xs text-gray-500">Status</h3>
            <p className="flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
              <span className="text-sm font-medium capitalize">{deliveryStatus}</span>
            </p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500">Payment</h3>
            <p className="mt-1">
              <span className={`text-xs ${paymentStatus.color} text-white px-2 py-1 rounded-full`}>
                {paymentStatus.text}
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500">Items</h3>
            <p className="text-sm font-medium mt-1">{totalItems} item(s)</p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500">Total</h3>
            <p className="text-sm font-bold text-purple-600 mt-1">{formatPrice(total)}</p>
          </div>
        </div>
      </div>

      <OrderItems orderDetails={orderDetails} />
      <ShippingAddress shippingAddress={order.shipping_address} />
      <TrackingInfo steadfastId={order.steadfast_id} />
      <OrderSummary 
        subtotal={subtotal}
        totalItems={totalItems}
        couponDiscount={order.coupon_discount || 0}
        total={total}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 bg-main text-white py-3 rounded-lg text-sm font-medium">
          Need Help?
        </button>
        <Link
          href="/"
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}