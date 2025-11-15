import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import AuthForm from './components/AuthForm';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.role !== 'admin' && <Header />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
