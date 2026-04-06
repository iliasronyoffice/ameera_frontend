'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function DashboardHeader({ isSidebarOpen, setIsSidebarOpen }) {
  const router = useRouter();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleViewFrontend = () => {
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Toggle button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center gap-x-4">
          {/* View Frontend Button */}
          <button
            onClick={handleViewFrontend}
            className="hidden sm:inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
          >
            View Frontend
            <ArrowRightOnRectangleIcon className="ml-2 h-4 w-4" />
          </button>

      
        </div>
      </div>
    </header>
  );
}