const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || (data.errors && data.errors.join(', ')) || `Error: ${res.status} ${res.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API request error on [${config.method || 'GET'} ${url}]:`, error.message);
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  // Auth Helpers
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  getMe: () => request('/auth/me', { method: 'GET' }),

  // Products Helpers
  getProducts: (params = '') => request(`/products${params ? `?${params}` : ''}`, { method: 'GET' }),
  getProductById: (id) => request(`/products/${id}`, { method: 'GET' }),
  getCategories: () => request('/products/categories', { method: 'GET' }),

  // Orders Helpers
  createOrder: (orderData, options = {}) => request('/orders', { method: 'POST', body: orderData, ...options }),
  getMyOrders: () => request('/orders/my-orders', { method: 'GET' }),
  getOrderById: (id) => request(`/orders/${id}`, { method: 'GET' }),
};

export default api;

