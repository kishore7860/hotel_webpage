import { useEffect } from 'react';
import { Input } from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { DELIVERY_TYPES } from '../../utils/constants';

export function UserInfoForm({ errors = {} }) {
  const { user, isAuthenticated } = useAuth();
  const { deliveryType, customerInfo, setCustomerInfo } = useOrder();

  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [isAuthenticated, user, setCustomerInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={customerInfo.name}
        onChange={handleChange}
        placeholder="Enter your name"
        error={errors.name}
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={customerInfo.phone}
        onChange={handleChange}
        placeholder="Enter 10-digit phone number"
        error={errors.phone}
        required
      />

      {deliveryType === DELIVERY_TYPES.CARRYOUT && (
        <Input
          label="Table Number"
          name="table_number"
          value={customerInfo.table_number}
          onChange={handleChange}
          placeholder="Enter your table number"
          error={errors.table_number}
          required
        />
      )}
    </div>
  );
}
