import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ImageGallery from '../../components/ImageGallery';
import { useCart } from '@/src/context/CartContext';
import { toast } from 'react-toastify';

// Icons
const FiShoppingCart = () => <span>🛒</span>;
const FiHeart = () => <span>❤️</span>;
const FiStar = () => <span>⭐</span>;

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const isDark = false;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/products/${id}`
      );
      
      if (!response.ok) throw new Error('Product not found');
      
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        // FIX 1: Pass category ID instead of full object
        fetchRelatedProducts(data.product.category?._id);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId) => {
    // FIX 1: Only fetch if categoryId exists
    if (!categoryId) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/products?category=${categoryId}&limit=4`
      );
      const data = await response.json();
      if (data.success) {
        setRelatedProducts(data.products.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(product.stock, value));
    setQuantity(newValue);
  };

  const handleAddToCart = () => {
    // FIX 2: Add quantity to cart item
    addToCart({
      id: product._id,
      name: product.title,
      price: product.price,
      discount: product.discount || 0,
      discountedPrice: discountPrice,
      images: product.images || [],
      quantity: quantity
    });
    
    toast.success(`${quantity} ${product.title} added to cart!`);
  };


  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <div className="px-4 py-16 mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className={`w-full lg:w-1/2 aspect-square rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-white'}`}></div>
            <div className="w-full space-y-4 lg:w-1/2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-${i === 0 ? '10' : i === 2 ? '16' : '6'} w-${i % 2 === 0 ? 'full' : '3/4'} rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-white'}`}></div>
              ))}
            </div>
          </div>
        </div>
        <Footer darkMode={darkMode} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <div className="max-w-3xl px-4 py-32 mx-auto text-center">
          <div className={`p-8 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Product Not Found
            </h1>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 font-bold text-white transition-all bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl"
            >
              Browse Products
            </button>
          </div>
        </div>
        <Footer darkMode={darkMode} />
      </div>
    );
  }

  const discountPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
      <Head>
        <title>{product.title} - GramBajar</title>
        <meta name="description" content={product.description || product.title} />
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Breadcrumb */}
      <div className={`py-4 px-4 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl">
          <nav className="flex">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => router.push('/')}
                  className={`px-3 py-1 rounded-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
                >
                  Home
                </button>
              </li>
              <li>→</li>
              <li>
                <button
                  onClick={() => router.push('/products')}
                  className={`px-3 py-1 rounded-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
                >
                  Products
                </button>
              </li>
              <li>→</li>
              <li className={`px-3 py-1 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500`}>
                {product.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <ImageGallery 
                images={product.images} 
                darkMode={darkMode}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full space-y-6 lg:w-1/2">
            {/* Stock Status */}
            <div className="flex justify-start">
              <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm ${
                product.stock > 0
                  ? 'text-emerald-600 bg-emerald-100' 
                  : 'text-red-600 bg-red-100'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${
                    i < Math.floor(product.rating || 0) 
                      ? 'text-yellow-400' 
                      : 'text-slate-300'
                  }`}>
                    <FiStar />
                  </span>
                ))}
              </div>
              <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Category */}
            {product.category && (
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Category:
                </span>
                <button
                  onClick={() => router.push(`/products?category=${product.category._id}`)}
                  className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
                >
                  {product.category.name}
                </button>
              </div>
            )}

            {/* Pricing */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center mb-2 space-x-4">
                <span className={`text-3xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  ৳{discountPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl line-through text-slate-500">
                      ৳{product.price.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              
              {product.discount > 0 && (
                <p className="text-sm text-green-600">
                  Save ৳{(product.price - discountPrice).toFixed(2)}
                </p>
              )}
            </div>

            {/* Description */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Product Details
              </h2>
              <p className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {product.description || 'Premium product with excellent quality.'}
              </p>
            </div>

            {/* Quantity */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <label className={`block mb-2 text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Quantity
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className={`w-10 h-10 rounded-lg text-lg ${quantity <= 1 ? 'opacity-50' : ''} ${
                    darkMode ? 'bg-slate-700' : 'bg-slate-100'
                  }`}
                >
                  −
                </button>
                <div className={`px-4 py-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className={`w-12 text-center text-lg font-bold bg-transparent ${darkMode ? 'text-white' : 'text-slate-900'}`}
                  />
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className={`w-10 h-10 rounded-lg text-lg ${quantity >= product.stock ? 'opacity-50' : ''} ${
                    darkMode ? 'bg-slate-700' : 'bg-slate-100'
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  product.stock > 0
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="mr-2"><FiShoppingCart /></span>
                Add to Cart
              </button>
              <button
                className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              >
                <FiHeart />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct._id}
                  onClick={() => router.push(`/product/${relatedProduct._id}`)}
                  className={`rounded-xl overflow-hidden cursor-pointer ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
                >
                  <div className={`aspect-square ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    {relatedProduct.images?.length > 0 ? (
                      <img 
                        src={relatedProduct.images[0]} 
                        alt={relatedProduct.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">📦</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className={`font-bold text-sm mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ৳{relatedProduct.discount > 0 
                          ? (relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)
                          : relatedProduct.price.toFixed(2)}
                      </span>
                      {relatedProduct.discount > 0 && (
                        <span className="text-xs line-through text-slate-500">
                          ৳{relatedProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}