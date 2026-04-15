import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { OrderConfirmation } from '../components/order/OrderConfirmation';
import { LoadingScreen } from '../components/common/Spinner';

const TERMINAL_STATUSES = ['completed', 'cancelled'];
const POLL_INTERVAL_MS = 15000; // poll every 15 seconds

export function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderByNumber(orderNumber);
      setOrder(data);

      // Stop polling once order reaches a terminal state
      if (TERMINAL_STATUSES.includes(data.status)) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      setError('Order not found');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Start polling for live status updates
    intervalRef.current = setInterval(fetchOrder, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderNumber]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{error}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <OrderConfirmation order={order} />
    </div>
  );
}
