import { useState, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ProductModal = ({ product, categories, onClose, onProductCreated, onProductUpdated, darkMode }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category?._id || '',
    stock: product?.stock || '',
    discount: product?.discount || 0,
    images: product?.images || []
  });
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category?._id || '',
        stock: product.stock,
        discount: product.discount || 0,
        images: product.images || []
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      // Remove from new images and previews
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(index, 1);
      setNewImages(updatedNewImages);

      const updatedPreviews = [...previewImages];
      updatedPreviews.splice(index, 1);
      setPreviewImages(updatedPreviews);
    } else {
      // Remove from existing images
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        images: updatedImages
      }));
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
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('price', formData.price);
      formPayload.append('category', formData.category);
      formPayload.append('stock', formData.stock);
      formPayload.append('discount', formData.discount);

      // Append new images
      newImages.forEach(file => {
        formPayload.append('images', file);
      });

      let response;
      if (product) {
        // Update existing product
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/${product._id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formPayload
          }
        );
      } else {
        // Create new product
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formPayload
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      const data = await response.json();
      if (product) {
        onProductUpdated(data.product);
      } else {
        onProductCreated(data.product);
      }
      
      // REMOVED THE SUCCESS TOAST HERE
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'}`}>
      <div className={`w-full max-w-2xl rounded-lg shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <div className="mt-6">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Product Images
            </label>
            <div className="flex items-center">
              <label className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FiUpload className="mr-2" />
                Upload Images
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  disabled={isSubmitting}
                />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                Max 10 images (max 1MB each)
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Existing images */}
              {formData.images.map((img, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={img}
                    alt={`Product ${index}`}
                    className="object-cover w-24 h-24 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, false)}
                    className="absolute p-1 transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
                    disabled={isSubmitting}
                  >
                    <FiTrash2 className="text-white" size={16} />
                  </button>
                </div>
              ))}
              
              {/* New image previews */}
              {previewImages.map((img, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={img}
                    alt={`New preview ${index}`}
                    className="object-cover w-24 h-24 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, true)}
                    className="absolute p-1 transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
                    disabled={isSubmitting}
                  >
                    <FiTrash2 className="text-white" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
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
                  {product ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                product ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;