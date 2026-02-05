export function RewardsHistory({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map(transaction => (
        <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
          <div>
            <div className="font-medium text-gray-900">{transaction.description}</div>
            <div className="text-sm text-gray-500">
              {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
          <div className={`font-semibold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.points > 0 ? '+' : ''}{transaction.points} pts
          </div>
        </div>
      ))}
    </div>
  );
}
