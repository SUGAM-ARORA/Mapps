import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_IP = '192.168.29.253';
const API_BASE_URL = `http://${DEV_IP}:4000/api`;

console.log('Ì≥° API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Ì∫Ä API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('‚ùå Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('‚úÖ API Success:', response.config.url, response.status);
    // Don't modify the response data here - let each endpoint handle it
    return response;
  },
  async (error) => {
    console.error('‚ùå API Error:', error.config?.url, error.response?.status);
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
