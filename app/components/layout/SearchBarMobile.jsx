// "use client";

// import { FaSearch } from "react-icons/fa";
// import { IoMdArrowDropdown } from "react-icons/io";

// export default function SearchbarMobile({ 
//   open, 
//   setOpen, 
//   selected, 
//   setSelected, 
//   categories 
// }) {
//   return (
//     <div className="lg:hidden flex items-center px-2 pb-2">
//       <div className="flex flex-1 w-full">
//         <div className="relative inline-block text-left">
//           {/* Small button */}
//           <button
//             onClick={() => setOpen(!open)}
//             className="bg-gray-100 border border-gray-300 rounded-l-md flex items-center justify-between text-black hover:bg-gray-200 py-3 px-3 text-xs w-16"
//           >
//             <span className="truncate">{selected}</span>
//             <IoMdArrowDropdown className="ml-1 text-black" />
//           </button>

//           {/* Dropdown list */}
//           {open && (
//             <ul className="absolute left-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-y-auto max-h-80">
//               {categories.map((cat) => (
//                 <li
//                   key={cat}
//                   onClick={() => {
//                     setSelected(cat);
//                     setOpen(false);
//                   }}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-xs"
//                 >
//                   {cat}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <input
//           type="text"
//           placeholder="Search Khucra"
//           className="flex-1 px-3 py-2 text-black text-sm focus:outline-none bg-white w-full"
//         />
//         <button className="bg-yellow-400 px-3 py-2 rounded-r-md hover:bg-yellow-500 flex items-center justify-center">
//           <FaSearch className="text-black text-sm" />
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev2.nisamirrorfashionhouse.com/api/v2';

