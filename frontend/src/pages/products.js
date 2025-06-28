// src/pages/products.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

// Icons
const FiSearch = () => <span>🔍</span>;
const FiFilter = () => <span>🔽</span>;
const FiGrid = () => <span>⊞</span>;
const FiList = () => <span>☰</span>;
const FiX = () => <span>✕</span>;
const FiChevronLeft = () => <span>‹</span>;
const FiChevronRight = () => <span>›</span>;

export default function ProductsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-asc', 'price-desc', 'date'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const itemsPerPage = 12;

  useEffect(() => {
    const isDark = false;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    
    // Get category from URL if present
    if (router.query.category) {
      setSelectedCategory(router.query.category);
    }
    
    fetchCategories();
  }, [router.query.category]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, priceRange, sortBy, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories
      setCategories([
        { _id: '1', name: 'All Products', productCount: 0 },
        { _id: '2', name: 'Fish', productCount: 25 },
        { _id: '3', name: 'Meat', productCount: 30 },
        { _id: '4', name: 'Vegetables', productCount: 50 },
        { _id: '5', name: 'Fruits', productCount: 40 },
        { _id: '6', name: 'Dairy', productCount: 15 }
      ]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && selectedCategory !== 'all' && { category: selectedCategory }),
        ...(priceRange.min > 0 && { minPrice: priceRange.min.toString() }),
        ...(priceRange.max < 1000 && { maxPrice: priceRange.max.toString() }),
        ...(sortBy && { sort: sortBy })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${params}`
      );
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback products
      setProducts([
        { _id: '1', name: 'Fresh Salmon', price: 450, originalPrice: 500, image: null, rating: 4.5, reviews: 12, inStock: true, category: 'Fish' },
        { _id: '2', name: 'Organic Apples', price: 120, originalPrice: null, image: null, rating: 4.8, reviews: 25, inStock: true, category: 'Fruits' },
        { _id: '3', name: 'Free Range Chicken', price: 280, originalPrice: 320, image: null, rating: 4.6, reviews: 18, inStock: true, category: 'Meat' },
        { _id: '4', name: 'Fresh Spinach', price: 45, originalPrice: null, image: null, rating: 4.7, reviews: 8, inStock: true, category: 'Vegetables' }
      ]);
      setTotalProducts(4);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 1000 });
    setSortBy('name');
    setCurrentPage(1);
  };

  const selectedCategoryName = categories.find(cat => cat._id === selectedCategory)?.name || 'All Products';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Head>
        <title>Products - GramBajar | Fresh Groceries Online</title>
        <meta name="description" content="Browse our wide selection of fresh groceries, organic produce, and daily essentials delivered to your door." />
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Page Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-green-50'} py-8 px-4`}>
        <div className="mx-auto max-w-7xl">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Products
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {selectedCategory ? `${selectedCategoryName} ` : ''}
            {totalProducts > 0 ? `${totalProducts} products found` : 'Browse our fresh selection'}
          </p>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              <FiFilter />
              Filters & Sort
            </button>
          </div>

          {/* Filter Sidebar */}
          <FilterSidebar
            darkMode={darkMode}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onClearFilters={clearFilters}
            showFilters={showFilters}
            onCloseFilters={() => setShowFilters(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and View Controls */}
            <div className="flex flex-col gap-4 mb-6 sm:flex-row">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                <div className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2">
                  <FiSearch />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className={`flex rounded-lg border ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${
                    viewMode === 'grid'
                      ? darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                      : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${
                    viewMode === 'list'
                      ? darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                      : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Showing {products.length} of {totalProducts} products
              {searchQuery && (
                <span> for "{searchQuery}"</span>
              )}
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(8)].map((_, index) => (
                  <div key={index} className={`animate-pulse ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } rounded-lg h-64`}></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    darkMode={darkMode}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold">No products found</h3>
                <p>Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg ${
                            page === currentPage
                              ? 'bg-green-500 text-white'
                              : darkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span key={page} className={`px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}