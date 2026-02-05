import { formatPrice } from '../../utils/formatCurrency';

export function OrderHistory({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-medium text-gray-900">{order.order_number}</span>
          <span className="text-sm text-gray-500 ml-2">
            {new Date(order.created_at).toLocaleDateString('en-IN')}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        {order.items?.map((item, i) => (
          <span key={i}>
            {i > 0 && ', '}
            {item.quantity}x {item.item_name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-sm text-gray-500">{order.delivery_type}</span>
        <span className="font-semibold">{formatPrice(order.total_amount)}</span>
      </div>
    </div>
  );
}
