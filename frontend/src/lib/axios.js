import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Request interceptor to add token to headers
api.interceptors.request.use(config => {
  const token = getTokenFromCookies();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to get token from cookies
const getTokenFromCookies = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
};

export default api;