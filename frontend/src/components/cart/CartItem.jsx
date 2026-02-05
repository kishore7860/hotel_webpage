import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from './QuantitySelector';

export function CartItem({ item }) {
  const { updateQuantity, removeItem, updateInstructions } = useCart();

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">🍗</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-lg font-semibold text-gray-900 mt-1">
          {formatPrice(item.price * item.quantity)}
        </p>

        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(qty) => updateQuantity(item.id, qty)}
          />
          <span className="text-sm text-gray-500">
            {formatPrice(item.price)} each
          </span>
        </div>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Special instructions..."
            value={item.special_instructions || ''}
            onChange={(e) => updateInstructions(item.id, e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
}
