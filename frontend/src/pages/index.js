// src/pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';
import ProductCard from '../components/ProductCard'; // New component for product cards

// Simple icon components
const FiLeaf = () => <span>🌱</span>;
const FiTruck = () => <span>🚚</span>;
const FiClock = () => <span>⏰</span>;
const FiShield = () => <span>🛡️</span>;
const FiStar = () => <span>⭐</span>;
const FiArrowRight = () => <span>→</span>;
const FiHeart = () => <span>❤️</span>;
const FiArrowLeft = () => <span>←</span>;

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Category pagination state
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(6); // Show 12 categories per page
  const [categoriesTotalPages, setCategoriesTotalPages] = useState(1);

  useEffect(() => {
    const isDark = false;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);

    // Fetch data from APIs
    fetchCategories();
    fetchLatestProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/categories`
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        // Calculate total pages for categories
        setCategoriesTotalPages(Math.ceil(data.categories.length / categoriesPerPage));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback data if API fails
      const fallbackCategories = [
        { _id: '1', name: 'Fish', icon: '🐟', productCount: 25 },
        { _id: '2', name: 'Meat', icon: '🥩', productCount: 30 },
        { _id: '3', name: 'Vegetables', icon: '🥕', productCount: 50 },
        { _id: '4', name: 'Milk and Egg', icon: '🥛', productCount: 15 },
        { _id: '5', name: 'Fruits', icon: '🍎', productCount: 40 },
        { _id: '6', name: 'Cooking Essentials', icon: '🧄', productCount: 35 },
        { _id: '7', name: 'Bakery', icon: '🥖', productCount: 27 },
        { _id: '8', name: 'Beverages', icon: '🥤', productCount: 48 },
        { _id: '9', name: 'Snacks', icon: '🍿', productCount: 65 },
        { _id: '10', name: 'Organic Products', icon: '🌿', productCount: 32 },
        { _id: '11', name: 'Dairy Alternatives', icon: '🥛', productCount: 22 },
        { _id: '12', name: 'Frozen Foods', icon: '❄️', productCount: 38 },
        { _id: '13', name: 'Spices', icon: '🌶️', productCount: 45 },
        { _id: '14', name: 'Canned Goods', icon: '🥫', productCount: 52 },
        { _id: '15', name: 'Condiments', icon: '🍶', productCount: 41 },
        { _id: '16', name: 'Grains & Rice', icon: '🌾', productCount: 37 },
      ];
      setCategories(fallbackCategories);
      setCategoriesTotalPages(Math.ceil(fallbackCategories.length / categoriesPerPage));
    }
  };

  const fetchLatestProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/products?page=${page}&limit=6`
      );
      const data = await response.json();
      if (data.success) {
        setLatestProducts(data.products);
        setTotalPages(data.pages);
        setCurrentPage(data.page);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback data if API fails
      setLatestProducts([
        { _id: '1', title: 'Frozen Shrimp 300g', price: 200, discount: null, images: '/images/products/shrimp.jpg', rating: 4.5, reviews: 2, stock: 10 },
        { _id: '2', title: 'Frozen Shrimp 2kg', price: 400, discount: 24, images: '/images/products/shrimp-2kg.jpg', rating: 4.0, reviews: 1, stock: 5 },
        { _id: '3', title: 'Frozen Spinach 500g', price: 300, discount: 3, images: '/images/products/spinach.jpg', rating: 4.5, reviews: 2, stock: 15 },
        { _id: '4', title: 'Mangosteen Organic 500g', price: 25, discount: null, images: '/images/products/mangosteen.jpg', rating: 5.0, reviews: 1, stock: 20 },
        { _id: '5', title: 'Chicken 1 KG', price: 200, discount: 18, images: '/images/products/chicken.jpg', rating: 4.5, reviews: 1, stock: 8 },
        { _id: '6', title: 'Fresh Tomatoes 1kg', price: 50, discount: 10, images: '/images/products/tomatoes.jpg', rating: 4.8, reviews: 5, stock: 30 }
      ]);
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('latest-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToFAQs = () => {
    window.location.href = '/faqs';
  };

  const navigateToProducts = (categoryId = null) => {
    const url = categoryId ? `/products?category=${categoryId}` : '/products';
    window.location.href = url;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchLatestProducts(newPage);
      scrollToProducts();
    }
  };

  // Get current categories for pagination
  const indexOfLastCategory = categoriesCurrentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Change categories page
  const paginateCategories = (pageNumber) => {
    setCategoriesCurrentPage(pageNumber);
    // Scroll to categories section
    const categoriesSection = document.getElementById('popular-categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Head>
        <title>GramBajar - Fresh & Healthy Groceries Delivered Daily</title>
        <meta name="description" content="100% Organic Produce. Fresh & Healthy Groceries Delivered Daily. Experience farm-fresh convenience." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Hero Section with Image Carousel */}
      <section className={`relative py-16 px-4 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-200 text-green-800'
                }`}>
                <FiLeaf />
                <span className="ml-2">100% Organic Produce</span>
              </div>

              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Fresh & Healthy{' '}
                <span className="text-green-500">Groceries</span>{' '}
                <br />Delivered Daily
              </h1>

              <p className={`text-lg max-w-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Experience the convenience of having farm-fresh produce and premium groceries delivered right to your doorstep. Quality you can trust, service you can rely on.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <FiLeaf />, text: 'Fresh & Organic' },
                  { icon: <FiTruck />, text: 'Free Delivery' },
                  { icon: <FiClock />, text: 'Express Delivery' }
                ].map((feature, index) => (
                  <div key={index} className={`flex items-center px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 shadow-md'
                    }`}>
                    <span className="mr-2 text-green-500">{feature.icon}</span>
                    {feature.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={scrollToProducts}
                  className="px-8 py-4 font-semibold text-white transition-all transform bg-green-500 shadow-lg hover:bg-green-600 rounded-xl hover:scale-105"
                >
                  Shop Now <FiArrowRight />
                </button>
                <button
                  onClick={navigateToFAQs}
                  className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all ${darkMode
                    ? 'border-green-500 text-green-400 hover:bg-green-900'
                    : 'border-green-500 text-green-600 hover:bg-green-50'
                    }`}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative">
              <ImageCarousel darkMode={darkMode} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose GramBajar
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We're committed to providing the freshest produce and the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <FiTruck />, title: 'Free Delivery', desc: 'Free shipping on orders above BDT 50' },
              { icon: <FiClock />, title: 'Express Delivery', desc: 'Same day delivery available' },
              { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure payment methods' },
              { icon: <FiLeaf />, title: 'Fresh Products', desc: '100% organic & fresh items' }
            ].map((feature, index) => (
              <div key={index} className={`p-6 rounded-2xl text-center transition-all hover:scale-105 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-50 hover:bg-green-100'
                }`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-200 text-green-600'
                  }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories - From Database */}
      <section id="popular-categories" className={`py-16 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-4 mb-12 md:flex-row md:items-center">
            {/* Left: Title + Subtitle */}
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Popular Categories
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Browse through our extensive selection of fresh categories
              </p>
            </div>

            {/* Right: View All + Pagination */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateToProducts()}
                className="items-center hidden font-semibold text-green-500 md:inline-flex hover:text-green-600"
              >
                View All <FiArrowRight className="ml-1" />
              </button>

              {/* Categories Pagination Controls */}
              {categoriesTotalPages > 1 && (
                <div className={`flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <button
                    onClick={() => paginateCategories(categoriesCurrentPage - 1)}
                    disabled={categoriesCurrentPage === 1}
                    className={`p-2 rounded-full ${categoriesCurrentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <FiArrowLeft size={20} />
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, categoriesTotalPages) }, (_, i) => {
                      let pageNum;
                      if (categoriesTotalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        // Show dynamic page numbers for many pages
                        const startPage = Math.max(1, Math.min(categoriesCurrentPage - 2, categoriesTotalPages - 4));
                        pageNum = startPage + i;
                      }
                      return pageNum;
                    }).map(page => (
                      <button
                        key={page}
                        onClick={() => paginateCategories(page)}
                        className={`w-8 h-8 rounded-full text-sm ${page === categoriesCurrentPage
                            ? 'bg-green-500 text-white'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    {categoriesTotalPages > 5 && categoriesCurrentPage < categoriesTotalPages - 2 && (
                      <span className="mx-1">...</span>
                    )}
                  </div>

                  <button
                    onClick={() => paginateCategories(categoriesCurrentPage + 1)}
                    disabled={categoriesCurrentPage === categoriesTotalPages}
                    className={`p-2 rounded-full ${categoriesCurrentPage === categoriesTotalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <FiArrowRight size={20} />
                  </button>

                  <span className="text-sm">
                    Page {categoriesCurrentPage} of {categoriesTotalPages}
                  </span>
                </div>
              )}
            </div>
          </div>


          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {currentCategories.map((category) => (
              <div
                key={category._id}
                onClick={() => navigateToProducts(category._id)}
                className={`p-6 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-lg'
                  }`}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-16 h-16 mx-auto mb-3 rounded-full"
                  />
                ) : (
                  <div className="mb-3 text-4xl">{category.icon || '📦'}</div>
                )}
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.productCount || 0}+ items
                </p>
              </div>
            ))}
          </div>

          {/* View All Categories Button */}
          {/* <div className="flex justify-center mt-12">
            <button
              onClick={() => navigateToProducts()}
              className={`px-8 py-3 font-semibold rounded-lg ${darkMode
                  ? 'bg-gray-800 text-green-400 hover:bg-gray-700'
                  : 'bg-white text-green-600 hover:bg-gray-100 shadow-md'
                }`}
            >
              View All Categories
            </button>
          </div> */}
        </div>
      </section>

      {/* Latest Products - From Database */}
      <section id="latest-products" className={`py-16 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Latest Products
            </h2>
            <button
              onClick={() => navigateToProducts()}
              className="flex items-center font-semibold text-green-500 hover:text-green-600"
            >
              View All <FiArrowRight />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className={`rounded-2xl overflow-hidden shadow-lg animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                  <div className="bg-gray-300 aspect-square"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {latestProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    darkMode={darkMode}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className={`flex justify-center items-center mt-12 space-x-4 ${darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <FiArrowLeft size={24} />
                  </button>

                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        // Show dynamic page numbers for many pages
                        const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                        pageNum = startPage + i;
                      }
                      return pageNum;
                    }).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full ${page === currentPage
                          ? 'bg-green-500 text-white'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="mx-1">...</span>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <FiArrowRight size={24} />
                  </button>

                  <span className="ml-4">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl p-12 ${darkMode ? 'bg-gradient-to-r from-green-800 to-green-700' : 'bg-white bg-opacity-10 backdrop-blur-md'}`}>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Limited Offer - Special Deal!
            </h2>
            <p className="mb-8 text-xl text-green-100">
              Get up to 30% off on all fresh fruits and vegetables
            </p>
            <button
              onClick={() => navigateToProducts()}
              className={`px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${darkMode
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-50'
                }`}
            >
              Shop Now & Save
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { number: '1000+', label: 'Happy Customers' },
              { number: '500+', label: 'Fresh Products' },
              { number: '50+', label: 'Local Farmers' },
              { number: '24/7', label: 'Customer Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {stat.number}
                </div>
                <div className={`text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gray-900' : 'bg-green-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to experience fresh groceries?
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of customers who trust GramBajar for their daily grocery needs.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigateToProducts()}
              className="px-8 py-4 font-semibold text-white transition-all transform bg-green-500 shadow-lg hover:bg-green-600 rounded-xl hover:scale-105"
            >
              Start Shopping Now
            </button>
            <button className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all ${darkMode
              ? 'border-green-500 text-green-400 hover:bg-green-900'
              : 'border-green-500 text-green-600 hover:bg-green-50'
              }`}>
              Download App
            </button>
          </div>
        </div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  );
}