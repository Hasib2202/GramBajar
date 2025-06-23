import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  FiSearch, FiFilter, FiX, FiBox, 
  FiAlertTriangle, FiTrendingUp, FiPackage 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [limit] = useState(10);
  const { darkMode } = useTheme();

  const stockOptions = [
    { value: 'all', label: 'All Stock' },
    { value: 'low', label: 'Low Stock (≤ 10)' },
    { value: 'out', label: 'Out of Stock' }
  ];

  const fetchProducts = async (page = 1, search = '', stock = 'all') => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products?page=${page}&limit=${limit}`;
      if (search) url += `&search=${search}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch inventory');
      }

      const data = await response.json();
      
      // Apply stock filters
      let filteredProducts = data.products;
      if (stock === 'low') {
        filteredProducts = filteredProducts.filter(p => p.stock > 0 && p.stock <= 10);
      } else if (stock === 'out') {
        filteredProducts = filteredProducts.filter(p => p.stock === 0);
      }
      
      setProducts(filteredProducts);
      setTotalPages(data.pages);
      setTotalProducts(data.total);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery, stockFilter);
  }, [currentPage, searchQuery, stockFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, searchQuery, stockFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    // ... similar to previous pagination implementation ...
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Inventory Tracking</h1>
        
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="p-3 text-indigo-600 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                <FiPackage size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Products</h3>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200">
                <FiAlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Low Stock Items</h3>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stock > 0 && p.stock <= 10).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="p-3 text-red-600 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-200">
                <FiBox size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Out of Stock</h3>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <form onSubmit={handleSearch} className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200'
                } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <FiSearch className="absolute text-gray-400 left-3 top-3" size={18} />
            </div>
            
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className={`px-4 py-2 pr-8 rounded-lg appearance-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200'
                  } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {stockOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiFilter className="absolute text-gray-400 pointer-events-none right-3 top-3" />
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStockFilter('all');
                }}
                className={`px-3 py-2 rounded-lg flex items-center ${
                  darkMode 
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
            <div className={`overflow-hidden rounded-lg shadow ${
              darkMode ? 'bg-gray-800' : 'bg-white'
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
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No inventory items found
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
                                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                                  darkMode ? 'bg-gray-600' : 'bg-gray-200'
                                }`}>
                                  <FiBox className="text-gray-500" />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {product.title}
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
                            <div className={`font-medium ${
                              product.stock === 0 
                                ? 'text-red-500' 
                                : product.stock <= 10 
                                  ? 'text-amber-500' 
                                  : 'text-green-500'
                            }`}>
                              {product.stock}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.stock === 0 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                : product.stock <= 10 
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {product.stock === 0 
                                ? 'Out of Stock' 
                                : product.stock <= 10 
                                  ? 'Low Stock' 
                                  : 'In Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {new Date(product.updatedAt).toLocaleDateString()}
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
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;