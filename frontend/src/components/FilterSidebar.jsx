// components/FilterSidebar.js
import { useState, useEffect } from 'react';

// Icons
const FiX = () => <span>✕</span>;
const FiChevronDown = () => <span>⌄</span>;
const FiChevronUp = () => <span>⌃</span>;

export default function FilterSidebar({
  darkMode,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  showFilters,
  onCloseFilters
}) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true
  });

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handlePriceChange = (type, value) => {
    const newRange = { ...localPriceRange, [type]: parseInt(value) };
    setLocalPriceRange(newRange);
    
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      onPriceRangeChange(newRange);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'date', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const activeFiltersCount = [
    selectedCategory && selectedCategory !== 'all',
    localPriceRange.min > 0 || localPriceRange.max < 1000,
    sortBy !== 'name'
  ].filter(Boolean).length;

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm font-medium text-green-500 hover:text-green-600"
            >
              Clear All
            </button>
          )}
          {showFilters && (
            <button
              onClick={onCloseFilters}
              className={`lg:hidden p-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className={`border-b pb-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => toggleSection('categories')}
          className={`w-full flex items-center justify-between text-left font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Categories
          {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSections.categories && (
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!selectedCategory || selectedCategory === 'all'}
                onChange={() => onCategoryChange('')}
                className="mr-3 text-green-500 focus:ring-green-500"
              />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                All Products
              </span>
            </label>
            
            {categories.map((category) => (
              <label key={category._id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category._id}
                  checked={selectedCategory === category._id}
                  onChange={() => onCategoryChange(category._id)}
                  className="mr-3 text-green-500 focus:ring-green-500"
                />
                <span className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {category.name}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({category.productCount || 0})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className={`border-b pb-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => toggleSection('price')}
          className={`w-full flex items-center justify-between text-left font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Price Range
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Min Price
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={localPriceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
              </div>
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Max Price
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={localPriceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
              </div>
            </div>
            
            {/* Price Range Slider */}
            <div className="px-2">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={localPriceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={localPriceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
              </div>
              <div className={`flex justify-between text-sm mt-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span>৳0</span>
                <span>৳1000+</span>
              </div>
            </div>

            {/* Quick Price Filters */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Under ৳50', min: 0, max: 50 },
                { label: '৳50-৳100', min: 50, max: 100 },
                { label: '৳100-৳200', min: 100, max: 200 },
                { label: '৳200+', min: 200, max: 1000 }
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => onPriceRangeChange(range)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    localPriceRange.min === range.min && localPriceRange.max === range.max
                      ? 'bg-green-500 text-white border-green-500'
                      : darkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div>
        <button
          onClick={() => toggleSection('sort')}
          className={`w-full flex items-center justify-between text-left font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Sort By
          {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSections.sort && (
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="mr-3 text-green-500 focus:ring-green-500"
                />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (showFilters) {
    // Mobile overlay
    return (
      <div className="fixed inset-0 z-50 flex lg:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onCloseFilters}></div>
        <div className={`relative w-80 max-w-[90vw] h-full overflow-y-auto p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className={`hidden lg:block w-80 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-lg border ${
      darkMode ? 'border-gray-700' : 'border-gray-200'
    } h-fit sticky top-4`}>
      {sidebarContent}
    </div>
  );
}