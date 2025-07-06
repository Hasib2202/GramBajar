import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext'; // Import the theme context

const OrderConfirmation = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get theme context
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.token) {
          throw new Error('Please login to view this order');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/user/${orderId}`,
          { headers: { 'Authorization': `Bearer ${user.token}` } }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load order');
        }

        const data = await response.json();
        setOrder(data.order);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-blue-500 rounded-full animate-spin"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your order details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md p-6 text-center rounded-lg shadow ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <h2 className="mb-4 text-xl font-bold text-red-500">Error</h2>
          <p className="mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/orders')}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              My Orders
            </button>
            <button
              onClick={() => router.push('/')}
              className={`px-4 py-2 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 mx-auto max-w-4xl ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="p-6 mb-6 text-center text-white bg-green-600 rounded-lg">
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2">Your order ID: {order._id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        {/* Order Summary */}
        <div className={`p-6 rounded-lg shadow ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4">
            {order.products.map((item, index) => {
              const product = item.productId || {};
              const hasDiscount = item.discount > 0;
              return (
                <div 
                  key={index} 
                  className={`flex items-start pb-4 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } border-b`}
                >
                  {product.images?.[0] ? (
                    <div className="mr-4">
                      <Image
                        src={product.images[0]}
                        alt={product.title || 'Product Image'}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className={`w-20 h-20 mr-4 rounded ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
                    } border-2 border-dashed`} />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product.title || 'Product unavailable'}</p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Quantity: {item.quantity}
                    </p>
                    {hasDiscount && (
                      <div className="flex items-center mt-1">
                        <p className={`mr-2 line-through ${
                          darkMode ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          ৳{item.originalPrice.toFixed(2)}
                        </p>
                        <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded">
                          {item.discount}% OFF
                        </span>
                      </div>
                    )}
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {hasDiscount ? 'Original Price: ' : 'Price: '}
                      <span className={`${hasDiscount ? 'text-green-500 font-medium' : ''}`}>
                        ৳{item.price.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
          <div className={`flex justify-between pt-4 mt-4 text-lg font-bold ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } border-t`}>
            <span>Total:</span>
            <span>৳{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className={`p-6 rounded-lg shadow ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="mb-4 text-xl font-semibold">Delivery Information</h2>
          <div className="space-y-3">
            <p><strong>Name:</strong> {order.consumerId?.name || 'N/A'}</p>
            <p><strong>Contact:</strong> {order.contact}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p>
              <strong>Status:</strong>
              <span className={`ml-2 px-3 py-1 text-sm rounded-full ${
                order.status === 'Paid' 
                  ? darkMode 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-green-100 text-green-800'
                  : order.status === 'Completed' 
                    ? darkMode 
                      ? 'bg-blue-900/30 text-blue-300' 
                      : 'bg-blue-100 text-blue-800'
                    : darkMode 
                      ? 'bg-yellow-900/30 text-yellow-300' 
                      : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </p>
            <p className={`pt-3 mt-3 text-sm ${
              darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'
            } border-t`}>
              Ordered on: {new Date(order.createdAt).toLocaleDateString('en-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link 
          href="/" 
          className={`inline-block px-6 py-2 rounded ${
            darkMode 
              ? 'bg-blue-700 text-white hover:bg-blue-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;