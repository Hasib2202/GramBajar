// src/pages/orderConfirmation/[orderId].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getOrderDetails } from '../../lib/api/orderApi';

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
        const orderData = await getOrderDetails(orderId);
        setOrder(orderData);
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 rounded-full spinner-border animate-spin" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-4 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl min-h-screen p-4 mx-auto">
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="p-6 text-center text-white bg-green-600">
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="mt-2">Thank you for your order #{order._id}</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b">Order Summary</h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.productId?.title || 'Product'}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4 mt-6 text-lg font-bold border-t">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div>
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b">Delivery Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {order.consumerId?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {order.consumerId?.email || 'N/A'}</p>
                <p><strong>Contact:</strong> {order.contact}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p className="mt-4">
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded ${
                    order.status === 'Paid' ? 'bg-green-200 text-green-800' : 
                    order.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <p className="mt-6 text-gray-600">
                We've sent a confirmation email with your order details.
                You can track your order status in your account.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/" className="inline-block px-6 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;