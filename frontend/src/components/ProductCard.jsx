import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">🛒</div>
            <div>No Image</div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold">
            KES {product.price} per {product.unit}
          </span>
          <span className="text-sm text-gray-500">
            {product.quantity} {product.unit} available
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Category:</span> {product.category}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Location:</span> {product.location}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Farmer:</span> {product.farmer.name}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
