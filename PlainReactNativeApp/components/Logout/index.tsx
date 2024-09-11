import React from 'react';
import {Alert} from 'react-native';
import Box from '@/components/Box';
import {useAuth} from '@/context/AuthContext';
import {CircleX} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';

const Logout = () => {
  const {logout} = useAuth();
  const {t} = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert(t('Błąd'), t('Wystąpił błąd podczas wylogowywania'));
    }
  };

  return (
    <Box
      nav={handleLogout}
      text={t('Wyloguj się')}
      icon={
        <CircleX size={36} onPress={handleLogout} className="text-darkPurple" />
      }
    />
  );
};

export default Logout;
