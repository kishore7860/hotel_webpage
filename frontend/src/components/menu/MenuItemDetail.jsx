import { useState } from 'react';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';

export function MenuItemDetail({ item }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity
    });
    addToast(`${quantity} x ${item.name} added to cart`, 'success');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-64 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-8xl">{item.is_vegetarian ? '🥗' : '🍗'}</span>
        )}
        {Boolean(item.is_featured) && (
          <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <span className="text-sm text-gray-500">{item.category_name}</span>
          </div>
          <div className="flex gap-2">
            {Boolean(item.is_vegetarian) && (
              <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                <span className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
                Veg
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-6">{item.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.prep_time_minutes} mins
          </span>
          {item.spice_level > 0 && (
            <span className="flex items-center gap-1">
              {'🌶️'.repeat(item.spice_level)}
            </span>
          )}
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(item.price)}</span>
            <div className="flex items-center gap-3 border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-xl font-medium hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-xl font-medium hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <Button fullWidth size="lg" onClick={handleAddToCart}>
            Add to Cart - {formatPrice(item.price * quantity)}
          </Button>
        </div>
      </div>
    </div>
  );
}
