import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-800 hover:bg-gray-200'}`;

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold">ECommerce</Link>
            <div className="flex gap-2">
              <NavLink to="/" className={linkClass} end>
                Home
              </NavLink>
              <NavLink to="/products" className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/categories" className={linkClass}>
                Categories
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                Orders
              </NavLink>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/cart" className={linkClass}>
              Cart ({totalQuantity})
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}