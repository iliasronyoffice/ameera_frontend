// "use client";

// import { FaSearch } from "react-icons/fa";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev2.nisamirrorfashionhouse.com/api/v2';

// export default function SearchbarDesktop({ 
//   open, 
//   setOpen, 
//   selectedCategory, 
//   setSelectedCategory, 
//   categories 
// }) {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
//   const searchRef = useRef(null);
//   const searchTimeout = useRef(null);
//   const inputRef = useRef(null);

//   console.log('categories data', categories);
//   console.log('selected category', selectedCategory);

//   // Handle keyboard navigation for suggestions
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
//         // Navigate to selected suggestion
//         handleSuggestionClick(suggestions[activeSuggestionIndex]);
//       } else {
//         // Perform search
//         handleSearch(e);
//       }
//     } else if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       setActiveSuggestionIndex(prev => 
//         prev < suggestions.length - 1 ? prev + 1 : prev
//       );
//     } else if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
//     } else if (e.key === 'Escape') {
//       setShowSuggestions(false);
//       setActiveSuggestionIndex(-1);
//     }
//   };

//   // Scroll active suggestion into view
//   useEffect(() => {
//     if (activeSuggestionIndex >= 0) {
//       const activeElement = document.querySelector(`[data-suggestion-index="${activeSuggestionIndex}"]`);
//       if (activeElement) {
//         activeElement.scrollIntoView({ block: 'nearest' });
//       }
//     }
//   }, [activeSuggestionIndex]);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//         setActiveSuggestionIndex(-1);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (searchTerm.trim().length < 2) {
//       setSuggestions([]);
//       setShowSuggestions(false);
//       setActiveSuggestionIndex(-1);
//       return;
//     }

//     if (searchTimeout.current) {
//       clearTimeout(searchTimeout.current);
//     }

//     searchTimeout.current = setTimeout(() => {
//       fetchSuggestions();
//     }, 300);

//     return () => {
//       if (searchTimeout.current) {
//         clearTimeout(searchTimeout.current);
//       }
//     };
//   }, [searchTerm]);

//   const fetchSuggestions = async () => {
//     if (!searchTerm.trim()) return;

//     setIsSearching(true);
//     try {
//       const params = new URLSearchParams({
//         query_key: searchTerm,
//         type: 'product'
//       });

//       // Add category filter if not "All"
//       if (selectedCategory.id !== 'all') {
//         params.append('category_id', selectedCategory.id);
//       }

//       const response = await fetch(`${API_BASE_URL}/get-search-suggestions?${params}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch suggestions');
//       }

//       const data = await response.json();
      
//       if (data.success && data.data) {
//         setSuggestions(data.data);
//         setShowSuggestions(true);
//         setActiveSuggestionIndex(-1);
//       } else {
//         setSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Suggestion fetch error:', error);
//       setSuggestions([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       const searchParams = new URLSearchParams({
//         q: searchTerm,
//         ...(selectedCategory.id !== 'all' && { category: selectedCategory.id })
//       });
      
//       // Redirect to shop_page instead of /search
//       router.push(`/shop_page?${searchParams.toString()}`);
//       setShowSuggestions(false);
//       setActiveSuggestionIndex(-1);
//       setSearchTerm('');
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//   if (suggestion.type === 'product') {
//     // For product suggestions, go to shop_page with product filter
//     const searchParams = new URLSearchParams({
//       q: suggestion.name, // Search by product name
//       ...(selectedCategory.id !== 'all' && { category: selectedCategory.id })
//     });
//     router.push(`/shop_page?${searchParams.toString()}`);
//   } else if (suggestion.type === 'category') {
//     // For category suggestions, go to shop_page with category filter
//     const searchParams = new URLSearchParams({
//       category: suggestion.id
//     });
//     router.push(`/shop_page?${searchParams.toString()}`);
//   } else if (suggestion.type === 'brand') {
//     // For brand suggestions, go to shop_page with brand filter
//     const searchParams = new URLSearchParams({
//       brand: suggestion.id
//     });
//     router.push(`/shop_page?${searchParams.toString()}`);
//   }
  
//   setShowSuggestions(false);
//   setActiveSuggestionIndex(-1);
//   setSearchTerm('');
// };

//   return (
//     <div className="hidden lg:flex flex-1 mx-2 lg:mx-10 relative" ref={searchRef}>
//       {/* Category Dropdown - Like Amazon's "All" dropdown */}
//       <div className="relative inline-block text-left">
//         <button
//           onClick={() => setOpen(!open)}
//           className="bg-gray-100 border border-gray-300 rounded-l-md flex items-center justify-between text-black hover:bg-gray-200 py-2 lg:py-3 px-2 lg:px-3 lg:text-sm text-xs w-20 lg:w-auto min-w-[100px] h-full"
//         >
//           <span className="truncate">{selectedCategory.name}</span>
//           <IoMdArrowDropdown className="ml-1 text-black flex-shrink-0" />
//         </button>

