import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Image } from 'react-native';
import { styled } from 'nativewind';
import LogoImage from '@/components/LogoImage/LogoImage';
import DashboardElements from '@/components/DashboardElements/DashboardElements';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const StyledSafeAreaView = styled(SafeAreaView);

const DashboardScreen = () => {
  const { checkAuth } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        navigation.navigate('login');
      }
    };

    verifyAuth();
  }, []);

  return (
    <StyledSafeAreaView className="flex-1 bg-lightGray">
      <LogoImage classes="mb-12" size={1} />
      <DashboardElements />
    </StyledSafeAreaView>
  );
};

export default DashboardScreen;
