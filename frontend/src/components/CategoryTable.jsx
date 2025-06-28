import { FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

const CategoryTable = ({ categories, loading, onEdit, onCategoryDeleted, darkMode }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      setDeletingId(categoryId);
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/categories/${categoryId}`,
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

      onCategoryDeleted(categoryId);
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="text-2xl text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <p className="text-lg">No categories found</p>
        <p className="mt-2 text-gray-500">Create your first category to get started</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-700' : 'divide-gray-200 bg-white'}`}>
            {categories.map((category) => (
              <tr key={category._id} className={darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="object-cover w-12 h-12 rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800"
                      title="Edit Category"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      disabled={deletingId === category._id}
                      className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 disabled:opacity-50"
                      title="Delete Category"
                    >
                      {deletingId === category._id ? (
                        <FiLoader className="animate-spin" size={16} />
                      ) : (
                        <FiTrash2 size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;