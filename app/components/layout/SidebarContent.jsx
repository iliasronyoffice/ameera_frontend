"use client";
import { useRef, useState, useEffect } from "react";
import FilterCard from "./FilterCard";
import { FaSpinner } from "react-icons/fa";

export default function SidebarContent({ 
  categories = [], 
  brands = [], 
  selectedCategory = "",
  minPrice = "",
  maxPrice = "",
  onFilterChange,
  onClose,
  loading = false 
}) {
  const [priceMin, setPriceMin] = useState(minPrice ? parseInt(minPrice) : 0);
  const [priceMax, setPriceMax] = useState(maxPrice ? parseInt(maxPrice) : 100000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");

  const minSliderRef = useRef(null);
  const maxSliderRef = useRef(null);

  // Update local state when props change
  useEffect(() => {
    setPriceMin(minPrice ? parseInt(minPrice) : 0);
  }, [minPrice]);

  useEffect(() => {
    setPriceMax(maxPrice ? parseInt(maxPrice) : 100000);
  }, [maxPrice]);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedCategories(selectedCategory.split(','));
    } else {
      setSelectedCategories([]);
    }
  }, [selectedCategory]);

  // Get selected brands from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brands = params.get("brands");
    if (brands) {
      setSelectedBrands(brands.split(','));
    }
  }, []);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), priceMax - 1000);
    setPriceMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), priceMin + 1000);
    setPriceMax(value);
  };

  const handleMinInput = (e) => {
    const value = Math.min(Number(e.target.value), priceMax - 1000);
    setPriceMin(isNaN(value) ? 0 : value);
  };

  const handleMaxInput = (e) => {
    const value = Math.max(Number(e.target.value), priceMin + 1000);
    setPriceMax(isNaN(value) ? 100000 : value);
  };

  const applyPriceFilter = () => {
    onFilterChange('price', { min: priceMin, max: priceMax });
    if (onClose) onClose();
  };

  const handleCategoryChange = (categoryId) => {
    let updatedCategories;
    if (selectedCategories.includes(categoryId.toString())) {
      // Remove category
      updatedCategories = selectedCategories.filter(id => id !== categoryId.toString());
    } else {
      // Add category
      updatedCategories = [...selectedCategories, categoryId.toString()];
    }
    
    setSelectedCategories(updatedCategories);
    
    // Pass comma-separated string to parent
    const categoryString = updatedCategories.length > 0 ? updatedCategories.join(',') : '';
    onFilterChange('category', categoryString);
  };

  const handleBrandChange = (brandId) => {
    let updatedBrands;
    if (selectedBrands.includes(brandId.toString())) {
      // Remove brand
      updatedBrands = selectedBrands.filter(id => id !== brandId.toString());
    } else {
      // Add brand
      updatedBrands = [...selectedBrands, brandId.toString()];
    }
    
    setSelectedBrands(updatedBrands);
    
    // Pass comma-separated string to parent
    const brandString = updatedBrands.length > 0 ? updatedBrands.join(',') : '';
    onFilterChange('brand', brandString);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    onFilterChange('rating', rating);
    if (onClose) onClose();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-2xl text-main" />
      </div>
    );
  }

  return (
    <>
      <h3 className="text-gray-800 font-semibold text-lg border-b pb-3 lg:block hidden">
        Filter Options
      </h3>

      {/* Categories - Multi-select */}
      {categories.length > 0 && (
        <FilterCard title="Categories">
          <ul className="mt-2 space-y-1 text-gray-600 text-sm max-h-60 overflow-y-auto">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`cat-${cat.id}`}
                  value={cat.id}
                  checked={selectedCategories.includes(cat.id.toString())}
                  onChange={() => handleCategoryChange(cat.id)}
                  className="accent-main cursor-pointer"
                />
                <label htmlFor={`cat-${cat.id}`} className="cursor-pointer flex-1 hover:text-main">
                  {cat.name}
                  {cat.products_count && (
                    <span className="text-gray-400 text-xs ml-1">({cat.products_count})</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => {
                setSelectedCategories([]);
                onFilterChange('category', '');
              }}
              className="mt-2 text-xs text-main hover:text-purple-800"
            >
              Clear All Categories
            </button>
          )}
        </FilterCard>
      )}

      {/* Price Range - FIXED DUAL SLIDER */}
      <FilterCard title="Price Range">
        <div className="mt-3">
          {/* Dual Range Slider - Fixed */}
          <div className="relative h-12 flex items-center">
            {/* Background Track */}
            <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>

            {/* Selected Range */}
            <div
              className="absolute h-2 bg-purple-500 rounded-full"
              style={{
                left: `${(priceMin / 100000) * 100}%`,
                width: `${((priceMax - priceMin) / 100000) * 100}%`,
              }}
            ></div>

            {/* Min Price Thumb */}
            <div className="absolute w-full">
              <input
                ref={minSliderRef}
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={priceMin}
                onChange={handleMinChange}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
                style={{
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-main rounded-full shadow cursor-grab hover:scale-110 transition-transform"
                style={{
                  left: `calc(${(priceMin / 100000) * 100}% - 10px)`,
                  top: "-6px",
                  pointerEvents: 'none',
                }}
              ></div>
            </div>

            {/* Max Price Thumb */}
            <div className="absolute w-full">
              <input
                ref={maxSliderRef}
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={priceMax}
                onChange={handleMaxChange}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
                style={{
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-main rounded-full shadow cursor-grab hover:scale-110 transition-transform"
                style={{
                  left: `calc(${(priceMax / 100000) * 100}% - 10px)`,
                  top: "-6px",
                  pointerEvents: 'none',
                }}
              ></div>
            </div>
          </div>

          {/* Price Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-4 mb-4">
            <span>৳0</span>
            <span>৳100,000</span>
          </div>

          {/* Price Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ৳
                </span>
                <input
                  type="number"
                  value={priceMin}
                  onChange={handleMinInput}
                  className="w-full border border-gray-300 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  max={priceMax - 1000}
                />
              </div>
            </div>
            <span className="text-gray-500 text-sm">to</span>
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ৳
                </span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={handleMaxInput}
                  className="w-full border border-gray-300 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min={priceMin + 1000}
                  max="100000"
                />
              </div>
            </div>
          </div>

          <button
            onClick={applyPriceFilter}
            className="mt-3 w-full bg-main text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
          >
            Apply Price Filter
          </button>
        </div>
      </FilterCard>

      {/* Brands - Multi-select */}
      {brands.length > 0 && (
        <FilterCard title="Brands">
          <ul className="mt-2 space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto pr-2">
            {brands.map((brand) => (
              <li key={brand.id} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id.toString())}
                  onChange={() => handleBrandChange(brand.id)}
                  className="accent-main cursor-pointer"
                />
                <label htmlFor={`brand-${brand.id}`} className="cursor-pointer hover:text-main">
                  {brand.name}
                  {brand.products_count && (
                    <span className="text-gray-400 text-xs ml-1">({brand.products_count})</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
          {selectedBrands.length > 0 && (
            <button
              onClick={() => {
                setSelectedBrands([]);
                onFilterChange('brand', '');
              }}
              className="mt-2 text-xs text-main hover:text-purple-800"
            >
              Clear All Brands
            </button>
          )}
        </FilterCard>
      )}

      {/* Rating Filter */}
      <FilterCard title="Rating">
        <div className="mt-2 space-y-2 text-sm">
          {[5, 4, 3, 2, 1].map((r) => (
            <div key={r} className="flex items-center gap-2">
              <input 
                type="radio" 
                name="rating"
                id={`rating-${r}`}
                value={r}
                checked={selectedRating === r.toString()}
                onChange={() => handleRatingChange(r.toString())}
                className="accent-main cursor-pointer"
              />
              <label htmlFor={`rating-${r}`} className="cursor-pointer flex items-center hover:text-main">
                <span className="text-yellow-500">{'★'.repeat(r)}</span>
                <span className="text-gray-500 ml-1">& up</span>
              </label>
            </div>
          ))}
          {selectedRating && (
            <button
              onClick={() => {
                setSelectedRating("");
                onFilterChange('rating', '');
              }}
              className="mt-2 text-xs text-main hover:text-purple-800"
            >
              Clear Rating
            </button>
          )}
        </div>
      </FilterCard>
    </>
  );
}