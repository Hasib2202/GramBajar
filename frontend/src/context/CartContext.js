import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const removeTimeoutRef = useRef({});
  const isRemovingRef = useRef(new Set());

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
    // Calculate discountedPrice based on discount
    const discount = product.discount || 0;
    const discountedPrice = discount > 0
      ? product.price * (1 - discount / 100)
      : product.price;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          name: product.name || 'Unknown Product',
          price: product.price,
          discount: product.discount || 0,
          discountedPrice: discountedPrice,
          // discount: product.discount || 0,  // Discount percentage
          images: product.images || [],
          quantity: 1
        }];
      }
    });
    toast.success(`${product.name || 'Product'} added to cart!`);
  };

  const removeFromCart = (productId) => {
    if (isRemovingRef.current.has(productId)) {
      return;
    }

    isRemovingRef.current.add(productId);

    if (removeTimeoutRef.current[productId]) {
      clearTimeout(removeTimeoutRef.current[productId]);
    }

    const item = cartItems.find(i => i.id === productId);
    if (!item) {
      isRemovingRef.current.delete(productId);
      return;
    }

    setCartItems(prevItems => prevItems.filter(i => i.id !== productId));

    toast.success(`${item.name} removed from cart!`, {
      toastId: `remove-${productId}`
    });

    removeTimeoutRef.current[productId] = setTimeout(() => {
      isRemovingRef.current.delete(productId);
      delete removeTimeoutRef.current[productId];
    }, 300);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    Object.values(removeTimeoutRef.current).forEach(clearTimeout);
    removeTimeoutRef.current = {};
    isRemovingRef.current.clear();

    setCartItems([]);
    toast.success('Cart cleared!', {
      toastId: 'cart-cleared'
    });
  };

  // Calculate totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.discountedPrice * item.quantity),
    0
  );

  // Total quantity of all items
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Number of distinct items
  const distinctItemCount = cartItems.length;

  useEffect(() => {
    return () => {
      Object.values(removeTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        totalQuantity,
        distinctItemCount,
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