"use client";

import Link from "next/link";
import { FaSearch, FaBars } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import logo from "../../../public/logo.png";
import Image from "next/image";
import { useState } from "react";
import AllCategoryModal from "./AllCategoryModal";
import LoginModal from "../userAuth/LoginModal ";
import RegisterModal from "../userAuth/RegisterModal";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Books",
    "Home & Kitchen",
    "Toys & Games",
    "Sports & Outdoors",
    "Beauty & Personal Care",
    "Automotive",
    "Health & Wellness",
    "Office Supplies",
    "Pet Supplies",
    "Garden & Outdoors",
    "Music & Instruments",
    "Movies & TV Shows",
    "Video Games",
    "Jewelry",
    "Shoes",
    "Baby Products",
    "Grocery & Gourmet Food",
  ];

  return (
    <>
      <header className="bg-main text-white sticky top-0 z-50 shadow-md">
        {/* Main Header */}
        <div className="flex items-center justify-between p-2 lg:p-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src={logo}
                alt="logo"
                priority
                className="w-20 h-auto sm:w-28 md:w-32 lg:w-40 object-contain dark:invert"
              />
            </Link>
          </div>

          {/* Search Bar - Full width on mobile, centered on larger screens */}
          <div className="flex flex-1  mx-2 lg:mx-10">
            <div className="relative inline-block text-left">
              {/* Small button */}
              <button
                onClick={() => setOpen(!open)}
                className="bg-gray-100 border border-gray-300 rounded-l-md flex items-center justify-between text-black hover:bg-gray-200 py-1 lg:py-3 px-2 lg:px-3 lg:text-sm text-xs w-10 lg:w-auto"
              >
                <span className="truncate">{selected}</span>
                <IoMdArrowDropdown className="ml-1 text-black" />
              </button>

              {/* Dropdown list */}
              {open && (
                <ul className="absolute left-0 mt-1 w-40 lg:w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-y-auto max-h-80">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setSelected(cat); // update selected
                        setOpen(false); // close dropdown
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-xs lg:text-sm"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="text"
              placeholder="Search.."
              className="flex-1 px-3 py-0 lg:py-3 text-black text-sm focus:outline-none bg-white w-full"
            />
            <button className="bg-yellow-400 px-2 lg:px-4 py-0 lg:py-3 rounded-r-md hover:bg-yellow-500 flex items-center justify-center">
              <FaSearch className="text-black text-sm lg:text-base" />
            </button>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center justify-end gap-3 lg:gap-6 text-xs lg:text-sm">
            {/* User Icon */}
            <div className="cursor-pointer leading-tight text-right">
              <div
                className="font-bold block cusrsor-pointer"
                onClick={() => setShowLogin(true)}
              >
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6"
                >
                  <g clipPath="url(#clip0_446_1292)">
                    <path
                      d="M20 0C22.6522 0 25.1959 1.05335 27.0713 2.92871C28.9467 4.80407 30 7.34784 30 10C30 12.6522 28.9467 15.1959 27.0713 17.0713C25.1959 18.9467 22.6522 20 20 20C17.3478 20 14.8041 18.9467 12.9287 17.0713C11.0533 15.1959 10 12.6522 10 10C10 7.34784 11.0533 4.80407 12.9287 2.92871C14.8041 1.05335 17.3478 0 20 0ZM20 3C16.134 3 13 6.13401 13 10C13 13.866 16.134 17 20 17C23.866 17 27 13.866 27 10C27 6.13401 23.866 3 20 3Z"
                      fill="white"
                    ></path>
                    <path
                      d="M25.7812 23.9844C32.4691 23.9844 37.8906 29.4059 37.8906 36.0938V38.5C37.8906 39.3284 37.2191 40 36.3906 40H37.8906V60.7031L37.8867 61.0156C37.7236 67.4552 32.5333 72.6455 26.0938 72.8086L25.7812 72.8125H14.0625L13.75 72.8086C7.2066 72.6428 1.95312 67.2865 1.95312 60.7031V40H3.45312C2.6247 40 1.95312 39.3284 1.95312 38.5V36.0938C1.95313 29.4059 7.37468 23.9844 14.0625 23.9844H25.7812ZM14.0625 26.9844C9.03153 26.9844 4.95313 31.0628 4.95312 36.0938V38.5C4.95312 39.3284 4.28155 40 3.45312 40H4.95312V60.7031C4.95312 65.7341 9.03153 69.8125 14.0625 69.8125H25.7812C30.8122 69.8125 34.8906 65.7341 34.8906 60.7031V40H36.3906C35.5622 40 34.8906 39.3284 34.8906 38.5V36.0938C34.8906 31.0628 30.8122 26.9844 25.7812 26.9844H14.0625Z"
                      fill="white"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_446_1292">
                      <rect width="40" height="40" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Wishlist Icon */}
            <div className="cursor-pointer flex items-center">
              <svg
                viewBox="0 0 21 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6"
              >
                <path
                  d="M9.81758 17.8006L2.26312 9.93389C0.135253 7.71812 0.269249 4.0849 2.55405 2.04556C4.82073 0.0223831 8.25762 0.415254 10.0488 2.90229L10.35 3.3204L10.6511 2.90229C12.4424 0.415254 15.8792 0.0223831 18.146 2.04556C20.4308 4.0849 20.5648 7.71812 18.4368 9.93389L10.8824 17.8006C10.5884 18.1068 10.1116 18.1068 9.81758 17.8006Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Cart Icon */}
            <div className="relative flex items-center cursor-pointer">
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6"
              >
                <path
                  d="M18.1717 22.4796H3.82729C2.73661 22.4796 1.88922 21.5263 2.01181 20.4386L3.79886 9.34618C3.87216 8.6963 4.41939 8.20508 5.07089 8.20508H16.9293C17.5808 8.20508 18.1281 8.6963 18.2014 9.34618L19.9884 20.4386C20.1098 21.527 19.2624 22.4796 18.1717 22.4796Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.36719 10.873V5.65177C7.36719 3.63485 8.99499 2 11.0032 2C13.0114 2 14.6392 3.63485 14.6392 5.65177V10.873"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.21875 10.873H8.51196"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.4844 10.873H15.7769"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Menu */}
        <nav className="bg-main text-sm px-3 lg:px-4 py-2 flex items-center gap-3 lg:gap-4 overflow-x-auto whitespace-nowrap">
          <AllCategoryModal />
          <a href="#" className="hover:underline px-2 py-1 text-xs lg:text-sm">
            Become a Seller
          </a>
          <a href="#" className="hover:underline px-2 py-1 text-xs lg:text-sm">
            Track Order
          </a>
          <a href="#" className="hover:underline px-2 py-1 text-xs lg:text-sm">
            Need Help?
          </a>
        </nav>
      </header>
      {/* ------------ Modals ------------ */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitch={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitch={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}