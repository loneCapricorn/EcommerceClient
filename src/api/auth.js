import api from './client.js';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  // API returns { token }
  return data.token;
}

export async function register(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data; // message string
}