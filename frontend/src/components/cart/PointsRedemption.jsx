import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function PointsRedemption() {
  const { user, isAuthenticated } = useAuth();
  const { pointsToRedeem, setPointsToRedeem } = useCart();

  if (!isAuthenticated || !user?.reward_points) {
    return null;
  }

  const maxPoints = Math.floor(user.reward_points / 100) * 100;
  const pointsValue = Math.floor(pointsToRedeem / 10);

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const roundedValue = Math.floor(value / 100) * 100;
    setPointsToRedeem(Math.min(roundedValue, maxPoints));
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-yellow-800">Use Reward Points</span>
        <span className="text-sm text-yellow-700">
          Available: {user.reward_points} pts
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max={maxPoints}
          step="100"
          value={pointsToRedeem}
          onChange={handleChange}
          className="flex-1 h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm font-medium text-yellow-800 min-w-[80px] text-right">
          {pointsToRedeem} pts
        </span>
      </div>

      {pointsToRedeem > 0 && (
        <p className="text-sm text-yellow-700 mt-2">
          Redeeming {pointsToRedeem} points = ₹{pointsValue} discount
        </p>
      )}

      <p className="text-xs text-yellow-600 mt-2">
        100 points = ₹10 discount
      </p>
    </div>
  );
}
