export function PointsBalance({ points }) {
  const equivalentValue = Math.floor(points / 10);

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-medium opacity-90">Reward Points</span>
      </div>
      <div className="text-4xl font-bold mb-1">{points.toLocaleString()}</div>
      <div className="text-sm opacity-90">
        Worth ₹{equivalentValue} in discounts
      </div>
    </div>
  );
}
