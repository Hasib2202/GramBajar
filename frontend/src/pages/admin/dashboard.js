import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const DashboardCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-full`}>
          <div className="w-6 h-6 bg-current rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Client-side only token retrieval
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user?.token;
        
        if (!token) {
          console.error('No token found');
          setLoading(false);
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
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Error:', error);
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
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  // Prepare data for charts
  const userData = stats ? [
    { name: 'Total', value: stats.users.total },
    { name: 'Active', value: stats.users.active },
    { name: 'New', value: stats.users.new },
    { name: 'Blocked', value: stats.users.blocked }
  ] : [];

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Users" 
          value={stats?.users?.total || 0} 
          color="blue"
        />
        <DashboardCard 
          title="Active Users" 
          value={stats?.users?.active || 0} 
          color="green"
        />
        <DashboardCard 
          title="New Users (7d)" 
          value={stats?.users?.new || 0} 
          color="purple"
        />
        <DashboardCard 
          title="Blocked Users" 
          value={stats?.users?.blocked || 0} 
          color="red"
        />
      </div>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-semibold">User Statistics</h2>
        
        {userData.length > 0 ? (
          <div className="h-64">
            <BarChart
              width={730}
              height={250}
              data={userData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available for chart
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <p className="text-gray-500">No recent activity</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">System Status</h2>
          <div className="flex items-center text-green-600">
            <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;