export default function SearchbarMobile({ 
  open, 
  setOpen, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      } else {
        handleSearch(e);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  // Scroll active suggestion into view
  useEffect(() => {
    if (activeSuggestionIndex >= 0) {
      const activeElement = document.querySelector(`[data-mobile-suggestion-index="${activeSuggestionIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeSuggestionIndex]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search suggestions
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        query_key: searchTerm,
        type: 'product'
      });

      // Add category filter if not "All"
      if (selectedCategory.id !== 'all') {
        params.append('category_id', selectedCategory.id);
      }

      const response = await fetch(`${API_BASE_URL}/get-search-suggestions?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Transform the data to match what we need for display
        const transformedSuggestions = data.data.map(item => ({
          id: item.id,
          name: item.query || item.name,
          slug: item.slug,
          type: item.type || 'product',
          type_string: item.type_string || 'Product',
          thumbnail_image: item.thumbnail_image || item.img,
          main_price: item.main_price,
          unit_price: item.unit_price,
          // For product items from search, they might have different structure
          ...(item.product && {
            name: item.product.name,
            slug: item.product.slug,
            thumbnail_image: item.product.thumbnail_image,
            main_price: item.product.main_price
          })
        }));
        
        setSuggestions(transformedSuggestions);
        setShowSuggestions(true);
        setActiveSuggestionIndex(-1);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Suggestion fetch error:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams({
        q: searchTerm,
        ...(selectedCategory.id !== 'all' && { category: selectedCategory.id })
      });
      
      router.push(`/shop_page?${searchParams.toString()}`);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      setSearchTerm('');
      inputRef.current?.blur(); // Close keyboard on mobile
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchParams = new URLSearchParams({
      q: suggestion.name,
      ...(selectedCategory.id !== 'all' && { category: selectedCategory.id })
    });
    
    // If it's a category or brand, add specific filters
    if (suggestion.type === 'category') {
      searchParams.set('category', suggestion.id);
    } else if (suggestion.type === 'brand') {
      searchParams.set('brand', suggestion.id);
    }
    
    router.push(`/shop_page?${searchParams.toString()}`);
    
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setSearchTerm('');
    inputRef.current?.blur(); // Close keyboard on mobile
  };

  // Helper function to get image URL
  const getImageUrl = (suggestion) => {
    if (suggestion.thumbnail_image) {
      if (suggestion.thumbnail_image.startsWith('http')) {
        return suggestion.thumbnail_image;
      }
      return `${API_BASE_URL}/public/uploads/all/${suggestion.thumbnail_image}`;
    }
    return null;
  };

  return (
    <div className="lg:hidden flex items-center px-2 pb-2" ref={searchRef}>
      <div className="flex flex-1 w-full relative">
        {/* Category Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpen(!open)}
            className="bg-gray-100 border border-gray-300 rounded-l-md flex items-center justify-between text-black hover:bg-gray-200 py-[10px] px-3 text-xs w-16"
          >
            <span className="truncate">{selectedCategory.name}</span>
            <IoMdArrowDropdown className="ml-1 text-black flex-shrink-0" />
          </button>

          {open && (
            <ul className="absolute left-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-y-auto max-h-80">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpen(false);
                    inputRef.current?.focus();
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-xs ${
                    selectedCategory.id === cat.id ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Input Container */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={`Search ${selectedCategory.id !== 'all' ? selectedCategory.name : 'products'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchTerm.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            className="w-full px-3 py-2 text-black text-sm focus:outline-none bg-white border-y border-gray-300"
            autoComplete="off"
          />

          {/* Search Suggestions Dropdown - Mobile Optimized */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
              {suggestions.length > 0 ? (
                <>
                  {/* Products Section */}
                  {suggestions.filter(s => s.type === 'product').length > 0 && (
                    <>
                      <div className="px-3 py-1 bg-gray-50 border-b border-gray-200 sticky top-0">
                        <p className="text-xs font-semibold text-gray-500">PRODUCTS</p>
                      </div>
                      {suggestions
                        .filter(s => s.type === 'product')
                        .map((suggestion, idx) => {
                          const globalIndex = suggestions.indexOf(suggestion);
                          const imageUrl = getImageUrl(suggestion);
                          
                          return (
                            <div
                              key={`mobile-${suggestion.type}-${suggestion.id}`}
                              data-mobile-suggestion-index={globalIndex}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                                activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {imageUrl && (
                                  <div className="w-8 h-8 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img
                                      src={imageUrl}
                                      alt={suggestion.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                      }}
                                    />
                                  </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-medium text-gray-800 line-clamp-1">
                                    {suggestion.name}
                                  </h4>
                                  
                                  {suggestion.main_price && (
                                    <p className="text-xs text-purple-600 font-semibold">
                                      {suggestion.main_price}
                                    </p>
                                  )}
                                </div>

                                <FaSearch className="text-gray-400 text-xs flex-shrink-0" />
                              </div>
                            </div>
                          );
                        })}
                    </>
                  )}

                  {/* Categories Section */}
                  {suggestions.filter(s => s.type === 'category').length > 0 && (
                    <>
                      <div className="px-3 py-1 bg-gray-50 border-t border-b border-gray-200 sticky top-0">
                        <p className="text-xs font-semibold text-gray-500">CATEGORIES</p>
                      </div>
                      {suggestions
                        .filter(s => s.type === 'category')
                        .map((suggestion, idx) => {
                          const globalIndex = suggestions.indexOf(suggestion);
                          return (
                            <div
                              key={`mobile-${suggestion.type}-${suggestion.id}`}
                              data-mobile-suggestion-index={globalIndex}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                                activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-700">{suggestion.name}</span>
                                <span className="text-xs text-gray-400">Category</span>
                              </div>
                            </div>
                          );
                        })}
                    </>
                  )}

                  {/* Brands Section */}
                  {suggestions.filter(s => s.type === 'brand').length > 0 && (
                    <>
                      <div className="px-3 py-1 bg-gray-50 border-t border-b border-gray-200 sticky top-0">
                        <p className="text-xs font-semibold text-gray-500">BRANDS</p>
                      </div>
                      {suggestions
                        .filter(s => s.type === 'brand')
                        .map((suggestion, idx) => {
                          const globalIndex = suggestions.indexOf(suggestion);
                          return (
                            <div
                              key={`mobile-${suggestion.type}-${suggestion.id}`}
                              data-mobile-suggestion-index={globalIndex}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                                activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-700">{suggestion.name}</span>
                                <span className="text-xs text-gray-400">Brand</span>
                              </div>
                            </div>
                          );
                        })}
                    </>
                  )}
                </>
              ) : (
                <div className="px-3 py-6 text-center">
                  <p className="text-gray-500 text-xs">No suggestions found</p>
                </div>
              )}

              {/* View all results link */}
              {suggestions.length > 0 && (
                <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                  <button
                    onClick={handleSearch}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium w-full text-center"
                  >
                    Search for "{searchTerm}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="bg-main px-3 py-2 rounded-r-md hover:bg-main-hov flex items-center justify-center border border-l-0 border-gray-300"
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent"></div>
          ) : (
            <FaSearch className="text-black text-sm" />
          )}
        </button>
      </div>
    </div>
  );
}