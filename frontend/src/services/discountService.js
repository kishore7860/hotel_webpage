import api from './api';

export const discountService = {
  async validateCode(code, subtotal) {
    const response = await api.post('/discounts/validate', { code, subtotal });
    return response.data.data.discount;
  }
};
