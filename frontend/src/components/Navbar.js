import React, { useState, useEffect } from 'react';
import UserDropdown from './UserDropdown';
import Cart from './Cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';

// Simple icon components
const FiLeaf = () => <span>🌱</span>;
const FiSun = () => <span>☀️</span>;
const FiMoon = () => <span>🌙</span>;
const FiMenu = () => <span>☰</span>;
const FiX = () => <span>✕</span>;
const FiShoppingCart = () => <span>🛒</span>;
const FiUser = () => <span>👤</span>;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { distinctItemCount } = useCart();
  const { darkMode, toggleTheme } = useTheme();

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    setLoading(false);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-40 py-4 px-6 shadow-lg transition-all duration-500 ${
        darkMode 
          ? 'bg-gray-800 backdrop-blur-md text-white' 
          : 'bg-white backdrop-blur-md text-gray-900'
      }`}>
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="mr-0 text-3xl text-green-500"><FiLeaf /></div>
              <h1 className={`text-2xl font-bold mr-2 ${
                darkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                GramBajar
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 lg:flex">
            <Link href="/" className="font-medium transition-colors hover:text-green-500">
              Home
            </Link>
            <Link href="/products" className="font-medium transition-colors hover:text-green-500">
              Products
            </Link>
            <Link href="/categories" className="font-medium transition-colors hover:text-green-500">
              Categories
            </Link>
            <Link href="/about" className="font-medium transition-colors hover:text-green-500">
              About
            </Link>
            <Link href="/faqs" className="font-medium transition-colors hover:text-green-500">
              FAQs
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`p-2 rounded-full relative transition-all hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 text-green-400 hover:bg-gray-600' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              <FiShoppingCart />
              {distinctItemCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {distinctItemCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {!loading && (
              user ? (
                <UserDropdown user={user} />
              ) : (
                <Link href="/login" className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}>
                  <FiUser />
                  <span>Sign In</span>
                </Link>
              )
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-md ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden mt-4 pb-4 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col mt-4 space-y-4">
              <Link href="/" className="font-medium transition-colors hover:text-green-500">
                Home
              </Link>
              <Link href="/products" className="font-medium transition-colors hover:text-green-500">
                Products
              </Link>
              <Link href="/categories" className="font-medium transition-colors hover:text-green-500">
                Categories
              </Link>
              <Link href="/about" className="font-medium transition-colors hover:text-green-500">
                About
              </Link>
              <Link href="/faqs" className="font-medium transition-colors hover:text-green-500">
                FAQs
              </Link>
              
              {!user && (
                <Link href="/login" className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all w-fit ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}>
                  <FiUser />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Shopping Cart Panel */}
      <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

      {/* Toast Container */}
      <ToastContainer position="bottom-right" theme={darkMode ? 'dark' : 'light'} />
    </>
  );
}