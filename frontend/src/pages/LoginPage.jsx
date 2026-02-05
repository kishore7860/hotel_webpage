import { LoginForm } from '../components/auth/LoginForm';
import { RESTAURANT_INFO } from '../utils/constants';

export function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SC</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600">Sign in to {RESTAURANT_INFO.name}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Demo: test@example.com / password123
        </p>
      </div>
    </div>
  );
}
