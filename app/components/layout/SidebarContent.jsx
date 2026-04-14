"use client";
import { useRef, useState, useEffect } from "react";
import FilterCard from "./FilterCard";
import { FaSpinner } from "react-icons/fa";

export default function SidebarContent({ 
  categories = [], 
  brands = [], 
  colors = [], 
  selectedCategory = "",
  minPrice = "",
  maxPrice = "",
  priceRangeMin = 0,
  priceRangeMax = 100000,
  onFilterChange,
  onClose,
  loading = false,
  currentProducts = []
}) {
  const [priceMin, setPriceMin] = useState(minPrice ? parseInt(minPrice) : priceRangeMin);
  const [priceMax, setPriceMax] = useState(maxPrice ? parseInt(maxPrice) : priceRangeMax);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [showAllColors, setShowAllColors] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setPriceMin(minPrice ? parseInt(minPrice) : priceRangeMin);
  }, [minPrice, priceRangeMin]);

  useEffect(() => {
    setPriceMax(maxPrice ? parseInt(maxPrice) : priceRangeMax);
  }, [maxPrice, priceRangeMax]);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedCategories(selectedCategory.split(','));
    } else {
      setSelectedCategories([]);
    }
  }, [selectedCategory]);

  // Get selected brands, colors from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brandsParam = params.get("brands");
    if (brandsParam) {
      setSelectedBrands(brandsParam.split(','));
    }
    const colorsParam = params.get("colors");
    if (colorsParam) {
      setSelectedColors(colorsParam.split(','));
    }
    const ratingParam = params.get("rating");
    if (ratingParam) {
      setSelectedRating(ratingParam);
    }
  }, []);

  // Calculate percentage for slider positioning
  const getMinPercent = () => {
    const range = priceRangeMax - priceRangeMin;
    if (range === 0) return 0;
    return ((priceMin - priceRangeMin) / range) * 100;
  };

  const getMaxPercent = () => {
    const range = priceRangeMax - priceRangeMin;
    if (range === 0) return 100;
    return ((priceMax - priceRangeMin) / range) * 100;
  };

  const handleMinChange = (e) => {
    let value = parseInt(e.target.value);
    const maxLimit = priceMax - 100;
    if (value > maxLimit) {
      value = maxLimit;
    }
    if (value < priceRangeMin) {
      value = priceRangeMin;
    }
    setPriceMin(value);
  };

  const handleMaxChange = (e) => {
    let value = parseInt(e.target.value);
    const minLimit = priceMin + 100;
    if (value < minLimit) {
      value = minLimit;
    }
    if (value > priceRangeMax) {
      value = priceRangeMax;
    }
    setPriceMax(value);
  };

  const handleMinInput = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = priceRangeMin;
    if (value >= priceMax - 100) {
      value = priceMax - 100;
    }
    if (value < priceRangeMin) value = priceRangeMin;
    setPriceMin(value);
  };

  const handleMaxInput = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = priceRangeMax;
    if (value <= priceMin + 100) {
      value = priceMin + 100;
    }
    if (value > priceRangeMax) value = priceRangeMax;
    setPriceMax(value);
  };

const applyPriceFilter = () => {
  // Ensure we have valid numbers
  const min = priceMin >= priceRangeMin ? priceMin : priceRangeMin;
  const max = priceMax <= priceRangeMax ? priceMax : priceRangeMax;
  
  onFilterChange('price', { min: min, max: max });
  if (onClose) onClose();
};

const handleCategoryChange = (categoryId) => {
  let updatedCategories;
  if (selectedCategories.includes(categoryId.toString())) {
    updatedCategories = selectedCategories.filter(id => id !== categoryId.toString());
  } else {
    updatedCategories = [...selectedCategories, categoryId.toString()];
  }
  
  setSelectedCategories(updatedCategories);
  // Pass as comma-separated string
  const categoryString = updatedCategories.length > 0 ? updatedCategories.join(',') : '';
  onFilterChange('category', categoryString);
};
  // In SidebarContent, update the handleBrandChange function
const handleBrandChange = (brandId) => {
  let updatedBrands;
  if (selectedBrands.includes(brandId.toString())) {
    updatedBrands = selectedBrands.filter(id => id !== brandId.toString());
  } else {
    updatedBrands = [...selectedBrands, brandId.toString()];
  }
  
  setSelectedBrands(updatedBrands);
  // Pass comma-separated string directly
  const brandString = updatedBrands.length > 0 ? updatedBrands.join(',') : '';
  onFilterChange('brand', brandString);
};

