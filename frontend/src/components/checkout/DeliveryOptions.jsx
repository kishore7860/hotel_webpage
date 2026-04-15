import { useOrder } from '../../context/OrderContext';
import { DELIVERY_TYPES } from '../../utils/constants';

export function DeliveryOptions() {
  const { deliveryType, setDeliveryType } = useOrder();

  const options = [
    {
      type: DELIVERY_TYPES.PICKUP,
      label: 'Pickup',
      description: 'Pick up from counter',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      type: DELIVERY_TYPES.CARRYOUT,
      label: 'Dine-In',
      description: 'Served to your table',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map(option => (
        <button
          key={option.type}
          onClick={() => setDeliveryType(option.type)}
          className={`p-4 border-2 rounded-xl text-left transition-all
            ${deliveryType === option.type
              ? 'border-red-600 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <div className={`mb-2 ${deliveryType === option.type ? 'text-red-600' : 'text-gray-500'}`}>
            {option.icon}
          </div>
          <h3 className="font-semibold text-gray-900">{option.label}</h3>
          <p className="text-sm text-gray-500">{option.description}</p>
        </button>
      ))}
    </div>
  );
}
