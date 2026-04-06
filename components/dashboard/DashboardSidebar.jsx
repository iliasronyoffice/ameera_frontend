"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  HeartIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: "My Purchases",
    href: "/dashboard/purchases",
    icon: ShoppingBagIcon,
    iconSolid: ShoppingBagIconSolid,
  },
  {
    name: "My Profile",
    href: "/dashboard/profile",
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
  //   { name: 'Wishlist', href: '/dashboard/wishlist', icon: HeartIcon, iconSolid: HeartIcon },
  //   { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon, iconSolid: CreditCardIcon },
  //   { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIcon },
];

export default function DashboardSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-opacity-50 transition-opacity lg:hidden"
          //   onClick={() => setIsOpen(false)}
          onClick={() => {
            if (window.innerWidth < 1024) {
              setIsOpen(false);
            }
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 z-30 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="flex h-16 items-center justify-between px-4">
         
          <button
            // onClick={() => setIsOpen(false)}
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsOpen(false);
              }
            }}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>


        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 mt-20">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                // onClick={() => setIsOpen(false)}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`group flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isActive ? (
                  <item.iconSolid className="mr-3 h-5 w-5 text-indigo-600" />
                ) : (
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                )}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
