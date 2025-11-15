import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    unit: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'farmer' && activeTab === 'products') {
        fetchMyProducts();
      } else if (user.role === 'buyer' && activeTab === 'orders') {
        fetchMyOrders();
      }
    }
  }, [user, activeTab]);

  const fetchMyProducts = async () => {
    try {
      // In a real app, you'd have an endpoint to get farmer's products
      // For now, we'll simulate
      setProducts([]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach(key => {
        formData.append(key, newProduct[key]);
      });

      // Add images if any
      // const images = e.target.images.files;
      // for (let i = 0; i < images.length; i++) {
      //   formData.append('images', images[i]);
      // }

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Product added successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
        unit: '',
        location: '',
      });
      fetchMyProducts();
    } catch (error) {
      alert('Error adding product: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  if (!user) {
    return <div className="text-center">Please login to view your profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="mb-6">
        <nav className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-4 ${
              activeTab === 'profile'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500'
            }`}
          >
            Profile Info
          </button>
          {user.role === 'farmer' && (
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-4 ${
                activeTab === 'products'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500'
              }`}
            >
              My Products
            </button>
          )}
          {user.role === 'buyer' && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 ${
                activeTab === 'orders'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500'
              }`}
            >
              My Orders
            </button>
          )}
        </nav>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-lg">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-lg capitalize">{user.role}</p>
            </div>
            {user.role === 'farmer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-lg">{user.location}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-lg">{user.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && user.role === 'farmer' && (
        <div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleProductSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Unit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    required
                  >
                    <option value="">Select Unit</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="lb">Pound (lb)</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                    <option value="liter">Liter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  rows="3"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">My Products</h2>
            {products.length === 0 ? (
              <p className="text-gray-500">No products added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="border rounded p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-green-600 font-bold">${product.price} per {product.unit}</p>
                    <p>Quantity: {product.quantity}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-600 hover:text-red-700 mr-2"
                      >
                        Delete
                      </button>
                      <button className="text-blue-600 hover:text-blue-700">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && user.role === 'buyer' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">Order #{order._id.slice(-8)}</span>
                    <span className={`px-2 py-1 rounded text-sm capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Total: ${order.totalAmount} | Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <div className="space-y-1">
                    {order.products.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {item.product.name} - {item.quantity} x ${item.price}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
