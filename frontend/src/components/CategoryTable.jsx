import { useState } from 'react';
import { FiEdit, FiTrash2, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 8;

const CategoryTable = ({ categories, loading, onEdit, onCategoryDeleted, darkMode }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

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
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      onCategoryDeleted(categoryId);
      // If last item on page removed, go to previous page when needed
      const totalAfterDelete = categories.length - 1;
      const lastPage = Math.ceil(totalAfterDelete / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);

    } catch (error) {
      console.error('Delete category error:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = categories.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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
    <div className={`overflow-hidden rounded-lg shadow transition-colors ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      {/* Scrollable Table Container */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Category</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Image</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-700' : 'divide-gray-200 bg-white'}`}>
            {paginated.map(category => (
              <tr key={category._id} className={`${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'} transition-colors`}>  
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{category.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="object-cover w-12 h-12 rounded" />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-3">
                    <button onClick={() => onEdit(category)} className="p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800" title="Edit Category">
                      <FiEdit size={16} />
                    </button>
                    <button onClick={() => handleDelete(category._id, category.name)} disabled={deletingId === category._id} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 disabled:opacity-50" title="Delete Category">
                      {deletingId === category._id ? <FiLoader className="animate-spin" size={16} /> : <FiTrash2 size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center py-3 space-x-4 bg-white dark:bg-gray-700">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50">
            <FiChevronLeft />
          </button>
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50">
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
