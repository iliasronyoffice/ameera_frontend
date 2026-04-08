"use client";

import SearchbarDesktop from "@/app/components/layout/SearchBarDesktop";
import { useEffect } from "react";

export default function SearchModal({ 
  isOpen, 
  onClose, 
  open, 
  setOpen, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}) {
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Get the header element
      const header = document.querySelector('header');
      
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll and prevent shift
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Keep scrollbar visible
      
      // Add padding to header to prevent shift
      if (header) {
        header.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Store scroll position for restoration
      document.body.dataset.scrollPosition = scrollY;
    } else {
      // Restore scroll position
      const scrollY = document.body.dataset.scrollPosition;
      
      // Restore body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      // Remove header padding
      const header = document.querySelector('header');
      if (header) {
        header.style.paddingRight = '';
      }
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
      delete document.body.dataset.scrollPosition;
    }
    
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      const header = document.querySelector('header');
      if (header) {
        header.style.paddingRight = '';
      }
      
      window.removeEventListener("keydown", handleEsc);
      
      // Restore scroll on cleanup
      const scrollY = document.body.dataset.scrollPosition;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        delete document.body.dataset.scrollPosition;
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white shadow-2xl animate-slide-down">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Products
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="h-20 flex items-center px-4 bg-gray-50">
          <div className="w-full max-w-7xl mx-auto">
            <SearchbarDesktop
              open={open}
              setOpen={setOpen}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              isModal={true}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}