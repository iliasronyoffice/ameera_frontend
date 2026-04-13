// Header.jsx - Optimized for performance with progressive loading

"use client";

import Link from "next/link";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import AllCategoryModal from "./AllCategoryModal";
import LoginModal from "../userAuth/LoginModal ";
import RegisterModal from "../userAuth/RegisterModal";
import SearchBarDesktop from "./SearchBarDesktop";
import SearchBarMobile from "./SearchBarMobile";
import CartIcon from "../icons/CartIcon";
import WishlistIcon from "./WishlistIcon";
import UserIcon from "../icons/UserIcon";
import defaultLogo from "../../../public/default-logo.png";
import { toast } from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setTempUserId,
  fetchCart,
  getCartCount,
  clearCart,
} from "@/store/slices/cartSlice";
import { fetchWishlist } from "@/store/slices/wishlistSlice";
import CartDropdown from "./CartDropdown";
import useCachedFetch from "@/app/utils/useCachedFetch";
import { setUser, logout as logoutAction } from "@/store/slices/authSlice";
import ButtonSearchIcon from "../icons/ButtonSearchIcon";
import SearchModal from "@/components/SearchModal";
import { usePathname } from "next/navigation";
import TopHeader from "../TopHeader";

// Loading Skeleton Component
// Loading Skeleton Component - Perfectly designed
const LoadingSkeleton = () => (
  <div className="fixed top-0 left-0 w-full z-50">
    {/* Top Header Skeleton */}
    <div className="w-full bg-gray-800 h-10 animate-pulse">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="w-32 h-4 bg-gray-700 rounded"></div>
        <div className="w-40 h-4 bg-gray-700 rounded"></div>
        <div className="w-24 h-4 bg-gray-700 rounded"></div>
      </div>
    </div>

    {/* Main Header Skeleton */}
    <header className="w-full bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left Side - Category Button */}
        <div className="search-part">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Logo Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-[75px] md:w-[120px] lg:w-[140px] h-[40px] bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Right Side Navigation Skeleton */}
        <div className="flex items-center justify-end gap-3 lg:gap-6">
          {/* Search Icon */}
          <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full animate-pulse"></div>
          
          {/* User Section */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="hidden lg:block">
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Wishlist Icon */}
          <div className="relative">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Cart Icon */}
          <div className="relative">
            <div className="hidden md:block w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="md:hidden w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Skeleton - Optional if you have bottom nav */}
      <div className="hidden lg:block px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </header>
  </div>
);

export default function Header() {

  
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const dispatch = useAppDispatch();
  const [logoUrl, setLogoUrl] = useState(defaultLogo);
  const [topHeader, setTopHeader] = useState("title");
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Get auth state from Redux
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { totalQuantity, cartLoading, cartData } = useAppSelector(
    (state) => state.cart,
  );
  const { totalItems: wishlistCount, loading: wishlistLoading } =
    useAppSelector((state) => state.wishlist);

  // Local UI state
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "all",
    name: "All",
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isLogoFetching, setIsLogoFetching] = useState(true);

  // Refs for dropdowns
  const userDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);

  // dropdown new cart
  const [isCartDropdownReady, setIsCartDropdownReady] = useState(false);
  const [cachedCartData, setCachedCartData] = useState(null);

  const [isScrolled, setIsScrolled] = useState(false);

  // Add this state at the top of your Header component
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Update the useEffect for body scroll
  useEffect(() => {
    if (showSearchModal) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    };
  }, [showSearchModal]);

  // In your Header component
