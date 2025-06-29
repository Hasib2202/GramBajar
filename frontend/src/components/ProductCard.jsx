// import { useState } from 'react';

// // Icons
// const FiStar = () => <span>⭐</span>;
// const FiHeart = () => <span>❤️</span>;
// const FiShoppingCart = () => <span>🛒</span>;
// const FiEye = () => <span>👁️</span>;

// export default function ProductCard({ product, darkMode }) {
//   const [imageError, setImageError] = useState(false);
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   // Extract image URL if it's an object
//   const getImageUrl = () => {
//     if (typeof product.image === 'string') return product.image;
//     if (product.image && product.image.url) return product.image.url;
//     if (product.images && product.images[0]) return product.images[0];
//     return null;
//   };

//   const imageUrl = getImageUrl();

//   const handleImageError = () => {
//     setImageError(true);
//   };

//   const toggleWishlist = () => {
//     setIsWishlisted(!isWishlisted);
//   };

//   const addToCart = () => {
//     console.log('Adding to cart:', product._id);
//   };

//   const viewProduct = () => {
//     window.location.href = `/product/${product._id}`;
//   };

//   // Calculate discount price
//   const discountPrice = product.discount > 0 
//     ? product.price * (1 - product.discount / 100)
//     : product.price;

//   return (
//     <div className={`rounded-2xl overflow-hidden shadow-lg transition-all hover:scale-105 relative ${
//       darkMode ? 'bg-gray-700' : 'bg-white'
//     }`}>
//       {product.discount > 0 && (
//         <div className="absolute z-10 px-2 py-1 text-sm font-bold text-white bg-red-500 rounded-lg top-4 left-4">
//           -{product.discount}%
//         </div>
//       )}
      
//       <div className={`aspect-square flex items-center justify-center ${
//         darkMode ? 'bg-gray-600' : 'bg-gray-100'
//       }`}>
//         {!imageError && imageUrl ? (
//           <img 
//             src={imageUrl} 
//             alt={product.title || product.name}
//             className="object-cover w-full h-full"
//             onError={handleImageError}
//           />
//         ) : (
//           <div className="text-6xl">📦</div>
//         )}
//       </div>
      
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-2">
//           <span className={`text-sm px-2 py-1 rounded ${
//             product.stock > 0
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//           </span>
//           <button 
//             onClick={toggleWishlist}
//             className={`${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
//           >
//             <FiHeart />
//           </button>
//         </div>
        
//         <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//           {product.title || product.name}
//         </h3>
        
//         <div className="flex items-center mb-3">
//           <div className="flex items-center">
//             {[...Array(5)].map((_, i) => (
//               <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
//                 <FiStar />
//               </span>
//             ))}
//           </div>
//           <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//             ({product.reviews || 0} reviews)
//           </span>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//               {discountPrice.toFixed(2)} ৳
//             </span>
//             {product.discount > 0 && (
//               <span className="text-gray-500 line-through">
//                 {product.price.toFixed(2)} ৳
//               </span>
//             )}
//           </div>
//           <button 
//             onClick={addToCart}
//             className="px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { FiHeart, FiStar } from 'react-icons/fi';

// const ProductCard = ({ product, darkMode }) => {
//   // Calculate discount price
//   const discountPrice = product.discount > 0 
//     ? product.price * (1 - product.discount / 100)
//     : product.price;

//   return (
//     <div className={`rounded-2xl overflow-hidden shadow-lg transition-all hover:scale-105 relative ${
//       darkMode ? 'bg-gray-700' : 'bg-white'
//     }`}>
//       {product.discount > 0 && (
//         <div className="absolute z-10 px-2 py-1 text-sm font-bold text-white bg-red-500 rounded-lg top-4 left-4">
//           -{product.discount}%
//         </div>
//       )}
      
//       <div className={`aspect-square flex items-center justify-center ${
//         darkMode ? 'bg-gray-600' : 'bg-gray-100'
//       }`}>
//         {product.images ? (
//           <img 
//             src={product.images} 
//             alt={product.title}
//             className="object-cover w-full h-full"
//           />
//         ) : (
//           <div className="text-6xl">📦</div>
//         )}
//       </div>
      
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-2">
//           <span className={`text-sm px-2 py-1 rounded ${
//             product.stock > 0
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//           </span>
//           <button className="text-gray-400 hover:text-red-500">
//             <FiHeart />
//           </button>
//         </div>
        
//         <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//           {product.title}
//         </h3>
        
//         <div className="flex items-center mb-3">
//           <div className="flex items-center">
//             {[...Array(5)].map((_, i) => (
//               <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
//                 <FiStar />
//               </span>
//             ))}
//           </div>
//           <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//             ({product.reviews || 0} reviews)
//           </span>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//               {discountPrice.toFixed(2)} ৳
//             </span>
//             {product.discount > 0 && (
//               <span className="text-gray-500 line-through">
//                 {product.price.toFixed(2)} ৳
//               </span>
//             )}
//           </div>
//           <button className="px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import { useState } from 'react';
import { useCart } from '../context/CartContext';

// Icons
const FiStar = () => <span>⭐</span>;
const FiHeart = () => <span>❤️</span>;
const FiShoppingCart = () => <span>🛒</span>;
const FiEye = () => <span>👁️</span>;

export default function ProductCard({ product, darkMode, viewMode = 'grid' }) {
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get the first image URL
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : null;

  // Calculate discount price
  const discountPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // const addToCart = () => {
  //   console.log('Adding to cart:', product._id);
  // };

  const { addToCart } = useCart();

  const viewProduct = () => {
    window.location.href = `/product/${product._id}`;
  };

  if (viewMode === 'list') {
    return (
      <div className={`flex gap-4 p-4 rounded-lg border transition-all hover:shadow-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Product Image */}
        <div className="flex-shrink-0 w-32 h-32">
          {imageError || !imageUrl ? (
            <div className={`w-full h-full rounded-lg flex items-center justify-center text-4xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              📦
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={product.title}
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
                {product.title}
              </h3>
              <button
                onClick={toggleWishlist}
                className={`ml-2 ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              >
                <FiHeart />
              </button>
            </div>

            {/* Stock Status */}
            <span className={`text-sm px-2 py-1 rounded ${
              product.stock > 0
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>

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
                {discountPrice.toFixed(2)} ৳
              </span>
              {product.discount > 0 && (
                <span className="text-gray-500 line-through">
                  {product.price.toFixed(2)} ৳
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-sm font-medium text-green-600">
                  {product.discount}% off
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
                disabled={product.stock <= 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  product.stock > 0
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
      {product.discount > 0 && (
        <div className="absolute z-10 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded top-2 left-2">
          -{product.discount}%
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
        {imageError || !imageUrl ? (
          <div className={`w-full h-full flex items-center justify-center text-6xl ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            📦
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={product.title}
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
            disabled={product.stock <= 0}
            className={`p-2 rounded-full backdrop-blur-sm ${
              product.stock > 0
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
            product.stock > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        {/* Product Name */}
        <h3 className={`font-semibold mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {product.title}
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
              {discountPrice.toFixed(2)} ৳
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {product.price.toFixed(2)} ৳
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          // onClick={addToCart}
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
          className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-colors ${
            product.stock > 0
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}