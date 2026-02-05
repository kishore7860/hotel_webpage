import api from './api';

export const menuService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data.data.categories;
  },

  async getAllItems() {
    const response = await api.get('/menu');
    return response.data.data.items;
  },

  async getFeaturedItems() {
    const response = await api.get('/menu/featured');
    return response.data.data.items;
  },

  async getItemsByCategory(categoryId) {
    const response = await api.get(`/menu/category/${categoryId}`);
    return response.data.data;
  },

  async getItemById(itemId) {
    const response = await api.get(`/menu/${itemId}`);
    return response.data.data.item;
  }
};
