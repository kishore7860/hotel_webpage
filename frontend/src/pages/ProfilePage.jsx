import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { PointsBalance } from '../components/rewards/PointsBalance';
import { OrderHistory } from '../components/order/OrderHistory';
import { Button } from '../components/common/Button';
import { LoadingScreen } from '../components/common/Spinner';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {user?.phone && (
              <p className="text-sm text-gray-600 mb-4">
                Phone: {user.phone}
              </p>
            )}

            <p className="text-sm text-gray-600 mb-4">
              Total Orders: {user?.total_orders || 0}
            </p>

            <Button variant="secondary" fullWidth onClick={logout}>
              Logout
            </Button>
          </div>

          <PointsBalance points={user?.reward_points || 0} />

          <Link to="/rewards">
            <Button variant="outline" fullWidth>
              View Rewards
            </Button>
          </Link>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
            <OrderHistory orders={orders} />
          </div>
        </div>
      </div>
    </div>
  );
}
