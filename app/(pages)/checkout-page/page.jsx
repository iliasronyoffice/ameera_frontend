"use client";
import AuthUserCheckout from "@/app/components/layout/AuthUserCheckout";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import GuestUserCheckout from "@/app/components/layout/GuestUserCheckout";
import { useEffect,useState } from "react";


export default function CheckoutPage() {
      const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);
  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen p-2">
      <Breadcrumb />
      
    {isAuth ? <AuthUserCheckout /> : <GuestUserCheckout />}
    </div>
  );
}

