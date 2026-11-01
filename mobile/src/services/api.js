
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Ganti alamat ini setelah kita memastikan alamat backend
const BASE_URL = 'http://192.168.1.9:5001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mengambil JWT dan mengirimkannya pada request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
