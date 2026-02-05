import api from './api';

export const rewardsService = {
  async getBalance() {
    const response = await api.get('/rewards/balance');
    return response.data.data;
  },

  async getHistory() {
    const response = await api.get('/rewards/history');
    return response.data.data.transactions;
  },

  async redeemPoints(points) {
    const response = await api.post('/rewards/redeem', { points });
    return response.data.data;
  }
};