//         {open && (
//           <ul className="absolute left-0 mt-1 w-40 lg:w-56 bg-white border border-gray-300 rounded-md shadow-lg z-20 overflow-y-auto max-h-96">
//             {categories.map((cat) => (
//               <li
//                 key={cat.id}
//                 onClick={() => {
//                   setSelectedCategory(cat);
//                   setOpen(false);
//                   // Refocus input after selection
//                   inputRef.current?.focus();
//                 }}
//                 className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-xs lg:text-sm ${
//                   selectedCategory.id === cat.id ? 'bg-gray-100 font-semibold' : ''
//                 }`}
//               >
//                 {cat.name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Search Input - Like Amazon's search bar */}
//       <div className="flex-1 relative">
//         <input
//           ref={inputRef}
//           type="text"
//           placeholder={`Search ${selectedCategory.id !== 'all' ? selectedCategory.name : 'all products'}...`}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onFocus={() => searchTerm.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
//           className="w-full px-3 py-2 lg:py-3 text-black text-sm focus:outline-none bg-white border-y border-gray-300"
//           autoComplete="off"
//         />

//         {/* Search Suggestions Dropdown - Like Amazon's suggestion dropdown */}
//         {showSuggestions && (
//           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-30 max-h-96 overflow-y-auto">
//             {/* Suggested searches */}
//             {suggestions.length > 0 ? (
//               <>
//                 {/* Products Section */}
//                 {suggestions.filter(s => s.type === 'product').length > 0 && (
//                   <>
//                     <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
//                       <p className="text-xs font-semibold text-gray-500">PRODUCTS</p>
//                     </div>
//                     {suggestions
//                       .filter(s => s.type === 'product')
//                       .map((suggestion, idx) => {
//                         const globalIndex = suggestions.indexOf(suggestion);
//                         return (
//                           <div
//                             key={`${suggestion.type}-${suggestion.id}`}
//                             data-suggestion-index={globalIndex}
//                             onClick={() => handleSuggestionClick(suggestion)}
//                             className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
//                               activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
//                             }`}
//                           >
//                             <div className="flex items-center gap-3">
//                               {suggestion.thumbnail_image && (
//                                 <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
//                                   <img
//                                     src={suggestion.thumbnail_image}
//                                     alt={suggestion.name}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 </div>
//                               )}
                              
//                               <div className="flex-1 min-w-0">
//                                 <h4 className="text-sm font-medium text-gray-800">
//                                   {suggestion.name}
//                                 </h4>
                                
//                                 {suggestion.main_price && (
//                                   <p className="text-sm text-purple-600 font-semibold mt-1">
//                                     {suggestion.main_price}
//                                   </p>
//                                 )}
//                               </div>

//                               <FaSearch className="text-gray-400 text-xs" />
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </>
//                 )}

//                 {/* Categories Section */}
//                 {suggestions.filter(s => s.type === 'category').length > 0 && (
//                   <>
//                     <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
//                       <p className="text-xs font-semibold text-gray-500">CATEGORIES</p>
//                     </div>
//                     {suggestions
//                       .filter(s => s.type === 'category')
//                       .map((suggestion, idx) => {
//                         const globalIndex = suggestions.indexOf(suggestion);
//                         return (
//                           <div
//                             key={`${suggestion.type}-${suggestion.id}`}
//                             data-suggestion-index={globalIndex}
//                             onClick={() => handleSuggestionClick(suggestion)}
//                             className={`px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
//                               activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
//                             }`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm text-gray-700">{suggestion.name}</span>
//                               <span className="text-xs text-gray-400">Category</span>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </>
//                 )}

//                 {/* Brands Section */}
//                 {suggestions.filter(s => s.type === 'brand').length > 0 && (
//                   <>
//                     <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
//                       <p className="text-xs font-semibold text-gray-500">BRANDS</p>
//                     </div>
//                     {suggestions
//                       .filter(s => s.type === 'brand')
//                       .map((suggestion, idx) => {
//                         const globalIndex = suggestions.indexOf(suggestion);
//                         return (
//                           <div
//                             key={`${suggestion.type}-${suggestion.id}`}
//                             data-suggestion-index={globalIndex}
//                             onClick={() => handleSuggestionClick(suggestion)}
//                             className={`px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
//                               activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
//                             }`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm text-gray-700">{suggestion.name}</span>
//                               <span className="text-xs text-gray-400">Brand</span>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </>
//                 )}
//               </>
//             ) : (
//               <div className="px-4 py-8 text-center">
//                 <p className="text-gray-500 text-sm">No suggestions found</p>
//               </div>
//             )}

//             {/* View all results link */}
//             {suggestions.length > 0 && (
//               <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
//                 <button
//                   onClick={handleSearch}
//                   className="text-sm text-purple-600 hover:text-purple-700 font-medium w-full text-center"
//                 >
//                   Search for "{searchTerm}" {selectedCategory.id !== 'all' && `in ${selectedCategory.name}`}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Search Button */}
//       <button 
//         onClick={handleSearch}
//         className="bg-yellow-400 px-4 lg:px-6 py-2 lg:py-3 rounded-r-md hover:bg-yellow-500 flex items-center justify-center border border-l-0 border-gray-300 transition-colors"
//       >
//         {isSearching ? (
//           <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
//         ) : (
//           <FaSearch className="text-black text-sm lg:text-base" />
//         )}
//       </button>
//     </div>
//   );
// }






