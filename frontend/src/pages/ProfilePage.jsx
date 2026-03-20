import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { PointsBalance } from '../components/rewards/PointsBalance';
import { OrderHistory } from '../components/order/OrderHistory';
import { Button } from '../components/common/Button';
import { LoadingScreen } from '../components/common/Spinner';

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

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

  const handleEditStart = () => {
    setEditForm({ name: user?.name || '', phone: user?.phone || '' });
    setEditError('');
    setEditing(true);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditError('');
  };

  const handleEditSave = async () => {
    if (!editForm.name.trim()) {
      setEditError('Name is required');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const updatedUser = await authService.updateProfile({
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || null
      });
      updateUser(updatedUser);
      setEditing(false);
    } catch (error) {
      setEditError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

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

            {editing ? (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                {editError && <p className="text-xs text-red-600">{editError}</p>}
                <div className="flex gap-2">
                  <Button fullWidth onClick={handleEditSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="secondary" fullWidth onClick={handleEditCancel} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {user?.phone && (
                  <p className="text-sm text-gray-600 mb-2">
                    Phone: {user.phone}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  Total Orders: {user?.total_orders || 0}
                </p>
                <Button variant="outline" fullWidth onClick={handleEditStart} className="mb-2">
                  Edit Profile
                </Button>
              </>
            )}

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
