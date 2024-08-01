import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '@/utils/axiosConfig';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

interface AuthContextProps {
  user: any;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login/', {
        username,
        password,
      });
      const token = response.data.access;
      await AsyncStorage.setItem('access', token);
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
      setUser(jwtDecode(token));
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      if (token) {
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`;
        await axiosInstance.post('/auth/verify/');
        setUser(jwtDecode(token));
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, login, logout, checkAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export {AuthProvider, useAuth};
