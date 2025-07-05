import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  FiSearch, FiFilter, FiX, FiDollarSign, 
  FiTruck, FiCheck, FiXCircle, FiClock, FiEye
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [limit] = useState(10);
  const { darkMode } = useTheme();

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const fetchOrders = async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/orders/admin?page=${page}&limit=${limit}`;
      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.pages);
      setTotalOrders(data.total);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchQuery, statusFilter);
  }, [currentPage, searchQuery, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(1, searchQuery, statusFilter);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/orders/admin/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const data = await response.json();
      
      toast.success(
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
              <FiCheck className="text-green-500" />
            </div>
          </div>
          <div>
            <p className="font-semibold">Order Updated</p>
            <p className="text-sm">Status changed to {newStatus}</p>
          </div>
        </div>,
        { duration: 3000 }
      );
      
      // Update the order in the list
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        <div>
          <p className="font-semibold">Update Failed</p>
          <p className="text-sm">{error.message || 'Failed to update order status'}</p>
        </div>
      );
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiClock className="text-amber-500" />;
      case 'Paid':
        return <FiDollarSign className="text-blue-500" />;
      case 'Completed':
        return <FiCheck className="text-green-500" />;
      case 'Cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Fixed amount formatting with comprehensive error handling
  const formatAmount = (amount) => {
    try {
      // Handle null, undefined, or empty values
      if (amount === null || amount === undefined || amount === '') {
        return '৳0.00';
      }
      
      let value = amount;
      
      // Handle MongoDB Decimal128 or other object types
      if (typeof value === 'object' && value !== null) {
        // Check if it has a $numberDecimal property (MongoDB Decimal128)
        if (value.$numberDecimal) {
          value = value.$numberDecimal;
        } else if (value.toString && typeof value.toString === 'function') {
          value = value.toString();
        } else if (value.valueOf && typeof value.valueOf === 'function') {
          value = value.valueOf();
        } else {
          console.warn('Unknown object type for amount:', amount);
          return '৳0.00';
        }
      }
      
      // If it's a string, clean it up
      if (typeof value === 'string') {
        // Remove any non-numeric characters except decimal point and minus sign
        value = value.replace(/[^0-9.-]/g, '');
      }
      
      // Convert to number
      const numericValue = parseFloat(value);
      
      // Validate the number
      if (isNaN(numericValue)) {
        console.warn('Invalid amount value:', amount);
        return '৳0.00';
      }
      
      // Format the number with proper decimal places
      return `৳${numericValue.toFixed(2)}`;
    } catch (error) {
      console.error('Error formatting amount:', amount, error);
      return '৳0.00';
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? 'bg-indigo-600 text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm">
          Showing {Math.min((currentPage - 1) * limit + 1, totalOrders)} to{' '}
          {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {pages}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className={`mb-6 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Order Management
        </h1>
        
        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <form onSubmit={handleSearch} className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200'
                } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <FiSearch className="absolute text-gray-400 left-3 top-3" size={18} />
            </div>
            
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 pr-8 rounded-lg appearance-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200'
                  } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiFilter className="absolute text-gray-400 pointer-events-none right-3 top-3" />
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-lg flex items-center ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <FiX size={18} />
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className={`overflow-hidden rounded-lg shadow ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Order
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              #{order._id.slice(-6).toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {order.consumerId?.name || 'Guest'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.consumerId?.email || order.contact}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {order.products?.length || 0} items
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {formatAmount(order.totalAmount)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="mr-2">{getStatusIcon(order.status)}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            <div className="flex space-x-2">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className={`px-2 py-1 rounded ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-200'
                                } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                              >
                                {statusOptions.filter(opt => opt.value !== '').map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <Link 
                                href={`/admin/orders/${order._id}`}
                                className="flex items-center justify-center p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800"
                                title="View Details"
                              >
                                <FiEye size={16} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;