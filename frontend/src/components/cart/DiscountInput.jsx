import { useState } from 'react';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { discountService } from '../../services/discountService';
import { useToast } from '../common/Toast';

export function DiscountInput() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { discount, subtotal, setDiscount, clearDiscount } = useCart();
  const { addToast } = useToast();

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const discountData = await discountService.validateCode(code.toUpperCase(), subtotal);
      setDiscount(discountData);
      addToast('Discount applied!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Invalid discount code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    clearDiscount();
    setCode('');
    addToast('Discount removed', 'info');
  };

  if (discount) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div>
          <span className="font-medium text-green-700">{discount.code}</span>
          <span className="text-sm text-green-600 ml-2">
            {discount.type === 'percentage' ? `${discount.value}% off` : `₹${discount.value} off`}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="text-green-600 hover:text-green-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Enter discount code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <Button variant="outline" onClick={handleApply} disabled={loading || !code.trim()}>
        {loading ? '...' : 'Apply'}
      </Button>
    </div>
  );
}
