// src/pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Simple icon components
const FiLeaf = () => <span>🌱</span>;
const FiTruck = () => <span>🚚</span>;
const FiClock = () => <span>⏰</span>;
const FiShield = () => <span>🛡️</span>;
const FiDollarSign = () => <span>💰</span>;
const FiStar = () => <span>⭐</span>;
const FiArrowRight = () => <span>→</span>;
const FiHeart = () => <span>❤️</span>;

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Remove localStorage usage
    const isDark = false; // Default to light mode
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Remove localStorage usage
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Sample product data
  const featuredProducts = [
    { id: 1, name: 'Frozen Shrimp 300g', price: 200, originalPrice: null, image: '🦐', rating: 4.5, reviews: 2, inStock: true, discount: null },
    { id: 2, name: 'Frozen Shrimp 2kg', price: 304, originalPrice: 400, image: '🦐', rating: 4.0, reviews: 1, inStock: true, discount: 24 },
    { id: 3, name: 'Frozen Spinach 500g', price: 291, originalPrice: 300, image: '🥬', rating: 4.5, reviews: 2, inStock: true, discount: 3 },
    { id: 4, name: 'Mangosteen Organic 500g', price: 25, originalPrice: null, image: '🥭', rating: 5.0, reviews: 1, inStock: true, discount: null },
    { id: 5, name: 'Chicken 1 KG', price: 164, originalPrice: 200, image: '🐔', rating: 4.5, reviews: 1, inStock: true, discount: 18 },
    { id: 6, name: 'Fresh Tomatoes 1kg', price: 45, originalPrice: 50, image: '🍅', rating: 4.8, reviews: 5, inStock: true, discount: 10 }
  ];

  const categories = [
    { name: 'Fish', icon: '🐟', count: '25+ items' },
    { name: 'Meat', icon: '🥩', count: '30+ items' },
    { name: 'Vegetables', icon: '🥕', count: '50+ items' },
    { name: 'Milk and Egg', icon: '🥛', count: '15+ items' },
    { name: 'Fruits', icon: '🍎', count: '40+ items' },
    { name: 'Cooking Essentials', icon: '🧄', count: '35+ items' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Head>
        <title>GramBajar - Fresh & Healthy Groceries Delivered Daily</title>
        <meta name="description" content="100% Organic Produce. Fresh & Healthy Groceries Delivered Daily. Experience farm-fresh convenience." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className={`relative py-16 px-4 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                darkMode ? 'bg-green-900 text-green-400' : 'bg-green-200 text-green-800'
              }`}>
                <FiLeaf />
                <span className="ml-2">100% Organic Produce</span>
              </div>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
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
                  <div key={index} className={`flex items-center px-4 py-2 rounded-full text-sm ${
                    darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 shadow-md'
                  }`}>
                    <span className="mr-2 text-green-500">{feature.icon}</span>
                    {feature.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="px-8 py-4 font-semibold text-white transition-all transform bg-green-500 shadow-lg hover:bg-green-600 rounded-xl hover:scale-105">
                  Shop Now <FiArrowRight />
                </button>
                <button className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all ${
                  darkMode 
                    ? 'border-green-500 text-green-400 hover:bg-green-900' 
                    : 'border-green-500 text-green-600 hover:bg-green-50'
                }`}>
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className={`absolute -top-8 -left-8 w-full h-full rounded-3xl ${
                darkMode ? 'bg-green-800 opacity-20' : 'bg-green-200'
              }`}></div>
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${
                darkMode ? 'border border-gray-700' : 'border border-green-100'
              }`}>
                <div className="flex items-center justify-center aspect-square bg-gradient-to-br from-green-400 to-green-600">
                  <div className="text-center text-white">
                    <div className="mb-4 text-6xl">🥕🍅🥬</div>
                    <h3 className="text-2xl font-bold">Farm Fresh</h3>
                    <p className="opacity-90">Directly from farms</p>
                  </div>
                </div>
              </div>
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
              <div key={index} className={`p-6 rounded-2xl text-center transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-50 hover:bg-green-100'
              }`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${
                  darkMode ? 'bg-green-900 text-green-400' : 'bg-green-200 text-green-600'
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

      {/* Popular Categories */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Popular Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <div key={index} className={`p-6 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-lg'
              }`}>
                <div className="mb-3 text-4xl">{category.icon}</div>
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Latest Products
            </h2>
            <button className="flex items-center font-semibold text-green-500 hover:text-green-600">
              View All <FiArrowRight />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((product) => (
              <div key={product.id} className={`rounded-2xl overflow-hidden shadow-lg transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                {product.discount && (
                  <div className="absolute z-10 px-2 py-1 text-sm font-bold text-white bg-red-500 rounded-lg top-4 left-4">
                    -{product.discount}%
                  </div>
                )}
                
                <div className={`aspect-square flex items-center justify-center text-6xl ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-100'
                }`}>
                  {product.image}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm px-2 py-1 rounded ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <button className="text-gray-400 hover:text-red-500">
                      <FiHeart />
                    </button>
                  </div>
                  
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          <FiStar />
                        </span>
                      ))}
                    </div>
                    <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ৳{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <button className={`px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              darkMode 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}>
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
            <button className="px-8 py-4 font-semibold text-white transition-all transform bg-green-500 shadow-lg hover:bg-green-600 rounded-xl hover:scale-105">
              Start Shopping Now
            </button>
            <button className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all ${
              darkMode 
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