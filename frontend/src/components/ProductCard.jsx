// components/ProductCard.js
import { useState } from 'react';

// Icons
const FiStar = () => <span>⭐</span>;
const FiHeart = () => <span>❤️</span>;
const FiShoppingCart = () => <span>🛒</span>;
const FiEye = () => <span>👁️</span>;

export default function ProductCard({ product, darkMode, viewMode = 'grid' }) {
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically make an API call to update the wishlist
  };

  const addToCart = () => {
    // Handle add to cart functionality
    console.log('Adding to cart:', product._id);
    // You would typically make an API call here
  };

  const viewProduct = () => {
    // Navigate to product detail page
    window.location.href = `/product/${product._id}`;
  };

  if (viewMode === 'list') {
    return (
      <div className={`flex gap-4 p-4 rounded-lg border transition-all hover:shadow-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Product Image */}
        <div className="flex-shrink-0 w-32 h-32">
          {imageError || !product.image ? (
            <div className={`w-full h-full rounded-lg flex items-center justify-center text-4xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              📦
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full rounded-lg"
              onError={handleImageError}
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h3>
              <button
                onClick={toggleWishlist}
                className={`ml-2 ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              >
                <FiHeart />
              </button>
            </div>

            {/* Category */}
            {product.category && (
              <span className={`text-sm px-2 py-1 rounded ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {product.category}
              </span>
            )}

            {/* Rating */}
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                    <FiStar />
                  </span>
                ))}
              </div>
              <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ({product.reviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-sm font-medium text-green-600">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={viewProduct}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <FiEye />
              </button>
              <button
                onClick={addToCart}
                disabled={!product.inStock}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  product.inStock
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`rounded-lg border overflow-hidden transition-all hover:shadow-lg hover:scale-105 relative ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Discount Badge */}
      {product.originalPrice && (
        <div className="absolute z-10 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded top-2 left-2">
          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-sm ${
          isWishlisted ? 'text-red-500 bg-white/20' : 'text-gray-400 bg-white/20'
        } hover:text-red-500 transition-colors`}
      >
        <FiHeart />
      </button>

      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        {imageError || !product.image ? (
          <div className={`w-full h-full flex items-center justify-center text-6xl ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            📦
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform hover:scale-110"
            onError={handleImageError}
          />
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 transition-opacity opacity-0 bg-black/50 hover:opacity-100">
          <button
            onClick={viewProduct}
            className="p-2 text-white rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <FiEye />
          </button>
          <button
            onClick={addToCart}
            disabled={!product.inStock}
            className={`p-2 rounded-full backdrop-blur-sm ${
              product.inStock
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Stock Status */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded ${
            product.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          {product.category && (
            <span className={`text-xs px-2 py-1 rounded ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {product.category}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className={`font-semibold mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                <FiStar />
              </span>
            ))}
          </div>
          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={!product.inStock}
          className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-colors ${
            product.inStock
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}