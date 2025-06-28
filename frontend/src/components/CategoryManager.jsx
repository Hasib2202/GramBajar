import { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import CategoryTable from './CategoryTable';
import CategoryForm from './CategoryForm';
import { toast } from 'react-hot-toast';

const CategoryManager = ({ darkMode, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Fetch categories error:', error);
      toast.error(error.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setCurrentCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setShowForm(true);
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowForm(false);
    toast.success('Category created successfully');
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(categories.map(c => 
      c._id === updatedCategory._id ? updatedCategory : c
    ));
    setShowForm(false);
    toast.success('Category updated successfully');
  };

  const handleCategoryDeleted = (categoryId) => {
    setCategories(categories.filter(c => c._id !== categoryId));
    toast.success('Category deleted successfully');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'}`}>
      <div className={`w-full max-w-4xl rounded-lg shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold">Manage Categories</h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {categories.length} categories found
            </p>
            <button
              onClick={handleCreate}
              className={`px-4 py-2 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <FiPlus className="mr-2" /> Add New Category
            </button>
          </div>

          {showForm ? (
            <CategoryForm
              category={currentCategory}
              onClose={() => setShowForm(false)}
              onCategoryCreated={handleCategoryCreated}
              onCategoryUpdated={handleCategoryUpdated}
              onCategoryDeleted={handleCategoryDeleted}
              darkMode={darkMode}
            />
          ) : (
            <CategoryTable
              categories={categories}
              loading={loading}
              onEdit={handleEdit}
              onCategoryDeleted={handleCategoryDeleted}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;