import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { DiscountInput } from '../components/cart/DiscountInput';
import { PointsRedemption } from '../components/cart/PointsRedemption';
import { Button } from '../components/common/Button';

export function CartPage() {
  const { items, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious items from our menu</p>
        <Link to="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Your Cart ({itemCount} items)
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Discount Code</h3>
            <DiscountInput />
          </div>

          <PointsRedemption />

          <CartSummary />

          <Link to="/checkout">
            <Button fullWidth size="lg">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
