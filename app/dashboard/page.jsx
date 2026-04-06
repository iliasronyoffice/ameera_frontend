'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  TruckIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/dashboard/stats`,
//         // 'https://dev.nisamirrorfashionhouse.com/api/v2/auth/dashboard/stats',
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
      
//       const result = await response.json();
//       console.log('dashboard data found in',result);
      
//       if (result.success) {
//         setStats({
//           totalOrders: result.data.stats.total_orders,
//           totalSpent: result.data.stats.total_spent,
//           pendingOrders: result.data.stats.pending_orders,
//         });
//         setRecentOrders(result.data.recent_orders);
//       } else {
//         console.error('API returned unsuccessful:', result);
//         setError(result.message || 'Failed to load dashboard data');
//       }
      
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };
const fetchDashboardData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // Make sure the URL is correct
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error('API URL is not configured');
    }
    
    const response = await fetch(
      `${apiUrl}/auth/dashboard/stats`,
    // 'https://dev.nisamirrorfashionhouse.com/api/v2/auth/dashboard/stats',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('dashboard data found in', result);
    
    if (result.success) {
      setStats({
        totalOrders: result.data.stats.total_orders,
        totalSpent: result.data.stats.total_spent,
        pendingOrders: result.data.stats.pending_orders,
      });
      setRecentOrders(result.data.recent_orders);
    } else {
      console.error('API returned unsuccessful:', result);
      setError(result.message || 'Failed to load dashboard data');
    }
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    setError('Failed to load dashboard data. Please try again later.');
  } finally {
    setLoading(false);
  }
};
  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'delivered': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'confirmed': 'bg-indigo-100 text-indigo-800',
      'returned': 'bg-gray-100 text-gray-800'
    };
    
    return colors[normalizedStatus] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    
    if (normalizedStatus === 'paid') {
      return 'bg-green-100 text-green-800';
    } else if (normalizedStatus === 'unpaid') {
      return 'bg-red-100 text-red-800';
    } else if (normalizedStatus === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (normalizedStatus === 'failed') {
      return 'bg-red-100 text-red-800';
    } else if (normalizedStatus === 'refunded') {
      return 'bg-purple-100 text-purple-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`;
  };

  const statCards = [
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TruckIcon,
      color: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchDashboardData}
                className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
              >
                <ArrowPathIcon className="mr-2 h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your orders.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-500">Your latest 5 orders</p>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Delivery Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.code}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {order.grand_total}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status_string || order.payment_status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.delivery_status)}`}>
                          {order.delivery_status_string || order.delivery_status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <Link
                          href={`/dashboard/purchases/${order.id}`}
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t px-6 py-4">
              <Link
                href="/dashboard/purchases"
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all orders
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}