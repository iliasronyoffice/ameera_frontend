"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SocialIcons from "../SocialIcons";


export default function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/footer-data`,
          {
            cache: "no-store",
          },
        );
        const json = await res.json();
        setFooterData(json.data);
      } catch (err) {
        console.error("Footer fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFooter();
  }, []);

  if (loading) {
    return (
      <footer className="bg-footer py-10 text-center">
        Loading footer...
      </footer>
    );
  }

  if (!footerData) return null;

  return (
    <footer className="bg-footer">
      {/* ===== Top Footer ===== */}
      <div className="px-3 md:px-5 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Logo & Description */}
        <div>
          {/* Logo with rounded full */}
          {footerData.logo && (
            <Link href="/" className="block w-30 h-20 md:w-40 md:h-30 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={footerData.logo}
                  alt="Logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </Link>
          )}
          <p className="mt-4 text-sm">{footerData.footer_description}</p>
          
          {/* Social Links Section */}
          {footerData.show_social_links && (
            <div className="mt-6">
              {/* <h5 className="text-xs font-semibold text-white uppercase mb-3">
                Follow Us On :
              </h5> */}
              <SocialIcons 
                socialLinks={footerData.social_links} 
                className="w-4 h-4"
                gap="gap-6"
              />
            </div>
          )}
        </div>

        {/* Company Menu */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {footerData.company_menu?.map((item, idx) => (
              <li key={idx}>
                <Link href={`/pages${item.link}`} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Useful Links Menu */}
        <div>
          <h3 className="font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            {footerData.useful_links_menu?.map((item, idx) => (
              <li key={idx}>
                <Link href={`/pages${item.link}`} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* My Account (Static for now) */}
        <div>
          <h3 className="font-semibold mb-4">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Order History
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:underline">
                My Wishlist
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:underline">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Affiliate Partner
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:underline">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-4 text-sm">
            {/* Address */}
            <li className="flex items-start gap-3">
              <span className="text-white">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24.0005" rx="12" fill="white" />
                    <path
                      d="M11.7856 4.28577C8.5958 4.28577 6 6.89957 6 10.1131C6 14.6793 11.2418 19.3939 11.4648 19.5919C11.553 19.6708 11.6671 19.7145 11.7855 19.7146C11.9038 19.7147 12.018 19.6713 12.1064 19.5925C12.3294 19.3939 17.5712 14.6793 17.5712 10.1131C17.5712 6.89957 14.9754 4.28577 11.7856 4.28577ZM11.7856 13.2856C10.0133 13.2856 8.57138 11.8437 8.57138 10.0714C8.57138 8.29904 10.0133 6.85714 11.7856 6.85714C13.5579 6.85714 14.9998 8.29904 14.9998 10.0714C14.9998 11.8437 13.5579 13.2856 11.7856 13.2856Z"
                      fill="#19073B"
                    />
                  </svg>
                </span>
              </span>
              <p>{footerData.contact_address}</p>
            </li>

            {/* Phone */}
            <li className="flex items-center gap-3">
              <span className="text-white">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24.0005" rx="12" fill="white" />
                    <path
                      d="M17.9447 15.0473L16.1267 13.2293C15.4775 12.58 14.3737 12.8398 14.114 13.6838C13.9192 14.2682 13.2699 14.5929 12.6855 14.463C11.3869 14.1383 9.63386 12.4502 9.30922 11.0867C9.11443 10.5023 9.50401 9.85301 10.0884 9.65825C10.9324 9.39853 11.1922 8.29474 10.5429 7.64545L8.72486 5.82745C8.20543 5.37295 7.42629 5.37295 6.97178 5.82745L5.73814 7.0611C4.50449 8.35967 5.868 11.8009 8.91965 14.8525C11.9713 17.9042 15.4125 19.3327 16.7111 18.0341L17.9447 16.8004C18.3993 16.281 18.3993 15.5018 17.9447 15.0473Z"
                      fill="#19073B"
                    />
                  </svg>
                </span>
              </span>
              <Link href={`tel:${footerData.contact_phone}`} className="hover:underline">
                {footerData.contact_phone}
              </Link>
            </li>

            {/* Email */}
            <li className="flex items-center gap-3">
              <span className="text-white">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24.0005" rx="12" fill="white" />
                    <path
                      d="M18.7715 7.71472L14.4582 12.0002L18.7715 16.2858C18.8495 16.1228 18.8968 15.9426 18.8968 15.7502V8.25024C18.8968 8.05783 18.8495 7.87769 18.7715 7.71472ZM17.6468 7.00024H5.92456C5.73214 7.00024 5.552 7.04755 5.38903 7.12552L10.9019 12.6106C11.3893 13.098 12.182 13.098 12.6694 12.6106L18.1823 7.12552C18.0193 7.04755 17.8392 7.00024 17.6468 7.00024ZM4.79984 7.71472C4.72187 7.87769 4.67456 8.05783 4.67456 8.25024V15.7502C4.67456 15.9427 4.72187 16.1228 4.79984 16.2858L9.11314 12.0002L4.79984 7.71472Z"
                      fill="#19073B"
                    />
                    <path
                      d="M13.8701 12.5894L13.2597 13.1997C12.4476 14.0119 11.126 14.0119 10.3138 13.1997L9.70344 12.5894L5.39014 16.8749C5.55311 16.9529 5.73325 17.0002 5.92566 17.0002H17.6479C17.8403 17.0002 18.0204 16.9529 18.1834 16.8749L13.8701 12.5894Z"
                      fill="#19073B"
                    />
                  </svg>
                </span>
              </span>
              <Link href={`mailto:${footerData.contact_email}`} className="hover:underline">
                {footerData.contact_email}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== Bottom Footer ===== */}
      <div className="border-t border-gray-300 text-center text-sm flex flex-col lg:flex-row justify-between items-center gap-4 px-5 py-3 md:py-0">
        {/* Copyright */}
        <div
          className=""
          dangerouslySetInnerHTML={{ __html: footerData.copyright || "" }}
        />

        {/* Payment Image */}
        {footerData.payment_methods_image && (
          <div className="relative w-[180px] sm:w-[220px] md:w-[450px] md:h-[80px] h-[50px]">
            <Image
              src={footerData.payment_methods_image}
              alt="Payment Methods"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </div>
    </footer>
  );
}