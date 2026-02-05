import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RewardsBanner() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium">Earn reward points with every order!</span>
        </div>
        <Link
          to="/register"
          className="bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-orange-50 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
