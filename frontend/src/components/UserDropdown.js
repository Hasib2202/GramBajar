// components/UserDropdown.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiSettings, FiLogOut, FiUser, FiShoppingCart, FiEdit, FiLock } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { getUser, logout } from '../utils/auth';

const UserDropdown = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      // 1️⃣ Immediate check for token in localStorage
      const stored = localStorage.getItem("user");
      if (!stored) {
        router.replace("/login");
        return;
      }

      const { token } = JSON.parse(stored);
      if (!token) {
        router.replace("/login");
        return;
      }

      // 2️⃣ Fetch profile
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profileDetails`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          throw new Error("Not authorized");
        }

        const data = await res.json();
        setLocalUser(data);

        // Add cache busting to image URL
        if (data.image) {
          setImageUrl(`${data.image}?${Date.now()}`);
        }
      } catch (err) {
        console.error(err);
        // 3️⃣ On any error (401, network), clear and redirect
        localStorage.removeItem("user");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

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

  // Handle image error
  const handleImageError = () => {
    if (localUser?.image) {
      const updatedUser = { ...localUser, image: '' };
      setLocalUser(updatedUser);
      setImageUrl('');

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleLogout = async () => {
    // try {
    //   await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
    // } catch (error) {
    //   console.error('Logout failed:', error);
    // } finally {
    //   localStorage.removeItem('user');
    //   router.replace('/');
    // }
    await logout();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10 overflow-hidden transition-all duration-200 border-2 border-green-500 rounded-full">
        <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-green-100'
          }`}>
          <div className="w-4 h-4 border-t-2 border-green-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!localUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 overflow-hidden transition-all duration-200 border-2 border-green-500 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 hover:border-green-400"
        aria-label="User menu"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={localUser.name || 'User Profile'}
            className="object-cover w-full h-full rounded-full"
            onError={handleImageError}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${darkMode ? 'bg-gray-700 text-green-400' : 'bg-green-100 text-green-600'
            }`}>
            {localUser.name ? getUserInitials(localUser.name) : <FiUser size={20} />}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-1 z-50 transform transition-all duration-200 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>

            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={localUser.name || 'User Profile'}
                      className="object-cover w-full h-full"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${darkMode ? 'bg-gray-700 text-green-400' : 'bg-green-100 text-green-600'
                      }`}>
                      {localUser.name ? getUserInitials(localUser.name) : <FiUser size={20} />}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                    {localUser.name || 'User'}
                  </p>
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'
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
                className={`flex items-center px-4 py-2 text-sm transition-colors ${darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <FiSettings className="w-4 h-4 mr-3" />
                Profile Settings
              </Link>

              <Link
                href="/profile"
                className={`flex items-center px-4 py-2 text-sm transition-colors ${darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <FiShoppingCart className="w-4 h-4 mr-3" />
                My Orders
              </Link>

              <Link
                href="/profile"
                className={`flex items-center px-4 py-2 text-sm transition-colors ${darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <FiLock className="w-4 h-4 mr-2" />
                Change Password
              </Link>

              <Link
                href="/profile"
                className={`flex items-center px-4 py-2 text-sm transition-colors ${darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>

              <button
                onClick={handleLogout}
                className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${darkMode
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