import api from './client.js';

export async function getCategories() {
  const { data } = await api.get('/categories');
  return data;
}