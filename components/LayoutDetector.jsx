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
  
  // Don't show frontend components on dashboard routes
  if (isDashboardRoute) {
    return (
      <>
      <Header></Header>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      {/* <Footer /> */}
      </>
    );
  }
  
  // Show all frontend components for non-dashboard routes
  return (
    <>
     
      <Header />
      {children}
      <CartModal />
      <Toaster position="top-right" reverseOrder={false} />
      <ServicePolicies />
      <Footer />
    </>
  );
}