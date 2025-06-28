import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  FiPlus, FiEdit, FiTrash2, FiSearch,
  FiFilter, FiX, FiBox, FiTag
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import ProductModal from '@/components/ProductModal';
import CategoryModal from '@/components/CategoryModal';
import CategoryManager from './CategoryManager';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [limit] = useState(10);
  const { darkMode } = useTheme();
  const [showCategoryManager, setShowCategoryManager] = useState(false);


  const fetchProducts = async (page = 1, search = '', category = '') => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 200));
        throw new Error(`Invalid response: ${text.slice(0, 100)}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotalProducts(data.total);
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) return;

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/categories`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 200));
        throw new Error(`Invalid response: ${text.slice(0, 100)}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Fetch categories error:', error);
      toast.error(error.message || 'Failed to load categories');
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery, selectedCategory);
    fetchCategories();
  }, [currentPage, searchQuery, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchQuery, selectedCategory);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenProductModal = (product = null) => {
    setCurrentProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setCurrentProduct(null);
  };

  const handleOpenCategoryModal = (category = null) => {
    setCurrentCategory(category);
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setCurrentCategory(null);
  };

  const handleProductCreated = (newProduct) => {
    setProducts([newProduct, ...products]);
    toast.success('Product created successfully');
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map(p =>
      p._id === updatedProduct._id ? updatedProduct : p
    ));
    toast.success('Product updated successfully');
  };

  const handleProductDeleted = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
    setTotalProducts(totalProducts - 1);
    toast.success('Product deleted successfully');

    if (products.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories([...categories, newCategory]);
    toast.success('Category created successfully');
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(categories.map(c =>
      c._id === updatedCategory._id ? updatedCategory : c
    ));
    toast.success('Category updated successfully');
  };

  const handleCategoryDeleted = (categoryId) => {
    setCategories(categories.filter(c => c._id !== categoryId));
    toast.success('Category deleted successfully');
  };

  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      handleProductDeleted(productId);
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error(
        <div>
          <p className="font-semibold">Delete Failed</p>
          <p className="text-sm">{error.message || 'Failed to delete product'}</p>
        </div>
      );
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${currentPage === i
              ? darkMode
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-600 text-white'
              : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={`flex items-center justify-between mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
        <div className="text-sm">
          Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalProducts)}
          of {totalProducts} products
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Previous
          </button>

          {pages}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="flex mt-4 space-x-3 md:mt-0">
            <button
              onClick={() => handleOpenProductModal()}
              className={`px-4 py-2 rounded-lg flex items-center ${darkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
              <FiPlus className="mr-2" /> Add Product
            </button>

            {/* <button
              onClick={() => handleOpenCategoryModal()}
              className={`px-4 py-2 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <FiTag className="mr-2" /> Categories
            </button> */}

            <button
              onClick={() => setShowCategoryManager(true)}
              className={`px-4 py-2 rounded-lg flex items-center ${darkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              <FiTag className="mr-2" /> Categories
            </button>

            {showCategoryManager && (
              <CategoryManager
                darkMode={darkMode}
                onClose={() => setShowCategoryManager(false)}
              />
            )}


          </div>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
          <form onSubmit={handleSearch} className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200'
                  } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <FiSearch className="absolute text-gray-400 left-3 top-3" size={18} />
            </div>

            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-4 py-2 pr-8 rounded-lg appearance-none ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200'
                    } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <FiFilter className="absolute text-gray-400 pointer-events-none right-3 top-3" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setCurrentPage(1);
                  fetchProducts(1, '', '');
                }}
                className={`px-3 py-2 rounded-lg flex items-center ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                <FiX size={18} />
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className={`overflow-hidden rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="object-cover w-10 h-10 rounded"
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'
                                  }`}>
                                  <FiBox className="text-gray-500" />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {product.title}
                                </div>
                                <div className="max-w-xs text-sm text-gray-500 truncate">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {product.category?.name || 'Uncategorized'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              ${product.price.toFixed(2)}
                              {product.discount > 0 && (
                                <span className="ml-2 text-sm text-red-500">
                                  (-{product.discount}%)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`font-medium ${product.stock === 0
                                ? 'text-red-500'
                                : product.stock <= 10
                                  ? 'text-amber-500'
                                  : 'text-green-500'
                              }`}>
                              {product.stock} in stock
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenProductModal(product)}
                                className="p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800"
                                title="Edit Product"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => deleteProduct(product._id, product.title)}
                                className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                                title="Delete Product"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {renderPagination()}
          </>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <ProductModal
            product={currentProduct}
            categories={categories}
            onClose={handleCloseProductModal}
            onProductCreated={handleProductCreated}
            onProductUpdated={handleProductUpdated}
            darkMode={darkMode}
          />
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <CategoryModal
            category={currentCategory}
            onClose={handleCloseCategoryModal}
            onCategoryCreated={handleCategoryCreated}
            onCategoryUpdated={handleCategoryUpdated}
            onCategoryDeleted={handleCategoryDeleted}
            darkMode={darkMode}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;