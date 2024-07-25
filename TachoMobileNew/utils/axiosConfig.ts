import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://tacho.internetstars.pl/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
