import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/api/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'products') {
        const res = await api.get('/api/admin/products');
        setProducts(res.data);
      } else if (activeTab === 'orders') {
        const res = await api.get('/api/admin/orders');
        setOrders(res.data);
      } else if (activeTab === 'reports') {
        const [salesRes, userRes] = await Promise.all([
          api.get('/api/admin/reports/sales'),
          api.get('/api/admin/reports/users'),
        ]);
        setReports({
          sales: salesRes.data,
          users: userRes.data,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const approveProduct = async (productId) => {
    try {
      await api.put(`/api/products/${productId}/approve`);
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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-6">
        <nav className="flex space-x-4 border-b">
          {['users', 'products', 'orders', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{u.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="text-red-600 hover:text-red-900"
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
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Products</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{p.farmer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${p.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {p.isApproved ? 'Approved' : 'Pending'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!p.isApproved && (
                            <button
                              onClick={() => approveProduct(p._id)}
                              className="text-green-600 hover:text-green-900 mr-2"
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
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((o) => (
                      <tr key={o._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{o._id.slice(-8)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{o.buyer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${o.totalAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{o.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Sales Report</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${reports.sales?.totalSales || 0}
                  </p>
                  <p className="text-gray-600">
                    Total sales from {reports.sales?.totalOrders || 0} orders
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
                  {reports.users?.map((userType) => (
                    <div key={userType._id} className="flex justify-between mb-2">
                      <span className="capitalize">{userType._id}</span>
                      <span className="font-semibold">{userType.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
