import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.153:5000', // Set your base URL
  timeout: 10000, // You can set a timeout for requests
});

// Add a request interceptor to automatically attach the JWT token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error, e.g., redirect to login page
      console.error('Unauthorized, redirecting to login');
      // Optionally clear token and redirect
      AsyncStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
