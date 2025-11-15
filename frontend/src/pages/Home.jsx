import { useState } from 'react';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';

const Home = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to AgriSmart
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Connecting farmers directly with buyers for fresh, local produce
        </p>
        <button
          onClick={() => setCartOpen(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          View Cart
        </button>
      </div>

      <ProductList />

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Home;
