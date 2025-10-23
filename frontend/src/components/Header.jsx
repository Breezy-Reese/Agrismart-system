import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          AgriSmart
        </Link>

        <nav className="flex items-center space-x-4">
          {user?.role !== 'admin' && (
            <Link to="/" className="hover:text-green-200">
              Home
            </Link>
          )}

          {user ? (
            <>
              {user.role !== 'admin' && (
                <Link to="/profile" className="hover:text-green-200">
                  Profile
                </Link>
              )}
              {user.role === 'farmer' && (
                <Link to="/profile" className="hover:text-green-200">
                  My Products
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-green-200">
                  Admin
                </Link>
              )}
              <span className="text-green-200">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-green-200">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
