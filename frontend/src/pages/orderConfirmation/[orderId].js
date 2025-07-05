import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const OrderConfirmation = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 text-center bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-bold text-red-600">Error</h2>
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
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl min-h-screen p-4 mx-auto">
      <div className="p-6 mb-6 text-center text-white bg-green-600 rounded-lg">
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2">Your order ID: {order._id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        {/* Order Summary */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4">
            {order.products.map((item, index) => {
              const product = item.productId || {};
              const hasDiscount = item.discount > 0;
              return (
                <div key={index} className="flex items-start pb-4 border-b">
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
                    <div className="w-20 h-20 mr-4 bg-gray-200 border-2 border-dashed rounded" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product.title || 'Product unavailable'}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    {hasDiscount && (
                      <div className="flex items-center mt-1">
                        <p className="mr-2 text-gray-600 line-through">
                          ৳{item.originalPrice.toFixed(2)}
                        </p>
                        <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded">
                          {item.discount}% OFF
                        </span>
                      </div>
                    )}
                    <p className="text-gray-600">
                      {hasDiscount ? 'Original Price: ' : 'Price: '}
                      <span className={`${hasDiscount ? 'text-green-600 font-medium' : ''}`}>
                        ৳{item.price.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between pt-4 mt-4 text-lg font-bold border-t">
            <span>Total:</span>
            <span>৳{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">Delivery Information</h2>
          <div className="space-y-3">
            <p><strong>Name:</strong> {order.consumerId?.name || 'N/A'}</p>
            <p><strong>Contact:</strong> {order.contact}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p>
              <strong>Status:</strong>
              <span className={`ml-2 px-3 py-1 text-sm rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-800' :
                order.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                {order.status}
              </span>
            </p>
            <p className="pt-3 mt-3 text-sm text-gray-600 border-t">
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
        <Link href="/" className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;