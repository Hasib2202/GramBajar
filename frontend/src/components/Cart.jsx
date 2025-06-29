import React from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';


// Simple icon components
const FiX = () => <span>✕</span>;
const FiTrash = () => <span>🗑️</span>;

export default function Cart({ isOpen, setIsOpen }) {
  const { 
    cartItems, 
    cartTotal, 
    totalItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();
  
  const { darkMode } = useTheme(); // Get darkMode from ThemeContext

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
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <FiX />
            </button>
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
                  You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="mt-1">৳ {item.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className={`p-2 rounded-full ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
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
                            darkMode ? 'bg-gray-800' : 'bg-white'
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
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}