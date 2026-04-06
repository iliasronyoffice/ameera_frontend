"use client";

import Link from "next/link";


export default function Breadcrumb() {

  return (
    <nav className="text-sm py-4">
      <ul className="flex items-center space-x-2 text-gray-600">
        <li>
          <Link href="/" className="hover:text-main font-medium">
            Home
          </Link>
        </li>
        <span className="mx-2">/</span>
        <li>
          <Link href="/" className="hover:text-main font-medium">
            Confirm Order
          </Link>
        </li>
      </ul>
    </nav>
  );
}

