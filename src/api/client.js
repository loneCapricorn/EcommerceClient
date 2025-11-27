import axios from 'axios';

function resolveBaseUrl() {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5252';
  // If it already ends with /api or contains /api path, keep it. Otherwise append /api
  try {
    const url = new URL(raw);
    return url.pathname.includes('/api') ? raw : `${raw.replace(/\/?$/, '')}/api`;
  } catch {
    // Not a URL, return as-is
    return raw;
  }
}

const api = axios.create({ baseURL: resolveBaseUrl() });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;