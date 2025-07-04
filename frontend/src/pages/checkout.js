import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    address: '',
    additionalInfo: ''
  });

  // Initialize dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const handleChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Get user token
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('Please login to complete your order');
      }

      // Prepare order data
      const orderData = {
        contact: deliveryInfo.contactNumber,
        address: deliveryInfo.address,
        products: cartItems.map(item => ({
          productId: item.id,  // Use id property from cart item
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal
      };

      // Create order directly
      const createResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      const order = createResponse.data.order;
      
      // Process payment directly
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${order._id}/pay`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      // Clear cart and redirect
      clearCart();
      router.push(`/orderConfirmation/${order._id}`);
    } catch (error) {
      let errorMessage = 'Payment failed';
      
      if (error.response) {
        // Use backend error message if available
        errorMessage = error.response.data?.message || errorMessage;
        
        // Show detailed errors if available
        if (error.response.data?.errors) {
          errorMessage = error.response.data.errors.join(', ');
        }
        
        console.error('Backend error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Checkout icon SVG
  const CheckoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="inline w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

        <main className={`flex-grow ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="max-w-4xl p-4 py-8 mx-auto">
            <h1 className="flex items-center mb-8 text-3xl font-bold">
              <CheckoutIcon />
              Checkout
            </h1>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Delivery Information */}
              <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="flex items-center mb-6 text-xl font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Delivery Information
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryInfo.fullName}
                      onChange={handleChange}
                      className={`w-full p-3 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium">Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={deliveryInfo.contactNumber}
                      onChange={handleChange}
                      className={`w-full p-3 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                      required
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={deliveryInfo.email}
                      onChange={handleChange}
                      className={`w-full p-3 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium">Delivery Address</label>
                    <textarea
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleChange}
                      className={`w-full p-3 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                      rows="3"
                      required
                      placeholder="123 Apple Street, Cupertino, CA 95014"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">
                      Additional Info (Optional)
                      <span className="ml-1 text-xs opacity-70">E.g. landmark, delivery time, etc.</span>
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={deliveryInfo.additionalInfo}
                      onChange={handleChange}
                      className={`w-full p-3 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                      rows="2"
                      placeholder="Near the park, deliver after 5 PM"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-3 font-medium rounded flex items-center justify-center transition ${isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : `${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'}`
                      } text-white`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                        </svg>
                        Proceed to Payment
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className={`p-6 rounded-lg shadow-lg h-fit ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="flex items-center mb-6 text-xl font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  Order Summary
                </h2>

                <div className="pb-4 mb-4 border-b border-gray-300 dark:border-gray-600">
                  {cartItems.map((item, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.title}</span>
                        <span className="font-medium">৳{(item.discountedPrice * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="mt-1 text-sm opacity-80">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span>৳{cartTotal.toFixed(2)}</span>
                </div>

                <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">
                      Your payment is secure and encrypted. All transactions are processed through
                      secure payment gateways with 256-bit SSL encryption.
                    </p>
                  </div>
                </div>

                <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer darkMode={darkMode} />
      </div>
    </ProtectedRoute>
  );
};

export default Checkout;