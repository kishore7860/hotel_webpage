import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { DeliveryOptions } from '../components/checkout/DeliveryOptions';
import { UserInfoForm } from '../components/checkout/UserInfoForm';
import { PaymentSection } from '../components/checkout/PaymentSection';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { DELIVERY_TYPES } from '../utils/constants';
import { formatPrice } from '../utils/formatCurrency';
import { validateRequired, validatePhone } from '../utils/validators';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, discount, pointsToRedeem, clearCart } = useCart();
  const { deliveryType, customerInfo, setCurrentOrder } = useOrder();
  const { updateUser, user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <Link to="/menu" className="text-red-600 hover:text-red-700">
          Browse Menu
        </Link>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(customerInfo.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validatePhone(customerInfo.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (deliveryType === DELIVERY_TYPES.CARRYOUT && !validateRequired(customerInfo.table_number)) {
      newErrors.table_number = 'Table number is required for carryout';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          special_instructions: item.special_instructions
        })),
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        table_number: customerInfo.table_number,
        delivery_type: deliveryType,
        discount_code: discount?.code,
        points_to_redeem: pointsToRedeem
      };

      const order = await orderService.createOrder(orderData);
      setCurrentOrder(order);
      clearCart();

      if (user && order.points_earned) {
        updateUser({ ...user, reward_points: (user.reward_points || 0) + order.points_earned - pointsToRedeem });
      }

      addToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${order.order_number}`);
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        to="/cart"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Type</h2>
            <DeliveryOptions />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>
            <UserInfoForm errors={errors} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <PaymentSection />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.name}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <CartSummary />

          <Button
            fullWidth
            size="lg"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
