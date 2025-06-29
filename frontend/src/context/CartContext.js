import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? {...item, quantity: item.quantity + 1} 
            : item
        );
      } else {
        return [...prevItems, {...product, quantity: 1}];
      }
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(i => i.id === productId);
      if (item) {
        toast.success(`${item.name} removed from cart!`);
        return prevItems.filter(i => i.id !== productId);
      }
      return prevItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? {...item, quantity: newQuantity} 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared!');
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity, 
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);