"use client";

import { FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev2.nisamirrorfashionhouse.com/api/v2';

export default function SearchbarDesktop({ 
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

  // console.log('categories data', categories);
  // console.log('selected category', selectedCategory);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        // Navigate to selected suggestion
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      } else {
        // Perform search
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
      const activeElement = document.querySelector(`[data-suggestion-index="${activeSuggestionIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeSuggestionIndex]);

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
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Always go to shop_page with search query
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
  };

  // Helper function to get image URL
  const getImageUrl = (suggestion) => {
    if (suggestion.thumbnail_image) {
      // Check if it's a full URL or just an ID
      if (suggestion.thumbnail_image.startsWith('http')) {
        return suggestion.thumbnail_image;
      }
      // If it's an ID, construct the URL (adjust based on your image URL pattern)
      return `${API_BASE_URL}/public/uploads/all/${suggestion.thumbnail_image}`;
    }
    return null;
  };

  return (
    <div className="hidden lg:flex flex-1 mx-2 lg:mx-10 relative" ref={searchRef}>
      {/* Category Dropdown - Like Amazon's "All" dropdown */}
      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="bg-gray-100 border border-gray-300 rounded-l-md flex items-center justify-between text-black hover:bg-gray-200 py-2 lg:py-3 px-2 lg:px-3 lg:text-sm text-xs w-20 lg:w-auto min-w-[100px] h-full"
        >
          <span className="truncate">{selectedCategory.name}</span>
          <IoMdArrowDropdown className="ml-1 text-black flex-shrink-0" />
        </button>

        {open && (
          <ul className="absolute left-0 mt-1 w-40 lg:w-56 bg-white border border-gray-300 rounded-md shadow-lg z-20 overflow-y-auto max-h-96">
            {categories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpen(false);
                  // Refocus input after selection
                  inputRef.current?.focus();
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-xs lg:text-sm ${
                  selectedCategory.id === cat.id ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Input - Like Amazon's search bar */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={`Search ${selectedCategory.id !== 'all' ? selectedCategory.name : 'all products'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          className="w-full px-3 py-2 lg:py-3 text-black text-sm focus:outline-none bg-white border-y border-gray-300"
          autoComplete="off"
        />

        {/* Search Suggestions Dropdown - Like Amazon's suggestion dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-30 max-h-96 overflow-y-auto">
            {/* Suggested searches */}
            {suggestions.length > 0 ? (
              <>
                {/* Products Section */}
                {suggestions.filter(s => s.type === 'product').length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500">PRODUCTS</p>
                    </div>
                    {suggestions
                      .filter(s => s.type === 'product')
                      .map((suggestion, idx) => {
                        const globalIndex = suggestions.indexOf(suggestion);
                        const imageUrl = getImageUrl(suggestion);
                        
                        return (
                          <div
                            key={`${suggestion.type}-${suggestion.id}`}
                            data-suggestion-index={globalIndex}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                              activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {imageUrl && (
                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                                <h4 className="text-sm font-medium text-gray-800">
                                  {suggestion.name}
                                </h4>
                                
                                {suggestion.main_price && (
                                  <p className="text-sm text-purple-600 font-semibold mt-1">
                                    {suggestion.main_price}
                                  </p>
                                )}
                              </div>

                              <FaSearch className="text-gray-400 text-xs" />
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}

                {/* Categories Section */}
                {suggestions.filter(s => s.type === 'category').length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500">CATEGORIES</p>
                    </div>
                    {suggestions
                      .filter(s => s.type === 'category')
                      .map((suggestion, idx) => {
                        const globalIndex = suggestions.indexOf(suggestion);
                        return (
                          <div
                            key={`${suggestion.type}-${suggestion.id}`}
                            data-suggestion-index={globalIndex}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                              activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{suggestion.name}</span>
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
                    <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500">BRANDS</p>
                    </div>
                    {suggestions
                      .filter(s => s.type === 'brand')
                      .map((suggestion, idx) => {
                        const globalIndex = suggestions.indexOf(suggestion);
                        return (
                          <div
                            key={`${suggestion.type}-${suggestion.id}`}
                            data-suggestion-index={globalIndex}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                              activeSuggestionIndex === globalIndex ? 'bg-gray-100' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{suggestion.name}</span>
                              <span className="text-xs text-gray-400">Brand</span>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500 text-sm">No suggestions found</p>
              </div>
            )}

            {/* View all results link */}
            {suggestions.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleSearch}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium w-full text-center"
                >
                  Search for "{searchTerm}" {selectedCategory.id !== 'all' && `in ${selectedCategory.name}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="bg-main  px-4 lg:px-6 py-2 lg:py-3 rounded-r-md  flex items-center justify-center border border-l-0 border-gray-300 transition-colors"
      >
        {isSearching ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
        ) : (
          <FaSearch className="text-black  text-sm lg:text-base" />
        )}
      </button>
    </div>
  );
}