// Update the handleColorChange function
const handleColorChange = (colorCode) => {
  if (!colorCode) return;
  let updatedColors;
  if (selectedColors.includes(colorCode)) {
    updatedColors = selectedColors.filter(code => code !== colorCode);
  } else {
    updatedColors = [...selectedColors, colorCode];
  }
  
  setSelectedColors(updatedColors);
  // Pass the raw color code - don't encode here
  const colorString = updatedColors.length > 0 ? updatedColors.join(',') : '';
  console.log('Sending color to parent:', colorString);
  onFilterChange('color', colorString);
};

  const handleRatingChange = (rating) => {
    const newRating = selectedRating === rating ? "" : rating;
    setSelectedRating(newRating);
    onFilterChange('rating', newRating);
    if (onClose && newRating) onClose();
  };

  // Sort colors by product count (most popular first)
  const sortedColors = [...colors].sort((a, b) => (b.product_count || 0) - (a.product_count || 0));
  const displayedColors = showAllColors ? sortedColors : sortedColors.slice(0, 20);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-2xl text-main" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto px-4 pb-6">
      <h3 className="text-gray-800 font-semibold text-lg border-b pb-3 lg:block hidden">
        Filter Options
      </h3>

      {/* Categories - Multi-select */}
      {categories && categories.length > 0 && (
        <FilterCard title="Categories">
          <ul className="mt-2 space-y-1 text-gray-600 text-sm max-h-60 overflow-y-auto">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`cat-${cat.id}`}
                  checked={selectedCategories.includes(cat.id?.toString())}
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
              className="mt-2 text-xs text-main hover:text-main"
            >
              Clear All Categories
            </button>
          )}
        </FilterCard>
      )}

      {/* Price Range - DUAL SLIDER */}
      <FilterCard title="Price Range">
        <div className="mt-3">
          {/* Dual Range Slider Container */}
          <div className="relative pt-2 pb-6">
            {/* Slider Track Background */}
            <div className="relative h-1 bg-gray-200 rounded-full">
              {/* Selected Range Highlight */}
              <div
                className="absolute h-full rounded-full"
                style={{
                  left: `${getMinPercent()}%`,
                  right: `${100 - getMaxPercent()}%`,
                }}
              />
            </div>

            {/* Min Slider */}
            <input
              type="range"
              min={priceRangeMin}
              max={priceRangeMax}
              step="100"
              value={priceMin}
              onChange={handleMinChange}
              className="absolute top-2 left-0 w-full h-1 appearance-none bg-transparent pointer-events-auto"
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
                zIndex: priceMin > priceRangeMax / 2 ? 5 : 3,
              }}
            />

            {/* Max Slider */}
            <input
              type="range"
              min={priceRangeMin}
              max={priceRangeMax}
              step="100"
              value={priceMax}
              onChange={handleMaxChange}
              className="absolute top-2 left-0 w-full h-1 appearance-none bg-transparent pointer-events-auto"
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
                zIndex: priceMax < priceRangeMax / 2 ? 5 : 4,
              }}
            />
          </div>

          {/* Price Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2 mb-4">
            <span>৳{priceRangeMin.toLocaleString()}</span>
            <span>৳{priceMin.toLocaleString()}</span>
            <span>৳{priceMax.toLocaleString()}</span>
            <span>৳{priceRangeMax.toLocaleString()}</span>
          </div>

          {/* Price Inputs */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ৳
                </span>
                <input
                  type="number"
                  value={priceMin}
                  onChange={handleMinInput}
                  className="w-full border border-gray-300 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  min={priceRangeMin}
                  max={priceMax - 100}
                  step="100"
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
                  className="w-full border border-gray-300 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  min={priceMin + 100}
                  max={priceRangeMax}
                  step="100"
                />
              </div>
            </div>
          </div>

          <button
            onClick={applyPriceFilter}
            className="w-full bg-main text-white py-2 rounded-lg text-sm hover:bg-main-dark transition-colors"
          >
            Apply Price Filter
          </button>
        </div>
      </FilterCard>

      {/* Colors Section - Using API colors directly */}
      {sortedColors && sortedColors.length > 0 && (
        <FilterCard title="Colors">
          <div className="">
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pb-2 pt-10">
              {displayedColors.map((color, index) => {
                if (!color || !color.code) return null;
                const uniqueKey = `${color.code}-${index}`;
                const isSelected = selectedColors.includes(color.code);
                
                return (
                  <button
                    key={uniqueKey}
                    onClick={() => handleColorChange(color.code)}
                    className={`relative group w-6 h-6 rounded-full py-2 border-2 transition-all transform hover:scale-110 ${
                      isSelected
                        ? "border-gray-300 ring-2 ring-main ring-offset-1 shadow-lg"
                        : "border-gray-300 hover:border-main"
                    }`}
                    style={{ 
                      backgroundColor: color.code,
                      boxShadow: isSelected 
                        ? '0 0 0 2px white, 0 0 0 4px #7c3aed' 
                        : 'none'
                    }}
                    title={`${color.name} (${color.product_count} product${color.product_count > 1 ? 's' : ''})`}
                  >
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-3 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {sortedColors.length > 20 && (
              <button
                onClick={() => setShowAllColors(!showAllColors)}
                className="mt-3 text-xs text-main hover:text-main"
              >
                {showAllColors ? 'Show Less' : `Show ${sortedColors.length - 20} More Colors`}
              </button>
            )}
            
            {selectedColors.length > 0 && (
              <button
                onClick={() => {
                  setSelectedColors([]);
                  onFilterChange('color', '');
                }}
                className="mt-3 ml-3 text-xs text-main hover:text-main"
              >
                Clear All Colors ({selectedColors.length})
              </button>
            )}
          </div>
        </FilterCard>
      )}

      {/* Brands - Multi-select */}
      {brands && brands.length > 0 && (
        <FilterCard title="Brands">
          <ul className="mt-2 space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto pr-2">
            {brands.map((brand) => (
              <li key={brand.id} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id?.toString())}
                  onChange={() => handleBrandChange(brand.id)}
                  className="accent-main cursor-pointer"
                />
                <label htmlFor={`brand-${brand.id}`} className="cursor-pointer hover:text-main flex-1">
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
              className="mt-2 text-xs text-main hover:text-main"
            >
              Clear All Brands
            </button>
          )}
        </FilterCard>
      )}
    </div>
  );
}