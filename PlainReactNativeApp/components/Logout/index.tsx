import React from 'react';
import {Alert} from 'react-native';
import Button from '@/components/Button';
import {useAuth} from '@/context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const Logout = () => {
  const {logout} = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('login');
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił błąd podczas wylogowywania');
    }
  };

  return (
    <Button
      onPress={handleLogout}
      className="rounded-lg bg-darkBlue p-2"
      text="Wyloguj się"
    />
  );
};

export default Logout;
