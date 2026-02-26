import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatCurrency';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-800' },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-800' },
  preparing:  { label: 'Preparing',  color: 'bg-orange-100 text-orange-800' },
  ready:      { label: 'Ready',      color: 'bg-green-100 text-green-800' },
  completed:  { label: 'Completed',  color: 'bg-gray-100 text-gray-700' },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-700' }
};

export function OrderConfirmation({ order }) {
  const estimatedTime = order.estimated_ready_time
    ? new Date(order.estimated_ready_time).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const statusCfg = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-600 mb-6">Thank you for your order</p>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="text-sm text-gray-500 mb-1">Order Number</div>
        <div className="text-xl font-bold text-gray-900 mb-4">{order.order_number}</div>

        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">Order Status</div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>

        {estimatedTime && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Estimated Ready Time</div>
            <div className="text-lg font-semibold text-red-600">{estimatedTime}</div>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span>{formatPrice(order.tax_amount)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total Paid</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        {order.points_earned > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-700 font-medium">
              +{order.points_earned} reward points earned!
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Link to="/menu">
          <Button fullWidth>Order More</Button>
        </Link>
        <Link to="/">
          <Button fullWidth variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
