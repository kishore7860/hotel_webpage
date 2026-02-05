import { useState } from 'react';

export function PaymentSection({ onPaymentMethodChange }) {
  const [method, setMethod] = useState('card');

  const handleChange = (newMethod) => {
    setMethod(newMethod);
    onPaymentMethodChange?.(newMethod);
  };

  const methods = [
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'cod', label: 'Cash', icon: '💵' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Payment Method</h3>
      <div className="grid grid-cols-3 gap-3">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => handleChange(m.id)}
            className={`p-3 border-2 rounded-lg text-center transition-all
              ${method === m.id
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <span className="text-2xl mb-1 block">{m.icon}</span>
            <span className="text-sm font-medium">{m.label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">
        Payment will be processed securely
      </p>
    </div>
  );
}
