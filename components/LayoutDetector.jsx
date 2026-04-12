'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import ServicePolicies from '@/app/(home)/ServicePolicies';
import CartModal from '@/app/components/CartModal';
import Footer from '@/app/components/layout/Footer';
import Header from '@/app/components/layout/Header';

export default function LayoutDetector({ children }) {
  const pathname = usePathname();
  
  // Check if current route is dashboard
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  // Check if current route is home page
  const isHomePage = pathname === '/';
  
  // For dashboard routes - show only Header
  if (isDashboardRoute) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: 'var(--header-height, 80px)' }}>
          {children}
        </main>
        <Toaster position="top-right" reverseOrder={false} />
      </>
    );
  }
  
  // For home page - show Header but with different padding/margin
  if (isHomePage) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: 0 }}> {/* No padding for home page */}
          {children}
        </main>
        <CartModal />
        <Toaster position="top-right" reverseOrder={false} />
        <Footer />
      </>
    );
  }
  
  // Show all frontend components for non-dashboard and non-home routes
  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height, 80px)' }}>
        {children}
      </main>
      <CartModal />
      <Toaster position="top-right" reverseOrder={false} />
      <Footer />
    </>
  );
}