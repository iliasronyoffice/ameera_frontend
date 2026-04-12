'use client';

import { useCart } from '@/store/hooks/useCart';
import toast from 'react-hot-toast';

export default function AddToCartButton({ 
  product, 
  hasVariants = false, 
  hasColors = false,
  selectedVariant = null,
  selectedColor = null,
  disabled = false,
  onError,
  onSuccess
}) {
  const { addToCart, loading } = useCart();
  // console.log('disabled', disabled);
  
  const isOutOfStock = product.current_stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      const msg = "Sorry! This product is out of stock.";
      if (onError) onError(msg);
      else toast.error(msg);
      return;
    }

    // Check if variant is required and selected
    if (hasVariants && !selectedVariant) {
      const msg = "Please select a variant";
      if (onError) onError(msg);
      else toast.error(msg);
      return;
    }

    // Check if color is required and selected
    if (hasColors && !selectedColor) {
      const msg = "Please select a color";
      if (onError) onError(msg);
      else toast.error(msg);
      return;
    }

    // Get user ID from localStorage
    let userId = null;
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          userId = JSON.parse(userData).id;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }

    try {
      const variantToSend = product.full_variant || selectedVariant || '';
      
      const cartData = {
        user_id: userId,
        id: product.id,
        variant: variantToSend,
        quantity: product.quantity || 1
      };

      if (selectedColor) {
        cartData.color = selectedColor;
      }
      
      const result = await addToCart(cartData);
      
      if (result && result.success !== false) {
        if (onSuccess) {
          onSuccess();
        } else {
          toast.success('Added to cart successfully!');
        }
      } else {
        const errorMsg = result?.message || "Failed to add to cart";
        if (onError) onError(errorMsg);
        else toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      const msg = err?.message || "Failed to add to cart";
      if (onError) onError(msg);
      else toast.error(msg);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = disabled || loading || isOutOfStock;

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isButtonDisabled}
      className={`group w-full flex items-center justify-center gap-2 border px-6 py-1 font-medium transition-all duration-300 transform hover:scale-[1.04] hover:shadow-lg active:scale-95 ${
        isButtonDisabled
          ? 'bg-gray-300 border-gray-300 text-gray-600 cursor-not-allowed hover:scale-100 hover:shadow-none'
          : 'border-main text-black hover:bg-gray-50 cursor-pointer'
      }`}
    >
      <span className="flex items-center justify-center bg-white/20 group-hover:bg-white/30 backdrop-blur-sm transition">
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.9994 10.0928C8.12507 10.0938 7.27741 9.80613 6.60077 9.27882C5.92412 8.75152 5.46034 8.01716 5.28838 7.2008C5.27468 7.11481 5.28077 7.02701 5.30623 6.94348C5.3317 6.85995 5.37593 6.78269 5.43586 6.71706C5.49579 6.65142 5.56999 6.59898 5.65332 6.56337C5.73665 6.52776 5.82711 6.50982 5.91844 6.51081C6.06854 6.50873 6.21448 6.55775 6.32999 6.64905C6.4455 6.74035 6.52299 6.86793 6.54849 7.0088C6.66715 7.54815 6.9771 8.03218 7.42627 8.3796C7.87545 8.72701 8.43649 8.91665 9.01515 8.91665C9.59381 8.91665 10.1549 8.72701 10.604 8.3796C11.0532 8.03218 11.3632 7.54815 11.4818 7.0088C11.5073 6.86793 11.5848 6.74035 11.7003 6.64905C11.8158 6.55775 11.9618 6.50873 12.1119 6.51081C12.2032 6.50982 12.2937 6.52776 12.377 6.56337C12.4603 6.59898 12.5345 6.65142 12.5944 6.71706C12.6544 6.78269 12.6986 6.85995 12.7241 6.94348C12.7495 7.02701 12.7556 7.11481 12.7419 7.2008C12.5689 8.02224 12.1005 8.7605 11.4174 9.2884C10.7342 9.81629 9.87912 10.1008 8.9994 10.0928Z" fill="black" />
            <path d="M14.6075 18.0001H3.39252C3.13615 18.0004 2.88239 17.951 2.64668 17.855C2.41097 17.759 2.19824 17.6183 2.02142 17.4415C1.84461 17.2647 1.70742 17.0555 1.61818 16.8266C1.52895 16.5977 1.48955 16.3539 1.50236 16.1101L2.01271 5.76618C2.03383 5.30244 2.24226 4.8644 2.59447 4.54352C2.94668 4.22265 3.41544 4.04375 3.90287 4.04419H14.0971C14.5846 4.04375 15.0533 4.22265 15.4055 4.54352C15.7577 4.8644 15.9662 5.30244 15.9873 5.76618L16.4976 16.1101C16.5105 16.3539 16.4711 16.5977 16.3818 16.8266C16.2926 17.0555 16.1554 17.2647 15.9786 17.4415C15.8018 17.6183 15.589 17.759 15.3533 17.855C15.1176 17.951 14.8639 18.0004 14.6075 18.0001ZM3.90287 5.25018C3.73577 5.25018 3.57551 5.31339 3.45735 5.42592C3.3392 5.53844 3.27281 5.69105 3.27281 5.85018L2.76247 16.1701C2.7582 16.2514 2.77133 16.3326 2.80108 16.4089C2.83082 16.4852 2.87655 16.555 2.93549 16.6139C2.99443 16.6728 3.06534 16.7197 3.14391 16.7517C3.22248 16.7837 3.30707 16.8002 3.39252 16.8001H14.6075C14.6929 16.8002 14.7775 16.7837 14.8561 16.7517C14.9347 16.7197 15.0056 16.6728 15.0645 16.6139C15.1234 16.555 15.1692 16.4852 15.1989 16.4089C15.2287 16.3326 15.2418 16.2514 15.2375 16.1701L14.7272 5.82618C14.7272 5.66705 14.6608 5.51444 14.5426 5.40192C14.4245 5.28939 14.2642 5.22618 14.0971 5.22618L3.90287 5.25018Z" fill="black" />
            <path d="M12.7794 4.64996H11.5193V3.59997C11.5193 2.96346 11.2538 2.35301 10.7811 1.90293C10.3085 1.45284 9.66747 1.19999 8.99907 1.19999C8.33067 1.19999 7.68964 1.45284 7.21701 1.90293C6.74438 2.35301 6.47886 2.96346 6.47886 3.59997V4.64996H5.21875V3.59997C5.21875 2.6452 5.61703 1.72953 6.32598 1.05441C7.03493 0.379282 7.99647 0 8.99907 0C10.0017 0 10.9632 0.379282 11.6722 1.05441C12.3811 1.72953 12.7794 2.6452 12.7794 3.59997V4.64996Z" fill="black" />
          </svg>
        )}
      </span>
      <span>
        {loading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
      </span>
    </button>
  );
}