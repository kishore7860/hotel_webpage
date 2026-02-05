import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data.data.order;
  },

  async getOrderByNumber(orderNumber) {
    const response = await api.get(`/orders/${orderNumber}`);
    return response.data.data.order;
  },

  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data.data.orders;
  }
};
