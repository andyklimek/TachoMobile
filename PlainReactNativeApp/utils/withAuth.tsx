import React, {useEffect, useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import LoadingScreen from '@/app/LoadingScreen';

const withAuth = WrappedComponent => {
  return props => {
    const [checking, setChecking] = useState(false);
    const {user, checkAuth} = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
      const verifyAuth = async () => {
        setChecking(true);
        try {
          await checkAuth();
        } catch (error) {
          navigation.navigate('login');
        } finally {
          setChecking(false);
        }
      };

      verifyAuth();
    }, []);

    if (checking) {
      return <LoadingScreen />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