useEffect(() => {
  const header = document.querySelector('header');
  if (header) {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }
}, []);

  // Add escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showSearchModal) {
        setShowSearchModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showSearchModal]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories (non-blocking)
  const { data: categoriesData } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    "categories",
    5 * 60 * 1000,
  );

  // Transform categories data (safe default)
  const categories = categoriesData
    ? [
        { id: "all", name: "All" },
        ...categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
      ]
    : [{ id: "all", name: "All" }];

  // Add cache for cart data
  useEffect(() => {
    // Load cached cart data on mount
    const cachedCart = localStorage.getItem("cached_cart_data");
    if (cachedCart) {
      try {
        setCachedCartData(JSON.parse(cachedCart));
      } catch (e) {}
    }
  }, []);

  // Cache cart data when it changes
  useEffect(() => {
    if (cartData && !cartLoading) {
      localStorage.setItem("cached_cart_data", JSON.stringify(cartData));
      setCachedCartData(cartData);
    }
  }, [cartData, cartLoading]);

  // Set mounted state immediately
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load logo asynchronously without blocking render
  useEffect(() => {
    const fetchLogoWithCache = async () => {
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem("header_logo_data");
        const cachedTime = localStorage.getItem("header_logo_time");
        const now = Date.now();

        // Use cache if available (even expired, we'll show it immediately)
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          if (parsedCache.header_logo) {
            setLogoUrl(parsedCache.header_logo);
          }
          if (parsedCache.top_header) {
            setTopHeader(parsedCache.top_header); // ✅ set top_header from cache too
          }
          setIsLogoFetching(false);

          if (cachedTime && now - Number(cachedTime) >= 60 * 60 * 1000) {
            fetchFreshLogo();
          }
          return;
        }

        // No cache, fetch fresh data
        await fetchFreshLogo();
      } catch (error) {
        console.error("Error fetching logo:", error);
        setLogoUrl(defaultLogo);
        setIsLogoFetching(false);
      }
    };

    const fetchFreshLogo = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://dev2.nisamirrorfashionhouse.com/api/v2";
        const response = await fetch(`${baseUrl}/header-details`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetching fresh logo from API...", data);

        // Save to cache
        localStorage.setItem("header_logo_data", JSON.stringify(data));
        localStorage.setItem("header_logo_time", Date.now().toString());

        // Update state
        // Fix fresh fetch path
        if (data) {
          if (data.header_logo) {
            setLogoUrl(data.header_logo); // ✅ set independently
          } else {
            setLogoUrl(defaultLogo);
          }

          if (data.top_header) {
            setTopHeader(data.top_header); // ✅ set independently
          } else {
            setTopHeader("Default Top Header Text");
          }
        }

      } catch (error) {
        console.error("Error fetching fresh logo:", error);
        setLogoUrl("/default-logo.png");
      } finally {
        setIsLogoFetching(false);
      }
    };

    fetchLogoWithCache();
  }, []);

  // Load initial cart data (non-blocking)
  const loadInitialCart = async () => {
    if (!isMounted) return;

    try {
      await dispatch(getCartCount()).unwrap();
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("Failed to load initial cart:", error);
    } finally {
      setInitialLoadDone(true);
    }
  };

  // Check for existing user session on mount (non-blocking)
  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          dispatch(setUser(parsedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else {
        // Generate or get guest ID
        let guestId = localStorage.getItem("guest_id");
        if (!guestId) {
          guestId =
            "guest_" +
            Date.now() +
            "_" +
            Math.random().toString(36).substr(2, 9);
          localStorage.setItem("guest_id", guestId);
        }
        dispatch(setTempUserId(guestId));
      }
    };

    checkAuth();
  }, [dispatch, isMounted]);

  // Load cart after auth check (non-blocking)
  useEffect(() => {
    if (isMounted && !initialLoadDone) {
      loadInitialCart();
    }
  }, [isMounted, initialLoadDone]);

  // Fetch wishlist when user is authenticated (non-blocking)
  useEffect(() => {
    if (isAuthenticated && initialLoadDone) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch, initialLoadDone]);

  // Reload cart when auth state changes (non-blocking)
  useEffect(() => {
    if (isMounted && initialLoadDone) {
      loadInitialCart();
    }
  }, [isAuthenticated, isMounted]);

  // Handle click outside for dropdowns
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target)
      ) {
        setShowCartDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMounted]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const newGuestId =
      "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("guest_id", newGuestId);

    dispatch(logoutAction());
    dispatch(setTempUserId(newGuestId));
    dispatch(clearCart());

    setInitialLoadDone(false);
    setShowUserDropdown(false);
    toast.success("Logged out successfully");
  };

  // Handle login success
  const handleLoginSuccess = (userData) => {
    dispatch(setUser(userData));
    setShowLogin(false);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  // Handle register success
  const handleRegisterSuccess = (userData) => {
    dispatch(setUser(userData));
    setShowRegister(false);
    toast.success(`Welcome ${userData.name}! Your account has been created.`);
  };

  // Handle cart click
  // const handleCartClick = async (e) => {
  //   e.preventDefault();
  //   if (!showCartDropdown) {
  //     await dispatch(fetchCart()).unwrap();
  //   }
  //   setShowCartDropdown(!showCartDropdown);
  // };

  // Optimized cart click handler
  const handleCartClick = async (e) => {
    e.preventDefault();

    // Show dropdown immediately with cached data if available
    if (!showCartDropdown) {
      setShowCartDropdown(true);

      // Fetch fresh data in background if cache exists
      if (cachedCartData) {
        // Refresh in background without blocking UI
        setTimeout(() => {
          dispatch(fetchCart()).unwrap().catch(console.error);
        }, 100);
      } else {
        // No cache, fetch and show loading
        await dispatch(fetchCart()).unwrap();
      }
    } else {
      setShowCartDropdown(false);
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user || !user.name) return "";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // Show loading skeleton only for the very first render
  if (!isMounted) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {/* top header part  */}
      {/* Top Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          }`}
        >
          <TopHeader topHeader={topHeader} />
        </div>
        {/* Main Header */}
        <header
          className={`w-full transition-all duration-300 ${
            isHomePage
              ? isScrolled
                ? "bg-white text-black shadow-md"
                : "bg-transparent text-white hover:bg-white hover:text-black"
              : "bg-white text-black shadow-md"
          }`}
        >
          {/* Top Row */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="search-part">
              {/* Search Button - Opens Modal */}
              <AllCategoryModal />
            </div>
            {/* Logo - with progressive loading */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                {logoUrl && !isLogoFetching ? (
                  <Image
                    src={logoUrl}
                    alt="logo"
                    width={150}
                    height={40}
                    className="object-contain w-[75px] md:w-[120px] lg:w-[140px] h-auto"
                    unoptimized
                    loading="eager"
                    onError={() => {
                      setLogoUrl("/default-logo.png");
                    }}
                  />
                ) : (
                  <div className="w-[75px] md:w-[120px] lg:w-[140px] h-[40px] bg-transparent" />
                )}
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            {/* <SearchBarDesktop
            open={open}
            setOpen={setOpen}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          /> */}

            {/* Right Side Navigation */}
            <div className="flex items-center justify-end gap-3 lg:gap-6 text-xs lg:text-sm">
              {/* Search section  */}
              <div className="search-part">
                {/* Search Button - Opens Modal */}
                <div
                  className="flex cursor-pointer"
                  onClick={() => setShowSearchModal(true)}
                >
                  <ButtonSearchIcon
                    width={20}
                    height={20}
                    color="currentColor"
                  />
                </div>
              </div>
              {/* User Section */}
              <div className="relative" ref={userDropdownRef}>
                {isAuthenticated && user ? (
                  <>
                    <button
                      className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                      <div className="md:w-10 w-6 md:h-10 h-6 rounded-full bg-main flex items-center justify-center">
                        <span className="text-black font-bold text-sm">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="text-left hidden lg:block">
                        <div className="text-xs text-gray-300">Hello,</div>
                        <div className="font-bold text-sm truncate max-w-[100px]">
                          {user.name?.split(" ")[0]}
                        </div>
                      </div>
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                        <div className="lg:hidden px-4 py-2 border-b border-gray-200">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user.name}
                          </p>
                        </div>

                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <span>Wishlist</span>
                          {wishlistCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                    onClick={() => setShowLogin(true)}
                  >
                    <UserIcon
                      width={24}
                      height={24}
                      // color={
                      //   isHomePage
                      //     ? isScrolled
                      //       ? "#000000"
                      //       : "#ffffff"
                      //     : "#000000"
                      // }
                      color="currentColor"
                    />
                    {/* <div className="hidden lg:block text-left">
                    <div className="text-xs text-gray-300">Hello,</div>
                    <div className="font-bold text-sm">Sign In</div>
                  </div> */}
                  </button>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="cursor-pointer relative flex items-center hover:opacity-80 group focus:outline-none"
              >
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-[2px] bg-red-400 text-black text-xs font-bold rounded-full md:min-w-[20px] min-w-[5px] md:h-5 h-4 px-1 flex items-center justify-center group-hover:scale-110 transition-transform ml-2">
                    {wishlistCount}
                  </span>
                )}
                <span className="">
                  <WishlistIcon width={24} height={21} color="currentColor" />
                </span>
              </Link>

              {/* Cart Icon */}
              <div className="relative pr-2" ref={cartDropdownRef}>
                <button
                  onClick={handleCartClick}
                  className="relative flex items-center cursor-pointer hover:opacity-80 group focus:outline-none"
                >
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-main text-white text-xs font-bold rounded-full md:min-w-[20px] min-w-[5px] md:h-5 h-4 px-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {cartLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        totalQuantity || 0
                      )}
                    </span>
                  )}
                  <span className="hidden md:block">
                    <CartIcon width={24} height={24} color="currentColor" />
                  </span>
                  <span className="md:hidden">
                    <CartIcon width={20} height={20} color="currentColor" />
                  </span>
                </button>

                {/* Cart Dropdown */}
                {showCartDropdown && (
                  <CartDropdown
                    loading={cartLoading}
                    onClose={() => setShowCartDropdown(false)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          {/* <SearchBarMobile
          open={open}
          setOpen={setOpen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        /> */}

          {/* Bottom Navigation */}
          {/* <nav className="bg-transparent text-sm px-1 lg:px-4 py-2 flex items-center gap-3 lg:gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="hover:underline px-2 py-1 text-xs lg:text-sm flex-1"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/track-order"
            className="hover:underline px-2 py-1 text-xs lg:text-sm"
          >
            Track Order
          </Link>
          <Link
            href="/pages/need-help"
            className="hover:underline px-2 py-1 text-xs lg:text-sm"
          >
            Need Help?
          </Link>
        </nav> */}

          {/* Search Modal */}
        </header>
      </div>

      {/* Search Modal - Outside header */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        open={open}
        setOpen={setOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Modals */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitch={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitch={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </>
  );
}
