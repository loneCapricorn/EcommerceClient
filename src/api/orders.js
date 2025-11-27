import api from './client.js';

export async function createOrder(items) {
  // items: [{ productId, quantity }]
  const payload = { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) };
  const { data } = await api.post('/orders', payload);
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get('/orders/my');
  return data;
}