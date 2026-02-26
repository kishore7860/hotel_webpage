import api from './api';

export const paymentService = {
  async processPayment({ amount, payment_method, order_number }) {
    const response = await api.post('/payments/process', { amount, payment_method, order_number });
    return response.data.data;
  },

  async confirmOrderPayment(orderNumber, { payment_id, payment_method }) {
    const response = await api.post(`/orders/${orderNumber}/confirm-payment`, { payment_id, payment_method });
    return response.data.data;
  }
};
