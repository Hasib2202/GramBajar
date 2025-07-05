import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import { 
  FiArrowLeft, FiTruck, FiDollarSign, 
  FiClock, FiCheck, FiXCircle
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';

const AdminOrderDetails = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user?.token;
        
        if (!token) {
          throw new Error('Session expired, please login again');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/orders/admin/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load order details');
        }

        const data = await response.json();
        console.log('Raw order data received:', JSON.stringify(data.order, null, 2));
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  // Enhanced amount formatting function
  const formatAmount = (amount) => {
    try {
      if (amount === null || amount === undefined || amount === '') {
        return '৳0.00';
      }
      
      let value = amount;
      
      // Handle MongoDB Decimal128 objects
      if (typeof value === 'object' && value !== null) {
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
      
      // Clean string values
      if (typeof value === 'string') {
        value = value.replace(/[^0-9.-]/g, '');
      }
      
      const numericValue = parseFloat(value);
      
      if (isNaN(numericValue)) {
        console.warn('Invalid amount value:', amount);
        return '৳0.00';
      }
      
      return `৳${numericValue.toFixed(2)}`;
    } catch (error) {
      console.error('Error formatting amount:', amount, error);
      return '৳0.00';
    }
  };

  // Get the correct price for a product item
  const getProductPrice = (item) => {
    console.log('Getting price for item:', item);
    
    // Priority order: item.price -> item.originalPrice -> productId.price
    let price = 0;
    
    if (item.price !== undefined && item.price !== null) {
      price = item.price;
    } else if (item.originalPrice !== undefined && item.originalPrice !== null) {
      price = item.originalPrice;
    } else if (item.productId && item.productId.price !== undefined && item.productId.price !== null) {
      price = item.productId.price;
    }
    
    // Handle MongoDB Decimal128 if needed
    if (typeof price === 'object' && price !== null && price.$numberDecimal) {
      price = parseFloat(price.$numberDecimal);
    } else {
      price = parseFloat(price) || 0;
    }
    
    console.log(`Final price for ${item.productId?.title || 'Unknown'}: ${price}`);
    return price;
  };

  // Get the original price for discount calculation
  const getOriginalPrice = (item) => {
    let originalPrice = 0;
    
    if (item.originalPrice !== undefined && item.originalPrice !== null) {
      originalPrice = item.originalPrice;
    } else if (item.productId && item.productId.price !== undefined && item.productId.price !== null) {
      originalPrice = item.productId.price;
    } else if (item.price !== undefined && item.price !== null) {
      originalPrice = item.price;
    }
    
    // Handle MongoDB Decimal128 if needed
    if (typeof originalPrice === 'object' && originalPrice !== null && originalPrice.$numberDecimal) {
      originalPrice = parseFloat(originalPrice.$numberDecimal);
    } else {
      originalPrice = parseFloat(originalPrice) || 0;
    }
    
    return originalPrice;
  };

  // Calculate subtotal from all products
  const calculateSubtotal = () => {
    if (!order || !order.products || !Array.isArray(order.products)) {
      return 0;
    }
    
    try {
      const subtotal = order.products.reduce((sum, item) => {
        const originalPrice = getOriginalPrice(item);
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = originalPrice * quantity;
        
        console.log(`Item: ${item.productId?.title || 'Unknown'}, Original Price: ${originalPrice}, Qty: ${quantity}, Total: ${itemTotal}`);
        
        return sum + itemTotal;
      }, 0);
      
      console.log('Calculated subtotal:', subtotal);
      return subtotal;
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return 0;
    }
  };

  // Calculate total discount
  const calculateDiscount = () => {
    try {
      const subtotal = calculateSubtotal();
      let totalAmount = 0;
      
      if (order?.totalAmount !== undefined && order?.totalAmount !== null) {
        if (typeof order.totalAmount === 'object' && order.totalAmount.$numberDecimal) {
          totalAmount = parseFloat(order.totalAmount.$numberDecimal) || 0;
        } else {
          totalAmount = parseFloat(order.totalAmount) || 0;
        }
      }
      
      const discount = Math.max(0, subtotal - totalAmount);
      console.log(`Subtotal: ${subtotal}, Total: ${totalAmount}, Discount: ${discount}`);
      return discount;
    } catch (error) {
      console.error('Error calculating discount:', error);
      return 0;
    }
  };

  // Get the final order total
  const getOrderTotal = () => {
    if (!order || order.totalAmount === undefined || order.totalAmount === null) {
      return 0;
    }
    
    let totalAmount = 0;
    
    if (typeof order.totalAmount === 'object' && order.totalAmount.$numberDecimal) {
      totalAmount = parseFloat(order.totalAmount.$numberDecimal) || 0;
    } else {
      totalAmount = parseFloat(order.totalAmount) || 0;
    }
    
    console.log('Order total:', totalAmount);
    return totalAmount;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock className="text-amber-500" />;
      case 'Paid': return <FiDollarSign className="text-blue-500" />;
      case 'Completed': return <FiCheck className="text-green-500" />;
      case 'Cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiClock />;
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
            <h2 className={`mb-2 text-xl font-bold ${darkMode ? 'text-red-200' : 'text-red-600'}`}>Error</h2>
            <p className={`mb-4 ${darkMode ? 'text-red-100' : 'text-red-700'}`}>{error}</p>
            <button
              onClick={() => router.back()}
              className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Order not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <button
          onClick={() => router.back()}
          className={`flex items-center mb-4 ${darkMode ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-800'}`}
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center">
            <span className="mr-2">{getStatusIcon(order.status)}</span>
            <span className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
          {/* Order Summary */}
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`mb-4 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Order Summary
            </h2>
            <div className="divide-y dark:divide-gray-700">
              {order.products && order.products.length > 0 ? (
                order.products.map((item, index) => {
                  const product = item.productId || {};
                  const currentPrice = getProductPrice(item);
                  const originalPrice = getOriginalPrice(item);
                  const hasDiscount = item.discount && item.discount > 0;
                  const quantity = parseInt(item.quantity) || 1;
                  
                  return (
                    <div key={index} className={`py-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <div className="flex justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {product.title || 'Product unavailable'}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Qty: {quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          {hasDiscount && originalPrice > currentPrice && (
                            <p className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {formatAmount(originalPrice)}
                            </p>
                          )}
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatAmount(currentPrice)}
                          </p>
                        </div>
                      </div>
                      {hasDiscount && (
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-xs rounded ${
                            darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.discount}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-4">
                  <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No products found in this order
                  </p>
                </div>
              )}
            </div>
            
            {/* Order Totals */}
            <div className={`pt-4 mt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`flex justify-between py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>Subtotal:</span>
                <span>{formatAmount(calculateSubtotal())}</span>
              </div>
              <div className={`flex justify-between py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>Discount:</span>
                <span className={`${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                  -{formatAmount(calculateDiscount())}
                </span>
              </div>
              <div className={`flex justify-between py-2 font-bold text-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span>Total:</span>
                <span>{formatAmount(getOrderTotal())}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`mb-4 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Customer Information
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p><strong className="font-medium">Name:</strong> {order.consumerId?.name || 'Guest'}</p>
                <p><strong className="font-medium">Email:</strong> {order.consumerId?.email || 'N/A'}</p>
                <p><strong className="font-medium">Contact:</strong> {order.contact || 'N/A'}</p>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`mb-4 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Delivery Information
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p><strong className="font-medium">Address:</strong> {order.address || 'N/A'}</p>
                <p className="flex items-center">
                  <strong className="mr-2 font-medium">Status:</strong>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`mb-4 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Order Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <FiCheck className={darkMode ? "text-green-400" : "text-green-500"} />
                </div>
                <div className={`w-0.5 h-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mt-2`}></div>
              </div>
              <div className="pb-4">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Placed</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <FiDollarSign className={darkMode ? "text-blue-400" : "text-blue-500"} />
                </div>
                <div className={`w-0.5 h-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mt-2`}></div>
              </div>
              <div className="pb-4">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Payment Confirmed</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {order.status !== 'Pending' 
                    ? new Date(order.updatedAt).toLocaleDateString() + ' at ' +
                      new Date(order.updatedAt).toLocaleTimeString()
                    : 'Pending'}
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <FiTruck className={darkMode ? "text-gray-400" : "text-gray-500"} />
                </div>
              </div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delivered</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {order.status === 'Completed' 
                    ? new Date(order.updatedAt).toLocaleDateString() + ' at ' +
                      new Date(order.updatedAt).toLocaleTimeString()
                    : 'In progress'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;