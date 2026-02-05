import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';

export function MenuItemCard({ item }) {
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
    addToast(`${item.name} added to cart`, 'success');
  };

  return (
    <Link to={`/menu/${item.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow group">
        <div className="relative">
          <div className="h-40 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center overflow-hidden">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <span className="text-5xl">
                {item.is_vegetarian ? '🥗' : '🍗'}
              </span>
            )}
          </div>
          {Boolean(item.is_featured) && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
              Popular
            </span>
          )}
          {Boolean(item.is_vegetarian) && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</span>
            <Button size="sm" onClick={handleAddToCart}>Add</Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
