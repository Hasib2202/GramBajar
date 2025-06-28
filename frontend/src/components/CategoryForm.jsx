import { useState } from 'react';
import { FiX, FiUpload, FiTrash2, FiLoader } from 'react-icons/fi';

const CategoryForm = ({ category, onClose, onCategoryCreated, onCategoryUpdated, onCategoryDeleted, darkMode }) => {
  const [name, setName] = useState(category?.name || '');
  const [image, setImage] = useState(category?.image || '');
  const [newImage, setNewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(''); // Added for backend error messages

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    // Removed image validation here to allow updates without changing image
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImage(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setBackendError(''); // Reset previous errors
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (!token) {
        setBackendError('Authentication failed. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      if (newImage) {
        formData.append('image', newImage);
      }

      let url, method;
      if (category) {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/categories/${category._id}`;
        method = 'PUT';
      } else {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/categories`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save category');
      }

      if (category) {
        onCategoryUpdated(data.category);
      } else {
        onCategoryCreated(data.category);
      }
      
      onClose();
    } catch (error) {
      console.error('Save category error:', error);
      setBackendError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    setBackendError('');
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (!token) {
        setBackendError('Authentication failed. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/categories/${category._id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      onCategoryDeleted(category._id);
      onClose();
    } catch (error) {
      console.error('Delete category error:', error);
      setBackendError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div>
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {category ? 'Edit Category' : 'Create New Category'}
          </h3>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Display backend errors */}
        {backendError && (
          <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
            {backendError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors(prev => ({ ...prev, name: '' }));
                setBackendError('');
              }}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category Image {!category && '*'}
            </label>
            
            <div className="flex items-center">
              <label className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer ${
                darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FiUpload className="mr-2" />
                {image ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>
              
              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setImage('');
                    setNewImage(null);
                    setErrors(prev => ({ ...prev, image: '' }));
                  }}
                  className="p-2 ml-3 text-red-600 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                  disabled={isSubmitting}
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
            
            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
            
            {image && (
              <div className="mt-4">
                <img
                  src={image}
                  alt="Category preview"
                  className="object-contain w-32 h-32 mx-auto border rounded"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-8">
            <div>
              {category && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Delete Category
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  isSubmitting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <FiLoader className="mr-2 animate-spin" />
                    {category ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  category ? 'Update Category' : 'Create Category'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {showDeleteConfirm && (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-10 ${darkMode ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-90'}`}>
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="mb-4 text-xl font-bold text-red-600">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the category "{category.name}"? 
              This will remove the category from all products and cannot be undone.
            </p>
            
            {backendError && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
                {backendError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBackendError('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <FiLoader className="mr-2 animate-spin" />
                    Deleting...
                  </span>
                ) : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryForm;