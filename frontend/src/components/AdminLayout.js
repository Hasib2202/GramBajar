import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import {
  FiHome, FiUsers, FiShoppingBag, FiPieChart,
  FiSettings, FiLogOut, FiMoon, FiSun,
  FiMenu, FiX,
  FiPackage,
  FiBarChart
} from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { logout } from '../utils/auth';
import { useEffect, useState } from 'react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Products', path: '/admin/products', icon: FiShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: FiPieChart },
    { name: 'Inventory', path: '/admin/inventory', icon: FiPackage },
    { name: 'Reports', path: '/admin/reports', icon: FiBarChart },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const verifyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
          {
            method: 'GET',
            credentials: 'include'
          }
        );

        if (!verifyResponse.ok) {
          let errorMessage = 'Authentication failed';

          try {
            const errorData = await verifyResponse.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // If we can't parse JSON, use default message
          }

          if (verifyResponse.status === 401) {
            errorMessage = 'Session expired, please login again';
          } else if (verifyResponse.status === 403) {
            errorMessage = 'You do not have admin privileges';
          }

          // Show error in toast immediately
          toast.error(errorMessage);

          setRedirecting(true);
          setTimeout(() => {
            localStorage.removeItem('user');
            logout();
            router.push('/login');
          }, 2000);

          return;
        }

        const data = await verifyResponse.json();

        // Check if user is admin
        if (data.user?.role !== 'Admin') {
          toast.error('You do not have admin privileges');
          setRedirecting(true);
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        setUser(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);

        // Show toast with error message
        toast.error(error.message || 'Session expired or invalid credentials');

        setRedirecting(true);

        // Clear user data and redirect after a delay
        setTimeout(() => {
          localStorage.removeItem('user');
          logout();
          router.push('/login');
        }, 2000);
      }
    };

    verifyUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (redirecting) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Redirecting to login...
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
            <span className="text-xl font-bold text-indigo-400">GramBajar Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 md:hidden hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="px-2 mt-5">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} passHref>
              <div className={`flex items-center px-4 py-3 rounded-lg mb-1 cursor-pointer transition-all ${router.pathname === item.path
                  ? (darkMode ? 'bg-indigo-900 text-indigo-100' : 'bg-indigo-50 text-indigo-700')
                  : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                }`}>
                <item.icon className="mr-3" size={18} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'
              }`}
          >
            <FiLogOut className="mr-3" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Topbar */}
        <header className={`shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 md:hidden focus:outline-none"
            >
              <FiMenu size={24} />
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden bg-gray-200 rounded-full">
                  {user?.image ? (
                    <img src={user.image} alt="User" className="object-cover w-full h-full" />
                  ) : (
                    <div className={`flex items-center justify-center w-full h-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'
                      }`}>
                      <span className="text-xs font-bold uppercase">
                        {user?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">
                  {user?.name || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 p-6 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;