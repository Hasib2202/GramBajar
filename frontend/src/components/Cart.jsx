import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

// Simple icon components
const FiX = () => <span>✕</span>;
const FiTrash = () => <span>🗑️</span>;
const FiSun = () => <span>☀️</span>;
const FiMoon = () => <span>🌙</span>;

export default function Cart({ isOpen, setIsOpen }) {
  const router = useRouter();
  const { 
    cartItems, 
    cartTotal, 
    distinctItemCount,
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();
  
  const { darkMode, toggleTheme } = useTheme();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCheckout = async () => {
    setIsRedirecting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.token) {
        // Show toast notification
        toast.info('Please Sign In to proceed to Checkout', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Delay redirect to allow toast to show
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        localStorage.setItem('redirectAfterLogin', JSON.stringify({
          path: '/checkout',
          cartItems
        }));
        await router.push('/login');
      } else {
        await router.push('/checkout');
      }
    } catch (error) {
      toast.error('Failed to redirect. Please try again.');
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleRemoveItem = (e, id) => {
    e.stopPropagation(); 
    e.preventDefault();
    removeFromCart(id);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      ></div>
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
              
              <button 
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                aria-label="Close cart"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4 text-6xl">🛒</div>
                <h3 className="mb-2 text-xl font-semibold">Your cart is empty</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add items to your cart to proceed with checkout
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4">
                  You have {distinctItemCount} {distinctItemCount === 1 ? 'item' : 'items'} in your cart
                </p>
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start">
                        {item.images && item.images.length > 0 && (
                          <div className="mr-4">
                            <img 
                              src={item.images[0]} 
                              alt={item.name} 
                              className="object-cover w-16 h-16 rounded"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.name}
                              </h3>
                              <div className="mt-1">
                                {item.discount > 0 ? (
                                  <>
                                    <span className={`text-sm mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'} line-through`}>
                                      ৳ {item.price.toFixed(2)}
                                    </span>
                                    <span className="text-green-600">
                                      ৳ {item.discountedPrice.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span>৳ {item.price.toFixed(2)}</span>
                                )}
                              </div>
                              {item.discount > 0 && (
                                <span className={`text-xs px-2 py-1 mt-1 rounded ${
                                  darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.discount}% OFF
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={(e) => handleRemoveItem(e, item.id)}
                              className={`p-2 rounded-full ${
                                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                              }`}
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <FiTrash />
                            </button>
                          </div>
                          
                          <div className="flex items-center mt-3">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={`w-8 h-8 rounded-l ${
                                darkMode ? 'bg-gray-600' : 'bg-gray-200'
                              }`}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <div className={`w-10 h-8 flex items-center justify-center ${
                                darkMode ? 'bg-gray-600 text-white' : 'bg-white'
                              }`}
                            >
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={`w-8 h-8 rounded-r ${
                                darkMode ? 'bg-gray-600' : 'bg-gray-200'
                              }`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className={`p-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">৳ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span>Total:</span>
                <span className="text-lg font-bold">৳ {cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={clearCart}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } ${isRedirecting ? 'opacity-75' : ''}`}
                >
                  {isRedirecting ? (
                    <>
                      <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redirecting...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}