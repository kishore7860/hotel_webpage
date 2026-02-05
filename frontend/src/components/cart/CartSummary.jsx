import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';

export function CartSummary() {
  const { subtotal, discountAmount, tax, total } = useCart();

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-{formatPrice(discountAmount)}</span>
        </div>
      )}

      <div className="flex justify-between text-gray-600">
        <span>Tax (8%)</span>
        <span>{formatPrice(tax)}</span>
      </div>

      <div className="border-t pt-3 flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
