import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const getCsrfToken = async () => {
//   try {
//     const response = await axiosInstance.get('/auth/get-csrf/');
//     const token = response.data.csrftoken;
//     return token ? token : '';
//   } catch (error) {
//     return '';
//   }
// };

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInstance.interceptors.request.use(
//   async config => {
//     if (config.method !== 'get') {
//       const csrfToken = await getCsrfToken();
//       console.log(csrfToken);
//       if (csrfToken) {
//         config.headers['X-CSRFToken'] = csrfToken;
//       }
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh/');
    const token = response.data.access;
    await AsyncStorage.setItem('access', token);
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;
