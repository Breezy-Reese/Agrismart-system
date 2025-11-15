import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    // In a real app, you'd have a messaging API
    alert(`Message sent to ${product.farmer.name}: ${message}`);
    setMessage('');
  };

  if (loading) {
    return <div className="text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400">No Image Available</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 2}`}
                  className="w-full h-20 object-cover rounded cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-4">
            <span className="text-2xl font-bold text-green-600">
              KES {product.price} per {product.unit}
            </span>
          </div>

          <div className="mb-4">
            <span className="font-semibold">Available Quantity:</span> {product.quantity} {product.unit}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Category:</span> {product.category}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Location:</span> {product.location}
          </div>

          <div className="mb-6">
            <span className="font-semibold">Farmer:</span> {product.farmer.name}
            {product.farmer.phone && (
              <span className="ml-2">({product.farmer.phone})</span>
            )}
          </div>

          {user && user.role === 'buyer' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 mr-4"
              />
              <button
                onClick={addToCart}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          )}

          {user && user.role === 'buyer' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Contact Farmer</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message to the farmer..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 mb-4"
                rows="4"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          )}

          {user && user.role === 'farmer' && user._id === product.farmer._id && (
            <div className="border-t pt-6">
              <p className="text-gray-600">This is your product. You can manage it from your profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
