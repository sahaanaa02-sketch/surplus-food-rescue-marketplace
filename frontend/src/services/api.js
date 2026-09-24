import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Backend FastAPI URL
});

// Request interceptor to automatically add JWT Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;