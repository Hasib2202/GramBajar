// components/UserDropdown.js - Enhanced version with better image handling
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import ImageWithFallback from './ImageWithFallback';

const UserDropdown = ({ user, darkMode, onUserUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const dropdownRef = useRef(null);

  // Update local user when prop changes
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle image error - update local state and localStorage
  const handleImageError = () => {
    if (localUser?.image) {
      const updatedUser = { ...localUser, image: '' };
      setLocalUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Notify parent component if callback provided
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Clear user data regardless of response status
      localStorage.removeItem('user');
      
      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.warn('Logout request failed, but user data cleared locally');
      }
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local data and redirect on network error
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  // Get user initials for fallback
  const getUserInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fallback component for profile image
  const ProfileImageFallback = () => (
    <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${
      darkMode ? 'bg-gray-700 text-green-400' : 'bg-green-100 text-green-600'
    }`}>
      {localUser?.name ? getUserInitials(localUser.name) : <FiUser size={20} />}
    </div>
  );

  if (!localUser) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 overflow-hidden transition-all duration-200 border-2 border-green-500 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 hover:border-green-400"
        aria-label="User menu"
      >
        <ImageWithFallback
          src={localUser.image}
          alt={localUser.name || 'User Profile'}
          className="object-cover w-full h-full rounded-full"
          fallback={<ProfileImageFallback />}
          onError={handleImageError}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-1 z-50 transform transition-all duration-200 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full">
                  <ImageWithFallback
                    src={localUser.image}
                    alt={localUser.name || 'User Profile'}
                    className="object-cover w-full h-full"
                    fallback={<ProfileImageFallback />}
                    onError={handleImageError}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {localUser.name || 'User'}
                  </p>
                  <p className={`text-xs truncate ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {localUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/profile"
                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiSettings className="w-4 h-4 mr-3" />
                Profile Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FiLogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;