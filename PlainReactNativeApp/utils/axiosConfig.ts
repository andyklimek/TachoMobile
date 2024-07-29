// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const axiosInstance = axios.create({
//   baseURL: 'https://tacho.internetstars.pl/api/v1',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 100000,
// });

// export default axiosInstance;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: 'https://tacho.internetstars.pl/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 100000,
});

const refreshToken = async () => {
  const response = await axiosInstance.post('/auth/refresh/');
  const {access} = response.data;

  await AsyncStorage.setItem('access', access);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

  return access;
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        await AsyncStorage.removeItem('access');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
