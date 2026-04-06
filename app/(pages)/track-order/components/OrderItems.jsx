"use client";
import Image from "next/image";
import Link from "next/link";

export default function OrderItems({ orderDetails }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="font-semibold mb-4">Order Items</h2>
      <div className="space-y-4">
        {orderDetails.map((product, index) => (
          <div key={index} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0 border border-gray-200 rounded-lg bg-white">
              <Image
                src={product.thumbnail_image || "/placeholder-image.jpg"}
                alt={product.name || "Product"}
                fill
                className="object-contain rounded-lg p-1"
              />
            </div>
            <div className="flex-1">
              <Link href={`/Products/${product.slug}`}>
                <p className="text-sm font-semibold hover:text-main">{product.name}</p>
              </Link>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500">Qty: 1</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-sm font-semibold text-main">{product.main_price}</span>
                {product.stroked_price && product.stroked_price !== product.main_price && (
                  <>
                    <span className="text-xs text-gray-400 line-through">{product.stroked_price}</span>
                    <span className="text-xs text-red-500">{product.discount}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}