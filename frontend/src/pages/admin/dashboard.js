import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { useTheme } from '@/context/ThemeContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell
} from 'recharts';
import { 
  FiUsers, FiShoppingBag, FiPieChart, 
  FiUserCheck, FiUserPlus, FiUserX, 
  FiPackage, FiTrendingUp, FiCheckCircle
} from 'react-icons/fi';

const DashboardCard = ({ title, value, icon: Icon, color, darkMode, trend }) => {
  const colorClasses = {
    indigo: darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-50 text-indigo-700',
    green: darkMode ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-700',
    red: darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-700',
    amber: darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-50 text-amber-700',
    cyan: darkMode ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-50 text-cyan-700',
  };
  
  const bgClasses = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  
  return (
    <div className={`p-5 rounded-xl border shadow-sm ${bgClasses}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${
              trend.value > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              <span>{trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ title, value, icon, color, darkMode }) => (
  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <div className="flex items-center">
      <div className={`p-2 rounded-full ${color} ${darkMode ? 'bg-opacity-20' : 'bg-opacity-10'}`}>
        {icon}
      </div>
      <div className="ml-3">
        <div className="text-lg font-bold">{value}</div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user?.token;
        
        if (!token) {
          toast.error('Session expired, please login again');
          router.push('/login');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Handle specific error cases
        if (response.status === 401) {
          toast.error('Session expired, please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        
        if (response.status === 403) {
          toast.error('You do not have admin privileges');
          router.push('/');
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  // Prepare data for charts
  const userData = stats?.users ? [
    { name: 'Total', value: stats.users.total },
    { name: 'Active', value: stats.users.active },
    { name: 'New', value: stats.users.new },
    { name: 'Blocked', value: stats.users.blocked }
  ] : [];

  const productData = stats?.products ? [
    { name: 'In Stock', value: stats.products.total - stats.products.outOfStock },
    { name: 'Out of Stock', value: stats.products.outOfStock },
  ] : [];

  const COLORS = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b'];
  const chartTextColor = darkMode ? '#d1d5db' : '#374151';

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* User Stats Cards */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">User Statistics</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Total Users" 
            value={stats?.users?.total || 0} 
            icon={FiUsers}
            color="indigo"
            darkMode={darkMode}
            trend={{ value: 12, label: 'from last month' }}
          />
          <DashboardCard 
            title="Active Users" 
            value={stats?.users?.active || 0} 
            icon={FiUserCheck}
            color="green"
            darkMode={darkMode}
          />
          <DashboardCard 
            title="New Users (7d)" 
            value={stats?.users?.new || 0} 
            icon={FiUserPlus}
            color="cyan"
            darkMode={darkMode}
            trend={{ value: 8, label: 'from last week' }}
          />
          <DashboardCard 
            title="Blocked Users" 
            value={stats?.users?.blocked || 0} 
            icon={FiUserX}
            color="red"
            darkMode={darkMode}
          />
        </div>
      </div>
      
      {/* Products Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Products Summary</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={`p-6 rounded-xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inventory Overview</h3>
              <FiPackage className="text-indigo-500" size={24} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatItem 
                title="Total Products" 
                value={stats?.products?.total || 0} 
                icon={<FiPackage size={18} />}
                color="text-indigo-500 bg-indigo-500"
                darkMode={darkMode}
              />
              <StatItem 
                title="Out of Stock" 
                value={stats?.products?.outOfStock || 0} 
                icon={<FiPackage size={18} />}
                color="text-red-500 bg-red-500"
                darkMode={darkMode}
              />
              <StatItem 
                title="Low Stock" 
                value={stats?.products?.lowStock || 0} 
                icon={<FiPackage size={18} />}
                color="text-amber-500 bg-amber-500"
                darkMode={darkMode}
              />
              <StatItem 
                title="New Arrivals" 
                value="24" 
                icon={<FiTrendingUp size={18} />}
                color="text-green-500 bg-green-500"
                darkMode={darkMode}
              />
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span>Inventory Health</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className={`h-full p-6 rounded-xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className="mb-4 text-lg font-semibold">Stock Distribution</h3>
              {productData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {productData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
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
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No product data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Orders Summary</h2>
        <div className={`p-6 rounded-xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <StatItem 
                  title="Total Orders" 
                  value={stats?.orders?.total || 0} 
                  icon={<FiPieChart size={18} />}
                  color="text-indigo-500 bg-indigo-500"
                  darkMode={darkMode}
                />
                <StatItem 
                  title="Pending" 
                  value={stats?.orders?.pending || 0} 
                  icon={<FiPieChart size={18} />}
                  color="text-amber-500 bg-amber-500"
                  darkMode={darkMode}
                />
                <StatItem 
                  title="Completed" 
                  value={(stats?.orders?.total - stats?.orders?.pending) || 0} 
                  icon={<FiCheckCircle size={18} />}
                  color="text-green-500 bg-green-500"
                  darkMode={darkMode}
                />
                <StatItem 
                  title="Avg. Order Value" 
                  value="$128.50" 
                  icon={<FiTrendingUp size={18} />}
                  color="text-cyan-500 bg-cyan-500"
                  darkMode={darkMode}
                />
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span>Completion Rate</span>
                  <span className="font-medium">
                    {stats?.orders?.total ? 
                      Math.round(((stats.orders.total - stats.orders.pending) / stats.orders.total) * 100) : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(stats?.orders?.total ? 
                        ((stats.orders.total - stats.orders.pending) / stats.orders.total) * 100 : 0
                      )}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="mb-3 text-lg font-semibold">Top Categories</h3>
              <div className="space-y-3">
                {['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'].map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{category}</span>
                    <div className="flex items-center">
                      <span className="mr-2 font-medium">24%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-indigo-500 rounded-full" 
                          style={{ width: `${24}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className={`p-6 rounded-xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { title: 'System update completed', time: '2 hours ago', type: 'System' },
            { title: 'New product category added', time: '4 hours ago', type: 'Inventory' },
            { title: 'User registration completed', time: '5 hours ago', type: 'Users' },
            { title: 'Order #ORD-1234 shipped', time: '6 hours ago', type: 'Orders' },
          ].map((item, index) => (
            <div key={index} className="flex items-start">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-green-500' : 
                  index === 1 ? 'bg-indigo-500' : 
                  index === 2 ? 'bg-cyan-500' : 'bg-amber-500'
                }`}></div>
              </div>
              <div className="ml-4">
                <p className="font-medium">{item.title}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.time} · {item.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;