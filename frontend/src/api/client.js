import axios from 'axios';

// Use the same host as the frontend.
// Vite will proxy /api requests to the backend running on port 5000.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the admin's JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If the token is invalid/expired, bounce back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_email');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;