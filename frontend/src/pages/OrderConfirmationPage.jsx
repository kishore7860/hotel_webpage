import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { OrderConfirmation } from '../components/order/OrderConfirmation';
import { LoadingScreen } from '../components/common/Spinner';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderByNumber(orderNumber);
        setOrder(data);
      } catch (err) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
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
