"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-center px-6">
      {/* Error Illustration */}
      <div className="relative">
        <h1 className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-main to-purple-400">
          404
        </h1>
        <div className="absolute inset-0 blur-2xl bg-blue-400/20 rounded-full"></div>
      </div>

      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-2">
        Oops! Page not found
      </h2>
      <p className="mt-3 text-gray-600 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-8">
        <Link
          href="/"
          className="px-6 py-3 bg-main text-white rounded-xl font-medium shadow-md hover:bg-main transition-all duration-300"
        >
          Go Home
        </Link>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-400 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
