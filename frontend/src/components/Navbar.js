// components/Navbar.js
import { useState, useEffect } from 'react';
import UserDropdown from './UserDropdown';


// Simple icon components
const FiLeaf = () => <span>🌱</span>;
const FiSun = () => <span>☀️</span>;
const FiMoon = () => <span>🌙</span>;
const FiMenu = () => <span>☰</span>;
const FiX = () => <span>✕</span>;
const FiShoppingCart = () => <span>🛒</span>;
const FiUser = () => <span>👤</span>;

export default function Navbar({ darkMode, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <nav className={`sticky top-0 z-50 py-4 px-6 shadow-lg transition-all duration-500 ${
      darkMode ? 'bg-gray-800 backdrop-blur-md' : 'bg-white backdrop-blur-md'
    }`}>
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        {/* Logo */}
        <div className="flex items-center">
          <div className="mr-0 text-3xl text-green-500"><FiLeaf /></div>
          <h1 className={`text-2xl font-bold mr-2   ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
            GramBajar
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="items-center hidden space-x-8 lg:flex">
          <a href="/" className={`font-medium hover:text-green-500 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Home</a>
          <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Products</a>
          <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Categories</a>
          <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>About</a>
          <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>FAQs</a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all hover:scale-110 ${
              darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Cart */}
          <button className={`p-2 rounded-full relative transition-all hover:scale-110 ${
            darkMode ? 'bg-gray-700 text-green-400 hover:bg-gray-600' : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}>
            <FiShoppingCart />
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
              0
            </span>
          </button>

          {/* User Account */}
          {!loading && (
            user ? (
              <UserDropdown user={user} darkMode={darkMode} />
            ) : (
              <a href="/login" className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}>
                <FiUser />
                <span>Sign In</span>
              </a>
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
            <a href="/" className={`font-medium hover:text-green-500 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Home</a>
            <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Products</a>
            <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Categories</a>
            <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>About</a>
            <a href="#" className={`font-medium hover:text-green-500 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>FAQs</a>
            
            {!user && (
              <a href="/login" className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all w-fit ${
                darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}>
                <FiUser />
                <span>Sign In</span>
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}