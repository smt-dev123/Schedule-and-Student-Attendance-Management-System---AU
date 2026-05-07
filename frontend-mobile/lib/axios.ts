import axios from 'axios';
import Constants from 'expo-constants';

// Use the API URL from environment variables or a default value
const baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for tokens if not using cookies
api.interceptors.request.use(async (config) => {
  // You can add logic here to inject tokens from storage if needed
  return config;
});

export default api;
