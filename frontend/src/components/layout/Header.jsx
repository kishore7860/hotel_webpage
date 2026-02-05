import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { RESTAURANT_INFO } from '../../utils/constants';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-2xl">🍗</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{RESTAURANT_INFO.name}</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/menu" className="text-gray-700 hover:text-red-600 font-medium">Menu</Link>
            {isAuthenticated && (
              <Link to="/rewards" className="text-gray-700 hover:text-red-600 font-medium">Rewards</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/rewards" className="hidden sm:flex items-center gap-1 text-yellow-600 font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{user?.reward_points || 0} pts</span>
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-red-600">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Login
              </Link>
            )}

            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
