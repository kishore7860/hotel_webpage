import { createContext, useContext, useState } from 'react';
import { DELIVERY_TYPES } from '../utils/constants';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [deliveryType, setDeliveryType] = useState(DELIVERY_TYPES.PICKUP);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    table_number: ''
  });
  const [currentOrder, setCurrentOrder] = useState(null);

  const resetOrder = () => {
    setDeliveryType(DELIVERY_TYPES.PICKUP);
    setCustomerInfo({ name: '', phone: '', table_number: '' });
    setCurrentOrder(null);
  };

  const value = {
    deliveryType,
    setDeliveryType,
    customerInfo,
    setCustomerInfo,
    currentOrder,
    setCurrentOrder,
    resetOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
