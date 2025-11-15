import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaHeartbeat,
  FaClipboardList,
  FaFileAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState({});
  const [systemHealth, setSystemHealth] = useState({});
  const [activityLogs, setActivityLogs] = useState({});
  const [advancedReports, setAdvancedReports] = useState({});
  const [overview, setOverview] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        productsRes,
        ordersRes,
        salesRes,
        userReportsRes,
        systemHealthRes,
        activityLogsRes,
        advancedReportsRes
      ] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/reports/sales'),
        api.get('/admin/reports/users'),
        api.get('/admin/system/health'),
        api.get('/admin/logs/activity'),
        api.get('/admin/reports/advanced'),
      ]);

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setReports({
        sales: salesRes.data,
        users: userReportsRes.data,
      });
      setSystemHealth(systemHealthRes.data);
      setActivityLogs(activityLogsRes.data);
      setAdvancedReports(advancedReportsRes.data);
      setOverview({
        totalUsers: usersRes.data.length,
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalSales: salesRes.data.totalSales || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const approveProduct = async (productId) => {
    try {
      await api.put(`/products/${productId}/approve`);
      setProducts(products.map(p =>
        p._id === productId ? { ...p, isApproved: true } : p
      ));
    } catch (error) {
      alert('Error approving product');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-center">Access denied. Admin only.</div>;
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-xl border-b border-blue-800">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaTachometerAlt className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-blue-200 font-medium">System Analytics & Management</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <main className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg">Loading dashboard data...</div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Overview Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 hover:border-blue-300 transform hover:scale-105">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-4xl font-bold text-blue-600 mb-1">{overview.totalUsers}</p>
                         <p className="text-blue-700 font-semibold text-lg">Total Users</p>
                         <p className="text-blue-500 text-sm mt-1">Active accounts</p>
                       </div>
                       <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                         <FaUsers className="text-white text-2xl" />
                       </div>
                     </div>
                   </div>
                   <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:border-green-300 transform hover:scale-105">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-4xl font-bold text-green-600 mb-1">{overview.totalProducts}</p>
                         <p className="text-green-700 font-semibold text-lg">Total Products</p>
                         <p className="text-green-500 text-sm mt-1">Available items</p>
                       </div>
                       <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                         <FaBox className="text-white text-2xl" />
                       </div>
                     </div>
                   </div>
                   <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200 hover:border-amber-300 transform hover:scale-105">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-4xl font-bold text-amber-600 mb-1">{overview.totalOrders}</p>
                         <p className="text-amber-700 font-semibold text-lg">Total Orders</p>
                         <p className="text-amber-500 text-sm mt-1">Completed transactions</p>
                       </div>
                       <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                         <FaShoppingCart className="text-white text-2xl" />
                       </div>
                     </div>
                   </div>
                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200 hover:border-purple-300 transform hover:scale-105">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-4xl font-bold text-purple-600 mb-1">${overview.totalSales}</p>
                         <p className="text-purple-700 font-semibold text-lg">Total Sales</p>
                         <p className="text-purple-500 text-sm mt-1">Revenue generated</p>
                       </div>
                       <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                         <FaChartBar className="text-white text-2xl" />
                       </div>
                     </div>
                   </div>
                 </div>

                {/* Tab Navigation */}
                 <div className="flex flex-wrap gap-3 mb-12">
                   <button
                     onClick={() => setActiveTab('overview')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'overview'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaTachometerAlt className="inline mr-3" />
                     Overview
                   </button>
                   <button
                     onClick={() => setActiveTab('users')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'users'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaUsers className="inline mr-3" />
                     Users
                   </button>
                   <button
                     onClick={() => setActiveTab('products')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'products'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaBox className="inline mr-3" />
                     Products
                   </button>
                   <button
                     onClick={() => setActiveTab('orders')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'orders'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaShoppingCart className="inline mr-3" />
                     Orders
                   </button>
                   <button
                     onClick={() => setActiveTab('reports')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'reports'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaChartBar className="inline mr-3" />
                     Reports
                   </button>
                   <button
                     onClick={() => setActiveTab('system-health')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'system-health'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaHeartbeat className="inline mr-3" />
                     System Health
                   </button>
                   <button
                     onClick={() => setActiveTab('analytics')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'analytics'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaClipboardList className="inline mr-3" />
                     Analytics
                   </button>
                   <button
                     onClick={() => setActiveTab('logs')}
                     className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                       activeTab === 'logs'
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25'
                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl'
                     }`}
                   >
                     <FaFileAlt className="inline mr-3" />
                     Logs
                   </button>
                 </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'users' && (
                   <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                     <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                       <h2 className="text-2xl font-bold text-white flex items-center">
                         <FaUsers className="mr-3" />
                         Users Management
                       </h2>
                       <p className="text-blue-100 mt-1">Manage user accounts and permissions</p>
                     </div>
                     <div className="p-8">
                       <div className="overflow-x-auto">
                         <table className="min-w-full">
                           <thead>
                             <tr className="border-b border-gray-200">
                               <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                 Name
                               </th>
                               <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                 Email
                               </th>
                               <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                 Role
                               </th>
                               <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                 Actions
                               </th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                             {users.map((u) => (
                               <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-200">
                                 <td className="px-6 py-5 whitespace-nowrap">
                                   <div className="flex items-center">
                                     <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                       {u.name.charAt(0).toUpperCase()}
                                     </div>
                                     <span className="font-medium text-gray-900">{u.name}</span>
                                   </div>
                                 </td>
                                 <td className="px-6 py-5 whitespace-nowrap text-gray-600">{u.email}</td>
                                 <td className="px-6 py-5 whitespace-nowrap">
                                   <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                     u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                     u.role === 'farmer' ? 'bg-green-100 text-green-800' :
                                     'bg-blue-100 text-blue-800'
                                   }`}>
                                     {u.role}
                                   </span>
                                 </td>
                                 <td className="px-6 py-5 whitespace-nowrap">
                                   <button
                                     onClick={() => deleteUser(u._id)}
                                     className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                   >
                                     Delete
                                   </button>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </div>
                   </div>
                 )}

              {activeTab === 'products' && (
             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
               <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <FaBox className="mr-3" />
                   Products Management
                 </h2>
                 <p className="text-green-100 mt-1">Review and approve product listings</p>
               </div>
               <div className="p-8">
                 <div className="overflow-x-auto">
                   <table className="min-w-full">
                     <thead>
                       <tr className="border-b border-gray-200">
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Name
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Farmer
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Price
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Status
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Actions
                         </th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {products.map((p) => (
                         <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-200">
                           <td className="px-6 py-5 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                 {p.name.charAt(0).toUpperCase()}
                               </div>
                               <span className="font-medium text-gray-900">{p.name}</span>
                             </div>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap text-gray-600">{p.farmer?.name || 'Unknown'}</td>
                           <td className="px-6 py-5 whitespace-nowrap">
                             <span className="font-semibold text-green-600">${p.price}</span>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap">
                             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                               p.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                             }`}>
                               {p.isApproved ? 'Approved' : 'Pending'}
                             </span>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap">
                             {!p.isApproved && (
                               <button
                                 onClick={() => approveProduct(p._id)}
                                 className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                               >
                                 Approve
                               </button>
                             )}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           )}

          {activeTab === 'orders' && (
             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
               <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <FaShoppingCart className="mr-3" />
                   Orders Management
                 </h2>
                 <p className="text-amber-100 mt-1">Track and manage customer orders</p>
               </div>
               <div className="p-8">
                 <div className="overflow-x-auto">
                   <table className="min-w-full">
                     <thead>
                       <tr className="border-b border-gray-200">
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Order ID
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Buyer
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Total
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Status
                         </th>
                         <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                           Date
                         </th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {orders.map((o) => (
                         <tr key={o._id} className="hover:bg-gray-50 transition-colors duration-200">
                           <td className="px-6 py-5 whitespace-nowrap">
                             <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{o._id.slice(-8)}</span>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap text-gray-600">{o.buyer?.name || 'Unknown'}</td>
                           <td className="px-6 py-5 whitespace-nowrap">
                             <span className="font-semibold text-amber-600">${o.totalAmount}</span>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap">
                             <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                               o.status === 'completed' ? 'bg-green-100 text-green-800' :
                               o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                               o.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                               'bg-blue-100 text-blue-800'
                             }`}>
                               {o.status}
                             </span>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                             {new Date(o.createdAt).toLocaleDateString()}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           )}

          {activeTab === 'reports' && (
             <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-xl border border-green-200">
                   <div className="flex items-center justify-between mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-green-800">Sales Report</h3>
                       <p className="text-green-600">Revenue Overview</p>
                     </div>
                     <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                       <FaChartBar className="text-white text-2xl" />
                     </div>
                   </div>
                   <p className="text-4xl font-bold text-green-600 mb-2">
                     ${reports.sales?.totalSales || 0}
                   </p>
                   <p className="text-green-700 font-medium">
                     From {reports.sales?.totalOrders || 0} orders
                   </p>
                 </div>

                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-xl border border-blue-200">
                   <div className="flex items-center justify-between mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-blue-800">User Distribution</h3>
                       <p className="text-blue-600">Role Breakdown</p>
                     </div>
                     <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                       <FaUsers className="text-white text-2xl" />
                     </div>
                   </div>
                   <div className="space-y-3">
                     {reports.users?.map((userType) => (
                       <div key={userType._id} className="flex justify-between items-center">
                         <span className="capitalize font-medium text-blue-700">{userType._id}</span>
                         <span className="font-bold text-blue-600 bg-blue-200 px-3 py-1 rounded-full">{userType.count}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               {/* User Distribution Bar Chart */}
               <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                 <div className="flex items-center mb-6">
                   <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                     <FaChartBar className="text-white" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold text-gray-800">User Role Distribution</h3>
                     <p className="text-gray-600">Visual breakdown of user types</p>
                   </div>
                 </div>
                 <ResponsiveContainer width="100%" height={350}>
                   <BarChart data={reports.users || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                     <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} />
                     <YAxis stroke="#6b7280" fontSize={12} />
                     <Tooltip
                       contentStyle={{
                         backgroundColor: '#ffffff',
                         border: 'none',
                         borderRadius: '12px',
                         boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                       }}
                       formatter={(value) => [value, 'Count']}
                     />
                     <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                     <defs>
                       <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.9}/>
                       </linearGradient>
                     </defs>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
           )}

          {activeTab === 'system-health' && (
             <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl shadow-xl border border-emerald-200">
                   <div className="flex items-center justify-between mb-6">
                     <div>
                       <h3 className="text-xl font-bold text-emerald-800">System Status</h3>
                       <p className="text-emerald-600">Current system health</p>
                     </div>
                     <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                       <FaHeartbeat className="text-white text-2xl" />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                       <span className="font-semibold text-emerald-700">Status:</span>
                       <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                         systemHealth.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {systemHealth.status}
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="font-semibold text-emerald-700">Database:</span>
                       <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                         systemHealth.database === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {systemHealth.database}
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="font-semibold text-emerald-700">Uptime:</span>
                       <span className="font-bold text-emerald-600">{systemHealth.uptime}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="font-semibold text-emerald-700">Last Check:</span>
                       <span className="text-sm text-emerald-600">{new Date(systemHealth.timestamp).toLocaleString()}</span>
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-xl border border-purple-200">
                   <div className="flex items-center justify-between mb-6">
                     <div>
                       <h3 className="text-xl font-bold text-purple-800">Memory Usage</h3>
                       <p className="text-purple-600">System resource monitoring</p>
                     </div>
                     <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                       <FaClipboardList className="text-white text-2xl" />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                       <span className="font-semibold text-purple-700">RSS:</span>
                       <span className="font-bold text-purple-600">{systemHealth.memory?.rss || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="font-semibold text-purple-700">Heap Total:</span>
                       <span className="font-bold text-purple-600">{systemHealth.memory?.heapTotal || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="font-semibold text-purple-700">Heap Used:</span>
                       <span className="font-bold text-purple-600">{systemHealth.memory?.heapUsed || 'N/A'}</span>
                     </div>
                     <div className="mt-4">
                       <div className="w-full bg-purple-200 rounded-full h-3">
                         <div
                           className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                           style={{ width: systemHealth.memory?.heapUsed && systemHealth.memory?.heapTotal ?
                             `${(systemHealth.memory.heapUsed / systemHealth.memory.heapTotal) * 100}%` : '0%' }}
                         ></div>
                       </div>
                       <p className="text-xs text-purple-600 mt-1">Memory utilization</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

          {activeTab === 'analytics' && (
             <div className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* User Growth Chart */}
                 <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                   <div className="flex items-center mb-6">
                     <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                       <FaUsers className="text-white" />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-800">User Role Distribution</h3>
                       <p className="text-gray-600">Breakdown by user types</p>
                     </div>
                   </div>
                   <ResponsiveContainer width="100%" height={320}>
                     <PieChart>
                       <Pie
                         data={reports.users?.map(user => ({
                           name: user._id,
                           value: user.count,
                         })) || []}
                         cx="50%"
                         cy="50%"
                         labelLine={false}
                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                         outerRadius={90}
                         fill="#8884d8"
                         dataKey="value"
                       >
                         {reports.users?.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                         ))}
                       </Pie>
                       <Tooltip
                         contentStyle={{
                           backgroundColor: '#ffffff',
                           border: 'none',
                           borderRadius: '12px',
                           boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                         }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>

                 {/* Sales vs Orders Trend */}
                 <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                   <div className="flex items-center mb-6">
                     <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                       <FaChartBar className="text-white" />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-800">Sales & Orders Trend</h3>
                       <p className="text-gray-600">Monthly performance overview</p>
                     </div>
                   </div>
                   <ResponsiveContainer width="100%" height={320}>
                     <ComposedChart
                       data={advancedReports.monthlySales?.map(month => ({
                         month: new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
                         sales: month.totalSales,
                         orders: month.orderCount,
                       })) || []}
                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                     >
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                       <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                       <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                       <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                       <Tooltip
                         contentStyle={{
                           backgroundColor: '#ffffff',
                           border: 'none',
                           borderRadius: '12px',
                           boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                         }}
                         formatter={(value, name) => [name === 'sales' ? `$${value}` : value, name === 'sales' ? 'Sales' : 'Orders']}
                       />
                       <Legend />
                       <Bar yAxisId="left" dataKey="sales" fill="url(#salesGradient)" name="Sales" radius={[4, 4, 0, 0]} />
                       <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} name="Orders" dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                       <defs>
                         <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#059669" stopOpacity={0.9}/>
                         </linearGradient>
                       </defs>
                     </ComposedChart>
                   </ResponsiveContainer>
                 </div>

                 {/* Product Status Overview */}
                 <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                   <div className="flex items-center mb-6">
                     <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-4">
                       <FaBox className="text-white" />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-800">Product Approval Overview</h3>
                       <p className="text-gray-600">Product status distribution</p>
                     </div>
                   </div>
                   <ResponsiveContainer width="100%" height={320}>
                     <BarChart
                       data={advancedReports.productStats?.map(stat => ({
                         name: stat._id ? 'Approved' : 'Pending',
                         count: stat.count,
                       })) || []}
                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                     >
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                       <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                       <YAxis stroke="#6b7280" fontSize={12} />
                       <Tooltip
                         contentStyle={{
                           backgroundColor: '#ffffff',
                           border: 'none',
                           borderRadius: '12px',
                           boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                         }}
                         formatter={(value) => [value, 'Count']}
                       />
                       <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                         {advancedReports.productStats?.map((stat, index) => (
                           <Cell key={`cell-${index}`} fill={stat._id ? '#10B981' : '#F59E0B'} />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>

                 {/* Order Status Distribution */}
                 <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                   <div className="flex items-center mb-6">
                     <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                       <FaShoppingCart className="text-white" />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-800">Order Status Overview</h3>
                       <p className="text-gray-600">Order fulfillment status</p>
                     </div>
                   </div>
                   <ResponsiveContainer width="100%" height={320}>
                     <BarChart
                       data={advancedReports.orderStats?.map(stat => ({
                         name: stat._id,
                         count: stat.count,
                       })) || []}
                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                     >
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                       <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                       <YAxis stroke="#6b7280" fontSize={12} />
                       <Tooltip
                         contentStyle={{
                           backgroundColor: '#ffffff',
                           border: 'none',
                           borderRadius: '12px',
                           boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                         }}
                         formatter={(value) => [value, 'Count']}
                       />
                       <Bar dataKey="count" fill="url(#orderGradient)" radius={[8, 8, 0, 0]} />
                       <defs>
                         <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.9}/>
                         </linearGradient>
                       </defs>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               {/* Key Metrics Summary */}
               <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-8 rounded-2xl shadow-xl border border-gray-200">
                 <div className="flex items-center mb-8">
                   <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                     <FaChartBar className="text-white" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold text-gray-800">Key Performance Indicators</h3>
                     <p className="text-gray-600">Overall system metrics</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                     <p className="text-3xl font-bold text-blue-600 mb-2">{overview.totalUsers}</p>
                     <p className="text-gray-600 font-medium">Total Users</p>
                   </div>
                   <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                     <p className="text-3xl font-bold text-green-600 mb-2">{overview.totalProducts}</p>
                     <p className="text-gray-600 font-medium">Total Products</p>
                   </div>
                   <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                     <p className="text-3xl font-bold text-amber-600 mb-2">{overview.totalOrders}</p>
                     <p className="text-gray-600 font-medium">Total Orders</p>
                   </div>
                   <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                     <p className="text-3xl font-bold text-purple-600 mb-2">${overview.totalSales}</p>
                     <p className="text-gray-600 font-medium">Total Sales</p>
                   </div>
                 </div>
               </div>
             </div>
           )}

          {activeTab === 'logs' && (
             <div className="space-y-8">
               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                 <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6">
                   <h2 className="text-2xl font-bold text-white flex items-center">
                     <FaFileAlt className="mr-3" />
                     Activity Logs
                   </h2>
                   <p className="text-indigo-100 mt-1">Recent system activities and user actions</p>
                 </div>
                 <div className="p-8 space-y-8">
                   <div>
                     <div className="flex items-center mb-6">
                       <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                         <FaUsers className="text-white text-sm" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-800">Recent Users</h3>
                     </div>
                     <div className="overflow-x-auto">
                       <table className="min-w-full">
                         <thead>
                           <tr className="border-b border-gray-200">
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Name
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Email
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Role
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Registered
                             </th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           {activityLogs.recentUsers?.map((u) => (
                             <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-200">
                               <td className="px-6 py-5 whitespace-nowrap">
                                 <div className="flex items-center">
                                   <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 text-sm">
                                     {u.name.charAt(0).toUpperCase()}
                                   </div>
                                   <span className="font-medium text-gray-900">{u.name}</span>
                                 </div>
                               </td>
                               <td className="px-6 py-5 whitespace-nowrap text-gray-600">{u.email}</td>
                               <td className="px-6 py-5 whitespace-nowrap">
                                 <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                                   u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                   u.role === 'farmer' ? 'bg-green-100 text-green-800' :
                                   'bg-blue-100 text-blue-800'
                                 }`}>
                                   {u.role}
                                 </span>
                               </td>
                               <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                                 {new Date(u.createdAt).toLocaleDateString()}
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>

                   <div>
                     <div className="flex items-center mb-6">
                       <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                         <FaShoppingCart className="text-white text-sm" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                     </div>
                     <div className="overflow-x-auto">
                       <table className="min-w-full">
                         <thead>
                           <tr className="border-b border-gray-200">
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Buyer
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Total
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Status
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Date
                             </th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           {activityLogs.recentOrders?.map((o) => (
                             <tr key={o._id} className="hover:bg-gray-50 transition-colors duration-200">
                               <td className="px-6 py-5 whitespace-nowrap text-gray-600">{o.buyer?.name || 'Unknown'}</td>
                               <td className="px-6 py-5 whitespace-nowrap">
                                 <span className="font-semibold text-amber-600">${o.totalAmount}</span>
                               </td>
                               <td className="px-6 py-5 whitespace-nowrap">
                                 <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                                   o.status === 'completed' ? 'bg-green-100 text-green-800' :
                                   o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                   o.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                   'bg-blue-100 text-blue-800'
                                 }`}>
                                   {o.status}
                                 </span>
                               </td>
                               <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                                 {new Date(o.createdAt).toLocaleDateString()}
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>

                   <div>
                     <div className="flex items-center mb-6">
                       <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                         <FaBox className="text-white text-sm" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-800">Recent Products</h3>
                     </div>
                     <div className="overflow-x-auto">
                       <table className="min-w-full">
                         <thead>
                           <tr className="border-b border-gray-200">
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Name
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Farmer
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Price
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Status
                             </th>
                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                               Date
                             </th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           {activityLogs.recentProducts?.map((p) => (
                             <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-200">
                               <td className="px-6 py-5 whitespace-nowrap">
                                 <div className="flex items-center">
                                   <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 text-sm">
                                     {p.name.charAt(0).toUpperCase()}
                                   </div>
                                   <span className="font-medium text-gray-900">{p.name}</span>
                                 </div>
                               </td>
                               <td className="px-6 py-5 whitespace-nowrap text-gray-600">{p.farmer?.name || 'Unknown'}</td>
                               <td className="px-6 py-5 whitespace-nowrap">
                                 <span className="font-semibold text-green-600">${p.price}</span>
                               </td>
                               <td className="px-6 py-5 whitespace-nowrap">
                                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                   p.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                 }`}>
                                   {p.isApproved ? 'Approved' : 'Pending'}
                                 </span>
                               </td>
                               <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                                 {new Date(p.createdAt).toLocaleDateString()}
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

        </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
