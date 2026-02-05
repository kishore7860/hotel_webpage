import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    return response.data.data.user;
  }
};
