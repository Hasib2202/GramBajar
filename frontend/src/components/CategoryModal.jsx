import { useState, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const CategoryModal = ({ category, onClose, onCategoryCreated, onCategoryUpdated, onCategoryDeleted, darkMode }) => {
  const [name, setName] = useState(category?.name || '');
  const [image, setImage] = useState(category?.image || '');
  const [newImage, setNewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setImage(category.image || '');
    }
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const formPayload = new FormData();
      formPayload.append('name', name);
      if (newImage) {
        formPayload.append('image', newImage);
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
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formPayload
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text.slice(0, 100)}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      const data = await response.json();
      if (category) {
        onCategoryUpdated(data.category);
      } else {
        onCategoryCreated(data.category);
      }
      toast.success(`Category ${category ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      console.error('Save category error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/categories/${category._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      onCategoryDeleted(category._id);
      toast.success('Category deleted successfully');
      onClose();
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'}`}>
      <div className={`w-full max-w-md rounded-lg shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-6">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category Image
            </label>
            <div className="flex items-center">
              <label className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
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
            </div>
            
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
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
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
                    <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {category ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  category ? 'Update Category' : 'Create Category'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className={`absolute inset-0 flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900 bg-opacity-90' : 'bg-white bg-opacity-95'}`}>
            <div className="w-full max-w-md p-6 rounded-lg shadow-xl">
              <h3 className="mb-4 text-xl font-bold text-red-600">Confirm Deletion</h3>
              <p className="mb-6">
                Are you sure you want to delete the category "{category.name}"? 
                This will remove the category from all products and cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryModal;