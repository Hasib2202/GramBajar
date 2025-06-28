import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FiSearch, FiUserX, FiUserCheck, FiTrash2, FiEdit, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [limit] = useState(10);
  const [actionLoading, setActionLoading] = useState({});
  const { darkMode } = useTheme();

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pages);
      setTotalUsers(data.total);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchQuery);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleUserStatus = async (userId, currentStatus, userName) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: 'status' }));

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isBlocked: !currentStatus })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const message = result?.message || result?.error || 'Failed to update user status';

        // ✅ Show error toast directly instead of throwing
        toast.error(
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full">
                <FiAlertTriangle className="text-yellow-600" />
              </div>
            </div>
            <div>
              <p className="font-semibold">Action Failed</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        );

        return; // ✅ exit early
      }

      toast.success(
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${!currentStatus ? 'bg-red-100' : 'bg-green-100'
              }`}>
              {!currentStatus
                ? <FiUserX className="text-red-500" />
                : <FiUserCheck className="text-green-500" />}
            </div>
          </div>
          <div>
            <p className="font-semibold">User Status Updated</p>
            <p className="text-sm">{userName} has been {!currentStatus ? 'blocked' : 'unblocked'}</p>
          </div>
        </div>,
        { duration: 3000 }
      );

      setUsers(users.map(user =>
        user._id === userId ? { ...user, isBlocked: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error:', error);

      toast.error(
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full">
              <FiAlertTriangle className="text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="font-semibold">Action Failed</p>
            <p className="text-sm">{error.message || 'Something went wrong'}</p>
          </div>
        </div>
      );
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [userId]: 'delete' }));

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Handle 400 errors specifically
      if (response.status === 400) {
        const errorData = await response.json();
        // Show error in toast without throwing
        toast.error(
          <div>
            <p className="font-semibold">Delete Failed</p>
            <p className="text-sm">{errorData.message || 'Failed to delete user'}</p>
          </div>
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      const data = await response.json();

      toast.success(
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
              <FiTrash2 className="text-red-500" />
            </div>
          </div>
          <div>
            <p className="font-semibold">User Deleted</p>
            <p className="text-sm">{userName} has been removed from the system</p>
          </div>
        </div>,
        { duration: 3000 }
      );

      // Remove the user from the list
      setUsers(users.filter(user => user._id !== userId));
      setTotalUsers(totalUsers - 1);

      // If last user on page, go to previous page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        <div>
          <p className="font-semibold">Delete Failed</p>
          <p className="text-sm">{error.message || 'Failed to delete user'}</p>
        </div>
      );
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${currentPage === i
              ? 'bg-indigo-600 text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex flex-col items-center justify-between mt-6 sm:flex-row">
        <div className="mb-4 text-sm sm:mb-0">
          Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
              } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
              } ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="mt-4 md:mt-0">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200'
                  } border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <FiSearch className="absolute text-gray-400 left-3 top-3" size={18} />
            </form>
          </div>
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
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => {
                        const isStatusLoading = actionLoading[user._id] === 'status';
                        const isDeleteLoading = actionLoading[user._id] === 'delete';

                        return (
                          <tr key={user._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10">
                                  {user.avatar ? (
                                    <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.name} />
                                  ) : (
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'
                                      }`}>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {user.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'Admin'
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isBlocked
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                {user.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => !isStatusLoading && toggleUserStatus(user._id, user.isBlocked, user.name)}
                                  disabled={isStatusLoading || isDeleteLoading}
                                  className={`p-2 rounded-full ${user.isBlocked
                                      ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
                                      : 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800'
                                    } ${isStatusLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                >
                                  {isStatusLoading ? (
                                    <FiLoader className="animate-spin" size={16} />
                                  ) : user.isBlocked ? (
                                    <FiUserCheck size={16} />
                                  ) : (
                                    <FiUserX size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() => !isDeleteLoading && deleteUser(user._id, user.name)}
                                  disabled={isDeleteLoading || isStatusLoading}
                                  className={`p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 ${isDeleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  title="Delete User"
                                >
                                  {isDeleteLoading ? (
                                    <FiLoader className="animate-spin" size={16} />
                                  ) : (
                                    <FiTrash2 size={16} />
                                  )}
                                </button>
                                <button
                                  className="p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800"
                                  title="Edit User"
                                >
                                  <FiEdit size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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

export default AdminUsers;