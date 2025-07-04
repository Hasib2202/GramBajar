import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  FiBarChart2, FiPieChart, FiCalendar, 
  FiDollarSign, FiShoppingBag, FiTrendingUp, 
  FiBox
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell
} from 'recharts';

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const { darkMode } = useTheme();

  const COLORS = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        toast.error('Session expired, please login again');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/orders/reports/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch sales report');
      }

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to load sales report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT'
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Sales Reports</h1>
        
        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-gray-500" />
              <span className="mr-2">Date Range:</span>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className={`px-3 py-1 rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200'
                } border shadow-sm`}
              />
              <span className="mx-2">to</span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className={`px-3 py-1 rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200'
                } border shadow-sm`}
              />
            </div>
            <button
              onClick={fetchSalesReport}
              className={`px-4 py-1 rounded flex items-center ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <FiTrendingUp className="mr-2" /> Generate Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : report ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 text-indigo-600 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                    {/* <FiDollarSign size={24} /> */}
                    ৳
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Total Sales</h3>
                    <p className="text-2xl font-bold">{formatCurrency(report.report.totalSales || 0)}</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 text-green-600 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                    <FiShoppingBag size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Total Orders</h3>
                    <p className="text-2xl font-bold">{report.report.totalOrders || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200">
                    <FiBox size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Items Sold</h3>
                    <p className="text-2xl font-bold">{report.report.totalItemsSold || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    <FiBarChart2 size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Avg. Order Value</h3>
                    <p className="text-2xl font-bold">{formatCurrency(report.report.averageOrderValue || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Sales Over Time */}
              <div className={`p-6 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <h2 className="flex items-center mb-4 text-xl font-semibold">
                  <FiTrendingUp className="mr-2" /> Sales Over Time
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={report.salesOverTime}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="_id" stroke={darkMode ? '#d1d5db' : '#374151'} />
                      <YAxis stroke={darkMode ? '#d1d5db' : '#374151'} />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={darkMode ? { 
                          backgroundColor: '#1f2937', 
                          borderColor: '#374151' 
                        } : {}}
                        itemStyle={darkMode ? { color: '#f9fafb' } : {}}
                      />
                      <Legend />
                      <Bar dataKey="totalSales" name="Total Sales" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Sales by Category */}
              <div className={`p-6 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <h2 className="flex items-center mb-4 text-xl font-semibold">
                  <FiPieChart className="mr-2" /> Sales by Category
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={report.salesByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalRevenue"
                        nameKey="_id"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {report.salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={darkMode ? { 
                          backgroundColor: '#1f2937', 
                          borderColor: '#374151' 
                        } : {}}
                        itemStyle={darkMode ? { color: '#f9fafb' } : {}}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Top Products */}
            <div className={`p-6 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="flex items-center mb-4 text-xl font-semibold">
                <FiBarChart2 className="mr-2" /> Top Selling Products
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Quantity Sold
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                        Total Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {report.topProducts.map((product, index) => (
                      <tr key={index} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {product.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {product.totalQuantity}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {formatCurrency(product.totalRevenue)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No report data available</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;