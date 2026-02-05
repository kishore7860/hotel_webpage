import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rewardsService } from '../services/rewardsService';
import { PointsBalance } from '../components/rewards/PointsBalance';
import { RewardsHistory } from '../components/rewards/RewardsHistory';
import { LoadingScreen } from '../components/common/Spinner';

export function RewardsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await rewardsService.getHistory();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching rewards history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rewards</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <PointsBalance points={user?.reward_points || 0} />

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Earn Points</p>
                  <p>Get 1 point for every ₹10 you spend</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Collect Points</p>
                  <p>Points are credited after order confirmation</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Redeem</p>
                  <p>100 points = ₹10 discount on your order</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>
            <RewardsHistory transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
